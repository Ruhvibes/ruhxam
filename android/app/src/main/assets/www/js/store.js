/* RuhXam localStorage store — progress, bookmarks, notes, mock history */
var RXStore = (function(){
  var KEY='ruhxam-v1';
  function load(){ try{ return JSON.parse(localStorage.getItem(KEY))||{}; }catch(e){ return {}; } }
  function save(s){ try{ localStorage.setItem(KEY, JSON.stringify(s)); }catch(e){} }
  var s = load();
  if(!s.lang) s.lang='hi';
  if(!s.theme) s.theme='light';
  if(!s.examId) s.examId='ntpc';
  if(!s.bookmarks) s.bookmarks=[];       // chapter ids
  if(!s.trickBm) s.trickBm=[];           // "chId:idx"
  if(!s.progress) s.progress={};         // chId -> {done:true, best:score%}
  if(!s.attempts) s.attempts={};         // chId -> {n:totalQs, ok:correct}
  if(!s.mockHistory) s.mockHistory=[];   // {exam, total, correct, wrong, skip, score, date}
  if(!s.notes) s.notes=[];               // {id,title,body,tags,fav,updated}
  if(!s.lastChapter) s.lastChapter=null;
  if(!s.hfToken) s.hfToken='';
  if(!s.contentVer) s.contentVer=4;       // bundled CDN version (v4, 2026-10-12)
  if(!s.cdnCache) s.cdnCache=null;       // cached remote content
  if(!s.streak) s.streak={count:0,last:''}; // daily study streak {count, last:'YYYY-MM-DD'}
  if(!s.examDate) s.examDate=null;       // target exam date timestamp
  save(s);
  var uid=function(){ return 'n'+Date.now().toString(36)+Math.floor(Math.random()*1e6).toString(36); };
  return {
    get:function(k){ return s[k]; },
    set:function(k,v){ s[k]=v; save(s); },
    toggleBookmark:function(id){ var i=s.bookmarks.indexOf(id); if(i>=0)s.bookmarks.splice(i,1); else s.bookmarks.push(id); save(s); return i<0; },
    toggleTrick:function(key){ var i=s.trickBm.indexOf(key); if(i>=0)s.trickBm.splice(i,1); else s.trickBm.push(key); save(s); return i<0; },
    markDone:function(id, pct){ var p=s.progress[id]||{done:false,best:0}; p.done=true; if(pct>p.best)p.best=pct; s.progress[id]=p; save(s); },
    recordAttempt:function(id, ok, total){ var a=s.attempts[id]||{n:0,ok:0}; a.n+=total; a.ok+=ok; s.attempts[id]=a; save(s); },
    addMock:function(m){ s.mockHistory.unshift(m); s.mockHistory=s.mockHistory.slice(0,50); save(s); },
    // notes
    addNote:function(t,b){ var n={id:uid(),title:t||'',body:b||'',fav:false,updated:Date.now()}; s.notes.unshift(n); save(s); return n; },
    updateNote:function(id,t,b){ var n=s.notes.find(function(x){return x.id===id;}); if(n){n.title=t;n.body=b;n.updated=Date.now();save(s);} },
    deleteNote:function(id){ s.notes=s.notes.filter(function(x){return x.id!==id;}); save(s); },
    toggleFav:function(id){ var n=s.notes.find(function(x){return x.id===id;}); if(n){n.fav=!n.fav;save(s);return n.fav;} return false; },
    clearData:function(){ localStorage.removeItem(KEY); },
    // daily streak: call once per app launch
    touchStreak:function(){
      var today=new Date();var ds=today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
      var st=s.streak||{count:0,last:''};
      if(st.last===ds)return st.count;
      var y=new Date(today.getTime()-864e5);var ys=y.getFullYear()+'-'+(y.getMonth()+1)+'-'+y.getDate();
      st.count=(st.last===ys)?st.count+1:1;
      st.last=ds;s.streak=st;save(s);return st.count;
    },
    all:function(){ return s; }
  };
})();
