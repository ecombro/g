const $=id=>document.getElementById(id);
const state={all:[],tap:[],rules:[],map:null,markers:null,tramLayer:null,busLayer:null,routeLayer:null,selected:null,area:"Alles",mode:"objecten",quizIndex:0,score:0,tramVisible:true,busVisible:true,tramLoading:false,busLoading:false,railReferenceLayer:null};
const OFFICIAL={
 base:"https://zoek.officielebekendmakingen.nl/gmb-2018-38595.html",
 wetering:"https://zoek.officielebekendmakingen.nl/gmb-2021-291618.html",
 exam:"https://wetten.overheid.nl/BWBR0051913/2026-01-01/0/BijlageV"
};
const QUESTIONS=[
{q:"Mag je met de Amsterdamse lijnbusbaanontheffing iedere trambaan gebruiken?",answers:["Ja, zodra er rails liggen","Nee, alleen onder de voorwaarden van de ontheffing en ter plaatse geldende borden","Alleen 's nachts"],correct:1,why:"Tramrails op zichzelf geven geen toestemming. Controleer LIJNBUS/F-borden, uitzonderingen en de rijrichting.",src:"base"},
{q:"Je rijdt over een vrijliggende OV-baan. Welk verkeerslicht is leidend?",answers:["Het negenoog voor het OV","Altijd het gewone autoverkeerslicht","Welk licht je het eerst ziet"],correct:0,why:"Bij gebruik van de verharde vrijliggende baan volg je het OV-verkeerslicht (negenoog).",src:"base"},
{q:"Hoe snel mag je volgens de ontheffingsvoorwaarden maximaal langs een OV-halte rijden?",answers:["20 km/u","30 km/u","50 km/u"],correct:0,why:"Voorschrift: bij het passeren van halteplaatsen maximaal 20 km/u.",src:"base"},
{q:"Mag je op de OV-baan even stilstaan om een klant uit te laten stappen?",answers:["Ja, als het kort is","Nee, ook niet bij de halte","Alleen bij groen licht"],correct:1,why:"Stilstaan op de OV-baan of halte is verboden, ook voor in- en uitstappen.",src:"base"},
{q:"Mag je halverwege een vrijliggende bus-/trambaan de baan oprijden?",answers:["Ja, bij weinig verkeer","Nee, niet tussentijds op- of afrijden","Ja, als de tram achter je zit"],correct:1,why:"De ontheffingsvoorwaarden verbieden tussentijds op- en afrijden.",src:"base"},
{q:"Mag je op de bus-/trambaan een langzaam voertuig inhalen?",answers:["Ja, zolang het veilig is","Nee","Alleen een lijnbus"],correct:1,why:"Op de vrijliggende lijnbusbaan mag je geen voertuigen inhalen of voorbijgaan.",src:"base"},
{q:"Geldt de oude nachtuitsluiting op de Weteringschans nog als volledige regel?",answers:["Ja, 21:00–07:00 is de actuele algemene regel","Nee, een verkeersbesluit uit 2021 heeft dat veranderd"],correct:1,why:"De Amsterdamse taxiontheffing is voor het betrokken traject niet van toepassing (behalve AOV) volgens het besluit uit 2021.",src:"wetering"},
{q:"Mag je de OV-baan op het Damrak nemen met alleen een algemene lijnbusbaanontheffing?",answers:["Ja","Nee, Damrak staat op de lijst van uitsluitingen"],correct:1,why:"De regeling van 2018 sluit het Damrak in beide richtingen uit.",src:"base"},
{q:"Mag je de OV-baan op het Rokin nemen?",answers:["Ja","Nee, Rokin staat op de uitsluitingslijst"],correct:1,why:"Volgens de 2018-regeling mag de taxi de betreffende OV-baan op het Rokin niet medegebruiken.",src:"base"},
{q:"Mag je bij het Centraal Station het busstation IJzijde oprijden met de algemene ontheffing?",answers:["Nee","Ja, als je een klant hebt"],correct:0,why:"Het IJzijde-busstation en de bijbehorende op- en afritten zijn uitgesloten.",src:"base"},
{q:"Wat geldt tijdens een TAP-opleiding of TAP-examen volgens de Amsterdamse regeling?",answers:["Je mag zonder ontheffing overal rijden","Je gebruikt de ontheffing van instructeur of examinator","Je hebt nooit een begeleider nodig"],correct:1,why:"De regeling voorziet in gebruik van de ontheffing van de instructeur/examinator.",src:"base"},
{q:"Stel: je ziet tramrails, maar je weet niet of de rijbaan is aangewezen voor lijnbusbaanmedegebruik. Wat doe je?",answers:["Gewoon nemen, het is een trambaan","De baan niet nemen totdat je de borden en voorschriften hebt gecontroleerd"],correct:1,why:"De veilige regel voor het examen is niet aan te nemen dat tramrails gelijkstaan aan toestemming.",src:"base"}
];
function e(name,cls,text){let n=document.createElement(name);if(cls)n.className=cls;if(text!==undefined)n.textContent=text;return n;}
function geoLink(t){return "https://www.google.com/maps/search/?api=1&query="+encodeURIComponent(t.properties.address||t.properties.name+", Amsterdam");}
function showStatus(s){$("status").textContent=s;}
function tabs(name){state.mode=name;state.selected=null;if($("area"))$("area").value="Alles";if($("search"))$("search").value="";for(let t of document.querySelectorAll("[data-tab]"))t.classList.toggle("active",t.dataset.tab===name);for(let p of document.querySelectorAll("[data-panel]"))p.hidden=p.dataset.panel!==name; if(state.map)setTimeout(()=>state.map.invalidateSize(),80);}
function makeMap(){
 if(!window.L){$("mapError").hidden=false;return;}
 state.map=L.map("map",{zoomControl:true}).setView([52.367,4.872],11);
 const osm=L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{maxZoom:19,attribution:"© OpenStreetMap"});
 const carto=L.tileLayer("https://basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",{subdomains:"abcd",maxZoom:19,attribution:"© CARTO © OpenStreetMap"});
 osm.addTo(state.map);let errors=0;osm.on("tileerror",()=>{if(++errors===6){state.map.removeLayer(osm);carto.addTo(state.map);showStatus("Alternatieve straatkaart geladen") }});

 // OpenRailwayMap is a rail-infrastructure overlay (TRAM + METRO + TRAIN).
 // It is a fallback reference, never proof of taxi access.
 state.railReferenceLayer=L.tileLayer("https://tiles.openrailwaymap.org/standard/{z}/{x}/{y}.png",{
   maxZoom:19,opacity:.75,attribution:"OpenRailwayMap © OpenStreetMap contributors"
 }).addTo(state.map);
 state.markers=L.featureGroup().addTo(state.map);
}
function markers(){
 if(!state.map)return;
 state.markers.clearLayers();let selected=filterLocations();
 for(let o of selected){
  const coords=o.geometry.coordinates;
  const isTap=o.properties.category==="TAP-object";
  const shortName=(o.properties.name||"").replace(/^TAP \d+\.\s*/,"").replace(/[&<>"]/g,"");
  const badge=isTap?o.properties.name.split(".")[0].replace("TAP ",""):"!";
  const icon=L.divIcon({className:"tap-pin-container",html:'<span class="tap-dot '+(isTap?"blue":"red")+'">'+badge+'</span>'+(isTap?'<span class="pin-caption">'+shortName+'</span>':""),iconSize:[190,30],iconAnchor:[15,15]});
  const m=L.marker([coords[1],coords[0]],{icon,title:o.properties.name}).addTo(state.markers);
  m.on("click",()=>inspect(o));
 }
 if(selected.length && !state.selected){const bounds=state.markers.getBounds();if(bounds.isValid())state.map.fitBounds(bounds.pad(.12),{maxZoom:13});}
}
function filterLocations(){
 const area=$("area").value,q=$("search").value.toLowerCase().trim();
 return (state.mode==="waarschuwingen"?state.rules:state.tap).filter(o=>{
   const p=o.properties,blob=[p.name,p.address,p.scope].join(" ").toLowerCase();
   return (!q||blob.includes(q))&&(area==="Alles"||(p.area||"").toLowerCase()===area.toLowerCase());
 });
}
function list(){
 const items=filterLocations();$("resultCount").textContent=items.length+" resultaten";const target=state.mode==="waarschuwingen"?$("warningHelp"):$("entries");target.replaceChildren();
 for(let o of items){
  const p=o.properties,wrap=e("button","entry"),title=e("strong","",p.name),subtitle=e("small","",p.address||p.scope||"");
  wrap.append(title,subtitle);wrap.onclick=()=>inspect(o);target.append(wrap);
 }
 if(!items.length)target.append(e("div","quiet","Geen resultaten. Kies een ander gebied of zoekwoord."));
 markers();
}
function inspect(o){
 state.selected=o;const p=o.properties,pos=o.geometry.coordinates;
 $("details").hidden=false;$("detailTitle").textContent=p.name;
 $("detailDesc").textContent=p.address||p.scope||"";
 $("detailWarning").textContent=p.category==="TAP-object"?"Indicatieve positie. Exacte entree en rijrichting niet geverifieerd.":"Waarschuwingspunt, geen exact ingetekend verboden wegvak. Controleer de officiële bron en bebording.";
 $("mapsLink").href=geoLink(o);
 $("sourceLink").hidden=p.category==="TAP-object";$("sourceLink").href=(p.source||"").includes("2021")?OFFICIAL.wetering:OFFICIAL.base;
 if(state.map){state.map.flyTo([pos[1],pos[0]],14,{duration:.4});}
 if(p.category==="TAP-object"){$("fromHere").hidden=false;$("toHere").hidden=false;$("fromHere").onclick=()=>{setSelect("from",p.name);tabs("routes")};$("toHere").onclick=()=>{setSelect("to",p.name);tabs("routes")};}else{$("fromHere").hidden=true;$("toHere").hidden=true;}
}
function setSelect(id,name){let el=$(id);let opt=Array.from(el.options).find(o=>o.text===name);if(opt)el.value=opt.value;}
function initRoutes(){for(let [i,o] of state.tap.entries()){for(let id of ["from","to"]){const opt=new Option(o.properties.name,String(i));$(id).add(opt)}}$("from").value="6";$("to").value="32";}
function routeUrl(a,b){return"https://www.google.com/maps/dir/?api=1&origin="+encodeURIComponent(a.properties.address)+"&destination="+encodeURIComponent(b.properties.address)+"&travelmode=driving";}
function selectRouteEnds(){const a=state.tap[+$("from").value],b=state.tap[+$("to").value];$("externalRoute").href=routeUrl(a,b);return[a,b];}
async function plotRoute(){
 if(!state.map){showStatus("Straatkaart niet beschikbaar. Gebruik Google Maps.");return;}
 const [a,b]=selectRouteEnds();if(a===b){$("routeResult").textContent="Kies twee verschillende objecten.";return;}
 const aa=a.geometry.coordinates,bb=b.geometry.coordinates,url="https://router.project-osrm.org/route/v1/driving/"+aa.join(",")+";"+bb.join(",")+"?overview=full&geometries=geojson";
 $("routeResult").textContent="Autoroute berekenen…";
 if(state.routeLayer){state.map.removeLayer(state.routeLayer);state.routeLayer=null;}
 try{const resp=await fetch(url);if(!resp.ok)throw Error("geen route");const data=await resp.json();if(!data.routes?.length)throw Error("geen route");
 const route=data.routes[0];state.routeLayer=L.geoJSON(route.geometry,{style:{color:"#175fc6",weight:6}}).addTo(state.map);
 state.map.fitBounds(state.routeLayer.getBounds(),{padding:[30,30]});
 $("routeResult").textContent=(route.distance/1000).toFixed(1).replace(".",",")+" km · circa "+Math.round(route.duration/60)+" min. Dit is een gewone autoroute, NIET getoetst aan taxiontheffingen.";
 }catch(err){$("routeResult").textContent="Deze routedienst is nu niet beschikbaar. Open de route in Google Maps; die route is ook NIET gevalideerd voor taxibanen.";}}
function question(){
 const q=QUESTIONS[state.quizIndex%QUESTIONS.length];$("progress").textContent=(state.quizIndex+1)+" / "+QUESTIONS.length+" · "+state.score+" goed";$("question").textContent=q.q;
 $("answers").replaceChildren();$("feedback").textContent="";
 q.answers.forEach((answer,i)=>{const b=e("button","answer",answer);b.onclick=()=>{for(let x of $("answers").children)x.disabled=true;if(i===q.correct){b.classList.add("correct");state.score++;}else b.classList.add("wrong");
 $("feedback").textContent=(i===q.correct?"Goed! ":"Niet juist. ")+q.why;$("quizSource").href=OFFICIAL[q.src];$("quizSource").hidden=false;$("nextQuestion").disabled=false;$("progress").textContent=(state.quizIndex+1)+" / "+QUESTIONS.length+" · "+state.score+" goed";};$("answers").append(b)});
 $("quizSource").hidden=true;$("nextQuestion").disabled=true;
}

function statusForLayer(kind,text){
  const el=$(kind==="tram"?"tramStatus":"busStatus");
  if(el)el.textContent=text;
}
function updateLayerControls(){
  const tr=$("trams"),bus=$("buses");
  tr.textContent="Tramsporen: "+(state.tramVisible?"aan":"uit");
  bus.textContent="Busbanen: "+(state.busVisible?"aan":"uit");
  tr.setAttribute("aria-pressed",String(state.tramVisible));
  bus.setAttribute("aria-pressed",String(state.busVisible));
}
function addInfraLayer(geo,kind,source){
  if(!state.map || !geo?.features || !geo.features.length)throw Error("geen lijngeometrie aanwezig");
  const isTram=kind==="tram";
  const layer=L.geoJSON(geo,{
    style:()=>({color:isTram?"#8b5cf6":"#ed982d",weight:isTram?4:5,opacity:.90}),
    onEachFeature:(feature,segment)=>{
      const p=feature.properties||{};
      const title=isTram?"Tramspoor":"Mogelijke busbaan (OSM)";
      const note=isTram?"Tramspoor ≠ automatisch toegankelijk voor taxi.":"OSM-busbaanlabel ≠ bewijs dat taxi's hier mogen rijden.";
      const box=document.createElement("div"),head=document.createElement("strong"),text=document.createElement("p"),meta=document.createElement("small");
      head.textContent=title+(p.name?" · "+p.name:"");
      text.textContent=note;
      meta.textContent="Status: niet juridisch geverifieerd. Bron: "+source+".";
      box.append(head,text,meta);
      segment.bindPopup(box);
    }
  });
  const prev=isTram?state.tramLayer:state.busLayer;
  if(prev && state.map.hasLayer(prev))state.map.removeLayer(prev);
  if(isTram&&state.railReferenceLayer&&state.map.hasLayer(state.railReferenceLayer))state.map.removeLayer(state.railReferenceLayer);
  if(isTram)state.tramLayer=layer;
  else state.busLayer=layer;
  if(isTram?state.tramVisible:state.busVisible)layer.addTo(state.map);
  statusForLayer(kind,geo.features.length+" OSM-segmenten geladen");
  updateLayerControls();
}
function overpassQuery(kind){
 const bbox="(52.275,4.72,52.46,5.07)";
 return kind==="tram"?
 '[out:json][timeout:45];way["railway"="tram"]'+bbox+';out geom;':
 '[out:json][timeout:45];(way["highway"="busway"]'+bbox+';way["busway"]'+bbox+';way["lanes:bus"]'+bbox+';way["lanes:psv"]'+bbox+';way["bus:lanes"]'+bbox+';way["psv:lanes"]'+bbox+';);out geom;';
}
async function dynamicBackup(kind){
 const servers=["https://overpass-api.de/api/interpreter","https://overpass.private.coffee/api/interpreter"];
 let error=null;
 for(const base of servers){
  try{
   const controller=new AbortController(),tid=setTimeout(()=>controller.abort(),15000);
   let response;
   try{response=await fetch(base+"?data="+encodeURIComponent(overpassQuery(kind)),{signal:controller.signal});}
   finally{clearTimeout(tid);}
   if(!response.ok)throw Error("HTTP "+response.status);
   const raw=await response.json();
   const ways=raw.elements||[];
   const features=ways.filter(o=>o.geometry?.length>1).map(o=>({
     type:"Feature",
     properties:{name:o.tags?.name||"",source:"OpenStreetMap Overpass (live)",osm_id:o.id},
     geometry:{type:"LineString",coordinates:o.geometry.map(p=>[p.lon,p.lat])}
   }));
   if(features.length<15)throw Error("Te weinig segmenten: "+features.length);
   return {type:"FeatureCollection",features};
  }catch(e){error=e;}
 }
 throw error||Error("Gegevensbron niet beschikbaar");
}
async function loadInfra(kind){
 const file=kind==="tram"?"tramsporen.geojson":"busbanen-osm.geojson";
 statusForLayer(kind,"Bezig met laden…");
 try{
   let geo,source="opgeslagen OSM";
   try{
     const res=await fetch("./"+file,{cache:"no-store"});
     if(!res.ok)throw Error("statisch bestand niet gevonden");
     geo=await res.json();
     if(!geo.features?.length)throw Error("leeg bestand");
   }catch(err){
     statusForLayer(kind,"Live OSM proberen…");
     geo=await dynamicBackup(kind);
     source="Overpass live";
   }
   addInfraLayer(geo,kind,source);
 }catch(err){
   statusForLayer(kind,kind==="tram"?"Spoornet zichtbaar (tram/trein/metro), tramdetail nog niet geladen":"Geen busbaangegevens geladen — bron niet bereikbaar");
   showStatus((kind==="tram"?"Tramsporen":"Busbanen")+" niet beschikbaar. De kaartpunten blijven zichtbaar.");
 }
}
function toggleInfra(kind){
 const tram=kind==="tram",layer=tram?state.tramLayer:state.busLayer;
 if(tram)state.tramVisible=!state.tramVisible;else state.busVisible=!state.busVisible;
 const visible=tram?state.tramVisible:state.busVisible;
 if(tram && !layer && state.railReferenceLayer && state.map){if(visible)state.railReferenceLayer.addTo(state.map);else state.map.removeLayer(state.railReferenceLayer);}
 if(layer && state.map){
   if(visible)layer.addTo(state.map);else state.map.removeLayer(layer);
 }else if(visible){
   loadInfra(kind);
 }
 updateLayerControls();
}

async function init(){
 document.querySelectorAll("[data-tab]").forEach(b=>b.addEventListener("click",()=>{tabs(b.dataset.tab);list()}));
 $("search").addEventListener("input",list);$("area").addEventListener("change",list);
 $("routeButton").onclick=plotRoute;$("from").onchange=selectRouteEnds;$("to").onchange=selectRouteEnds;
 $("swap").onclick=()=>{const a=$("from").value;$("from").value=$("to").value;$("to").value=a;selectRouteEnds();};
 $("nextQuestion").onclick=()=>{state.quizIndex=(state.quizIndex+1)%QUESTIONS.length;if(state.quizIndex===0)state.score=0;question()};
 $("trams").onclick=()=>toggleInfra("tram");
 $("buses").onclick=()=>toggleInfra("bus");
 updateLayerControls();
 makeMap();
 try{
 const resp=await fetch("./kaart.geojson",{cache:"no-store"});if(!resp.ok)throw Error("HTTP "+resp.status);
 const geo=await resp.json();state.all=geo.features||[];state.tap=state.all.filter(o=>o.properties.category==="TAP-object");state.rules=state.all.filter(o=>o.properties.category!=="TAP-object");
 const zones={Centrum:[1,2,3,5,11,14,26,27,33],Zuid:[4,10,12,15,22,25,28,29,38],Oost:[7,20,23,37],Noord:[21,32,36],West:[6,8,9,13,16,17,18,19,24,30,31,34,35,39,40]};
 for(const o of state.tap){const id=Number(o.properties.name.match(/TAP (\d+)/)?.[1]);o.properties.area=Object.keys(zones).find(z=>zones[z].includes(id))||"West";}
 for(const z of Object.keys(zones))$("area").add(new Option(z,z));
 if(state.tap.length!==40||state.rules.length!==41)throw Error("Onverwachte omvang kaartdata");
 // Oude waarschuwingscoördinaten zijn indicatief en niet juridisch nauwkeurig.
 $("dataCount").textContent=state.tap.length+" TAP-objecten · "+state.rules.length+" waarschuwingen";
 initRoutes();selectRouteEnds();list();question();showStatus("40 objecten en waarschuwingspunten geladen.");
 if(state.map){loadInfra("tram");loadInfra("bus");}
 }catch(err){$("entries").replaceChildren(e("div","error","Kaartgegevens kunnen niet geladen worden: "+err.message));showStatus("Kaartgegevens ontbreken — controleer GitHub-bestand kaart.geojson");}
}
document.addEventListener("DOMContentLoaded",init);
