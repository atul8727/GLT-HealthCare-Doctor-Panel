import { FiInbox } from "react-icons/fi";

export default function EmptyState({ icon: Icon = FiInbox, title = "Nothing here yet", subtitle = "" }) {
  return (
    <div className="flex flex-col items-center justify-center py-14 text-center">
      <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center mb-3">
        <Icon size={24} className="text-muted" />
      </div>
      <p className="text-navy font-medium">{title}</p>
      {subtitle && <p className="text-sm text-muted mt-1 max-w-xs">{subtitle}</p>}
    </div>
  );
}
