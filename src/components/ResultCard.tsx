type ResultCardProps = {
  title: string;
  badge: string;
  accent: string;
  text: string;
  onCopy: () => void;
};

export function ResultCard({ title, badge, accent, text, onCopy }: ResultCardProps) {
  return (
    <div className="relative group rounded-2xl border border-slate-800 bg-slate-950/90 p-3 flex flex-col justify-between min-h-[9.5rem] overflow-hidden">
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute -inset-px bg-gradient-to-br ${accent} via-transparent to-transparent opacity-0 group-hover:opacity-20 transition`}
      />
      <div className="relative z-10 flex items-center justify-between gap-2 mb-2">
        <div>
          <h4 className="text-[0.8rem] font-semibold text-slate-50">
            {title}
          </h4>
          <span className="inline-flex mt-1 px-2 py-0.5 rounded-full text-[0.6rem] bg-slate-900/80 border border-slate-700 text-slate-200 uppercase tracking-wide">
            {badge}
          </span>
        </div>
        <button
          type="button"
          onClick={onCopy}
          className="text-[0.65rem] px-2 py-1 rounded-full border border-slate-700 bg-slate-950/80 text-slate-300 hover:border-sky-400 hover:text-sky-100 transition"
        >
          Copy
        </button>
      </div>
      <p className="relative z-10 text-[0.78rem] text-slate-200 leading-relaxed">
        {text}
      </p>
    </div>
  );
}
