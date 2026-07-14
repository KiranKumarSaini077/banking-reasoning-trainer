const state={currentRoute:'dashboard',session:null,exercises:[],profile:null};
export const appState={get:key=>state[key],set:(key,value)=>state[key]=value,all:()=>({...state})};