const TRACKED=[
 'gap_calculation','direction_mapping','reference_tracking','constraint_integration',
 'chain_inference','clue_prioritization','case_management','contradiction_detection'
];
const ROUTES={
 gap_calculation:'skill-gym',direction_mapping:'statement-lab',reference_tracking:'statement-lab',
 constraint_integration:'puzzle-lab',chain_inference:'puzzle-lab',clue_prioritization:'constraint-lab',
 case_management:'constraint-lab',contradiction_detection:'constraint-lab'
};
export function buildLearnerProfile(masteries=[],attempts=[],reviews=[]){
 const scores=Object.fromEntries(TRACKED.map(id=>[id,50]));
 masteries.forEach(m=>{if(m&&m.id)scores[m.id]=Number.isFinite(m.score)?m.score:50});
 const errorCounts={};
 attempts.filter(a=>a.errorType).forEach(a=>errorCounts[a.errorType]=(errorCounts[a.errorType]||0)+1);
 const weakest=TRACKED.map(id=>({id,score:scores[id],route:ROUTES[id]})).sort((a,b)=>a.score-b.score);
 const now=Date.now();
 const overdue=reviews.filter(r=>r.nextReview&&new Date(r.nextReview).getTime()<=now);
 const recent=attempts.slice().sort((a,b)=>new Date(b.timestamp||b.createdAt||0)-new Date(a.timestamp||a.createdAt||0)).slice(0,12);
 const recentAccuracy=recent.length?recent.filter(a=>a.correct).length/recent.length:1;
 const fatigue=recent.length>=6&&recentAccuracy<.55;
 return{scores,weakest,errorCounts,overdue,recentAccuracy,fatigue};
}
export function composeAdaptiveSession(profile,duration=20){
 const minutes=Math.max(5,Math.min(30,Number(duration)||20));
 const weak=profile.weakest.slice(0,3);
 const blocks=[];
 const add=(kind,label,route,share,reason)=>blocks.push({kind,label,route,minutes:Math.max(1,Math.round(minutes*share)),reason});
 add('warmup','Reasoning warm-up','warmup',.15,profile.fatigue?'Recent performance dipped. Start with a low-load reset.':'Prime attention before heavier reasoning.');
 add('weakness',`Train ${weak[0].id.replaceAll('_',' ')}`,weak[0].route,.40,`Lowest current mastery: ${weak[0].score}%.`);
 if(profile.overdue.length)add('review','Spaced review','mistakes',.20,`${profile.overdue.length} review item(s) are due.`);
 else add('review',`Reinforce ${weak[1].id.replaceAll('_',' ')}`,weak[1].route,.20,'No overdue review items, so reinforce the second weakest skill.');
 add('mixed','Mixed reasoning','puzzle-lab',.15,'Interleave skills so performance does not depend on one familiar pattern.');
 add('transfer','PO-level transfer','full-po-puzzles',.10,'Apply trained operations inside a complete puzzle.');
 let total=blocks.reduce((s,b)=>s+b.minutes,0);
 while(total>minutes){const b=blocks.find(x=>x.minutes>1);if(!b)break;b.minutes--;total--}
 while(total<minutes){blocks[1].minutes++;total++}
 return{duration:minutes,blocks,primary:weak[0],generatedAt:new Date().toISOString()};
}
