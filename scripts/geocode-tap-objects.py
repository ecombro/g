#!/usr/bin/env python3
"""Geocode TAP historical list via PDOK/BAG, audit differences, flag ambiguous places.

No manually estimated point should be mistaken for a verified street address.
Uses the 40 TAP features in kaart.geojson and retains non-TAP warning pins unchanged.
"""
import json, re, time, math, difflib, unicodedata, urllib.parse, urllib.request
from datetime import datetime, timezone
from pathlib import Path
BASE = Path(__file__).resolve().parents[1]/"tap-amsterdam"
SOURCE = BASE/"kaart.geojson"
GEOCODE = "https://api.pdok.nl/bzk/locatieserver/search/v3_1/free"
NOMINATIM = "https://nominatim.openstreetmap.org/search"
HEADERS = {"User-Agent":"TAPAmsterdam-study-address-validation/1.0 (github.com/ecombro/g)",
           "Accept":"application/json"}
# Current official visit address of Reade Jan van Breemen; source: reade.nl/over-ons/locaties/jan-van-breemen
CORRECTED_ADDRESSES = {
    "TAP 6. Reade revalidatiecentrum": "Admiraal Helfrichstraat 1, Amsterdam",
    "TAP 10. Van Gogh Museum": "Museumplein 6, Amsterdam",
    "TAP 11. Anne Frankhuis": "Westermarkt 20, Amsterdam",
    "TAP 34. De Hallen": "Hannie Dankbaarpassage 47, Amsterdam",
}
# Station De Vlugtlaan: confirmed metro station OSM node 2237721918 (Mapcarta).
STATION_PINS = {
    "TAP 9. Station Vlugtlaan": {
       "coords": [4.83822, 52.37961],
       "level": "stationspunt",
       "source": "OpenStreetMap node 2237721918 (Metrostation De Vlugtlaan)",
       "confidence": "middel",
       "matched": "Metrostation De Vlugtlaan, Amsterdam; geen ingang",
       "match_id": "OSM:node:2237721918",
    }
}
STATIONS = {
  "TAP 8. Station Postjesweg": ["metrostation Postjesweg, Amsterdam", "Postjesweg metrostation Amsterdam"],
  "TAP 9. Station Vlugtlaan": ["metrostation Burgemeester de Vlugtlaan, Amsterdam","Metrostation De Vlugtlaan Amsterdam"],
}
def read_json(url, params, timeout=22):
    query=urllib.parse.urlencode(params,doseq=True)
    request=urllib.request.Request(url+"?"+query,headers=HEADERS)
    with urllib.request.urlopen(request,timeout=timeout) as res:
        return json.load(res)
def norm(s):
    s=unicodedata.normalize("NFKD",str(s or "")).encode("ascii","ignore").decode()
    return re.sub(r"[^a-z0-9]+","",s.lower())
def km(a,b):
    lon1,lat1=a
    lon2,lat2=b
    dx=(lon1-lon2)*math.cos(math.radians((lat1+lat2)/2))*111320
    dy=(lat1-lat2)*110570
    return math.hypot(dx,dy)/1000
def point(wkt):
    m=re.search(r"POINT\s*\(\s*([0-9.+-]+)\s+([0-9.+-]+)\s*\)",str(wkt or ""))
    return [float(m.group(1)),float(m.group(2))] if m else None
def split_address(address):
    clean=address.rsplit(", Amsterdam",1)[0].strip()
    matched=re.match(r"^(.+?)\s+(\d+)([a-zA-Z]?)(?:\s*[-/]\s*\d+[a-zA-Z]?)?$",clean)
    if not matched:return None
    return (matched.group(1),matched.group(2),clean)
def pdok(address):
    spl=split_address(address)
    if not spl:return None, "geen huisnummer (station of weg)"
    street,no,clean=spl
    data=read_json(GEOCODE,{"q":street+" "+no+" Amsterdam","fq":"type:adres","rows":30})
    docs=data.get("response",{}).get("docs",[])
    best=None
    for doc in docs:
        if str(doc.get("type","")).lower()!="adres":continue
        lonlat=point(doc.get("centroide_ll"))
        if not lonlat or not (4.6<=lonlat[0]<=5.15 and 52.2<=lonlat[1]<=52.5):continue
        if "amsterdam" not in norm(doc.get("woonplaatsnaam",doc.get("weergavenaam",""))):continue
        if str(doc.get("huisnummer",""))!=str(no):continue
        dStreet=doc.get("straatnaam","")
        sim=difflib.SequenceMatcher(None,norm(street),norm(dStreet)).ratio()
        if sim < .78:continue
        # Matching street, house number and city is mandatory; choose closest normalized street.
        score=sim
        if norm(street)==norm(dStreet):score+=1
        if best is None or score>best[0]:
            best=(score,lonlat,doc)
    if best is None:return None,f"PDOK vond geen exact matchend adres voor {clean}"
    _,coords,doc=best
    return {"coords":coords,"level":"BAG-adres","source":"PDOK Locatieserver / BAG","confidence":"hoog",
            "matched":doc.get("weergavenaam",""),
            "match_id":doc.get("adresseerbaarobject_id",doc.get("id",""))},None
def nominatim(names):
    for query in names:
        results=read_json(NOMINATIM,{"q":query,"format":"json","addressdetails":1,"limit":8})
        for item in results:
            display=item.get("display_name","")
            if "Amsterdam" not in display:continue
            typ=(item.get("type") or "").lower()
            category=(item.get("class") or "").lower()
            if typ not in ["station","halt","stop","platform","subway","tram_stop"] and category not in ["railway","public_transport"]:continue
            coords=[float(item["lon"]),float(item["lat"])]
            if 4.7<=coords[0]<=5.1 and 52.28<=coords[1]<=52.45:
                return {"coords":coords,"level":"stationspunt","source":"OpenStreetMap Nominatim","confidence":"middel",
                        "matched":display,"match_id":item.get("osm_id","")},None
        time.sleep(1.1)
    return None,"Stationpositie niet bevestigd door OpenStreetMap"
def main():
    geo=json.loads(SOURCE.read_text(encoding="utf8"))
    feats=[x for x in geo["features"] if x.get("properties",{}).get("category")=="TAP-object"]
    if len(feats)!=40:raise RuntimeError("40 TAP objects expected")
    audits=[];ok=0;unresolved=0;fallback=0
    for i,f in enumerate(feats,1):
        p=f["properties"];name=p["name"];addr=p.get("address","")
        old=f["geometry"]["coordinates"].copy()
        if name in CORRECTED_ADDRESSES:
            p.setdefault("historical_address",addr)
            addr=CORRECTED_ADDRESSES[name]
            p["address"]=addr
            p["visitor_address_status"]="officiële bezoekadresbron geverifieerd voor geselecteerde objecten"
            p["address_correction"]="actueel bezoekadres van de locatie; het eerdere (historische) objectadres blijft in historical_address"
        try:
            if name in STATION_PINS:
                result,error=dict(STATION_PINS[name]),None
            elif name in STATIONS:
                result,error=nominatim(STATIONS[name])
            else:
                result,error=pdok(addr)
        except Exception as e:
            result,error=None,str(e)
        if result:
            coord=result.pop("coords")
            d=km(old,coord)
            # Always update geometries with validated source coordinates, even when far from hand estimates.
            f["geometry"]["coordinates"]=[round(coord[0],7),round(coord[1],7)]
            p["coordinate_status"]="gecontroleerd_adres" if result["level"]=="BAG-adres" else "stationspunt_niet_ingang"
            p["coordinate_source"]=result["source"]
            p["coordinate_confidence"]=result["confidence"]
            p["coordinate_match"]=result["matched"]
            p["coordinate_checked_at"]=datetime.now(timezone.utc).date().isoformat()
            p["coordinate_note"]="BAG-adrespunt; niet noodzakelijk de taxi-ingang of afzetplaats." if result["level"]=="BAG-adres" else "Stationsmiddelpunt; niet de exacte reizigersingang."
            audits.append({"id":i,"name":name,"address":addr,"status":p["coordinate_status"],
                           "old":old,"new":f["geometry"]["coordinates"],"shift_m":round(d*1000),
                           "matched":p["coordinate_match"],"confidence":result["confidence"]})
            ok+=1
        else:
            p["coordinate_status"]="onbevestigd"
            p["coordinate_source"]="geen"
            p["coordinate_note"]="VORIGE COORDINATEN ZIJN BENADERD; LOCATIE NOG NIET BEVESTIGD."
            audits.append({"id":i,"name":name,"address":addr,"status":"onbevestigd",
                           "old":old,"new":old,"reason":error})
            unresolved+=1
        print(f"{i:02d} {name:44} {p['coordinate_status']:25} "+(f"{audits[-1].get('shift_m')}m" if result else error),flush=True)
        time.sleep(.15)
    audit={"checked_at":datetime.now(timezone.utc).isoformat(),"source":"PDOK Locatieserver / BAG + Nominatim stations",
           "total":40,"verified":ok,"unresolved":unresolved,"objects":audits,
           "important":"Adrespunt verschilt van officiële taxi-ingang. Onbevestigde punten blijven benaderingen."}
    (BASE/"tap-coordinates-audit.json").write_text(json.dumps(audit,ensure_ascii=False,indent=2)+"\n",encoding="utf8")
    SOURCE.write_text(json.dumps(geo,ensure_ascii=False,separators=(",",":"))+"\n",encoding="utf8")
    print(f"Result: verified {ok}/40, unresolved {unresolved}",flush=True)
    if ok<38: raise SystemExit("Geocoding too incomplete: fewer than 38 verified; do not publish guesses")
if __name__=="__main__":main()
