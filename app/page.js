"use client";

import { useState } from "react";
import { analyze } from "../lib/sentiment";

const SAMPLES = [
  "The headphones are excellent, very comfortable and the sound is amazing. Totally worth the price!",
  "Terrible quality. The strap was broken in two days and the support was useless.",
  "The delivery was not late, but the product is not good. Honestly a waste of money.",
];

export default function Home() {
  const [text, setText] = useState(SAMPLES[0]);
  const [result, setResult] = useState(() => analyze(SAMPLES[0]));

  function run(value) {
    setText(value);
    setResult(analyze(value));
  }

  const meterPos = Math.max(-6, Math.min(6, result.score));
  const meterLeft = ((meterPos + 6) / 12) * 100;

  return (
    <main className="wrap">
      <header>
        <h1>Review Sentiment Analyzer</h1>
        <p className="lead">
          Paste a product review. The app reads it word by word and tells you if it sounds positive,
          negative or neutral, and which words decided it.
        </p>
      </header>

      <section className="panel">
        <label htmlFor="review">Your review</label>
        <textarea
          id="review"
          rows={5}
          value={text}
          onChange={(e) => run(e.target.value)}
          placeholder="Type or paste a review here"
        />
        <div className="samples">
          <span>Try an example:</span>
          {SAMPLES.map((s, i) => (
            <button key={i} type="button" onClick={() => run(s)}>
              Example {i + 1}
            </button>
          ))}
        </div>
      </section>

      <section className="panel result" aria-live="polite">
        {result.tokens === 0 ? (
          <p className="empty">Type a review above to see the result.</p>
        ) : (
          <>
            <div className="verdict-row">
              <h2 className={"verdict " + result.label.toLowerCase()}>{result.label}</h2>
              <p className="score">Score {result.score > 0 ? "+" : ""}{result.score}</p>
            </div>

            <div className="meter" role="img" aria-label={`Score ${result.score} on a scale from -6 to +6`}>
              <div className="meter-track" />
              <div className="meter-dot" style={{ left: meterLeft + "%" }} />
              <span className="meter-l">Negative</span>
              <span className="meter-r">Positive</span>
            </div>

            <h3>Word by word</h3>
            <p className="legend">
              <span className="chip positive">positive</span>
              <span className="chip negative">negative</span>
              <span className="chip modifier">changes the next word</span>
              <span className="chip stop">ignored</span>
            </p>
            <p className="words">
              {result.details.map((d, i) => (
                <span
                  key={i}
                  className={"chip " + d.kind}
                  title={
                    d.value !== 0
                      ? `${d.value > 0 ? "+" : ""}${d.value}${d.negated ? " (flipped by negation)" : ""}`
                      : d.note || d.kind
                  }
                >
                  {d.word}
                  {d.value !== 0 && <b> {d.value > 0 ? "+" : ""}{d.value}</b>}
                </span>
              ))}
            </p>
            <p className="summary">
              {result.tokens} words read, {result.scored} carried a sentiment score. Score is the sum of
              those word scores.
            </p>
          </>
        )}
      </section>
    </main>
  );
}
