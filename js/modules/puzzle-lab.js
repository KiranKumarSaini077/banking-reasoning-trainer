import{PositionBoard}from'../components/position-board.js';
import{validateAllConstraints,validateChainPuzzle}from'../engines/constraint-engine.js';
import{recordChainAttempt}from'../engines/chain-training-engine.js';
import{storage}from'../core/storage.js';import{median,pct}from'../utils/statistics.js';
const DATA='./data/puzzles/linear-chains.json';let session,board;

async function loadPuzzles(){
 const r=await fetch(DATA);if(!r.ok)throw new Error(`Could not load chain puzzles (${r.status}).`);
 const raw=await r.json();const valid=raw.filter((p,i)=>{const ok=validateChainPuzzle(p);if(!ok)console.error('Malformed chain puzzle',i,p);return ok});
 if(!valid.length)throw new Error('No valid chain puzzles found.');return valid;
}
export async function renderPuzzleLab(){
 document.querySelector('#page-title').textContent='Puzzle Lab';document.querySelector('#page-eyebrow').textContent='CONNECT → BUILD → INFER';
 const view=document.querySelector('#view');view.innerHTML='<div class="card empty-state"><h2>Preparing chain training…</h2><p>Loading multi-clue integration exercises.</p></div>';
 try{
  const all=await loadPuzzles();session={id:crypto.randomUUID(),items:[...all].sort(()=>Math.random()-.5).slice(0,6),index:0,results:[],startedAt:new Date().toISOString(),hintLevel:0,submitted:false,phase:'board'};renderExercise();
 }catch(e){console.error(e);view.innerHTML=`<div class="card empty-state"><h2>Puzzle Lab unavailable</h2><p>${e.message}</p><button class="button" onclick="location.reload()">Retry</button></div>`}
}
function renderExercise(){
 const ex=session.items[session.index];session.questionStarted=performance.now();session.hintLevel=0;session.submitted=false;session.phase='board';
 document.querySelector('#view').innerHTML=`<section class="training-card wide-training">
 <div class="session-progress"><div class="progress-track"><span style="width:${session.index/session.items.length*100}%"></span></div><strong>${session.index+1}/${session.items.length}</strong></div>
 <div class="grid puzzle-workspace"><aside class="card clue-panel"><div class="training-meta"><span class="chip">Level 3</span><span class="chip">${ex.clues.length} clues</span><span class="chip">Difficulty ${ex.difficulty}</span></div><p class="eyebrow">CLUE SET</p><h2>${ex.title}</h2>
 <ol class="clue-list">${ex.clues.map((c,i)=>`<li class="clue-item" data-clue="${i}"><button class="clue-focus" data-focus="${i}" aria-label="Focus clue ${i+1}">${i+1}</button><span>${c}</span></li>`).join('')}</ol>
 <div class="strategy-note"><strong>Goal</strong><p>Build one arrangement satisfying every clue. Absolute position does not matter unless a clue fixes it.</p></div></aside>
 <main class="card puzzle-board-card"><p class="eyebrow">CONSTRUCT THE CHAIN</p><div id="chain-board"></div>
 <div class="plot-controls"><button class="button" id="check-chain" disabled>Check all clues</button><button class="button ghost" id="chain-hint">Use hint</button><span class="muted" id="chain-status">Place every person.</span></div>
 <div id="chain-hint-slot"></div><div id="chain-feedback"></div></main></div></section>`;
 board=new PositionBoard(document.querySelector('#chain-board'),{entities:ex.entities,slots:ex.slots,onChange:p=>{
  const complete=ex.entities.every(e=>Number.isInteger(p[e]));const btn=document.querySelector('#check-chain');if(btn)btn.disabled=!complete||session.submitted;
  const status=document.querySelector('#chain-status');if(status&&!session.submitted)status.textContent=complete?'Ready to validate all clues.':'Place every person.';
 }});
 document.querySelectorAll('[data-focus]').forEach(b=>b.onclick=()=>focusClue(Number(b.dataset.focus)));
 document.querySelector('#check-chain').onclick=()=>checkBoard(ex);document.querySelector('#chain-hint').onclick=()=>showHint(ex);
}
function focusClue(i){document.querySelectorAll('.clue-item').forEach((el,n)=>el.classList.toggle('focused',n===i))}
function showHint(ex){
 if(session.hintLevel>=ex.hints.length)return;session.hintLevel++;
 document.querySelector('#chain-hint-slot').innerHTML=`<div class="hint-box"><strong>Hint ${session.hintLevel}</strong><p>${ex.hints[session.hintLevel-1]}</p></div>`;
 if(session.hintLevel>=ex.hints.length)document.querySelector('#chain-hint').disabled=true;
}
async function checkBoard(ex){
 if(session.submitted)return;const placements=board.snapshot(),v=validateAllConstraints(ex.constraints,placements);if(!v.complete)return;
 if(!v.correct){
  v.failedClues.forEach(i=>document.querySelector(`.clue-item[data-clue="${i}"]`)?.classList.add('failed'));
  document.querySelector('#chain-status').textContent=`${v.failedClues.length} clue(s) are not satisfied.`;
  document.querySelector('#chain-feedback').innerHTML=`<div class="feedback error"><strong>Not all constraints fit yet.</strong><p>The highlighted clue${v.failedClues.length>1?'s':''} conflict with your current arrangement. Adjust the board and check again.</p></div>`;
  return;
 }
 document.querySelectorAll('.clue-item').forEach(el=>{el.classList.remove('failed');el.classList.add('passed')});
 if(ex.derivedQuestion){session.phase='inference';return renderInference(ex,placements)}
 await finishExercise(ex,placements,true,null);
}
function renderInference(ex,placements){
 document.querySelector('#check-chain').disabled=true;document.querySelector('#chain-hint').disabled=true;
 document.querySelector('#chain-status').textContent='All clues satisfied. Now derive the answer.';
 document.querySelector('#chain-feedback').innerHTML=`<div class="feedback success"><strong>Construction correct.</strong><p>Now answer from the arrangement you built.</p></div><div class="derived-card"><p class="eyebrow">DERIVED INFERENCE</p><h3>${ex.derivedQuestion.prompt}</h3><div class="statement-options">${ex.derivedQuestion.options.map((o,i)=>`<button class="statement-option" data-infer="${i}"><span class="option-key">${String.fromCharCode(65+i)}</span><span>${o}</span></button>`).join('')}</div></div>`;
 document.querySelectorAll('[data-infer]').forEach(btn=>btn.onclick=()=>submitInference(ex,placements,btn,ex.derivedQuestion.options[Number(btn.dataset.infer)]));
}
async function submitInference(ex,placements,btn,answer){
 if(session.submitted)return;session.submitted=true;const correct=answer===ex.derivedQuestion.correctAnswer;
 document.querySelectorAll('[data-infer]').forEach((b,i)=>{b.disabled=true;if(ex.derivedQuestion.options[i]===ex.derivedQuestion.correctAnswer)b.classList.add('correct')});if(!correct)btn.classList.add('incorrect');
 await finishExercise(ex,placements,correct,correct?null:'MISSED_INFERENCE');
}
async function finishExercise(ex,placements,correct,errorType){
 session.submitted=true;const elapsed=Math.round(performance.now()-session.questionStarted);document.querySelector('#check-chain').disabled=true;document.querySelector('#chain-hint').disabled=true;
 let result;try{result=await recordChainAttempt(ex,{correct,responseMs:elapsed,hintLevel:session.hintLevel,errorType,metadata:{clueCount:ex.clues.length,hadDerivedQuestion:!!ex.derivedQuestion}});session.results.push(result)}catch(e){console.error(e);result={correct,responseMs:elapsed,hintLevel:session.hintLevel,errorType};session.results.push(result)}
 document.querySelector('#chain-feedback').innerHTML+=`<div class="feedback ${correct?'success':'error'}"><strong>${correct?'Chain solved.':'Board correct, but the derived inference was missed.'}</strong><p>${ex.explanation}</p><button class="button" id="next-chain">${session.index===session.items.length-1?'View session summary':'Next chain'}</button></div>`;
 document.querySelector('#next-chain').onclick=next;
}
async function next(){
 session.index++;if(session.index<session.items.length)return renderExercise();
 try{await storage.put('sessions',{id:session.id,type:'puzzle_lab_chain',startedAt:session.startedAt,endedAt:new Date().toISOString(),attempts:session.results.length,correct:session.results.filter(r=>r.correct).length})}catch(e){console.error(e)}renderSummary();
}
function renderSummary(){
 const correct=session.results.filter(r=>r.correct).length,hinted=session.results.filter(r=>r.hintLevel>0).length;
 document.querySelector('#view').innerHTML=`<section class="training-card"><div class="card empty-state"><p class="eyebrow">CHAIN SESSION COMPLETE</p><div class="summary-score">${pct(correct,session.results.length)}%</div><h2>${correct}/${session.results.length} multi-clue problems completed</h2><p>Median response: ${(median(session.results.map(r=>r.responseMs))/1000).toFixed(1)}s · Hints used on ${hinted} problem(s)</p></div><div class="grid grid-2" style="margin-top:1rem"><div class="card"><h3>What V3 trained</h3><p>Holding multiple clues together, choosing connected anchors, constructing a shared arrangement, and deriving new relationships.</p></div><div class="card"><h3>Next transfer step</h3><p>Increase clue count and introduce negative constraints, fixed positions, contradiction detection, and controlled case splitting.</p></div></div><div class="hero-actions"><button class="button" id="chain-again">Train again</button><button class="button secondary" id="chain-dash">Dashboard</button></div></section>`;
 document.querySelector('#chain-again').onclick=renderPuzzleLab;document.querySelector('#chain-dash').onclick=()=>location.hash='dashboard';
}