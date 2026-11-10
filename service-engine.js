'use strict';
/* STC 1.21 - motore servizi indipendente dal DOM: importi interni in centesimi.
   I prezzi nella specifica sono esempi, NON tariffe operative. */
const STCServices=Object.freeze({
 decimal(value,zero=true){const s=String(value??'').trim().replace(',','.');if(!/^(?:\d+)(?:\.\d{1,4})?$/.test(s))return null;const n=Number(s);return Number.isFinite(n)&&Number.isSafeInteger(Math.round(n*10000))&&n>=(zero?0:1e-8)?n:null},
 cents(value){const n=this.decimal(value);return n===null?null:Math.round(n*100)},
 round(v){return Math.round(v+Number.EPSILON)},
 // Positivo: sconto. Negativo: maggiorazione. Sconti non accumulabili tra servizi.
 discountCents(baseCents,percent){if(!Number.isSafeInteger(baseCents)||baseCents<0)return null;const p=Number(percent);if(!Number.isFinite(p)||p>100||p< -100)return null;return Math.max(0,this.round(baseCents*(1-p/100)))},
 areaM2(groups){let sum=0;for(const g of groups||[]){const qty=this.decimal(g.qty,false),l=this.decimal(g.l,false),w=this.decimal(g.w,false);if(qty===null||!Number.isInteger(qty)||l===null||w===null)return null;sum+=qty*(l/100)*(w/100)}return sum},
 calculate(input){
  const i=input||{},rates=i.rates||{},discounts=i.discounts||{},flags=i.flags||{};
  const issues=[],lines=[];
  if(flags.shipping){const c=i.shippingCents;if(!Number.isSafeInteger(c)||c<0)issues.push('Prezzo spedizione non calcolabile');else{const n=this.discountCents(c,discounts.shipping||0);if(n===null)issues.push('Sconto spedizione non valido');else lines.push({type:'shipping',grossCents:c,netCents:n,discountPercent:Number(discounts.shipping||0)})}}
  if(flags.handling){const load=this.decimal(i.loadQty),unload=this.decimal(i.unloadQty);if(load===null||unload===null||!Number.isInteger(load)||!Number.isInteger(unload))issues.push('Quantità bancali di carico/scarico non valide');else if(load+unload===0)issues.push('Indica bancali caricati o scaricati');else if(!Number.isSafeInteger(rates.loadCents)||!Number.isSafeInteger(rates.unloadCents)||rates.loadCents<0||rates.unloadCents<0)issues.push('Configura le tariffe carico e scarico prima del preventivo');else{const gross=load*rates.loadCents+unload*rates.unloadCents,n=this.discountCents(gross,discounts.handling||0);if(!Number.isSafeInteger(gross)||n===null)issues.push('Prezzo/sconto carico-scarico non valido');else lines.push({type:'handling',loadQty:load,unloadQty:unload,loadRateCents:rates.loadCents,unloadRateCents:rates.unloadCents,grossCents:gross,netCents:n,discountPercent:Number(discounts.handling||0)})}}
  if(flags.storage){let nights=this.decimal(i.nights),pallets=this.decimal(i.palletQty),area=null,gross=null;const mode=i.storageMode==='area'?'area':'pallet';if(nights===null||!Number.isInteger(nights)||nights<1)issues.push('Inserisci il numero di notti intere del deposito');else if(!Number.isSafeInteger(rates.palletNightCents)||rates.palletNightCents<0)issues.push('Configura la tariffa di deposito prima del preventivo');else{
   if(mode==='pallet'){if(pallets===null||!Number.isInteger(pallets)||pallets<1)issues.push('Numero bancali del deposito non valido');else gross=this.round(pallets*nights*rates.palletNightCents)}
   else{area=Array.isArray(i.areaGroups)&&i.areaGroups.length?this.areaM2(i.areaGroups):this.decimal(i.areaDirect);if(area===null||area<=0)issues.push('Superficie deposito non valida');else gross=this.round(area*nights*(rates.palletNightCents/0.96))}
   if(gross!==null){const n=this.discountCents(gross,discounts.storage||0);if(n===null)issues.push('Sconto deposito non valido');else lines.push({type:'storage',storageMode:mode,nights,palletQty:pallets,areaM2:area,rateCents:rates.palletNightCents,rateM2Cents:rates.palletNightCents/0.96,grossCents:gross,netCents:n,discountPercent:Number(discounts.storage||0)})}
  }}
  const automaticCents=lines.reduce((s,l)=>s+l.netCents,0);
  const manual=String(i.manualPrice??'').trim();let finalCents=automaticCents,deltaPercent=null;
  if(manual){const v=this.cents(manual);if(v===null)issues.push('Prezzo finale manuale non valido');else finalCents=v}
  else if(String(i.manualPercent??'').trim()){
   const percent=Number(String(i.manualPercent).replace(',','.'));if(!Number.isFinite(percent)||percent>100||percent< -100)issues.push('Percentuale commerciale fuori intervallo -100…100');else finalCents=this.discountCents(automaticCents,percent);
  }
  if(automaticCents>0)deltaPercent=(automaticCents-finalCents)/automaticCents*100;
  return{valid:issues.length===0,issues,lines,automaticCents,finalCents,deltaPercent};
 },
 examples(){const a=this.calculate({flags:{handling:true},loadQty:'3',unloadQty:'3',rates:{loadCents:500,unloadCents:500},discounts:{handling:10}});const b=this.calculate({flags:{storage:true},nights:'5',palletQty:'3',rates:{palletNightCents:480},storageMode:'pallet'});const c=this.calculate({flags:{storage:true},nights:'5',areaGroups:[{qty:3,l:100,w:80}],rates:{palletNightCents:480},storageMode:'area'});return{handling:a.finalCents,storagePallet:b.finalCents,storageArea:c.finalCents}}
});
