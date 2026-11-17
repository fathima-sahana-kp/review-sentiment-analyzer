// Rule-based sentiment analysis (a basic NLP technique, no external API).
// Pipeline: 1) tokenize  2) remove stop words  3) score words with a lexicon
//           4) handle negation ("not good") and intensifiers ("very good")
//           5) add up the scores and decide the label

// Words with a sentiment score from -3 (very negative) to +3 (very positive)
const LEXICON = {
  // positive
  excellent: 3, amazing: 3, outstanding: 3, perfect: 3, fantastic: 3, awesome: 3, love: 3, loved: 3,
  great: 2, good: 2, nice: 2, happy: 2, best: 2, beautiful: 2, comfortable: 2, fast: 2, smooth: 2,
  recommend: 2, recommended: 2, worth: 2, impressed: 2, satisfied: 2, durable: 2, helpful: 2, reliable: 2,
  like: 1, liked: 1, decent: 1, fine: 1, useful: 1, easy: 1, cheap: 1, affordable: 1, quick: 1, clean: 1,
  // negative
  terrible: -3, horrible: -3, awful: -3, worst: -3, hate: -3, hated: -3, useless: -3, disgusting: -3,
  bad: -2, poor: -2, broken: -2, waste: -2, disappointed: -2, disappointing: -2, slow: -2, defective: -2,
  fake: -2, cheaply: -2, refund: -2, damaged: -2, faulty: -2, scam: -3,
  boring: -1, expensive: -1, difficult: -1, late: -1, small: -1, loose: -1, noisy: -1, uncomfortable: -2,
};

// Very common words that carry no sentiment on their own
const STOP_WORDS = new Set([
  "the", "a", "an", "is", "are", "was", "were", "it", "this", "that", "i", "me", "my", "we", "and", "or",
  "but", "of", "to", "in", "on", "for", "with", "at", "as", "be", "been", "so", "they", "them", "its",
  "have", "has", "had", "you", "your", "from", "by", "just", "also", "than", "then", "there", "these",
]);

const NEGATIONS = new Set(["not", "no", "never", "hardly", "without", "cannot"]);
const INTENSIFIERS = { very: 1.5, really: 1.5, extremely: 2, super: 1.5, so: 1.2, too: 1.3, quite: 1.2 };

// Step 1: split the text into lowercase words
export function tokenize(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z'\s]/g, " ") // keep letters and apostrophes (for "don't")
    .split(/\s+/)
    .filter(Boolean);
}

function isNegation(word) {
  return NEGATIONS.has(word) || word.endsWith("n't");
}

export function analyze(text) {
  const tokens = tokenize(text);
  const details = [];
  let total = 0;
  let negationLeft = 0; // a negation affects the next 2 words
  let boost = 1;

  for (const word of tokens) {
    // Step 2: stop words are skipped
    if (STOP_WORDS.has(word) && !(word in INTENSIFIERS)) {
      details.push({ word, kind: "stop", value: 0 });
      continue;
    }
    // Step 4a: negation and intensifiers change the next word
    if (isNegation(word)) {
      negationLeft = 2;
      details.push({ word, kind: "modifier", value: 0, note: "negation" });
      continue;
    }
    if (word in INTENSIFIERS) {
      boost = INTENSIFIERS[word];
      details.push({ word, kind: "modifier", value: 0, note: "intensifier" });
      continue;
    }
    // Step 3: look the word up in the lexicon
    let value = LEXICON[word] ?? 0;
    if (value !== 0) {
      value *= boost;
      const negated = negationLeft > 0;
      if (negated) value *= -1;
      total += value;
      details.push({ word, kind: value > 0 ? "positive" : "negative", value, negated });
    } else {
      details.push({ word, kind: "neutral", value: 0 });
    }
    if (negationLeft > 0) negationLeft -= 1;
    boost = 1;
  }

  // Step 5: decide the label
  total = Math.round(total * 10) / 10;
  let label = "Neutral";
  if (total >= 1) label = "Positive";
  if (total <= -1) label = "Negative";

  const scored = details.filter((d) => d.value !== 0).length;
  return { label, score: total, tokens: tokens.length, scored, details };
}
