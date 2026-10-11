/* RuhXam — Reasoning Ch 11-12 */
window.RT_CH = window.RT_CH || [];
(function(){
var P='reasoning';
RT_CH.push({id:'r11',part:P,num:11,kind:'tricks',exams:['all'],
title:{hi:'बैठक व्यवस्था',en:'Seating Arrangement'},
concept:{hi:'गोल/पंक्ति में बैठने के प्रश्न — <mark>जानकारी को क्रम से</mark> चित्र में रखें।',en:'Place clues <mark>in order</mark> on a diagram.'},
tricks:[
{h:{hi:'दिशा नियम',en:'Direction rule'},b:{hi:'केंद्र की ओर मुँह = दायाँ <mark>घड़ी-विपरीत</mark> दिशा में। पंक्ति में (उत्तर की ओर मुँह): दायाँ = आपका दायाँ।',en:'Facing center: right = <mark>anticlockwise</mark>.'}},
{h:{hi:'निश्चित जानकारी पहले',en:'Fixed info first'},b:{hi:'जो <mark>पक्का</mark> बैठा है उसे पहले रखें, फिर सापेक्ष जानकारी।',en:'Place <mark>definite</mark> positions first.'}},
{h:{hi:'गिनती',en:'Counting'},b:{hi:'"बाएँ दूसरा" = 2 स्थान बाएँ। विपरीत (गोल, सम संख्या) = <mark>कुल/2 स्थान दूर</mark>।',en:'"2nd left" = 2 places left.'}}],
examples:[
{q:{hi:'4 लोग गोल मेज़ पर; B, A के ठीक बाएँ; C, B के ठीक बाएँ। A के सामने कौन?',en:'4 around table; B left of A, C left of B. Opposite A?'},
s:{hi:'वामावर्त क्रम: A→B→C→D। A के सामने (2 स्थान) = <mark>C</mark>।',en:'Anticlockwise: A,B,C,D. Opposite A = <mark>C</mark>.'}},
{q:{hi:'पंक्ति (उत्तर की ओर मुँह): D, E के ठीक दाएँ; E, F के ठीक बाएँ। क्रम?',en:'Row facing north: D right of E; E left of F. Order?'},
s:{hi:'बाएँ से दाएँ: <mark>F, E, D</mark>।',en:'Left to right: <mark>F, E, D</mark>.'}}],
quiz:[
{q:{hi:'6 लोग गोल मेज़ (केंद्र की ओर मुँह)। A के ठीक दाएँ B है। B के ठीक सामने कौन-सा स्थान है?',en:'6 around table facing center. B immediate right of A. Position opposite B?'},
o:[{hi:'A के बाएँ तीसरा',en:'3rd left of A'},{hi:'A के दाएँ तीसरा',en:'3rd right of A'},{hi:'A स्वयं',en:'A itself'},{hi:'B के बाएँ दूसरा',en:'2nd left of B'}],a:1,
e:{hi:'6 में विपरीत = 3 स्थान दूर। B से 3 स्थान = A के दाएँ तीसरा (A, B के बाएँ तीसरा भी)।',en:'Opposite = 3 places away.'}},
{q:{hi:'पंक्ति: A मध्य (3rd), B बाएँ छोर (1st) — 5 लोग। दाएँ छोर पर?',en:'Row of 5: A middle, B left end. Right end?'},
o:[{hi:'A',en:'A'},{hi:'B',en:'B'},{hi:'C/D/E में कोई',en:'Any of C/D/E'},{hi:'निश्चित नहीं',en:'Not fixed'}],a:2,
e:{hi:'C, D, E में से कोई एक हो सकता है।',en:'Any one of C/D/E.'}},
{q:{hi:'12 बजे बैठा X केंद्र की ओर देख रहा है। उसके ठीक दाएँ कौन-सी दिशा?',en:'X at 12, facing center. Immediate right direction?'},
o:[{hi:'11 बजे की ओर',en:'Towards 11'},{hi:'1 बजे की ओर',en:'Towards 1'},{hi:'6 बजे की ओर',en:'Towards 6'},{hi:'3 बजे की ओर',en:'Towards 3'}],a:0,
e:{hi:'केंद्र की ओर मुँह → दायाँ = घड़ी-विपरीत = 11 की दिशा।',en:'Facing center → right = anticlockwise.'}},
{q:{hi:'पंक्ति (उत्तर की ओर मुँह): A, B के बाएँ दूसरा; B, C के दाएँ चौथा। C, A के सापेक्ष?',en:'Row facing north: A 2nd left of B; B 4th right of C. C w.r.t. A?'},
o:[{hi:'बाएँ दूसरा',en:'2nd left'},{hi:'दाएँ दूसरा',en:'2nd right'},{hi:'बाएँ चौथा',en:'4th left'},{hi:'दाएँ चौथा',en:'4th right'}],a:0,
e:{hi:'B=x, A=x−2, C=x−4 → C, A के बाएँ दूसरा।',en:'C is 2nd left of A.'}},
{q:{hi:'उत्तर की ओर मुँह: D, E के ठीक दाएँ; E, F के ठीक बाएँ। D के ठीक बाएँ?',en:'Facing north: D immediate right of E; E immediate left of F. Immediate left of D?'},
o:[{hi:'E',en:'E'},{hi:'F',en:'F'},{hi:'कह नहीं सकते',en:'Cannot say'},{hi:'D',en:'D'}],a:0,
e:{hi:'क्रम F, E, D → D के बाएँ E।',en:'Order F,E,D → left of D is E.'}}]});

RT_CH.push({id:'r12',part:P,num:12,kind:'tricks',exams:['all'],
title:{hi:'अशाब्दिक तर्क (दर्पण/जल/कागज़)',en:'Non-Verbal (Mirror/Water/Paper)'},
concept:{hi:'दर्पण प्रतिबिंब = <mark>बायाँ-दायाँ उल्टा</mark>; जल प्रतिबिंब = <mark>ऊपर-नीचे उल्टा</mark>।',en:'Mirror = <mark>left-right</mark> flip; water = <mark>top-bottom</mark> flip.'},
tricks:[
{h:{hi:'दर्पण प्रतिबिंब',en:'Mirror image'},b:{hi:'<mark>बायाँ ↔ दायाँ</mark> बदलता है; ऊपर-नीचे समान। जैसे → का दर्पण ←।',en:'<mark>Left ↔ right</mark> swap; top-bottom same.'}},
{h:{hi:'जल प्रतिबिंब',en:'Water image'},b:{hi:'<mark>ऊपर ↔ नीचे</mark> बदलता है; बायाँ-दायाँ समान।',en:'<mark>Top ↔ bottom</mark> swap.'}},
{h:{hi:'कागज़ मोड़ना/काटना',en:'Paper folding/cutting'},b:{hi:'मोड़ के <mark>अक्ष पर सममित</mark> छेद बनते हैं। खोलने पर प्रतिबिंबित प्रतिरूप।',en:'Holes mirror across the <mark>fold axis</mark>.'}},
{h:{hi:'अक्षर/अंक',en:'Letters/digits'},b:{hi:'दर्पण में समान दिखने वाले: <mark>A,H,I,M,O,T,U,V,W,X,Y</mark>; अंक: <mark>0,8</mark>।',en:'Mirror-symmetric: <mark>A,H,I,M,O,T,U,V,W,X,Y</mark>; digits <mark>0,8</mark>.'}}],
examples:[
{q:{hi:'"M" का दर्पण प्रतिबिंब?',en:'Mirror image of "M"?'},
s:{hi:'M सममित है → <mark>M</mark> ही दिखेगा।',en:'M is symmetric → <mark>M</mark>.'}},
{q:{hi:'तीर → का जल प्रतिबिंब?',en:'Water image of arrow →?'},
s:{hi:'ऊपर-नीचे उल्टा, पर तीर क्षैतिज है → <mark>→</mark> ही रहेगा।',en:'Horizontal arrow unchanged → <mark>→</mark>.'}}],
quiz:[
{q:{hi:'"P" का दर्पण प्रतिबिंब कैसा दिखेगा?',en:'Mirror image of "P"?'},
o:[{hi:'P (समान)',en:'P (same)'},{hi:'q जैसा',en:'Like q'},{hi:'उल्टा P (बायाँ-दायाँ)',en:'Flipped P'},{hi:'b जैसा',en:'Like b'}],a:2,
e:{hi:'बायाँ-दायाँ उल्टा → P का दर्पण (गोल भाग बाईं ओर)।',en:'Left-right flip.'}},
{q:{hi:'"8" का जल प्रतिबिंब?',en:'Water image of "8"?'},
o:[{hi:'8 (समान)',en:'8 (same)'},{hi:'0',en:'0'},{hi:'∞ जैसा',en:'Like ∞'},{hi:'6',en:'6'}],a:0,
e:{hi:'8 ऊपर-नीचे सममित → समान।',en:'8 is vertically symmetric.'}},
{q:{hi:'कागज़ को बीच से मोड़कर एक कोने पर छेद किया। खोलने पर कितने छेद?',en:'Fold once, punch corner. Holes on opening?'},
o:[{hi:'1',en:'1'},{hi:'2',en:'2'},{hi:'4',en:'4'},{hi:'3',en:'3'}],a:1,
e:{hi:'एक मोड़ → सममित 2 छेद।',en:'One fold → 2 symmetric holes.'}},
{q:{hi:'"W" का दर्पण प्रतिबिंब?',en:'Mirror image of "W"?'},
o:[{hi:'M',en:'M'},{hi:'W (समान)',en:'W (same)'},{hi:'E',en:'E'},{hi:'3',en:'3'}],a:1,
e:{hi:'W दर्पण-सममित → समान।',en:'W is mirror-symmetric.'}},
{q:{hi:'"b" का जल प्रतिबिंब?',en:'Water image of "b"?'},
o:[{hi:'b (समान)',en:'b (same)'},{hi:'d',en:'d'},{hi:'p',en:'p'},{hi:'q',en:'q'}],a:3,
e:{hi:'b ऊपर-नीचे उल्टा → q जैसा आकार।',en:'b flipped vertically ≈ q.'}}]});
})();
