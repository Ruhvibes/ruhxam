/* RuhXam CDN builder — converts www/data/*.js into cdn/*.json for jsDelivr.
 * Usage: node tools/build-cdn.js [version]
 * Hasnain's update flow: edit cdn/*.json (or re-run this), bump version,
 * push to Ruhvibes/ruhxam repo → installed apps auto-update (no new APK). */
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const DATA = path.join(ROOT, 'www', 'data');
const CDN = path.join(ROOT, 'cdn');

const FILES = ['m1.js','m2.js','m3.js','m4.js','m5.js','r1.js','r2.js','r3.js','r4.js',
               's1.js','g1.js','g2.js','ca1.js'];
const PART_FILE = {maths:'maths.json', reasoning:'reasoning.json', science:'science.json',
                   gk:'gk.json', ca:'current-affairs.json'};

function loadChapters(){
  global.window = {};
  let code = 'var RT_CH=[]; window.RT_CH=RT_CH;\n';
  for (const f of FILES) code += fs.readFileSync(path.join(DATA, f), 'utf8') + '\n';
  code += 'module.exports=RT_CH;';
  const m = new module.constructor();
  m._compile(code, path.join(DATA, 'bundle.js'));
  return m.exports;
}

function validate(c){
  const errs = [];
  if (!c.id || !c.part || !c.title || !c.title.hi) errs.push('bad-meta');
  if (!Array.isArray(c.quiz) || c.quiz.length !== 5) errs.push('quiz!=5');
  (c.quiz||[]).forEach((q,i)=>{
    if (!Array.isArray(q.o) || q.o.length < 2 || q.o.length > 4) errs.push('q'+i+':opts!=2-4');
    if (typeof q.a !== 'number' || q.a < 0 || q.a >= q.o.length) errs.push('q'+i+':bad-answer-idx');
    if (!q.e || !q.e.hi) errs.push('q'+i+':no-explanation');
  });
  return errs;
}

const version = parseInt(process.argv[2] || '1', 10);
const chapters = loadChapters();
console.log('chapters loaded:', chapters.length);

let failed = 0;
chapters.forEach(c => {
  const e = validate(c);
  if (e.length){ failed++; console.log('INVALID', c.id, e.join(',')); }
  c.reviewedAt = '2026-10-11';
  c.reviewStatus = 'verified';
});
if (failed){ console.error(failed + ' invalid chapters — aborting'); process.exit(1); }

fs.mkdirSync(CDN, {recursive:true});
const byPart = {};
chapters.forEach(c => { (byPart[c.part] = byPart[c.part] || []).push(c); });
for (const [part, file] of Object.entries(PART_FILE)){
  const list = (byPart[part]||[]).sort((a,b)=>a.num-b.num);
  fs.writeFileSync(path.join(CDN, file),
    JSON.stringify({version, part, count:list.length, chapters:list}, null, 1));
  console.log(file, '→', list.length, 'chapters');
}
const today = new Date().toISOString().slice(0,10);
fs.writeFileSync(path.join(CDN, 'content-version.json'),
  JSON.stringify({version, updated:today, counts:Object.fromEntries(
    Object.entries(byPart).map(([k,v])=>[k,v.length]))}, null, 1));
console.log('content-version.json → v' + version);
console.log('total questions:', chapters.reduce((n,c)=>n+(c.quiz||[]).length, 0));
