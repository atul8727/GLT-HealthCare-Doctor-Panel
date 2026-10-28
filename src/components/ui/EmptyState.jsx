import { FiInbox } from "react-icons/fi";

export default function EmptyState({
  icon: Icon = FiInbox,
  title = "Nothing here yet",
  subtitle = "",
  description = "",
  action,
}) {
  const text = subtitle || description;
  return (
    <div className="flex flex-col items-center justify-center px-4 py-14 text-center">
      <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-[#1D6FE0] shadow-xs">
        <Icon className="h-7 w-7" />
      </div>
      <p className="text-base font-bold text-[#14142B]">{title}</p>
      {text && <p className="mt-1 max-w-sm text-sm text-[#64748B]">{text}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}