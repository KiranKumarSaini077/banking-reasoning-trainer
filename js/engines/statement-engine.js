import{storage}from'../core/storage.js';
import{scoreAttempt,updateMastery}from'./mastery-engine.js';

export function validateStatementExercises(data){
 if(!Array.isArray(data))throw new Error('Statement dataset must be an array.');
 return data.filter((x,i)=>{
  const ok=x&&typeof x.id==='string'&&typeof x.prompt==='string'&&typeof x.question==='string'&&Array.isArray(x.options)&&x.options.includes(x.correctAnswer)&&Array.isArray(x.skills);
  if(!ok)console.error(`Malformed statement exercise at index ${i}`,x);
  return ok;
 });
}
export async function loadStatementExercises(url){
 const res=await fetch(url);if(!res.ok)throw new Error(`Could not load Statement Lab data (${res.status}).`);
 return validateStatementExercises(await res.json());
}
export function diagnoseStatement(exercise,answer){
 if(answer===exercise.correctAnswer)return null;
 return exercise.errorMap?.[String(answer)]||'UNKNOWN_ERROR';
}
export async function recordStatementAttempt(exercise,answer,responseMs,hintLevel=0){
 const correct=answer===exercise.correctAnswer,errorType=diagnoseStatement(exercise,answer);
 const attemptScore=scoreAttempt({correct,responseMs,estimatedTime:exercise.estimatedTime,hintLevel,difficulty:exercise.difficulty});
 const masteryUpdates={};
 for(const skill of exercise.skills){
  const old=await storage.get('mastery',skill)||{id:skill,score:50,attempts:0,updatedAt:null};
  const score=updateMastery(old.score,attemptScore,correct);
  await storage.put('mastery',{...old,score,attempts:old.attempts+1,updatedAt:new Date().toISOString()});
  masteryUpdates[skill]=score;
 }
 const attempt={id:crypto.randomUUID(),exerciseId:exercise.id,module:'statement_lab',skills:exercise.skills,answer,correct,errorType,responseMs,hintLevel,difficulty:exercise.difficulty,createdAt:new Date().toISOString()};
 await storage.put('attempts',attempt);
 return{...attempt,attemptScore,masteryUpdates};
}