export function scoreAttempt({correct,responseMs,estimatedTime,hintLevel=0,difficulty=1}){
 const accuracy=correct?1:0;
 const speedRatio=Math.min(1.25,(estimatedTime*1000)/Math.max(responseMs,500));
 const speed=Math.min(1,speedRatio);
 const hintPenalty=Math.max(.35,1-hintLevel*.13);
 const difficultyWeight=1+Math.max(0,difficulty-1)*.08;
 return Math.round(100*(.72*accuracy+.28*speed)*hintPenalty*difficultyWeight);
}
export function updateMastery(previous=50,attemptScore,correct){
 const alpha=correct?.25:.32;
 return Math.max(0,Math.min(100,Math.round(previous*(1-alpha)+attemptScore*alpha)));
}