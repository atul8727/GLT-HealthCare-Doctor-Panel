import { useAuth } from "../../hooks/useAuth";
import { formatDate } from "../../utils/formatDate";
import { avatarColor, initialsOf } from "../../utils/avatarColor";
import { FiMenu } from "react-icons/fi";

export default function Header({ onMenuClick, title }) {
  const { user } = useAuth();

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good Morning" : hour < 17 ? "Good Afternoon" : "Good Evening";
  const shortName = user?.name?.split(" ").slice(0, 2).join(" ") || "Doctor";

  return (
    <header className="sticky top-0 z-30 bg-card/95 backdrop-blur border-b border-slate-200 px-4 lg:px-6 h-16 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3 min-w-0">
        <button onClick={onMenuClick} className="lg:hidden text-navy p-1.5 -ml-1.5 shrink-0">
          <FiMenu size={22} />
        </button>
        <div className="min-w-0">
          <p className="font-semibold text-navy text-sm lg:text-base truncate">
            {title || `${greeting}, ${shortName}`}
          </p>
          <p className="text-xs text-muted hidden sm:block">
            {formatDate(new Date(), "EEEE, MMMM d, yyyy")}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2.5 pl-3 border-l border-slate-200 shrink-0">
        <div
          className={`w-9 h-9 rounded-full flex items-center justify-center text-white font-semibold text-sm shrink-0 shadow-sm ${avatarColor(
            user?.id
          )}`}
        >
          {initialsOf(user?.name || "Doctor")}
        </div>
        <div className="hidden sm:block leading-tight">
          <p className="text-sm font-medium text-navy">{user?.name}</p>
          {user?.specialization && <p className="text-xs text-muted">{user.specialization}</p>}
        </div>
      </div>
    </header>
  );
}
