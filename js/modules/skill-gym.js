import{APP}from'../core/config.js';import{loadExercises,recordAttempt}from'../engines/training-engine.js';import{storage}from'../core/storage.js';import{ERROR_LABELS}from'../engines/error-diagnosis.js';import{pct,median}from'../utils/statistics.js';
let session=null;
export async function renderSkillGym(){
 document.querySelector('#page-title').textContent='Skill Gym';document.querySelector('#page-eyebrow').textContent='ATOMIC REASONING TRAINING';
 const view=document.querySelector('#view');view.innerHTML='<div class="card empty-state"><h2>Loading training set…</h2><p>Preparing validated exercise data.</p></div>';
 try{
  const all=await loadExercises(APP.exercisePath);
  if(!all.length)throw new Error('No valid exercises are available.');
  session={id:crypto.randomUUID(),items:[...all].sort(()=>Math.random()-.5).slice(0,10),index:0,results:[],startedAt:new Date().toISOString()};
  renderExercise();
 }catch(e){console.error(e);view.innerHTML=`<div class="card empty-state"><h2>Training data unavailable</h2><p>${e.message}</p><button class="button" onclick="location.reload()">Retry</button></div>`}
}
function renderExercise(){
 const view=document.querySelector('#view'),ex=session.items[session.index];session.questionStarted=performance.now();
 view.innerHTML=`<section class="training-card">
 <div class="session-progress"><div class="progress-track"><span style="width:${session.index/session.items.length*100}%"></span></div><strong>${session.index+1}/${session.items.length}</strong></div>
 <div class="card"><div class="training-meta"><span class="chip">Gap Calculation</span><span class="chip">Difficulty ${ex.difficulty}</span><span class="chip">Target ${ex.estimatedTime}s</span></div>
 <p class="eyebrow">SOLVE THE RELATIONSHIP</p><div class="prompt">${ex.prompt}</div>
 <div class="answer-grid">${ex.options.map((o,i)=>`<button class="answer-option" data-index="${i}">${o}</button>`).join('')}</div>
 <div id="feedback-slot"></div></div></section>`;
 view.querySelectorAll('.answer-option').forEach(b=>b.onclick=()=>submit(ex.options[Number(b.dataset.index)],ex,b));
}
async function submit(answer,ex,clicked){
 const elapsed=Math.round(performance.now()-session.questionStarted);
 document.querySelectorAll('.answer-option').forEach((b,i)=>{b.disabled=true;if(ex.options[i]===ex.correctAnswer)b.classList.add('correct')});
 if(answer!==ex.correctAnswer&&clicked)clicked.classList.add('incorrect');
 let result;
 try{result=await recordAttempt(ex,answer,elapsed);session.results.push(result)}catch(e){console.error(e);result={correct:answer===ex.correctAnswer,errorType:'UNKNOWN_ERROR',mastery:'–'};session.results.push(result)}
 const slot=document.querySelector('#feedback-slot');
 slot.innerHTML=`<div class="feedback ${result.correct?'success':'error'}"><strong>${result.correct?'Correct. Relationship mapped accurately.':'Not quite. Diagnose the operation, not just the answer.'}</strong><p>${ex.explanation}</p>${result.errorType?`<p><strong>Likely error:</strong> ${ERROR_LABELS[result.errorType]||result.errorType}</p>`:''}<p><strong>Updated mastery:</strong> ${result.mastery}%</p><button class="button" id="next-btn">${session.index===session.items.length-1?'View session summary':'Next exercise'}</button></div>`;
 document.querySelector('#next-btn').onclick=next;
}
async function next(){
 session.index++;
 if(session.index<session.items.length)return renderExercise();
 const endedAt=new Date().toISOString(),record={id:session.id,type:'gap_calculation',startedAt:session.startedAt,endedAt,attempts:session.results.length,correct:session.results.filter(r=>r.correct).length};
 try{await storage.put('sessions',record)}catch(e){console.error(e)}
 renderSummary();
}
function renderSummary(){
 const view=document.querySelector('#view'),correct=session.results.filter(r=>r.correct).length,errors=session.results.filter(r=>r.errorType);
 const grouped=errors.reduce((m,r)=>(m[r.errorType]=(m[r.errorType]||0)+1,m),{}),top=Object.entries(grouped).sort((a,b)=>b[1]-a[1])[0];
 view.innerHTML=`<section class="training-card"><div class="card empty-state"><p class="eyebrow">SESSION COMPLETE</p><div class="summary-score">${pct(correct,session.results.length)}%</div><h2>${correct}/${session.results.length} accurate</h2><p>Median response time: ${(median(session.results.map(r=>r.responseMs))/1000).toFixed(1)}s</p></div>
 <div class="grid grid-2" style="margin-top:1rem"><div class="card"><h3>Diagnosis</h3><p>${top?`Your most frequent error was <strong>${(ERROR_LABELS[top[0]]||top[0])}</strong>. Retrain this pattern before adding complexity.`:'No repeated error pattern appeared in this session.'}</p></div><div class="card"><h3>Next action</h3><p>${correct<8?'Repeat a short gap-calculation set and target clean conversion between people-between and positional distance.':'Your foundation is stabilizing. Keep speed secondary to correct representation.'}</p></div></div>
 <div class="hero-actions"><button class="button" id="again">Train again</button><button class="button secondary" id="dash">Dashboard</button></div></section>`;
 document.querySelector('#again').onclick=renderSkillGym;document.querySelector('#dash').onclick=()=>location.hash='dashboard';
}