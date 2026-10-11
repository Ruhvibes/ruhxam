/* RuhXam — Maths Ch 21-22 */
window.RT_CH = window.RT_CH || [];
(function(){
var P='maths';
RT_CH.push({id:'m21',part:P,num:21,kind:'tricks',exams:['all'],
title:{hi:'त्रिकोणमिति',en:'Trigonometry'},
concept:{hi:'समकोण त्रिभुज में: <mark>sinθ = लंब/कर्ण, cosθ = आधार/कर्ण, tanθ = लंब/आधार</mark>।',en:'In right triangle: <mark>sinθ = opp/hyp, cosθ = adj/hyp, tanθ = opp/adj</mark>.'},
tricks:[
{h:{hi:'मान तालिका',en:'Value table'},b:{hi:'<mark>sin: 0°=0, 30°=1/2, 45°=1/√2, 60°=√3/2, 90°=1</mark><br><mark>cos: उल्टा क्रम</mark> (1, √3/2, 1/√2, 1/2, 0)<br><mark>tan: 0, 1/√3, 1, √3, ∞</mark>',en:'<mark>sin 0/30/45/60/90 = 0, 1/2, 1/√2, √3/2, 1</mark>; cos reversed; tan = 0, 1/√3, 1, √3, ∞.'}},
{h:{hi:'मुख्य सर्वसमिका',en:'Key identity'},b:{hi:'<mark>sin²θ + cos²θ = 1</mark><br><mark>1 + tan²θ = sec²θ</mark><br><mark>1 + cot²θ = cosec²θ</mark>',en:'<mark>sin²+cos²=1</mark>; 1+tan²=sec².'}},
{h:{hi:'पूरक कोण',en:'Complementary angles'},b:{hi:'<mark>sin(90−θ) = cosθ</mark>, tan(90−θ) = cotθ।',en:'<mark>sin(90−θ)=cosθ</mark>.'}}],
examples:[
{q:{hi:'sin²30° + cos²30° = ?',en:'sin²30° + cos²30° = ?'},
s:{hi:'सर्वसमिका से = <mark>1</mark>।',en:'Identity → <mark>1</mark>.'}},
{q:{hi:'tan45° × sin90° = ?',en:'tan45° × sin90° = ?'},
s:{hi:'1 × 1 = <mark>1</mark>।',en:'1×1 = <mark>1</mark>.'}}],
quiz:[
{q:{hi:'sin60° का मान?',en:'Value of sin60°?'},
o:[{hi:'1/2',en:'1/2'},{hi:'√3/2',en:'√3/2'},{hi:'1/√2',en:'1/√2'},{hi:'1',en:'1'}],a:1,
e:{hi:'sin60° = √3/2।',en:'√3/2.'}},
{q:{hi:'cos0° = ?',en:'cos0° = ?'},
o:[{hi:'0',en:'0'},{hi:'1',en:'1'},{hi:'1/2',en:'1/2'},{hi:'∞',en:'∞'}],a:1,
e:{hi:'cos0° = 1।',en:'cos0° = 1.'}},
{q:{hi:'tan²45° + 1 = ?',en:'tan²45° + 1 = ?'},
o:[{hi:'1',en:'1'},{hi:'2',en:'2'},{hi:'0',en:'0'},{hi:'√2',en:'√2'}],a:1,
e:{hi:'1+1 = 2 (= sec²45°)।',en:'1+1 = 2.'}},
{q:{hi:'sin(90°−θ) = ?',en:'sin(90°−θ) = ?'},
o:[{hi:'sinθ',en:'sinθ'},{hi:'cosθ',en:'cosθ'},{hi:'tanθ',en:'tanθ'},{hi:'−cosθ',en:'−cosθ'}],a:1,
e:{hi:'sin(90−θ) = cosθ।',en:'= cosθ.'}},
{q:{hi:'यदि tanθ = 1, तो θ (0-90°) = ?',en:'tanθ=1, θ (0–90°)?'},
o:[{hi:'30°',en:'30°'},{hi:'60°',en:'60°'},{hi:'45°',en:'45°'},{hi:'90°',en:'90°'}],a:2,
e:{hi:'tan45° = 1।',en:'tan45° = 1.'}}]});

RT_CH.push({id:'m22',part:P,num:22,kind:'tricks',exams:['all'],
title:{hi:'सांख्यिकी (माध्य, माध्यिका, बहुलक)',en:'Statistics (Mean, Median, Mode)'},
concept:{hi:'<mark>माध्य (Mean)</mark> = औसत। <mark>माध्यिका (Median)</mark> = क्रमबद्ध आँकड़ों का मध्य मान। <mark>बहुलक (Mode)</mark> = सबसे अधिक बार आया मान।',en:'<mark>Mean</mark> = average; <mark>Median</mark> = middle value; <mark>Mode</mark> = most frequent.'},
tricks:[
{h:{hi:'माध्यिका',en:'Median'},b:{hi:'आँकड़े <mark>आरोही क्रम</mark> में रखें। n विषम → ((n+1)/2)वाँ पद; n सम → मध्य दो पदों का औसत।',en:'Sort ascending. n odd → ((n+1)/2)th term; n even → avg of middle two.'}},
{h:{hi:'बहुलक',en:'Mode'},b:{hi:'सबसे <mark>अधिक आवृत्ति</mark> वाला मान।',en:'Most frequent value.'}},
{h:{hi:'संबंध',en:'Relation'},b:{hi:'<mark>बहुलक = 3×माध्यिका − 2×माध्य</mark> (अनुभवजन्य)।',en:'<mark>Mode = 3×Median − 2×Mean</mark>.'}}],
examples:[
{q:{hi:'2, 5, 3, 5, 4 की माध्यिका?',en:'Median of 2, 5, 3, 5, 4?'},
s:{hi:'क्रम: 2,3,4,5,5 → मध्य पद = <mark>4</mark>।',en:'Sorted: 2,3,4,5,5 → median <mark>4</mark>.'}},
{q:{hi:'2, 5, 3, 5, 4 का बहुलक?',en:'Mode of 2, 5, 3, 5, 4?'},
s:{hi:'5 दो बार आया → बहुलक = <mark>5</mark>।',en:'5 appears twice → mode <mark>5</mark>.'}}],
quiz:[
{q:{hi:'4, 8, 6, 2 का माध्य?',en:'Mean of 4, 8, 6, 2?'},
o:[{hi:'4',en:'4'},{hi:'5',en:'5'},{hi:'6',en:'6'},{hi:'20',en:'20'}],a:1,
e:{hi:'20/4 = 5।',en:'20/4 = 5.'}},
{q:{hi:'3, 7, 7, 2, 9 का बहुलक?',en:'Mode of 3, 7, 7, 2, 9?'},
o:[{hi:'3',en:'3'},{hi:'9',en:'9'},{hi:'7',en:'7'},{hi:'2',en:'2'}],a:2,
e:{hi:'7 सबसे अधिक बार → 7।',en:'7 most frequent.'}},
{q:{hi:'1, 2, 3, 4, 10 की माध्यिका?',en:'Median of 1, 2, 3, 4, 10?'},
o:[{hi:'2',en:'2'},{hi:'3',en:'3'},{hi:'4',en:'4'},{hi:'2.5',en:'2.5'}],a:1,
e:{hi:'क्रमबद्ध मध्य पद = 3।',en:'Middle = 3.'}},
{q:{hi:'2, 4, 6, 8 की माध्यिका?',en:'Median of 2, 4, 6, 8?'},
o:[{hi:'4',en:'4'},{hi:'6',en:'6'},{hi:'5',en:'5'},{hi:'4.5',en:'4.5'}],a:2,
e:{hi:'(4+6)/2 = 5।',en:'(4+6)/2 = 5.'}},
{q:{hi:'माध्य=10, माध्यिका=12 → बहुलक (अनुभवजन्य)?',en:'Mean=10, median=12. Mode?'},
o:[{hi:'14',en:'14'},{hi:'16',en:'16'},{hi:'12',en:'12'},{hi:'8',en:'8'}],a:1,
e:{hi:'3×12 − 2×10 = 36−20 = 16।',en:'36−20 = 16.'}}]});
})();
