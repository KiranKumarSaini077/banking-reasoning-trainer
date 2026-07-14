export function validatePlotExercise(exercise){
 if(!exercise||exercise.type!=='plot_positions')return false;
 if(!Array.isArray(exercise.entities)||exercise.entities.length<2)return false;
 if(!Number.isInteger(exercise.slots)||exercise.slots<2)return false;
 const c=exercise.constraint;
 return !!c&&['relative','distance'].includes(c.kind);
}
export function validatePlacement(exercise,placements){
 const c=exercise.constraint;
 if(c.kind==='relative'){
  const subject=placements[c.subject],reference=placements[c.reference];
  if(!Number.isInteger(subject)||!Number.isInteger(reference))return{complete:false,correct:false};
  const actual=subject-reference;
  return{complete:true,correct:actual===c.offset,actual,expected:c.offset};
 }
 if(c.kind==='distance'){
  const a=placements[c.a],b=placements[c.b];
  if(!Number.isInteger(a)||!Number.isInteger(b))return{complete:false,correct:false};
  const actual=Math.abs(a-b);
  return{complete:true,correct:actual===c.distance,actual,expected:c.distance};
 }
 return{complete:false,correct:false};
}