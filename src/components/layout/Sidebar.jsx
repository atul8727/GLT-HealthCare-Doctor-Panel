import { useState } from "react";
import { NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiLogOut, FiX } from "react-icons/fi";
import { MAIN_NAV, ACCOUNT_NAV } from "../../constants/navigation";
import { useAuth } from "../../hooks/useAuth";

function NavItem({ item, collapsed, onClick }) {
  const Icon = item.icon;
  return (
    <NavLink
      to={item.to}
      onClick={onClick}
      className={({ isActive }) =>
        `flex items-center gap-3 rounded-xl py-2.5 text-sm font-semibold transition-all duration-150 ${
          collapsed ? "justify-center px-0" : "px-3.5"
        } ${
          isActive
            ? "bg-gradient-to-r from-[#4F46E5] to-[#6D5BF0] text-white shadow-[0_6px_14px_rgba(79,70,229,0.35)]"
            : "text-slate-300 hover:bg-white/10 hover:text-white"
        }`
      }
      title={collapsed ? item.label : undefined}
    >
      <Icon size={20} className="shrink-0" />
      {!collapsed && <span>{item.label}</span>}
    </NavLink>
  );
}

function SidebarContent({ collapsed, onNavigate }) {
  const { logout } = useAuth();
  const [logoFailed, setLogoFailed] = useState(false);

  return (
    <div className="flex h-full flex-col bg-[#0F172A] text-white">
      {/* Logo */}
      <div className="flex h-20 shrink-0 items-center justify-center border-b border-white/10 px-4">
        {!collapsed && !logoFailed ? (
          <img
            src="/GLT_logo.jpeg"
            alt="GLT Healthcare"
            onError={() => setLogoFailed(true)}
            className="h-14 w-auto max-w-[170px] rounded-md bg-white object-contain"
          />
        ) : !collapsed ? (
          <div className="text-center leading-tight">
            <p className="text-base font-extrabold text-white">GLT Healthcare</p>
            <p className="text-xs text-slate-400">Doctor Portal</p>
          </div>
        ) : (
          <span className="bg-gradient-to-r from-[#A5B4FC] to-[#818CF8] bg-clip-text text-xl font-extrabold tracking-tight text-transparent">
            GLT
          </span>
        )}
      </div>

      {/* Navigation */}
      <div className="scrollbar-hide flex-1 space-y-5 overflow-y-auto px-3 py-5">
        <div>
          {!collapsed && (
            <p className="mb-2 px-3.5 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Main
            </p>
          )}
          <div className="space-y-1">
            {MAIN_NAV.map((item) => (
              <NavItem key={item.to} item={item} collapsed={collapsed} onClick={onNavigate} />
            ))}
          </div>
        </div>
        <div>
          {!collapsed && (
            <p className="mb-2 px-3.5 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Account
            </p>
          )}
          <div className="space-y-1">
            {ACCOUNT_NAV.map((item) => (
              <NavItem key={item.to} item={item} collapsed={collapsed} onClick={onNavigate} />
            ))}
          </div>
        </div>
      </div>

      {/* Logout */}
      <div className="border-t border-white/10 p-3">
        <button
          onClick={logout}
          title={collapsed ? "Logout" : undefined}
          className={`flex w-full cursor-pointer items-center gap-3 rounded-xl py-2.5 text-sm font-semibold text-slate-300 transition-colors hover:bg-white/10 hover:text-white ${
            collapsed ? "justify-center px-0" : "px-3.5"
          }`}
        >
          <FiLogOut size={20} />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </div>
  );
}

export default function Sidebar({ collapsed, mobileOpen, setMobileOpen }) {
  return (
    <>
      {/* Desktop */}
      <motion.aside
        animate={{ width: collapsed ? 80 : 260 }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
        className="sticky top-0 hidden h-screen shrink-0 lg:block"
      >
        <SidebarContent collapsed={collapsed} />
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
              className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm lg:hidden"
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="fixed left-0 top-0 z-50 h-screen w-[270px] shadow-2xl lg:hidden"
            >
              <div className="relative h-full">
                <SidebarContent collapsed={false} onNavigate={() => setMobileOpen(false)} />
                <button
                  onClick={() => setMobileOpen(false)}
                  aria-label="Close menu"
                  className="absolute right-3 top-3 cursor-pointer rounded-lg p-1 text-white/70 transition-colors hover:bg-white/10 hover:text-white"
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