export default function Tabs({ tabs, active, onChange }) {
  return (
    <div className="inline-flex max-w-full overflow-x-auto rounded-[14px] border border-[#E2E8F0] bg-white p-[5px] shadow-xs scrollbar-hide">
      <nav className="flex items-center gap-1">
        {tabs.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => onChange(tab)}
            className={`cursor-pointer whitespace-nowrap rounded-xl px-4 py-1.5 text-sm font-semibold transition-all duration-150 ${
              active === tab
                ? "bg-[#4F46E5] text-white shadow-xs"
                : "text-[#4F46E5] hover:bg-slate-100/70 hover:text-indigo-800"
            }`}
          >
            {tab}
          </button>
        ))}
      </nav>
    </div>
  );
}