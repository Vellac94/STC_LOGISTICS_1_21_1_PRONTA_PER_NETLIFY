"use strict";
const TARIFFS=[{"region": "LOMBARDIA", "zone": "BS-MN", "cents": [2985, 995, 935, 875, 815, 755, 700]}, {"region": "LOMBARDIA", "zone": "MI-BG", "cents": [3150, 1050, 995, 935, 875, 815, 755]}, {"region": "LOMBARDIA", "zone": "PV-CR-LO", "cents": [3150, 1050, 995, 935, 875, 815, 755]}, {"region": "LOMBARDIA", "zone": "VA-CO-LC", "cents": [3855, 1285, 1225, 1165, 1110, 1050, 995]}, {"region": "LOMBARDIA", "zone": "SONDRIO", "cents": [4905, 1635, 1575, 1515, 1460, 1400, 1340]}, {"region": "VENETO", "zone": "VR", "cents": [2460, 820, 760, 700, 640, 585, 465]}, {"region": "VENETO", "zone": "PD-VI-RO", "cents": [2985, 995, 935, 875, 815, 755, 700]}, {"region": "VENETO", "zone": "BL-TV-VE", "cents": [3150, 1050, 995, 935, 875, 815, 755]}, {"region": "VENETO", "zone": "VE+ISOLE", "cents": [5955, 1985, 1925, 1865, 1810, 1750, 1690]}, {"region": "PIEMONTE", "zone": "TO-AT-AL", "cents": [4380, 1460, 1400, 1340, 1280, 1225, 1165]}, {"region": "PIEMONTE", "zone": "NO-VC-BI", "cents": [3810, 1280, 1225, 1165, 1110, 1050, 990]}, {"region": "PIEMONTE", "zone": "AO-CN-VB", "cents": [4545, 1515, 1460, 1400, 1340, 1285, 1225]}, {"region": "LIGURIA", "zone": "GE-SP", "cents": [4200, 1400, 1340, 1285, 1225, 1165, 1110]}, {"region": "LIGURIA", "zone": "SV-IM", "cents": [4380, 1460, 1400, 1340, 1285, 1225, 1165]}, {"region": "LIGURIA", "zone": "VENTIMIGLIA", "cents": [4620, 1540, 1460, 1400, 1340, 1285, 1225]}, {"region": "TOSCANA", "zone": "FI-PO-PT", "cents": [3855, 1285, 1225, 1165, 1110, 1050, 995]}, {"region": "TOSCANA", "zone": "LU-PI-AR-MS", "cents": [4035, 1345, 1285, 1225, 1165, 1110, 1050]}, {"region": "TOSCANA", "zone": "SI-LI-GR", "cents": [4560, 1520, 1460, 1400, 1345, 1283, 1225]}, {"region": "TRENTINO ALTO ADIGE", "zone": "TRENTO", "cents": [3495, 1165, 1110, 1050, 995, 935, 875]}, {"region": "TRENTINO ALTO ADIGE", "zone": "VALLI TN", "cents": [3855, 1285, 1225, 1165, 1110, 1050, 995]}, {"region": "TRENTINO ALTO ADIGE", "zone": "BOLZANO", "cents": [4035, 1345, 1285, 1225, 1165, 1110, 1050]}, {"region": "TRENTINO ALTO ADIGE", "zone": "VALLI BZ", "cents": [4200, 1400, 1345, 1285, 1225, 1165, 1110]}, {"region": "FRIULI VENEZIA GIULIA", "zone": "UD-PN-GO", "cents": [4020, 1340, 1280, 1225, 1165, 1110, 1050]}, {"region": "FRIULI VENEZIA GIULIA", "zone": "TS-TARVISIO", "cents": [4200, 1400, 1340, 1280, 1225, 1165, 1010]}, {"region": "LAZIO", "zone": "RM-RI-VT", "cents": [4380, 1460, 1400, 1340, 1280, 1225, 1165]}, {"region": "LAZIO", "zone": "FR-LT", "cents": [4545, 1515, 1460, 1400, 1340, 1280, 1225]}, {"region": "EMILIA ROMAGNA", "zone": "BO-MO-FE", "cents": [3495, 1165, 1110, 1050, 995, 935, 875]}, {"region": "EMILIA ROMAGNA", "zone": "PR-RE-PC", "cents": [3675, 1225, 1165, 1110, 1050, 995, 935]}, {"region": "EMILIA ROMAGNA", "zone": "FC-RA", "cents": [3855, 1285, 1225, 1165, 1110, 1050, 995]}, {"region": "EMILIA ROMAGNA", "zone": "RSM-RN", "cents": [4200, 1400, 1345, 1285, 1225, 1165, 1110]}, {"region": "ABRUZZO/MOLISE", "zone": "PE-CH-TE", "cents": [4545, 1515, 1460, 1400, 1340, 1280, 1225]}, {"region": "ABRUZZO/MOLISE", "zone": "AQ-CB-IS", "cents": [4890, 1630, 1575, 1515, 1455, 1400, 1340]}, {"region": "MARCHE", "zone": "AN-AP-MC-PU", "cents": [4545, 1515, 1455, 1400, 1340, 1280, 1225]}, {"region": "CAMPANIA", "zone": "NA-AV-CE-BN", "cents": [5250, 1750, 1690, 1630, 1515, 1455, 1340]}, {"region": "CAMPANIA", "zone": "SA", "cents": [5595, 1865, 1805, 1750, 1690, 1630, 1515]}, {"region": "PUGLIA", "zone": "BA-FG", "cents": [5595, 1865, 1805, 1750, 1690, 1630, 1515]}, {"region": "PUGLIA", "zone": "LE-TA-BR", "cents": [5775, 1925, 1865, 1805, 1750, 1690, 1630]}, {"region": "SICILIA", "zone": "RE-SR-ME-CT", "cents": [7800, 2600, 2535, 2470, 2410, 2305, 2210]}, {"region": "SICILIA", "zone": "AG-PA-CL- EN-TP", "cents": [8100, 2700, 2630, 2565, 2315, 2260, 2200]}, {"region": "UMBRIA", "zone": "PG-TR", "cents": [4725, 1575, 1515, 1460, 1400, 1340, 1270]}, {"region": "BASILICATA", "zone": "PZ-MT", "cents": [5595, 1865, 1805, 1750, 1690, 1635, 1575]}, {"region": "CALABRIA", "zone": "CS-CZ-RC", "cents": [7800, 2600, 2535, 2470, 2410, 2350, 2290]}, {"region": "SARDEGNA", "zone": "CA-OR-SS-NU", "cents": [7500, 2500, 2440, 2375, 2320, 2260, 2200]}];
const KEY='stc_logistica_local_v1';const LEGACY='rotta_offline_v03';
const $=id=>document.getElementById(id);const uid=()=>crypto?.randomUUID?.()||Date.now().toString(36)+Math.random().toString(36).slice(2);const money=n=>new Intl.NumberFormat('it-IT',{style:'currency',currency:'EUR'}).format(n||0);const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));const num=x=>Math.max(0,Number(String(x??'').replace(',','.'))||0);const date=()=>{const n=new Date();return [n.getFullYear(),String(n.getMonth()+1).padStart(2,'0'),String(n.getDate()).padStart(2,'0')].join('-')};
const menus=[['dashboard','▦','Dashboard'],['quick','▤','Calcolatrice'],['quote','▤','Preventivo'],['archive','▣','Archivio'],['epal','▦','Bancali EPAL'],['inventory','▥','Magazzino'],['invoices','▤','Fatture'],['mail','✉','Posta'],['business','⚙','Dati aziendali'],['ledger','◫','Movimenti'],['customers','♙','Clienti'],['tariffs','▥','Tariffari'],['settings','⚙','Backup'],['admin','♙','Utenti'],['resources','▣','Flotta e risorse'],['analytics','▥','Analisi e grafici']];
// V1.19: una sola definizione dei collegamenti, senza creare copie dei moduli.
// La pagina dashboard resta accessibile dal logo. Il calendario e' un collegamento alla dashboard.
const STC_NAV_SHORTCUTS=[['quick','Calcolo rapido'],['calendar','Calendario'],['quote','Preventivi'],['archive','Archivio']];
const STC_NAV_GROUPS=[
 {key:'clients',title:'Clienti e posta',pages:['customers','mail']},
 {key:'warehouse',title:'Magazzino e bancali',pages:['inventory','epal','resources']},
 {key:'economy',title:'Economia',pages:['invoices','ledger','tariffs','analytics']},
 {key:'management',title:'Amministrazione',pages:['business','settings','admin']}
];
const STC_NAV_MEMORY='stc-menu-1-19';
function stcMenuDef(key){return menus.find(m=>m[0]===key)}
function stcNavHTML(key,mode='side'){
 const item=stcMenuDef(key);if(!item)return '';
 const [page,icon,label]=item;
 const mobile=mode==='mobile';
 return `<button type="button" data-page="${page}" class="stc-nav-link" onclick="${mobile?'mobileCloseMore();':''}go('${page}')"><span class="stc-nav-icon" aria-hidden="true">${icon}</span><span>${key==='quick'?'Calcolo rapido':key==='quote'?'Preventivi':label}</span></button>`;
}
function stcCalendarLink(mode='side'){
 return `<button type="button" class="stc-nav-link stc-calendar-shortcut" onclick="${mode==='mobile'?'mobileCloseMore();':''}stcGoCalendar()"><span class="stc-nav-icon" aria-hidden="true">▦</span><span>Calendario</span></button>`;
}
function stcGoCalendar(){
 go('dashboard');
 requestAnimationFrame(()=>{
  const target=document.getElementById('operationalCalendar');
  if(target)target.scrollIntoView({block:'start',behavior:'smooth'});
 });
}
function stcSavedMenuState(){try{return JSON.parse(localStorage.getItem(STC_NAV_MEMORY)||'{}')||{}}catch(_){return {}}}
function stcNavGroupHTML(group,mode='side'){
 const visible=group.pages.filter(key=>pagePermitted(key));
 // Prima del login pagePermitted e' false: per la barra laterale costruiamo tutte le voci,
 // che saranno filtrate dopo l'accesso. Nel menu mobile i gruppi vuoti si omettono.
 if(mode==='mobile'&&!visible.length)return '';
 const keys=mode==='mobile'?visible:group.pages;
 const children=keys.map(key=>stcNavHTML(key,mode)).join('');
 const saved=stcSavedMenuState();
 return `<details class="stc-nav-group" data-nav-group="${group.key}" ${mode==='side'&&saved[group.key]?'open':''}><summary><span>${group.title}</span><span class="stc-nav-chevron" aria-hidden="true">⌄</span></summary><div class="stc-nav-children">${children}</div></details>`;
}
function stcBuildSidebarNav(){
 const n=$('nav');if(!n)return;
 n.innerHTML='<div class="stc-nav-heading">ACCESSO RAPIDO</div>'+
 STC_NAV_SHORTCUTS.map(([key])=>key==='calendar'?stcCalendarLink():stcNavHTML(key)).join('')+
 '<div class="stc-nav-divider" aria-hidden="true"></div>'+
 STC_NAV_GROUPS.map(g=>stcNavGroupHTML(g)).join('');
 n.querySelectorAll('details[data-nav-group]').forEach(g=>g.addEventListener('toggle',()=>{
  try{const v=stcSavedMenuState();v[g.dataset.navGroup]=g.open;localStorage.setItem(STC_NAV_MEMORY,JSON.stringify(v))}catch(_){}
 }));
 stcRefreshNavAccess();
}
function stcRefreshNavAccess(){
 const n=$('nav');if(!n)return;
 n.querySelectorAll('details[data-nav-group]').forEach(group=>{
  group.hidden=![...group.querySelectorAll('button[data-page]')].some(button=>pagePermitted(button.dataset.page));
 });
}
function stcNavOnPage(page){
 const n=$('nav');if(!n)return;
 const calendar=n.querySelector('.stc-calendar-shortcut');
 if(calendar){calendar.classList.toggle('active',page==='dashboard');calendar.setAttribute('aria-current',page==='dashboard'?'page':'false')}
 const btn=n.querySelector(`button[data-page="${page}"]`);
 if(btn){const parent=btn.closest('details[data-nav-group]');if(parent&&!parent.open)parent.open=true}
}
function stcMobileMoreHTML(){
 // Non duplicare Dashboard/Calcolatrice/Preventivi gia' presenti nella barra inferiore.
 let html='<div class="stc-mobile-more-title">Navigazione</div>'+
 stcNavHTML('archive','mobile')+stcCalendarLink('mobile');
 for(const group of STC_NAV_GROUPS)html+=stcNavGroupHTML(group,'mobile');
 return html;
}
const ORIGINAL_TARIFFS=TARIFFS.map(t=>({...t,cents:[...t.cents]}));
let state={quotes:[],customers:[],movements:[],recipients:[],calendarRuns:[],draft:null},ships=[],editing=null,timer=null,db=null;
// L'editing di un preventivo mantiene i prezzi registrati nella sua fotografia tariffaria.
// Mai ricalcolare silenziosamente un documento storico usando il listino attuale.
let quoteTariffLock=null;
function freezeTariff(source,shipmentId){
 if(!source||!Array.isArray(source.cents)||source.cents.length!==7)return null;
 return {shipId:shipmentId,region:source.region,zone:source.zone,cents:[...source.cents],
  supplementCents:source.supplementCents||0,aliases:[...(source.aliases||[])]};
}
function nextLocalQuoteCode(){
 const year=String(new Date().getFullYear()),prefix='STC-LOC-'+year+'-';
 const used=(state.quotes||[]).map(q=>String(q.code||''))
  .filter(code=>code.startsWith(prefix)).map(code=>Number(code.slice(prefix.length)))
  .filter(n=>Number.isSafeInteger(n)&&n>0);
 const ledger=state.quoteSequences||{};
 const next=Math.max(Number(ledger[year]||0),0,...used)+1;
 if(!Number.isSafeInteger(next))throw Error('Contatore preventivi non valido');
 return {year,number:next,code:prefix+String(next).padStart(4,'0')};
}
function toast(s){$('toast').textContent=s;$('toast').style.display='block';clearTimeout(window._toast);window._toast=setTimeout(()=>$('toast').style.display='none',3200)}
function initDB(){if(db)return Promise.resolve();return new Promise((resolve,reject)=>{if(!indexedDB)return reject(Error('IndexedDB non disponibile'));const req=indexedDB.open('STCLogistica',1);req.onupgradeneeded=()=>{req.result.createObjectStore('data')};req.onsuccess=()=>{db=req.result;resolve()};req.onerror=()=>reject(req.error)})}
function dbGet(){return new Promise((resolve,reject)=>{const r=db.transaction('data').objectStore('data').get('state');r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error)})}
function dbPut(value){return new Promise((resolve,reject)=>{const r=db.transaction('data','readwrite').objectStore('data').put(value,'state');r.onsuccess=()=>resolve();r.onerror=()=>reject(r.error)})}
let persistTail=Promise.resolve();
async function persist(){
 // Snapshot immediato: due salvataggi ravvicinati non possono invertirsi.
 const snapshot=JSON.parse(JSON.stringify(state));
 const write=async()=>{
  try{
   if(vaultEnabled)await vaultSaveState(snapshot);
   else if(db)await dbPut(snapshot);
   else localStorage.setItem(KEY,JSON.stringify(snapshot));
   $('storageInfo').textContent=(vaultEnabled?'Archivio cifrato AES-GCM (locale)':db?'IndexedDB':'Memoria browser')+' · '+snapshot.quotes.length+' preventivi · '+snapshot.customers.length+' clienti · '+snapshot.movements.length+' movimenti';
   return true;
  }catch(e){toast('ATTENZIONE: salvataggio non riuscito. Esporta un backup.');$('draftInfo').textContent='Errore salvataggio';return false}
 };
 const work=persistTail.then(write);persistTail=work.then(()=>{},()=>{});return work;
}
function flushWorkingDrafts(){
 if(timer){clearTimeout(timer);timer=null;state.draft={...currentData(),editing}}
 if(typeof quickTimer!=='undefined'&&quickTimer){clearTimeout(quickTimer);quickTimer=null;state.quickCalcDraft=JSON.parse(JSON.stringify(fastShips))}
}

async function load(){if(vaultEnabled)return;try{await initDB();const saved=await dbGet();if(saved&&Array.isArray(saved.quotes))state=saved;else{const raw=localStorage.getItem(KEY)||localStorage.getItem(LEGACY);if(raw){const obj=JSON.parse(raw);if(Array.isArray(obj.quotes)&&Array.isArray(obj.customers)){state=obj;await persist()}}}}catch(e){try{const raw=localStorage.getItem(KEY)||localStorage.getItem(LEGACY);if(raw){const obj=JSON.parse(raw);if(Array.isArray(obj.quotes)&&Array.isArray(obj.customers))state=obj}}catch(_){}}if(!Array.isArray(state.quotes))state.quotes=[];if(!Array.isArray(state.customers))state.customers=[];if(!Array.isArray(state.movements))state.movements=[];if(!Array.isArray(state.recipients))state.recipients=[];if(!Array.isArray(state.calendarRuns))state.calendarRuns=[];if(typeof entInit==='function')entInit()}
const STC_VIEW_MEMORY='stc-last-view-v1';
function stcRememberView(page){try{sessionStorage.setItem(STC_VIEW_MEMORY,JSON.stringify({page,at:Date.now()}))}catch(_){}}
function stcReadView(){try{const v=JSON.parse(sessionStorage.getItem(STC_VIEW_MEMORY)||'null');return v&&typeof v.page==='string'&&menus.some(m=>m[0]===v.page)?v.page:'dashboard'}catch(_){return 'dashboard'}}
function stcForgetView(){try{sessionStorage.removeItem(STC_VIEW_MEMORY)}catch(_){}}
function go(page){if(!pagePermitted(page))return toast('Accesso riservato all’amministratore');stcRememberView(page);document.querySelectorAll('.view').forEach(el=>el.classList.toggle('active',el.id===page));document.querySelectorAll('[data-page]').forEach(el=>el.classList.toggle('active',el.dataset.page===page));stcNavOnPage(page);$('pageTitle').textContent=page==='dashboard'?'Pannello operativo':(menus.find(x=>x[0]===page)?.[2]||'STC Logistics');if(page==='dashboard')renderDashboard();if(page==='quick')quickRender();if(page==='archive')renderArchive();if(page==='customers')renderCustomers();if(page==='ledger')renderLedger();if(page==='tariffs')renderTariffs();if(page==='settings')renderSettings();if(page==='admin')renderAdmin();if(typeof entRender==='function')entRender(page);if(page==='resources')STCExtra.renderResources();if(page==='analytics')STCExtra.renderAnalytics();scrollTo(0,0)}
function emptyShip(){return{id:uid(),destination:'',recipientName:'',recipientId:'',address:'',city:'',province:'',cap:'',region:'',zone:'',kg:'',volume:'',volumeSource:'dimensions',supp:'0',items:[{id:uid(),type:'Collo',qty:'1',kg:'',l:'',w:'',h:''}]}}
function newQuote(){editing=null;quoteTariffLock=null;if(typeof entActiveMailId!=='undefined')entActiveMailId='';ships=[emptyShip()];for(const id of ['customer','reference','notes'])$(id).value='';$('quoteDate').value=calendarLocalToday();$('quoteDeliveryDate').value=calendarLocalToday();for(const id of ['supp','markup','discount','vat'])$(id).value='0';$('manualQuotePrice').value='';$('manualPriceReason').value='';$('quoteTitle').textContent='Nuovo preventivo';STCExtra.resetQuote();renderShips();changed();go('quote')}
function addShip(){ships.push(emptyShip());renderShips();changed()}
function removeShip(id){if(ships.length===1)return toast('Mantieni una destinazione');ships=ships.filter(x=>x.id!==id);renderShips();changed()}
function addItem(id){const s=ships.find(x=>x.id===id);if(!s)return;s.items.push({id:uid(),type:'Collo',qty:'1',kg:'',l:'',w:'',h:''});renderShips();changed()}
function removeItem(sid,iid){const s=ships.find(x=>x.id===sid);if(!s)return;s.items=s.items.filter(x=>x.id!==iid);if(quoteVolumeSource(s)==='dimensions')s.volume='';renderShips();changed()}
// Volume manuale e misure sono fonti alternative. Il metodo usato per ultimo prevale.
function quoteVolumeSource(s){return s.volumeSource==='manual'||s.volumeSource==='dimensions'?s.volumeSource:(String(s.volume??'').trim()?'manual':'dimensions')}
function quoteDerivedVolume(s){
 let total=0,any=false;
 for(const i of s.items||[]){
  const qty=STCCalc.decimal(i.qty),l=STCCalc.decimal(i.l),w=STCCalc.decimal(i.w),h=STCCalc.decimal(i.h);
  if(!Number.isInteger(qty)||qty<1||l<=0||w<=0||h<=0)continue;
  total+=qty*l*w*h/1e6;any=true;
 }
 return any?Number(total.toFixed(6)).toLocaleString('it-IT',{useGrouping:false,maximumFractionDigits:6}):'';
}
function quoteVolumeDisplay(s){return quoteVolumeSource(s)==='manual'?String(s.volume??''):quoteDerivedVolume(s)}
function quoteVolumeEdit(id,value){
 const s=ships.find(x=>x.id===id);if(!s)return;
 s.volume=value;s.volumeSource=String(value).trim()?'manual':'dimensions';
 changed();
}
function quoteRefreshVolume(id){
 const s=ships.find(x=>x.id===id);if(!s)return;
 const input=$('quoteVolume_'+id),hint=$('quoteVolumeHint_'+id);
 if(input&&quoteVolumeSource(s)==='dimensions')input.value=quoteDerivedVolume(s);
 if(hint)hint.textContent=quoteVolumeSource(s)==='manual'?'m³ inseriti manualmente: le dimensioni non si sommano.':'Volume calcolato automaticamente dalle misure. Puoi anche digitare direttamente i m³.';
}
function field(id,key,value){
 const s=ships.find(x=>x.id===id);if(!s)return;s[key]=value;
 if(key==='volume'){quoteVolumeEdit(id,value);return}
 if(key==='region'){s.zone='';s.geoSource='Regione scelta manualmente';s.geoWarning='';renderShips()}
 if(key==='zone'){s.geoSource='Zona scelta manualmente';s.geoWarning='';quoteUpdateLocationFields(id)}
 changed();
}
function itemField(sid,iid,key,value){
 const s=ships.find(x=>x.id===sid),i=s?.items.find(x=>x.id===iid);if(!i)return;
 i[key]=value;
 if(['qty','l','w','h'].includes(key)){
  s.volume='';s.volumeSource='dimensions';
 }
 changed();
}
function quotePriceInput(){
 const raw=String($('manualQuotePrice')?.value??'').trim();
 if(!raw)return{manual:false,valid:true};
 const normalized=raw.replace(',','.');
 if(!/^\d{1,9}(?:\.\d{1,2})?$/.test(normalized))return{manual:true,valid:false,reason:'Prezzo finale: inserisci un importo valido con massimo due decimali'};
 const cents=Math.round(Number(normalized)*100);
 if(!Number.isSafeInteger(cents)||cents>99999999999)return{manual:true,valid:false,reason:'Prezzo finale fuori limite'};
 return{manual:true,valid:true,cents};
}
function quotePriceRestore(){
 $('manualQuotePrice').value='';$('manualPriceReason').value='';changed();
}

function regionOptions(v){return '<option value="">Seleziona regione</option>'+[...new Set(TARIFFS.map(t=>t.region))].map(x=>`<option value="${esc(x)}" ${x===v?'selected':''}>${esc(x)}</option>`).join('')}
function zoneOptions(s){return '<option value="">Seleziona zona</option>'+TARIFFS.filter(t=>t.region===s.region).map(x=>`<option value="${esc(x.zone)}" ${x.zone===s.zone?'selected':''}>${esc(x.zone)}</option>`).join('')}
// STC 1.7: destinatari delle merci, distinti dai clienti che richiedono il preventivo.
// Le anagrafiche sono dentro lo stesso archivio locale cifrato e nello stesso backup.
function recipientNorm(v){return String(v||'').trim().replace(/\s+/g,' ').toLocaleLowerCase('it')}
function recipientStore(){if(!Array.isArray(state.recipients))state.recipients=[];return state.recipients}
function shipLegacyUpgrade(s){
 if(!s)return;
 if(typeof s.city!=='string')s.city=String(s.destination||'');
 if(typeof s.recipientName!=='string')s.recipientName='';
 if(typeof s.address!=='string')s.address='';
 if(typeof s.recipientId!=='string')s.recipientId='';
 if(typeof s.province!=='string')s.province='';
 if(typeof s.geoSource!=='string')s.geoSource='';
 if(typeof s.geoWarning!=='string')s.geoWarning='';
 if(s.volumeSource!=='manual'&&s.volumeSource!=='dimensions')s.volumeSource=String(s.volume??'').trim()?'manual':'dimensions';
}
function recipientListForClient(){
 const client=recipientNorm($('customer')?.value);
 const clientId=STCExtra.customerId($('customer')?.value||'');return client?recipientStore().filter(r=>r.customerId?!!clientId&&r.customerId===clientId:recipientNorm(r.customer)===client):[];
}
function recipientChoices(id){
 const s=ships.find(x=>x.id===id);if(!s)return;
 const node=$('recipientChoices_'+id);if(!node)return;
 const items=recipientListForClient().filter(r=>!s.recipientName||recipientNorm(r.name).includes(recipientNorm(s.recipientName))).slice(0,8);
 node.innerHTML=items.map(r=>`<button type="button" class="alt" style="text-align:left" data-rid="${esc(r.id)}" data-sid="${esc(id)}" onclick="chooseSavedRecipient(this.dataset.sid,this.dataset.rid)">${esc(r.name)} · ${esc(r.address||'')} · ${esc(r.city||'')}${r.cap?' ('+esc(r.cap)+')':''}</button>`).join('');
 const hint=$('recipientHint_'+id);
 if(hint)hint.textContent=!$('customer').value?'Seleziona prima il cliente per cercare i suoi destinatari.':items.length?'Seleziona un destinatario salvato oppure continua a scriverne uno nuovo.':'Destinatario nuovo: compila indirizzo e salva nell’anagrafica.';
}
function recipientNameEdit(id,value){
 const s=ships.find(x=>x.id===id);if(!s)return;
 s.recipientName=value;s.recipientId='';recipientChoices(id);changed();
}
function chooseSavedRecipient(id,rid){
 const s=ships.find(x=>x.id===id),r=recipientListForClient().find(x=>x.id===rid);if(!s||!r)return;
 s.recipientName=r.name;s.recipientId=r.id;s.address=r.address;s.city=r.city;s.destination=r.city;s.cap=r.cap||'';s.province=r.province||'';s.region=r.region||'';s.zone=r.zone||'';s.geoSource='Destinatario salvato';s.geoWarning='';
 if(!s.province){const known=STCGeo.find(s.city).filter(c=>c.key===STCGeo.normalize(s.city));if(known.length===1)s.province=known[0].prov;}
 if(s.province && !s.zone){const z=STCGeo.zoneFor({name:s.city,prov:s.province});s.region=z.region||'';s.zone=z.zone||'';s.geoWarning=z.warning||'';}
 // Una vecchia tariffa rinominata si traduce nell'etichetta attuale senza cambiare i prezzi.
 const current=TARIFFS.find(t=>t.region===s.region&&(t.zone===s.zone||t.aliases?.includes(s.zone)));
 if(current)s.zone=current.zone;
 renderShips();changed();toast('Destinatario e indirizzo recuperati');
}
function quoteCustomerChanged(){
 // Non associare silenziosamente lo stesso destinatario ad un cliente diverso.
 ships.forEach(s=>{s.recipientId=''});renderShips();changed();
}
/* STC 1.13: ricerca unica per destinatari salvati, loro indirizzi, località e CAP.
   Il catalogo dei comuni NON contiene vie o CAP certificati. Non si inventano indirizzi.
   Le province ambigue/speciali non ricevono automaticamente una zona tariffaria. */
function quoteSavedRecipientMatches(text){
 const key=STCGeo.normalize(text);
 if(key.length<2)return[];
 const entries=recipientListForClient();
 const ranked=entries.map(r=>{
  const fields=[r.name,r.address,r.city,r.cap].map(x=>STCGeo.normalize(x));
  let score=0;
  for(const f of fields){if(!f)continue;
   score=Math.max(score,f===key?100:f.startsWith(key)?75:f.includes(key)?45:0);
  }
  return {r,score};
 }).filter(x=>x.score>0);
 return ranked.sort((a,b)=>b.score-a.score||a.r.name.localeCompare(b.r.name,'it')).slice(0,6).map(x=>x.r);
}
function quoteLocationLabel(s){
 if(s.geoWarning)return s.geoWarning+' · Conferma la zona tariffaria manualmente.';
 if(s.province && s.region && s.zone)return '✓ '+s.city+' ('+s.province+') · '+s.region+' · Zona '+s.zone;
 if(s.province)return 'Comune '+s.city+' ('+s.province+') riconosciuto · Scegli la zona tariffaria.';
 if(s.city)return 'Seleziona il comune suggerito per individuare provincia e zona.';
 return 'Inizia a scrivere il comune oppure cerca un destinatario già salvato.';
}
function quoteUpdateLocationFields(id){
 const s=ships.find(x=>x.id===id);if(!s)return;
 const prov=$('shipProvince_'+id),reg=$('shipRegion_'+id),zone=$('shipZone_'+id),hint=$('shipCityHint_'+id);
 const address=$('shipAddress_'+id),cap=$('shipCap_'+id);
 if(address && document.activeElement!==address)address.value=s.address||'';
 if(cap && document.activeElement!==cap)cap.value=s.cap||'';
 if(prov && document.activeElement!==prov)prov.value=s.province||'';
 if(reg)reg.value=s.region||'';
 if(zone)zone.innerHTML=zoneOptions(s);
 if(hint){hint.textContent=quoteLocationLabel(s);hint.classList.toggle('geo-warning',!!s.geoWarning)}
}
function quoteApplyGeo(s,place){
 if(!place||!place.name||!place.prov)return;
 if(s.recipientId && STCGeo.normalize(s.city)!==STCGeo.normalize(place.name)){s.address='';s.cap='';}
 s.city=place.name;s.destination=place.name;s.province=place.prov;
 const z=STCGeo.zoneFor(place);
 s.region=z.region||'';s.zone=z.zone||'';
 s.geoSource='Comune '+place.name+' ('+place.prov+')';s.geoWarning=z.warning||'';
 s.recipientId='';
}
function quoteCityCandidates(id,value){
 const s=ships.find(x=>x.id===id),node=$('shipCityChoices_'+id);
 if(!s||!node)return;
 const candidates=STCGeo.find(value),normalized=STCGeo.normalize(value);
 const exact=candidates.filter(c=>c.key===normalized);
 if(exact.length===1){
  quoteApplyGeo(s,exact[0]);
  node.innerHTML='';
  const input=$('shipCity_'+id);if(input)input.value=exact[0].name;
  quoteUpdateLocationFields(id);changed();return;
 }
 node.innerHTML=candidates.map(c=>{
  const z=STCGeo.zoneFor(c);
  const label=z.zone?('Zona '+z.zone):('Da confermare: '+(z.warning||'zona non identificata'));
  return `<button type="button" data-city="${esc(c.name)}" data-prov="${esc(c.prov)}" data-id="${esc(id)}" onclick="selectShipCity(this.dataset.id,this.dataset.city,this.dataset.prov)"><strong>${esc(c.name)} (${esc(c.prov)})</strong><span>${esc(label)}</span></button>`;
 }).join('');
 const hint=$('shipCityHint_'+id);
 if(hint)hint.textContent=candidates.length?'Seleziona il comune corretto per riempire provincia, regione e zona.':normalized.length>2?'Comune non trovato. Completa i campi manualmente.':'Scrivi almeno 2 lettere per vedere i suggerimenti.';
}
function cityEdit(id,value){
 const s=ships.find(x=>x.id===id);if(!s)return;
 const changedCity=STCGeo.normalize(s.city)!==STCGeo.normalize(value);
 if(changedCity&&s.recipientId){s.address='';s.cap='';}
 s.city=value;s.destination=value;
 if(changedCity){s.province='';s.region='';s.zone='';s.geoSource='';s.geoWarning='';s.recipientId='';}
 quoteCityCandidates(id,value);
 quoteUpdateLocationFields(id);
 changed();
}
function selectShipCity(id,city,province){
 const s=ships.find(x=>x.id===id);if(!s)return;
 const place=STCGeo.find(city).find(c=>c.key===STCGeo.normalize(city)&&c.prov===province);
 if(!place)return toast('Comune non presente in elenco: inserisci i dati manualmente');
 quoteApplyGeo(s,place);renderShips();changed();
 if(s.geoWarning)toast('Zona particolare: conferma manualmente la tariffa');
}
function shipProvinceEdit(id,value){
 const s=ships.find(x=>x.id===id);if(!s)return;
 s.province=String(value).trim().toUpperCase().replace(/[^A-Z]/g,'').slice(0,2);
 s.recipientId='';s.geoSource='Provincia inserita manualmente';
 const matches=STCGeo.find(s.city).filter(c=>c.key===STCGeo.normalize(s.city)&&c.prov===s.province);
 if(matches.length===1){const z=STCGeo.zoneFor(matches[0]);s.region=z.region||'';s.zone=z.zone||'';s.geoWarning=z.warning||'';}
 else{s.region='';s.zone='';s.geoWarning=s.province.length===2?'Provincia e località da verificare':'';}
 quoteUpdateLocationFields(id);changed();
}
function quoteDestinationSearch(id,value){
 const s=ships.find(x=>x.id===id),node=$('shipDestResults_'+id),hint=$('shipDestSearchHint_'+id);
 if(!s||!node)return;
 const key=STCGeo.normalize(value);
 if(key.length<2){node.innerHTML='';if(hint)hint.textContent='Cerca un nome salvato, una via già registrata, un CAP già salvato oppure un comune.';return;}
 const saved=quoteSavedRecipientMatches(value);
 const places=STCGeo.find(value).slice(0,7);
 const savedHTML=saved.map(r=>`<button type="button" data-sid="${esc(id)}" data-rid="${esc(r.id)}" onclick="chooseSavedRecipient(this.dataset.sid,this.dataset.rid)"><strong>Destinatario: ${esc(r.name)}</strong><span>Indirizzo salvato · ${esc(r.address)}, ${esc(r.cap||'')} ${esc(r.city||'')}${r.province?' ('+esc(r.province)+')':''}</span></button>`).join('');
 const cityHTML=places.map(c=>{const z=STCGeo.zoneFor(c);return `<button type="button" data-sid="${esc(id)}" data-city="${esc(c.name)}" data-prov="${esc(c.prov)}" onclick="selectShipCity(this.dataset.sid,this.dataset.city,this.dataset.prov)"><strong>${esc(c.name)} (${esc(c.prov)})</strong><span>Comune · ${esc(z.zone?'Zona '+z.zone:'Zona da confermare')}</span></button>`}).join('');
 node.innerHTML=savedHTML+cityHTML;
 if(hint)hint.textContent=saved.length||places.length?'Seleziona un risultato: i campi si compilano automaticamente.': 'Nessun risultato. Scrivi manualmente l’indirizzo o aggiorna l’elenco comuni online.';
}
function quoteGeoRefreshMissing(){
 if(!Array.isArray(ships))return;
 for(const s of ships){
  if(!s.city||s.zone||s.region)continue;
  const exact=STCGeo.find(s.city).filter(c=>c.key===STCGeo.normalize(s.city));
  if(exact.length===1){quoteApplyGeo(s,exact[0]);quoteUpdateLocationFields(s.id)}
 }
}
function onRecipientAddressChanged(id,key,value){
 const s=ships.find(x=>x.id===id);if(!s)return;s[key]=value;s.recipientId='';changed();
}
async function saveRecipient(id,quiet=false){
 const ship=ships.find(s=>s.id===id);if(!ship)return false;
 const customer=$('customer').value.trim(),name=(ship.recipientName||'').trim(),city=(ship.city||'').trim(),address=(ship.address||'').trim();
 if(!customer||!name||!city||!address){if(!quiet)toast('Seleziona cliente e completa destinatario, via e città');return false}
 const match=recipientListForClient().find(r=>recipientNorm(r.name)===recipientNorm(name)&&recipientNorm(r.city)===recipientNorm(city)&&recipientNorm(r.address)===recipientNorm(address));
 if(match){ship.recipientId=match.id;if(!quiet)toast('Destinatario già in rubrica');return true}
 // Stesso nome può avere più sedi: si crea una seconda anagrafica, non si sovrascrive.
 const rec={id:uid(),customer,customerId:STCExtra.customerId(customer),name,address,city,province:ship.province||'',cap:(ship.cap||'').trim(),region:ship.region||'',zone:ship.zone||'',created:new Date().toISOString()};
 recipientStore().push(rec);ship.recipientId=rec.id;
 if(!quiet){if(await persist()){renderShips();toast('Destinatario salvato per '+customer)}}
 return true;
}
function recipientSummary(){
 const node=$('recipientDirectory');if(!node)return;
 const data=recipientStore().slice().sort((a,b)=>a.customer.localeCompare(b.customer,'it')||a.name.localeCompare(b.name,'it'));
 node.innerHTML=data.length?data.map(r=>`<div style="border-bottom:1px solid #e7edf1;padding:10px 0"><strong>${esc(r.name)}</strong> · ${esc(r.customer)}<div class="muted">${esc(r.address)}, ${esc(r.cap||'')} ${esc(r.city)} · ${esc(r.zone||'Zona da scegliere')}</div></div>`).join(''):'Nessun destinatario salvato. Li puoi creare direttamente dal Preventivo.';
}

function renderShips(){
 ships.forEach(shipLegacyUpgrade);
 $('ships').innerHTML=ships.map((s,n)=>`<div class="ship"><div class="row between"><h3>Spedizione ${n+1}</h3><button class="danger" onclick="removeShip('${s.id}')">Rimuovi</button></div>
 <p class="muted" style="margin:6px 0 13px">Il cliente che paga il trasporto è selezionato sopra. Qui inserisci chi riceve la merce e dove consegnarla.</p>
 <div class="quote-search-panel"><label class="geo-field quote-search-label">🔎 Ricerca rapida consegna
 <input type="search" placeholder="Destinatario, via salvata, città o CAP salvato" autocomplete="off" oninput="quoteDestinationSearch('${s.id}',this.value)" aria-label="Ricerca rapida consegna">
 <span class="geo-hint" id="shipDestSearchHint_${s.id}">Cerca un nome salvato, una via già registrata, un CAP già salvato oppure un comune.</span>
 <div class="quote-dest-results" id="shipDestResults_${s.id}"></div></label><div class="quote-search-note">I dati di via e CAP si recuperano dalla rubrica. Per un indirizzo nuovo, inserisci via e numero civico: il Comune determina provincia e zona tariffaria quando è univoco.</div></div>
 <div class="fields">
 <label class="wide">Destinatario / azienda che riceve *<input id="recipient_${s.id}" placeholder="Es. Gino" autocomplete="off" value="${esc(s.recipientName)}" oninput="recipientNameEdit('${s.id}',this.value)" onfocus="recipientChoices('${s.id}')"><span class="muted" id="recipientHint_${s.id}"></span><div id="recipientChoices_${s.id}" class="recipient-suggestions"></div></label>
 <label class="wide">Via e numero civico *<input placeholder="Es. Via Roma 12" value="${esc(s.address)}" oninput="onRecipientAddressChanged('${s.id}','address',this.value)"></label>
 <label class="wide geo-field">Città / Comune di destinazione *<input id="shipCity_${s.id}" placeholder="Es. Cerea, Verona, Fiorano Modenese" autocomplete="off" value="${esc(s.city)}" oninput="cityEdit('${s.id}',this.value)"><span class="geo-hint ${s.geoWarning?'geo-warning':''}" id="shipCityHint_${s.id}">${esc(quoteLocationLabel(s))}</span><div id="shipCityChoices_${s.id}" class="quote-dest-results"></div></label>
 <label>CAP <small class="muted">(se noto)</small><input id="shipCap_${s.id}" inputmode="numeric" maxlength="5" placeholder="Da inserire se non salvato" value="${esc(s.cap)}" oninput="onRecipientAddressChanged('${s.id}','cap',this.value)"></label>
 <label>Provincia (sigla)<input id="shipProvince_${s.id}" maxlength="2" placeholder="Es. VR" autocomplete="off" value="${esc(s.province||'')}" oninput="shipProvinceEdit('${s.id}',this.value)"></label>
 <label>Regione<select id="shipRegion_${s.id}" onchange="field('${s.id}','region',this.value)">${regionOptions(s.region)}</select></label>
 <label class="wide">Zona tariffaria<select id="shipZone_${s.id}" onchange="field('${s.id}','zone',this.value)">${zoneOptions(s)}</select></label>
 </div><div class="row" style="margin:12px 0 16px"><button type="button" class="alt" onclick="saveRecipient('${s.id}')">Salva destinatario in rubrica</button><span class="muted">Il destinatario verrà memorizzato anche quando salvi il preventivo completo.</span></div>
 <div class="fields"><label>Peso totale kg (alternativo ai gruppi)<input type="number" min="0" step="0.01" value="${esc(s.kg)}" oninput="field('${s.id}','kg',this.value)"></label><label>Volume totale m³ — automatico oppure diretto<input id="quoteVolume_${s.id}" type="text" inputmode="decimal" placeholder="Scrivi i m³ oppure le misure sotto" value="${esc(quoteVolumeDisplay(s))}" oninput="quoteVolumeEdit('${s.id}',this.value)"><small class="muted" id="quoteVolumeHint_${s.id}">${quoteVolumeSource(s)==='manual'?'m³ digitati: le misure non si sommano.':'m³ calcolati dalle misure; puoi modificarli direttamente.'}</small></label></div>
 <div class="row between" style="margin:17px 0 8px"><strong>Colli e bancali</strong><button class="alt" onclick="addItem('${s.id}')">+ Gruppo</button></div>${s.items.map((i,j)=>`<div class="item"><div class="row between"><strong>Gruppo ${j+1}</strong><button class="danger" onclick="removeItem('${s.id}','${i.id}')">✕</button></div><div class="fields"><label>Tipo<select onchange="itemField('${s.id}','${i.id}','type',this.value)"><option ${i.type==='Collo'?'selected':''}>Collo</option><option ${i.type==='Bancale'?'selected':''}>Bancale</option></select></label><label>Quantità<input type="number" min="1" step="1" value="${esc(i.qty)}" oninput="itemField('${s.id}','${i.id}','qty',this.value)"></label><label>Peso kg per unità<input type="number" min="0" step="0.01" value="${esc(i.kg)}" oninput="itemField('${s.id}','${i.id}','kg',this.value)"></label><label>Lunghezza cm<input type="number" min="0" step="0.1" value="${esc(i.l)}" oninput="itemField('${s.id}','${i.id}','l',this.value)"></label><label>Larghezza cm<input type="number" min="0" step="0.1" value="${esc(i.w)}" oninput="itemField('${s.id}','${i.id}','w',this.value)"></label><label>Altezza cm<input type="number" min="0" step="0.1" value="${esc(i.h)}" oninput="itemField('${s.id}','${i.id}','h',this.value)"></label></div></div>`).join('')}<div class="fields"><label>Supplemento destinazione €<input type="number" min="0" step="0.01" value="${esc(s.supp)}" oninput="field('${s.id}','supp',this.value)"></label></div><div class="result" id="result_${s.id}"></div></div>`).join('');
 ships.forEach(s=>{if(s.recipientName)recipientChoices(s.id)});
 recalc();
}
function calcShip(s){
 const frozen=quoteTariffLock?.find(x=>x&&x.shipId===s.id);
 // La stessa spedizione conserva il listino originale. Per cambiare zona usare un nuovo preventivo.
 if(frozen && (frozen.region!==s.region || (frozen.zone!==s.zone && !frozen.aliases.includes(s.zone)))){
  return {valid:false,reason:'Zona diversa da quella originale: duplica il preventivo prima di cambiare destinazione',q:0,kg:0,vol:0};
 }
 const tariffs=frozen?[frozen]:TARIFFS;
 const source=quoteVolumeSource(s);
 // Se il volume è manuale, le dimensioni restano nella scheda ma NON concorrono al volume.
 // I pesi dei colli restano validi anche in questa modalità.
 const calcInput=source==='manual'?{...s,items:(s.items||[]).map(i=>({...i,l:'',w:'',h:''}))}:s;
  const r=STCCalc.compute(calcInput,tariffs,{allowVolumeOverride:source==='manual',requireCompleteWhenStarted:true,requireVolume:source==='manual'});
 return {...r,kg:r.weightKg,vol:r.volumeM3,q:r.chargeableQ,reason:r.reason};
}

function currentData(){return{customer:$('customer').value.trim(),reference:$('reference').value.trim(),date:$('quoteDate').value,deliveryDate:$('quoteDeliveryDate').value,notes:$('notes').value,supp:num($('supp').value),markup:num($('markup').value),discount:num($('discount').value),vat:num($('vat').value),manualQuotePrice:$('manualQuotePrice').value.trim(),manualPriceReason:$('manualPriceReason').value.trim(),sourceMailId:typeof entActiveMailId==='string'?entActiveMailId:'',serviceBundle:STCExtra.capture(),customerId:STCExtra.customerId($('customer').value),shipments:JSON.parse(JSON.stringify(ships))}}
function recalc(){
 let cost=0,issues=[];
 for(const s of (STCExtra.shippingActive()?ships:[])){
  const r=calcShip(s);
  if(r.valid)cost+=r.cost;else issues.push(r.reason);
  const node=$('result_'+s.id);
  if(node)node.textContent=r.valid?(isAdmin()?money(r.cost)+' · '+r.reason:'Peso tassabile · '+r.q+' q'):r.reason;
  quoteRefreshVolume(s.id);
 }
 for(const id of ['supp','markup','discount','vat']){const raw=String($(id).value??'').trim();if(raw&&!/^(?:\d+(?:[.,]\d+)?|[.,]\d+)$/.test(raw))issues.push('Valore non valido nel campo '+id)}
 const serviceResult=STCExtra.price(cost);issues.push(...serviceResult.issues);
 const calculatedCents=Math.max(0,Math.round((serviceResult.automaticCents/100+num($('supp').value)+num($('markup').value)-num($('discount').value))*100));
 const calculatedTaxable=calculatedCents/100;
 STCExtra._lastAutomaticCents=calculatedCents;
 const price=STCExtra.quotePriceInput(quotePriceInput());
 if(!price.valid)issues.push(price.reason);
 const taxableCents=price.manual&&price.valid?price.cents:calculatedCents;
 const taxable=taxableCents/100;
 const vatPercent=num($('vat').value);
 const vatCents=Math.round(taxableCents*vatPercent/100);
 const vatAmount=vatCents/100,total=(taxableCents+vatCents)/100;
 const priceInfo=$('manualPriceInfo');
 if(priceInfo)priceInfo.textContent=price.manual?(price.valid?`Prezzo automatico: ${money(calculatedTaxable)} · Differenza: ${money(taxable-calculatedTaxable)}. Il tariffario non cambia.`:price.reason):`Prezzo automatico: ${money(calculatedTaxable)}. Lascia vuoto il campo per usare sempre questo risultato.`;
 $('total').textContent=isAdmin()?`Costo trasporto: ${money(cost)} · Prezzo automatico: ${money(calculatedTaxable)} · Imponibile finale: ${money(taxable)} · IVA: ${money(vatAmount)} · Totale: ${money(total)}`:`Imponibile finale: ${money(taxable)} · IVA: ${money(vatAmount)} · Totale: ${money(total)}`;
 $('issues').textContent=issues.join(' · ');
 return{cost,calculatedTaxable,taxable,vatAmount,total,serviceLines:serviceResult.lines,serviceSnapshot:serviceResult,manualPriceApplied:price.manual&&price.valid,manualPriceReason:$('manualPriceReason').value.trim(),issues};
}
function changed(){recalc();clearTimeout(timer);$('draftInfo').textContent='Salvataggio bozza…';timer=setTimeout(async()=>{state.draft={...currentData(),editing};if(await persist())$('draftInfo').textContent='Bozza salvata sul dispositivo'},500)}
let quoteSaveBusy=false;
async function saveQuote(){
 if(quoteSaveBusy)return;quoteSaveBusy=true;const saveButton=$('quoteSaveButton');if(saveButton)saveButton.disabled=true;
 try{
 const r=recalc(),d=currentData();
 if(!d.customer)return toast('Seleziona il cliente');if(!calendarDateValid(d.deliveryDate||''))return toast('Indica la data di consegna prevista per il calendario');
 if(r.issues.length)return toast('Completa spedizione: '+r.issues[0]);
 for(const ship of ships){
  shipLegacyUpgrade(ship);
  if(ship.recipientName&&!ship.city)return toast('Inserisci la città del destinatario');
  if(ship.recipientName&&ship.address&&ship.city)await saveRecipient(ship.id,true);
 }
 const old=state.quotes.find(x=>x.id===editing);
 if(old?.status==='Accettato'&&JSON.stringify(old.serviceBundle||{})!==JSON.stringify(d.serviceBundle||{})&& !confirm('Questo preventivo è già accettato. La modifica potrebbe richiedere una revisione del deposito programmato. Vuoi proseguire?'))return;
 if(old&&!ownsQuote(old))return toast('Preventivo non autorizzato');
 const id=editing||uid(),next=old?null:nextLocalQuoteCode();
 const snapshot=(STCExtra.shippingActive()?ships:[]).map(ship=>{
  const frozen=quoteTariffLock?.find(x=>x&&x.shipId===ship.id);
  const t=frozen||TARIFFS.find(t=>t.region===ship.region&&(t.zone===ship.zone||t.aliases?.includes(ship.zone)));
  return freezeTariff(t,ship.id);
 });
 if(snapshot.some(x=>!x))return toast('Tariffa non disponibile: impossibile salvare');
 const now=new Date().toISOString();
 const quote={...d,shipments:JSON.parse(JSON.stringify(STCExtra.shippingActive()?ships:[])),id,
  code:old?.code||next.code,created:old?.created||now,createdBy:old?.createdBy||activeUser?.id||'',updated:now,
  status:old?.status||'Bozza',statusHistory:[...(old?.statusHistory||[])],
  auditTrail:[...(old?.auditTrail||[]),{
   when:now,actor:activeUser?.name||'Locale',action:old?'Aggiornamento preventivo':'Creazione preventivo',
   automaticPrice:r.calculatedTaxable,finalPrice:r.taxable,
   previousPrice:old?.totals?.taxable??null,
   manualPriceApplied:r.manualPriceApplied,
   manualPriceReason:d.manualPriceReason||''
  }].slice(-150),
  totals:r,tariffSnapshot:snapshot.map(({shipId,...row})=>({...row})),
  servicePriceSnapshot:STCExtra.snapshot(r,d.serviceBundle),workId:old?.workId||uid()
 };
 const priorQuotes=state.quotes,priorDraft=state.draft,priorSequences=state.quoteSequences;
 state.quotes=[quote,...state.quotes.filter(x=>x.id!==id)];
 if(next)state.quoteSequences={...(priorSequences||{}),[next.year]:next.number};
 state.draft={...d,editing:id};
 if(!await persist()){
  state.quotes=priorQuotes;state.draft=priorDraft;state.quoteSequences=priorSequences;
  return;
 }
 editing=id;quoteTariffLock=snapshot;STCExtra.afterQuoteSaved(quote);
 toast(old?'Preventivo aggiornato senza cambiare stato o listino':'Preventivo salvato');
 renderDashboard();renderRefs();
 }finally{quoteSaveBusy=false;if(saveButton)saveButton.disabled=false}
}
function openQuote(id,duplicate=false){
 const q=state.quotes.find(x=>x.id===id);
 if(!q||!ownsQuote(q))return toast('Preventivo non autorizzato');
 editing=duplicate?null:q.id;if(typeof entActiveMailId!=='undefined')entActiveMailId=duplicate?'':(q.sourceMailId||'');
 for(const [k,v] of Object.entries({customer:q.customer,reference:q.reference,quoteDate:q.date,quoteDeliveryDate:q.deliveryDate||'',notes:q.notes,supp:q.supp,markup:q.markup,discount:q.discount,vat:q.vat,manualQuotePrice:q.manualQuotePrice??'',manualPriceReason:q.manualPriceReason??''}))$(k).value=v??'';
 ships=JSON.parse(JSON.stringify(q.shipments||[]));ships.forEach(shipLegacyUpgrade);STCExtra.restoreQuote(q.serviceBundle); 
 if(duplicate)ships.forEach(s=>{s.id=uid();s.items.forEach(i=>i.id=uid())});
 quoteTariffLock=Array.isArray(q.tariffSnapshot)?q.tariffSnapshot.map((snapshot,i)=>freezeTariff(snapshot,ships[i]?.id)).filter(Boolean):null;
 // Le vecchie bozze senza snapshot continuano a funzionare, ma non hanno i prezzi storici certificabili.
 $('quoteTitle').textContent=duplicate?'Duplica preventivo · tariffa originale':'Modifica '+q.code;
 renderShips();STCExtra.updateQuoteControls();go('quote');changed();
 if(!duplicate&&quoteTariffLock?.length)toast('Tariffe originali conservate');
}
async function deleteQuote(id){if(!isAdmin())return toast('Operazione riservata');if(state.calendarRuns?.some(r=>r.linkedQuoteId===id)||state.expectedReceipts?.some(r=>r.quoteId===id)||state.invoices?.some(i=>i.status!=='Annullata'&&i.lines?.some(l=>l.sourceKey==='quote:'+id)))return toast('Documento collegato a giro, deposito o fattura: non si può eliminare. Usa lo stato Annullato e conserva lo storico.');if(!confirm('Eliminare definitivamente questo preventivo?'))return;state.quotes=state.quotes.filter(x=>x.id!==id);await persist();renderArchive();renderDashboard()}
function renderDashboard(){renderKPIs();calendarRender();if(typeof entDashboard==='function')entDashboard();const visible=state.quotes.filter(ownsQuote);$('countQuotes').textContent=visible.length;$('countClients').textContent=state.customers.length;$('recent').innerHTML=visible.length?visible.slice(0,6).map(q=>`<div class="row between" style="border-bottom:1px solid #e8eef3;padding:12px 0"><div><strong>${esc(q.code)}</strong> · ${esc(q.customer)}<div class="muted">${money(q.totals?.total)} · ${esc(q.status)}</div></div><button class="alt" onclick="openQuote('${q.id}')">Apri</button></div>`).join(''):'Nessun preventivo. Premi “Nuovo preventivo” per iniziare.'}
async function setStatus(id,status){
 if(!isAdmin())return toast('Operazione riservata');
 const q=state.quotes.find(x=>x.id===id);
 if(!q||!['Bozza','Inviato','Accettato','Rifiutato','Annullato'].includes(status))return;
 if(q.status===status)return;
 const previous={status:q.status,updated:q.updated,statusHistory:q.statusHistory,auditTrail:q.auditTrail};
 const now=new Date().toISOString();
 q.status=status;q.updated=now;
 q.statusHistory=[...(q.statusHistory||[]),{when:now,actor:activeUser?.name||'Locale',from:previous.status,to:status}].slice(-150);
 q.auditTrail=[...(q.auditTrail||[]),{when:now,actor:activeUser?.name||'Locale',action:'Stato: '+previous.status+' → '+status}].slice(-150);
 if(!await persist()){
  Object.assign(q,previous);return toast('Cambio stato non salvato');
 }
 if(status==='Accettato')await STCExtra.afterQuoteAccepted(q);
 else if(['Rifiutato','Annullato'].includes(status))await STCExtra.afterQuoteRevoked(q);
 renderArchive();renderDashboard();toast('Stato aggiornato');
}
function renderArchive(){const term=$('searchQuote').value.toLowerCase();const arr=state.quotes.filter(q=>ownsQuote(q)&&(q.customer+' '+q.code+' '+q.reference).toLowerCase().includes(term));$('archiveTable').innerHTML=arr.length?`<table><thead><tr><th>Codice</th><th>Cliente</th><th>Totale</th><th>Azioni</th></tr></thead><tbody>${arr.map(q=>`<tr><td>${esc(q.code)}</td><td>${esc(q.customer)}</td><td>${money(q.totals?.total)}</td><td><div class="row"><select class="admin-only" aria-label="Stato preventivo" style="min-width:150px" onchange="setStatus('${q.id}',this.value)"><option value="Bozza" ${q.status==='Bozza'?'selected':''}>Bozza</option><option value="Inviato" ${q.status==='Inviato'?'selected':''}>Inviato</option><option value="Accettato" ${q.status==='Accettato'?'selected':''}>Accettato</option><option value="Rifiutato" ${q.status==='Rifiutato'?'selected':''}>Rifiutato</option><option value="Annullato" ${q.status==='Annullato'?'selected':''}>Annullato</option></select><button class="alt" onclick="openQuote('${q.id}')">Apri</button><button class="alt" onclick="STCExtra.pdfSaved('${q.id}')">PDF A4</button><button class="alt" onclick="openQuote('${q.id}',true)">Duplica</button><button class="danger" onclick="deleteQuote('${q.id}')">Elimina</button></div></td></tr>`).join('')}</tbody></table>`:'Nessun risultato.'}
async function addCustomer(){const name=$('cName').value.trim();if(!name)return toast('Inserisci ragione sociale');if(state.customers.some(c=>c.name.trim().toLowerCase()===name.toLowerCase()))return toast('Cliente già presente in rubrica');state.customers.push({id:uid(),name,email:$('cEmail').value,phone:$('cPhone').value});if(await persist()){for(const id of ['cName','cEmail','cPhone'])$(id).value='';renderCustomers();if($('quickRunClient')&&typeof entClients==='function')$('quickRunClient').innerHTML=entClients();toast('Cliente salvato')}}
function renderCustomers(){const selected=$('customer').value;$('customer').innerHTML='<option value="">Seleziona un cliente</option>'+state.customers.map(c=>`<option value="${esc(c.name)}">${esc(c.name)}</option>`).join('');$('customer').value=selected;renderRefs();$('customerList').innerHTML=state.customers.length?state.customers.map(c=>`<div class="row between" style="padding:12px;border-bottom:1px solid #e8eef3"><div><strong>${esc(c.name)}</strong><div class="muted">${esc(c.email)} · ${esc(c.phone)}</div></div><button class="alt" onclick="useCustomer('${c.id}')">Usa</button></div>`).join(''):'Nessun cliente.';recipientSummary();$('clientNames').innerHTML=state.customers.map(c=>`<option value="${esc(c.name)}"></option>`).join('')}
function quickCustomer(){const name=prompt('Ragione sociale del nuovo cliente:');if(!name?.trim())return;const match=state.customers.find(c=>c.name.trim().toLowerCase()===name.trim().toLowerCase());if(match){$('customer').value=match.name;return changed()}state.customers.push({id:uid(),name:name.trim(),email:'',phone:''});persist();renderCustomers();$('customer').value=name.trim();changed();toast('Cliente aggiunto alla rubrica')}
function renderRefs(){const vals=[...new Set(state.quotes.map(q=>q.reference?.trim()).filter(Boolean))].sort((a,b)=>a.localeCompare(b,'it'));$('refNames').innerHTML=vals.map(x=>`<option value="${esc(x)}"></option>`).join('')}
function useCustomer(id){const c=state.customers.find(x=>x.id===id);if(c){$('customer').value=c.name;go('quote');changed()}}
const TARIFF_LABELS=['Minimo fino a 3 quintali (€)','Oltre 3–10 q (€/q)','Oltre 10–15 q (€/q)','Oltre 15–20 q (€/q)','Oltre 20–30 q (€/q)','Oltre 30–40 q (€/q)','Oltre 40–50 q (€/q)'];
function zoneLabelValid(raw){const zone=String(raw||'').trim().toUpperCase().replace(/\s*[-–]\s*/g,'-').replace(/\s+/g,' ');if(zone.length<2||zone.length>70||!/^[A-Z0-9À-Ü+ .()/_-]+$/.test(zone))throw Error('Nome zona non valido (2–70 caratteri)');return zone}
function tariffKey(t){return t.region+'||'+(t.originalZone||t.zone)}
function tariffOriginal(region,zone){return ORIGINAL_TARIFFS.find(t=>t.region===region&&t.zone===zone)}
function zoneConflict(region,zone,skip){return TARIFFS.some(t=>t!==skip&&t.region===region&&t.zone===zone)}
function applySavedTariffs(){
 TARIFFS.splice(0,TARIFFS.length,...ORIGINAL_TARIFFS.map(t=>({...t,cents:[...t.cents],originalZone:t.zone})));
 const overrides=state.tariffOverrides||{},names=state.tariffZoneNames||{},allAliases=state.tariffZoneAliases||{};
 for(const t of TARIFFS){const entry=overrides[tariffKey(t)];const valid=entry&&Array.isArray(entry.cents)&&entry.cents.length===7&&entry.cents.every(v=>Number.isSafeInteger(v)&&v>=0&&v<=100000000);
  if(valid){t.cents=[...entry.cents];t.supplementCents=Number.isSafeInteger(entry.supplementCents)&&entry.supplementCents>=0?entry.supplementCents:0;}
  // La nuova etichetta mantiene la vecchia sigla come alias per bozze/preventivi esistenti.
  const desired=names[tariffKey(t)]||(t.zone==='MI-BG'&&t.region==='LOMBARDIA'?'MI-BG-MB':t.zone);
  try{t.zone=zoneLabelValid(desired)}catch(e){/* Ignora nomi corrotti nel backup */}
  t.aliases=[...new Set([t.originalZone,...(allAliases[tariffKey(t)]||[])])];
 }
 for(const d of state.tariffCustomZones||[]){if(!d||typeof d.region!=='string'||typeof d.zone!=='string'||!Array.isArray(d.cents)||d.cents.length!==7||!d.cents.every(v=>Number.isSafeInteger(v)&&v>=0&&v<=100000000))continue;
  if(zoneConflict(d.region,d.zone))continue;
  TARIFFS.push({region:d.region,zone:d.zone,cents:[...d.cents],supplementCents:d.supplementCents||0,customId:d.id,aliases:Array.isArray(d.aliases)?d.aliases:[]});
 }
}
function syncCurrentZoneAliases(){
 // Non si riscrivono preventivi storici o snapshot: solo le bozze aperte.
 const fix=s=>{if(!s)return;const match=TARIFFS.find(t=>t.region===s.region&&t.aliases?.includes(s.zone));if(match)s.zone=match.zone};
 (state.draft?.shipments||[]).forEach(fix);(state.quickCalcDraft||[]).forEach(fix);
 if(typeof ships!=='undefined')ships.forEach(fix);if(typeof fastShips!=='undefined')fastShips.forEach(fix);
}
function renderTariffs(){
 const term=$('tariffFilter').value.toLocaleLowerCase('it');
 const rows=TARIFFS.filter(t=>(t.region+' '+t.zone).toLocaleLowerCase('it').includes(term));
 $('tariffTable').innerHTML=`<table><thead><tr><th>Regione</th><th>Zona</th><th>Min. ≤3 q</th><th>3,1–10</th><th>10,1–15</th><th>15,1–20</th><th>20,1–30</th><th>30,1–40</th><th>40,1–50</th><th>Supplemento €</th><th>Gestione</th></tr></thead><tbody>${rows.map(t=>`<tr><td>${esc(t.region)}</td><td><strong>${esc(t.zone)}</strong></td>${t.cents.map(c=>`<td>${money(c/100)}</td>`).join('')}<td>${money((t.supplementCents||0)/100)}</td><td><button class="alt" data-reg="${esc(t.region)}" data-zone="${esc(t.zone)}" onclick="openTariffEditor(this.dataset.reg,this.dataset.zone)">Modifica</button></td></tr>`).join('')}</tbody></table>`;
 const hist=$('tariffHistory');if(hist){const data=Array.isArray(state.tariffHistory)?state.tariffHistory:[];hist.innerHTML=data.length?data.slice(0,20).map(x=>`<div class="tariff-history-item"><strong>${esc(x.region)} · ${esc(x.zone)}</strong><span>${esc(x.date)} · ${esc(x.actor)} · ${esc(x.reason||'Modifica tariffario')}</span>${x.kind!=='add'?`<button class="alt" data-hid="${esc(x.id)}" onclick="restoreTariffHistory(this.dataset.hid)">Ripristina questi valori</button>`:''}</div>`).join(''):'Nessuna modifica registrata: tariffario originale in uso.';}
 $('tariffVersionLabel').textContent='Revisione locale '+(state.tariffRevision||0)+' · '+rows.length+' zone visibili su '+TARIFFS.length;
}
function tariffMoneyParse(raw){const t=String(raw??'').trim().replace(/\s/g,'').replace(',','.');if(!/^(?:\d{1,7})(?:\.\d{1,2})?$/.test(t))throw Error('Inserisci un importo positivo con al massimo 2 decimali');const n=Math.round(Number(t)*100);if(!Number.isSafeInteger(n)||n<0||n>100000000)throw Error('Importo non valido');return n}
function tariffPriceFields(row){return TARIFF_LABELS.map((label,i)=>`<label>${label}<input class="tariffValue" inputmode="decimal" autocomplete="off" value="${row?(row.cents[i]/100).toFixed(2).replace('.',','):''}" placeholder="0,00"></label>`).join('')+`<label>Supplemento tariffario fisso (€)<input id="tariffSupplement" inputmode="decimal" value="${row?((row.supplementCents||0)/100).toFixed(2).replace('.',','):'0,00'}"></label>`}
function openTariffEditor(region,zone){
 if(!isAdmin())return toast('Solo l’amministratore può modificare le tariffe');const row=TARIFFS.find(t=>t.region===region&&t.zone===zone);if(!row)return;
 const box=$('tariffEditBox');$('tariffEditTitle').textContent='Modifica · '+region+' · '+zone;
 $('tariffEditFields').innerHTML=`<label class="full">Nome della zona / sigle province<input id="tariffZoneName" maxlength="70" value="${esc(row.zone)}" placeholder="Es. MI-BG-MB"></label>`+tariffPriceFields(row);
 $('tariffReason').value='';$('tariffEditError').textContent='';box.dataset.region=region;box.dataset.zone=zone;box.classList.remove('hidden');box.scrollIntoView({behavior:'smooth',block:'start'});
}
function closeTariffEditor(){$('tariffEditBox').classList.add('hidden')}
async function commitTariffChange(region,zone,values,supp,reason,newZone){
 if(!isAdmin()||!vaultEnabled)throw Error('Accesso amministratore richiesto');
 const row=TARIFFS.find(t=>t.region===region&&(t.zone===zone||t.aliases?.includes(zone)));if(!row)throw Error('Zona inesistente');
 if(!Array.isArray(values)||values.length!==7||values.some(v=>!Number.isSafeInteger(v)||v<0)||!Number.isSafeInteger(supp)||supp<0)throw Error('Tariffe non valide');
 const renamed=zoneLabelValid(newZone||row.zone);if(zoneConflict(region,renamed,row))throw Error('Questa zona è già presente nella regione');
 const prior={zone:row.zone,cents:[...row.cents],supplementCents:row.supplementCents||0};
 if(prior.zone===renamed&&prior.cents.every((x,i)=>x===values[i])&&prior.supplementCents===supp)throw Error('Nessuna variazione da salvare');
 const priorState={tariffOverrides:structuredClone(state.tariffOverrides||{}),tariffZoneNames:structuredClone(state.tariffZoneNames||{}),tariffZoneAliases:structuredClone(state.tariffZoneAliases||{}),tariffCustomZones:structuredClone(state.tariffCustomZones||[]),tariffHistory:structuredClone(state.tariffHistory||[]),tariffRevision:state.tariffRevision||0};
 const oldName=row.zone;
 try{
  if(row.customId){const item=(state.tariffCustomZones||[]).find(t=>t.id===row.customId);if(!item)throw Error('Zona personalizzata non disponibile');
   item.aliases=[...new Set([...(item.aliases||[]),oldName])];item.zone=renamed;item.cents=[...values];item.supplementCents=supp;
  }else{
   const key=tariffKey(row),original=tariffOriginal(region,row.originalZone);
   if(!state.tariffZoneNames)state.tariffZoneNames={};state.tariffZoneNames[key]=renamed;
   if(!state.tariffZoneAliases)state.tariffZoneAliases={};
   state.tariffZoneAliases[key]=[...new Set([...(state.tariffZoneAliases[key]||[]),oldName])];
   if(!state.tariffOverrides)state.tariffOverrides={};
   if(original&&values.every((x,i)=>x===original.cents[i])&&supp===0)delete state.tariffOverrides[key];else state.tariffOverrides[key]={cents:[...values],supplementCents:supp};
  }
  state.tariffRevision=priorState.tariffRevision+1;
  state.tariffHistory=[{id:uid(),kind:'edit',date:new Date().toLocaleString('it-IT'),actor:activeUser.name,region,zone:oldName,reason:reason||'Modifica manuale',before:prior,after:{zone:renamed,cents:[...values],supplementCents:supp},revision:state.tariffRevision,customId:row.customId||null},...priorState.tariffHistory].slice(0,100);
  if(!await persist())throw Error('Salvataggio non riuscito');
  applySavedTariffs();syncCurrentZoneAliases();renderTariffs();renderShips();quickRender();
 }catch(e){Object.assign(state,priorState);applySavedTariffs();throw e}
}
async function saveTariffEditor(){if(!isAdmin())return toast('Accesso riservato');const box=$('tariffEditBox'),region=box.dataset.region,zone=box.dataset.zone;
 const btn=$('tariffSaveBtn');btn.disabled=true;
 try{const newZone=zoneLabelValid($('tariffZoneName').value);const values=[...document.querySelectorAll('#tariffEditFields .tariffValue')].map(el=>tariffMoneyParse(el.value));const supp=tariffMoneyParse($('tariffSupplement').value);const reason=$('tariffReason').value.trim();if(!reason)throw Error('Inserisci il motivo della modifica');
  if(!confirm('Confermi la nuova zona '+newZone+'? I prossimi calcoli useranno questa configurazione sul dispositivo.'))return;
  await commitTariffChange(region,zone,values,supp,reason,newZone);closeTariffEditor();toast('Tariffario salvato · revisione '+state.tariffRevision);
 }catch(e){toast(e.message);$('tariffEditError').textContent=e.message}finally{btn.disabled=false}}
function showAddTariffZone(){if(!isAdmin())return toast('Accesso riservato');
 $('tariffNewRegionList').innerHTML=[...new Set(TARIFFS.map(t=>t.region))].map(r=>`<option value="${esc(r)}"></option>`).join('');
 $('tariffNewRegion').value='';$('tariffNewZone').value='';$('tariffNewReason').value='';$('tariffAddError').textContent='';
 $('tariffAddFields').innerHTML=tariffPriceFields(null).replace('id="tariffSupplement"','id="tariffNewSupplement"');
 $('tariffAddBox').classList.remove('hidden');$('tariffAddBox').scrollIntoView({behavior:'smooth',block:'start'});
}
async function saveNewTariffZone(){if(!isAdmin()||!vaultEnabled)return toast('Solo amministratore');
 try{
  const region=String($('tariffNewRegion').value||'').trim().toUpperCase().replace(/\s+/g,' '),zone=zoneLabelValid($('tariffNewZone').value),reason=$('tariffNewReason').value.trim();
  if(!region||region.length>55||!reason)throw Error('Inserisci regione e motivo della creazione');if(zoneConflict(region,zone))throw Error('Zona già esistente nella regione');
  const values=[...document.querySelectorAll('#tariffAddFields .tariffValue')].map(el=>tariffMoneyParse(el.value)),supp=tariffMoneyParse($('tariffNewSupplement').value);
  if(!confirm('Creare '+region+' · '+zone+' con questi prezzi?'))return;
  const previous={custom:structuredClone(state.tariffCustomZones||[]),history:structuredClone(state.tariffHistory||[]),revision:state.tariffRevision||0};
  try{
   state.tariffCustomZones=[...previous.custom,{id:uid(),region,zone,cents:values,supplementCents:supp,aliases:[]}];state.tariffRevision=previous.revision+1;
   state.tariffHistory=[{id:uid(),kind:'add',date:new Date().toLocaleString('it-IT'),actor:activeUser.name,region,zone,reason,before:null,after:{zone,cents:values,supplementCents:supp},revision:state.tariffRevision},...previous.history].slice(0,100);
   if(!await persist())throw Error('Salvataggio non riuscito');applySavedTariffs();renderTariffs();renderShips();quickRender();$('tariffAddBox').classList.add('hidden');toast('Nuova zona creata');
  }catch(e){state.tariffCustomZones=previous.custom;state.tariffHistory=previous.history;state.tariffRevision=previous.revision;applySavedTariffs();throw e}
 }catch(e){$('tariffAddError').textContent=e.message;toast(e.message)}
}
async function restoreTariffHistory(id){if(!isAdmin())return;const h=(state.tariffHistory||[]).find(x=>x.id===id);if(!h||!h.before)return;
 const row=h.customId?TARIFFS.find(t=>t.customId===h.customId):TARIFFS.find(t=>t.region===h.region&&(t.zone===h.zone||t.originalZone===h.zone||t.aliases?.includes(h.zone)));
 if(!row)return toast('Zona non più disponibile');if(!confirm('Ripristinare i valori precedenti alla revisione '+h.revision+'?'))return;
 try{await commitTariffChange(row.region,row.zone,h.before.cents,h.before.supplementCents||0,'Ripristino revisione '+h.revision,h.before.zone||row.zone);toast('Zona ripristinata')}catch(e){toast(e.message)}
}
function exportTariffsJson(){if(!isAdmin())return;downloadObject({format:'stc-tariffario-v1.6',date:new Date().toISOString(),revision:state.tariffRevision||0,tariffs:TARIFFS.map(t=>({region:t.region,zone:t.zone,cents:[...t.cents],supplementCents:t.supplementCents||0}))},'STC_tariffario_rev'+(state.tariffRevision||0)+'_'+date()+'.json')}

function renderSettings(){$('storageInfo').textContent=(vaultEnabled?'Archivio cifrato AES-GCM (locale)':db?'IndexedDB':'Memoria browser')+' · '+state.quotes.length+' preventivi · '+state.customers.length+' clienti · '+state.movements.length+' movimenti'}
function exportBackup(){if(vaultEnabled)return exportEncryptedBackup();flushWorkingDrafts();const blob=new Blob([JSON.stringify({format:'stc-logistica-backup-v1.1',created:new Date().toISOString(),state},null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='STC_Logistics_backup_'+date()+'.json';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),3000)}
async function importBackup(input){
 if(vaultEnabled)return importSecureBackup(input);
 const f=input.files?.[0];if(!f)return;
 const previous=state;
 try{
  const data=JSON.parse(await f.text());
  if(!['stc-logistica-backup-v1','stc-logistica-backup-v1.1','rotta-backup-v03'].includes(data.format))throw Error('Formato backup non valido');
  validateSTCBackupState(data.state);
  if(!confirm('Sostituire l’archivio locale con il backup selezionato?'))return;
  state=data.state;
  if(!await persist())throw Error('Archivio non salvato: ripristino annullato');
  applySavedTariffs();syncCurrentZoneAliases();renderCustomers();if($('quickRunClient'))$('quickRunClient').innerHTML=typeof entClients==='function'?entClients($('quickRunClient').value):'';restoreDraft();quickDefaults();renderDashboard();
  toast('Backup ripristinato');
 }catch(e){state=previous;toast('Impossibile importare: '+e.message)}
 finally{input.value=''}
}
async function requestPersist(){if(!navigator.storage?.persist)return toast('Non supportato');toast(await navigator.storage.persist()?'Protezione archivio concessa':'Protezione non concessa: esegui backup')}
function restoreDraft(){
 const d=state.draft;if(!d||(d.shipments?.length===0&&!d.serviceBundle)){
  editing=null;quoteTariffLock=null;if(typeof entActiveMailId!=='undefined')entActiveMailId='';ships=[emptyShip()];
  for(const id of ['customer','reference','notes','manualQuotePrice','manualPriceReason'])$(id).value='';
  $('quoteDate').value=date();$('quoteDeliveryDate').value=date();
  for(const id of ['supp','markup','discount','vat'])$(id).value='0';
  $('quoteTitle').textContent='Nuovo preventivo';STCExtra.resetQuote();renderShips();return;
 }
 editing=d.editing||null;if(typeof entActiveMailId!=='undefined')entActiveMailId=d.sourceMailId||'';
 for(const [k,v] of Object.entries({customer:d.customer,reference:d.reference,quoteDate:d.date,quoteDeliveryDate:d.deliveryDate||"",notes:d.notes,supp:d.supp,markup:d.markup,discount:d.discount,vat:d.vat,manualQuotePrice:d.manualQuotePrice??'',manualPriceReason:d.manualPriceReason??''}))$(k).value=v??'';
 ships=JSON.parse(JSON.stringify(d.shipments));ships.forEach(shipLegacyUpgrade);
 const previous=editing?state.quotes.find(q=>q.id===editing):null;
 quoteTariffLock=previous&&Array.isArray(previous.tariffSnapshot)?
  previous.tariffSnapshot.map((snapshot,i)=>freezeTariff(snapshot,ships[i]?.id)).filter(Boolean):null;
 STCExtra.restoreQuote(d.serviceBundle||previous?.serviceBundle);
 renderShips();$('quoteTitle').textContent=editing?'Bozza in modifica · tariffa storica':'Nuovo preventivo';
}

function movementMonth(v){return String(v||'').slice(0,7)}
function renderKPIs(){
 const month=$('dashMonth').value||date().slice(0,7);let accepted=state.quotes.filter(q=>q.status==='Accettato'&&movementMonth(q.date)===month);
 const sales=accepted.reduce((a,q)=>a+num(q.totals?.taxable),0), cost=accepted.reduce((a,q)=>a+num(q.totals?.cost),0);
 const current=state.movements.filter(m=>movementMonth(m.date)===month);
 const cash=current.reduce((a,m)=>a+(m.type==='entrata'?1:-1)*num(m.amount),0);
 const costsIncomplete=accepted.some(q=>q.serviceBundle?.flags?.handling||q.serviceBundle?.flags?.storage);
 $('kpiSales').textContent=money(sales);$('kpiCost').textContent=money(cost);$('kpiMargin').textContent=costsIncomplete?'N/D':money(sales-cost);$('kpiCash').textContent=money(cash);
 const sent=state.quotes.filter(q=>q.status==='Inviato').length;const negative=accepted.filter(q=>num(q.totals?.taxable)<num(q.totals?.cost)).length;
 $('dashAlerts').textContent=`${sent} preventivi inviati in attesa di risposta · ${negative} confermati con margine negativo. ${costsIncomplete?'ATTENZIONE: il margine non è calcolabile finché mancano i costi reali di carico/scarico e deposito.':'I valori sono previsionali.'} I movimenti rappresentano il registro effettivo.`;
 const max=Math.max(1,...state.quotes.map(q=>num(q.totals?.taxable)));
 const months=Array.from({length:6},(_,i)=>{let d=new Date();d.setDate(1);d.setMonth(d.getMonth()-5+i);return d.toISOString().slice(0,7)});
 const values=months.map(m=>{const a=state.quotes.filter(q=>q.status==='Accettato'&&movementMonth(q.date)===m);return{m,s:a.reduce((n,q)=>n+num(q.totals?.taxable),0),c:a.reduce((n,q)=>n+num(q.totals?.cost),0)}});
 const upper=Math.max(1,...values.flatMap(x=>[x.s,x.c]));
 $('dashChart').innerHTML=values.map(v=>`<div class="barGroup"><div class="barPair"><i title="Ricavi ${money(v.s)}" style="height:${Math.max(2,v.s/upper*96)}px"></i><i class="cost" title="Costi ${money(v.c)}" style="height:${Math.max(2,v.c/upper*96)}px"></i></div><small>${esc(v.m.slice(5))}/${esc(v.m.slice(2,4))}</small></div>`).join('')+'<div style="font-size:10px;align-self:start">Blu: vendite · Rosso: costi</div>';
}
function renderLedger(){const arr=[...state.movements].sort((a,b)=>b.date.localeCompare(a.date));$('ledgerTable').innerHTML=arr.length?`<table><thead><tr><th>Data</th><th>Tipo</th><th>Importo</th><th>Cliente / Fornitore</th><th>Riferimento</th><th>Azioni</th></tr></thead><tbody>${arr.map(m=>`<tr><td>${esc(m.date)}</td><td>${esc(m.type)} · ${esc(m.category)}</td><td>${money(m.amount)}</td><td>${esc(m.party)}</td><td>${esc(m.reference)}</td><td><button class="danger" onclick="deleteMovement('${m.id}')">Elimina</button></td></tr>`).join('')}</tbody></table>`:'Nessun movimento registrato.'}
async function addMovement(){if(!isAdmin())return toast('Operazione riservata');const amount=num($('mAmount').value);if(!amount||!$('mDate').value)return toast('Inserisci data e importo positivo');state.movements.push({id:uid(),date:$('mDate').value,type:$('mType').value,amount,category:$('mCategory').value,party:$('mParty').value,reference:$('mReference').value,notes:$('mNotes').value});if(await persist()){for(const id of ['mAmount','mParty','mReference','mNotes'])$(id).value='';renderLedger();renderDashboard();toast('Movimento salvato')}}
async function deleteMovement(id){if(!isAdmin())return toast('Operazione riservata');if(!confirm('Eliminare questo movimento?'))return;state.movements=state.movements.filter(m=>m.id!==id);await persist();renderLedger();renderDashboard()}

async function boot(){const resumePage=stcReadView();stcBuildSidebarNav();
 $('mobileNav').innerHTML=menus.filter(m=>['dashboard','quick','quote'].includes(m[0])).map(([key,ico,label])=>`<button data-page="${key}" onclick="mobileCloseMore();go('${key}')"><b>${ico}</b>${label}</button>`).join('')+`<button id="moreButton" onclick="toggleMobileMore()"><b>☰</b>Altro</button>`;
 await load();if(typeof entInit==='function')entInit();STCExtra.init();applySavedTariffs();syncCurrentZoneAliases();$('dashMonth').value=calendarLocalToday().slice(0,7);$('mDate').value=date();if($('quickRunDate')&&!$('quickRunDate').value)$('quickRunDate').value=calendarLocalToday();renderCustomers();if($('quickRunClient'))$('quickRunClient').innerHTML=typeof entClients==='function'?entClients($('quickRunClient').value):'';restoreDraft();quickDefaults();quickInitGeo();renderDashboard();go(pagePermitted(resumePage)?resumePage:'dashboard');refreshRolesUI();startDashboardWidgets();function net(){const online=navigator.onLine;$('connText').textContent=online?'Online':'Offline';$('netStatus').textContent=online?'App locale · Online':'App locale · Offline'}net();addEventListener('online',net);addEventListener('offline',net);if('serviceWorker'in navigator&&location.protocol.startsWith('http'))navigator.serviceWorker.register('./sw.js').catch(()=>toast('Installazione offline non disponibile'))}
// Se l'app passa in background prova a salvare subito i dati già modificati.
// Non sostituisce il backup e può essere interrotto dalla chiusura del browser.
addEventListener('visibilitychange',()=>{
 if(!document.hidden||!activeUser)return;
 flushWorkingDrafts();
 persist().catch(()=>{});
});
secureBoot().catch(e=>{document.body.insertAdjacentHTML('afterbegin','<div style="padding:20px;background:#ffdddd">Errore avvio: '+esc(e.message)+'</div>')});
