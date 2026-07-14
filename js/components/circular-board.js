export class CircularBoard{
constructor(root,{entities,mode='center'}){this.root=root;this.entities=entities;this.mode=mode;this.placements={};this.facings={};this.selected=null;this.highlighted=new Set();this.history=[];this.future=[];this.render()}
setHighlights(people=[]){this.highlighted=new Set(people);this.render()}
clearHighlights(){this.highlighted.clear();this.render()}
snap(){return{placements:{...this.placements},facings:{...this.facings}}}
restore(s){this.placements={...s.placements};this.facings={...s.facings}}
occ(i){return Object.keys(this.placements).find(e=>this.placements[e]===i)||null}
save(){this.history.push(this.snap());if(this.history.length>80)this.history.shift();this.future=[]}
place(e,i){const o=this.occ(i);if(o&&o!==e)return;this.save();this.placements[e]=i;if(this.mode==='mixed'&&!this.facings[e])this.facings[e]='center';this.selected=null;this.render()}
toggleFacing(e){if(this.mode!=='mixed')return;this.save();this.facings[e]=this.facings[e]==='outside'?'center':'outside';this.render()}
undo(){if(!this.history.length)return;this.future.push(this.snap());this.restore(this.history.pop());this.selected=null;this.render()}
redo(){if(!this.future.length)return;this.history.push(this.snap());this.restore(this.future.pop());this.selected=null;this.render()}
reset(){if(!Object.keys(this.placements).length)return;this.save();this.placements={};this.facings={};this.selected=null;this.render()}
render(){
 const n=this.entities.length,placed=new Set(Object.keys(this.placements));
 const modeLabel=this.mode==='mixed'?'Mixed facing':`All face ${this.mode}`;
 this.root.innerHTML=`<div class="rf-circle-workspace">
  <div class="rf-person-bank">${this.entities.map(e=>`<div class="rf-token-wrap"><button class="rf-person-token ${this.selected===e?'is-selected':''} ${placed.has(e)?'is-placed':''} ${this.highlighted.has(e)?'is-error-highlight':''}" data-person="${e}"><strong>${e}</strong><span>${placed.has(e)?'Placed':'Available'}</span></button>${this.mode==='mixed'&&placed.has(e)?`<button class="rf-facing-toggle" data-facing="${e}" title="Toggle facing">${this.facings[e]==='outside'?'↗ Outside':'↘ Center'}</button>`:''}</div>`).join('')}</div>
  <div class="rf-circle-stage"><div class="rf-circle-board">
   <div class="rf-circle-center"><strong>${modeLabel}</strong><span>${this.mode==='mixed'?'Tap facing chips to toggle':'Direction-aware board'}</span></div>
   ${Array.from({length:n},(_,i)=>{const a=i/n*Math.PI*2-Math.PI/2,x=50+41*Math.cos(a),y=50+41*Math.sin(a),e=this.occ(i),face=e?(this.mode==='mixed'?this.facings[e]:this.mode):'';return`<button class="rf-circle-seat ${e?'is-occupied':''} ${this.selected&&!e?'is-target':''} ${e&&this.highlighted.has(e)?'is-error-highlight':''}" style="left:${x}%;top:${y}%" data-seat="${i}">${e?`<strong>${e}</strong><span>${face==='outside'?'↗ OUT':'↘ IN'}</span>`:`<span class="rf-place-label">Place</span>`}</button>`}).join('')}
  </div></div>
  <div class="rf-board-actions"><div class="rf-action-buttons"><button class="button ghost" id="rf-undo" ${this.history.length?'':'disabled'}>Undo</button><button class="button ghost" id="rf-redo" ${this.future.length?'':'disabled'}>Redo</button><button class="button ghost" id="rf-reset" ${Object.keys(this.placements).length?'':'disabled'}>Reset</button></div><p class="rf-board-help">Select a person, then choose an empty seat.${this.mode==='mixed'?' Use the facing chip to switch Center / Outside.':''}</p></div>
 </div>`;
 this.root.querySelectorAll('[data-person]').forEach(b=>b.onclick=()=>{const e=b.dataset.person;this.selected=this.selected===e?null:e;this.render()});
 this.root.querySelectorAll('[data-seat]').forEach(b=>b.onclick=()=>{if(this.selected)this.place(this.selected,+b.dataset.seat)});
 this.root.querySelectorAll('[data-facing]').forEach(b=>b.onclick=()=>this.toggleFacing(b.dataset.facing));
 this.root.querySelector('#rf-undo').onclick=()=>this.undo();this.root.querySelector('#rf-redo').onclick=()=>this.redo();this.root.querySelector('#rf-reset').onclick=()=>this.reset();
}}