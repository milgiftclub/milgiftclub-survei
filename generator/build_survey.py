import json, re, os
from questions import Q, HIGH, FASHION_CATS, RANDOMIZE, RANDOMIZE_ROWS, variant_v2
from categories import CATS
from products import PRODUCTS
num={q[0]:i+1 for i,q in enumerate(Q)}
TYPE={'SA':'sa','SA (dropdown)':'dropdown','SA (cari kota)':'city','MA':'ma','MA (maks. 3)':'ma','Matrix SA':'matrix_sa','Matrix MA':'matrix_ma','NPS 0-10':'nps','OA':'oa'}
SKIP={'X1','Z5'}
def clean_text(t):
    t=t.replace('[PLATFORM {B2}]','{B2}').replace('[PLATFORM {AW1}]','{AW1}').replace('[KATEGORI]','{CAT}').replace('[jawaban {LO1}]','{LO1X}').replace('[tanggal]','{TANGGAL}')
    t=re.sub(r'\s*\((boleh pilih lebih dari satu|pilih maksimal 3|boleh pilih lebih dari satu platform per baris)\)','',t)
    return t
def build_schema(QL, variant):
  schema=[]
  for qid,topic,qt,typ,attrs,rout,notes in QL:
      if qid=='Z5':
          schema.append({'id':'Z5','topic':'','text':clean_text(qt),'type':'info','options':[]}); continue
      if qid in SKIP: continue
      FR={'Pembuka & Persetujuan':'Selamat datang','Screening':'Tentang kamu','Profil & Demografi':'Tentang kamu','Lanskap Platform':'Aplikasi belanja',
          'Penetrasi & Penugasan Kategori':'Belanja terakhir','Quality Check':'Cek sebentar','Tren & Perilaku Baru':'Kebiasaan belanja','Penutup & Data Giveaway':'Hampir selesai!'}
      tname=topic.split('\n')[0]
      tname=FR.get(tname, 'Belanja terakhir' if tname.startswith('Funneling') else tname)
      it={'id':qid,'topic':tname,'type':TYPE[typ],'loop':'MODUL KATEGORI' in rout}
      text=clean_text(qt)
      if qid=='O1':
          parts=text.split('Apakah Anda bersedia'); it['intro']=parts[0].strip(); text='Apakah Anda bersedia'+parts[1]
      m=re.search(r'\s*\((pilih produk utamanya|harga yang Anda bayar setelah diskon, di luar ongkir)\)$', text)
      if m: it['hint']=m.group(1)[0].upper()+m.group(1)[1:]; text=text[:m.start()]
      text=text.replace('[jawaban {PT1}]','"{PT1X}"')
      it['text']=text
      if typ=='MA (maks. 3)': it['max']=3
      if it['type'] in ('matrix_sa','matrix_ma'):
          rows=[a for a in attrs if a.startswith('Baris:')][0][6:].strip()
          cols=[a for a in attrs if a.startswith('Kolom:')][0][6:].strip()
          it['cols']=[c.strip() for c in cols.split('|') if not c.strip().startswith('[Piping')]
          if '[Piping' in cols: it['pipeCols']='MKT'
          if rows.startswith('[Piping'): it['pipe']='C1'; it['rows']=[]
          else: it['rows']=[r.strip() for r in rows.split('|')]
          if 'Tidak ada' in it['cols']: it['colEx']='Tidak ada'
          it['options']=[]
      elif it['type']=='city':
          it['options']=[]
      elif it['type']=='oa':
          it['options']=[]
          ph=attrs[0]
          if qid=='Z2': it['placeholder']='@namaanda'
          elif qid=='Z3': it['placeholder']='08xxxxxxxxxx'
          elif qid=='PV': it['placeholder']='Contoh: 7890'; it['hint']='Kosongkan lalu klik Lanjut jika ingin mengisi data diri dari awal'
          else: it['long']=True; it['placeholder']='Tulis jawaban Anda di sini'
          if 'opsional' in ph.lower(): it['optional']=True
      elif it['type']=='nps':
          it['options']=[]
      else:
          if attrs and attrs[0].startswith('[Piping: daftar produk'):
              it['pipe']='PROD'; it['options']=[]
              it['byCat']={c:[({'t':a.split(', sebutkan')[0].strip(),'other':True} if 'sebutkan: ___' in a else {'t':a}) for a in lst] for c,lst in PRODUCTS.items()}
          elif attrs and attrs[0].startswith('[Piping'):
              it['pipe']='SC1' if 'di {SC1}' in attrs[0] else 'HIGH' if 'kategori HIGH' in attrs[0] else ('S4-AW1' if 'kecuali' in attrs[0] else 'S4'); it['options']=[]
          else:
              ops=[]
              for a in attrs:
                  o={'t':a}
                  if '(eksklusif)' in a: o['t']=a.replace(' (eksklusif)','').strip(); o['ex']=True
                  if 'sebutkan: ___' in a: o['t']=a.split(', sebutkan')[0].strip(); o['other']=True
                  ops.append(o)
              it['options']=ops
      if qid in RANDOMIZE: it['rnd']=True
      if qid in RANDOMIZE_ROWS: it['rndRows']=True
      if qid=='C1' and variant=='v1': it['hint']='Gulir ke bawah untuk melihat kategori lainnya ↓'
      schema.append(it)
  return schema
groups={c[1]:c[0] for c in CATS}
os.makedirs('survey_out',exist_ok=True)
S1=build_schema(Q,'v1'); S2=build_schema(variant_v2(),'v2'); schema=S1
html=open('survey_src/Index.html.tpl').read().replace('__SCHEMA__',json.dumps({'v1':S1,'v2':S2},ensure_ascii=False)).replace('__GROUPS__',json.dumps(groups,ensure_ascii=False)).replace('__FASHION__',json.dumps(FASHION_CATS,ensure_ascii=False)).replace('__CITIES__',open('cities.json').read())
open('survey_out/Index.html','w').write(html)
cats=[[c[0],c[1],'High' if c[1] in HIGH else 'Low'] for c in CATS]
dic=[[q[0],num[q[0]],q[1].split('\n')[0],re.sub(r'\{(\w+)\}',lambda m:'Q%d'%num[m.group(1)],q[2])] for q in Q if q[0] not in ('X1','Z5')]
num2={q[0]:i+1 for i,q in enumerate(variant_v2())}
dic.append(['SC1','v2:'+str(num2['SC1']),'Screening (v2)','Dalam 1 bulan terakhir, apakah Anda pernah membeli produk dari kategori fokus (Fashion wanita, Tas & aksesori, Fashion muslim / modest) secara online?'])
qopts={}
for sch in (S1, S2):
    for q in sch:
        o=[x['t'] for x in q.get('options',[]) if isinstance(x,dict) and x.get('t')] or q.get('cols') or []
        if o and q['id'] not in qopts: qopts[q['id']]=o
gs=open('survey_src/Code.gs.tpl').read().replace('__CATEGORIES__',json.dumps(cats,ensure_ascii=False)).replace('__DICTIONARY__',json.dumps(dic,ensure_ascii=False)).replace('__QOPTS__',json.dumps(qopts,ensure_ascii=False))
open('survey_out/Code.gs','w').write(gs)
print('v1',len(S1),'v2',len(S2), [x['id'] for x in S2 if x.get('pipe')])

import base64, glob
_assets = {os.path.basename(f)[:-5]: 'data:image/webp;base64,' + base64.b64encode(open(f, 'rb').read()).decode() for f in sorted(glob.glob('assets/promo/*.webp'))}
open('survey_out/Admin.html', 'w').write(open('survey_src/Admin.html').read().replace('__PROMO_ASSETS__', json.dumps(_assets)))
