import { useAuth } from "../../hooks/useAuth";
import { initialsOf } from "../../utils/avatarColor";
import { FiMenu } from "react-icons/fi";

export default function Header({ onToggleSidebar }) {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b border-[#E2E8F0] bg-white px-4 lg:px-6">
      {/* Left: Open/Close Sidebar Hamburger Button */}
      <div className="flex items-center">
        <button
          type="button"
          onClick={onToggleSidebar}
          aria-label="Toggle sidebar"
          className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] text-[#14142B] shadow-xs transition-colors hover:border-indigo-200 hover:bg-indigo-50 hover:text-[#4F46E5]"
        >
          <FiMenu size={20} />
        </button>
      </div>

      {/* Right: Doctor Avatar & Info */}
      <div className="flex shrink-0 items-center gap-2.5 border-l border-[#E2E8F0] pl-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#4F46E5] to-[#6D5BF0] text-sm font-bold text-white shadow-[0_4px_10px_rgba(79,70,229,0.3)]">
          {initialsOf(user?.name || "Doctor")}
        </div>
        <div className="hidden leading-tight sm:block">
          <p className="text-sm font-semibold text-[#14142B]">{user?.name}</p>
          {user?.specialization && (
            <p className="text-xs text-[#64748B]">{user.specialization}</p>
          )}
        </div>
      </div>
    </header>
  );
}
