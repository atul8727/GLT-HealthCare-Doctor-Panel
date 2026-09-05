import { useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { FiLock, FiBell, FiMoon, FiRefreshCw } from "react-icons/fi";
import Card from "../../../components/ui/Card";
import Input from "../../../components/ui/Input";
import Button from "../../../components/ui/Button";
import { profileService } from "../../../services/profile/profileService";
import { prescriptionStorage } from "../../../utils/storage";

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

  const [pwd, setPwd] = useState({ next: "", confirm: "" });
  const [savingPwd, setSavingPwd] = useState(false);

  const handleUpdatePassword = async () => {
    if (!pwd.next || pwd.next.length < 6) {
      toast.error("Password kam se kam 6 characters ka hona chahiye");
      return;
    }
    if (pwd.next !== pwd.confirm) {
      toast.error("Naya password aur confirm password match nahi kar rahe");
      return;
    }
    setSavingPwd(true);
    try {
      await profileService.changePassword(pwd.next);
      toast.success("Password update ho gaya");
      setPwd({ next: "", confirm: "" });
    } catch (err) {
      toast.error(err.message || "Password update nahi ho paaya");
    } finally {
      setSavingPwd(false);
    }
  };

  const handleClearLocalPrescriptions = () => {
    prescriptionStorage.clearAll();
    toast.success("Locally saved prescriptions clear ho gayi (patients/consultations par asar nahi padega, woh live server se aate hain).");
  };

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }} className="max-w-2xl space-y-5">
      <div>
        <h1 className="text-xl font-bold text-navy">Settings</h1>
        <p className="text-sm text-muted mt-1">Manage your account preferences.</p>
      </div>

      <Card>
        <div className="flex items-center gap-2 mb-4">
          <FiLock className="text-primary" />
          <p className="font-semibold text-navy">Change Password</p>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <Input
            type="password"
            label="New Password"
            placeholder="••••••••"
            value={pwd.next}
            onChange={(e) => setPwd((p) => ({ ...p, next: e.target.value }))}
          />
          <Input
            type="password"
            label="Confirm New Password"
            placeholder="••••••••"
            value={pwd.confirm}
            onChange={(e) => setPwd((p) => ({ ...p, confirm: e.target.value }))}
          />
        </div>
        <Button size="sm" className="mt-4" loading={savingPwd} onClick={handleUpdatePassword}>
          Update Password
        </Button>
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

      <Card>
        <div className="flex items-center gap-2 mb-2">
          <FiRefreshCw className="text-primary" />
          <p className="font-semibold text-navy">Local Prescription Data</p>
        </div>
        <p className="text-sm text-muted mb-3">
          Patients, consultations aur vitals ab live server se aate hain. Sirf Prescriptions filhaal
          is browser mein locally save hoti hain (backend mein prescription API abhi available nahi hai).
        </p>
        <Button size="sm" variant="outline" onClick={handleClearLocalPrescriptions}>
          Clear Local Prescriptions
        </Button>
      </Card>
    </motion.div>
  );
}
