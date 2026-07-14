export function diagnose(exercise,answer,elapsedMs){
 if(answer===exercise.correctAnswer) return null;
 const mapped=exercise.errorMap?.[String(answer)];
 if(mapped) return mapped;
 if(elapsedMs>exercise.estimatedTime*2000) return 'TIME_PRESSURE_ERROR';
 return 'UNKNOWN_ERROR';
}
export const ERROR_LABELS={
 GAP_MISCOUNT:'Gap miscount',DISTANCE_GAP_CONFUSION:'Distance vs gap confusion',
 TIME_PRESSURE_ERROR:'Time-pressure error',UNKNOWN_ERROR:'Unclassified error'
};