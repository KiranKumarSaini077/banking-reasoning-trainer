import{THEMES,DEFAULT_SETTINGS}from'../core/config.js';import{storage}from'../core/storage.js';import{toast}from'../components/toast.js';
export function renderSettings(){
 document.querySelector('#page-title').textContent='Settings';document.querySelector('#page-eyebrow').textContent='PERSONALIZE YOUR TRAINING';
 const s=storage.getSettings(DEFAULT_SETTINGS),view=document.querySelector('#view');
 view.innerHTML=`<section class="card"><h2>Experience</h2><p>Lightweight preferences stay in LocalStorage. Training history stays in IndexedDB.</p>
 <div class="settings-row"><div><strong>Theme</strong><p>Choose a visual environment that reduces friction.</p></div><select id="theme-setting" class="compact-select">${THEMES.map(t=>`<option value="${t.id}" ${s.theme===t.id?'selected':''}>${t.name}</option>`).join('')}</select></div>
 <div class="settings-row"><div><strong>Reduced motion</strong><p>Minimize non-essential interface motion.</p></div><input id="motion-setting" type="checkbox" ${s.reducedMotion?'checked':''}></div>
 <div class="settings-row"><div><strong>Default session</strong><p>Preferred training duration for future adaptive sessions.</p></div><select id="duration-setting" class="compact-select">${[5,10,20,30].map(n=>`<option ${s.lastDuration===n?'selected':''} value="${n}">${n} minutes</option>`).join('')}</select></div>
 <div class="hero-actions"><button class="button" id="save-settings">Save settings</button></div></section>`;
 document.querySelector('#save-settings').onclick=()=>{
  const next={...s,theme:document.querySelector('#theme-setting').value,reducedMotion:document.querySelector('#motion-setting').checked,lastDuration:Number(document.querySelector('#duration-setting').value)};
  storage.saveSettings(next);document.documentElement.dataset.theme=next.theme;document.documentElement.dataset.reduceMotion=String(next.reducedMotion);
  document.querySelector('#quick-theme').value=next.theme;toast('Settings saved');
 };
}