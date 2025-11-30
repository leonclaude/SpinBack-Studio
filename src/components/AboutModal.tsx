type AboutModalProps = {
  onClose: () => void;
};

export function AboutModal({ onClose }: AboutModalProps) {
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/75 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-slate-700 bg-slate-950 shadow-[0_24px_120px_rgba(15,23,42,0.95)] px-5 py-4 space-y-3">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-sm font-semibold text-slate-50">
            About SpinBack Studio
          </h2>
          <button
            onClick={onClose}
            className="text-xs text-slate-400 hover:text-sky-200"
          >
            Close
          </button>
        </div>
        <p className="text-[0.8rem] text-slate-200">
          SpinBack Studio is a lightweight, public-tier tool for reframing dense
          clauses into human language. It&apos;s intentionally scoped as a
          simple creativity and awareness demo, not a legal tool.
        </p>
        <p className="text-[0.8rem] text-slate-300">
          It doesn&apos;t analyze enforceability, doesn&apos;t tell you what to
          sign, and doesn&apos;t replace legal advice. It just helps you see the
          tone behind the text in a way that&apos;s safe to screenshot and
          share.
        </p>
        <p className="text-[0.8rem] text-slate-400">
          A deeper, more analytical Terms &amp; Conditions translator is being
          developed privately inside the Peeved/Pleased Patron ecosystem. This
          demo lives at the surface layer on purpose.
        </p>
        <p className="text-[0.7rem] text-slate-500">
          If platforms or hackathons choose to promote this project, they&apos;re
          amplifying exactly what it was built for: helping people understand
          the language that shapes their online lives.
        </p>
      </div>
    </div>
  );
}
