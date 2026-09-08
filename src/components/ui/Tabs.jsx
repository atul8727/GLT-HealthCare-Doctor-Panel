export default function Tabs({ tabs, active, onChange }) {
  return (
    <div className="flex items-center gap-1 border-b border-slate-200 overflow-x-auto scrollbar-hide">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => onChange(tab)}
          className={`px-4 py-2.5 text-sm font-semibold whitespace-nowrap border-b-2 rounded-t-md transition-colors ${
            active === tab
              ? "border-primary text-primary bg-primary-light/60"
              : "border-transparent text-muted hover:text-navy hover:bg-slate-50"
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}
