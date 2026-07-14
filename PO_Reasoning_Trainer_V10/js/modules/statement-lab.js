import{PositionBoard}from'../components/position-board.js';
import{validatePlotExercise,validatePlacement}from'../engines/position-validator.js';
import{recordStatementAttempt}from'../engines/statement-engine.js';
import{storage}from'../core/storage.js';import{median,pct}from'../utils/statistics.js';

const DATA='./data/statements/position-plotting.json';
let session,board;

async function loadData(){
 const res=await fetch(DATA);if(!res.ok)throw new Error(`Could not load position-plotting data (${res.status}).`);
 const raw=await res.json();if(!Array.isArray(raw))throw new Error('Position-plotting dataset must be an array.');
 const valid=raw.filter((x,i)=>{const ok=validatePlotExercise(x);if(!ok)console.error(`Malformed plotting exercise at ${i}`,x);return ok});
 if(!valid.length)throw new Error('No valid position-plotting exercises are available.');return valid;
}
export async function renderStatementLab(){
 document.querySelector('#page-title').textContent='Statement Lab';document.querySelector('#page-eyebrow').textContent='READ → PLOT → VERIFY';
 const view=document.querySelector('#view');view.innerHTML='<div class="card empty-state"><h2>Preparing visual training board…</h2><p>Loading PO-style position exercises.</p></div>';
 try{
  const all=await loadData();session={id:crypto.randomUUID(),items:[...all].sort(()=>Math.random()-.5).slice(0,10),index:0,results:[],startedAt:new Date().toISOString(),hintLevel:0,submitted:false};renderExercise();
 }catch(e){console.error(e);view.innerHTML=`<div class="card empty-state"><h2>Statement Lab unavailable</h2><p>${e.message}</p><button class="button" onclick="location.reload()">Retry</button></div>`}
}
function renderExercise(){
 const ex=session.items[session.index];session.questionStarted=performance.now();session.hintLevel=0;session.submitted=false;
 document.querySelector('#view').innerHTML=`<section class="training-card wide-training">
 <div class="session-progress"><div class="progress-track"><span style="width:${session.index/session.items.length*100}%"></span></div><strong>${session.index+1}/${session.items.length}</strong></div>
 <div class="card"><div class="training-meta"><span class="chip">Visual Statement Lab</span><span class="chip">Difficulty ${ex.difficulty}</span><span class="chip">${ex.skills.map(s=>s.replaceAll('_',' ')).join(' · ')}</span></div>
 <p class="eyebrow">PLOT THE RELATIONSHIP</p><div class="prompt">${ex.prompt}</div>
 <p class="plot-instruction">Place the person tokens on the row so the statement becomes true. Any arrangement satisfying the relationship is accepted.</p>
 <div id="position-board-root"></div>
 <div class="plot-controls"><button class="button" id="check-plot" disabled>Check arrangement</button><button class="button ghost" id="plot-hint">Use hint</button><span class="muted" id="plot-status">Place all tokens to check.</span></div>
 <div id="plot-hint-slot"></div><div id="feedback-slot"></div></div></section>`;
 board=new PositionBoard(document.querySelector('#position-board-root'),{entities:ex.entities,slots:ex.slots,onChange:placements=>{
  const complete=ex.entities.every(e=>Number.isInteger(placements[e]));
  const check=document.querySelector('#check-plot');if(check)check.disabled=!complete||session.submitted;
  const status=document.querySelector('#plot-status');if(status&&!session.submitted)status.textContent=complete?'Ready to check.':'Place all tokens to check.';
 }});
 document.querySelector('#check-plot').onclick=()=>submit(ex);
 document.querySelector('#plot-hint').onclick=()=>showHint(ex);
}
function showHint(ex){
 if(session.hintLevel>=ex.hints.length)return;
 session.hintLevel++;document.querySelector('#plot-hint-slot').innerHTML=`<div class="hint-box"><strong>Hint ${session.hintLevel}</strong><p>${ex.hints[session.hintLevel-1]}</p></div>`;
 if(session.hintLevel>=ex.hints.length)document.querySelector('#plot-hint').disabled=true;
}
async function submit(ex){
 if(session.submitted)return;
 const placements=board.snapshot(),validation=validatePlacement(ex,placements);if(!validation.complete)return;
 session.submitted=true;const elapsed=Math.round(performance.now()-session.questionStarted);
 document.querySelector('#check-plot').disabled=true;document.querySelector('#plot-hint').disabled=true;
 const answer=validation.correct?'VISUAL_CORRECT':'VISUAL_INCORRECT';
 const adapted={...ex,correctAnswer:'VISUAL_CORRECT',errorMap:{VISUAL_INCORRECT:ex.constraint.kind==='distance'?'GAP_MISCOUNT':'DIRECTION_REVERSAL'}};
 let result;
 try{result=await recordStatementAttempt(adapted,answer,elapsed,session.hintLevel);session.results.push(result)}
 catch(e){console.error(e);result={correct:validation.correct,errorType:validation.correct?null:(ex.constraint.kind==='distance'?'GAP_MISCOUNT':'DIRECTION_REVERSAL'),responseMs:elapsed,hintLevel:session.hintLevel};session.results.push(result)}
 const status=document.querySelector('#plot-status');status.textContent=validation.correct?'Relationship plotted correctly.':'Arrangement does not satisfy the statement.';
 document.querySelector('#feedback-slot').innerHTML=`<div class="feedback ${validation.correct?'success':'error'}"><strong>${validation.correct?'Correct. You converted the statement into positions.':'Not correct yet. Compare the actual spacing and direction with the clue.'}</strong><p>${ex.explanation}</p>${!validation.correct?`<p><strong>Your board:</strong> ${describe(ex,placements)}</p>`:''}<button class="button" id="next-plot">${session.index===session.items.length-1?'View session summary':'Next statement'}</button>${!validation.correct?'<button class="button secondary" id="retry-plot">Retry this statement</button>':''}</div>`;
 document.querySelector('#next-plot').onclick=next;
 document.querySelector('#retry-plot')?.addEventListener('click',()=>renderExercise());
}
function describe(ex,p){
 const c=ex.constraint;if(c.kind==='relative')return `${c.subject} is actually ${Math.abs(p[c.subject]-p[c.reference])} position(s) ${p[c.subject]>p[c.reference]?'right':'left'} of ${c.reference}.`;
 return `The current positional distance is ${Math.abs(p[c.a]-p[c.b])}.`;
}
async function next(){
 session.index++;if(session.index<session.items.length)return renderExercise();
 try{await storage.put('sessions',{id:session.id,type:'visual_statement_lab',startedAt:session.startedAt,endedAt:new Date().toISOString(),attempts:session.results.length,correct:session.results.filter(r=>r.correct).length})}catch(e){console.error(e)}
 renderSummary();
}
function renderSummary(){
 const correct=session.results.filter(r=>r.correct).length,hinted=session.results.filter(r=>r.hintLevel>0).length;
 document.querySelector('#view').innerHTML=`<section class="training-card"><div class="card empty-state"><p class="eyebrow">VISUAL DECODING COMPLETE</p><div class="summary-score">${pct(correct,session.results.length)}%</div><h2>${correct}/${session.results.length} relationships plotted correctly</h2><p>Median response: ${(median(session.results.map(r=>r.responseMs))/1000).toFixed(1)}s · Hints used on ${hinted} item(s)</p></div><div class="card" style="margin-top:1rem"><h3>Transfer goal</h3><p>You are training the exam-relevant operation: read the clue, identify the reference, then place entities with correct direction and spacing.</p></div><div class="hero-actions"><button class="button" id="plot-again">Train again</button><button class="button secondary" id="plot-dash">Dashboard</button></div></section>`;
 document.querySelector('#plot-again').onclick=renderStatementLab;document.querySelector('#plot-dash').onclick=()=>location.hash='dashboard';
}