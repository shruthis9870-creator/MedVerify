export default function PageShell({ title, subtitle, status, footer, children }) {
  return (
    <div className="space-y-8">
      <div className="rounded-[32px] bg-white p-8 shadow-sm ring-1 ring-slate-200">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500">{status || "Overview"}</p>
            <h1 className="mt-2 text-4xl font-semibold text-slate-900">{title}</h1>
            <p className="mt-3 max-w-2xl text-sm text-slate-500">{subtitle}</p>
          </div>
        </div>
      </div>

      <div>{children}</div>

      {footer && (
        <div className="rounded-[32px] bg-slate-50 p-6 shadow-sm ring-1 ring-slate-200">
          {footer}
        </div>
      )}
    </div>
  );
}
