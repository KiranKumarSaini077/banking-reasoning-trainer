const CACHE='reasonforge-v10.5.3.0';
const ASSETS=[
'./','./index.html','./manifest.json',
'./css/bundle.css',
'./js/app.js','./js/core/router.js','./js/core/state.js','./js/core/event-bus.js','./js/core/storage.js','./js/core/config.js',
'./js/engines/mastery-engine.js','./js/engines/error-diagnosis.js','./js/engines/training-engine.js','./js/engines/statement-engine.js',
'./js/engines/adaptive-engine.js','./js/engines/circular-engine.js',
'./js/modules/dashboard.js','./js/modules/cognitive-warmup.js','./js/modules/statement-lab.js','./js/modules/skill-gym.js','./js/modules/puzzle-lab.js','./js/modules/mistake-lab.js','./js/modules/constraint-management.js','./js/modules/guided-puzzle.js','./js/modules/full-po-puzzles.js','./js/modules/timed-challenge.js','./js/modules/settings.js',
'./js/modules/todays-training.js','./js/modules/weakness-map.js','./js/modules/analytics.js','./js/modules/pattern-library.js','./js/modules/circular-lab.js','./js/components/circular-board.js',
'./js/components/toast.js','./js/components/position-board.js','./js/components/case-board.js','./js/components/exam-board.js','./js/engines/position-validator.js','./js/engines/constraint-engine.js','./js/engines/chain-training-engine.js','./js/utils/statistics.js',
'./data/skills.json','./data/patterns/core-patterns.json','./data/puzzles/circular.json','./data/drills/gap-calculation.json','./data/statements/statement-lab.json','./data/statements/position-plotting.json','./data/puzzles/linear-chains.json','./data/puzzles/constraint-management.json','./data/puzzles/guided-linear.json','./data/puzzles/po-independent.json'
];

self.addEventListener('install',event=>{
 event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS)).then(()=>self.skipWaiting()));
});
self.addEventListener('activate',event=>{
 event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim()));
});
self.addEventListener('fetch',event=>{
 const request=event.request;
 if(request.method!=='GET')return;
 const url=new URL(request.url);
 if(url.origin!==self.location.origin)return;

 if(request.mode==='navigate'){
  event.respondWith(fetch(request).then(response=>{
   const copy=response.clone();caches.open(CACHE).then(cache=>cache.put('./index.html',copy));return response;
  }).catch(()=>caches.match('./index.html')));
  return;
 }

 event.respondWith(caches.match(request).then(cached=>{
  const network=fetch(request).then(response=>{
   if(response.ok){const copy=response.clone();caches.open(CACHE).then(cache=>cache.put(request,copy))}
   return response;
  });
  return cached||network;
 }));
});