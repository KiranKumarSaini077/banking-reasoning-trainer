const TYPES=new Set(['opposite','relative','facing','same_facing','opposite_facing']);
export function preflightCircularPuzzle(p){
 const errors=[];
 if(!p||!Array.isArray(p.entities)||!Array.isArray(p.constraints)||!Array.isArray(p.clues))return{valid:false,errors:['Malformed puzzle data.']};
 const clueIds=p.clues.map(c=>c.id),constraintIds=p.constraints.map(c=>c.id);
 if(new Set(p.entities).size!==p.entities.length)errors.push('Duplicate entities detected.');
 if(new Set(clueIds).size!==clueIds.length)errors.push('Duplicate clue IDs detected.');
 if(new Set(constraintIds).size!==constraintIds.length)errors.push('Duplicate constraint IDs detected.');
 p.clues.forEach((c,i)=>{if(!c.id||!c.text)errors.push(`Clue ${i+1} requires stable id and text.`)});
 p.constraints.forEach((c,i)=>{
  if(!c.id)errors.push(`Constraint ${i+1} has no stable ID.`);
  if(!TYPES.has(c.kind))errors.push(`Constraint ${c.id||i+1} has unsupported kind ${c.kind}.`);
  if(!c.sourceClueId||!clueIds.includes(c.sourceClueId))errors.push(`Constraint ${c.id||i+1} has invalid sourceClueId.`);
  const people=c.kind==='opposite'?[c.a,c.b]:[c.subject,c.reference].filter(Boolean);
  people.forEach(e=>{if(!p.entities.includes(e))errors.push(`Constraint ${c.id||i+1} references unknown entity ${e}.`)});
 });
 const uncovered=clueIds.filter(id=>!p.constraints.some(c=>c.sourceClueId===id));
 if(uncovered.length)errors.push(`Visible clues without machine constraints: ${uncovered.join(', ')}`);
 return{valid:errors.length===0,errors};
}