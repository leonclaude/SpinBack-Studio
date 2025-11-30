type AboutModalProps = {
  onClose: () => void;
};

export function AboutModal({ onClose }: AboutModalProps) {
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/75 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl border border-slate-700 bg-slate-950 shadow-[0_24px_120px_rgba(15,23,42,0.95)] px-5 py-5 space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-base font-semibold text-slate-50">
            SpinBack Studio · About
          </h2>
          <button
            onClick={onClose}
            className="text-xs text-slate-400 hover:text-sky-200"
          >
            Close
          </button>
        </div>

        <div className="space-y-3">
          <p className="text-[0.8rem] text-slate-200 leading-relaxed">
            SpinBack Studio is a demo tool that rephrases dense clauses into
            four non-legal "vibe" styles — Plain, Cheeky, PSA, and Succulent
            Tech Tone.
          </p>
          <p className="text-[0.8rem] text-slate-200 leading-relaxed">
            It helps surface tone, texture, and human readability without
            advising on legal meaning, enforceability, or risk.
          </p>
        </div>

        <div className="space-y-2">
          <h3 className="text-[0.8rem] font-semibold text-slate-100">
            What it does
          </h3>
          <ul className="space-y-1 text-[0.75rem] text-slate-300 list-disc list-inside">
            <li>Reframes text into stylistic variations</li>
            <li>Helps users notice tone, assumptions, and patterns</li>
            <li>Supports awareness and consumer education</li>
            <li>Showcases creative UX + model prompting</li>
          </ul>
        </div>

        <div className="space-y-2">
          <h3 className="text-[0.8rem] font-semibold text-slate-100">
            What it does NOT do
          </h3>
          <ul className="space-y-1 text-[0.75rem] text-slate-300 list-disc list-inside">
            <li>It does not provide legal advice</li>
            <li>It does not summarize, interpret, or explain legal meaning</li>
            <li>It does not assess enforceability</li>
            <li>It does not replace professional legal review</li>
          </ul>
        </div>

        <div className="pt-2 space-y-2 border-t border-slate-800">
          <p className="text-[0.75rem] text-slate-400 leading-relaxed">
            For serious legal questions, consult a qualified attorney.
          </p>
          <p className="text-[0.75rem] text-slate-400 leading-relaxed">
            For consumer-rights tooling, see Peeved/Pleased Patron (private
            ecosystem).
          </p>
        </div>
      </div>
    </div>
  );
}
