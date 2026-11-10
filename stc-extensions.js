'use strict';
/* STC LOGISTICS 1.21 - integrazioni additive ai moduli 1.20.
   Nessun listino inventato, nessuna migrazione distruttiva.
   Tutte le collezioni nuove sono additivamente inizializzate nel medesimo vault cifrato. */
const STC_PDF_LOGO_BASE64='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';
const STCExtra={
 _lastAutomaticCents:0,rateLock:null,termsLock:null,_calendarAnchor:null,
 init(){
  for(const k of ['operationalResources','expectedReceipts','warehouseReceipts','supplierSchedules','priceHistory'])if(!Array.isArray(state[k]))state[k]=[];
  if(!state.serviceTariffs||typeof state.serviceTariffs!=='object')state.serviceTariffs={loadCents:null,unloadCents:null,palletNightCents:null};
  if(!state.resourceAssignments||typeof state.resourceAssignments!=='object')state.resourceAssignments={};
  for(const c of state.customers){if(!c.serviceDiscounts)c.serviceDiscounts={shipping:0,handling:0,storage:0};}
  this.updateQuoteControls();this.renderSupplierList();this.refreshResourceSelects();this.menuInit();
 },
 customerId(name){const matches=state.customers.filter(c=>c.name===name);return matches.length===1?matches[0].id:''},
 currentCustomer(){const id=this.customerId($('customer')?.value);return state.customers.find(c=>c.id===id)},
 menuInit(){const nav=$('nav');if(!nav)return;const groups=[...nav.querySelectorAll('[data-nav-group]')];if(!groups.length)return;
  const key=activeUser?.id||'local';const saved=Array.isArray(state.menuPreferences?.[key])?state.menuPreferences[key]:[];groups.sort((a,b)=>{let ai=saved.indexOf(a.dataset.navGroup),bi=saved.indexOf(b.dataset.navGroup);return (ai<0?100:ai)-(bi<0?100:bi)});
  groups.forEach(g=>nav.appendChild(g));
  let tools=nav.querySelector('#stcMenuTools');if(!tools){tools=document.createElement('div');tools.id='stcMenuTools';tools.className='row';tools.style.cssText='margin:12px 0;flex-wrap:wrap';tools.innerHTML='<button type="button" class="alt" onclick="STCExtra.resetMenu()">Ripristina menu</button><small style="color:white">Trascina le categorie per riordinarle.</small>';nav.appendChild(tools)}else nav.appendChild(tools);
  let dragging=null;
  groups.forEach(g=>{if(g.dataset.dndReady)return;g.dataset.dndReady='1';
   const controls=document.createElement('div');controls.style.cssText='display:flex;justify-content:flex-end;gap:5px;padding:2px 6px';controls.innerHTML=`<button type="button" class="alt" style="min-height:28px;padding:4px 10px" onclick="STCExtra.shiftMenu('${g.dataset.navGroup}',-1)">↑</button><button type="button" class="alt" style="min-height:28px;padding:4px 10px" onclick="STCExtra.shiftMenu('${g.dataset.navGroup}',1)">↓</button>`;
   g.insertBefore(controls,g.querySelector('.stc-nav-children'));
   g.draggable=true;g.addEventListener('dragstart',e=>{dragging=g;e.dataTransfer.effectAllowed='move'});g.addEventListener('dragover',e=>{e.preventDefault();e.dataTransfer.dropEffect='move'});g.addEventListener('drop',e=>{e.preventDefault();if(dragging&&dragging!==g){nav.insertBefore(dragging,g);this.storeMenu()}});g.addEventListener('dragend',()=>{dragging=null});});
 },
 async shiftMenu(key,delta){const nav=$('nav');const rows=[...nav.querySelectorAll('details[data-nav-group]')];const index=rows.findIndex(g=>g.dataset.navGroup===key);const other=rows[index+delta];if(!other)return;nav.insertBefore(rows[index],delta<0?other:other.nextSibling);await this.storeMenu()},
 async storeMenu(){if(!state.menuPreferences)state.menuPreferences={};state.menuPreferences[activeUser?.id||'local']=[...document.querySelectorAll('#nav [data-nav-group]')].map(x=>x.dataset.navGroup);await persist();},
 async resetMenu(){if(!state.menuPreferences)state.menuPreferences={};delete state.menuPreferences[activeUser?.id||'local'];if(await persist()){stcBuildSidebarNav();this.menuInit();toast('Ordine menu ripristinato')}},
 shippingActive(){return !document.getElementById('svcShipping')||!!$('svcShipping').checked},
 flags(){return {shipping:this.shippingActive(),handling:!!$('svcHandling')?.checked,storage:!!$('svcStorage')?.checked}},
 toggleServices(){
  if(!$('svcShipping'))return;
  const flags=this.flags();
  if(!Object.values(flags).some(Boolean)){toast('Seleziona almeno un servizio');$('svcShipping').checked=true;return this.toggleServices()}
  $('svcShippingFields').classList.toggle('hidden',!flags.shipping);
  $('svcHandlingFields').classList.toggle('hidden',!flags.handling);
  $('svcStorageFields').classList.toggle('hidden',!flags.storage);
  const method=$('svcStorageMode').value;
  $('svcPallets').closest('label').classList.toggle('hidden',method==='area');$('svcArea').closest('label').classList.toggle('hidden',method!=='area');
  changed();
 },
 startChanged(){const m=$('svcStart').value; if(m==='shipping'){$('svcShipping').checked=true;}if(m==='handling'){$('svcHandling').checked=true;$('svcShipping').checked=false;}if(m==='storage'){$('svcStorage').checked=true;$('svcShipping').checked=false;}
  this.toggleServices()},
 resetQuote(){
  if(!$('svcShipping'))return;
  this.rateLock=null;this.termsLock=null;
  for(const k of ['Shipping','Handling','Storage'])$('svc'+k).checked=k==='Shipping';
  $('svcStart').value='shipping';$('svcSupplier').value='';
  $('svcLoad').value='0';$('svcUnload').value='0';$('svcNights').value='1';$('svcPallets').value='1';$('svcArea').value='';$('svcStorageMode').value='pallet';$('svcManualPercent').value='';
  this.updateQuoteControls();
 },
 capture(){return {schema:1,flags:this.flags(),start:$('svcStart')?.value||'shipping',supplierId:$('svcSupplier')?.value||'',loadQty:$('svcLoad')?.value||'0',unloadQty:$('svcUnload')?.value||'0',storageMode:$('svcStorageMode')?.value||'pallet',nights:$('svcNights')?.value||'1',palletQty:$('svcPallets')?.value||'1',areaDirect:$('svcArea')?.value||'',manualPercent:$('svcManualPercent')?.value||''}},
 restoreQuote(data){
  this.rateLock=null;this.termsLock=null;
  const x=data&&typeof data==='object'?data:null;
  if(!x)return this.resetQuote();
  const f=x.flags||{shipping:true};
  $('svcShipping').checked=!!f.shipping;$('svcHandling').checked=!!f.handling;$('svcStorage').checked=!!f.storage;
  const values={svcStart:x.start||'shipping',svcSupplier:x.supplierId||'',svcLoad:x.loadQty??'0',svcUnload:x.unloadQty??'0',svcStorageMode:x.storageMode||'pallet',svcNights:x.nights||'1',svcPallets:x.palletQty||'1',svcArea:x.areaDirect||'',svcManualPercent:x.manualPercent||''};
  this.renderSupplierList();for(const [k,v]of Object.entries(values))if($(k))$(k).value=String(v);
  const q=typeof editing==='string'?state.quotes.find(q=>q.id===editing):null;
  if(q?.servicePriceSnapshot?.rates)this.rateLock=JSON.parse(JSON.stringify(q.servicePriceSnapshot.rates));
  if(q?.servicePriceSnapshot?.discounts)this.termsLock=JSON.parse(JSON.stringify(q.servicePriceSnapshot.discounts));
  this.updateQuoteControls();
 },
 updateQuoteControls(){
  if(!$('svcShipping'))return;
  $('svcShippingFields').classList.toggle('hidden',!this.shippingActive());
  $('svcHandlingFields').classList.toggle('hidden',!$('svcHandling').checked);
  $('svcStorageFields').classList.toggle('hidden',!$('svcStorage').checked);
  $('svcPallets').closest('label').classList.toggle('hidden',$('svcStorageMode').value==='area');
  $('svcArea').closest('label').classList.toggle('hidden',$('svcStorageMode').value!=='area');
  const s=$('svcSupplier');if(s){const chosen=s.value;const oldSupplier=state.quotes.find(q=>q.id===editing)?.servicePriceSnapshot?.supplier;const rows=[...(state.supplierSchedules||[]).filter(x=>x.active)];if(oldSupplier&&!rows.some(x=>x.id===oldSupplier.id))rows.push(oldSupplier);s.innerHTML='<option value="">Tariffario STC attuale</option>'+ rows.map(x=>`<option value="${esc(x.id)}">${esc(x.name)} · ${esc(x.zone)} · ${money(x.rateCents/100)}/q</option>`).join('');s.value=[...s.options].some(o=>o.value===chosen)?chosen:''}
 },
 fromCargo(){let groups=[];for(const ship of ships||[])for(const i of ship.items||[]){if(!String(i.l||'').trim()||!String(i.w||'').trim())continue;groups.push(i)}
  const area=STCServices.areaM2(groups);if(area===null||area<=0)return toast('Inserisci quantità, lunghezza e larghezza valide nei colli');
  $('svcArea').value=area.toFixed(4).replace(/0+$/,'').replace(/\.$/,'');$('svcStorageMode').value='area';this.toggleServices();toast('Superficie ottenuta dalla merce: '+area.toLocaleString('it-IT')+' m²')},
 discounts(){const c=this.currentCustomer();return this.termsLock||c?.serviceDiscounts||{shipping:0,handling:0,storage:0}},
 rates(){return this.rateLock||state.serviceTariffs||{}},
 price(shippingEuro){
  const fields=this.capture(),flags=fields.flags;
  const discounts=this.discounts(),rates=this.rates();
  let shippingCents=Math.round(shippingEuro*100),supplier=null;
  if(flags.shipping&&fields.supplierId){
   supplier=(state.supplierSchedules||[]).find(s=>s.id===fields.supplierId&&s.active);
   const oldQ=state.quotes.find(q=>q.id===editing);
   const lock=oldQ?.servicePriceSnapshot?.supplier;
   if(lock?.id===fields.supplierId)supplier=lock;
   if(!supplier)return{issues:['Listino fornitore non disponibile: scegli il tariffario STC'],lines:[],automaticCents:0};
   let sum=0;for(const ship of ships){const r=calcShip(ship);if(!r.valid||r.q>50||r.q<1||ship.zone!==supplier.zone){return{issues:['Fornitore: zona o peso non coperti dal listino. Seleziona tariffario STC oppure verifica il preventivo'],lines:[],automaticCents:0}}
    sum+=Math.max(3,r.q)*supplier.rateCents;
   }
   shippingCents=sum;
  }
  const res=STCServices.calculate({flags,shippingCents,loadQty:fields.loadQty,unloadQty:fields.unloadQty,nights:fields.nights,palletQty:fields.palletQty,areaDirect:fields.areaDirect,storageMode:fields.storageMode,rates,discounts});
  const box=$('svcBreakdown');if(box){box.innerHTML=(res.lines.map(l=>`<div class="row between"><span><b>${esc({shipping:'Spedizione',handling:'Carico / scarico',storage:'Deposito'}[l.type])}</b> · Sconto cliente ${esc(l.discountPercent)}%</span><strong>${money(l.netCents/100)}</strong></div>`).join('')||'<span class="muted">Seleziona i servizi per il riepilogo.</span>')+'<p><strong>Prezzo servizi automatico: '+money(res.automaticCents/100)+'</strong></p>'+(res.issues.length?'<p class="muted">'+esc(res.issues.join(' · '))+'</p>':'');}
  return {...res,supplier};
 },
 quotePriceInput(existing){
  if(existing.manual||!String($('svcManualPercent')?.value||'').trim())return existing;
  const text=String($('svcManualPercent').value).trim().replace(',','.');if(!/^-?\d{1,3}(?:\.\d{1,4})?$/.test(text))return {manual:true,valid:false,reason:'Percentuale manuale non valida'};
  const p=Number(text);if(p>100||p< -100)return {manual:true,valid:false,reason:'Percentuale manuale fuori -100…100'};
  return {manual:true,valid:true,cents:STCServices.discountCents(this._lastAutomaticCents,p)};
 },
 manualPercentChange(){if($('manualQuotePrice').value.trim()){$('manualQuotePrice').value='';toast('La percentuale sostituisce il prezzo manuale in euro')}changed()},
 manualEuroChange(){const str=$('manualQuotePrice').value.trim();if(!str){$('svcManualPercent').value='';return changed()}const cents=STCServices.cents(str);if(cents!==null&&this._lastAutomaticCents>0)$('svcManualPercent').value=((this._lastAutomaticCents-cents)/this._lastAutomaticCents*100).toFixed(2).replace('.',',');changed()},
 manualReset(){$('manualQuotePrice').value='';$('svcManualPercent').value='';$('manualPriceReason').value='';changed()},
 snapshot(result,bundle){return{schema:1,at:new Date().toISOString(),rates:JSON.parse(JSON.stringify(this.rates())),discounts:JSON.parse(JSON.stringify(this.discounts())),supplier:result?.serviceSnapshot?.supplier?JSON.parse(JSON.stringify(result.serviceSnapshot.supplier)):null,lines:JSON.parse(JSON.stringify(result.serviceLines||[])),automaticPriceCents:Math.round((result.calculatedTaxable||0)*100),finalPriceCents:Math.round((result.taxable||0)*100),serviceBundle:JSON.parse(JSON.stringify(bundle||{}))}},
 afterQuoteSaved(q){const c=state.customers.find(c=>c.id===q.customerId);if(c&&q.customer!==c.name)q.customer=c.name;this.updateQuoteControls();},
 async afterQuoteRevoked(q){const row=(state.expectedReceipts||[]).find(x=>x.quoteId===q.id);if(row&&row.status==='Previsto'){row.reviewNeeded=true;await persist();toast('Deposito già programmato: richiede revisione manuale, non cancellato')}},
 async afterQuoteAccepted(q){
  if(!q.serviceBundle?.flags?.storage)return;
  this.init();const existing=state.expectedReceipts.find(x=>x.quoteId===q.id);
  if(existing){if(existing.status==='Previsto')existing.reviewNeeded=!!(existing.snapshotCode!==q.code);return}
  const b=q.serviceBundle;const entry={id:uid(),quoteId:q.id,customerId:q.customerId||this.customerId(q.customer),customerName:q.customer,day:q.deliveryDate||'',snapshotCode:q.code,status:'Previsto',expectedPallets:b.storageMode==='pallet'?Number(b.palletQty||0):null,expectedAreaM2:STCServices.decimal(b.areaDirect)||null,expectedNights:Number(b.nights||0),cargo:JSON.parse(JSON.stringify(q.shipments||[])),created:new Date().toISOString(),receivedAt:null};
  state.expectedReceipts.push(entry);if(!await persist()){state.expectedReceipts=state.expectedReceipts.filter(x=>x.id!==entry.id);toast('Attenzione: ingresso programmato non salvato')}
 },
 async receive(id){if(!isAdmin())return toast('Solo amministratore');const entry=state.expectedReceipts.find(x=>x.id===id);if(!entry||entry.status!=='Previsto')return toast('Ingresso già confermato o non disponibile');
  const day=prompt('Data reale di ricezione (AAAA-MM-GG)',calendarLocalToday());if(day===null)return;if(!calendarDateValid(day))return toast('Data non valida');
  if(!confirm('Confermi la ricezione fisica? Aumenterà la giacenza effettiva del deposito una sola volta.'))return;
  entry.status='Ricevuto';entry.receivedAt=day;const receipt={id:uid(),expectedId:entry.id,quoteId:entry.quoteId,customerId:entry.customerId,day,qty:entry.expectedPallets,areaM2:entry.expectedAreaM2,created:new Date().toISOString()};
  state.warehouseReceipts.push(receipt);if(!await persist()){entry.status='Previsto';entry.receivedAt=null;state.warehouseReceipts.pop();return}this.renderWarehouse();toast('Ingresso fisico confermato una sola volta');
 },
 renderWarehouse(){const el=$('stcExpectedList');if(!el)return;el.innerHTML=(state.expectedReceipts||[]).map(x=>`<div class="stc-supplier-row"><strong>${esc(x.snapshotCode)} · ${esc(x.customerName)}</strong><span> · ${esc(x.day||'Data da confermare')} · <b>${esc(x.status)}</b></span><br><small>${x.expectedPallets===null?'Superficie '+esc(x.expectedAreaM2||'da confermare')+' m²':esc(x.expectedPallets)+' bancali previsti'} · ${esc(x.expectedNights)} notti</small> ${x.status==='Previsto'?`<button class="primary" data-id="${esc(x.id)}" onclick="STCExtra.receive(this.dataset.id)">Conferma ingresso fisico</button>`:''}</div>`).join('')||'<p class="muted">Nessun deposito programmato. Compare dopo l’accettazione di un preventivo con deposito.</p>';
  const count=$('stcDepositsCount');if(count)count.textContent=(state.expectedReceipts||[]).filter(x=>x.status==='Ricevuto').length+' ingressi effettivi · '+(state.expectedReceipts||[]).filter(x=>x.status==='Previsto').length+' previsti';
 },
 loadClientTerms(){const c=state.customers.find(c=>c.id===$('stcCrmClient').value),d=c?.serviceDiscounts||{};for(const [id,key]of [['stcDiscShip','shipping'],['stcDiscLoad','handling'],['stcDiscStore','storage']])$(id).value=Number(d[key]||0);this.renderClientSummary(c)},
 async saveClientTerms(){if(!isAdmin())return toast('Solo amministratore');const c=state.customers.find(c=>c.id===$('stcCrmClient').value);if(!c)return toast('Seleziona cliente');const obj={};for(const [id,key]of [['stcDiscShip','shipping'],['stcDiscLoad','handling'],['stcDiscStore','storage']]){const str=String($(id).value).trim().replace(',','.');if(!/^-?\d{1,3}(?:\.\d{1,2})?$/.test(str)||Math.abs(Number(str))>100)return toast('Sconto '+key+' non valido');obj[key]=Number(str)}const old=c.serviceDiscounts;c.serviceDiscounts=obj;if(!await persist()){c.serviceDiscounts=old;return}this.renderClientSummary(c);toast('Condizioni cliente salvate · vecchi preventivi invariati')},
 renderClientSummary(c){const node=$('stcCrmSummary');if(!node||!c)return;const quotes=state.quotes.filter(q=>(q.customerId&&q.customerId===c.id)||(!q.customerId&&q.customer===c.name));const accepted=quotes.filter(q=>q.status==='Accettato');node.innerHTML=`<div class="row"><span>Preventivi: <b>${quotes.length}</b></span><span>Confermati: <b>${accepted.length}</b></span><span>Valore confermato: <b>${money(accepted.reduce((s,q)=>s+Number(q.totals?.taxable||0),0))}</b></span></div>`;},
 renderCustomersExtension(){const sel=$('stcCrmClient');if(!sel)return;const current=sel.value;sel.innerHTML='<option value="">Seleziona cliente</option>'+state.customers.map(c=>`<option value="${esc(c.id)}">${esc(c.name)}</option>`).join('');sel.value=state.customers.some(c=>c.id===current)?current:'';this.loadClientTerms()},
 async saveServiceTariffs(){if(!isAdmin())return toast('Solo amministratore');const keys=[['stcLoadRate','loadCents'],['stcUnloadRate','unloadCents'],['stcStorageRate','palletNightCents']],obj={};for(const [id,k]of keys){const v=String($(id).value).trim();if(!v)return toast('Per usare i servizi inserisci tutte e tre le tariffe');const cents=STCServices.cents(v);if(cents===null||cents<=0)return toast('Tariffa '+k+' non valida');obj[k]=cents}
  const old={...state.serviceTariffs};state.serviceTariffs=obj;const audit={id:uid(),at:new Date().toISOString(),actor:activeUser?.name||'Locale',kind:'serviceRates',previous:old,next:{...obj}};state.priceHistory.push(audit);
  if(!await persist()){state.serviceTariffs=old;state.priceHistory.pop();return}this.renderRates();changed();toast('Tariffe servizi salvate. I preventivi storici non cambiano')},
 renderRates(){const r=state.serviceTariffs;for(const [id,k]of [['stcLoadRate','loadCents'],['stcUnloadRate','unloadCents'],['stcStorageRate','palletNightCents']])if($(id))$(id).value=Number.isSafeInteger(r[k])?(r[k]/100).toFixed(2).replace('.',','):'';
  const result=$('stcStorageM2Rate');if(result)result.value=Number.isSafeInteger(r.palletNightCents)?(r.palletNightCents/100/0.96).toFixed(4).replace('.',','):'';
 },
 async addSupplier(){if(!isAdmin())return toast('Solo amministratore');const name=$('stcSupplierName').value.trim(),zone=$('stcSupplierZone').value.trim().toUpperCase(),price=STCServices.cents($('stcSupplierRate').value),days=STCServices.decimal($('stcSupplierDays').value);
  if(!name||!zone||price===null||price<=0||days===null||!Number.isInteger(days))return toast('Compila fornitore, zona, prezzo e giorni validi');
  const row={id:uid(),name,zone,rateCents:price,deliveryDays:days,active:true,created:new Date().toISOString()};state.supplierSchedules.push(row);if(!await persist()){state.supplierSchedules.pop();return}
  for(const k of ['stcSupplierName','stcSupplierZone','stcSupplierRate','stcSupplierDays'])$(k).value='';this.renderSupplierList();toast('Listino fornitore registrato senza cambiare tariffario STC')},
 renderSupplierList(){const list=$('stcSupplierList');if(list)list.innerHTML=(state.supplierSchedules||[]).map(x=>`<div class="stc-supplier-row"><b>${esc(x.name)}</b> · ${esc(x.zone)} · ${money(x.rateCents/100)}/q · ${esc(x.deliveryDays)} giorni · ${x.active?'Attivo':'Disattivo'} <button class="alt" onclick="STCExtra.toggleSupplier('${esc(x.id)}')">${x.active?'Disattiva':'Riattiva'}</button></div>`).join('')||'<p class="muted">Nessun listino fornitori aggiuntivo.</p>';this.updateQuoteControls()},
 async toggleSupplier(id){if(!isAdmin())return;const x=state.supplierSchedules.find(x=>x.id===id);if(!x)return;x.active=!x.active;if(!await persist())x.active=!x.active;this.renderSupplierList()},
 // Risorse operative: record disattivabili, non utenti login.
 async addResource(){if(!isAdmin())return toast('Solo amministratore');const name=$('stcResourceName').value.trim();if(!name)return toast('Nome risorsa obbligatorio');const obj={id:uid(),name,type:$('stcResourceType').value,lift:$('stcResourceLift').value==='si',length:this.optionalPositive('stcResourceL'),width:this.optionalPositive('stcResourceW'),height:this.optionalPositive('stcResourceH'),costKmCents:STCServices.cents($('stcResourceKM').value||'0'),notes:$('stcResourceNotes').value.trim(),active:true,created:new Date().toISOString()};if(Object.values(obj).some(v=>v===-1))return toast('Dimensione o costo non valido');state.operationalResources.push(obj);if(!await persist()){state.operationalResources.pop();return}this.renderResources();this.refreshResourceSelects();toast('Risorsa operativa salvata')},
 optionalPositive(id){const s=String($(id)?.value||'').trim();if(!s)return null;const n=STCServices.decimal(s);return n===null||n<=0?-1:n},
 refreshResourceSelects(){const select=$('stcCalResource');if(select){const prev=select.value;select.innerHTML='<option value="">Tutte le risorse</option><option value="unassigned">Non assegnate</option>'+(state.operationalResources||[]).map(x=>`<option value="${esc(x.id)}">${esc(x.name)}${x.active?'':' (inattiva)'}</option>`).join('');select.value=[...select.options].some(o=>o.value===prev)?prev:''}},
 async toggleResource(id){if(!isAdmin())return;const x=state.operationalResources.find(x=>x.id===id);if(!x)return;x.active=!x.active;if(!await persist())x.active=!x.active;this.renderResources();this.refreshResourceSelects()},
 renderResources(){this.init();const box=$('stcResourceList');if(!box)return;const events=calendarEventsFrom(state,()=>true);box.innerHTML=(state.operationalResources||[]).map(r=>{const jobs=events.filter(e=>state.resourceAssignments[e.kind+':'+e.id]===r.id).length;return `<div class="stc-supplier-row"><b>${esc(r.name)}</b> · ${esc(r.type)} · ${r.active?'Attiva':'Disattivata'} · ${jobs} attività<br><small>Sponda ${r.lift?'sì':'no'} · Cassone ${r.length||'—'}×${r.width||'—'} m · Area teorica ${r.length&&r.width?(r.length*r.width).toFixed(2)+' m²':'N/D'} · Costo/km ${money((r.costKmCents||0)/100)}</small> <button class="alt" onclick="STCExtra.toggleResource('${esc(r.id)}')">${r.active?'Disattiva':'Riattiva'}</button></div>`}).join('')||'<p class="muted">Nessuna risorsa registrata. I lavori non assegnati restano visibili.</p>';
  const v=$('stcResourcePeriod')?.value||'month',day=$('stcResourceDay')?.value||calendarLocalToday();if($('stcResourceDay')&&!$('stcResourceDay').value)$('stcResourceDay').value=day;
  let start=day,end=day;
  if(v==='month'){start=day.slice(0,7)+'-01';const d=new Date(day+'T12:00:00');d.setMonth(d.getMonth()+1,0);end=calendarLocalTodayFromDate(d)}
  if(v==='week'){const d=new Date(day+'T12:00:00');d.setDate(d.getDate()-(d.getDay()+6)%7);start=calendarLocalTodayFromDate(d);d.setDate(d.getDate()+6);end=calendarLocalTodayFromDate(d)}
  const chosen=events.filter(e=>e.day>=start&&e.day<=end);
  $('stcResourceStats').innerHTML='<h3>Attività per risorsa · '+esc(start)+' → '+esc(end)+'</h3>'+(state.operationalResources||[]).map(r=>`<div class="ent-line"><span>${esc(r.name)}</span><b>${chosen.filter(e=>state.resourceAssignments[e.kind+':'+e.id]===r.id).length}</b></div>`).join('')+`<div class="ent-line"><span>Non assegnate</span><b>${chosen.filter(e=>!state.resourceAssignments[e.kind+':'+e.id]).length}</b></div>`;
 },
 assignmentKey(kind,id){return kind+':'+id},
 async assign(kind,id){if(!isAdmin())return toast('Solo amministratore');const select=$('stcJobResource');if(!select)return;const valid=!select.value||(state.operationalResources||[]).some(x=>x.id===select.value&&x.active);if(!valid)return toast('Risorsa non attiva');const key=this.assignmentKey(kind,id),old=state.resourceAssignments[key];if(select.value)state.resourceAssignments[key]=select.value;else delete state.resourceAssignments[key];if(!await persist()){if(old)state.resourceAssignments[key]=old;else delete state.resourceAssignments[key];return}this.refreshResourceSelects();calendarRender();toast('Risorsa assegnata al lavoro')},
 calendarModal(kind,id){const body=$('calendarDetailBody'),actions=$('calendarDetailActions');if(!body)return;const key=this.assignmentKey(kind,id),sel=state.resourceAssignments[key]||'';
  body.insertAdjacentHTML('beforeend',`<div class="stc-service-detail"><label>Risorsa assegnata<select id="stcJobResource"><option value="">Non assegnata</option>${(state.operationalResources||[]).filter(x=>x.active||x.id===sel).map(r=>`<option value="${esc(r.id)}" ${sel===r.id?'selected':''}>${esc(r.name)}${r.active?'':' (inattiva)'}</option>`).join('')}</select></label><button class="alt" onclick="STCExtra.assign('${kind}','${esc(id)}')">Salva assegnazione</button></div>`);
  if(kind==='run'){const run=state.calendarRuns.find(r=>r.id===id),epal=run.epal||{};body.insertAdjacentHTML('beforeend',`<div class="stc-service-detail"><h3>Registro giro · scambio EPAL</h3><div class="fields"><label>Bancali consegnati<input id="stcRunEpalDel" type="number" min="0" step="1" value="${Number(epal.delivered||0)}"></label><label>Bancali ritirati<input id="stcRunEpalRet" type="number" min="0" step="1" value="${Number(epal.returned||0)}"></label></div><p><button class="alt" onclick="STCExtra.saveRunEPAL('${esc(id)}')">Aggiorna registro giro</button></p><small>Questo è il solo punto di modifica EPAL per le bolle: la Calcolatrice non presenta più questi campi.</small></div>`)}
 },
 async saveRunEPAL(id){if(!isAdmin())return toast('Solo amministratore');const r=state.calendarRuns.find(r=>r.id===id);if(!r)return;const a=STCServices.decimal($('stcRunEpalDel').value),b=STCServices.decimal($('stcRunEpalRet').value);if(!Number.isInteger(a)||!Number.isInteger(b))return toast('Bancali EPAL: usa interi non negativi');if((a||b)&&!r.clientId)return toast('Associa prima un cliente alla bolla');const old={...(r.epal||{})};r.epal={...old,clientId:r.clientId,delivered:a,returned:b};if(!await persist()){r.epal=old;return}toast('Registro EPAL aggiornato, senza doppio movimento');calendarRender()},
 // Filtri agenda e viste: usa gli stessi documenti, non copia le attività.
 calPeriod(delta){const v=$('stcCalView')?.value||'month';if(v==='month')return calendarMove(delta);const d=new Date((this._calendarAnchor||calendarLocalToday())+'T12:00:00');d.setDate(d.getDate()+delta*(v==='week'?7:1));this._calendarAnchor=calendarLocalTodayFromDate(d);this.renderCalendarView()},
 matchesResource(e){const f=$('stcCalResource')?.value||'';if(!f)return true;const assigned=state.resourceAssignments?.[this.assignmentKey(e.kind,e.id)]||'';return f==='unassigned'?!assigned:assigned===f},
 renderCalendarView(){const s=$('stcCalView');if(!s)return;this.refreshResourceSelects();const mode=s.value,agenda=$('stcCalAgenda'),month=$('calendarGrid'),days=document.querySelector('.calendar-weekdays');if(!agenda||!month)return;
  if(mode==='month'){agenda.classList.add('hidden');month.classList.remove('hidden');days?.classList.remove('hidden');calendarRender();return}
  agenda.classList.remove('hidden');month.classList.add('hidden');days?.classList.add('hidden');
  const date=this._calendarAnchor||calendarLocalToday();let start=date,end=date;
  if(mode==='week'){const d=new Date(date+'T12:00:00');d.setDate(d.getDate()-(d.getDay()+6)%7);start=calendarLocalTodayFromDate(d);d.setDate(d.getDate()+6);end=calendarLocalTodayFromDate(d)}
  const events=calendarEventsFrom(state,q=>ownsQuote(q)).filter(e=>e.day>=start&&e.day<=end&&this.matchesResource(e));
  agenda.innerHTML=`<h3>${esc(start)}${start!==end?' → '+esc(end):''} · ${events.length} attività</h3>`+(events.map(e=>`<button class="stc-agenda-row" onclick="calendarOpen('${e.kind}','${esc(e.id)}')"><span><b>${esc(e.day)}</b> · ${esc(e.code)} · ${esc(e.label)}</span><small>${esc(e.status)} · ${money(e.amount)}</small></button>`).join('')||'<p class="muted">Nessuna attività in questo periodo.</p>');
 },
 // Grafici semplici SVG locali. I documenti non accettati non si contano come confermati/fatturati.
 renderAnalytics(){
  this.init();const sel=$('stcAnalyticsClient');if(!sel)return;const current=sel.value;sel.innerHTML='<option value="">Tutti i clienti</option>'+state.customers.map(c=>`<option value="${esc(c.id)}">${esc(c.name)}</option>`).join('');sel.value=state.customers.some(c=>c.id===current)?current:'';
  const filterService=$('stcAnalyticsService')?.value||'all',cid=sel.value,region=($('stcAnalyticsRegion')?.value||'').trim().toUpperCase(),kg=STCServices.decimal($('stcAnalyticsWeight')?.value||'0');
  const qs=state.quotes.filter(q=>(!cid||q.customerId===cid||(!q.customerId&&q.customer===state.customers.find(c=>c.id===cid)?.name))&&(!region||(q.shipments||[]).some(s=>String(s.region||'').includes(region)||String(s.zone||'').toUpperCase().includes(region)))&&(kg===0||(q.shipments||[]).some(s=>Number(s.kg||0)>=kg))).sort((a,b)=>String(a.date||a.created||'').localeCompare(String(b.date||b.created||'')));
  const chart=(title,values,labels)=>{
    const max=Math.max(1,...values),min=Math.min(0,...values),range=max-min||1;
    const points=values.map((v,i)=>`${30+(values.length===1?250:i*500/(values.length-1))},${160-(v-min)/range*125}`).join(' ');
    const line=values.length?`<polyline fill="none" stroke="#1050a3" stroke-width="4" points="${points}"/>`:'<text x="40" y="90">Nessun dato</text>';
    const last=values.length?money(values[values.length-1]):'N/D';
    return `<div class="stc-chart"><h3>${esc(title)}</h3><p class="muted">Ultimo valore: <b>${esc(last)}</b> · ${values.length} registrazioni</p><svg viewBox="0 0 570 195" role="img" aria-label="${esc(title)}"><path d="M30 12V165H550" stroke="#9caec7" fill="none" stroke-width="2"/>${line}${values.map((v,i)=>`<circle cx="${30+(values.length===1?250:i*500/(values.length-1))}" cy="${160-(v-min)/range*125}" r="4" fill="#ef4650"><title>${esc(labels[i]||'')} · ${money(v)}</title></circle>`).join('')}</svg></div>`
  };
  let html='';for(const type of ['shipping','handling','storage']){
   if(filterService!=='all'&&filterService!==type)continue;
   const subset=qs.filter(q=>this.quoteServiceAmount(q,type)>0),title={shipping:'Andamento prezzi spedizioni',handling:'Andamento carico / scarico',storage:'Andamento deposito'}[type];
   html+=chart(title,subset.map(q=>this.quoteServiceAmount(q,type)),subset.map(q=>q.date||q.created));
  }
  const accepted=qs.filter(q=>q.status==='Accettato');
  html+=chart('Volume d’affari confermato (non incassato)',accepted.map((q,i)=>accepted.slice(0,i+1).reduce((tot,x)=>tot+Number(x.totals?.taxable||0),0)),accepted.map(q=>q.date||q.created));
  const drafts=(state.invoices||[]).filter(i=>i.status!=='Annullata'&&(!cid||i.customerId===cid));
  html+=`<p class="note">${qs.length} preventivi · ${accepted.length} confermati · ${drafts.length} bozze fattura interne. Le bozze NON sono fatturato emesso.</p>`;
  $('stcAnalyticsCharts').innerHTML=html;
 },
 quoteServiceAmount(q,service){if(service==='all')return Number(q.totals?.taxable||0);const row=(q.servicePriceSnapshot?.lines||[]).find(l=>l.type===service);if(row)return row.netCents/100;if(service==='shipping'&&!q.serviceBundle)return Number(q.totals?.taxable||0);return 0},
 // PDF integrato senza libreria online. A4 multipagina in file PDF reale; WinAnsi per stampa italiana.
 pdfCurrent(preview=false){const d=currentData(),r=recalc();if(r.issues.length)return toast('Completa il preventivo prima del PDF: '+r.issues[0]);if(!d.customer)return toast('Seleziona il cliente');const c=this.currentCustomer();this.downloadPDF({code:editing?state.quotes.find(q=>q.id===editing)?.code:'ANTEPRIMA',...d,customerSnapshot:c||null,totals:r,servicePriceSnapshot:this.snapshot(r,d.serviceBundle)},preview)},
 pdfSaved(id,preview=false){const q=state.quotes.find(x=>x.id===id);if(!q)return toast('Preventivo non trovato');this.downloadPDF(q,preview)},
 downloadPDF(q,preview=false){try{const bytes=this.makePDF(q);const blob=new Blob([bytes],{type:'application/pdf'});const url=URL.createObjectURL(blob);if(preview){const win=window.open(url,'_blank','noopener,noreferrer');if(!win)toast('Anteprima bloccata. Usa Scarica PDF A4.')}else{const anchor=document.createElement('a');anchor.href=url;anchor.download='STC_LOGISTICS_'+String(q.code||'preventivo').replace(/[^a-z\d_-]/ig,'_')+'.pdf';document.body.append(anchor);anchor.click();anchor.remove();toast('PDF A4 creato: prezzo finale, senza costi riservati')}setTimeout(()=>URL.revokeObjectURL(url),60000)}catch(e){console.error(e);toast('PDF non generato: '+e.message)}},
 makePDF(q){
  // PDF/A non garantito; PDF 1.4 standard A4, spezzato per pagine e senza contenuti riservati.
  const printable=s=>String(s??'').replace(/[^\u0020-\u007e\u00a0-\u00ff€]/g,' ').replace(/[\\()]/g,'\\$&');
  const business=state?.business||{};const lines=[];
  lines.push('STC LOGISTICS  -  PREVENTIVO COMMERCIALE',business.companyName||'Dati aziendali da completare',business.companyAddress||'',(business.companyCity||'')+'  P.IVA '+(business.companyVat||'da verificare'),'',
   'Numero: '+(q.code||'ANTEPRIMA')+'   Data: '+(q.date||''),'Cliente: '+(q.customer||''),'Riferimento: '+(q.reference||''),'Consegna prevista: '+(q.deliveryDate||''),'');
  const c=q.customerSnapshot||state.customers.find(x=>x.id===q.customerId);
  if(c){lines.push('Dati cliente: '+(c.address||'')+' '+(c.cap||'')+' '+(c.city||''),'P.IVA cliente: '+(c.vat||'non indicata'),'')}
  lines.push('DETTAGLIO SERVIZI');const friendly={shipping:'Spedizione',handling:'Carico / scarico',storage:'Deposito'};
  const parts=q.servicePriceSnapshot?.lines||q.totals?.serviceLines||[];
  if(parts.length){for(const r of parts){let detail=friendly[r.type]||r.type;if(r.type==='handling')detail+=' - '+r.loadQty+' carico / '+r.unloadQty+' scarico';if(r.type==='storage')detail+=' - '+r.nights+' notti';lines.push(detail+': '+(r.netCents/100).toFixed(2)+' EUR');}}
  else lines.push('Spedizione: '+Number(q.totals?.taxable||0).toFixed(2)+' EUR');
  lines.push('');for(const s of q.shipments||[]){lines.push('Destinazione: '+(s.city||s.destination||'')+' '+(s.province||''),'Destinatario: '+(s.recipientName||'')+' - '+(s.address||''));for(const item of s.items||[])lines.push('Merce: '+(item.qty||1)+' '+(item.type||'colli')+'  '+[item.l,item.w,item.h].filter(Boolean).join(' x ')+' cm')}
  lines.push('','IMPONIBILE FINALE: '+Number(q.totals?.taxable||0).toFixed(2)+' EUR','IVA: '+Number(q.totals?.vatAmount||0).toFixed(2)+' EUR','TOTALE: '+Number(q.totals?.total||0).toFixed(2)+' EUR','',
   'Note: '+(q.notes||''),'','Documento da verificare prima dell invio.');
  // A4 595x842 points. Text starts y=805, line every 18 points. 36 lines/page.
  const wrapped=[];for(const row of lines){let text=String(row||'');if(!text){wrapped.push('');continue}while(text.length>84){let cut=text.lastIndexOf(' ',84);if(cut<30)cut=84;wrapped.push(text.slice(0,cut));text=text.slice(cut).trimStart()}wrapped.push(text)}
  const pages=[];for(let i=0;i<wrapped.length;i+=36)pages.push(wrapped.slice(i,i+36));if(!pages.length)pages.push([]);
  const objects=[],add=(s)=>{objects.push(s);return objects.length};
  const font=add('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>');
  const imageId=add({stream:atob(STC_PDF_LOGO_BASE64),dict:'/Type /XObject /Subtype /Image /Width 128 /Height 128 /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode'});
  const pageIDs=[];const catalog=add('');const rootPages=add('');
  for(let p=0;p<pages.length;p++){
   const stream=[];stream.push('0.10 0.20 0.43 rg 0 782 595 60 re f','1 1 1 rg BT /F1 18 Tf 38 802 Td (STC LOGISTICS) Tj ET',`q 52 0 0 52 505 789 cm /Im1 Do Q`,'0 0 0 rg');
   pages[p].forEach((line,i)=>{const y=760-i*18;if(y<35)return;const encoded=printable(line).split('').map(ch=>ch==='€'?String.fromCharCode(128):ch).join('');stream.push(`BT /F1 ${i===0?12:10} Tf 38 ${y} Td (${encoded}) Tj ET`)});
   stream.push(`BT /F1 9 Tf 495 25 Td (${p+1} / ${pages.length}) Tj ET`);
   const data=stream.join('\n')+'\n';
   const contentId=add({stream:data});const pageId=add(`<< /Type /Page /Parent ${rootPages} 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 ${font} 0 R >> /XObject << /Im1 ${imageId} 0 R >> >> /Contents ${contentId} 0 R >>`);pageIDs.push(pageId);
  }
  objects[catalog-1]=`<< /Type /Catalog /Pages ${rootPages} 0 R >>`;
  objects[rootPages-1]=`<< /Type /Pages /Count ${pageIDs.length} /Kids [${pageIDs.map(id=>id+' 0 R').join(' ')}] >>`;
  const latin1=(s)=>{const array=[];for(const ch of s){const v=ch.charCodeAt(0);array.push(v<=255?v:63)}return array};
  let out=latin1('%PDF-1.4\n%STC1\n'),offsets=[0];
  for(let i=0;i<objects.length;i++){
   offsets.push(out.length);const obj=objects[i],prefix=`${i+1} 0 obj\n`;
   out.push(...latin1(prefix));if(typeof obj==='string')out.push(...latin1(obj));else{
    const data=latin1(obj.stream);out.push(...latin1(`<< ${obj.dict||''} /Length ${data.length} >>\nstream\n`),...data,...latin1('\nendstream'));
   }
   out.push(...latin1('\nendobj\n'));
  }
  const xref=out.length;out.push(...latin1('xref\n0 '+(objects.length+1)+'\n0000000000 65535 f \n'));
  for(let i=1;i<offsets.length;i++)out.push(...latin1(String(offsets[i]).padStart(10,'0')+' 00000 n \n'));
  out.push(...latin1(`trailer\n<< /Size ${objects.length+1} /Root ${catalog} 0 R >>\nstartxref\n${xref}\n%%EOF`));return new Uint8Array(out);
 }
};
function calendarLocalTodayFromDate(d){return [d.getFullYear(),String(d.getMonth()+1).padStart(2,'0'),String(d.getDate()).padStart(2,'0')].join('-')}
// Decorazione mirata delle funzioni esistenti: preserva flussi originali, senza archivi paralleli.
const stcOldRenderCustomers=renderCustomers;
renderCustomers=function(){stcOldRenderCustomers();STCExtra.renderCustomersExtension()};
const stcOldRenderTariffs=renderTariffs;
renderTariffs=function(){stcOldRenderTariffs();STCExtra.renderRates();STCExtra.renderSupplierList()};
const stcOldEntRender=entRender;
entRender=function(page){stcOldEntRender(page);if(page==='inventory')STCExtra.renderWarehouse()};
const stcOldCalendarEventsFrom=calendarEventsFrom;
calendarEventsFrom=function(data,filter){
 const ev=stcOldCalendarEventsFrom(data,filter).filter(x=>x.kind!=='quote'||x.quoteStatus!=='Bozza');
 const linked=new Set((data.calendarRuns||[]).map(r=>r.linkedQuoteId).filter(Boolean));
 return ev.filter(x=>!(x.kind==='quote'&&x.quoteStatus==='Accettato'&&linked.has(x.id))).filter(x=>STCExtra.matchesResource(x));
};
const stcOldCalendarOpen=calendarOpen;
calendarOpen=function(kind,id){stcOldCalendarOpen(kind,id);STCExtra.calendarModal(kind,id)};
const stcOldCalendarRender=calendarRender;
calendarRender=function(){stcOldCalendarRender();if($('stcCalView')?.value!=='month')STCExtra.renderCalendarView()};
const stcOldGo=go;
go=function(page){stcOldGo(page);if(page==='quote')STCExtra.updateQuoteControls();if(page==='dashboard')STCExtra.renderCalendarView()};
