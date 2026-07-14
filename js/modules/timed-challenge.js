import{renderFullPOPuzzles}from'./full-po-puzzles.js';
export function renderTimedChallenge(){renderFullPOPuzzles();setTimeout(()=>{const timed=document.querySelector('[data-mode="timed"]');if(timed)timed.click()},0)}
