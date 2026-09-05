import { NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiChevronsLeft, FiChevronsRight, FiLogOut, FiX } from "react-icons/fi";
import { MAIN_NAV, ACCOUNT_NAV } from "../../constants/navigation";
import { useAuth } from "../../hooks/useAuth";

function NavItem({ item, collapsed, onClick }) {
  const Icon = item.icon;
  return (
    <NavLink
      to={item.to}
      onClick={onClick}
      className={({ isActive }) =>
        `flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
          isActive ? "bg-primary text-white" : "text-slate-300 hover:bg-white/10 hover:text-white"
        } ${collapsed ? "justify-center" : ""}`
      }
      title={collapsed ? item.label : undefined}
    >
      <Icon size={18} className="shrink-0" />
      {!collapsed && <span>{item.label}</span>}
    </NavLink>
  );
}

function SidebarContent({ collapsed, onNavigate }) {
  const { logout } = useAuth();
  return (
    <div className="h-full flex flex-col bg-navy text-white">
      <div className={`flex items-center gap-2 px-4 h-16 border-b border-white/10 ${collapsed ? "justify-center px-0" : ""}`}>
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center font-bold text-sm shrink-0">
          GLT
        </div>
        {!collapsed && (
          <div className="leading-tight">
            <p className="font-semibold text-sm">GLT Healthcare</p>
            <p className="text-xs text-slate-400">Doctor Portal</p>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-hide px-2.5 py-4 space-y-6">
        <div>
          {!collapsed && <p className="px-3.5 text-[11px] font-semibold text-slate-500 uppercase mb-2">Main</p>}
          <div className="space-y-1">
            {MAIN_NAV.map((item) => (
              <NavItem key={item.to} item={item} collapsed={collapsed} onClick={onNavigate} />
            ))}
          </div>
        </div>
        <div>
          {!collapsed && <p className="px-3.5 text-[11px] font-semibold text-slate-500 uppercase mb-2">Account</p>}
          <div className="space-y-1">
            {ACCOUNT_NAV.map((item) => (
              <NavItem key={item.to} item={item} collapsed={collapsed} onClick={onNavigate} />
            ))}
          </div>
        </div>
      </div>

      <div className="p-2.5 border-t border-white/10">
        <button
          onClick={logout}
          title={collapsed ? "Logout" : undefined}
          className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium text-slate-300 hover:bg-white/10 hover:text-white w-full transition-colors ${
            collapsed ? "justify-center" : ""
          }`}
        >
          <FiLogOut size={18} />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </div>
  );
}

export default function Sidebar({ collapsed, setCollapsed, mobileOpen, setMobileOpen }) {
  return (
    <>
      {/* Desktop */}
      <motion.aside
        animate={{ width: collapsed ? 76 : 250 }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
        className="hidden lg:block h-screen sticky top-0 shrink-0 relative"
      >
        <SidebarContent collapsed={collapsed} />
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-white border border-slate-200 shadow-card flex items-center justify-center text-navy hover:text-primary"
        >
          {collapsed ? <FiChevronsRight size={14} /> : <FiChevronsLeft size={14} />}
        </button>
      </motion.aside>

      {/* Mobile */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 bg-black/40 z-40 lg:hidden"
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="fixed left-0 top-0 h-screen w-64 z-50 lg:hidden"
            >
              <div className="relative h-full">
                <SidebarContent collapsed={false} onNavigate={() => setMobileOpen(false)} />
                <button
                  onClick={() => setMobileOpen(false)}
                  className="absolute top-4 right-3 text-white/70 hover:text-white"
                >
                  <FiX size={20} />
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
