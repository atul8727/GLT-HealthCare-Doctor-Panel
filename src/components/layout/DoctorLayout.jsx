import { useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import Sidebar from "./Sidebar";
import Header from "./Header";

export default function DoctorLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const showBack = location.pathname !== "/doctor/dashboard";

  const handleToggleSidebar = () => {
    if (window.innerWidth < 1024) {
      setMobileOpen((prev) => !prev);
    } else {
      setCollapsed((prev) => !prev);
    }
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar
        collapsed={collapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <Header onToggleSidebar={handleToggleSidebar} />
        <main className="w-full flex-1 p-4 lg:p-6">
          {showBack && (
            <button
              type="button"
              onClick={() => navigate(-1)}
              title="Go back"
              className="mb-4 flex cursor-pointer items-center gap-1.5 rounded-xl border border-[#E2E8F0] bg-white px-3.5 py-2 text-sm font-semibold text-[#4F46E5] shadow-xs transition-colors hover:border-indigo-200 hover:bg-indigo-50"
            >
              <FiArrowLeft className="h-4 w-4" />
              Back
            </button>
          )}
          <Outlet />
        </main>
      </div>
    </div>
  );
}
