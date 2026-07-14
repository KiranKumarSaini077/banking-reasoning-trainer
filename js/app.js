import{router}from'./core/router.js';
import{storage}from'./core/storage.js';
import{DEFAULT_SETTINGS,THEMES}from'./core/config.js';

const nav=[
 ['dashboard','⌂','Dashboard'],['today','◉',"Today's Training"],['warmup','◇','Cognitive Warm-Up'],['statement-lab','⇄','Statement Lab'],
 ['skill-gym','◎','Skill Gym'],['puzzle-lab','▦','Puzzle Lab'],['constraint-lab','◈','Constraint Lab'],['guided-puzzle','◆','Guided Puzzle'],['full-po-puzzles','⬢','Full PO Puzzles'],['circular-lab','◉','Circular Seating Lab'],['timed-challenge','◷','Timed Challenge'],
 ['mistakes','!','Mistake Lab'],['patterns','⌘','Pattern Library'],['weakness','⌁','Weakness Map'],['analytics','↗','Progress Analytics'],['settings','⚙','Settings']
];

function comingSoon(title,purpose){
 return()=>{
  document.querySelector('#page-title').textContent=title;
  document.querySelector('#page-eyebrow').textContent='PLANNED TRAINING MODULE';
  document.querySelector('#view').innerHTML=`<div class="card empty-state"><span class="chip">Roadmap</span><h2 style="margin:1rem 0 .5rem">${title}</h2><p>${purpose}</p><p style="margin-top:.8rem">This module is intentionally marked as planned rather than pretending to be functional.</p><button class="button" id="working-module" style="margin-top:1rem">Use working training module</button></div>`;
  document.querySelector('#working-module').onclick=()=>router.navigate('skill-gym');
 };
}

async function bootstrap(){
 const navEl=document.querySelector('#primary-nav');
 const quick=document.querySelector('#quick-theme');
 const menu=document.querySelector('#menu-toggle');
 const side=document.querySelector('.sidebar');
 if(!navEl||!quick||!menu||!side)throw new Error('Required application-shell elements are missing.');

 navEl.innerHTML=nav.map(([r,i,n])=>`<a class="nav-link" href="#${r}" data-route="${r}"><span class="nav-icon">${i}</span>${n}</a>`).join('');

 const settings=storage.getSettings(DEFAULT_SETTINGS);
 document.documentElement.dataset.theme=THEMES.some(t=>t.id===settings.theme)?settings.theme:DEFAULT_SETTINGS.theme;
 quick.innerHTML=THEMES.map(t=>`<option value="${t.id}">${t.name}</option>`).join('');
 quick.value=document.documentElement.dataset.theme;
 quick.onchange=()=>{
  const current=storage.getSettings(DEFAULT_SETTINGS);
  current.theme=quick.value;
  storage.saveSettings(current);
  document.documentElement.dataset.theme=current.theme;
 };

 menu.onclick=()=>{
  const open=side.classList.toggle('open');
  menu.setAttribute('aria-expanded',String(open));
 };
 navEl.addEventListener('click',()=>{
  side.classList.remove('open');
  menu.setAttribute('aria-expanded','false');
 });

  router.register('dashboard', ()=>import('./modules/dashboard.js').then(m=>m.renderDashboard()));
  router.register('warmup', ()=>import('./modules/cognitive-warmup.js').then(m=>m.renderCognitiveWarmup()));
  router.register('statement-lab', ()=>import('./modules/statement-lab.js').then(m=>m.renderStatementLab()));
  router.register('skill-gym', ()=>import('./modules/skill-gym.js').then(m=>m.renderSkillGym()));
  router.register('puzzle-lab', ()=>import('./modules/puzzle-lab.js').then(m=>m.renderPuzzleLab()));
  router.register('constraint-lab', ()=>import('./modules/constraint-management.js').then(m=>m.renderConstraintManagement()));
  router.register('guided-puzzle', ()=>import('./modules/guided-puzzle.js').then(m=>m.renderGuidedPuzzle()));
  router.register('full-po-puzzles', ()=>import('./modules/full-po-puzzles.js').then(m=>m.renderFullPOPuzzles()));
  router.register('timed-challenge', ()=>import('./modules/timed-challenge.js').then(m=>m.renderTimedChallenge()));
  router.register('mistakes', ()=>import('./modules/mistake-lab.js').then(m=>m.renderMistakeLab()));
  router.register('settings', ()=>import('./modules/settings.js').then(m=>m.renderSettings()));
  router.register('today', ()=>import('./modules/todays-training.js').then(m=>m.renderTodaysTraining()));
  router.register('weakness', ()=>import('./modules/weakness-map.js').then(m=>m.renderWeaknessMap()));
  router.register('analytics', ()=>import('./modules/analytics.js').then(m=>m.renderAnalytics()));
  router.register('patterns', ()=>import('./modules/pattern-library.js').then(m=>m.renderPatternLibrary()));
  router.register('circular-lab', ()=>import('./modules/circular-lab.js').then(m=>m.renderCircularLab()));



  await router.start();
  window.__REASONFORGE_STARTED__=true;
  document.documentElement.classList.add('app-started');

  if('serviceWorker'in navigator&&location.protocol.startsWith('http')){
   window.addEventListener('load',()=>navigator.serviceWorker.register('./service-worker.js').catch(error=>console.warn('Service worker registration failed:',error)));
  }

  startAppHeartbeat();
}


// Keep the local desktop server alive only while at least one app tab is open.
// When all tabs stop sending heartbeats, the launcher server shuts itself down.
const heartbeatUrl='/__reasonforge/heartbeat';
let heartbeatTimer=null;
function sendAppHeartbeat(){
 fetch(heartbeatUrl,{method:'POST',cache:'no-store',keepalive:true}).catch(()=>{});
}
function sendFinalHeartbeat(){
 navigator.sendBeacon(heartbeatUrl,'');
}
function startAppHeartbeat(){
 sendAppHeartbeat();
 heartbeatTimer=setInterval(sendAppHeartbeat,5000);
}
window.addEventListener('pagehide',()=>{
 sendFinalHeartbeat();
 if(heartbeatTimer)clearInterval(heartbeatTimer);
});

bootstrap().catch(error=>{
 console.error('Fatal bootstrap error',error);
 window.__REASONFORGE_BOOT_ERROR__=error;
 window.dispatchEvent(new CustomEvent('reasonforge:fatal',{detail:{message:error?.message||String(error)}}));
});