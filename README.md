# Review Sentiment Analyzer

A small NLP project built with Next.js (App Router) and React. It reads a product review and
classifies it as Positive, Negative or Neutral, and shows which words decided the result.

## How the NLP works (lib/sentiment.js)
1. Tokenization: the text is lowercased and split into words.
2. Stop-word removal: very common words (the, is, and) are ignored.
3. Lexicon scoring: each word is looked up in a list of scored words (-3 to +3).
4. Negation and intensifiers: "not good" flips the score, "very good" strengthens it.
5. The scores are summed. +1 or more is Positive, -1 or less is Negative, otherwise Neutral.

Limits: rule-based, so it misses sarcasm and words that are not in the lexicon.
Ideas to extend: bigger lexicon, a trained model, analyzing reviews from the FakeStore API.

## Run locally
```
npm install
npm run dev
```
Open http://localhost:3000

## Deploy
Push to GitHub, then import the repository in Vercel (framework: Next.js, no settings needed).
