"use strict";
/* STC 1.4 — SUGGERIMENTI DI LOCALITÀ, NON UN AUTOCALCOLO DI CAP.
   Anagrafica remota opzionale: https://github.com/RP92/comuni-italiani
   Nomi/province da ISTAT (ridistribuzione CC BY 4.0), CAP best effort non usati.
   La tariffa STC viene risolta tramite la PROVINCIA e il tariffario locale;
   eccezioni logistiche (isole/valli) richiedono verifica esplicita. */
const STCGeo=(()=>{
 const STORAGE='stc_geo_comuni_v1';
 // Fallback piccolo, disponibile sempre offline anche prima del primo download elenco completo.
 // La copertura completa viene salvata su questo dispositivo al primo accesso online riuscito.
 const seedRows=[
 ['Fiorano Modenese','MO'],['Modena','MO'],['Sassuolo','MO'],['Maranello','MO'],['Formigine','MO'],['Carpi','MO'],['Mirandola','MO'],['Vignola','MO'],['Castelfranco Emilia','MO'],['Nonantola','MO'],['Finale Emilia','MO'],['Spilamberto','MO'],['Pavullo nel Frignano','MO'],['Soliera','MO'],['Fiorano al Serio','BG'],
 ['Bologna','BO'],['Imola','BO'],['San Lazzaro di Savena','BO'],['Casalecchio di Reno','BO'],['Ferrara','FE'],['Cento','FE'],['Reggio nell Emilia','RE'],['Reggio Emilia','RE'],['Parma','PR'],['Piacenza','PC'],['Ravenna','RA'],['Rimini','RN'],['Forlì','FC'],['Cesena','FC'],
 ['Milano','MI'],['Brescia','BS'],['Bergamo','BG'],['Mantova','MN'],['Cremona','CR'],['Pavia','PV'],['Lodi','LO'],['Sondrio','SO'],['Varese','VA'],['Como','CO'],['Lecco','LC'],['Monza','MB'],
 ['Cerea','VR'],['Verona','VR'],['Padova','PD'],['Vicenza','VI'],['Rovigo','RO'],['Venezia','VE'],['Mestre','VE'],['Chioggia','VE'],['Treviso','TV'],['Belluno','BL'],
 ['Torino','TO'],['Asti','AT'],['Alessandria','AL'],['Novara','NO'],['Vercelli','VC'],['Biella','BI'],['Cuneo','CN'],['Aosta','AO'],['Verbania','VB'],
 ['Genova','GE'],['La Spezia','SP'],['Savona','SV'],['Imperia','IM'],['Ventimiglia','IM'],
 ['Firenze','FI'],['Prato','PO'],['Pistoia','PT'],['Lucca','LU'],['Pisa','PI'],['Arezzo','AR'],['Massa','MS'],['Siena','SI'],['Livorno','LI'],['Grosseto','GR'],
 ['Trento','TN'],['Rovereto','TN'],['Bolzano','BZ'],['Merano','BZ'],['Udine','UD'],['Tarvisio','UD'],['Pordenone','PN'],['Gorizia','GO'],['Trieste','TS'],
 ['Roma','RM'],['Rieti','RI'],['Viterbo','VT'],['Frosinone','FR'],['Latina','LT'],['Perugia','PG'],['Terni','TR'],
 ['Ancona','AN'],['Ascoli Piceno','AP'],['Macerata','MC'],['Pesaro','PU'],['Urbino','PU'],['Fermo','FM'],
 ['Napoli','NA'],['Caserta','CE'],['Avellino','AV'],['Benevento','BN'],['Salerno','SA'],
 ['Bari','BA'],['Foggia','FG'],['Lecce','LE'],['Taranto','TA'],['Brindisi','BR'],['Potenza','PZ'],['Matera','MT'],
 ['Palermo','PA'],['Catania','CT'],['Messina','ME'],['Siracusa','SR'],['Ragusa','RG'],['Trapani','TP'],['Enna','EN'],['Caltanissetta','CL'],['Agrigento','AG'],
 ['Reggio Calabria','RC'],['Catanzaro','CZ'],['Cosenza','CS'],['Crotone','KR'],['Vibo Valentia','VV'],
 ['Cagliari','CA'],['Oristano','OR'],['Nuoro','NU'],['Sassari','SS'],['Olbia','SS']
 ];
 const normalize=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').replace(/\s+/g,' ').trim();
 function record(n,p){return {name:n,prov:String(p||'').toUpperCase(),key:normalize(n)};}
 let all=seedRows.map(([n,p])=>record(n,p));
 let full=false;
 let lastError='';
 function loadCache(){try{const d=JSON.parse(localStorage.getItem(STORAGE)||'null');if(d?.version===1&&Array.isArray(d.items)&&d.items.length>7000){all=d.items.map(([n,p])=>record(n,p)).filter(c=>c.key&&c.prov);full=true}}catch(e){/* cache unavailable */}}
 loadCache();
 const source='https://cdn.jsdelivr.net/gh/RP92/comuni-italiani@main/data/comuni.json';
 async function refresh(force=false){if(!navigator.onLine){lastError='Connettiti per aggiornare l’elenco completo';status();return false}if(full&&!force){status();return true}const ctl=new AbortController(),timer=setTimeout(()=>ctl.abort(),15000);
  try{status('Aggiornamento elenco località…');const res=await fetch(source,{mode:'cors',signal:ctl.signal,cache:'no-store'});if(!res.ok)throw Error('Risposta '+res.status);
   const data=await res.json();if(!Array.isArray(data)||data.length<7000)throw Error('Elenco incompleto');
   const rows=data.map(o=>[String(o?.nome||''),String(o?.provincia?.sigla||o?.sigla||'')]).filter(([n,p])=>n&&p).map(([n,p])=>[n,p.toUpperCase()]);
   if(rows.length<7000)throw Error('Province non valide');
   const compact=JSON.stringify({version:1,downloaded:new Date().toISOString(),items:rows});
   try{localStorage.setItem(STORAGE,compact)}catch(e){lastError='Archivio completo disponibile solo finché la pagina resta aperta'}
   all=rows.map(([n,p])=>record(n,p));full=true;status(); if(typeof quickGeoRefreshAll==='function')quickGeoRefreshAll();if(typeof quoteGeoRefreshMissing==='function')quoteGeoRefreshMissing();return true;
  }catch(e){lastError='Elenco completo non raggiungibile';status();return false}finally{clearTimeout(timer)}
 }
 function status(message){const el=document.getElementById('geoArchiveStatus');if(!el)return;el.textContent=message|| (full?'Elenco comuni completo pronto anche offline':'Ricerca locale essenziale pronta · elenco completo in aggiornamento online');}
 function zoneFor(city){
  if(!city||!city.prov)return {zone:'',region:'',warning:'Provincia non identificata'};
  const name=normalize(city.name),prov=city.prov;
  // Queste zone NON possono essere inferite solo dalla sigla di provincia.
  if(prov==='VE')return {zone:'',region:'',warning:'Provincia VE: conferma la tariffa ordinaria o VE+ISOLE in base alla destinazione effettiva'};
  if(prov==='TN')return name==='trento'?{region:'TRENTINO ALTO ADIGE',zone:'TRENTO'}:{zone:'',region:'',warning:'Provincia TN: scegli TRENTO oppure VALLI TN secondo la località e il listino'};
  if(prov==='BZ')return name==='bolzano'?{region:'TRENTINO ALTO ADIGE',zone:'BOLZANO'}:{zone:'',region:'',warning:'Provincia BZ: scegli BOLZANO oppure VALLI BZ secondo la località e il listino'};
  if(prov==='IM'&&name==='ventimiglia')return {region:'LIGURIA',zone:'VENTIMIGLIA'};
  if(prov==='UD'&&name==='tarvisio')return {region:'FRIULI VENEZIA GIULIA',zone:'TS-TARVISIO'};
  if(prov==='SO')return {region:'LOMBARDIA',zone:'SONDRIO'};
  if(prov==='MB'){const mb=TARIFFS.find(t=>t.region==='LOMBARDIA'&&(t.zone==='MI-BG'||t.zone==='MI-BG-MB'||t.aliases?.includes('MI-BG')));if(mb)return {region:mb.region,zone:mb.zone}};
  const matches=TARIFFS.filter(t=>t.zone.split('-').includes(prov));
  if(matches.length===1)return {region:matches[0].region,zone:matches[0].zone};
  return {region:'',zone:'',warning:'Provincia '+prov+' non univoca nel tariffario: seleziona manualmente la zona'};
 }
 function find(q){const key=normalize(q);if(key.length<2)return[];
  const exact=all.filter(x=>x.key===key);
  const starts=all.filter(x=>!exact.includes(x)&&x.key.startsWith(key));
  const contains=all.filter(x=>!exact.includes(x)&&!starts.includes(x)&&x.key.includes(key));
  const result=[...exact,...starts,...contains].slice(0,7);
  // Accetta suffissi di provincia tra parentesi: "Fiorano Modenese (MO)".
  if(result.length===0){const stripped=normalize(key.replace(/\b[a-z]{2}$/, ''));if(stripped&&stripped!==key)return find(stripped)}
  return result;
 }
 return {normalize,find,zoneFor,refresh,status,get full(){return full},get lastError(){return lastError}};
})();
