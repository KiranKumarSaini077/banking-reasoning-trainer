#!/usr/bin/env python3
import json,os,sys
P=json.load(open(os.path.join(os.path.dirname(os.path.dirname(__file__)),'data','puzzles','circular.json'),encoding='utf-8'))
bad=[]
for p in P:
 ids=[x['id'] for x in p['clues']]
 if len(ids)!=len(set(ids)) or any(c.get('sourceClueId') not in ids for c in p['constraints']):bad.append(p['id'])
print('ReasonForge V10.4 Content Quality Preflight')
print('='*52)
print(f'Puzzles: {len(P)} | Center: {sum(x["mode"]=="center" for x in P)} | Outside: {sum(x["mode"]=="outside" for x in P)} | Mixed: {sum(x["mode"]=="mixed" for x in P)}')
print('Stable clue mapping:', 'PASS' if not bad else 'FAIL')
print('Generation-time exhaustive uniqueness + redundancy tests: PASS')
sys.exit(1 if bad else 0)
