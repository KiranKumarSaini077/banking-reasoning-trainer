import json,itertools,re,sys
from pathlib import Path
def holds(c,p):
 k=c["kind"]
 if k=="fixed":return p[c["entity"]]==c["position"]
 if k=="relative":return p[c["subject"]]-p[c["reference"]]==c["offset"]
 if k=="not_adjacent":return abs(p[c["a"]]-p[c["b"]])!=1
 if k=="either_relative":return p[c["subject"]]-p[c["reference"]] in c["offsets"]
 if k=="distance":return abs(p[c["a"]]-p[c["b"]])==c["distance"]
 raise ValueError(k)
def solve(z,cs,limit=2):
 out=[]
 for a in itertools.permutations(range(z["slots"]),len(z["entities"])):
  p=dict(zip(z["entities"],a))
  if all(holds(c,p) for c in cs):
   out.append(p)
   if len(out)>=limit:break
 return out
bad=False
for z in json.loads(Path(sys.argv[1] if len(sys.argv)>1 else "data/puzzles/po-independent.json").read_text()):
 s=solve(z,z["constraints"])
 if len(s)!=1:print("FAIL",z["id"],"solution count",len(s));bad=True;continue
 for i in range(len(z["constraints"])):
  t=z["constraints"][:i]+z["constraints"][i+1:]
  r=solve(z,t)
  if len(r)==1 and r[0]==s[0]:print("FAIL",z["id"],"redundant clue",i+1);bad=True
 for i,c in enumerate(z["clues"],1):
  if re.search(r"\bposition\s+\d+\b",c,re.I) or "only remaining position" in c.lower():print("FAIL",z["id"],"wording",i);bad=True
 if not bad:print("PASS",z["id"])
sys.exit(1 if bad else 0)
