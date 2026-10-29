// Fail-closed evidence gate for TAP Amsterdam Academy.
// This DOES NOT assert road access: only official source statements are in these files.
// Until explicit authorization to release segment geometries, the approved lane dataset must remain EMPTY.
const fs=require("node:fs"),path=require("node:path");
const DIR=path.resolve(__dirname,"../tap-amsterdam/verkeersdatabase-v1");
const read=f=>JSON.parse(fs.readFileSync(path.join(DIR,f),"utf8"));
const sources=read("01-officiele-bronnen.json"),original=read("02-bronfeiten-2018.json");
const decisions=read("03-officiele-besluitpunten-2021-2026.json");
const permit=read("04-gemeentelijke-ontheffingsfeiten.json");
const released=read("05-vrijgegeven-wegvakken.geojson");
function ensure(condition,message){if(!condition)throw new Error(message)}
const refs=new Set(sources.sources.map(x=>x.id));
ensure(refs.size===sources.sources.length,"Duplicate primary source ID");
ensure(refs.size===6,"Expected exactly six primary sources in v1");
for(const s of sources.sources){
  ensure(s.publisher==="Gemeente Amsterdam","Unverified institution");
  ensure(/^https:\/\/(zoek\.officielebekendmakingen\.nl|www\.amsterdam\.nl)\//.test(s.source_url),"Source not official "+s.id);
}
ensure(original.exclusion_entries.length===41,"2018 exclusions count mismatch");
ensure(original.permit_rule_facts_list.length===10,"2018 permit conditions mismatch");
ensure(decisions.decision_actions.length===52,"2021 and 2026 decision count mismatch");
ensure(permit.statements.length===6,"Current permit info count mismatch");
ensure(original.exclusion_entries.every(x=>refs.has(x.source_id)&&x.fact_type==="appears_in_2018_legal_exclusion_list"),"Wrong 2018 source claims");
ensure(decisions.decision_actions.every(x=>refs.has(x.source_id)&&x.fact_type.startsWith("official_road_")),"Wrong decision source claims");
ensure(original.exclusion_entries.map(x=>x.source_exclusion_index).every((id,i)=>id===i+1),"Exclusion order mismatch");
ensure(decisions.decision_actions.filter(x=>x.source_id==="AMS-2026-174698").map(x=>x.decision_point).every((id,i)=>id===i+1),"43 items of 2026 centrum mismatched");
ensure(decisions.decision_actions.filter(x=>x.source_id==="AMS-2026-174698").length===43,"2026 Centrum must have 43 points");
ensure(decisions.decision_actions.filter(x=>x.source_id==="AMS-2026-187433").length===3,"Pampuslaan must have 3 points");
ensure(decisions.decision_actions.filter(x=>x.source_id==="AMS-2026-376185").length===4,"Holendrecht must have 4 points");
ensure(decisions.decision_actions.filter(x=>x.source_id==="AMS-2021-291618").length===2,"Weteringschans must have 2 points");
const ids=[...original.exclusion_entries,...original.permit_rule_facts_list,...decisions.decision_actions,...permit.statements].map(x=>x.record_id||x.id);
ensure(ids.length===new Set(ids).size,"Duplicate record ID");
const wetering=original.exclusion_entries.find(x=>x.road_or_place==="Weteringschans");
ensure(wetering?.related_later_decision==="AMS-2021-291618"&&wetering.historical_window_is_not_current_guidance===true,"Old Weteringschans window must not be presented as current");
for(const fact of [...original.exclusion_entries,...original.permit_rule_facts_list,...decisions.decision_actions]){
  ensure(!("taxi_access_allowed" in fact)&&!("current_taxi_access" in fact)&&!("active" in fact),"Unsourced current traffic status claim "+fact.record_id);
  ensure(!("geometry" in fact)&&!("coordinates" in fact)&&!("lat" in fact)&&!("lon" in fact),"No unsupported road geometry may be registered "+fact.record_id);
  ensure(fact.route_permission_created!==true,"Source fact incorrectly creates route right "+fact.record_id);
}
ensure(original.not_for_route_engine===true,"Old regulations must not drive routing");
ensure(released.type==="FeatureCollection"&&Array.isArray(released.features),"Approved lanes must be GeoJSON");
ensure(released.metadata.published_to_live_map===false,"No approval to publish to live map");
ensure(released.features.length===0,"STOP: user has NOT authorized publishing any road segments");
ensure(released.metadata.approved_segment_count===0,"Approved count must remain zero");
console.log(JSON.stringify({result:"PASS",official_sources:refs.size,documented_2018_exclusions:41,documented_2018_conditions:10,documented_decision_actions:52,permit_information:6,approved_lane_geometries:0,live_map_changed:false},null,2));
