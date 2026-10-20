#!/usr/bin/env python3
"""Make non-authoritative OSM tram and bus-lane GeoJSON files for the Amsterdam TAP study map."""
import json, urllib.request, urllib.parse, pathlib
root=pathlib.Path(__file__).resolve().parents[1]/"tap-amsterdam"
root.mkdir(parents=True,exist_ok=True)
bbox="(52.275,4.72,52.46,5.07)"
queries={
"tramsporen.geojson":f'[out:json][timeout:55];way["railway"="tram"]{bbox};out geom;',
"busbanen-osm.geojson":f'''[out:json][timeout:55];(
way["highway"="busway"]{bbox};
way["busway"]{bbox};
way["busway:left"]{bbox};
way["busway:right"]{bbox};
way["lanes:bus"]{bbox};
way["lanes:psv"]{bbox};
way["bus:lanes"]{bbox};
way["psv:lanes"]{bbox};
);out geom;'''
}
servers=["https://overpass-api.de/api/interpreter","https://overpass.private.coffee/api/interpreter","https://overpass.kumi.systems/api/interpreter"]
def get(query):
    errors=[]
    for server in servers:
        for method in ("POST","GET"):
            try:
                data=urllib.parse.urlencode({"data":query}).encode()
                headers={"User-Agent":"Amsterdam-TAP-exam-study-map/1.0","Accept":"application/json"}
                if method=="POST":
                    headers["Content-Type"]="application/x-www-form-urlencoded"
                    req=urllib.request.Request(server,data=data,headers=headers,method="POST")
                else: req=urllib.request.Request(server+"?"+data.decode(),headers=headers)
                with urllib.request.urlopen(req,timeout=85) as response:
                    result=json.load(response)
                if "elements" not in result: raise ValueError("No elements")
                print(f"{server} {method}: {len(result['elements'])} ways",flush=True)
                return result
            except Exception as error:
                errors.append(f"{server} {method}: {str(error)[:100]}")
    raise RuntimeError("OSM unavailable: "+"; ".join(errors))
status={}
for name,query in queries.items():
    print("Fetching",name,flush=True)
    data=get(query)
    features=[]
    for way in data["elements"]:
        geometry=way.get("geometry",[])
        if len(geometry)<2:continue
        tags=way.get("tags",{})
        features.append({"type":"Feature","geometry":{"type":"LineString","coordinates":[[round(p["lon"],7),round(p["lat"],7)] for p in geometry]},"properties":{"osm_id":way["id"],"name":tags.get("name",""),"category":"tram_osm" if name.startswith("tram") else "bus_osm","taxi_access_verified":False,"legal_status":"ONBEKEND – deze laag bewijst niet of taxis hier mogen rijden","tags":{k:v for k,v in tags.items() if k in ["railway","name","highway","busway","busway:left","busway:right","bus:lanes","psv:lanes","lanes:bus","lanes:psv","taxi","access","oneway"]}}})
    if len(features)<15:raise RuntimeError(f"Only {len(features)} features in {name}; not publishing")
    output=json.dumps({"type":"FeatureCollection","features":features},ensure_ascii=False,separators=(",",":"))
    (root/name).write_text(output,encoding="utf8")
    status[name]={"features":len(features),"bytes":len(output.encode())}
    print(name,status[name],flush=True)
(root/"osm-layers-status.json").write_text(json.dumps(status,indent=2),encoding="utf8")
