(function() {
  'use strict';
  // A sequence is an array of junctions.
  // A junction is an array of variant sequences.
  // A string is a junction of only one variation, and a sequence of only one junction.
  // `variants` is a sequence.

  function getJunctionVariationCount(junction) {
    return Array.isArray(junction) ?
      junction.map(getSequenceVariationCount).reduce((m, n) => m + n) : 1;
  }
  function getSequenceVariationCount(sequence) {
    return Array.isArray(sequence) ?
      sequence.map(getJunctionVariationCount).reduce((m, n) => m * n) : 1;
  }

  function getJunctionEvaluation(junction, variation, count) {
    if (Array.isArray(junction)) {
      let i = 0;
      let svcount = getSequenceVariationCount(junction[i]);
      while (variation >= svcount) {
        variation -= svcount;
        svcount = getSequenceVariationCount(junction[++i]);
      }
      return getSequenceEvaluation(junction[i], variation, svcount);
    } else {
      return junction;
    }
  }
  function getSequenceEvaluation(sequence, variation, count) {
    if (Array.isArray(sequence)) {
      let buffer = [];
      for (let i = 0; i < sequence.length; i++) {
        let jvcount = getJunctionVariationCount(sequence[i]);
        count /= jvcount;
        let subvar = Math.floor(variation / count);//
        //let remainder = variation % count;
        //let subvar = (variation - remainder) / count;
        //variation = remainder;
        buffer[i] = getJunctionEvaluation(sequence[i], subvar, jvcount);
        variation %= count;//
      }
      return buffer.join('');
    } else {
      return sequence;
    }
  }
  function getAllSequenceEvaluations(sequence) {
    let count = getSequenceVariationCount(sequence);
    let evaluations = [];
    for (let i = 0; i < count; i++) {
      evaluations[i] = getSequenceEvaluation(sequence, i, count);
    }
    return evaluations;
  }
  let example = getAllSequenceEvaluations([
    ["It took ","It takes ","It'll take "],
    [ ["a strong ", ["gut ","arm ","tongue ","throat "]],
      ["a lot of ", ["guts ","gusto ","chutzpah ","mass "]] ],
    "to ",
    ["topple ", "beat ", "overtake "],
    ["Wade Boggs' ", "Boss Hogg's "],
    ["current ", "standing ", "epic ", "legendary "],
    "record"
    ]);
  console.log(example);
})();
