/* RuhXam — inline SVG diagram library (offline, <5KB each, HI/EN labels).
 * All diagrams use currentColor / translucent brand fills so they render
 * correctly in light AND dark mode. No external images. */
var RXD = (function(){
  var L = {
    hi:{tri:['समकोण','समबाहु','समद्विबाहु','विषमबाहु'],radius:'त्रिज्या (r)',diameter:'व्यास (d)',chord:'जीवा',
        square:'वर्ग',rect:'आयत',area:'क्षेत्रफल',perimeter:'परिमाप',
        acute:'न्यून',right:'समकोण',obtuse:'अधिक',
        N:'उत्तर',S:'दक्षिण',E:'पूर्व',W:'पश्चिम',NE:'उ.-पूर्व',NW:'उ.-पश्चिम',SE:'द.-पूर्व',SW:'द.-पश्चिम',
        mirror:'दर्पण',object:'वस्तु',image:'प्रतिबिंब',
        sun:'सूर्य',mon:'चं',tue:'मं',wed:'बु',thu:'गु',fri:'शु',sat:'श',
        father:'पिता',mother:'माता',son:'पुत्र',daughter:'पुत्री',gf:'दादा',gm:'दादी',
        india:'भारत',timeline:'समयरेखा',you:'आप'},
    en:{tri:['Right-angled','Equilateral','Isosceles','Scalene'],radius:'Radius (r)',diameter:'Diameter (d)',chord:'Chord',
        square:'Square',rect:'Rectangle',area:'Area',perimeter:'Perimeter',
        acute:'Acute',right:'Right',obtuse:'Obtuse',
        N:'North',S:'South',E:'East',W:'West',NE:'NE',NW:'NW',SE:'SE',SW:'SW',
        mirror:'Mirror',object:'Object',image:'Image',
        sun:'S',mon:'M',tue:'T',wed:'W',thu:'T',fri:'F',sat:'S',
        father:'Father',mother:'Mother',son:'Son',daughter:'Daughter',gf:'Grandfather',gm:'Grandmother',
        india:'India',timeline:'Timeline',you:'You'}
  };
  function lang(){ return (window.RT && RT.lang) || 'hi'; }
  function T(k){ var l=L[lang()]||L.hi; return l[k]!==undefined?l[k]:k; }
  function esc(s){ return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
  function open(w,h,extra){ return '<svg class="dgm" viewBox="0 0 '+w+' '+h+'" '+(extra||'')+' role="img">'; }
  function txt(x,y,s,sz,anchor){ return '<text x="'+x+'" y="'+y+'" text-anchor="'+(anchor||'middle')+'" font-size="'+(sz||11)+'">'+esc(s)+'</text>'; }
  var C='currentColor', F1='rgba(139,92,246,.22)', F2='rgba(245,158,11,.22)', F3='rgba(16,185,129,.22)', F4='rgba(59,130,246,.22)';

  /* ---------- 1. Triangle types ---------- */
  function triangleTypes(){
    var t=T('tri'), s=open(360,120);
    var tris=[[10,100,110,100,60,30],[130,100,230,100,180,25],[250,100,350,100,300,45]];
    // right-angled
    s+='<polygon points="20,100 110,100 20,35" fill="'+F1+'" stroke="'+C+'" stroke-width="2"/>';
    s+='<rect x="20" y="88" width="12" height="12" fill="none" stroke="'+C+'"/>'+txt(65,115,t[0]);
    // equilateral
    s+='<polygon points="140,100 230,100 185,22" fill="'+F2+'" stroke="'+C+'" stroke-width="2"/>';
    [ [185,88],[162,55],[208,55] ].forEach(function(p){ s+='<line x1="'+(p[0]-4)+'" y1="'+p[1]+'" x2="'+(p[0]+4)+'" y2="'+p[1]+'" stroke="'+C+'"/>'; });
    s+=txt(185,115,t[1]);
    // isosceles
    s+='<polygon points="260,100 350,100 305,35" fill="'+F3+'" stroke="'+C+'" stroke-width="2"/>'+txt(305,115,t[2]);
    // scalene
    s+='<polygon points="20,100 110,100 75,40" fill="none" stroke="'+C+'" stroke-width="2" transform="translate(230,0) scale(0.55)"/>'+txt(305,115,'');
    return s+txt(300,115,t[3])+'</svg>';
  }

  /* ---------- 2. Circle: radius / diameter / chord ---------- */
  function circleParts(){
    var s=open(220,180);
    s+='<circle cx="110" cy="85" r="60" fill="'+F4+'" stroke="'+C+'" stroke-width="2"/>';
    s+='<circle cx="110" cy="85" r="3" fill="'+C+'"/>';
    s+='<line x1="110" y1="85" x2="170" y2="85" stroke="'+C+'" stroke-width="2"/>'+txt(140,75,T('radius'),10);
    s+='<line x1="55" y1="120" x2="165" y2="120" stroke="'+C+'" stroke-width="1.5" stroke-dasharray="5,3"/>'+txt(110,140,T('diameter'),10);
    s+='<line x1="70" y1="45" x2="130" y2="35" stroke="'+C+'" stroke-width="1.5"/>'+txt(100,28,T('chord'),10);
    return s+'</svg>';
  }

  /* ---------- 3. Square & rectangle ---------- */
  function quadShapes(){
    var s=open(340,130);
    s+='<rect x="20" y="25" width="80" height="80" fill="'+F1+'" stroke="'+C+'" stroke-width="2"/>';
    s+=txt(60,20,'a',12)+txt(60,120,T('square'),11);
    s+='<rect x="180" y="35" width="130" height="70" fill="'+F2+'" stroke="'+C+'" stroke-width="2"/>';
    s+=txt(245,28,'l',12)+txt(168,72,'b',12)+txt(245,120,T('rect'),11);
    return s+'</svg>';
  }

  /* ---------- 4. Angle types ---------- */
  function angleTypes(){
    var s=open(360,110);
    function ang(x,deg,label,fill){
      var r=55, rad=deg*Math.PI/180, x2=x+r, y2=95-r*Math.tan(rad);
      s+='<line x1="'+x+'" y1="95" x2="'+(x+r)+'" y2="95" stroke="'+C+'" stroke-width="2"/>';
      s+='<line x1="'+x+'" y1="95" x2="'+x2+'" y2="'+Math.max(10,y2)+'" stroke="'+C+'" stroke-width="2"/>';
      if(deg===90) s+='<rect x="'+x+'" y="'+(95-12)+'" width="12" height="12" fill="none" stroke="'+C+'"/>';
      else s+='<path d="M '+(x+18)+' 95 A 18 18 0 0 0 '+(x+18*Math.cos(rad))+' '+(95-18*Math.sin(rad))+'" fill="none" stroke="'+C+'"/>';
      s+=txt(x+28,108,label,11);
    }
    ang(30,40,T('acute')); ang(150,90,T('right')); ang(270,120,T('obtuse'));
    return s+'</svg>';
  }

  /* ---------- 5. Analog clock face (h, m) ---------- */
  function clockFace(h,m){
    h=((h%12)+12)%12; m=m||0;
    var s=open(200,200), cx=100, cy=100, r=80;
    s+='<circle cx="'+cx+'" cy="'+cy+'" r="'+r+'" fill="none" stroke="'+C+'" stroke-width="3"/>';
    for(var i=0;i<12;i++){
      var a=i*30*Math.PI/180, x1=cx+(r-10)*Math.sin(a), y1=cy-(r-10)*Math.cos(a);
      var x2=cx+(r-16)*Math.sin(a), y2=cy-(r-16)*Math.cos(a);
      s+='<line x1="'+x1+'" y1="'+y1+'" x2="'+x2+'" y2="'+y2+'" stroke="'+C+'" stroke-width="'+(i%3===0?3:1.5)+'"/>';
      var nx=cx+(r-28)*Math.sin(a), ny=cy-(r-28)*Math.cos(a);
      s+=txt(nx,ny+4,(i===0?12:i),11);
    }
    var ha=(h*30+m*0.5)*Math.PI/180, ma=m*6*Math.PI/180;
    s+='<line x1="'+cx+'" y1="'+cy+'" x2="'+(cx+40*Math.sin(ha))+'" y2="'+(cy-40*Math.cos(ha))+'" stroke="'+C+'" stroke-width="5" stroke-linecap="round"/>';
    s+='<line x1="'+cx+'" y1="'+cy+'" x2="'+(cx+60*Math.sin(ma))+'" y2="'+(cy-60*Math.cos(ma))+'" stroke="'+C+'" stroke-width="3" stroke-linecap="round"/>';
    s+='<circle cx="'+cx+'" cy="'+cy+'" r="5" fill="'+C+'"/>';
    return s+'</svg>';
  }

  /* ---------- 6. Month calendar grid ---------- */
  function calendarGrid(y,mo,highlights){
    highlights=highlights||[];
    var first=new Date(y,mo-1,1).getDay(), days=new Date(y,mo,0).getDate();
    var dn=[T('sun'),T('mon'),T('tue'),T('wed'),T('thu'),T('fri'),T('sat')];
    var cw=34, rows=Math.ceil((first+days)/7), w=cw*7+8, h=rows*cw+34;
    var s=open(w,h), x0=4, y0=30, i, c, r, x, yy, g='';
    for(i=0;i<7;i++) s+=txt(x0+i*cw+cw/2,20,dn[i],11);
    for(i=0;i<=7;i++) g+='M'+(x0+i*cw)+' '+y0+'V'+(y0+rows*cw);
    for(r=0;r<=rows;r++) g+='M'+x0+' '+(y0+r*cw)+'H'+(x0+7*cw);
    s+='<path d="'+g+'" stroke="'+C+'" opacity=".3" fill="none"/>';
    for(i=0;i<days;i++){
      if(highlights.indexOf(i+1)<0) continue;
      c=(first+i)%7; r=Math.floor((first+i)/7); x=x0+c*cw; yy=y0+r*cw;
      s+='<rect x="'+x+'" y="'+yy+'" width="'+cw+'" height="'+cw+'" fill="'+F2+'"/>';
    }
    for(i=0;i<days;i++){
      c=(first+i)%7; r=Math.floor((first+i)/7);
      s+=txt(x0+c*cw+cw/2, y0+r*cw+cw/2+4, i+1, 11);
    }
    return s+'</svg>';
  }

/* ---------- 7. Venn diagrams ---------- */
  function venn2(a,b){
    var s=open(280,160);
    s+='<circle cx="110" cy="80" r="55" fill="'+F1+'" stroke="'+C+'" stroke-width="2"/>';
    s+='<circle cx="170" cy="80" r="55" fill="'+F4+'" stroke="'+C+'" stroke-width="2"/>';
    s+=txt(80,84,esc(a),11)+txt(200,84,esc(b),11);
    return s+'</svg>';
  }
  function venn3(a,b,c){
    var s=open(300,200);
    var pts=[[150,70],[105,145],[195,145]];
    var fills=[F1,F2,F3], labels=[a,b,c];
    for(var i=0;i<3;i++) s+='<circle cx="'+pts[i][0]+'" cy="'+pts[i][1]+'" r="58" fill="'+fills[i]+'" stroke="'+C+'" stroke-width="2"/>';
    s+=txt(150,40,esc(labels[0]),11)+txt(60,178,esc(labels[1]),11)+txt(240,178,esc(labels[2]),11);
    return s+'</svg>';
  }

  /* ---------- 8. 8-direction compass ---------- */
  function compass8(){
    var s=open(220,220), cx=110, cy=110, r=85;
    var dirs=[[0,T('N')],[45,T('NE')],[90,T('E')],[135,T('SE')],[180,T('S')],[225,T('SW')],[270,T('W')],[315,T('NW')]];
    s+='<circle cx="'+cx+'" cy="'+cy+'" r="'+r+'" fill="none" stroke="'+C+'" stroke-width="2"/>';
    dirs.forEach(function(d){
      var a=d[0]*Math.PI/180;
      var x1=cx+r*Math.sin(a), y1=cy-r*Math.cos(a);
      var x2=cx+(r-14)*Math.sin(a), y2=cy-(r-14)*Math.cos(a);
      s+='<line x1="'+x1+'" y1="'+y1+'" x2="'+cx+'" y2="'+cy+'" stroke="'+C+'" stroke-opacity=".3"/>';
      s+='<polygon points="'+x1+','+y1+' '+(x2-4*Math.cos(a))+','+(y2-4*Math.sin(a))+' '+(x2+4*Math.cos(a))+','+(y2+4*Math.sin(a))+'" fill="'+(d[0]===0?C:'none')+'" stroke="'+C+'"/>';
      s+=txt(cx+(r+14)*Math.sin(a), cy-(r+14)*Math.cos(a)+4, d[1], 10);
    });
    s+='<circle cx="'+cx+'" cy="'+cy+'" r="4" fill="'+C+'"/>';
    return s+'</svg>';
  }

  /* ---------- 9. Bar chart ---------- */
  function barChart(title,data){
    // data: [[label, value], ...]
    var w=340,h=200,pad=34,bw=40,gap=18;
    var max=Math.max.apply(null,data.map(function(d){return d[1];}));
    var s=open(w,h);
    s+=txt(w/2,16,esc(title),12);
    s+='<line x1="'+pad+'" y1="'+(h-30)+'" x2="'+w+'" y2="'+(h-30)+'" stroke="'+C+'"/>';
    s+='<line x1="'+pad+'" y1="26" x2="'+pad+'" y2="'+(h-30)+'" stroke="'+C+'"/>';
    var fills=[F1,F2,F3,F4];
    data.forEach(function(d,i){
      var bh=(h-70)*(d[1]/max), x=pad+gap+i*(bw+gap);
      s+='<rect x="'+x+'" y="'+(h-30-bh)+'" width="'+bw+'" height="'+bh+'" fill="'+fills[i%4]+'" stroke="'+C+'"/>';
      s+=txt(x+bw/2,h-30-bh-6,d[1],10);
      s+=txt(x+bw/2,h-14,esc(d[0]),9);
    });
    return s+'</svg>';
  }

  /* ---------- 10. Pie chart ---------- */
  function pieChart(title,data){
    var cx=170,cy=110,r=75, s=open(340,210), total=0;
    data.forEach(function(d){total+=d[1];});
    var fills=['rgba(139,92,246,.55)','rgba(245,158,11,.55)','rgba(16,185,129,.55)','rgba(59,130,246,.55)','rgba(236,72,153,.55)'];
    var a0=-Math.PI/2;
    s+=txt(170,18,esc(title),12);
    data.forEach(function(d,i){
      var a1=a0+(d[1]/total)*2*Math.PI;
      var x0=cx+r*Math.cos(a0), y0=cy+r*Math.sin(a0), x1=cx+r*Math.cos(a1), y1=cy+r*Math.sin(a1);
      var large=(a1-a0)>Math.PI?1:0;
      s+='<path d="M '+cx+' '+cy+' L '+x0.toFixed(1)+' '+y0.toFixed(1)+' A '+r+' '+r+' 0 '+large+' 1 '+x1.toFixed(1)+' '+y1.toFixed(1)+' Z" fill="'+fills[i%5]+'" stroke="'+C+'"/>';
      var am=(a0+a1)/2, lx=cx+(r+28)*Math.cos(am), ly=cy+(r+28)*Math.sin(am);
      s+=txt(lx,ly+3,esc(d[0])+' '+Math.round(d[1]/total*100)+'%',9);
      a0=a1;
    });
    return s+'</svg>';
  }

  /* ---------- 11. Number line ---------- */
  function numberLine(min,max,points){
    points=points||[];
    var w=360,h=80,pad=20;
    var X=function(v){return pad+(v-min)/(max-min)*(w-2*pad);};
    var s=open(w,h), y=40;
    s+='<line x1="'+pad+'" y1="'+y+'" x2="'+(w-pad)+'" y2="'+y+'" stroke="'+C+'" stroke-width="2"/>';
    s+='<polygon points="'+(w-pad)+','+y+' '+(w-pad-10)+','+(y-5)+' '+(w-pad-10)+','+(y+5)+'" fill="'+C+'"/>';
    for(var v=min;v<=max;v++){
      s+='<line x1="'+X(v)+'" y1="'+(y-6)+'" x2="'+X(v)+'" y2="'+(y+6)+'" stroke="'+C+'"/>';
      s+=txt(X(v),y+22,v,10);
    }
    points.forEach(function(p){
      s+='<circle cx="'+X(p)+'" cy="'+y+'" r="6" fill="'+F2+'" stroke="'+C+'" stroke-width="2"/>';
    });
    return s+'</svg>';
  }

  /* ---------- 12. Mirror image demo ---------- */
  function mirrorDemo(){
    var s=open(340,160), mx=170;
    s+='<line x1="'+mx+'" y1="10" x2="'+mx+'" y2="150" stroke="'+C+'" stroke-width="2" stroke-dasharray="6,4"/>';
    s+=txt(mx,158,T('mirror'),10);
    // object: arrow pointing right
    s+='<polygon points="60,80 120,80 120,68 150,90 120,112 120,100 60,100" fill="'+F1+'" stroke="'+C+'" stroke-width="2"/>';
    s+=txt(100,135,T('object'),10);
    // image: mirrored arrow
    s+='<polygon points="280,80 220,80 220,68 190,90 220,112 220,100 280,100" fill="'+F4+'" stroke="'+C+'" stroke-width="2"/>';
    s+=txt(240,135,T('image'),10);
    return s+'</svg>';
  }

  /* ---------- 13. Seating: circle & row ---------- */
  function seatingCircle(names){
    var s=open(260,260), cx=130, cy=130, r=85, n=names.length;
    s+='<ellipse cx="'+cx+'" cy="'+cy+'" rx="'+r+'" ry="'+r+'" fill="none" stroke="'+C+'" stroke-width="2"/>';
    names.forEach(function(nm,i){
      var a=-Math.PI/2+i*(2*Math.PI/n);
      var x=cx+r*Math.cos(a), y=cy+r*Math.sin(a);
      s+='<circle cx="'+x+'" cy="'+y+'" r="20" fill="'+F1+'" stroke="'+C+'" stroke-width="2"/>';
      s+=txt(x,y+4,esc(nm),11);
    });
    s+=txt(cx,cy,T('you'),9);
    return s+'</svg>';
  }
  function seatingRow(names){
    var n=names.length, w=n*64+16, s=open(w,110);
    names.forEach(function(nm,i){
      var x=8+i*64;
      s+='<rect x="'+x+'" y="25" width="56" height="56" rx="10" fill="'+F3+'" stroke="'+C+'" stroke-width="2"/>';
      s+=txt(x+28,58,esc(nm),12);
    });
    return s+'</svg>';
  }

  /* ---------- 14. Family tree ---------- */
  function familyTree(){
    var s=open(360,210);
    function box(x,y,label,fill){
      s+='<rect x="'+x+'" y="'+y+'" width="90" height="34" rx="8" fill="'+fill+'" stroke="'+C+'" stroke-width="2"/>';
      s+=txt(x+45,y+22,esc(label),10);
    }
    box(60,10,T('gf'),F1); box(210,10,T('gm'),F2);
    s+='<line x1="150" y1="44" x2="150" y2="66" stroke="'+C+'"/><line x1="150" y1="66" x2="255" y2="66" stroke="'+C+'"/>';
    s+='<line x1="255" y1="44" x2="255" y2="66" stroke="'+C+'"/>';
    box(105,80,T('father'),F3); box(225,80,T('mother'),F4);
    s+='<line x1="150" y1="114" x2="150" y2="140" stroke="'+C+'"/><line x1="150" y1="140" x2="270" y2="140" stroke="'+C+'"/>';
    s+='<line x1="270" y1="114" x2="270" y2="140" stroke="'+C+'"/>';
    box(45,150,T('son'),F1); box(165,150,T('daughter'),F2); box(285,150,T('you'),F3);
    s+='<line x1="90" y1="140" x2="90" y2="150" stroke="'+C+'"/><line x1="210" y1="140" x2="210" y2="150" stroke="'+C+'"/><line x1="330" y1="140" x2="330" y2="150" stroke="'+C+'"/>';
    return s+'</svg>';
  }

  /* ---------- 15. India outline (simplified) ---------- */
  function indiaOutline(){
    var s=open(220,240);
    // Simplified India silhouette (schematic, not to scale)
    var p='M110,10 L135,25 L150,45 L145,60 L165,70 L175,95 L160,105 L170,130 L150,150 L140,180 L125,210 L115,225 L105,205 L95,180 L70,165 L55,140 L65,120 L45,105 L55,80 L80,70 L75,50 L95,30 Z';
    s+='<path d="'+p+'" fill="'+F4+'" stroke="'+C+'" stroke-width="2"/>';
    s+='<circle cx="110" cy="110" r="4" fill="'+C+'"/>'+txt(110,130,T('india'),12);
    return s+'</svg>';
  }

  /* ---------- 16. History timeline ---------- */
  function timeline(events){
    // events: [[year, label], ...]
    var n=events.length, h=n*54+20, s=open(360,h);
    var x=70;
    s+='<line x1="'+x+'" y1="10" x2="'+x+'" y2="'+(h-10)+'" stroke="'+C+'" stroke-width="3"/>';
    events.forEach(function(e,i){
      var y=30+i*54;
      s+='<circle cx="'+x+'" cy="'+y+'" r="7" fill="'+F2+'" stroke="'+C+'" stroke-width="2"/>';
      s+=txt(x-10,y+4,e[0],11,'end');
      s+=txt(x+16,y+4,esc(e[1]),10.5,'start');
    });
    return s+'</svg>';
  }

  return {
    triangleTypes:triangleTypes, circleParts:circleParts, quadShapes:quadShapes,
    angleTypes:angleTypes, clockFace:clockFace, calendarGrid:calendarGrid,
    venn2:venn2, venn3:venn3, compass8:compass8, barChart:barChart,
    pieChart:pieChart, numberLine:numberLine, mirrorDemo:mirrorDemo,
    seatingCircle:seatingCircle, seatingRow:seatingRow, familyTree:familyTree,
    indiaOutline:indiaOutline, timeline:timeline, T:T
  };
})();
