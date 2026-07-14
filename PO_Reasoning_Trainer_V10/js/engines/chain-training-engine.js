import{storage}from'../core/storage.js';import{scoreAttempt,updateMastery}from'./mastery-engine.js';
export async function recordChainAttempt(exercise,{correct,responseMs,hintLevel=0,errorType=null,metadata={}}){
 const attemptScore=scoreAttempt({correct,responseMs,estimatedTime:exercise.estimatedTime,hintLevel,difficulty:exercise.difficulty});
 const masteryUpdates={};
 for(const skill of exercise.skills){
  const old=await storage.get('mastery',skill)||{id:skill,score:50,attempts:0,updatedAt:null};
  const score=updateMastery(old.score,attemptScore,correct);
  await storage.put('mastery',{...old,score,attempts:old.attempts+1,updatedAt:new Date().toISOString()});
  masteryUpdates[skill]=score;
 }
 const attempt={id:crypto.randomUUID(),exerciseId:exercise.id,module:'puzzle_lab',skills:exercise.skills,correct,errorType,responseMs,hintLevel,difficulty:exercise.difficulty,metadata,createdAt:new Date().toISOString()};
 await storage.put('attempts',attempt);return{...attempt,attemptScore,masteryUpdates};
}