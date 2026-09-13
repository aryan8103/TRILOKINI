export default function StatCard({ title, value, icon: Icon, subtitle }) {
  return (
    <div className="rounded-2xl p-5 bg-[var(--card-bg)] border border-[var(--border-color)] hover:border-[var(--primary)] transition-all cursor-default">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-medium text-[var(--text-muted)]">{title}</h3>
        <div className="p-2.5 rounded-xl bg-[rgba(124,109,250,0.12)] text-[var(--primary)]">
          <Icon size={20} />
        </div>
      </div>
      <div className="mt-3 text-3xl font-bold text-white">{value}</div>
      {subtitle && <p className="text-xs text-[var(--text-muted)] mt-1">{subtitle}</p>}
    </div>
  );
}
