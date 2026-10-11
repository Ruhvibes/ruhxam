/* RuhXam — exam patterns (Railway only: NTPC + Group D) */
var RT_EXAMS = {
  'ntpc': {
    id:'ntpc', short:{hi:'NTPC',en:'NTPC'},
    name:{hi:'RRB NTPC CBT-1', en:'RRB NTPC CBT-1'},
    pattern:{hi:'100 प्रश्न (40 GA + 30 गणित + 30 तर्कशक्ति)', en:'100 Q (40 GA + 30 Maths + 30 Reasoning)'},
    maths:30, reas:30, science:0, timeMin:90, neg:1/3, negLabel:'-1/3'
  },
  'groupd': {
    id:'groupd', short:{hi:'Group D',en:'Group D'},
    name:{hi:'RRB Group D CBT', en:'RRB Group D CBT'},
    pattern:{hi:'100 प्रश्न (25 गणित + 30 तर्कशक्ति + 25 विज्ञान + 20 GA)', en:'100 Q (25 Maths + 30 Reasoning + 25 Science + 20 GA)'},
    maths:25, reas:30, science:15, timeMin:90, neg:1/3, negLabel:'-1/3'
  }
};
function RT_exam(){ return RT_EXAMS[(window.RT&&RT.examId)||'ntpc']; }
