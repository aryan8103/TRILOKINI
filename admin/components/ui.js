export function StatusBadge({ value, yesLabel = "Yes", noLabel = "No" }) {
  const on = Boolean(value);
  return (
    <span className={`admin-badge ${on ? "admin-badge-yes" : "admin-badge-no"}`}>
      {on ? yesLabel : noLabel}
    </span>
  );
}

export function Pill({ children, tone = "info" }) {
  const cls = {
    info: "admin-badge-info",
    yes: "admin-badge-yes",
    no: "admin-badge-no",
    warn: "admin-badge-warn",
  }[tone] || "admin-badge-info";
  return <span className={`admin-badge ${cls}`}>{children}</span>;
}

export function PageToolbar({ title, description, action }) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold text-white">{title}</h1>
        {description && <p className="text-sm text-[var(--text-muted)] mt-0.5">{description}</p>}
      </div>
      {action && (
        <div className="flex items-center gap-3 w-full sm:w-auto">
          {action}
        </div>
      )}
    </div>
  );
}

export function EmptyThumb({ className = "w-12 h-12 rounded-lg" }) {
  return <div className={`admin-thumb ${className}`}>No img</div>;
}
