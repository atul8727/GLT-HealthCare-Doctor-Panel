import { useState } from "react";
import { motion } from "framer-motion";
import { FiLock, FiBell, FiMoon } from "react-icons/fi";
import Card from "../../../components/ui/Card";

function Toggle({ checked, onChange }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`w-11 h-6 rounded-full transition-colors relative shrink-0 ${checked ? "bg-primary" : "bg-slate-300"}`}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
          checked ? "translate-x-5" : ""
        }`}
      />
    </button>
  );
}

export default function Settings() {
  const [notifs, setNotifs] = useState({ email: true, sms: false, push: true });
  const [dark, setDark] = useState(false);

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }} className="max-w-2xl space-y-5">
      <div>
        <h1 className="text-xl font-bold text-navy">Settings</h1>
        <p className="text-sm text-muted mt-1">Manage your account preferences.</p>
      </div>

      <Card>
        <div className="flex items-center gap-2 mb-2">
          <FiLock className="text-primary" />
          <p className="font-semibold text-navy">Password</p>
        </div>
        <p className="text-sm text-muted">
          Password change filhaal doctor account se available nahi hai — apne clinic admin se naya
          password set karwayein.
        </p>
      </Card>

      <Card>
        <div className="flex items-center gap-2 mb-4">
          <FiBell className="text-primary" />
          <p className="font-semibold text-navy">Notifications</p>
        </div>
        <div className="space-y-3">
          {[
            ["email", "Email notifications"],
            ["sms", "SMS notifications"],
            ["push", "Push notifications"],
          ].map(([key, label]) => (
            <div key={key} className="flex items-center justify-between">
              <span className="text-sm text-navy">{label}</span>
              <Toggle checked={notifs[key]} onChange={(v) => setNotifs((n) => ({ ...n, [key]: v }))} />
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <div className="flex items-center gap-2 mb-4">
          <FiMoon className="text-primary" />
          <p className="font-semibold text-navy">Appearance</p>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-navy">Dark mode</span>
          <Toggle checked={dark} onChange={setDark} />
        </div>
      </Card>
    </motion.div>
  );
}
