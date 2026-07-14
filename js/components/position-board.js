export class PositionBoard{
 constructor(root,{entities,slots,onChange}){
  this.root=root;this.entities=entities;this.slots=slots;this.onChange=onChange;this.selected=null;this.placements={};this.history=[];
  this.render();
 }
 snapshot(){return{...this.placements}}
 pushHistory(){this.history.push(this.snapshot());if(this.history.length>30)this.history.shift()}
 setSelected(entity){this.selected=this.selected===entity?null:entity;this.render();this.emit()}
 place(entity,index){
  if(!this.entities.includes(entity)||index<0||index>=this.slots)return;
  this.pushHistory();
  const occupant=Object.keys(this.placements).find(e=>this.placements[e]===index);
  const old=this.placements[entity];
  if(occupant&&occupant!==entity){
   if(Number.isInteger(old))this.placements[occupant]=old;else delete this.placements[occupant];
  }
  this.placements[entity]=index;this.selected=null;this.render();this.emit();
 }
 remove(entity){if(!(entity in this.placements))return;this.pushHistory();delete this.placements[entity];this.render();this.emit()}
 reset(){this.pushHistory();this.placements={};this.selected=null;this.render();this.emit()}
 undo(){if(!this.history.length)return;this.placements=this.history.pop();this.selected=null;this.render();this.emit()}
 emit(){this.onChange?.(this.snapshot())}
 render(){
  const unplaced=this.entities.filter(e=>!(e in this.placements));
  this.root.innerHTML=`<div class="position-board" aria-label="Interactive position plotting board">
   <div class="direction-guide"><span>← LEFT</span><span>RIGHT →</span></div>
   <div class="token-tray" aria-label="Person tokens">${this.entities.map(e=>`<button class="person-token ${this.selected===e?'selected':''} ${e in this.placements?'placed':''}" data-entity="${e}" aria-pressed="${this.selected===e}">${e}</button>`).join('')}</div>
   <div class="slot-scroll"><div class="position-slots" style="--slot-count:${this.slots}">${Array.from({length:this.slots},(_,i)=>{
    const entity=Object.keys(this.placements).find(e=>this.placements[e]===i);
    return `<button class="position-slot ${entity?'occupied':''}" data-slot="${i}" aria-label="Position ${i+1}${entity?`, occupied by ${entity}`:''}"><span class="slot-number">${i+1}</span><span class="slot-content">${entity||''}</span></button>`;
   }).join('')}</div></div>
   <div class="board-help">${this.selected?`<strong>${this.selected}</strong> selected. Choose a position.`:'Select a person token, then choose a position. You can also drag tokens.'}</div>
   <div class="board-actions"><button class="button ghost board-undo" ${this.history.length?'':'disabled'}>Undo</button><button class="button ghost board-reset" ${Object.keys(this.placements).length?'':'disabled'}>Reset</button></div>
  </div>`;
  this.root.querySelectorAll('.person-token').forEach(btn=>{
   const entity=btn.dataset.entity;
   btn.onclick=()=>this.setSelected(entity);
   btn.draggable=true;
   btn.ondragstart=e=>e.dataTransfer.setData('text/plain',entity);
  });
  this.root.querySelectorAll('.position-slot').forEach(btn=>{
   const index=Number(btn.dataset.slot);
   btn.onclick=()=>{
    if(this.selected)return this.place(this.selected,index);
    const entity=Object.keys(this.placements).find(e=>this.placements[e]===index);
    if(entity)this.setSelected(entity);
   };
   btn.ondragover=e=>e.preventDefault();
   btn.ondrop=e=>{e.preventDefault();this.place(e.dataTransfer.getData('text/plain'),index)};
  });
  this.root.querySelector('.board-undo').onclick=()=>this.undo();
  this.root.querySelector('.board-reset').onclick=()=>this.reset();
 }

 setPlacements(placements){this.placements={...placements};this.render();this.onChange(this.snapshot())}
}