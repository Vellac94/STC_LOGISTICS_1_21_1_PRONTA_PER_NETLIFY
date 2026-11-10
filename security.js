"use strict";
/*
  STC 1.2 OFFLINE VAULT. All business data is encrypted at rest on THIS browser
  using an AES-256-GCM data key, wrapped by each authorized user's PBKDF2 password key.
  Roles are only client-side UI checks. There is no enterprise/server authorization.
  This should NOT be portrayed as secure multiuser server authentication.
*/
let vaultEnabled=false, vaultMeta=null, vaultRawKey=null, vaultInMemoryKey=null, activeUser=null;
let idleLockTimer=null;const IDLE_LOCK_MS=30*60*1000;
// Sessione rapida SOLO per questa scheda/browser: non sincronizza credenziali o dati.
// Il token temporaneo è in sessionStorage; in IndexedDB rimane SOLO la chiave
// di archivio cifrata con AES-GCM, senza password. Scadenza: 30 minuti senza attività.
const STC_SESSION_KEY='stc-ephemeral-tab-v1';
const STC_SESSION_PREFIX='stc-ephemeral-key-v1-';
let sessionWriteBusy=false, sessionWritePending=false, sessionActivityWrittenAt=0;
function stcSessionRead(){try{let s=JSON.parse(sessionStorage.getItem(STC_SESSION_KEY)||'null');return s&&typeof s==='object'?s:null}catch(_){return null}}
function stcSessionDrop(){let s=stcSessionRead();try{sessionStorage.removeItem(STC_SESSION_KEY)}catch(_){}if(s?.sid&&db)idbDelete(STC_SESSION_PREFIX+s.sid).catch(()=>{});sessionActivityWrittenAt=0}
function stcSessionValid(s){return !!(s&&typeof s.sid==='string'&&typeof s.secret==='string'&&Number.isFinite(s.activity)&&s.activity<=Date.now()+60000&&Date.now()-s.activity<IDLE_LOCK_MS)}
function stcSessionTouch(){
 if(!activeUser)return;
 let s=stcSessionRead();if(!stcSessionValid(s)){if(s)stcSessionDrop();return}
 const now=Date.now();if(now-sessionActivityWrittenAt<12000)return;
 s.activity=now;try{sessionStorage.setItem(STC_SESSION_KEY,JSON.stringify(s));sessionActivityWrittenAt=now}catch(_){}
}
async function stcSessionStart(){
 if(!activeUser||!vaultRawKey||!vaultMeta||!db)return;
 // Un nuovo accesso sostituisce l'eventuale token del login precedente.
 stcSessionDrop();
 try{
  const secret=randomBytes(32),sid=crypto.randomUUID(),wrapper=await keyFromBytes(secret),encrypted=await encryptBytes(wrapper,vaultRawKey);
  const record={v:1,uid:activeUser.id,vault: vaultMeta.createdAt||'', encrypted};
  await new Promise((resolve,reject)=>{const tx=db.transaction('data','readwrite');tx.objectStore('data').put(record,STC_SESSION_PREFIX+sid);tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error);tx.onabort=()=>reject(tx.error)});
  const s={sid,secret:base64(secret),activity:Date.now()};
  sessionStorage.setItem(STC_SESSION_KEY,JSON.stringify(s));sessionActivityWrittenAt=s.activity;
 }catch(e){stcSessionDrop(); /* Storage temporaneo non disponibile: accesso normale resta operativo. */}
}
async function stcSessionRestore(meta,payload){
 const s=stcSessionRead();if(!s)return false;
 if(!stcSessionValid(s)){stcSessionDrop();return false}
 try{
  const record=await idbValue(STC_SESSION_PREFIX+s.sid);
  const user=meta.users.find(u=>u.id===record?.uid&&u.active);
  if(!user||record.v!==1||record.vault!==(meta.createdAt||''))throw Error('Sessione non valida');
  const secret=unbase64(s.secret);if(secret.length!==32)throw Error('Token non valido');
  const wrapper=await keyFromBytes(secret),raw=await decryptBytes(wrapper,record.encrypted),key=await keyFromBytes(raw);
  const saved=JSON.parse(dec.decode(await decryptBytes(key,payload)));
  if(!Array.isArray(saved.quotes)||!Array.isArray(saved.customers))throw Error('Archivio non valido');
  state=saved; if(!Array.isArray(state.movements))state.movements=[];
  vaultEnabled=true;vaultRawKey=raw;vaultInMemoryKey=key;activeUser=user;
  await unlockApp();return true;
 }catch(_){stcSessionDrop();vaultEnabled=false;vaultRawKey=null;vaultInMemoryKey=null;activeUser=null;return false}
}
function stcCheckSessionIdle(){
 if(!activeUser)return;
 let s=stcSessionRead();
 if(s&&!stcSessionValid(s)){
  logoutOffline('idle');authError('Sessione bloccata dopo 30 minuti di inattività. Dopo l’accesso ritroverai l’ultima sezione.');
  return;
 }
 refreshIdleLock();
}
addEventListener('visibilitychange',()=>{if(!document.hidden)stcCheckSessionIdle()});
addEventListener('focus',stcCheckSessionIdle);

function refreshIdleLock(){
 if(!activeUser)return;
 let s=stcSessionRead();
 if(s&&!stcSessionValid(s)){logoutOffline('idle');authError('Sessione scaduta per inattività. Accedi nuovamente: la sezione sarà ripristinata.');return}
 stcSessionTouch();
 clearTimeout(idleLockTimer);
 const left=s?Math.max(1000,IDLE_LOCK_MS-(Date.now()-(stcSessionRead()?.activity||Date.now()))):IDLE_LOCK_MS;
 idleLockTimer=setTimeout(()=>{if(activeUser){logoutOffline('idle');authError('Sessione bloccata dopo 30 minuti di inattività. Accedi nuovamente.')}},left);
}
['pointerdown','keydown'].forEach(event=>addEventListener(event,refreshIdleLock,{passive:true}));
const enc=new TextEncoder(),dec=new TextDecoder(),base64=a=>btoa(String.fromCharCode(...new Uint8Array(a))),unbase64=s=>Uint8Array.from(atob(s),c=>c.charCodeAt(0));
const randomBytes=n=>crypto.getRandomValues(new Uint8Array(n));
const safeName=x=>String(x||'').trim().replace(/\s+/g,' ').slice(0,70);
function authError(message){document.getElementById('authError').textContent=message}
function idbValue(key){return new Promise((resolve,reject)=>{const r=db.transaction('data').objectStore('data').get(key);r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error)})}
function idbDelete(key){return new Promise((resolve,reject)=>{const r=db.transaction('data','readwrite').objectStore('data').delete(key);r.onsuccess=()=>resolve();r.onerror=()=>reject(r.error)})}
function idbVaultWrite(meta,payload,removePlain=false){return new Promise((resolve,reject)=>{const tx=db.transaction('data','readwrite');const s=tx.objectStore('data');s.put(meta,'vault-meta');s.put(payload,'vault-payload');if(removePlain)s.delete('state');tx.oncomplete=()=>resolve();tx.onerror=()=>reject(tx.error||Error('Impossibile scrivere archivio cifrato'));tx.onabort=()=>reject(tx.error||Error('Operazione annullata'))})}
async function passKey(password,salt){const input=await crypto.subtle.importKey('raw',enc.encode(password),'PBKDF2',false,['deriveKey']);return crypto.subtle.deriveKey({name:'PBKDF2',salt:unbase64(salt),iterations:270000,hash:'SHA-256'},input,{name:'AES-GCM',length:256},false,['encrypt','decrypt'])}
async function encryptBytes(key,raw){const iv=randomBytes(12),payload=await crypto.subtle.encrypt({name:'AES-GCM',iv},key,raw);return{iv:base64(iv),ciphertext:base64(payload)}}
async function decryptBytes(key,blob){return new Uint8Array(await crypto.subtle.decrypt({name:'AES-GCM',iv:unbase64(blob.iv)},key,unbase64(blob.ciphertext)))}
async function createEnvelope(name,password,role,keyBytes){const salt=base64(randomBytes(16)),wrapKey=await passKey(password,salt),wrap=await encryptBytes(wrapKey,keyBytes);return{id:crypto.randomUUID(),name,role,active:true,salt,wrap,createdAt:new Date().toISOString()}}
async function keyFromBytes(raw){return crypto.subtle.importKey('raw',raw,{name:'AES-GCM'},false,['encrypt','decrypt'])}
async function encryptState(data=state){if(!vaultInMemoryKey)throw Error('Archivio non sbloccato');return encryptBytes(vaultInMemoryKey,enc.encode(JSON.stringify(data)))}
async function vaultSaveState(data=state){if(!vaultEnabled||!activeUser||!vaultMeta)throw Error('Prima devi accedere');const blob=await encryptState(data);await idbVaultWrite(vaultMeta,blob)}
function pagePermitted(page){if(!activeUser)return false;return isAdmin()||!['admin','settings','ledger','tariffs','inventory','epal','invoices','mail','business','resources','analytics'].includes(page)}
function isAdmin(){return activeUser?.role==='admin'}
function ownsQuote(q){return isAdmin()||(!!activeUser&&q.createdBy===activeUser.id)}
function authPanels(mode){document.body.classList.add('app-locked');document.getElementById('setupForm').classList.toggle('hidden',mode!=='setup');document.getElementById('loginForm').classList.toggle('hidden',mode!=='login');document.getElementById('authSubtitle').textContent=mode==='setup'?'Primo accesso su questo dispositivo':'Accedi al tuo archivio locale';authError('')}
function showLogin(){const select=document.getElementById('loginUser');select.innerHTML='<option value="">Seleziona un utente</option>'+vaultMeta.users.filter(u=>u.active).map(u=>`<option value="${u.id}">${esc(u.name)} — ${u.role==='admin'?'Amministratore':'Operatore'}</option>`).join('');document.getElementById('loginPassword').value='';authPanels('login')}
function lockUI(){document.body.classList.add('app-locked');document.body.classList.remove('operator');document.getElementById('sessionUser').textContent='';document.querySelectorAll('input[type="password"]').forEach(el=>el.value='')}
async function secureBoot(){
 if(!crypto?.subtle||!window.indexedDB){document.getElementById('authSubtitle').textContent='Browser non supportato';authError('Serve un browser moderno HTTPS con Web Crypto e IndexedDB. Nessun dato è stato modificato.');return}
 try{await initDB()}catch(e){authPanels('setup');document.getElementById('setupForm').classList.add('hidden');authError('Impossibile aprire la memoria locale del browser. Controlla le impostazioni e non usare la modalità anonima.');return}const meta=await idbValue('vault-meta'),payload=await idbValue('vault-payload');
 if(Boolean(meta)!==Boolean(payload)){authPanels('setup');document.getElementById('setupForm').classList.add('hidden');authError('Archivio incompleto. Non procedere: serve ripristinare un backup con assistenza.');return}
 if(meta){if(!Array.isArray(meta.users)||!meta.users.length){authError('Archivio utenti non valido');return}vaultMeta=meta;if(await stcSessionRestore(meta,payload))return;showLogin();return}
 authPanels('setup');
}
async function createFirstAdmin(){
 const name=safeName(document.getElementById('firstAdminName').value),p=document.getElementById('firstAdminPassword').value,check=document.getElementById('firstAdminConfirm').value,button=document.getElementById('setupSubmit');
 if(!name||p.length<12||p!==check){authError('Inserisci un nome e una password identica di almeno 12 caratteri.');return}
 button.disabled=true;button.textContent='Protezione archivio…';try{
  const existingMeta=await idbValue('vault-meta');if(existingMeta)throw Error('L’amministratore esiste già su questo dispositivo. Riapri l’app.');
  await load(); // Reads v1.1 plaintext only on first migration.
  const raw=randomBytes(32),key=await keyFromBytes(raw),admin=await createEnvelope(name,p,'admin',raw);
  const candidateMeta={version:1,createdAt:new Date().toISOString(),users:[admin]};
  // The encrypted vault is committed before deleting legacy plaintext.
  const encrypted=await encryptBytes(key,enc.encode(JSON.stringify(state)));
  await idbVaultWrite(candidateMeta,encrypted,true);
  try{localStorage.removeItem(KEY);localStorage.removeItem(LEGACY)}catch(_){/* web storage unavailable */}
  vaultEnabled=true;vaultMeta=candidateMeta;vaultRawKey=raw;vaultInMemoryKey=key;activeUser=admin;
  document.getElementById('firstAdminPassword').value='';document.getElementById('firstAdminConfirm').value='';await stcSessionStart();await unlockApp();
 }catch(e){authError('Impossibile configurare amministratore: '+e.message)}finally{button.disabled=false;button.textContent="Crea amministratore e proteggi l'archivio"}
}
async function loginOffline(){
 const id=document.getElementById('loginUser').value,password=document.getElementById('loginPassword').value,btn=document.getElementById('loginSubmit');const user=vaultMeta?.users.find(u=>u.id===id&&u.active);if(!user){authError('Seleziona un utente attivo');return}
 btn.disabled=true;authError('');try{
  const pass=await passKey(password,user.salt),raw=await decryptBytes(pass,user.wrap),key=await keyFromBytes(raw),blob=await idbValue('vault-payload');
  const saved=JSON.parse(dec.decode(await decryptBytes(key,blob)));if(!Array.isArray(saved.quotes)||!Array.isArray(saved.customers))throw Error('Archivio danneggiato');
  state=saved;if(!Array.isArray(state.movements))state.movements=[];if(typeof entInit==='function')entInit();vaultEnabled=true;vaultRawKey=raw;vaultInMemoryKey=key;activeUser=user;
  document.getElementById('loginPassword').value='';await stcSessionStart();await unlockApp();
 }catch(e){authError('Password errata o impossibile aprire l’archivio. Verifica le credenziali.')}finally{btn.disabled=false}
}
async function unlockApp(){
 document.body.classList.remove('app-locked');document.body.classList.toggle('operator',!isAdmin());
 document.getElementById('sessionUser').textContent=activeUser.name+' · '+(isAdmin()?'Amministratore':'Operatore');
 await boot();refreshRolesUI();refreshIdleLock();
}
function refreshRolesUI(){
 document.body.classList.toggle('operator',!isAdmin());
 document.querySelectorAll('[data-page]').forEach(el=>{el.style.display=pagePermitted(el.dataset.page)?'':'none'});
 if(typeof stcRefreshNavAccess==='function')stcRefreshNavAccess();
 const w=document.getElementById('weatherCity');if(w&&state?.widgets?.city)w.value=state.widgets.city;
}
function logoutOffline(reason='manual'){
 stcSessionDrop();if(reason!=='idle')stcForgetView();
 clearTimeout(timer);clearTimeout(idleLockTimer);clearInterval(window.__stcWidgetsClock);clearInterval(window.__stcWidgetsRefresh);window.__stcWidgetsClock=null;window.__stcWidgetsRefresh=null;
 vaultRawKey=null;vaultInMemoryKey=null;activeUser=null;vaultEnabled=false;
 state={quotes:[],customers:[],movements:[],draft:null};editing=null;ships=[];
 lockUI();showLogin();
}
function renderAdmin(){if(!isAdmin())return;
 document.getElementById('userList').innerHTML=vaultMeta.users.map(u=>`<div class="userLine"><div><strong>${esc(u.name)}</strong><div class="userMeta">${u.role==='admin'?'Amministratore principale':'Operatore'} · ${u.active?'Attivo':'Disattivato'}</div></div><div class="row">${u.role==='operator'?`<button class="alt" onclick="showResetOperator('${u.id}')">Nuova password</button><button class="${u.active?'danger':'alt'}" onclick="toggleOperator('${u.id}')">${u.active?'Disattiva':'Riattiva'}</button>`:'<span class="pill">Principale</span>'}</div></div>`).join('')
}
async function createOperator(){if(!isAdmin())return;
 const name=safeName(document.getElementById('newUserName').value),p=document.getElementById('newUserPass').value,c=document.getElementById('newUserPass2').value;
 if(!name||p.length<12||p!==c)return toast('Nome e password concordanti di almeno 12 caratteri richiesti');
 if(vaultMeta.users.some(u=>u.name.toLocaleLowerCase('it')===name.toLocaleLowerCase('it')))return toast('Nome utente già esistente');
 try{
  const user=await createEnvelope(name,p,'operator',vaultRawKey);
  const newMeta={...vaultMeta,users:[...vaultMeta.users,user]};
  await idbVaultWrite(newMeta,await encryptState());vaultMeta=newMeta;
  for(const id of ['newUserName','newUserPass','newUserPass2'])document.getElementById(id).value='';renderAdmin();toast('Operatore creato sul dispositivo');
 }catch(e){toast('Errore creazione utente: '+e.message)}
}
async function toggleOperator(id){if(!isAdmin())return;const target=vaultMeta.users.find(u=>u.id===id&&u.role==='operator');if(!target)return;
 const newMeta={...vaultMeta,users:vaultMeta.users.map(u=>u.id===id?{...u,active:!u.active}:u)};try{await idbVaultWrite(newMeta,await encryptState());vaultMeta=newMeta;renderAdmin();toast('Stato utente modificato')}catch(e){toast('Impossibile modificare utente')}
}
function showResetOperator(id){if(!isAdmin())return;const target=vaultMeta.users.find(u=>u.id===id&&u.role==='operator');if(!target)return;const box=document.getElementById('resetPasswordBox');if(box)box.remove();const container=document.createElement('div');container.id='resetPasswordBox';container.className='card';container.innerHTML=`<strong>Reimposta password: ${esc(target.name)}</strong><p class="muted">Inserisci una nuova password di almeno 12 caratteri. Non verrà visualizzata.</p><label>Nuova password<input type="password" autocomplete="new-password" id="operatorNewPass" minlength="12"></label><label>Conferma<input type="password" autocomplete="new-password" id="operatorNewPassConfirm" minlength="12"></label><div class="row"><button class="primary" onclick="resetOperatorPass('${id}')">Salva nuova password</button><button class="alt" onclick="document.getElementById('resetPasswordBox').remove()">Annulla</button></div>`;document.getElementById('userList').after(container)}
async function resetOperatorPass(id){if(!isAdmin())return;const target=vaultMeta.users.find(u=>u.id===id&&u.role==='operator');if(!target)return;
 const p=document.getElementById('operatorNewPass')?.value||'',check=document.getElementById('operatorNewPassConfirm')?.value||'';if(p.length<12||p!==check)return toast('Inserisci e conferma una password di almeno 12 caratteri');
 try{const generated=await createEnvelope(target.name,p,'operator',vaultRawKey);const newMeta={...vaultMeta,users:vaultMeta.users.map(u=>u.id===id?{...u,salt:generated.salt,wrap:generated.wrap}:u)};await idbVaultWrite(newMeta,await encryptState());vaultMeta=newMeta;document.getElementById('resetPasswordBox').remove();toast('Password operatore aggiornata')}catch(e){toast('Impossibile cambiare password')}
}

function downloadObject(obj,name){const blob=new Blob([JSON.stringify(obj,null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),10000)}
async function exportEncryptedBackup(){
 if(!isAdmin())return toast('Solo amministrazione');
 try{
  // Attendere la scrittura del database prima di esportare: include anche le bozze recenti.
  flushWorkingDrafts();if(!await persist())throw Error('Archivio non salvato');
  const payload=await idbValue('vault-payload');
  if(!payload)throw Error('Manca archivio cifrato');
  downloadObject({format:'stc-logistica-backup-v1.2-encrypted',created:new Date().toISOString(),meta:vaultMeta,payload},
   'STC_Logistics_backup_cifrato_'+date()+'.json');
  toast('Backup cifrato esportato: conserva la password del backup');
 }catch(e){toast('Backup non riuscito: '+e.message)}
}
function validateSTCBackupState(data){
 if(!data||typeof data!=='object'||Array.isArray(data)||!Array.isArray(data.quotes)||!Array.isArray(data.customers))throw Error('Archivio non valido: mancano preventivi o clienti');
 for(const key of ['movements','recipients','calendarRuns','quickCalcDraft','tariffHistory'])
  if(data[key]!==undefined&&!Array.isArray(data[key]))throw Error('Archivio non valido: sezione '+key+' danneggiata');
 for(const q of data.quotes){
  if(!q||typeof q!=='object'||Array.isArray(q))throw Error('Preventivo danneggiato');
  if(q.shipments!==undefined&&!Array.isArray(q.shipments))throw Error('Spedizioni preventivo danneggiate');
  if(Array.isArray(q.shipments))for(const s of q.shipments){
   if(!s||typeof s!=='object'||Array.isArray(s)||(s.items!==undefined&&!Array.isArray(s.items)))throw Error('Dettaglio spedizione danneggiato');
  }
 }
 for(const run of data.calendarRuns||[]){if(!run||typeof run!=='object'||!Array.isArray(run.shipments))throw Error('Bolla di calendario danneggiata')}
 // Nuovi moduli 1.18: la verifica è retrocompatibile, ma non accetta sezioni con struttura corrotta.
 for(const name of ['stockItems','stockMoves','epalMoves','invoices','mailRecords','operationalResources','expectedReceipts','warehouseReceipts','supplierSchedules','priceHistory']){
  if(data[name]!==undefined){
   if(!Array.isArray(data[name])||data[name].length>200000)throw Error('Backup: sezione '+name+' non valida');
   for(const x of data[name])if(!x||typeof x!=='object'||Array.isArray(x)||typeof x.id!=='string'||!x.id)throw Error('Backup: voce corrotta in '+name);
  }
 }
 if(data.serviceTariffs!==undefined&&(!data.serviceTariffs||typeof data.serviceTariffs!=='object'||Array.isArray(data.serviceTariffs)))throw Error('Tariffe servizi danneggiate');
 if(data.resourceAssignments!==undefined&&(!data.resourceAssignments||typeof data.resourceAssignments!=='object'||Array.isArray(data.resourceAssignments)))throw Error('Assegnazioni risorse danneggiate');
 if(data.business!==undefined&&(!data.business||typeof data.business!=='object'||Array.isArray(data.business)))throw Error('Backup: dati aziendali non validi');
 if(data.invoiceSequences!==undefined&&(!data.invoiceSequences||typeof data.invoiceSequences!=='object'||Array.isArray(data.invoiceSequences)))throw Error('Backup: numerazione fatture non valida');
 for(const m of data.stockMoves||[])if(!['carico','scarico'].includes(m.kind)||typeof m.itemId!=='string'||!Number.isFinite(m.qty)||m.qty<=0||!Number.isSafeInteger(m.unitCents)||m.unitCents<0)throw Error('Movimento magazzino danneggiato');
 for(const x of data.invoices||[]){
  if(!Array.isArray(x.lines)||!['Bozza','Preparata','Annullata'].includes(x.status))throw Error('Bozza fattura danneggiata');
  for(const l of x.lines)if(!l||typeof l!=='object'||!Number.isFinite(l.qty)||l.qty<=0||!Number.isSafeInteger(l.unitCents)||l.unitCents<0)throw Error('Riga fattura danneggiata');
 }
 return {quoteCount:data.quotes.length,runCount:(data.calendarRuns||[]).length};
}
async function verifyBackupBeforeRestore(data,password){
 if(!data||data.format!=='stc-logistica-backup-v1.2-encrypted'||
  !Array.isArray(data.meta?.users)||data.meta.users.length<1||!data.payload?.iv||!data.payload?.ciphertext){
  throw Error('Formato del backup cifrato non valido');
 }
 if(!password)throw Error('Inserisci la password di un utente presente nel backup');
 for(const user of data.meta.users){
  try{
   if(!user.salt||!user.wrap?.iv||!user.wrap?.ciphertext)continue;
   const wrap=await passKey(password,user.salt);
   const raw=await decryptBytes(wrap,user.wrap);
   const key=await keyFromBytes(raw);
   const stateCandidate=JSON.parse(dec.decode(await decryptBytes(key,data.payload)));
   const checked=validateSTCBackupState(stateCandidate);return {userId:user.id,...checked};
  }catch(_){/* Utente o password non corrispondente: prova il successivo. */}
 }
 throw Error('Password errata o archivio non leggibile: nulla è stato sostituito');
}
async function importSecureBackup(input){
 if(!isAdmin())return toast('Solo amministrazione');const f=input.files?.[0];if(!f)return;
 const pwInput=document.getElementById('backupImportPassword');
 try{
  const data=JSON.parse(await f.text());
  if(data.format==='stc-logistica-backup-v1.2-encrypted'){
   const password=pwInput?.value||'';
   const verified=await verifyBackupBeforeRestore(data,password);
   if(!confirm('Backup verificato: '+verified.quoteCount+' preventivi e '+verified.runCount+' bolle. Sostituire i dati locali, utenti compresi? Per riaccedere serviranno le password DEL BACKUP.'))return;
   clearTimeout(timer);clearTimeout(quickTimer);await persistTail;
   await idbVaultWrite(data.meta,data.payload,true);
   vaultMeta=data.meta;logoutOffline();showLogin();toast('Backup verificato e ripristinato');return;
  }
  if(!['stc-logistica-backup-v1','stc-logistica-backup-v1.1','rotta-backup-v03'].includes(data.format)||
   !Array.isArray(data.state?.quotes)||!Array.isArray(data.state?.customers))throw Error('Formato non valido');
  validateSTCBackupState(data.state);
  if(!confirm('Importare il vecchio backup e cifrarlo con l’amministratore attuale? Questa operazione sostituisce l’archivio locale.'))return;
  const previous=state;
  state=data.state;
  if(!Array.isArray(state.movements))state.movements=[];
  if(!await persist()){
   state=previous;throw Error('Salvataggio non riuscito: importazione annullata');
  }
  applySavedTariffs();restoreDraft();renderCustomers();renderDashboard();toast('Backup importato e cifrato');
 }catch(e){toast('Importazione fallita: '+e.message)}
 finally{input.value='';if(pwInput)pwInput.value=''}
}
