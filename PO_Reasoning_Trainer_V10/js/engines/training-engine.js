import{storage}from'../core/storage.js';
import{diagnose}from'./error-diagnosis.js';
import{scoreAttempt,updateMastery}from'./mastery-engine.js';

export function validateExercises(data){
 if(!Array.isArray(data))throw new Error('Exercise dataset must be an array.');
 return data.filter((x,i)=>{
  const ok=x&&typeof x.id==='string'&&typeof x.prompt==='string'&&Array.isArray(x.options)&&'correctAnswer'in x&&Array.isArray(x.skills);
  if(!ok)console.error(`Malformed exercise at index ${i}`,x);return ok;
 });
}
export async function loadExercises(url){
 const res=await fetch(url);if(!res.ok)throw new Error(`Could not load exercises (${res.status}).`);
 return validateExercises(await res.json());
}
export async function recordAttempt(exercise,answer,responseMs,hintLevel=0){
 const correct=answer===exercise.correctAnswer;
 const errorType=diagnose(exercise,answer,responseMs);
 const attemptScore=scoreAttempt({correct,responseMs,estimatedTime:exercise.estimatedTime,hintLevel,difficulty:exercise.difficulty});
 const masteryRecord=await storage.get('mastery','gap_calculation')||{id:'gap_calculation',score:50,attempts:0,updatedAt:null};
 const newScore=updateMastery(masteryRecord.score,attemptScore,correct);
 const attempt={id:crypto.randomUUID(),exerciseId:exercise.id,skill:'gap_calculation',answer,correct,errorType,responseMs,hintLevel,difficulty:exercise.difficulty,createdAt:new Date().toISOString()};
 await storage.put('attempts',attempt);
 await storage.put('mastery',{...masteryRecord,score:newScore,attempts:masteryRecord.attempts+1,updatedAt:new Date().toISOString()});
 return{...attempt,attemptScore,mastery:newScore};
}