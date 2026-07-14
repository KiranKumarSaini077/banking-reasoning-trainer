export function circularIndex(i,d,s,n,f='center'){
 const leftStep=f==='center'?1:-1;
 return(i+(d==='left'?leftStep:-leftStep)*s%n+n)%n;
}
export function facingOf(entity,puzzle,facings={}){
 return puzzle.facing==='mixed'?(facings[entity]||puzzle.solutionFacing?.[entity]||'center'):puzzle.facing;
}
function fail(c,puzzle,placements,facings){
 const n=puzzle.entities.length,clue=puzzle.clues.find(x=>x.id===c.sourceClueId);
 const base={constraintId:c.id,sourceClueId:c.sourceClueId,clueNumber:puzzle.clues.findIndex(x=>x.id===c.sourceClueId)+1,clueText:clue?.text||'Unknown clue'};
 if(c.kind==='opposite')return{...base,kind:'position',people:[c.a,c.b],title:`Clue ${base.clueNumber} is violated`,detail:`${c.b} must sit opposite ${c.a}.`,rule:`Opposite means exactly ${n/2} seats away in an ${n}-person circle.`};
 if(c.kind==='relative'){
  const face=facingOf(c.reference,puzzle,facings),mapped=c.direction==='left'?(face==='center'?'clockwise':'anticlockwise'):(face==='center'?'anticlockwise':'clockwise');
  return{...base,kind:'position',people:[c.reference,c.subject],title:`Clue ${base.clueNumber} is violated`,detail:`${c.subject} is not ${c.steps===1?'immediately ':`${c.steps} places `}to the ${c.direction} of ${c.reference}.`,rule:`Reference person: ${c.reference} · Facing: ${face.toUpperCase()} · ${c.reference}'s ${c.direction.toUpperCase()} = ${mapped.toUpperCase()}.`};
 }
 if(c.kind==='facing')return{...base,kind:'facing',people:[c.subject],title:`Clue ${base.clueNumber} is violated`,detail:`${c.subject} should face ${c.facing.toUpperCase()}, but currently faces ${(facings[c.subject]||'unset').toUpperCase()}.`,rule:`This is an explicit facing condition.`};
 if(c.kind==='same_facing')return{...base,kind:'facing',people:[c.subject,c.reference],title:`Clue ${base.clueNumber} is violated`,detail:`${c.subject} must face the same direction as ${c.reference}.`,rule:`${c.subject}: ${(facings[c.subject]||'unset').toUpperCase()} · ${c.reference}: ${(facings[c.reference]||'unset').toUpperCase()}.`};
 if(c.kind==='opposite_facing')return{...base,kind:'facing',people:[c.subject,c.reference],title:`Clue ${base.clueNumber} is violated`,detail:`${c.subject} must face the opposite direction from ${c.reference}.`,rule:`Their facing states must differ.`};
 return{...base,kind:'data',people:[],title:'Unsupported constraint',detail:`Unknown constraint type: ${c.kind}`,rule:'Puzzle data must be corrected.'};
}
export function validateCircularArrangement(placements,puzzle,facings={}){
 const n=puzzle.entities.length,failures=[];
 for(const c of puzzle.constraints){
  let bad=false;
  if(c.kind==='opposite')bad=((placements[c.a]+n/2)%n)!==placements[c.b];
  else if(c.kind==='relative')bad=placements[c.subject]!==circularIndex(placements[c.reference],c.direction,c.steps,n,facingOf(c.reference,puzzle,facings));
  else if(c.kind==='facing')bad=facings[c.subject]!==c.facing;
  else if(c.kind==='same_facing')bad=!facings[c.subject]||!facings[c.reference]||facings[c.subject]!==facings[c.reference];
  else if(c.kind==='opposite_facing')bad=!facings[c.subject]||!facings[c.reference]||facings[c.subject]===facings[c.reference];
  else bad=true;
  if(bad)failures.push(fail(c,puzzle,placements,facings));
 }
 const positionFailures=failures.filter(x=>x.kind==='position'),facingFailures=failures.filter(x=>x.kind==='facing');
 return{valid:!failures.length,positionValid:!positionFailures.length,failures,positionFailures,facingFailures};
}
export function answerCircularQuestion(q,puzzle,placements,facings={}){
 const n=puzzle.entities.length,target=q.type==='opposite_entity'?(placements[q.reference]+n/2)%n:circularIndex(placements[q.reference],q.direction,q.steps,n,facingOf(q.reference,puzzle,facings));
 return Object.keys(placements).find(e=>placements[e]===target)||null;
}