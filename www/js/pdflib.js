/* RuhXam — Hasnain's PDF library (from his "Math Hindi: Competitive Exams" app).
   93 PDFs: tricks(18) + arithmetic(13) + books(4) + railway(29) + ssc(29).
   Bundled in www/pdfs/ for offline; CDN fallback via jsDelivr. */
(function(){
'use strict';

/* Local bundle path + CDN fallback */
var PDF_LOCAL='pdfs/';
var PDF_CDN='https://cdn.jsdelivr.net/gh/Ruhvibes/ruhxam@main/cdn/pdfs/';
function pdfURL(cat,file){return PDF_LOCAL+cat+'/'+file;}

/* ---------- categories ---------- */
window.RX_PDF_CATS=[
  {id:'tricks',    icon:'\u26A1', hi:'Math Shortcut Tricks', en:'Math Shortcut Tricks', cls:'sc-orange'},
  {id:'arithmetic',icon:'\uD83E\uDDEE', hi:'अंकगणित (Arithmetic)', en:'Arithmetic', cls:'sc-teal'},
  {id:'books',     icon:'\uD83D\uDCD0', hi:'गणित पुस्तकें (Books)', en:'Maths Books', cls:'sc-purple'},
  {id:'railway',   icon:'\uD83D\uDE82', hi:'Railway परीक्षा प्रश्न (हल सहित)', en:'Railway Questions (with Solutions)', cls:'sc-blue'},
  {id:'ssc',       icon:'\uD83D\uDCDD', hi:'SSC परीक्षा प्रश्न (हल सहित)', en:'SSC Questions (with Solutions)', cls:'sc-green'}
];

/* ---------- PDF catalog ---------- */
var T=function(hi,en){return{hi:hi,en:en};};
window.RX_PDFS=[
/* --- Shortcut Tricks (18) --- */
{id:'pt01',cat:'tricks',file:'1.pdf', title:T('\u092A\u094D\u0930\u0924\u093F\u0936\u0924','Percentage')},
{id:'pt02',cat:'tricks',file:'2.pdf', title:T('\u0905\u0928\u0941\u092A\u093E\u0924 \u090F\u0935\u0902 \u0938\u092E\u093E\u0928\u0941\u092A\u093E\u0924','Ratio & Proportion')},
{id:'pt03',cat:'tricks',file:'3.pdf', title:T('\u0914\u0938\u0924','Average')},
{id:'pt04',cat:'tricks',file:'4.pdf', title:T('\u0932\u093E\u092D \u090F\u0935\u0902 \u0939\u093E\u0928\u093F','Profit & Loss')},
{id:'pt05',cat:'tricks',file:'5.pdf', title:T('\u0938\u093E\u091D\u0947\u0926\u093E\u0930\u0940','Partnership')},
{id:'pt06',cat:'tricks',file:'6.pdf', title:T('\u0938\u093E\u0927\u093E\u0930\u0923 \u092C\u094D\u092F\u093E\u091C','Simple Interest')},
{id:'pt07',cat:'tricks',file:'7.pdf', title:T('\u091A\u0915\u094D\u0930\u0935\u0943\u0926\u094D\u0927\u093F \u092C\u094D\u092F\u093E\u091C','Compound Interest')},
{id:'pt08',cat:'tricks',file:'8.pdf', title:T('\u0938\u0902\u0916\u094D\u092F\u093E \u092A\u0926\u094D\u0927\u0924\u093F','Number System')},
{id:'pt09',cat:'tricks',file:'9.pdf', title:T('\u0938\u0930\u0932\u0940\u0915\u0930\u0923','Simplification')},
{id:'pt10',cat:'tricks',file:'10.pdf',title:T('\u0932.\u0938. \u090F\u0935\u0902 \u092E.\u0938.','LCM & HCF')},
{id:'pt11',cat:'tricks',file:'11.pdf',title:T('\u0938\u092E\u092F \u090F\u0935\u0902 \u0915\u093E\u0930\u094D\u092F','Time & Work')},
{id:'pt12',cat:'tricks',file:'12.pdf',title:T('\u092A\u093E\u0907\u092A \u090F\u0935\u0902 \u091F\u0902\u0915\u0940','Pipe & Cistern')},
{id:'pt13',cat:'tricks',file:'13.pdf',title:T('\u0938\u092E\u092F, \u091A\u093E\u0932 \u090F\u0935\u0902 \u0926\u0942\u0930\u0940','Time, Speed & Distance')},
{id:'pt14',cat:'tricks',file:'14.pdf',title:T('\u0928\u093E\u0935 \u090F\u0935\u0902 \u0927\u093E\u0930\u093E','Boat & Stream')},
{id:'pt15',cat:'tricks',file:'15.pdf',title:T('\u0906\u092F\u0941 \u0938\u0902\u092C\u0902\u0927\u0940 \u092A\u094D\u0930\u0936\u094D\u0928','Age Problems')},
{id:'pt16',cat:'tricks',file:'16.pdf',title:T('\u0915\u094D\u0937\u0947\u0924\u094D\u0930\u092B\u0932','Area (Mensuration)')},
{id:'pt17',cat:'tricks',file:'17.pdf',title:T('\u0906\u092F\u0924\u0928','Volume')},
{id:'pt18',cat:'tricks',file:'18.pdf',title:T('\u0917\u094D\u0930\u093E\u092B / \u0921\u0947\u091F\u093E','Graph / Data Interpretation')},
/* --- Arithmetic (13) --- */
{id:'pa01',cat:'arithmetic',file:'1.pdf', title:T('\u0938\u0902\u0916\u094D\u092F\u093E \u092A\u0926\u094D\u0927\u0924\u093F','Number System')},
{id:'pa02',cat:'arithmetic',file:'2.pdf', title:T('\u0938\u0930\u0932\u0940\u0915\u0930\u0923','Simplification')},
{id:'pa03',cat:'arithmetic',file:'3.pdf', title:T('\u0932.\u0938. \u090F\u0935\u0902 \u092E.\u0938.','L.C.M and H.C.F.')},
{id:'pa04',cat:'arithmetic',file:'4.pdf', title:T('\u0914\u0938\u0924','Average')},
{id:'pa05',cat:'arithmetic',file:'5.pdf', title:T('\u0905\u0928\u0941\u092A\u093E\u0924 \u090F\u0935\u0902 \u0938\u092E\u093E\u0928\u0941\u092A\u093E\u0924','Ratio & Proportion')},
{id:'pa06',cat:'arithmetic',file:'6.pdf', title:T('\u0906\u092F\u0941-\u0938\u0902\u092C\u0902\u0927\u0940 \u092A\u094D\u0930\u0936\u094D\u0928','Questions Based on Age')},
{id:'pa07',cat:'arithmetic',file:'7.pdf', title:T('\u092E\u093F\u0936\u094D\u0930\u0923','Mixture (Alligation)')},
{id:'pa08',cat:'arithmetic',file:'8.pdf', title:T('\u092A\u094D\u0930\u0924\u093F\u0936\u0924','Percentage')},
{id:'pa09',cat:'arithmetic',file:'9.pdf', title:T('\u0932\u093E\u092D \u090F\u0935\u0902 \u0939\u093E\u0928\u093F','Profit & Loss')},
{id:'pa10',cat:'arithmetic',file:'10.pdf',title:T('\u0938\u093E\u0927\u093E\u0930\u0923 \u0935 \u091A\u0915\u094D\u0930\u0935\u0943\u0926\u094D\u0927\u093F \u092C\u094D\u092F\u093E\u091C','Simple & Compound Interest')},
{id:'pa11',cat:'arithmetic',file:'11.pdf',title:T('\u0915\u093E\u092E-\u0938\u092E\u092F','Work & Time')},
{id:'pa12',cat:'arithmetic',file:'12.pdf',title:T('\u091A\u093E\u0932, \u0938\u092E\u092F \u0914\u0930 \u0926\u0942\u0930\u0940','Speed, Time & Distance')},
{id:'pa13',cat:'arithmetic',file:'13.pdf',title:T('\u092A\u093E\u0907\u092A \u090F\u0935\u0902 \u091F\u0902\u0915\u0940','Pipes and Cistern')},
/* --- Books (4) --- */
{id:'pb01',cat:'books',file:'Algebra.pdf',     title:T('\u092C\u0940\u091C\u0917\u0923\u093F\u0924','Algebra')},
{id:'pb02',cat:'books',file:'Geometry.pdf',    title:T('\u091C\u094D\u092F\u093E\u092E\u093F\u0924\u093F','Geometry')},
{id:'pb03',cat:'books',file:'Statistics.pdf',  title:T('\u0938\u093E\u0902\u0916\u094D\u092F\u093F\u0915\u0940','Statistics')},
{id:'pb04',cat:'books',file:'Trigonometry.pdf',title:T('\u0924\u094D\u0930\u093F\u0915\u094B\u0923\u092E\u093F\u0924\u093F','Trigonometry')}
];
/* --- Railway question sets (29) + SSC question sets (29): generated --- */
(function(){
  var i,p;
  for(i=1;i<=29;i++){
    p={id:'pr'+(i<10?'0':'')+i,cat:'railway',file:i+'.pdf',
       title:{hi:'Railway \u092A\u094D\u0930\u0936\u094D\u0928 \u0938\u0947\u091F '+i+' (\u0939\u0932 \u0938\u0939\u093F\u0924)',
              en:'Railway Question Set '+i+' (with Solutions)'}};
    window.RX_PDFS.push(p);
  }
  for(i=1;i<=29;i++){
    p={id:'ps'+(i<10?'0':'')+i,cat:'ssc',file:i+'.pdf',
       title:{hi:'SSC \u092A\u094D\u0930\u0936\u094D\u0928 \u0938\u0947\u091F '+i+' (\u0939\u0932 \u0938\u0939\u093F\u0924)',
              en:'SSC Question Set '+i+' (with Solutions)'}};
    window.RX_PDFS.push(p);
  }
})();

window.pdfURL=pdfURL;
window.PDF_CDN=PDF_CDN;
window.pdfById=function(id){for(var i=0;i<window.RX_PDFS.length;i++)if(window.RX_PDFS[i].id===id)return window.RX_PDFS[i];return null;};
window.pdfsByCat=function(cat){return window.RX_PDFS.filter(function(p){return p.cat===cat;});};

})();
