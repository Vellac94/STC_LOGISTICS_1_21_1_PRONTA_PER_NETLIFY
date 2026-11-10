"use strict";
/* Calcolatrice rapida v1.11: volume automatico dalle misure o diretto, senza scelta manuale. */
let fastShips=[];
let quickTimer=null;
const fastZones=()=>TARIFFS.map(t=>({key:t.region+'|'+t.zone,label:t.region+' · '+t.zone}));
function quickNewGroup(){return{id:uid(),qty:'1',l:'',w:'',h:''}}
function quickNewShip(){return{id:uid(),destination:'',region:'',zone:'',kg:'',volume:'',volumeSource:'dimensions',supp:'0',markupPercent:'0',items:[quickNewGroup()]}}
function quickSource(s){
 if(s.volumeSource==='manual'||s.volumeSource==='dimensions')return s.volumeSource;
 // Compatibilità con le bozze della 1.10, che prevedevano la scelta radio.
 return s.volumeMode==='volume'?'manual':'dimensions';
}
function quickNormalize(s){
 s.volumeSource=quickSource(s);s.volume=String(s.volume??'');
 if(!Array.isArray(s.items)||!s.items.length)s.items=[quickNewGroup()];
 delete s.volumeMode;return s;
}
function quickDefaults(){fastShips=(state.quickCalcDraft?.length?JSON.parse(JSON.stringify(state.quickCalcDraft)):[quickNewShip()]).map(quickNormalize);quickRender()}
function quickDerivedVolume(s){
 if(!Array.isArray(s.items)||!s.items.length)return '';
 let total=0;
 for(const g of s.items){
  const qty=STCCalc.decimal(g.qty),l=STCCalc.decimal(g.l),w=STCCalc.decimal(g.w),h=STCCalc.decimal(g.h);
  if(!Number.isInteger(qty)||qty<1||l<=0||w<=0||h<=0)return '';
  total+=qty*l*w*h/1e6;
 }
 return total>0?Number(total.toFixed(6)).toLocaleString('it-IT',{useGrouping:false,maximumFractionDigits:6}):'';
}
function quickShownVolume(s){return quickSource(s)==='manual'?String(s.volume??''):quickDerivedVolume(s)}

function quickEdit(id,key,value){const s=fastShips.find(x=>x.id===id);if(!s)return;
 if(key==='destination'&&value!==s.destination){s.region='';s.zone='';s.geoSource='';s.geoWarning='';}
 s[key]=value;
 if(key==='volume'){s.volumeSource=String(value).trim()?'manual':'dimensions';}
 if(key==='destination')quickGeoSuggest(id,value);
 quickRecalc();quickSaveDraft();}
function quickZone(id,value){const s=fastShips.find(x=>x.id===id);if(!s)return;const t=TARIFFS.find(t=>t.region+'|'+t.zone===value);s.region=t?.region||'';s.zone=t?.zone||'';s.geoSource=t?'Scelta manuale':'';s.geoWarning='';quickGeoHint(id);quickRecalc();quickSaveDraft()}
function quickEditGroup(id,gid,key,value){
 const s=fastShips.find(x=>x.id===id),g=s?.items.find(x=>x.id===gid);if(!g)return;
 g[key]=value;
 // L'ultima modifica alle misure rende le misure la fonte del volume.
 // Il volume digitato precedentemente non viene sommato: resta solo quello da misure.
 s.volume='';s.volumeSource='dimensions';quickRecalc();quickSaveDraft();
}
function quickAddGroup(id){const s=fastShips.find(x=>x.id===id);if(!s)return;s.items.push(quickNewGroup());quickRender();quickSaveDraft()}
function quickRemoveGroup(id,gid){const s=fastShips.find(x=>x.id===id);if(!s)return;if(s.items.length===1)return toast('Serve almeno un gruppo per la spedizione');s.items=s.items.filter(i=>i.id!==gid);quickRender();quickSaveDraft()}
function quickAddShip(){fastShips.push(quickNewShip());quickRender();quickSaveDraft()}
function quickRemoveShip(id){if(fastShips.length===1)return toast('Serve almeno una destinazione');fastShips=fastShips.filter(s=>s.id!==id);quickRender();quickSaveDraft()}
function quickSaveDraft(){clearTimeout(quickTimer);quickTimer=setTimeout(async()=>{state.quickCalcDraft=JSON.parse(JSON.stringify(fastShips));await persist()},650)}
async function quickReset(){if(!confirm('Azzerare tutti i dati del calcolatore rapido? I preventivi salvati non verranno toccati.'))return;fastShips=[quickNewShip()];quickRender();state.quickCalcDraft=JSON.parse(JSON.stringify(fastShips));await persist()}
function quickRender(){const node=$('fastShipments');if(!node)return;
 const groups=[...new Set(TARIFFS.map(t=>t.region))];
 const zones=groups.map(region=>`<optgroup label="${esc(region)}">${TARIFFS.filter(t=>t.region===region).map(t=>`<option value="${esc(t.region+'|'+t.zone)}">${esc(t.zone)}</option>`).join('')}</optgroup>`).join('');
 node.innerHTML=fastShips.map((s,idx)=>`<article class="fast-ship" id="fast_${s.id}">
 <div class="row between"><div><span class="fast-eyebrow">SPEDIZIONE ${idx+1}</span><h3 style="margin:4px 0 0">Dati della bolla</h3></div>${fastShips.length>1?`<button class="danger" onclick="quickRemoveShip('${s.id}')">Rimuovi</button>`:''}</div>
 <div class="fast-inputs"><label class="geo-field">Destinazione / località<input placeholder="Es. Fiorano Modenese" value="${esc(s.destination)}" oninput="quickEdit('${s.id}','destination',this.value)" autocomplete="off" aria-label="Destinazione o località"><span class="geo-hint" id="geoHint_${s.id}" aria-live="polite"></span><div class="geo-suggestions" id="geoSugg_${s.id}"></div></label>
 <label>Zona tariffaria<select onchange="quickZone('${s.id}',this.value)"><option value="">Scegli la zona dalla tabella</option>${zones.replace(`value="${esc(s.region+'|'+s.zone)}"`,`value="${esc(s.region+'|'+s.zone)}" selected`)}</select></label>
 <label>Peso reale totale (kg) <small style="font-weight:400">— sufficiente anche senza misure</small><input type="number" inputmode="decimal" min="0" step="0.01" placeholder="Es. 1200" value="${esc(s.kg)}" oninput="quickEdit('${s.id}','kg',this.value)"></label></div>
 <div class="fast-direct-volume"><label>Volume totale della spedizione (m³)<input id="quickVolume_${s.id}" type="text" inputmode="decimal" placeholder="Scrivi i m³ oppure inserisci le misure sotto" value="${esc(quickShownVolume(s))}" oninput="quickEdit('${s.id}','volume',this.value)" aria-label="Volume totale in metri cubi" aria-describedby="quickVolumeHint_${s.id}"></label><small id="quickVolumeHint_${s.id}" aria-live="polite">${quickSource(s)==='manual'?'Volume digitato direttamente: le misure eventualmente presenti non vengono conteggiate.':'Se compili le misure, il volume compare qui automaticamente. Puoi anche digitarlo direttamente.'}</small></div>
 <div class="fast-groups-title"><strong>Colli / gruppi di dimensioni uguali</strong><button class="alt" onclick="quickAddGroup('${s.id}')">+ Gruppo</button></div>
 ${s.items.map((g,n)=>`<div class="fast-group"><div class="row between"><strong>Gruppo ${n+1}</strong>${s.items.length>1?`<button class="danger" aria-label="Elimina gruppo ${n+1}" onclick="quickRemoveGroup('${s.id}','${g.id}')">✕</button>`:''}</div>
 <div class="fast-dimensions"><label>Quantità<input type="number" inputmode="numeric" min="1" step="1" value="${esc(g.qty)}" oninput="quickEditGroup('${s.id}','${g.id}','qty',this.value)"></label>
 <label>Lunghezza cm<input type="number" inputmode="decimal" min="0" step="0.1" placeholder="cm" value="${esc(g.l)}" oninput="quickEditGroup('${s.id}','${g.id}','l',this.value)"></label>
 <label>Larghezza cm<input type="number" inputmode="decimal" min="0" step="0.1" placeholder="cm" value="${esc(g.w)}" oninput="quickEditGroup('${s.id}','${g.id}','w',this.value)"></label>
 <label>Altezza cm<input type="number" inputmode="decimal" min="0" step="0.1" placeholder="cm" value="${esc(g.h)}" oninput="quickEditGroup('${s.id}','${g.id}','h',this.value)"></label></div></div>`).join('')}
 <details class="fast-extras"><summary>Supplementi e maggiorazioni (facoltativi)</summary><div class="fast-inputs"><label>Supplemento manuale €<input type="number" min="0" step="0.01" inputmode="decimal" value="${esc(s.supp||'0')}" oninput="quickEdit('${s.id}','supp',this.value)"></label><label>Maggiorazione %<input type="number" min="0" step="0.1" inputmode="decimal" value="${esc(s.markupPercent||'0')}" oninput="quickEdit('${s.id}','markupPercent',this.value)"></label></div></details>
 <div class="fast-output" id="quickResult_${s.id}" aria-live="polite"></div>
 </article>`).join('');quickRecalc();quickGeoRefreshAll()}
function quickCompute(s){
 const direct=quickSource(s)==='manual';
 const raw=String(s.volume??'').trim();
 // Inserimento m³ diretto: le misure non si sommano.
 if(direct&&(!/^(?:\d+(?:[.,]\d+)?|[.,]\d+)$/.test(raw)||STCCalc.decimal(raw)<=0)){
  const base=STCCalc.compute({...s,volume:'',items:[]},TARIFFS,{allowVolumeOverride:true,requireDestination:true});
  return {...base,valid:false,reason:'Inserisci un volume totale m³ maggiore di zero (es. 1,5)'};
 }
 // Solo peso: le dimensioni non sono obbligatorie. Non inventare un volume zero
 // come dato dichiarato e non attribuire un minimo a una spedizione vuota.
 const withDims=(s.items||[]).some(g=>['l','w','h'].some(k=>String(g[k]??'').trim()!==''));
 const onlyWeight=!direct&&!withDims&&STCCalc.decimal(s.kg)>0;
 const computed=STCCalc.compute(s,TARIFFS,{requireDimensions:!direct&&!onlyWeight,allowVolumeOverride:direct,requireDestination:true,requireVolume:direct});
 // Se è stata inserita anche una sola misura, tutte le misure devono essere
 // complete: evitare una quotazione sottostimata per misure parziali.
 return {...computed,weightOnly:onlyWeight,billedQ:computed.chargeableQ>0?Math.max(3,computed.chargeableQ):0};
}
function quickFmt(v,digits=2){return Number(v||0).toLocaleString('it-IT',{minimumFractionDigits:digits,maximumFractionDigits:digits})}
function quickRecalc(){let cents=0,complete=0;const errors=[];for(const s of fastShips){const res=quickCompute(s);const node=$('quickResult_'+s.id);if(!node)continue;
 const volInput=$('quickVolume_'+s.id),hint=$('quickVolumeHint_'+s.id);
 if(volInput&&quickSource(s)==='dimensions')volInput.value=quickDerivedVolume(s);
 if(hint)hint.textContent=quickSource(s)==='manual'
  ?'m³ digitati direttamente: eventuali misure compilate non vengono sommate.'
  :(quickDerivedVolume(s)?'m³ calcolati automaticamente dalle misure. Puoi correggerli scrivendo nel campo qui sopra.':'Inserisci direttamente i m³ oppure compila lunghezza, larghezza e altezza. Nessuna selezione necessaria.');
 const observed=`<div class="fast-facts"><div><span>Peso reale</span><strong>${quickFmt(res.weightKg)} kg</strong></div><div><span>Volume totale</span><strong>${res.weightOnly?'Non indicato':Number(res.volumeM3.toFixed(3)).toLocaleString('it-IT',{useGrouping:false,maximumFractionDigits:3})+' m³'}</strong></div><div><span>Peso da volume</span><strong>${res.weightOnly?'Non calcolabile senza m³':quickFmt(res.volQ*100)+' kg ('+quickFmt(res.volQ)+' q)'}</strong></div><div><span>Peso tassabile</span><strong>${res.billedQ} q${res.minApplied?' <small>(minimo tariffario)</small>':''}</strong></div></div>`;
 if(!res.valid){errors.push(res.reason);node.innerHTML=observed+`<div class="fast-warning">${esc(res.reason)}</div>`;continue}
 cents+=res.totalCents;complete++;
 const supplementLabel=res.tariffSupplementCents?money(res.tariffSupplementCents/100):'Nessun supplemento separato nel tariffario';
 const weightOnlyHelp=res.weightOnly?'<p class="fast-weightonly-help">Calcolo con solo peso reale: volume non comunicato. Fino a 3 q viene applicato il minimo della destinazione; oltre 3 q si applica la fascia per il peso.</p>':'';
 node.innerHTML=`${observed}${weightOnlyHelp}<div class="fast-driver">Determina il costo: <strong>${esc(res.driver)}</strong> · ${esc(res.band)}${res.minApplied?' (minimo applicato)':''}</div>
 <div class="fast-lines"><div><span>Tariffa destinazione (${esc(s.zone)})</span><strong>${money(res.tariffCents/100)}</strong></div><div><span>Dettaglio tariffa</span><span>${res.minApplied?'Minimo fisso':res.chargeableQ+' q × '+money(res.rateCents/100)+'/q'}</span></div><div><span>Supplemento da tariffario</span><span>${supplementLabel}</span></div><div><span>Supplemento aggiunto manualmente</span><span>${money(res.manualSupplementCents/100)}</span></div><div><span>Maggiorazione ${quickFmt(res.markupPercent)}%</span><span>${money(res.markupCents/100)}</span></div></div>
 <div class="fast-amount"><span>Totale spedizione (IVA esclusa)</span><strong>${money(res.totalCents/100)}</strong></div>`;
 }
 $('quickGrandTotal').textContent=complete===fastShips.length?money(cents/100):complete?money(cents/100)+' · parziale':'—';
 $('quickStatus').textContent=complete===fastShips.length?`${complete} ${complete===1?'spedizione calcolata':'spedizioni calcolate'} · importi IVA esclusa`:`${complete}/${fastShips.length} spedizioni complete · ${errors.length?errors[0]:''}`;
 const btn=$('quickToQuote');if(btn)btn.disabled=complete!==fastShips.length;const runBtn=$('quickSaveRun');if(runBtn)runBtn.disabled=complete!==fastShips.length;
}
function quickToQuote(){
 const results=fastShips.map(s=>quickCompute(s));if(results.some(x=>!x.valid))return toast('Completa prima tutte le spedizioni');
 // Il preventivo usa il medesimo prezzo per zona + supplementi. La maggiorazione
 // percentuale è convertita in ricarico assoluto sul totale per mantenere i valori.
 const commercialMarkup=results.reduce((v,r)=>v+r.markupCents,0)/100;
 newQuote();ships=fastShips.map(s=>({id:uid(),destination:s.destination,city:s.destination,recipientName:'',address:'',recipientId:'',cap:'',region:s.region,zone:s.zone,kg:s.kg,volume:quickSource(s)==='manual'?String(STCCalc.decimal(s.volume)):'',volumeSource:quickSource(s),supp:s.supp,items:quickSource(s)==='manual'?[{id:uid(),type:'Collo',qty:'1',kg:'',l:'',w:'',h:''}]:s.items.map(g=>({id:uid(),type:'Collo',qty:g.qty,kg:'',l:g.l,w:g.w,h:g.h}))}));
 $('markup').value=commercialMarkup.toFixed(2);$('quoteTitle').textContent='Preventivo dai dati della bolla';renderShips();changed();go('quote');toast('Dati trasferiti. Seleziona il cliente e salva il preventivo.');
}

/* Ricerca comune -> provincia -> zona, senza mai sovrascrivere una selezione manuale.
   I nomi incompleti generano un'ipotesi da scegliere; una corrispondenza
   ESATTA univoca propone la zona automaticamente, con conferma visiva. */
function quickGeoChoose(id,name,prov){const ship=fastShips.find(s=>s.id===id);if(!ship)return;
 const match={name,prov};const z=STCGeo.zoneFor(match);ship.destination=name;ship.geoSource=`${name} (${prov})`;
 ship.region=z.region||'';ship.zone=z.zone||'';ship.geoWarning=z.warning||'';
 const input=document.querySelector(`#fast_${id} input[aria-label="Destinazione o località"]`);if(input)input.value=name;
 const select=document.querySelector(`#fast_${id} select`);if(select)select.value=z.region&&z.zone?z.region+'|'+z.zone:'';
 const suggestions=$('geoSugg_'+id);if(suggestions)suggestions.innerHTML='';quickGeoHint(id);quickRecalc();quickSaveDraft();
}
function quickGeoSuggest(id,value){const ship=fastShips.find(s=>s.id===id);const node=$('geoSugg_'+id);if(!ship||!node)return;
 const candidates=STCGeo.find(value);const normalized=STCGeo.normalize(value);const exact=candidates.filter(c=>c.key===normalized);
 if(exact.length===1){quickGeoChoose(id,exact[0].name,exact[0].prov);return}
 node.innerHTML=candidates.map(c=>{const z=STCGeo.zoneFor(c);const label=z.zone?`Zona suggerita: ${z.zone}`:'Zona da confermare';return `<button type="button" data-name="${esc(c.name)}" data-prov="${esc(c.prov)}" onclick="quickGeoChoose('${id}',this.dataset.name,this.dataset.prov)"><strong>${esc(c.name)}</strong> <span>(${esc(c.prov)}) · ${esc(label)}</span></button>`}).join('');
 quickGeoHint(id,candidates.length?'Seleziona la località suggerita per compilare la zona.':(normalized.length>2?'Località non trovata: puoi scegliere la zona manualmente.':''));
}
function quickGeoHint(id,override){const ship=fastShips.find(s=>s.id===id),node=$('geoHint_'+id);if(!ship||!node)return;
 if(override!==undefined){node.textContent=override;node.classList.toggle('geo-warning',override.includes('non trovata'));return}
 const text=ship.geoWarning|| (ship.geoSource?`${ship.geoSource==='Scelta manuale'?'Zona selezionata manualmente':('Località riconosciuta: '+ship.geoSource)} · ${ship.zone?'zona '+ship.zone:'conferma la zona manualmente'}`:(ship.zone?'Zona scelta manualmente: '+ship.zone:'Scrivi il Comune: compariranno zona e provincia quando riconosciute.'));
 node.textContent=text;node.classList.toggle('geo-warning',!!ship.geoWarning);
}
function quickGeoRefreshAll(){if(!Array.isArray(fastShips))return;
 for(const s of fastShips){
  const candidates=STCGeo.find(s.destination);const exact=candidates.filter(c=>c.key===STCGeo.normalize(s.destination));
  if(!s.zone&&exact.length===1&&!s.geoSource){const z=STCGeo.zoneFor(exact[0]);if(z.zone){s.region=z.region;s.zone=z.zone;s.geoSource=`${exact[0].name} (${exact[0].prov})`;const select=document.querySelector(`#fast_${s.id} select`);if(select)select.value=z.region+'|'+z.zone;quickRecalc();}}
  quickGeoHint(s.id);
 }
 STCGeo.status();
}
function quickInitGeo(){STCGeo.status();STCGeo.refresh(false)}
async function quickUpdateGeo(){const ok=await STCGeo.refresh(true);if(ok)toast('Elenco comuni aggiornato e disponibile offline');else toast('Aggiornamento non disponibile: usa la ricerca locale o seleziona la zona manualmente')}
