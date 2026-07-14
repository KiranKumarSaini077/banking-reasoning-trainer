const DB_NAME='reasonforge-db',DB_VERSION=1;
const STORES=['attempts','mastery','sessions','reviews'];
let dbPromise;
function openDB(){
 if(!('indexedDB'in window)) return Promise.reject(new Error('IndexedDB is unavailable.'));
 if(!dbPromise) dbPromise=new Promise((resolve,reject)=>{
  const req=indexedDB.open(DB_NAME,DB_VERSION);
  req.onupgradeneeded=()=>{const db=req.result;STORES.forEach(s=>{if(!db.objectStoreNames.contains(s))db.createObjectStore(s,{keyPath:'id'})})};
  req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error);
 });
 return dbPromise;
}
async function tx(store,mode,action){
 const db=await openDB();return new Promise((resolve,reject)=>{
  const t=db.transaction(store,mode),os=t.objectStore(store),req=action(os);
  req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error);t.onerror=()=>reject(t.error);
 });
}
export const storage={
 async put(store,value){return tx(store,'readwrite',os=>os.put(value))},
 async get(store,id){return tx(store,'readonly',os=>os.get(id))},
 async getAll(store){return tx(store,'readonly',os=>os.getAll())},
 async clear(store){return tx(store,'readwrite',os=>os.clear())},
 getSettings(defaults){try{return {...defaults,...JSON.parse(localStorage.getItem('rf-settings')||'{}')}}catch{return {...defaults}}},
 saveSettings(settings){localStorage.setItem('rf-settings',JSON.stringify(settings))}
};