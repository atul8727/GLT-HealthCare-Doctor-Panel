export default function Tabs({ tabs, active, onChange }) {
  return (
    <div className="flex items-center gap-1 border-b border-slate-200 overflow-x-auto scrollbar-hide">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => onChange(tab)}
          className={`px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
            active === tab
              ? "border-primary text-primary"
              : "border-transparent text-muted hover:text-navy"
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}
