// Fail-closed evidence gate for TAP Amsterdam Academy.
// This DOES NOT assert road access: only official source statements are in these files.
// Until explicit authorization to release segment geometries, the approved lane dataset must remain EMPTY.
const fs=require("node:fs"),path=require("node:path");
const DIR=path.resolve(__dirname,"../tap-amsterdam/verkeersdatabase-v1");
const read=f=>JSON.parse(fs.readFileSync(path.join(DIR,f),"utf8"));
const sources=read("01-officiele-bronnen.json"),original=read("02-bronfeiten-2018.json");
const decisions=read("03-officiele-besluitpunten-2021-2026.json");
const permit=read("04-gemeentelijke-ontheffingsfeiten.json");
const rembrandt=read("06-rembrandtplein-besluiten-2018-2019.json");
const centerEvidence=read("07-centrum-verificatie-2026-10-29.json");
const verifiedCorrections=read("08-gecontroleerde-correcties-damrak-rokin-rembrandtplein.json");
const released=read("05-vrijgegeven-wegvakken.geojson");
function ensure(condition,message){if(!condition)throw new Error(message)}
const refs=new Set(sources.sources.map(x=>x.id));
ensure(refs.size===sources.sources.length,"Duplicate primary source ID");
ensure(refs.size===11,"Expected eleven official public primary sources");
for(const s of sources.sources){
  ensure(s.publisher==="Gemeente Amsterdam","Unverified institution");
  ensure(/^https:\/\/(zoek\.officielebekendmakingen\.nl|www\.amsterdam\.nl|lokaleregelgeving\.overheid\.nl)\//.test(s.source_url),"Source not official "+s.id);
}
ensure(original.exclusion_entries.length===41,"2018 exclusions count mismatch");
ensure(original.permit_rule_facts_list.length===10,"2018 permit conditions mismatch");
ensure(decisions.decision_actions.length===52,"2021 and 2026 decision count mismatch");
ensure(permit.statements.length===6,"Current permit info count mismatch");
ensure(rembrandt.facts.length===7,"Rembrandtplein must have seven source-clause facts");
ensure(verifiedCorrections.facts.length===6&&verifiedCorrections.approved_lane_geometries===0&&verifiedCorrections.does_not_update_live_map===true,"Fact corrections must not publish current taxi routes");
ensure(verifiedCorrections.facts.every(f=>refs.has(f.source_id)&&f.fact_type==="verified_source_statement"&&f.lane_geometry===null&&f.geographic_approach_route===null&&f.current_legal_taxi_route_status===null&&f.approved_for_routing===false),"Source statements must not become routing rules");
for(const road of ["Damrak","Rokin"]){let rec=original.exclusion_entries.find(x=>x.road_or_place===road);ensure(rec?.exclusion_permanence_in_2018_text==="permanent"&&rec.direction_stated_in_source==="beide"&&rec.current_geometry_approved===false,road+" exclusion must be documented narrowly");}
ensure(centerEvidence.corridors.length===5&&centerEvidence.approved_lane_count===0&&centerEvidence.live_map_changed===false,"No live traffic conclusions allowed in corridor source matrix");
for(const corridor of centerEvidence.corridors){
  ensure(corridor.verified_documentary_claim_only===true&&corridor.approved_for_live_map===false&&corridor.certified_current_road_access===false&&corridor.verified_lane_geometry===null&&corridor.verified_direction===null,"Cannot publish unverified center corridor");
  for(const fact of corridor.documentary_evidence) ensure(refs.has(fact.source_id)&&fact.section&&fact.documented_fact,"Unknown source in center corridor");
}
ensure(rembrandt.facts.every(x=>refs.has(x.source_id)&&x.fact_type==="published_traffic_decision"&&x.geometry===null&&x.current_taxi_access===null&&x.physically_installed===null&&x.route_permission_created===false),"Unverified current condition or geometries entered in Rembrandtplein records");
ensure(original.exclusion_entries.every(x=>refs.has(x.source_id)&&x.fact_type==="appears_in_2018_legal_exclusion_list"),"Wrong 2018 source claims");
ensure(decisions.decision_actions.every(x=>refs.has(x.source_id)&&x.fact_type.startsWith("official_road_")),"Wrong decision source claims");
ensure(original.exclusion_entries.map(x=>x.source_exclusion_index).every((id,i)=>id===i+1),"Exclusion order mismatch");
ensure(decisions.decision_actions.filter(x=>x.source_id==="AMS-2026-174698").map(x=>x.decision_point).every((id,i)=>id===i+1),"43 items of 2026 centrum mismatched");
ensure(decisions.decision_actions.filter(x=>x.source_id==="AMS-2026-174698").length===43,"2026 Centrum must have 43 points");
ensure(decisions.decision_actions.filter(x=>x.source_id==="AMS-2026-187433").length===3,"Pampuslaan must have 3 points");
ensure(decisions.decision_actions.filter(x=>x.source_id==="AMS-2026-376185").length===4,"Holendrecht must have 4 points");
ensure(decisions.decision_actions.filter(x=>x.source_id==="AMS-2021-291618").length===2,"Weteringschans must have 2 points");
const ids=[...original.exclusion_entries,...original.permit_rule_facts_list,...decisions.decision_actions,...permit.statements,...rembrandt.facts,...verifiedCorrections.facts].map(x=>x.record_id||x.id);
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
console.log(JSON.stringify({result:"PASS",official_sources:refs.size,rembrandtplein_source_clauses:rembrandt.facts.length,corridors_reviewed:5,source_specific_corrections:verifiedCorrections.facts.length,documented_2018_exclusions:41,documented_2018_conditions:10,documented_decision_actions:52,permit_information:6,approved_lane_geometries:0,live_map_changed:false},null,2));
