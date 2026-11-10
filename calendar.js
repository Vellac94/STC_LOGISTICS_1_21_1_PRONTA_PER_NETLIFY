"use strict";
/* STC LOGISTICS 1.15 — calendario operativo. Zero dipendenze online.
   Le bolle sono snapshot autonomi delle spedizioni già calcolate; i preventivi
   restano preventivi finché non passano ad Accettato. Nessun incasso automatico. */
let calendarVisibleMonth='';
const CALENDAR_DATE=/^\d{4}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12]\d|3[01])$/;
function calendarLocalToday(){const n=new Date();return [n.getFullYear(),String(n.getMonth()+1).padStart(2,'0'),String(n.getDate()).padStart(2,'0')].join('-')}
function calendarDateValid(v){if(typeof v!=='string'||!CALENDAR_DATE.test(v))return false;const [y,m,d]=v.split('-').map(Number);const n=new Date(y,m-1,d);return n.getFullYear()===y&&n.getMonth()===m-1&&n.getDate()===d}
function calendarSafeMonth(month){return /^\d{4}-(?:0[1-9]|1[0-2])$/.test(month)?month:calendarLocalToday().slice(0,7)}
function calendarMonthShift(month,step){const [y,m]=calendarSafeMonth(month).split('-').map(Number);const d=new Date(y,m-1+step,1);return [d.getFullYear(),String(d.getMonth()+1).padStart(2,'0')].join('-')}
function calendarStatus(q){return q.status==='Accettato'?'accepted':['Rifiutato','Annullato'].includes(q.status)?'declined':'waiting'}
function calendarEventsFrom(data,visibleQuote=()=>true){
 const runs=(Array.isArray(data.calendarRuns)?data.calendarRuns:[]).filter(r=>calendarDateValid(r.day));
 const quotes=(Array.isArray(data.quotes)?data.quotes:[]).filter(q=>visibleQuote(q)&&calendarDateValid(q.deliveryDate));
 return [
  ...runs.map(r=>({kind:'run',id:r.id,day:r.day,code:r.code,label:r.reference||r.code,count:r.shipments?.length||0,status:'run',amount:Number(r.totalCents||0)/100})),
  ...quotes.map(q=>({kind:'quote',id:q.id,day:q.deliveryDate,code:q.code,label:q.customer||q.reference||q.code,count:q.shipments?.length||0,status:calendarStatus(q),quoteStatus:q.status||'Bozza',amount:Number(q.totals?.taxable||0)}))
 ].sort((a,b)=>a.day.localeCompare(b.day)||({run:0,accepted:1,waiting:2,declined:3}[a.status]-{run:0,accepted:1,waiting:2,declined:3}[b.status])||(a.code||'').localeCompare(b.code||''));
}
function calendarRunStore(){if(!Array.isArray(state.calendarRuns))state.calendarRuns=[];return state.calendarRuns}
function calendarNextRunCode(day){const year=day.slice(0,4);let n=Number(state.calendarRunSeq?.[year]||0);
 for(const r of calendarRunStore()){const m=String(r.code||'').match(new RegExp('^BOL-'+year+'-(\\d+)$'));if(m)n=Math.max(n,Number(m[1]))}
 n++;return{year,number:n,code:`BOL-${year}-${String(n).padStart(4,'0')}`}}
function calendarRender(){
 const grid=document.getElementById('calendarGrid');if(!grid)return;
 if(!calendarVisibleMonth)calendarVisibleMonth=calendarLocalToday().slice(0,7);
 const month=calendarSafeMonth(calendarVisibleMonth);calendarVisibleMonth=month;
 const [year,m]=month.split('-').map(Number);
 document.getElementById('calendarTitle').textContent=new Date(year,m-1,1).toLocaleDateString('it-IT',{month:'long',year:'numeric'});
 const events=calendarEventsFrom(state,ownsQuote);
 const thisMonth=events.filter(e=>e.day.startsWith(month));
 const counts={run:0,waiting:0,accepted:0,declined:0};for(const e of thisMonth)counts[e.status]++;
 document.getElementById('calendarSummary').innerHTML=`<span>${counts.run} ${counts.run===1?'bolla confermata':'bolle confermate'}</span><span>${counts.waiting} preventivi in attesa</span><span>${counts.accepted} preventivi accettati</span><span>${counts.declined} rifiutati / annullati</span>`;
 const first=new Date(year,m-1,1);const shift=(first.getDay()+6)%7;const days=new Date(year,m,0).getDate();const cellCount=Math.ceil((shift+days)/7)*7;
 const byDay=new Map();for(const e of events){const a=byDay.get(e.day)||[];a.push(e);byDay.set(e.day,a)}
 const today=calendarLocalToday();let cells='';
 for(let i=0;i<cellCount;i++){
  const d=new Date(year,m-1,i-shift+1);const key=[d.getFullYear(),String(d.getMonth()+1).padStart(2,'0'),String(d.getDate()).padStart(2,'0')].join('-');
  const outside=d.getMonth()!==m-1,items=byDay.get(key)||[];
  cells+=`<div class="calendar-day${outside?' outside':''}${key===today?' today':''}" role="gridcell" aria-label="${esc(d.toLocaleDateString('it-IT',{weekday:'long',day:'numeric',month:'long'}))}">
    <div class="calendar-day-head"><strong>${d.getDate()}</strong>${items.length?`<span>${items.length} att.</span>`:''}</div>
    ${items.map(e=>`<button type="button" class="cal-entry ${e.status}" data-kind="${e.kind}" data-id="${esc(e.id)}" onclick="calendarOpen(this.dataset.kind,this.dataset.id)" title="${esc(e.code+' — '+e.label)}"><b>${e.kind==='run'?'Bolla':'Prev.'} ${esc(e.code)}</b><small>${esc(e.kind==='run'?(e.label+' · '+e.count+' sped.'):(e.label+' · '+(e.status==='waiting'?(e.quoteStatus==='Bozza'?'Bozza':'In attesa'):e.status==='accepted'?'Accettato':'Rifiutato/annullato')))}</small></button>`).join('')}
   </div>`;
 }
 grid.innerHTML=cells;
 const undated=(state.quotes||[]).filter(q=>ownsQuote(q)&&!calendarDateValid(q.deliveryDate));
 const holder=document.getElementById('calendarUndated');if(holder)holder.innerHTML=undated.length?`<strong>${undated.length} preventivi senza data consegna.</strong> Non vengono inseriti in un giorno arbitrario. <button type="button" class="alt" onclick="go('archive')">Apri archivio e assegna le date</button>`:'';
}
function calendarMove(delta){calendarVisibleMonth=calendarMonthShift(calendarVisibleMonth||calendarLocalToday().slice(0,7),delta);calendarRender()}
function calendarToday(){calendarVisibleMonth=calendarLocalToday().slice(0,7);calendarRender()}
async function calendarSaveQuickRun(){
 if(typeof fastShips==='undefined'||!fastShips.length)return toast('Compila la bolla nella Calcolatrice');
 const day=document.getElementById('quickRunDate')?.value||'';
 if(!calendarDateValid(day))return toast('Seleziona una data valida per il giro');
 const evaluated=fastShips.map(s=>quickCompute(s));const bad=evaluated.find(r=>!r.valid);
 if(bad)return toast('Impossibile registrare la bolla: '+bad.reason);
 const reference=(document.getElementById('quickRunRef')?.value||'').trim();
 const clientId=document.getElementById('quickRunClient')?.value||'';
 const linkedQuoteId=document.getElementById('quickRunQuoteLink')?.value||'';
 if(linkedQuoteId){const q=state.quotes.find(q=>q.id===linkedQuoteId&&q.status==='Accettato');const c=state.customers.find(c=>c.id===clientId);if(!q||!c||q.customer!==c.name)return toast('Il preventivo collegato non appartiene al cliente selezionato');}
 const dEp=String(document.getElementById('quickEPALDelivered')?.value||'0'),rEp=String(document.getElementById('quickEPALReturned')?.value||'0');
 const delivered=Number(dEp),returned=Number(rEp);
 if(!/^\d+$/.test(dEp)||!/^\d+$/.test(rEp)||!Number.isSafeInteger(delivered)||!Number.isSafeInteger(returned))return toast('Quantità EPAL: usa numeri interi non negativi');
 if((delivered||returned)&&!clientId)return toast('Seleziona il cliente per contabilizzare i bancali EPAL');
 const fingerprint=JSON.stringify({day,reference,clientId,linkedQuoteId,delivered,returned,shipments:fastShips.map(s=>({destination:s.destination,region:s.region,zone:s.zone,kg:s.kg,volume:s.volume,source:quickSource(s),supp:s.supp,markup:s.markupPercent,items:s.items}))});
 if(reference&&calendarRunStore().some(r=>r.day===day&&r.reference?.toLocaleLowerCase('it')===reference.toLocaleLowerCase('it')&&(r.clientId||'')===clientId))return toast('Riferimento bolla già presente per questo cliente e giorno. Apri il giro dal calendario per correggerlo.');
 const existing=calendarRunStore().find(r=>r.fingerprint===fingerprint);
 if(existing){calendarVisibleMonth=day.slice(0,7);calendarRender();return toast('Questa stessa bolla è già nel calendario ('+existing.code+'). Per una nuova bolla modifica il riferimento o i dati.');}
 const btn=document.getElementById('quickSaveRun');if(btn)btn.disabled=true;
 const seq=calendarNextRunCode(day);
 const now=new Date().toISOString();
 const shipments=fastShips.map((s,i)=>({destination:String(s.destination||''),region:String(s.region||''),zone:String(s.zone||''),kg:evaluated[i].weightKg,volume:evaluated[i].weightOnly?null:evaluated[i].volumeM3,quintali:evaluated[i].billedQ,weightOnly:!!evaluated[i].weightOnly,
  volumeSource:quickSource(s),items:JSON.parse(JSON.stringify(s.items||[])),manualSupplement:num(s.supp),markupPercent:num(s.markupPercent),
  totalCents:evaluated[i].totalCents,tariffCents:evaluated[i].tariffCents,rateCents:evaluated[i].rateCents,band:evaluated[i].band}));
 const linkedQuote=state.quotes.find(q=>q.id===linkedQuoteId);
 const run={id:uid(),workId:linkedQuote?.workId||uid(),code:seq.code,day,reference,clientId,linkedQuoteId,epal:{delivered,returned,clientId},fingerprint,shipments,created:now,createdBy:activeUser?.id||'',confirmed:true,totalCents:evaluated.reduce((n,v)=>n+v.totalCents,0),currency:'EUR'};
 calendarRunStore().unshift(run);if(linkedQuoteId&&state.resourceAssignments?.['quote:'+linkedQuoteId])state.resourceAssignments['run:'+run.id]=state.resourceAssignments['quote:'+linkedQuoteId];const prevSeq=state.calendarRunSeq;state.calendarRunSeq={...(prevSeq||{}),[seq.year]:seq.number};
 let success=false;try{success=await persist()}catch(_){success=false}
 if(!success){state.calendarRuns=state.calendarRuns.filter(r=>r.id!==run.id);if(state.resourceAssignments)delete state.resourceAssignments['run:'+run.id];state.calendarRunSeq=prevSeq;toast('Bolla non salvata. Controlla lo spazio disponibile e il backup.');}
 else{calendarVisibleMonth=day.slice(0,7);calendarRender();toast(seq.code+' registrata nel calendario. Apri la Dashboard per vederla.');const hint=document.getElementById('quickRunHint');if(hint)hint.textContent=seq.code+' salvata · '+day+'. Se la ricrei avrai una nuova bolla.';}
 if(btn)btn.disabled=false;
}
function calendarDisplayDay(day){if(!calendarDateValid(day))return 'Da programmare';const [y,m,d]=day.split('-');return `${d}/${m}/${y}`}
function calendarShipDetails(ship,i,isRun){
 const place=ship.destination||ship.city||'-',kg=isRun?ship.kg:ship.kg;
 const items=ship.items||[];
 const volume=isRun?Number(ship.volume||0):(typeof quoteDerivedVolume==='function'&&ship.volumeSource==='dimensions'?Number(STCCalc.decimal(quoteDerivedVolume(ship))):Number(STCCalc.decimal(ship.volume||0)));
 return `<div class="cal-detail-ship"><strong>Spedizione ${i+1} · ${esc(place)}</strong><p>${esc(ship.region||'')} · ${esc(ship.zone||'')}${ship.recipientName?' · Destinatario: '+esc(ship.recipientName):''}</p>
 <p>${ship.address?'Indirizzo: '+esc(ship.address)+' · ':''}${ship.cap?'CAP '+esc(ship.cap)+' · ':''}Peso reale: ${esc(kg||0)} kg · Volume: ${isRun&&ship.weightOnly?'non indicato':Number(volume||0).toLocaleString('it-IT',{maximumFractionDigits:4})+' m³'}${isRun?' · '+esc(ship.quintali)+' q tassabili':''}</p>
 ${items.length?`<details><summary>${items.length} ${items.length===1?'gruppo di colli':'gruppi di colli'}</summary><div>${items.map((g,j)=>`<p>Gruppo ${j+1}: ${esc(g.qty||1)} × ${esc(g.l||'—')} × ${esc(g.w||'—')} × ${esc(g.h||'—')} cm</p>`).join('')}</div></details>`:''}
 ${isRun?`<p>Tariffa registrata: <strong>${money(Number(ship.totalCents||0)/100)}</strong></p>`:''}
 </div>`;
}
function calendarOpen(kind,id){
 const modal=document.getElementById('calendarDetail'),body=document.getElementById('calendarDetailBody'),actions=document.getElementById('calendarDetailActions');
 let x;if(kind==='run')x=calendarRunStore().find(r=>r.id===id);else if(kind==='quote')x=(state.quotes||[]).find(q=>q.id===id&&ownsQuote(q));if(!x)return toast('Attività non trovata');
 const isRun=kind==='run';document.getElementById('calendarDetailTitle').textContent=isRun?(x.code+' · Giro confermato'):(x.code+' · Preventivo');
 const status=isRun?'Confermato':(x.status||'Bozza');
 const total=isRun?Number(x.totalCents||0)/100:Number(x.totals?.taxable||0);
 body.innerHTML=`<div class="cal-detail-summary"><div><span>Giorno di consegna</span><strong>${esc(calendarDisplayDay(isRun?x.day:x.deliveryDate))}</strong></div><div><span>Stato</span><strong>${esc(status)}</strong></div><div><span>${isRun?'Riferimento bolla':'Cliente'}</span><strong>${esc(isRun?(x.reference||x.code):x.customer)}</strong></div><div><span>Valore previsto · IVA esclusa</span><strong>${money(total)}</strong></div></div>
  <h3>${(x.shipments||[]).length} ${x.shipments?.length===1?'spedizione':'spedizioni'}</h3>${(x.shipments||[]).map((s,i)=>calendarShipDetails(s,i,isRun)).join('')||'<p>Nessuna spedizione dettagliata</p>'}
  ${!isRun&&x.notes?`<p><strong>Note:</strong> ${esc(x.notes)}</p>`:''}
  <p class="muted" style="font-size:12px">${isRun?'La bolla è già confermata. Il valore salvato non viene ricalcolato quando cambi il tariffario.':'L’accettazione trasforma la richiesta in attività confermata sul calendario. Non registra automaticamente un incasso.'}</p>`;
 if(isRun){actions.innerHTML=`<label style="min-width:185px">Sposta il giro al giorno<input type="date" id="calendarRunMoveDate" value="${esc(x.day)}"></label><button class="alt" data-id="${esc(x.id)}" onclick="calendarMoveRun(this.dataset.id)">Sposta</button><button class="danger" data-id="${esc(x.id)}" onclick="calendarDeleteRun(this.dataset.id)">Elimina bolla</button>`}
 else{const can=isAdmin();actions.innerHTML=`<button class="alt" data-id="${esc(x.id)}" onclick="document.getElementById('calendarDetail').close();openQuote(this.dataset.id)">Apri preventivo</button>${can?`<button class="primary" data-id="${esc(x.id)}" onclick="calendarChangeQuote(this.dataset.id,'Accettato')" ${x.status==='Accettato'?'disabled':''}>Accetta e conferma</button><button class="alt" data-id="${esc(x.id)}" onclick="calendarChangeQuote(this.dataset.id,'Rifiutato')" ${x.status==='Rifiutato'?'disabled':''}>Rifiuta · grigio</button><button class="alt" data-id="${esc(x.id)}" onclick="calendarChangeQuote(this.dataset.id,'Inviato')">Metti in attesa</button>`:''}`;}
 modal.showModal();
}
async function calendarChangeQuote(id,status){if(!isAdmin())return toast('Solo amministratore può modificare lo stato');
 const q=(state.quotes||[]).find(x=>x.id===id);if(!q)return;
 await setStatus(id,status);document.getElementById('calendarDetail').close();calendarRender();
}
async function calendarMoveRun(id){const r=calendarRunStore().find(x=>x.id===id);if(!r)return;const next=document.getElementById('calendarRunMoveDate')?.value;if(!calendarDateValid(next))return toast('Data non valida');
 const previous=r.day;if(previous===next){document.getElementById('calendarDetail').close();return}
 r.day=next;const ok=await persist();if(!ok){r.day=previous;return}calendarVisibleMonth=next.slice(0,7);calendarRender();document.getElementById('calendarDetail').close();toast('Giro spostato nel calendario');}
async function calendarDeleteRun(id){const arr=calendarRunStore(),run=arr.find(r=>r.id===id);if(!run)return; if(run.epal&&(run.epal.delivered||run.epal.returned))return toast('Bolla con movimento EPAL: modifica il registro giro, non eliminare la traccia.');if(typeof entSourceUsed==='function'&&entSourceUsed('run:'+id))return toast('Bolla già collegata a fattura: non è eliminabile');if(!confirm('Eliminare la bolla dal calendario? Il numero non sarà riutilizzato.'))return;
 state.calendarRuns=arr.filter(r=>r.id!==id);if(!await persist()){state.calendarRuns=arr;return}
 document.getElementById('calendarDetail').close();calendarRender();toast('Bolla eliminata dal calendario');}
