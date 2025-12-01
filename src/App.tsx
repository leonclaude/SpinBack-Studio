import { useState } from "react";
import { ResultCard } from "./components/ResultCard";
import { AboutModal } from "./components/AboutModal";
import type { SpinbackResult, ExampleClause } from "./types";

const EXAMPLE_CLAUSES: ExampleClause[] = [
  {
    label: "Perpetual promotional rights",
    text: "By submitting your project, you grant us a non-exclusive, worldwide, perpetual right to use, reproduce, display, and share your submission for marketing and promotional purposes.",
  },
  {
    label: "Content posted in community channels",
    text: "Any content you post in our community channels, including messages, links, and images, may be used by us for community engagement, marketing, and future promotional campaigns.",
  },
  {
    label: "Data sharing with partners",
    text: "We may share your information with trusted third-party partners for analytics, advertising, and service improvement purposes.",
  },
];

function App() {
  const [clause, setClause] = useState("");
  const [result, setResult] = useState<SpinbackResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAbout, setShowAbout] = useState(false);

  const handleGenerate = async () => {
    setError(null);
    setResult(null);

    if (!clause.trim()) {
      setError("Drop a clause in first — even sorcery needs an ingredient.");
      return;
    }

    setLoading(true);
    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

      const apiUrl = `${supabaseUrl}/functions/v1/remix`;

      const res = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${supabaseAnonKey}`,
        },
        body: JSON.stringify({ clause }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to generate spinbacks.");
      }

      const data = (await res.json()) as SpinbackResult;
      setResult(data);
    } catch (err: unknown) {
      console.error(err);
      const errorMessage = err instanceof Error ? err.message : "Something slipped. Try again in a few seconds.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleUseExample = (text: string) => {
    setClause(text);
    setResult(null);
    setError(null);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text).catch(() => undefined);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-50">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.18),_transparent_55%),radial-gradient(circle_at_bottom,_rgba(168,85,247,0.16),_transparent_55%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.13] mix-blend-screen bg-[linear-gradient(to_right,_rgba(148,163,184,0.25)_1px,transparent_1px),linear-gradient(to_bottom,_rgba(148,163,184,0.18)_1px,transparent_1px)] bg-[size:40px_40px]"
      />

      <header className="relative z-10 border-b border-slate-800/80 backdrop-blur-sm bg-slate-950/70">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between gap-4">
          <div className="space-y-0.5">
            <div className="inline-flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.8)]" />
              <h1 className="text-lg sm:text-xl font-semibold tracking-tight">
                SpinBack Studio
              </h1>
            </div>
            <p className="text-xs sm:text-[0.75rem] text-slate-400">
              Clause Reframe Console — Four non-legal 'vibe' interpretations of dense text.
            </p>
          </div>
          <button
            onClick={() => setShowAbout(true)}
            className="text-[0.7rem] sm:text-xs px-3 py-1.5 rounded-full border border-slate-700/80 bg-slate-900/70 hover:border-sky-400 hover:text-sky-100 hover:bg-slate-900 transition"
          >
            About this demo
          </button>
        </div>
      </header>

      <main className="relative z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
          <div className="rounded-3xl border border-slate-700/70 bg-slate-950/85 shadow-[0_0_0_1px_rgba(15,23,42,0.9),0_32px_120px_rgba(15,23,42,0.95)] overflow-hidden">
            <div className="flex items-center justify-between px-4 sm:px-6 py-2.5 border-b border-slate-800/80 bg-gradient-to-r from-slate-950/90 via-slate-900/70 to-slate-950/90">
              <div className="flex items-center gap-2">
                <span className="flex gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-rose-500/80" />
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-400/80" />
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
                </span>
                <span className="text-[0.7rem] uppercase tracking-[0.18em] text-slate-500">
                  SPINBACK SESSION
                </span>
              </div>
              <span className="text-[0.65rem] text-slate-500">
                Mode: <span className="text-sky-300">Public Demo</span>
              </span>
            </div>

            <div className="px-4 sm:px-6 py-5 sm:py-7 space-y-6">
              <section className="space-y-1.5">
                <h2 className="text-base sm:text-lg font-semibold">
                  Paste a clause. Watch the spinbacks snap into place.
                </h2>
                <p className="text-xs sm:text-[0.8rem] text-slate-400 max-w-2xl">
                  SpinBack Studio is a lightweight, public-tier tool for
                  reframing dense clauses into human language. It doesn&apos;t
                  give legal advice—just tone shifts you&apos;d be fine seeing
                  screenshotted and shared.
                </p>
                <p className="mt-2 text-sm text-slate-300">
                  It helps you see the intent and tone behind dense clauses — the part companies never spell out.
                </p>
              </section>

              <section className="flex flex-col gap-6 lg:flex-row lg:items-start">
                <div className="w-full lg:w-[65%] space-y-3">
                  <div className="space-y-2">
                    <label className="text-[0.7rem] uppercase tracking-wide text-slate-400">
                      Input clause
                    </label>
                    <div className="relative">
                      <textarea
                        value={clause}
                        onChange={(e) => setClause(e.target.value)}
                        placeholder="Paste a clause from terms, privacy policies, hackathon rules, or content licenses…"
                        className="w-full h-40 sm:h-48 rounded-xl border border-slate-800 bg-slate-950/90 px-3 py-2 text-xs sm:text-[0.83rem] leading-relaxed placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-sky-500/60 focus:border-sky-400/80 resize-vertical"
                      />
                      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-8 rounded-b-xl bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />
                    </div>
                  </div>

                  <div className="rounded-lg border border-amber-900/70 bg-amber-950/30 px-3 py-2.5 space-y-1">
                    <p className="text-[0.75rem] font-medium text-amber-200">
                      ⚠️ Not legal advice.
                    </p>
                    <p className="text-[0.7rem] text-amber-300/90 leading-relaxed">
                      SpinBack Studio rephrases text into four stylistic 'vibes' for awareness and entertainment.
                      Outputs may be incomplete, inaccurate, or misleading. Do not rely on them for legal decisions.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center justify-end gap-3">
                    <button
                      type="button"
                      onClick={handleGenerate}
                      disabled={loading}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-sky-500 hover:bg-sky-400 disabled:opacity-60 disabled:hover:bg-sky-500 px-4 py-2 text-[0.75rem] sm:text-xs font-medium text-slate-950 transition shadow-[0_0_18px_rgba(56,189,248,0.55)]"
                    >
                      {loading && (
                        <span className="h-3 w-3 rounded-full border-2 border-slate-950 border-l-transparent animate-spin" />
                      )}
                      {loading ? "Spinning…" : "Generate Spinbacks"}
                    </button>
                  </div>

                  {error && (
                    <p className="text-[0.72rem] text-rose-400 bg-rose-950/40 border border-rose-900/70 rounded-lg px-3 py-2 mt-1">
                      {error}
                    </p>
                  )}
                </div>

                <aside className="w-full lg:w-[35%] space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-[0.7rem] uppercase tracking-wide text-slate-400">
                      Quick-start clauses
                    </h3>
                    <span className="text-[0.65rem] text-slate-500">
                      Tap to insert
                    </span>
                  </div>
                  <div className="space-y-2">
                    {EXAMPLE_CLAUSES.map((ex) => (
                      <button
                        key={ex.label}
                        type="button"
                        onClick={() => handleUseExample(ex.text)}
                        className="w-full text-left rounded-xl border border-slate-800 bg-slate-950/80 hover:border-sky-400/70 hover:bg-slate-950/95 transition px-3 py-2.5 text-xs sm:text-sm"
                      >
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <span className="text-[0.75rem] font-medium text-slate-100">
                            {ex.label}
                          </span>
                          <span className="text-[0.6rem] uppercase tracking-wide text-slate-500">
                            Insert
                          </span>
                        </div>
                        <p className="text-[0.7rem] text-slate-400 line-clamp-3">
                          {ex.text}
                        </p>
                      </button>
                    ))}
                  </div>
                  <p className="text-[0.68rem] text-slate-500">
                    These are generic sample clauses for demonstration only. You
                    can paste any text you want to see rephrased.
                  </p>
                </aside>
              </section>

              <section className="space-y-3 pt-1">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-[0.7rem] uppercase tracking-wide text-slate-400">
                      Reframed Vibes (non-legal styles):
                    </h3>
                    <div className="relative group">
                      <span className="cursor-help text-xs text-slate-400 border border-slate-600 rounded-full px-1.5 py-0.5 whitespace-nowrap">
                        Why four styles?
                      </span>
                      <div className="absolute z-20 mt-2 left-0 hidden w-64 max-w-[calc(100vw-2rem)] rounded-md border border-slate-700 bg-slate-900/95 px-3 py-2 text-xs text-slate-200 shadow-lg group-hover:block">
                        <p className="font-semibold mb-1">Each style exposes a different dimension of the clause:</p>
                        <ul className="list-disc list-inside space-y-0.5">
                          <li><span className="font-semibold">Plain</span> → clarity</li>
                          <li><span className="font-semibold">Cheeky</span> → tone</li>
                          <li><span className="font-semibold">PSA</span> → safety awareness</li>
                          <li><span className="font-semibold">Succulent</span> → memorability</li>
                        </ul>
                        <p className="mt-1 text-[0.68rem] text-slate-400">
                          This isn&apos;t humor — it&apos;s multi-angle comprehension.
                        </p>
                      </div>
                    </div>
                  </div>
                  {result && (
                    <span className="text-[0.65rem] text-slate-500">
                      Engineered to be safe to screenshot &amp; share.
                    </span>
                  )}
                </div>

                {!result && !loading && !error && (
                  <p className="text-[0.78rem] text-slate-500">
                    When you generate spinbacks, you&apos;ll see four short
                    reframes here: plain language, cheeky, PSA, and our
                    signature Succulent Tech Tone.
                  </p>
                )}

                {result && (
                  <>
                    <div className="rounded-xl border border-slate-700/70 bg-slate-900/50 px-4 py-3 space-y-2">
                      <h4 className="text-[0.8rem] font-semibold text-slate-100">
                        Tone Signal (non-legal linguistic vibe):
                      </h4>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${
                            result.toneSignal === "green"
                              ? "bg-emerald-500/15 text-emerald-300"
                              : result.toneSignal === "yellow"
                              ? "bg-amber-500/15 text-amber-300"
                              : "bg-rose-500/15 text-rose-300"
                          }`}
                        >
                          {result.toneSignal === "green" && "🟢 Typical phrasing"}
                          {result.toneSignal === "yellow" &&
                            "🟡 Broad or open-ended-sounding phrasing"}
                          {result.toneSignal === "red" &&
                            "🔴 Heavy, strongly one-sided or perpetual-sounding phrasing"}
                        </span>
                        <span className="text-[0.8rem] text-slate-200">
                          {result.toneReason}
                        </span>
                      </div>
                      <p className="text-[0.7rem] text-slate-400 italic">
                        Tone signals describe how the wording feels to a typical
                        reader, not legal meaning or risk.
                      </p>
                    </div>

                    <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                    <ResultCard
                      title="Plain language"
                      badge="The Naked Ingredient"
                      accent="from-sky-500/40"
                      text={result.plain}
                      variant="plain"
                      onCopy={() => handleCopy(result.plain)}
                    />
                    <ResultCard
                      title="Cheeky reframe"
                      badge="The Wink"
                      accent="from-amber-400/50"
                      text={result.cheeky}
                      variant="cheeky"
                      onCopy={() => handleCopy(result.cheeky)}
                    />
                    <ResultCard
                      title="PSA / awareness"
                      badge="The Quick Bite"
                      accent="from-emerald-400/50"
                      text={result.psa}
                      variant="psa"
                      onCopy={() => handleCopy(result.psa)}
                    />
                    <ResultCard
                      title="Succulent Tech Tone"
                      badge="The Full Flavor"
                      accent="from-fuchsia-400/55"
                      text={result.succulent}
                      variant="succulent"
                      onCopy={() => handleCopy(result.succulent)}
                    />
                  </div>
                  </>
                )}
              </section>
            </div>
          </div>
        </div>
      </main>

      <footer className="relative z-10 border-t border-slate-800/80 bg-slate-950/90 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-3 space-y-2">
          <p className="text-[0.72rem] text-slate-300">
            Designed for awareness, transparency, and shareability — not legal judgment.
          </p>
          <p className="text-[0.7rem] text-slate-500 leading-relaxed">
            SpinBack Studio rephrases text into stylistic 'vibes' for awareness and entertainment. It does not summarize, interpret, or explain legal meaning, and it is not legal advice. For serious legal questions, consult a qualified attorney. For consumer-rights tooling, see Peeved/Pleased Patron (private ecosystem).
          </p>
        </div>
      </footer>

      {showAbout && <AboutModal onClose={() => setShowAbout(false)} />}
    </div>
  );
}

export default App;
