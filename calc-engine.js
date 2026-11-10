"use strict";
/* STC LOGISTICS · Regole tariffarie approvate. Tariffe in centesimi interi. */
const STCCalc=Object.freeze({
 decimal(value){if(typeof value==='number')return Number.isFinite(value)?Math.max(0,value):0;let t=String(value??'').trim();if(!t)return 0;t=t.replace(',','.');const n=Number(t);return Number.isFinite(n)?Math.max(0,n):0},
 cents(value){return Math.round(this.decimal(value)*100)},
 compute(input, tariffs, options={}){
  const D=v=>this.decimal(v), entries=Array.isArray(input.items)?input.items:[];
  const numeric=v=>v===null||v===undefined||String(v).trim()===''||/^(?:\d+(?:[.,]\d+)?|[.,]\d+)$/.test(String(v).trim());
  const error=message=>({valid:false,reason:message,weightKg:0,volumeM3:0,realQ:0,volQ:0,chargeableQ:0,driver:'Non determinato',missingDimensions:0});
  if(!numeric(input.kg))return error('Peso totale non valido: inserisci kg positivi');
  if(!numeric(input.supp)||!numeric(input.markupPercent))return error('Supplemento o maggiorazione non validi');
  if(options.allowVolumeOverride&&!numeric(input.volume))return error('Volume m³ non valido: usa un numero positivo');
  const activeVolume=options.allowVolumeOverride&&D(input.volume)>0;
  let startedDims=false;
  for(const item of entries){
   const qty=String(item.qty??'').trim();
   if(!numeric(qty)||!Number.isInteger(D(qty))||D(qty)<1)return error('Quantità colli non valida: inserisci un intero positivo');
   if(!numeric(item.kg))return error('Peso per collo non valido');
   if(!activeVolume){
    for(const key of ['l','w','h'])if(!numeric(item[key]))return error('Misura non valida: utilizza centimetri positivi');
    const hasDims=['l','w','h'].some(k=>String(item[k]??'').trim()!=='');
    if(hasDims)startedDims=true;
    if(hasDims && !['l','w','h'].every(k=>D(item[k])>0))return error('Misure incomplete: compila lunghezza, larghezza e altezza');
   }
  }

  const manualWeight=input.kg!==''&&input.kg!==null&&input.kg!==undefined;
  let kgFromItems=0, volumeFromItems=0,missingDimensions=0;
  for(const item of entries){
   const qty=Math.floor(D(item.qty));
   if(qty<1){missingDimensions++;continue}
   kgFromItems+=D(item.kg)*qty;
   const l=D(item.l),w=D(item.w),h=D(item.h);
   if(l>0&&w>0&&h>0)volumeFromItems+=qty*l*w*h/1e6;
   else missingDimensions++;
  }
  if(options.requireCompleteWhenStarted&&startedDims&&missingDimensions>0&&!activeVolume)
   return error('Gruppo di colli incompleto: completa le misure o rimuovi il gruppo');
  const weightKg=manualWeight?D(input.kg):kgFromItems;
  const overrideVolume=options.allowVolumeOverride&&D(input.volume)>0;
  const volumeM3=overrideVolume?D(input.volume):volumeFromItems;
  const realQ=weightKg/100,volQ=volumeM3*2.5;
  const chargeableQ=Math.ceil(Math.max(realQ,volQ)-1e-9);
  const driver=realQ>volQ+1e-9?'Peso reale':volQ>realQ+1e-9?'Peso volumetrico':'Peso reale e volumetrico equivalenti';
  const base={weightKg,volumeM3,realQ,volQ,chargeableQ,driver,missingDimensions,
   tariffSupplementCents:0,manualSupplementCents:this.cents(input.supp),markupPercent:D(input.markupPercent)};
  if((options.requireDimensions||options.requireDestination)&&!String(input.destination??'').trim())return {...base,valid:false,reason:'Indica la destinazione della bolla'};
  if(options.requireVolume&&volumeM3<=0)return {...base,valid:false,reason:'Inserisci il volume totale in m³'};
  if(options.requireDimensions&&missingDimensions>0)return {...base,valid:false,reason:'Completa le misure in centimetri di tutti i gruppi'};
  if(options.requireDimensions&&entries.length<1)return {...base,valid:false,reason:'Aggiungi almeno un gruppo di colli'};
  if(chargeableQ<=0)return {...base,valid:false,reason:'Indica il peso oppure il volume per calcolare'};
  const row=tariffs.find(t=>t.region===input.region&&(t.zone===input.zone||t.aliases?.includes(input.zone)));
  if(!row)return {...base,valid:false,reason:'Seleziona una zona tariffaria valida'};
  if(chargeableQ>50)return {...base,valid:false,reason:'Oltre 50 quintali: quotazione manuale obbligatoria'};
  const idx=chargeableQ<=3?0:chargeableQ<=10?1:chargeableQ<=15?2:chargeableQ<=20?3:chargeableQ<=30?4:chargeableQ<=40?5:6;
  const tariffCents=idx===0?row.cents[0]:row.cents[idx]*chargeableQ;
  // Nel tariffario ricevuto non sono specificati supplementi separati per zona.
  // La zona speciale ha già una propria tariffa base; non la si somma nuovamente.
  const listedSurcharge=Number.isInteger(row.supplementCents)&&row.supplementCents>0?row.supplementCents:0;
  const subtotalCents=tariffCents+listedSurcharge+base.manualSupplementCents;
  const markupCents=Math.round(subtotalCents*base.markupPercent/100);
  const totalCents=subtotalCents+markupCents;
  return {...base,valid:true,tariffRow:row,idx,minApplied:idx===0,
   band:idx===0?'Minimo fino a 3 q':idx===1?'Da oltre 3 a 10 q':idx===2?'Da oltre 10 a 15 q':idx===3?'Da oltre 15 a 20 q':idx===4?'Da oltre 20 a 30 q':idx===5?'Da oltre 30 a 40 q':'Da oltre 40 a 50 q',
   rateCents:row.cents[idx],tariffCents,tariffSupplementCents:listedSurcharge,
   subtotalCents,markupCents,totalCents,cost:(tariffCents+listedSurcharge+base.manualSupplementCents)/100,
   reason:`${chargeableQ} q · ${Number(volumeM3.toFixed(3)).toLocaleString('it-IT',{useGrouping:false,maximumFractionDigits:3})} m³ · ${idx===0?'Tariffa minima':(row.cents[idx]/100).toFixed(2)+' €/q'}`};
 }
});
