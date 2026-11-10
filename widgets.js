"use strict";
/* Operational widgets: no invented live readings. Remote network feeds are optional,
   cached only in the encrypted local vault; offline displays source and timestamp. */
const STC_DIESEL_API='https://mappacarburanti.it/api/prezzi/national.json';
// Reference value published 24 Oct 2026: MIMIT self-service national average, cited by ANSA.
// This is a dated fallback, NEVER labelled as a live reading.
const STC_DIESEL_REFERENCE={price:2.261,date:'2026-10-24',source:'MIMIT · rilevazione del 24/10/2026 (dato di riferimento)',reference:true};
function widgetDateTime(iso){if(!iso)return 'mai';const d=new Date(iso);return Number.isNaN(d.getTime())?iso:d.toLocaleString('it-IT',{day:'2-digit',month:'2-digit',year:'numeric',hour:'2-digit',minute:'2-digit'})}
function updateDigitalClock(){const n=new Date();const clock=$('digitalClock'),label=$('digitalDate');if(clock)clock.textContent=n.toLocaleTimeString('it-IT',{hour:'2-digit',minute:'2-digit',second:'2-digit'});if(label)label.textContent=n.toLocaleDateString('it-IT',{weekday:'long',day:'numeric',month:'long',year:'numeric'})+' · Ora del dispositivo'}
function weatherLabel(code){if(code===0)return['☀️','Sereno'];if([1,2].includes(code))return['🌤️','Poco nuvoloso'];if(code===3)return['☁️','Nuvoloso'];if([45,48].includes(code))return['🌫️','Nebbia'];if([51,53,55,56,57].includes(code))return['🌦️','Pioviggine'];if([61,63,65,66,67,80,81,82].includes(code))return['🌧️','Pioggia'];if([71,73,75,77,85,86].includes(code))return['🌨️','Neve'];if([95,96,99].includes(code))return['⛈️','Temporali'];return['🌥️','Condizioni variabili']}
async function fetchJSON(url){const abort=new AbortController(),timer=setTimeout(()=>abort.abort(),10000);try{const r=await fetch(url,{signal:abort.signal,cache:'no-store'});if(!r.ok)throw Error('HTTP '+r.status);return await r.json()}finally{clearTimeout(timer)}}
function paintWeather(message){const w=state.widgets?.weather;if(!w){$('weatherTemp').textContent='—';$('weatherDetail').textContent=message||'Inserisci una città e aggiorna';$('weatherStamp').textContent='Nessun dato meteo ricevuto';return}const [emoji,desc]=weatherLabel(w.code);$('weatherEmoji').textContent=emoji;$('weatherTemp').textContent=Number.isFinite(w.temp)?Math.round(w.temp)+'° C':'—';$('weatherDetail').textContent=`${w.city} · ${desc} · vento ${Math.round(w.wind||0)} km/h`;$('weatherStamp').textContent=`${message||'Ultima rilevazione'}: ${widgetDateTime(w.fetchedAt)} · Open-Meteo`}
function paintFuel(message){const manual=state.widgets?.fuelManual,auto=state.widgets?.fuelAuto;
 const v=manual||auto||STC_DIESEL_REFERENCE;if(!v){$('fuelPrice').textContent='— €/l';$('fuelStamp').textContent=message||'Dato non disponibile; usa il prezzo manuale o apri la fonte MIMIT';return}
 const price=Number(v.price);$('fuelPrice').textContent=Number.isFinite(price)?price.toLocaleString('it-IT',{minimumFractionDigits:3,maximumFractionDigits:3})+' €/l':'— €/l';
 const when=v.date?new Date(v.date+'T12:00:00').getTime():0,days=when?Math.floor((Date.now()-when)/86400000):null,stale=days===null||days>7;
 $('fuelStamp').textContent=`${v.manual?'Inserito dall’amministratore':v.source||'API open data, elaborazione dati MIMIT'} · rilevazione ${v.date||'non dichiarata'}${stale?' · DATO NON RECENTE':''}${message?' · '+message:''}`
}
async function refreshWeather(force=false){if(!vaultEnabled||!activeUser)return;const city=$('weatherCity').value.trim();if(city.length<2){paintWeather('Indica una città');return}
 if(!navigator.onLine){paintWeather('Offline · ultimo dato disponibile');return}
 const w=state.widgets?.weather;if(!force&&w?.city?.toLocaleLowerCase('it')===city.toLocaleLowerCase('it')&&Date.now()-new Date(w.fetchedAt).getTime()<40*60000){paintWeather();return}
 $('weatherDetail').textContent='Aggiornamento meteo…';try{
  const geo=await fetchJSON('https://geocoding-api.open-meteo.com/v1/search?'+new URLSearchParams({name:city,count:'1',language:'it',countryCode:'IT'}));const place=geo.results?.[0];if(!place)throw Error('Città non trovata in Italia');
  const forecast=await fetchJSON('https://api.open-meteo.com/v1/forecast?'+new URLSearchParams({latitude:String(place.latitude),longitude:String(place.longitude),current:'temperature_2m,weather_code,wind_speed_10m',timezone:'auto',forecast_days:'1'}));const curr=forecast.current;if(!curr||!Number.isFinite(curr.temperature_2m))throw Error('Previsioni non disponibili');
  state.widgets=state.widgets||{};state.widgets.city=city;state.widgets.weather={city:place.name,temp:curr.temperature_2m,wind:curr.wind_speed_10m,code:curr.weather_code,fetchedAt:new Date().toISOString()};
  await persist();paintWeather('Online');
 }catch(e){paintWeather('Aggiornamento non riuscito · ultimo dato salvato');if(force)toast('Meteo non disponibile: '+e.message)}
}
async function refreshFuel(force=false){if(!vaultEnabled||!activeUser)return;
 if(!navigator.onLine){paintFuel('Offline · ultimo prezzo disponibile');return}
 const auto=state.widgets?.fuelAuto;if(!force&&auto&&Date.now()-new Date(auto.fetchedAt).getTime()<90*60000){paintFuel();return}
 try{
  const data=await fetchJSON(STC_DIESEL_API);const price=Number(data.fuels?.gasolio?.avg);const d=String(data.date||'');if(!Number.isFinite(price)||price<0.5||price>5||!/^\d{4}-\d{2}-\d{2}$/.test(d))throw Error('Dati non validi');
  state.widgets=state.widgets||{};const previous=state.widgets.fuelAuto||STC_DIESEL_REFERENCE;
  if(d<previous.date){paintFuel('La fonte online riporta una data precedente; conservato il dato più recente');return}
  state.widgets.fuelAuto={price,date:d,fetchedAt:new Date().toISOString(),source:'Mappa Carburanti Italia (dati MIMIT, CC0)'};
  await persist();paintFuel('Aggiornato online');
 }catch(e){paintFuel('Fonte online momentaneamente non disponibile');if(force)toast('Gasolio non aggiornato: '+e.message)}
}
async function setFuelManual(){if(!isAdmin())return toast('Solo amministratore');const v=prompt('Prezzo del gasolio €/l (es. 1,745). Lascia vuoto per tornare al dato automatico:',state.widgets?.fuelManual?.price||'');if(v===null)return;state.widgets=state.widgets||{};
 if(!v.trim()){delete state.widgets.fuelManual;await persist();paintFuel();return}
 const price=Number(v.replace(',','.'));if(!Number.isFinite(price)||price<0.5||price>5)return toast('Prezzo fuori intervallo');
 const dateVal=prompt('Data della rilevazione (AAAA-MM-GG):',new Date().toLocaleDateString('sv-SE'));if(dateVal===null)return;if(!/^\d{4}-\d{2}-\d{2}$/.test(dateVal)||!Number.isFinite(new Date(dateVal).getTime()))return toast('Data non valida');
 state.widgets.fuelManual={price,date:dateVal,manual:true,fetchedAt:new Date().toISOString()};await persist();paintFuel('Valore manuale')
}
function startDashboardWidgets(){
 clearInterval(window.__stcWidgetsClock);clearInterval(window.__stcWidgetsRefresh);
 updateDigitalClock();window.__stcWidgetsClock=setInterval(updateDigitalClock,1000);
 $('weatherCity').value=state.widgets?.city||'Cerea';paintWeather(navigator.onLine?'Ultimo dato disponibile':'Offline · ultimo dato');paintFuel(navigator.onLine?'Ultimo dato disponibile':'Offline · ultimo prezzo');
 // network requests are initiated only when logged in, and throttled client-side
 refreshWeather(false);refreshFuel(false);
 window.__stcWidgetsRefresh=setInterval(()=>{if(navigator.onLine&&vaultEnabled){refreshWeather(false);refreshFuel(false)}},60*60000);
}
