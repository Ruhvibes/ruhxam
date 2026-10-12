/* RuhXam — app logic. 7 tabs, offline-first, HI/EN, dark mode. */
(function(){
'use strict';
var $=function(id){return document.getElementById(id);};
function esc(s){return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}
function shuffle(a){a=a.slice();for(var i=a.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1));var t=a[i];a[i]=a[j];a[j]=t;}return a;}

var RT={lang:'hi',theme:'light',examId:'ntpc',view:'home',stack:[]};
function initState(){
  RT.lang=RXStore.get('lang')||'hi';
  RT.theme=RXStore.get('theme')||'light';
  RT.examId=RXStore.get('examId')||'ntpc';
}
function t(k){var e=RT_STR[k];if(!e)return k;return e[RT.lang]||e.hi;}
function L(obj){return (obj&&(obj[RT.lang]||obj.hi))||'';}

/* ---------- ads bridge ---------- */
function setAds(v){try{if(window.Android&&Android.setAdsVisible)Android.setAdsVisible(!!v);}catch(e){}}
function vibrate(ms){try{if(window.Android&&Android.vibrate)Android.vibrate(ms);}catch(e){}}

/* ---------- toast + confirm ---------- */
var toastTimer=null;
function toast(msg){var el=$('toast');el.textContent=msg;el.classList.remove('hidden');
  clearTimeout(toastTimer);toastTimer=setTimeout(function(){el.classList.add('hidden');},2200);}
function confirmDlg(msg,cb){
  $('confirmText').textContent=msg;
  $('confirmYes').textContent=t('yes');$('confirmNo').textContent=t('no');
  $('confirmModal').classList.remove('hidden');
  $('confirmYes').onclick=function(){$('confirmModal').classList.add('hidden');cb(true);};
  $('confirmNo').onclick=function(){$('confirmModal').classList.add('hidden');cb(false);};
}

/* ---------- chapters ---------- */
var CH=window.RT_CH||[];
function chById(id){for(var i=0;i<CH.length;i++)if(CH[i].id===id)return CH[i];return null;}
function chByPart(p){return CH.filter(function(c){return c.part===p;}).sort(function(a,b){return a.num-b.num;});}
var RX_PARTS=[
  {id:'maths',n:1,icon:'🔢',tk:'part_maths',sk:'maths_sub'},
  {id:'reasoning',n:2,icon:'🧠',tk:'part_reas',sk:'reas_sub'},
  {id:'science',n:3,icon:'🔬',tk:'part_science',sk:'science_sub'},
  {id:'gk',n:4,icon:'🌍',tk:'part_gk',sk:'gk_sub'},
  {id:'ca',n:5,icon:'📰',tk:'part_ca',sk:'ca_sub'}
];
function partOf(id){for(var i=0;i<RX_PARTS.length;i++)if(RX_PARTS[i].id===id)return RX_PARTS[i];return RX_PARTS[0];}

/* ---------- diagrams per chapter ---------- */
var RX_DGM={
  m01:function(){return RXD.numberLine(-2,12,[0,5]);},
  m12:function(){return RXD.pieChart({hi:'मिश्रण अनुपात',en:'Mixture Ratio'}[RT.lang],{hi:[['A',60],['B',40]],en:[['A',60],['B',40]]}[RT.lang]);},
  m16:function(){return RXD.triangleTypes()+RXD.circleParts()+RXD.angleTypes();},
  m17:function(){return RXD.quadShapes()+RXD.circleParts();},
  m18:function(){return RXD.clockFace(4,20)+RXD.calendarGrid(2026,10,[15]);},
  m19:function(){return RXD.barChart({hi:'बिक्री',en:'Sales'}[RT.lang],{hi:[['जन',40],['फर',65],['मार',50]],en:[['Jan',40],['Feb',65],['Mar',50]]}[RT.lang]);},
  m21:function(){return RXD.triangleTypes();},
  r02:function(){return RXD.familyTree();},
  r03:function(){return RXD.compass8();},
  r09:function(){return RXD.venn2('A','B');},
  r11:function(){return RXD.seatingCircle(['A','B','C','D']);},
  r12:function(){return RXD.mirrorDemo();},
  r15:function(){return RXD.venn3('A','B','C');},
  g01:function(){return RXD.timeline(RT.lang==='hi'?[['1857','1857 की क्रांति'],['1947','स्वतंत्रता']]:[['1857','Revolt of 1857'],['1947','Independence']]);},
  g02:function(){return RXD.indiaOutline()+RXD.compass8();}
};
/* diagrams inside specific MCQs: 'chapterId:questionIndex' */
var RX_QDGM={
  'm16:0':function(){return RXD.triangleTypes();},
  'm18:0':function(){return RXD.clockFace(4,20);},
  'm18:2':function(){return RXD.clockFace(6,0);},
  'm19:0':function(){return RXD.barChart('X',{hi:[['सोम',200],['मंगल',300]],en:[['Mon',200],['Tue',300]]}[RT.lang]);},
  'm19:4':function(){return RXD.pieChart('X',{hi:[['A',30],['B',70]],en:[['A',30],['B',70]]}[RT.lang]);},
  'r03:0':function(){return RXD.compass8();},
  'r09:0':function(){return RXD.venn2('A','B');},
  'r12:0':function(){return RXD.mirrorDemo();},
  'r15:0':function(){return RXD.venn3('A','B','C');}
};
function dgmFor(chId){var f=RX_DGM[chId];if(!f)return '';try{return '<div class="dgm-wrap">'+f()+'</div>';}catch(e){return '';}}
function qdgmFor(chId,qi){var f=RX_QDGM[chId+':'+qi];if(!f)return '';try{return '<div class="dgm-wrap">'+f()+'</div>';}catch(e){return '';}}

/* ---------- navigation ---------- */
var TABS=['home','study','practice','mock','notes','progress','profile'];
var RX_VIEWS={home:1,study:1,part:1,practice:1,mock:1,notes:1,progress:1,profile:1,pdfcat:1,pdfview:1};
function show(v,arg){
  if(!RX_VIEWS[v])v='home'; // unknown/special views (chapter, quiz, mockrun, noteedit, formulas) never land here blank
  RT.view=v;
  var holder=(v==='part'||v==='pdfcat'||v==='pdfview')?'study':v; // 'part'/'pdfcat'/'pdfview' render into v-study
  document.querySelectorAll('#main .view').forEach(function(s){s.classList.add('hidden');});
  var sec=$('v-'+holder);if(sec)sec.classList.remove('hidden');
  document.querySelectorAll('#tabbar .tab').forEach(function(b){
    b.classList.toggle('sel',b.getAttribute('data-tab')===v);
  });
  $('btnBack').classList.toggle('hidden', v==='home');
  var adsScreens={home:1,study:1,part:1,chapter:1,notes:1,progress:1,profile:1,practice:1};
  setAds(!!adsScreens[v]);
  window.scrollTo(0,0);
  ({home:renderHome,study:renderStudy,part:renderPart,practice:renderPractice,mock:renderMockSetup,
    notes:renderNotes,progress:renderProgress,profile:renderProfile,
    pdfcat:renderPdfCat,pdfview:function(id){var p=window.pdfById(id);if(p)openPdf(id);else renderPdfHome();}}[v]||renderHome)(arg);
}
function goTab(v){RT.stack=[];if(typeof MK!=='undefined'&&MK&&MK.timer){clearInterval(MK.timer);MK=null;}show(v);}
window.__ruhxamBack=function(){
  if(!$('confirmModal').classList.contains('hidden')){$('confirmModal').classList.add('hidden');return 'yes';}
  if(RT.stack.length){var s=RT.stack.pop();show(s.v,s.arg);return 'yes';}
  if(RT.view!=='home'){goTab('home');return 'yes';}
  return 'no';
};
function push(v,arg){RT.stack.push({v:RT.view});show(v,arg);}

/* ---------- formula sheet (all maths <mark> formulas, one place) ---------- */
function renderFormulaSheet(){
  RT.view='formulas';
  document.querySelectorAll('#main .view').forEach(function(s){s.classList.add('hidden');});
  $('v-study').classList.remove('hidden');
  document.querySelectorAll('#tabbar .tab').forEach(function(b){b.classList.toggle('sel',b.getAttribute('data-tab')==='study');});
  $('btnBack').classList.remove('hidden');setAds(true);
  var fstop=RT.stack[RT.stack.length-1];
  if(!fstop||fstop.v!=='study')RT.stack.push({v:'study'});
  var h='<h2 class="sec">'+esc(t('formula_sheet'))+'</h2><p class="muted">'+esc(t('all_formulas'))+'</p>';
  var hasAny=false;
  chByPart('maths').forEach(function(c){
    var marks=[];
    function grabMarks(html){var m=String(html||'').match(/<mark>(.*?)<\/mark>/g)||[];m.forEach(function(x){var txt=x.replace(/<\/?mark>/g,'');if(txt&&marks.indexOf(txt)<0)marks.push(txt);});}
    (c.tricks||[]).forEach(function(tr){grabMarks(tr.b.hi);grabMarks(tr.b.en);});
    if(c.notes&&c.notes.formulas){grabMarks(c.notes.formulas.hi);grabMarks(c.notes.formulas.en);}
    if(!marks.length)return;
    hasAny=true;
    h+='<div class="card anim-in"><h3><span class="ch-num">'+c.num+'</span> '+esc(L(c.title))+'</h3>';
    h+='<div class="formula-list">'+marks.map(function(f){return '<span class="formula-chip">'+f+'</span>';}).join('')+'</div></div>';
  });
  if(!hasAny){
    /* Maths study content is now Hasnain's PDF library — point there */
    h+='<div class="card anim-in" style="text-align:center;padding:24px;">';
    h+='<div style="font-size:40px;">\uD83D\uDCD0</div>';
    h+='<p>'+esc(RT.lang==='hi'?'\u0938\u0942\u0924\u094D\u0930 \u0905\u092C PDF \u0932\u093E\u0907\u092C\u094D\u0930\u0947\u0930\u0940 \u092E\u0947\u0902 \u0939\u0948\u0902':'Formulas are now in the PDF library')+'</p>';
    h+='<button class="btn primary" id="fsGoPdf">'+esc(t('pdf_library'))+'</button></div>';
  }
  $('v-study').innerHTML=h;window.scrollTo(0,0);
  var gp=$('fsGoPdf');if(gp)gp.onclick=function(){RT.stack.push({v:'home'});renderPdfHome();};
}

/* ---------- exam countdown ---------- */
function countdownText(){
  var ts=RXStore.get('examDate');
  if(!ts)return null;
  var now=new Date();now.setHours(0,0,0,0);
  var d=new Date(ts);d.setHours(0,0,0,0);
  var days=Math.round((d-now)/864e5);
  if(days<0)return {txt:t('exam_passed'),cls:'passed'};
  if(days===0)return {txt:t('exam_today'),cls:'today'};
  return {txt:days+' '+t('days_left'),cls:'left'};
}

/* ---------- home ---------- */
function dailyTrick(){
  var pool=[];
  CH.forEach(function(c){(c.tricks||[]).forEach(function(tr,i){pool.push({c:c,tr:tr,i:i});});});
  if(!pool.length)return null;
  var d=new Date();var seed=d.getFullYear()*1000+d.getMonth()*40+d.getDate();
  return pool[seed%pool.length];
}
function stats(){
  var p=RXStore.get('progress')||{},a=RXStore.get('attempts')||{};
  var done=Object.keys(p).filter(function(k){return p[k].done;}).length;
  var n=0,ok=0;Object.keys(a).forEach(function(k){n+=a[k].n;ok+=a[k].ok;});
  return {done:done,n:n,acc:n?Math.round(ok/n*100):0};
}
/* subject card colors + icons (reference style) */
var RX_SUBJ_STYLE={
  maths:{cls:'sc-orange',icon:'📐'},
  reasoning:{cls:'sc-blue',icon:'🧠'},
  science:{cls:'sc-green',icon:'🔬'},
  gk:{cls:'sc-purple',icon:'🌍'},
  ca:{cls:'sc-pink',icon:'📰'}
};
function renderHome(){
  var st=stats(),last=RXStore.get('lastChapter');
  var lastCh=last?chById(last):null;
  var streakN=RXStore.touchStreak();
  var cd=countdownText();
  var h='';
  $('hdrTitle').textContent=RT.lang==='hi'?'RuhXam':'RuhXam';
  /* streak + countdown strip */
  h+='<div class="home-strip">';
  h+='<div class="strip-box">🔥<b>'+streakN+'</b>'+esc(t('streak'))+'</div>';
  h+='<button class="strip-box" id="cdWidget">🎯<b>'+(cd?esc(cd.txt):'--')+'</b>'+esc(t('exam_countdown'))+'</button>';
  h+='<div class="strip-box">📊<b>'+st.done+'/'+CH.length+'</b>'+esc(t('chapters_done'))+'</div>';
  h+='</div>';
  /* search */
  h+='<input id="q" class="search" placeholder="'+esc(t('search_ph'))+'">';
  h+='<div id="searchRes"></div>';
  if(lastCh){h+='<button class="chap-row" data-ch="'+lastCh.id+'"><span class="chap-num cn0">▶</span><span class="t"><b>'+esc(t('continue_learning'))+'</b><span>'+esc(L(lastCh.title))+'</span></span><span class="arr">›</span></button>';}
  /* colorful subject cards (reference style) */
  h+='<div class="home-cards">';
  RX_PARTS.forEach(function(p){
    var n=chByPart(p.id).length;
    var sty=RX_SUBJ_STYLE[p.id]||{cls:'sc-teal',icon:p.icon};
    var title=L(p.tk?{hi:t(p.tk),en:t(p.tk)}:p.tk)||t(p.tk);
    h+='<button class="subj-card '+sty.cls+'" data-part="'+p.id+'">';
    h+='<span class="ic-panel">'+sty.icon+'</span>';
    h+='<span class="tx-panel">'+esc(t(p.tk))+'<br><small style="font-weight:400;font-size:13px;opacity:.9">'+n+' '+esc(t('chapters'))+'</small></span>';
    h+='</button>';
  });
  /* action cards: mock, formula, notes */
  h+='<button class="subj-card sc-red" data-go="mock"><span class="ic-panel">⏱️</span><span class="tx-panel">'+esc(t('tab_mock'))+'</span></button>';
  h+='<button class="subj-card sc-slate" id="formulaBtn"><span class="ic-panel">📋</span><span class="tx-panel">'+esc(t('formula_sheet'))+'</span></button>';
  h+='<button class="subj-card sc-olive" data-go="notes"><span class="ic-panel">📝</span><span class="tx-panel">'+esc(t('tab_notes'))+'</span></button>';
  h+='</div>';
  h+='<p class="muted" style="text-align:center;padding:10px;">RuhXam by Hasnain Khan • '+esc(t('unofficial_note'))+'</p>';
  $('v-home').innerHTML=h;
  wireHome();
}
function wireHome(){
  document.querySelectorAll('#v-home [data-go]').forEach(function(b){b.onclick=function(){goTab(b.getAttribute('data-go'));};});
  document.querySelectorAll('#v-home [data-part]').forEach(function(b){b.onclick=function(){push('study');renderPart(b.getAttribute('data-part'));RT.view='study';};});
  document.querySelectorAll('#v-home [data-ch]').forEach(function(b){b.onclick=function(){openChapter(b.getAttribute('data-ch'));};});
  var fb=$('formulaBtn');if(fb)fb.onclick=function(){renderFormulaSheet();};
  var cdw=$('cdWidget');if(cdw)cdw.onclick=function(){goTab('profile');setTimeout(function(){var el=$('examDateInput');if(el)el.scrollIntoView({behavior:'smooth',block:'center'});},300);};
  var qi=$('q');
  qi.oninput=function(){
    var qv=qi.value.trim().toLowerCase(),box=$('searchRes');
    if(qv.length<2){box.innerHTML='';return;}
    var res=CH.filter(function(c){
      var hay=L(c.title)+' '+L(c.concept);
      if(c.notes){hay+=' '+L(c.notes.intro)+' '+L(c.notes.formulas)+' '+L(c.notes.rules)+' '+L(c.notes.mistakes)+' '+L(c.notes.approach||{hi:'',en:''});}
      (c.tips||[]).forEach(function(tp){hay+=' '+L(tp);});
      (c.tricks||[]).forEach(function(tr){hay+=' '+L(tr.h)+' '+L(tr.b);});
      return hay.toLowerCase().indexOf(qv)>=0;
    }).slice(0,12);
    box.innerHTML=res.length?res.map(function(c){
      return '<button class="chap-row" data-ch="'+c.id+'"><span class="chap-num cn'+(c.num%10)+'">'+c.num+'</span><span class="t"><b>'+esc(L(c.title))+'</b></span><span class="arr">›</span></button>';
    }).join(''):'<p class="muted">'+esc(t('no_results'))+'</p>';
    box.querySelectorAll('[data-ch]').forEach(function(b){b.onclick=function(){openChapter(b.getAttribute('data-ch'));};});
  };
}

/* ---------- study ---------- */
function renderStudy(){
  RT.curPart=null;
  $('hdrTitle').textContent=t('tab_study');
  var prog=RXStore.get('progress')||{};
  var h='<div class="home-cards">';
  RX_PARTS.forEach(function(p){
    var list=chByPart(p.id);
    var done=list.filter(function(c){return prog[c.id]&&prog[c.id].done;}).length;
    var sty=RX_SUBJ_STYLE[p.id]||{cls:'sc-teal',icon:p.icon};
    h+='<button class="subj-card '+sty.cls+'" data-part="'+p.id+'">';
    h+='<span class="ic-panel">'+sty.icon+'</span>';
    h+='<span class="tx-panel">'+esc(t(p.tk))+'<br><small style="font-weight:400;font-size:13px;opacity:.9">'+done+'/'+list.length+' '+esc(t('practiced'))+'</small></span>';
    h+='</button>';
  });
  h+='</div>';
  $('v-study').innerHTML=h;
  document.querySelectorAll('#v-study [data-part]').forEach(function(b){
    b.onclick=function(){RT.stack.push({v:'study'});renderPart(b.getAttribute('data-part'));};
  });
}
function renderPart(pid){
  /* Maths study content = Hasnain's PDF library (his own app content) */
  if(pid==='maths'){renderPdfHome();return;}
  RT.curPart=pid;
  var p=partOf(pid),list=chByPart(pid),prog=RXStore.get('progress')||{};
  $('hdrTitle').textContent=t(p.tk);
  var sub=p.id==='maths'?'Math Shortcut Tricks':p.id==='reasoning'?'Reasoning Tricks':p.id==='science'?'Science Revision':p.id==='gk'?'GK Facts':'Current Affairs';
  var h='<div class="chap-list">';
  list.forEach(function(c,i){
    var dn=prog[c.id]&&prog[c.id].done;
    h+='<button class="chap-row" data-ch="'+c.id+'"><span class="chap-num cn'+(i%10)+'">'+c.num+'</span><span class="t"><b>'+esc(L(c.title))+'</b><span>'+sub+(dn?' ✓':'')+'</span></span><span class="arr">›</span></button>';
  });
  h+='</div><p class="muted">'+esc(t('unofficial_note'))+'</p>';
  $('v-study').innerHTML=h;
  document.querySelectorAll('#v-study [data-ch]').forEach(function(b){b.onclick=function(){openChapter(b.getAttribute('data-ch'));};});
}
function openChapter(id){
  var c=chById(id);
  RT.stack.push(RT.curPart?{v:'part',arg:RT.curPart}:{v:RT.view==='study'?'study':'home'});
  renderChapter(id);
}

/* ---------- PDF library (Hasnain's own maths content) ---------- */
function renderPdfHome(){
  RT.curPart='maths';RT.view='part';
  $('hdrTitle').textContent=t('part_maths');
  var h='<div class="home-cards">';
  window.RX_PDF_CATS.forEach(function(cat){
    var n=window.pdfsByCat(cat.id).length;
    h+='<button class="subj-card '+cat.cls+'" data-pdfcat="'+cat.id+'">';
    h+='<span class="ic-panel">'+cat.icon+'</span>';
    h+='<span class="tx-panel">'+esc(RT.lang==='hi'?cat.hi:cat.en)+'<br><small style="font-weight:400;font-size:13px;opacity:.9">'+n+' '+esc(t('pdf_sets'))+'</small></span>';
    h+='</button>';
  });
  h+='</div><p class="muted" style="text-align:center;padding:8px;">'+esc(t('pdf_howto'))+'</p>';
  h+='<p class="muted" style="text-align:center;">'+esc(t('unofficial_note'))+'</p>';
  $('v-study').innerHTML=h;
  document.querySelectorAll('#v-study [data-pdfcat]').forEach(function(b){
    b.onclick=function(){RT.stack.push({v:'part',arg:'maths'});renderPdfCat(b.getAttribute('data-pdfcat'));};
  });
  window.scrollTo(0,0);
}
function renderPdfCat(catId){
  RT.view='pdfcat';
  var cat=null;
  window.RX_PDF_CATS.forEach(function(c){if(c.id===catId)cat=c;});
  if(!cat){renderPdfHome();return;}
  $('hdrTitle').textContent=RT.lang==='hi'?cat.hi:cat.en;
  var list=window.pdfsByCat(catId);
  var h='<div class="chap-list">';
  list.forEach(function(p,i){
    h+='<button class="chap-row" data-pdf="'+p.id+'"><span class="chap-num cn'+(i%10)+'">'+(i+1)+'</span><span class="t"><b>'+esc(RT.lang==='hi'?p.title.hi:p.title.en)+'</b><span>'+esc(t('pdf_read'))+'</span></span><span class="arr">›</span></button>';
  });
  h+='</div>';
  $('v-study').innerHTML=h;
  document.querySelectorAll('#v-study [data-pdf]').forEach(function(b){
    b.onclick=function(){RT.stack.push({v:'pdfcat',arg:catId});openPdf(b.getAttribute('data-pdf'));};
  });
  window.scrollTo(0,0);
}
/* PDF.js viewer */
var PDFV=null;
function openPdf(pdfId){
  var p=window.pdfById(pdfId);
  if(!p){renderPdfHome();return;}
  RT.view='pdfview';
  document.querySelectorAll('#main .view').forEach(function(s){s.classList.add('hidden');});
  $('v-study').classList.remove('hidden');
  document.querySelectorAll('#tabbar .tab').forEach(function(b){b.classList.toggle('sel',b.getAttribute('data-tab')==='study');});
  $('btnBack').classList.remove('hidden');setAds(true);
  $('hdrTitle').textContent=RT.lang==='hi'?p.title.hi:p.title.en;
  var h='<div class="pdf-viewer">';
  h+='<div class="pdf-bar"><button id="pdfPrev" class="btn secondary">‹</button>';
  h+='<span id="pdfInfo" class="pdf-info">'+esc(t('pdf_loading'))+'</span>';
  h+='<button id="pdfNext" class="btn secondary">›</button></div>';
  h+='<div class="pdf-bar"><button id="pdfZout" class="btn secondary">'+esc(t('pdf_zoom_out'))+'</button>';
  h+='<button id="pdfZin" class="btn secondary">'+esc(t('pdf_zoom_in'))+'</button></div>';
  h+='<div id="pdfErr" class="hidden" style="text-align:center;padding:20px;"><p>'+esc(t('pdf_error'))+'</p><button id="pdfRetry" class="btn primary">🔁</button></div>';
  h+='<div class="pdf-pages" id="pdfPages"></div>';
  h+='</div>';
  $('v-study').innerHTML=h;
  window.scrollTo(0,0);
  PDFV={pdf:p,doc:null,page:1,total:0,scale:1.4,rendering:false};
  if(window.pdfjsLib){
    try{window.pdfjsLib.GlobalWorkerOptions.workerSrc='js/pdfjs/pdf.worker.min.js';}catch(e){}
  }
  loadPdfDoc(false);
  $('pdfPrev').onclick=function(){if(PDFV&&PDFV.page>1){PDFV.page--;renderPdfPage();}};
  $('pdfNext').onclick=function(){if(PDFV&&PDFV.page<PDFV.total){PDFV.page++;renderPdfPage();}};
  $('pdfZin').onclick=function(){if(PDFV){PDFV.scale=Math.min(3,PDFV.scale+0.25);renderPdfPage();}};
  $('pdfZout').onclick=function(){if(PDFV){PDFV.scale=Math.max(0.6,PDFV.scale-0.25);renderPdfPage();}};
  var rt=$('pdfRetry');if(rt)rt.onclick=function(){loadPdfDoc(true);};
}
function loadPdfDoc(useCdn){
  var p=PDFV.pdf;
  var url=useCdn?(window.PDF_CDN+p.cat+'/'+p.file):window.pdfURL(p.cat,p.file);
  if(!window.pdfjsLib){$('pdfErr').classList.remove('hidden');return;}
  $('pdfErr').classList.add('hidden');
  $('pdfInfo').textContent=t('pdf_loading');
  window.pdfjsLib.getDocument({url:url}).promise.then(function(doc){
    PDFV.doc=doc;PDFV.total=doc.numPages;PDFV.page=1;
    renderPdfPage();
  }).catch(function(err){
    if(!useCdn){loadPdfDoc(true);return;} /* local failed → try CDN */
    $('pdfErr').classList.remove('hidden');
    $('pdfInfo').textContent=t('pdf_error');
  });
}
function renderPdfPage(){
  if(!PDFV||!PDFV.doc||PDFV.rendering)return;
  PDFV.rendering=true;
  var box=$('pdfPages');
  box.innerHTML='<canvas id="pdfCanvas"></canvas>';
  var cv=$('pdfCanvas');
  $('pdfInfo').textContent=t('pdf_page')+' '+PDFV.page+' / '+PDFV.total;
  PDFV.doc.getPage(PDFV.page).then(function(page){
    var vp=page.getViewport({scale:PDFV.scale});
    cv.width=vp.width;cv.height=vp.height;
    cv.style.width='100%';cv.style.height='auto';
    page.render({canvasContext:cv.getContext('2d'),viewport:vp}).promise.then(function(){
      PDFV.rendering=false;
    }).catch(function(){PDFV.rendering=false;});
  }).catch(function(){PDFV.rendering=false;});
}

/* ---------- chapter ---------- */

var RX_GRAD={maths:['#6d28d9','#8b5cf6'],reasoning:['#1d65b7','#3184dd'],science:['#059669','#10b981'],gk:['#ea580c','#f59e0b'],ca:['#db2777','#ef4444']};
function ringSVG(pct){
  var r=18,circ=2*Math.PI*r,off=circ*(1-Math.min(100,Math.max(0,pct))/100);
  return '<svg class="pring" viewBox="0 0 44 44"><circle cx="22" cy="22" r="'+r+'" class="pring-bg"/><circle cx="22" cy="22" r="'+r+'" class="pring-fg" stroke-dasharray="'+circ.toFixed(1)+'" stroke-dashoffset="'+off.toFixed(1)+'"/><text x="22" y="26">'+pct+'%</text></svg>';
}
function secDiv(icon,label,cls){return '<div class="sec-div '+cls+'"><span>'+icon+'</span> '+esc(label)+'</div>';}
function ansBox(html){return '<div class="ans-box">✅ '+html+'</div>';}
function marksOf(html){var m=String(html).match(/<mark>(.*?)<\/mark>/g);return m?m.map(function(x){return x.replace(/<\/?mark>/g,'');}):[];}

/* ---------- pixel-match helpers (reference chapter style) ---------- */
function fracify(html){
  return String(html).replace(/(\d{1,3})\/(\d{1,3})/g,function(m,a,b,off,s){
    var lt=s.lastIndexOf('<',off),gt=s.lastIndexOf('>',off);
    if(lt>gt)return m;
    return '<span class="fx"><span class="fn">'+a+'</span><span class="fd">'+b+'</span></span>';
  });
}
function renderTrickyBox(c){
  var items=(c.tricks||[]).concat((c.mnemonics||[]).map(function(mn){return{h:mn.h,b:mn.b,mn:1};}));
  var hasTable=c.trickyBox&&c.trickyBox.rows&&c.trickyBox.rows.length;
  if(!hasTable&&!items.length)return '';
  var h='<div class="tricky-label">Tricky Box</div>';
  if(hasTable){
    var tb=c.trickyBox;
    h+='<table class="tricky-table"><tr>';
    (tb.cols||[]).forEach(function(col){h+='<th>'+esc(L(col))+'</th>';});
    h+='</tr>';
    tb.rows.forEach(function(row){
      h+='<tr>';
      row.forEach(function(cell){h+='<td>'+esc(cell.a)+' <b>'+esc(cell.b)+'</b> <span class="arr">\u2192</span> '+esc(cell.c)+'</td>';});
      h+='</tr>';
    });
    h+='</table>';
  }
  if(items.length){
    h+='<div class="tricky-box">';
    items.forEach(function(tr,i){
      h+='<div class="tk-row"><h4><span class="n">'+(tr.mn?'\uD83E\uDDE0':(i+1))+'</span>'+esc(L(tr.h))+'</h4><div>'+fracify(L(tr.b))+'</div></div>';
    });
    h+='</div>';
  }
  return h;
}

var curCh=null;
function renderChapter(id){
  var c=chById(id);if(!c){goTab('home');return;}
  curCh=c;RT.view='chapter';
  document.querySelectorAll('#main .view').forEach(function(s){s.classList.add('hidden');});
  $('v-study').classList.remove('hidden');
  document.querySelectorAll('#tabbar .tab').forEach(function(b){b.classList.toggle('sel',b.getAttribute('data-tab')==='study');});
  $('btnBack').classList.remove('hidden');setAds(true);
  RXStore.set('lastChapter',id);
  var list=chByPart(c.part);
  var idx=list.indexOf(c);
  var bm=RXStore.get('bookmarks').indexOf(id)>=0;
  /* header like reference: "प्रतिशत (Percentage) 1 / 14" */
  var otherLang=RT.lang==='hi'?(c.title.en||''):(c.title.hi||'');
  $('hdrTitle').textContent=L(c.title)+(otherLang?' ('+otherLang+')':'')+' '+(idx+1)+' / '+list.length;
  var h='<div class="ch-body">';
  /* blue अध्याय box — pixel match */
  h+='<div class="adhyay-box"><span class="inner">'+esc(t('chapter_lbl'))+'— '+c.num+' '+esc(L(c.title))+'</span></div>';
  /* concept in blue box */
  h+='<div class="concept-box">'+fracify(L(c.concept))+dgmFor(c.id)+'</div>';
  /* Tricky Box — pixel match (right after concept, like reference) */
  h+=renderTrickyBox(c);
  /* solved examples — red numbered, tricky solutions (pixel match) */
  (c.examples||[]).forEach(function(ex,i){
    h+='<div class="q-block"><div class="q-no">'+(i+1)+'. '+L(ex.q)+'</div>';
    h+='<div class="q-tricky">tricky</div><div class="q-sol">'+fracify(L(ex.s))+'</div></div>';
  });
  /* 📖 study notes — reference visual language */
  if(c.notes){
    h+='<div class="ref-sec"><div class="ref-sec-h">\uD83D\uDCD6 '+esc(t('study_notes'))+'</div>';
    h+='<div class="notes-intro">'+L(c.notes.intro)+'</div>';
    if(c.notes.formulas)h+='<h4 class="notes-h"><span class="k">\uD83D\uDCD0 '+esc(t('key_formulas'))+'</span></h4><div class="notes-sec">'+L(c.notes.formulas)+'</div>';
    if(c.notes.rules)h+='<h4 class="notes-h"><span class="k">\uD83D\uDCCF '+esc(t('imp_rules'))+'</span></h4><div class="notes-sec">'+L(c.notes.rules)+'</div>';
    if(c.notes.approach)h+='<h4 class="notes-h"><span class="k">\uD83E\uDDED '+esc(t('how_to_solve'))+'</span></h4><div class="notes-sec">'+L(c.notes.approach)+'</div>';
    if(c.notes.mistakes)h+='<h4 class="notes-h"><span class="k">\u26A0\uFE0F '+esc(t('common_mistakes'))+'</span></h4><div class="notes-sec">'+L(c.notes.mistakes)+'</div>';
    h+='</div>';
  }
  /* 💡 expert tips — reference visual language */
  if(c.tips&&c.tips.length){
    h+='<div class="ref-sec"><div class="ref-sec-h">\uD83D\uDCA1 '+esc(t('expert_tips'))+'</div>';
    c.tips.forEach(function(tp,i){
      h+='<div class="tip-row"><span class="tip-n">'+(i+1)+'</span><div>'+L(tp)+'</div></div>';
    });
    h+='</div>';
  }
  /* difficulty filter */
  h+='<div class="diff-row"><span class="diff-lbl">'+esc(t('diff_label'))+':</span>';
  h+='<button class="diff-btn sel" data-d="0">'+esc(t('diff_all'))+'</button>';
  h+='<button class="diff-btn" data-d="1">'+esc(t('diff_easy'))+'</button>';
  h+='<button class="diff-btn" data-d="2">'+esc(t('diff_medium'))+'</button>';
  h+='<button class="diff-btn" data-d="3">'+esc(t('diff_hard'))+'</button>';
  h+='<button class="diff-btn" data-p="1" id="pyqBtn">'+esc(t('pyq_only'))+'</button></div>';
  h+='<div class="ch-cta" style="display:flex;gap:10px;">';
  h+='<button id="bmBtn" class="btn secondary" style="flex:0 0 auto;">'+(bm?'\uD83D\uDD16':'\uD83D\uDCC4')+'</button>';
  h+='<button id="pracBtn" class="btn primary big-cta" style="flex:1;">'+esc(t('practice_btn'))+' (<span id="pracCount">'+(c.quiz||[]).length+'</span>)</button>';
  h+='</div>';
  h+='<p class="muted">'+esc(t('unofficial_note'))+'</p>';
  h+='</div>';
  $('v-study').innerHTML=h;window.scrollTo(0,0);
  $('bmBtn').onclick=function(){var on=RXStore.toggleBookmark(id);$('bmBtn').innerHTML=on?'🔖':'📑';toast(t(on?'bookmarked':'bookmark_removed'));};
  var curDiff=0, pyqOnly=false;
  function isPYQq(q){var s=L(q.src||{hi:'',en:''});return /RRB|SSC|IBPS/.test(s)&&!/Practice|अभ्यास|Expected/.test(s);}
  function diffCount(d){var arr=(c.quiz||[]);if(d)arr=arr.filter(function(q){return (q.d||2)===d;});if(pyqOnly)arr=arr.filter(isPYQq);return arr.length;}
  document.querySelectorAll('.diff-btn').forEach(function(b){
    b.onclick=function(){
      if(b.getAttribute('data-p')){
        pyqOnly=!pyqOnly;b.classList.toggle('sel',pyqOnly);
      }else{
        document.querySelectorAll('.diff-btn[data-d]').forEach(function(x){x.classList.remove('sel');});
        b.classList.add('sel');curDiff=parseInt(b.getAttribute('data-d'),10);
      }
      $('pracCount').textContent=diffCount(curDiff);
    };
  });
  $('pracBtn').onclick=function(){startPractice(id,curDiff,pyqOnly);};
}
/* ---------- TTS (device, offline) ---------- */
function speak(text){
  try{
    if(!('speechSynthesis' in window)){toast(t('tts_na'));return;}
    speechSynthesis.cancel();
    var u=new SpeechSynthesisUtterance(text.replace(/<[^>]*>/g,''));
    u.lang=RT.lang==='hi'?'hi-IN':'en-IN';u.rate=0.95;
    speechSynthesis.speak(u);
  }catch(e){toast(t('tts_na'));}
}

/* ---------- practice hub ---------- */
function renderPractice(){
  $('hdrTitle').textContent=t('practice');
  var h='<h2 class="sec">'+esc(t('practice'))+'</h2>';
  h+='<p class="muted">⚠️ '+esc(t('unofficial_note'))+'</p>';
  h+='<button class="btn primary block" id="dailyPrac">'+esc(t('daily_practice'))+'</button>';
  h+='<h2 class="sec">'+esc(t('by_chapter'))+'</h2>';
  h+='<input id="pq" class="search" placeholder="'+esc(t('search_ph'))+'">';
  h+='<div id="pList"></div>';
  $('v-practice').innerHTML=h;
  var draw=function(qv){
    qv=(qv||'').toLowerCase();
    $('pList').innerHTML=CH.filter(function(c){
      return !qv||L(c.title).toLowerCase().indexOf(qv)>=0;
    }).map(function(c){
      var p=partOf(c.part);
      return '<button class="ch-row" data-ch="'+c.id+'"><span class="ch-num">'+p.icon+'</span><span class="t">'+c.num+'. '+esc(L(c.title))+'</span><span>›</span></button>';
    }).join('');
    document.querySelectorAll('#pList [data-ch]').forEach(function(b){b.onclick=function(){startPractice(b.getAttribute('data-ch'));};});
  };
  draw('');
  $('pq').oninput=function(){draw($('pq').value);};
  $('dailyPrac').onclick=function(){
    var pool=[];CH.forEach(function(c){(c.quiz||[]).forEach(function(q,i){pool.push({ch:c.id,qi:i});});});
    startPracticeSet(shuffle(pool).slice(0,5),t('daily_practice'),null);
  };
}

/* ---------- quiz engine (practice: instant feedback) ---------- */
var QZ=null;
function startPractice(chId,diff,pyqOnly){
  var c=chById(chId);if(!c)return;
  var set=(c.quiz||[]).map(function(q,i){return {ch:chId,qi:i};});
  if(diff) set=set.filter(function(ref){return (qObj(ref).d||2)===diff;});
  if(pyqOnly) set=set.filter(function(ref){var s=L(qObj(ref).src||{hi:'',en:''});return /RRB|SSC|IBPS/.test(s)&&!/Practice|अभ्यास|Expected/.test(s);});
  if(!set.length){toast(t('diff_all'));return;}
  startPracticeSet(set,L(c.title),chId);
}
function startPracticeSet(set,title,chId){
  QZ={set:set,title:title,chId:chId||null,i:0,ok:0,answered:{},review:[]};
  RT.view='quiz';
  document.querySelectorAll('#main .view').forEach(function(s){s.classList.add('hidden');});
  $('v-quiz').classList.remove('hidden');
  document.querySelectorAll('#tabbar .tab').forEach(function(b){b.classList.toggle('sel',b.getAttribute('data-tab')==='practice');});
  $('btnBack').classList.remove('hidden');setAds(false);
  renderQ();
}
function qObj(ref){var c=chById(ref.ch);return c.quiz[ref.qi];}
function srcBadge(q){
  if(!q.src)return '';
  var s=L(q.src);
  var is2026=/2026/.test(s);
  var isPYQ=/RRB|SSC|IBPS/.test(s)&&!/Practice|अभ्यास|Expected/.test(s);
  var bg=is2026?'#e91e63':isPYQ?'#1b8aae':'#9e9e9e';
  return '<span class="pill" style="background:'+bg+';color:#fff;margin-left:6px;">📅 '+esc(s)+'</span>';
}
function diffPill(q){
  var d=q.d||2;
  var lbl=d===1?t('diff_easy'):d===3?t('diff_hard'):t('diff_medium');
  return '<span class="diff-pill d'+d+'">'+esc(lbl)+'</span>';
}
function renderQ(){
  $('hdrTitle').textContent=QZ.title;
  var ref=QZ.set[QZ.i],q=qObj(ref),c=chById(ref.ch);
  var h='<p class="qnum">'+esc(t('q_no'))+' '+(QZ.i+1)+' '+esc(t('of'))+' '+QZ.set.length+srcBadge(q)+diffPill(q)+'</p>';
  h+='<p class="muted">'+esc(L(c.title))+'</p>';
  h+=qdgmFor(ref.ch,ref.qi);
  h+='<div class="card"><h3>'+L(q.q)+'</h3><div id="opts">';
  q.o.forEach(function(o,i){
    h+='<button class="opt" data-i="'+i+'"><span class="opt-letter">'+'ABCD'[i]+'</span>'+esc(L(o))+'</button>';
  });
  h+='</div><div id="fb"></div></div>';
  h+='<div class="row spread"><button id="qPrev" class="btn secondary">‹ '+esc(t('prev'))+'</button><button id="qNext" class="btn primary">'+esc(QZ.i===QZ.set.length-1?t('finish'):t('next'))+' ›</button></div>';
  $('v-quiz').innerHTML=h;window.scrollTo(0,0);
  var done=QZ.answered[QZ.i]!==undefined;
  if(done)revealQ(QZ.answered[QZ.i]);
  document.querySelectorAll('#v-quiz .opt').forEach(function(b){
    b.onclick=function(){
      if(QZ.answered[QZ.i]!==undefined)return;
      var sel=+b.getAttribute('data-i');
      QZ.answered[QZ.i]=sel;
      if(sel===q.a){QZ.ok++;vibrate(30);}else vibrate(120);
      QZ.review.push({ref:ref,sel:sel,ok:sel===q.a});
      revealQ(sel);
    };
  });
  $('qPrev').onclick=function(){if(QZ.i>0){QZ.i--;renderQ();}};
  $('qNext').onclick=function(){
    if(QZ.i<QZ.set.length-1){QZ.i++;renderQ();}
    else finishPractice();
  };
}
function revealQ(sel){
  var ref=QZ.set[QZ.i],q=qObj(ref);
  document.querySelectorAll('#v-quiz .opt').forEach(function(b){
    var i=+b.getAttribute('data-i');b.disabled=true;
    if(i===q.a)b.classList.add('right','glow-green');
    else if(i===sel)b.classList.add('wrong','shake-red');
  });
  $('fb').innerHTML='<details class="exp-card" open><summary>&#128161; '+esc(t('explanation'))+'</summary><div>'+L(q.e)+'</div></details>';
}
function finishPractice(){
  var total=QZ.set.length,pct=Math.round(QZ.ok/total*100);
  if(QZ.chId){RXStore.markDone(QZ.chId,pct);RXStore.recordAttempt(QZ.chId,QZ.ok,total);}
  var h='<div class="card"><div class="score-big">'+pct+'%</div>';
  h+='<p style="text-align:center">'+esc(pct>=80?t('excellent'):pct>=50?t('good'):t('keep_going'))+'</p>';
  h+='<div class="stat-grid"><div class="stat"><b>'+QZ.ok+'</b>'+esc(t('correct'))+'</div><div class="stat"><b>'+(total-QZ.ok)+'</b>'+esc(t('wrong'))+'</div></div>';
  h+='<h3>'+esc(t('review'))+'</h3>';
  QZ.review.forEach(function(r,i){
    var q=qObj(r.ref),c=chById(r.ref.ch);
    h+='<div class="card"><b>'+esc(t('q_no'))+' '+(i+1)+'</b> '+(r.ok?'✅':'❌')+'<div>'+L(q.q)+'</div>';
    h+='<div class="muted">'+esc(t('correct'))+': '+esc(L(q.o[q.a]))+'</div>';
    h+='<div class="exp"><b>'+esc(t('explanation'))+'</b> '+L(q.e)+'</div></div>';
  });
  h+='<button class="btn primary block" id="reBtn">'+esc(t('retry'))+'</button>';
  h+='<button class="btn secondary block" id="bkBtn">'+esc(t('back_home'))+'</button></div>';
  $('v-quiz').innerHTML=h;window.scrollTo(0,0);
  if(pct===100&&total>0)confetti();
  $('reBtn').onclick=function(){startPracticeSet(QZ.set,QZ.title,QZ.chId);};
  $('bkBtn').onclick=function(){goTab('practice');};
}

/* ---------- confetti ---------- */
function confetti(){
  try{
    var cv=document.createElement('canvas');cv.className='confetti-cv';
    document.body.appendChild(cv);
    var ctx=cv.getContext('2d');cv.width=innerWidth;cv.height=innerHeight;
    var cols=['#ef4444','#f59e0b','#10b981','#3b82f6','#8b5cf6','#ec4899'];
    var ps=[];for(var i=0;i<120;i++)ps.push({x:Math.random()*cv.width,y:-20-Math.random()*cv.height*0.3,w:6+Math.random()*6,h:8+Math.random()*8,c:cols[i%6],vy:2+Math.random()*3,vx:-1.5+Math.random()*3,r:Math.random()*6.28,vr:-0.1+Math.random()*0.2});
    var t0=Date.now();
    (function tick(){
      ctx.clearRect(0,0,cv.width,cv.height);
      ps.forEach(function(p){p.x+=p.vx;p.y+=p.vy;p.r+=p.vr;ctx.save();ctx.translate(p.x,p.y);ctx.rotate(p.r);ctx.fillStyle=p.c;ctx.fillRect(-p.w/2,-p.h/2,p.w,p.h);ctx.restore();});
      if(Date.now()-t0<2600)requestAnimationFrame(tick);else cv.remove();
    })();
  }catch(e){}
}

/* ---------- mock test ---------- */
var MK=null;
function negVal(){var v=RXStore.get('negMark');return v===undefined?1/3:parseFloat(v);}
function mockPool(examId){
  var mq=chByPart('maths'),rq=chByPart('reasoning'),sq=chByPart('science'),
      gq=chByPart('gk'),cq=chByPart('ca');
  function pool(chs){var p=[];chs.forEach(function(c){(c.quiz||[]).forEach(function(q,i){p.push({ch:c.id,qi:i});});});return shuffle(p);}
  function balancedPool(chs,n){
    var all=pool(chs);
    var e1=all.filter(function(r){return (qObj(r).d||2)===1;});
    var e2=all.filter(function(r){return (qObj(r).d||2)===2;});
    var e3=all.filter(function(r){return (qObj(r).d||2)===3;});
    var n1=Math.round(n*0.4),n3=Math.round(n*0.2),n2=n-n1-n3;
    var out=e1.slice(0,n1).concat(e2.slice(0,n2),e3.slice(0,n3));
    if(out.length<n){var rest=all.filter(function(r){return out.indexOf(r)<0;});out=out.concat(rest.slice(0,n-out.length));}
    return shuffle(out);
  }
  var e=RT_EXAMS[examId],mp=balancedPool(mq,e.maths),rp=balancedPool(rq,e.reas),sp=[],gp=[];
  if(examId==='groupd'&&e.science)sp=balancedPool(sq,e.science);
  if(e.gk)gp=balancedPool(gq.concat(cq),e.gk);
  return mp.concat(rp,sp,gp);
}
function renderMockSetup(){
  $('hdrTitle').textContent=t('mock_title');
  var e=RT_EXAMS[RT.examId];
  var h='<h2 class="sec">'+esc(t('mock_title'))+'</h2>';
  h+='<p class="muted">⚠️ '+esc(t('unofficial_note'))+'</p>';
  h+='<div class="card"><h3>'+esc(L(e.name))+'</h3>';
  h+='<table class="tbl"><tr><th>'+esc(t('sections'))+'</th><th>'+esc(t('questions'))+'</th></tr>';
  h+='<tr><td>'+esc(t('part_maths'))+'</td><td>'+e.maths+'</td></tr>';
  h+='<tr><td>'+esc(t('part_reas'))+'</td><td>'+e.reas+'</td></tr>';
  if(e.science)h+='<tr><td>'+esc(t('part_science'))+'</td><td>'+e.science+'</td></tr>';
  if(e.gk)h+='<tr><td>'+esc(t('part_gk'))+' + '+esc(t('part_ca'))+'</td><td>'+e.gk+'</td></tr>';
  h+='</table><p class="muted">'+esc(L(e.pattern))+' • '+esc(t('time_limit'))+': '+e.timeMin+' '+esc(t('min'))+' • '+esc(t('neg_mark'))+': -'+negVal()+'</p>';
  h+='<p class="muted">'+esc(t('ga_note'))+'</p></div>';
  h+='<button class="btn primary block" id="mkStart">'+esc(t('start_mock'))+'</button>';
  $('v-mock').innerHTML=h;
  $('mkStart').onclick=function(){
    var set=mockPool(RT.examId);
    if(set.length<10){toast(t('no_results'));return;}
    confirmDlg(t('start_mock')+'? ('+set.length+' '+t('questions')+', '+e.timeMin+' '+t('min')+')',function(ok){
      if(ok)startMock(set,e);
    });
  };
}
function startMock(set,e){
  MK={set:set,exam:e,i:0,ans:{},mark:{},sec:e.timeMin*60,timer:null,neg:negVal(),start:Date.now()};
  RT.view='mockrun';
  document.querySelectorAll('#main .view').forEach(function(s){s.classList.add('hidden');});
  $('v-mock').classList.remove('hidden');
  $('btnBack').classList.add('hidden');setAds(false);
  renderMockQ();
  MK.timer=setInterval(function(){
    MK.sec--;
    var el=$('mkTimer');
    if(el){var mm=Math.floor(MK.sec/60),ss=MK.sec%60;
      el.textContent=(mm<10?'0':'')+mm+':'+(ss<10?'0':'')+ss;
      el.classList.toggle('danger',MK.sec<300);}
    if(MK.sec<=0){clearInterval(MK.timer);toast(t('time_up'));finishMock();}
  },1000);
}
function renderMockQ(){
  $('hdrTitle').textContent=L(MK.exam.name);
  var ref=MK.set[MK.i],q=qObj(ref),c=chById(ref.ch);
  var h='<div class="row spread"><span class="timer" id="mkTimer"></span><button class="btn secondary" id="mkPal">☰</button></div>';
  h+='<p class="qnum">'+esc(t('q_no'))+' '+(MK.i+1)+' '+esc(t('of'))+' '+MK.set.length+srcBadge(q)+'</p>';
  h+='<p class="muted">'+esc(L(c.title))+'</p>'+qdgmFor(ref.ch,ref.qi);
  h+='<div class="card"><h3>'+L(q.q)+'</h3><div>';
  q.o.forEach(function(o,i){
    h+='<button class="opt'+(MK.ans[MK.i]===i?' sel':'')+'" data-i="'+i+'"><span class="opt-letter">'+'ABCD'[i]+'</span>'+esc(L(o))+'</button>';
  });
  h+='</div></div><div id="palBox" class="hidden"></div>';
  h+='<div class="row spread"><button id="mPrev" class="btn secondary">‹ '+esc(t('prev'))+'</button>';
  h+='<button id="mMark" class="btn secondary">🚩 '+esc(t('marked'))+'</button>';
  h+='<button id="mNext" class="btn primary">'+esc(MK.i===MK.set.length-1?t('finish'):t('next'))+' ›</button></div>';
  $('v-mock').innerHTML=h;window.scrollTo(0,0);
  document.querySelectorAll('#v-mock .opt').forEach(function(b){
    b.onclick=function(){MK.ans[MK.i]=+b.getAttribute('data-i');
      document.querySelectorAll('#v-mock .opt').forEach(function(x){x.classList.remove('sel');});
      b.classList.add('sel');};
  });
  $('mPrev').onclick=function(){if(MK.i>0){MK.i--;renderMockQ();}};
  $('mMark').onclick=function(){MK.mark[MK.i]=!MK.mark[MK.i];toast(MK.mark[MK.i]?t('marked'):t('clear'));};
  $('mNext').onclick=function(){
    if(MK.i<MK.set.length-1){MK.i++;renderMockQ();}
    else confirmDlg(t('confirm_finish'),function(ok){if(ok)finishMock();});
  };
  $('mkPal').onclick=function(){
    var box=$('palBox');box.classList.toggle('hidden');
    if(box.classList.contains('hidden'))return;
    var ph='<div class="palette">';
    MK.set.forEach(function(r,i){
      var cls=MK.ans[i]!==undefined?'ans':(MK.mark[i]?'mark':'');
      ph+='<button class="pal '+cls+(i===MK.i?' cur':'')+'" data-j="'+i+'">'+(i+1)+'</button>';
    });
    box.innerHTML=ph+'</div>';
    box.querySelectorAll('.pal').forEach(function(b){b.onclick=function(){MK.i=+b.getAttribute('data-j');renderMockQ();};});
  };
  // restore timer display
  var mm=Math.floor(MK.sec/60),ss=MK.sec%60;
  $('mkTimer').textContent=(mm<10?'0':'')+mm+':'+(ss<10?'0':'')+ss;
}
function finishMock(){
  if(MK.timer)clearInterval(MK.timer);
  var ok=0,wrong=0,skip=0;
  MK.set.forEach(function(ref,i){
    var q=qObj(ref);
    if(MK.ans[i]===undefined)skip++;
    else if(MK.ans[i]===q.a)ok++;
    else wrong++;
  });
  var score=ok-wrong*MK.neg;
  var mins=Math.round((Date.now()-MK.start)/60000);
  RXStore.addMock({exam:MK.exam.id,total:MK.set.length,correct:ok,wrong:wrong,skip:skip,score:Math.round(score*100)/100,date:Date.now()});
  var h='<div class="card"><div class="score-big">'+ (Math.round(score*100)/100) +'</div>';
  h+='<p style="text-align:center">'+esc(ok>=MK.set.length*0.8?t('excellent'):ok>=MK.set.length*0.5?t('good'):t('keep_going'))+'</p>';
  h+='<div class="stat-grid"><div class="stat"><b>'+ok+'</b>'+esc(t('correct'))+'</div><div class="stat"><b>'+wrong+'</b>'+esc(t('wrong'))+'</div>';
  h+='<div class="stat"><b>'+skip+'</b>'+esc(t('skipped'))+'</div><div class="stat"><b>'+mins+'</b>'+esc(t('min'))+' • '+esc(t('time_used'))+'</div></div>';
  h+='<h3>'+esc(t('review'))+'</h3>';
  MK.set.forEach(function(ref,i){
    var q=qObj(ref),sel=MK.ans[i];
    h+='<div class="card"><b>'+esc(t('q_no'))+' '+(i+1)+'</b> '+(sel===undefined?'⚪':sel===q.a?'✅':'❌');
    h+='<div>'+L(q.q)+'</div>';
    if(sel!==undefined&&sel!==q.a)h+='<div class="muted">'+esc(t('your_answer'))+': '+esc(L(q.o[sel]))+'</div>';
    h+='<div class="muted">'+esc(t('correct'))+': '+esc(L(q.o[q.a]))+'</div>';
    h+='<div class="exp"><b>'+esc(t('explanation'))+'</b> '+L(q.e)+'</div></div>';
  });
  h+='<button class="btn primary block" id="mkAgain">'+esc(t('retry'))+'</button>';
  h+='<button class="btn secondary block" id="mkHome">'+esc(t('back_home'))+'</button></div>';
  $('v-mock').innerHTML=h;window.scrollTo(0,0);setAds(true);
  $('mkAgain').onclick=function(){goTab('mock');};
  $('mkHome').onclick=function(){goTab('home');};
  MK=null;
}

/* ---------- notes ---------- */
var editId=null,saveTimer=null;
function renderNotes(){
  $('hdrTitle').textContent=t('notes');
  var h='<h2 class="sec">'+esc(t('notes'))+'</h2>';
  h+='<div class="row"><input id="nq" class="search" style="flex:1" placeholder="'+esc(t('search_ph'))+'">';
  h+='<button id="favF" class="btn secondary">⭐</button></div>';
  h+='<button class="btn primary block" id="newNote">＋ '+esc(t('new_note'))+'</button>';
  h+='<div id="nList"></div>';
  h+='<h2 class="sec">'+esc(t('pdf_resources'))+'</h2><div id="pdfList"></div>';
  $('v-notes').innerHTML=h;
  var favOnly=false;
  var draw=function(){
    var qv=$('nq').value.toLowerCase();
    var list=RXStore.get('notes').filter(function(n){
      return (!favOnly||n.fav)&&(!qv||(n.title+' '+n.body).toLowerCase().indexOf(qv)>=0);
    });
    $('nList').innerHTML=list.length?list.map(function(n){
      return '<div class="ch-row" data-n="'+n.id+'"><span class="ch-num">📝</span><span class="t">'+esc(n.title||t('untitled'))+(n.fav?' ⭐':'')+'<br><span class="muted">'+esc(n.body.slice(0,60))+'</span></span><span>›</span></div>';
    }).join(''):'<p class="muted">'+esc(t('no_notes'))+'</p>';
    document.querySelectorAll('#nList [data-n]').forEach(function(b){b.onclick=function(){openNote(b.getAttribute('data-n'));};});
  };
  draw();
  $('nq').oninput=draw;
  $('favF').onclick=function(){favOnly=!favOnly;$('favF').classList.toggle('primary',favOnly);draw();};
  $('newNote').onclick=function(){var n=RXStore.addNote('','');openNote(n.id);};
  renderPdfs();
}
var PDFS=[
  {ti:{hi:'RRB NTPC पाठ्यक्रम (Syllabus)',en:'RRB NTPC Syllabus'},url:'https://www.sarkaridisha.com/wp-content/uploads/Railway-RRB-NTPC-102-Exam-Syllabus-English.pdf',cat:{hi:'परीक्षा',en:'Exam'},pdf:1},
  {ti:{hi:'RRB NTPC 2026 गाइड',en:'RRB NTPC 2026 Guide'},url:'https://images.shiksha.com/mediadata/examGuides/examSectionGuide1715_Overview_2026-09-10-03-19.pdf',cat:{hi:'परीक्षा',en:'Exam'},pdf:1},
  {ti:{hi:'RRB Group D 2026 गाइड',en:'RRB Group D 2026 Guide'},url:'https://images.shiksha.com/mediadata/examGuides/examSectionGuide1653_Overview_2026-09-24-03-24.pdf',cat:{hi:'परीक्षा',en:'Exam'},pdf:1},
  {ti:{hi:'NCERT विज्ञान कक्षा 10',en:'NCERT Science Class 10'},url:'https://ncert.nic.in/textbook/pdf/jhsc1ps.pdf',cat:{hi:'अध्ययन',en:'Study'},pdf:1},
  {ti:{hi:'RRB आधिकारिक वेबसाइट',en:'RRB Official Website'},url:'https://www.rrbcdg.gov.in',cat:{hi:'आधिकारिक',en:'Official'}},
  {ti:{hi:'रोज़गार समाचार',en:'Employment News'},url:'https://www.employmentnews.gov.in',cat:{hi:'आधिकारिक',en:'Official'}}
];
function renderPdfs(){
  $('pdfList').innerHTML='<p class="muted" style="margin:4px 4px 8px;">'+esc(t('pdf_howto'))+'</p>'+PDFS.map(function(p){
    var badge=p.pdf?'📕':'🔗';
    var lbl=p.pdf?t('download_pdf'):t('open_link');
    return '<div class="ch-row"><span class="ch-num">'+badge+'</span><span class="t">'+esc(L(p.ti))+'<br><span class="muted">'+esc(L(p.cat))+' • '+esc(t('verified_link'))+'</span></span><a class="btn '+(p.pdf?'primary':'secondary')+'" href="'+p.url+'" target="_blank" rel="noopener"'+(p.pdf?' download':'')+'>'+esc(lbl)+'</a></div>';
  }).join('')+'<p class="muted">'+esc(t('pdf_note'))+'</p>';
}
function openNote(id){
  if(RT.view!=='noteedit')RT.stack.push({v:'notes'});
  editId=id;RT.view='noteedit';
  document.querySelectorAll('#main .view').forEach(function(s){s.classList.add('hidden');});
  $('v-noteedit').classList.remove('hidden');
  $('btnBack').classList.remove('hidden');setAds(false);
  var n=RXStore.get('notes').find(function(x){return x.id===id;})||{title:'',body:'',fav:false};
  var h='<div class="row spread"><h2 class="sec" style="margin:6px 0">'+esc(t('edit_note'))+'</h2>';
  h+='<div><button id="ntFav" class="bm-btn">'+(n.fav?'⭐':'☆')+'</button> <button id="ntPrint" class="bm-btn" title="PDF">🖨️</button> <button id="ntDel" class="bm-btn" title="✕">🗑️</button></div></div>';
  h+='<input id="ntTitle" class="search" placeholder="'+esc(t('note_title'))+'" value="'+esc(n.title)+'">';
  h+='<textarea id="ntBody" class="search" rows="14" placeholder="'+esc(t('note_body'))+'">'+esc(n.body)+'</textarea>';
  h+='<p class="muted" id="ntSaved"></p>';
  $('v-noteedit').innerHTML=h;
  var save=function(){
    RXStore.updateNote(editId,$('ntTitle').value,$('ntBody').value);
    $('ntSaved').textContent='✓ '+new Date().toLocaleTimeString();
  };
  var deb=function(){clearTimeout(saveTimer);saveTimer=setTimeout(save,800);};
  $('ntTitle').oninput=deb;$('ntBody').oninput=deb;
  $('ntFav').onclick=function(){var f=RXStore.toggleFav(editId);$('ntFav').textContent=f?'⭐':'☆';};
  $('ntDel').onclick=function(){confirmDlg(t('delete_note')+'?',function(ok){if(ok){RXStore.deleteNote(editId);goTab('notes');}});};
  $('ntPrint').onclick=function(){
    save();
    var nn=RXStore.get('notes').find(function(x){return x.id===editId;});
    var pa=$('printArea');if(!pa){pa=document.createElement('div');pa.id='printArea';document.body.appendChild(pa);}
    pa.innerHTML='<h1>'+esc(nn.title||t('untitled'))+'</h1><p>'+esc(nn.body).replace(/\n/g,'<br>')+'</p><p class="muted">RuhXam by Hasnain Khan</p>';
    document.body.classList.add('printing');
    try{
      if(window.Android&&Android.printPage){Android.printPage('RuhXam-'+(nn.title||'note'));}
      else window.print();
    }catch(e){try{window.print();}catch(e2){}}
    setTimeout(function(){document.body.classList.remove('printing');},1000);
  };
}

/* ---------- progress ---------- */
function renderProgress(){
  $('hdrTitle').textContent=t('my_progress');
  var st=stats(),prog=RXStore.get('progress')||{},att=RXStore.get('attempts')||{};
  var h='<h2 class="sec">'+esc(t('my_progress'))+'</h2>';
  h+='<section class="stats-grid"><article class="stat-card"><span>'+esc(t('chapters_done'))+'</span><strong>'+st.done+'/'+CH.length+'</strong></article>';
  h+='<article class="stat-card"><span>'+esc(t('questions_done'))+'</span><strong>'+st.n+'</strong></article>';
  h+='<article class="stat-card"><span>'+esc(t('accuracy'))+'</span><strong>'+st.acc+'%</strong></article></section>';
  h+='<h2 class="sec">'+esc(t('weak_topics'))+'</h2>';
  var weak=CH.filter(function(c){var a=att[c.id];return a&&a.n>=5&&a.ok/a.n<0.5;}).slice(0,10);
  h+=weak.length?weak.map(function(c){var a=att[c.id];return '<div class="ch-row" data-ch="'+c.id+'"><span class="ch-num">⚠️</span><span class="t">'+esc(L(c.title))+'<br><span class="muted">'+Math.round(a.ok/a.n*100)+'% '+esc(t('accuracy'))+'</span></span><span>›</span></div>';}).join(''):'<p class="muted">'+esc(t('no_weak'))+'</p>';
  h+='<h2 class="sec">'+esc(t('mock_history'))+'</h2>';
  var mh=RXStore.get('mockHistory');
  h+=mh.length?mh.map(function(m){
    return '<div class="card"><b>'+esc(L(RT_EXAMS[m.exam].name))+'</b> — '+esc(t('score'))+': '+m.score+'<br><span class="muted">'+m.correct+'✓ '+m.wrong+'✗ • '+new Date(m.date).toLocaleDateString()+'</span></div>';
  }).join(''):'<p class="muted">'+esc(t('no_mocks'))+'</p>';
  $('v-progress').innerHTML=h;
  document.querySelectorAll('#v-progress [data-ch]').forEach(function(b){b.onclick=function(){openChapter(b.getAttribute('data-ch'));};});
}

/* ---------- profile / settings ---------- */
function renderProfile(){
  $('hdrTitle').textContent=t('profile');
  var h='<h2 class="sec">'+esc(t('profile'))+'</h2>';
  h+='<div class="card"><h3>'+esc(t('save_lang'))+'</h3><div class="row"><button class="btn '+(RT.lang==='hi'?'primary':'secondary')+'" data-lang="hi">हिंदी</button><button class="btn '+(RT.lang==='en'?'primary':'secondary')+'" data-lang="en">English</button></div></div>';
  h+='<div class="card"><h3>🚂 '+esc(t('exam_target'))+'</h3><div class="row">';
  Object.keys(RT_EXAMS).forEach(function(id){var e=RT_EXAMS[id];
    h+='<button class="exam-opt'+(RT.examId===id?' sel':'')+'" data-exam="'+id+'"><b>'+esc(L(e.name))+'</b><div class="p">'+esc(L(e.pattern))+'</div></button>';});
  h+='</div></div>';
  h+='<div class="card"><h3>🎯 '+esc(t('exam_countdown'))+'</h3><p class="muted">'+esc(t('set_exam_date'))+'</p>';
  var edv=RXStore.get('examDate');
  var edstr=edv?new Date(edv).toISOString().slice(0,10):'';
  h+='<input id="examDateInput" type="date" class="search" value="'+edstr+'">';
  var cdt=countdownText();
  if(cdt)h+='<p><b>'+esc(cdt.txt)+'</b></p>';
  h+='</div>';
  h+='<div class="card"><h3>'+esc(t('theme'))+'</h3><div class="row"><button class="btn '+(RT.theme==='light'?'primary':'secondary')+'" data-theme="light">☀️</button><button class="btn '+(RT.theme==='dark'?'primary':'secondary')+'" data-theme="dark">🌙</button></div></div>';
  h+='<div class="card"><h3>'+esc(t('neg_mark'))+'</h3><div class="row">';
  [['0','0'],['0.25','-1/4'],['0.3333333333333333','-1/3'],['0.5','-1/2']].forEach(function(o){
    h+='<button class="btn '+(String(negVal())===o[0]?'primary':'secondary')+'" data-neg="'+o[0]+'">'+o[1]+'</button>';});
  h+='</div></div>';
  h+='<div class="card"><h3>🔄 '+esc(t('content_update'))+'</h3><p class="muted">'+esc(t('content_version'))+': v'+RXStore.get('contentVer')+'</p><button class="btn secondary block" id="cdnBtn">'+esc(t('check_updates'))+'</button></div>';
  h+='<div class="card"><h3>🔑 HF Token</h3><p class="muted">'+esc(t('hf_note'))+'</p><input id="hfTok" class="search" type="password" placeholder="hf_..." value="'+esc(RXStore.get('hfToken'))+'"><button class="btn secondary" id="hfSave">'+esc(t('save'))+'</button></div>';
  h+='<div class="card"><h3>⚠️ '+esc(t('danger_zone'))+'</h3><button class="btn warn block" id="clearBtn">'+esc(t('clear_data'))+'</button></div>';
  h+='<div class="card about-card"><img class="about-logo" src="img/logo-small.png" alt="RuhXam"><h3>'+esc(t('about'))+'</h3><p class="muted">RuhXam by Hasnain Khan • v1.0<br>'+esc(t('unofficial_note'))+'<br>'+esc(t('about_text'))+'</p></div>';
  h+='<footer class="app-foot"><span>RuhXam by Hasnain Khan</span><span>'+esc(t('unofficial_note'))+'</span></footer>';
  $('v-profile').innerHTML=h;
  document.querySelectorAll('#v-profile [data-lang]').forEach(function(b){b.onclick=function(){setLang(b.getAttribute('data-lang'));};});
  document.querySelectorAll('#v-profile [data-exam]').forEach(function(b){b.onclick=function(){RT.examId=b.getAttribute('data-exam');RXStore.set('examId',RT.examId);updExamChip();renderProfile();toast('🚂 '+L(RT_EXAMS[RT.examId].name));};});
  document.querySelectorAll('#v-profile [data-theme]').forEach(function(b){b.onclick=function(){setTheme(b.getAttribute('data-theme'));renderProfile();};});
  document.querySelectorAll('#v-profile [data-neg]').forEach(function(b){b.onclick=function(){RXStore.set('negMark',b.getAttribute('data-neg'));renderProfile();};});
  $('cdnBtn').onclick=function(){checkCDN(true);};
  var edi=$('examDateInput');
  if(edi)edi.onchange=function(){
    var v=edi.value;
    RXStore.set('examDate',v?new Date(v+'T00:00:00').getTime():null);
    renderProfile();toast('🎯 ✓');
  };
  $('hfSave').onclick=function(){RXStore.set('hfToken',$('hfTok').value.trim());toast('✓');};
  $('clearBtn').onclick=function(){confirmDlg(t('clear_data')+'?',function(ok){if(ok){RXStore.clearData();location.reload();}});};
}

/* ---------- CDN content updates ---------- */
var CDN_BASE='https://cdn.jsdelivr.net/gh/Ruhvibes/ruhxam@main/cdn';
function checkCDN(manual){
  var done=function(msg){if(manual)toast(msg);};
  try{
    fetch(CDN_BASE+'/content-version.json',{cache:'no-store'}).then(function(r){
      if(!r.ok)throw 0;return r.json();
    }).then(function(v){
      if(!v||typeof v.version!=='number')throw 0;
      var cur=RXStore.get('contentVer')||1;
      if(v.version>cur){
        return Promise.all(['maths.json','reasoning.json','science.json','gk.json','current-affairs.json'].map(function(f){
          return fetch(CDN_BASE+'/'+f,{cache:'no-store'}).then(function(r){if(!r.ok)throw 0;return r.json();});
        })).then(function(parts){
          var all=[];parts.forEach(function(p){if(p&&p.chapters)all=all.concat(p.chapters);});
          if(!all.length)throw 0;
          // validate schema
          var ok=all.every(function(c){return c.id&&c.title&&c.quiz&&c.quiz.length;});
          if(!ok)throw 0;
          RXStore.set('cdnCache',{version:v.version,chapters:all});
          RXStore.set('contentVer',v.version);
          applyCDNCache();
          done('✨ '+t('updated_toast'));
        });
      }else done(t('up_to_date'));
    }).catch(function(){done(t('update_failed'));});
  }catch(e){done(t('update_failed'));}
}
function applyCDNCache(){
  try{
    var cc=RXStore.get('cdnCache');
    if(cc&&cc.chapters&&cc.chapters.length){
      // replace bundled chapters with cached ones (validated)
      var byId={};cc.chapters.forEach(function(c){byId[c.id]=c;});
      CH.forEach(function(c,i){if(byId[c.id])CH[i]=byId[c.id];});
      // add brand-new chapters from CDN
      cc.chapters.forEach(function(c){if(!chById(c.id))CH.push(c);});
    }
  }catch(e){}
}

/* ---------- header controls ---------- */
function setLang(l){RT.lang=l;RXStore.set('lang',l);document.documentElement.lang=l;applyTabLabels();
  /* keep in-progress quiz/mock/note/formula alive across language switch */
  var v=RT.view;
  if(v==='quiz'){renderQ();return;}
  if(v==='mockrun'){renderMockQ();return;}
  if(v==='formulas'){renderFormulaSheet();return;}
  if(v==='noteedit'){openNote(editId);return;}
  show(v==='chapter'?'study':v);
}
function setTheme(th){RT.theme=th;RXStore.set('theme',th);document.documentElement.setAttribute('data-theme',th);}
function updExamChip(){}
/* popup menu */
function showMenu(items,x,y){
  closeMenu();
  var m=document.createElement('div');
  m.id='popmenu';
  m.style.cssText='position:fixed;z-index:100;background:#fff;border-radius:8px;box-shadow:0 4px 20px rgba(0,0,0,.25);min-width:200px;padding:6px;';
  items.forEach(function(it){
    var b=document.createElement('button');
    b.style.cssText='display:block;width:100%;text-align:left;background:none;border:0;padding:12px;font-size:15px;cursor:pointer;font-family:inherit;color:#222;border-radius:6px;';
    b.innerHTML=it.label;
    b.onmouseover=function(){b.style.background='#f0f0f0';};
    b.onmouseout=function(){b.style.background='none';};
    b.onclick=function(){closeMenu();it.fn();};
    m.appendChild(b);
  });
  document.body.appendChild(m);
  var r=m.getBoundingClientRect();
  m.style.left=Math.min(x,window.innerWidth-r.width-10)+'px';
  m.style.top=Math.min(y,window.innerHeight-r.height-10)+'px';
  setTimeout(function(){document.addEventListener('click',closeMenu);},10);
}
function closeMenu(){var m=$('popmenu');if(m)m.remove();document.removeEventListener('click',closeMenu);}
var RX_TAB_ICONS=['🏠','📚','✏️','⏱️','📝','📊','⚙️'];
function applyTabLabels(){
  var tabs=document.querySelectorAll('#tabbar .tab');
  var labels=[t('tab_home'),t('tab_study'),t('tab_practice'),t('tab_mock'),t('tab_notes'),t('tab_progress'),t('tab_profile')];
  tabs.forEach(function(b,i){b.innerHTML=RX_TAB_ICONS[i]+'<span>'+esc(labels[i])+'</span>';});
}

/* ---------- init ---------- */
function init(){
  initState();
  applyCDNCache();
  document.documentElement.setAttribute('data-theme',RT.theme);
  document.documentElement.lang=RT.lang;
  $('btnBack').onclick=function(){window.__ruhxamBack();};
  /* hamburger: quick navigation */
  $('btnMenu').onclick=function(e){
    e.stopPropagation();
    var r=$('btnMenu').getBoundingClientRect();
    showMenu([
      {label:'🏠 '+t('tab_home'),fn:function(){goTab('home');}},
      {label:'📚 '+t('tab_study'),fn:function(){goTab('study');}},
      {label:'✏️ '+t('tab_practice'),fn:function(){goTab('practice');}},
      {label:'⏱️ '+t('tab_mock'),fn:function(){goTab('mock');}},
      {label:'📝 '+t('tab_notes'),fn:function(){goTab('notes');}},
      {label:'📊 '+t('tab_progress'),fn:function(){goTab('progress');}},
      {label:'📋 '+t('formula_sheet'),fn:function(){renderFormulaSheet();}}
    ],r.left,r.bottom+6);
  };
  /* 3-dot: settings */
  $('btnHdrMenu').onclick=function(e){
    e.stopPropagation();
    var r=$('btnHdrMenu').getBoundingClientRect();
    showMenu([
      {label:'🌐 '+(RT.lang==='hi'?'English':'हिंदी'),fn:function(){setLang(RT.lang==='hi'?'en':'hi');}},
      {label:'🚂 '+(RT.examId==='ntpc'?'Group D':'NTPC'),fn:function(){
        RT.examId=RT.examId==='ntpc'?'groupd':'ntpc';
        RXStore.set('examId',RT.examId);
        toast('🚂 '+L(RT_EXAMS[RT.examId].name));
        if(RT.view==='mock')renderMockSetup();
      }},
      {label:'⚙️ '+t('tab_profile'),fn:function(){goTab('profile');}}
    ],r.right-200,r.bottom+6);
  };
  document.querySelectorAll('#tabbar .tab').forEach(function(b){
    b.onclick=function(){goTab(b.getAttribute('data-tab'));};
  });
  applyTabLabels();
  show('home');
  // CDN check on launch (silent, offline-safe)
  setTimeout(function(){checkCDN(false);},2500);
}
/* test hooks (used by headless QA; harmless in production) */
window.RXTest={getQZ:function(){return QZ;},getMK:function(){return MK;},qObj:qObj,mockPool:mockPool,RT_EXAMS:RT_EXAMS,goTab:goTab,startMock:startMock,finishMock:finishMock,chById:chById,openChapter:openChapter,renderChapter:renderChapter};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);
else init();
})();
