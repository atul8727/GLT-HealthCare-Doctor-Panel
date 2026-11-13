import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { FiMail, FiLock, FiAlertCircle } from "react-icons/fi";
import { useAuth } from "../../hooks/useAuth";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";

export default function DoctorLogin() {
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [logoFailed, setLogoFailed] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await login(identifier.trim(), password);
      toast.success("Welcome back, Doctor!");
      navigate(location.state?.from || "/doctor/dashboard", { replace: true });
    } catch (err) {
      setError(err.message || "Login failed");
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#0F172A] p-4 text-white">
      {/* Ambient background glows */}
      <div className="pointer-events-none absolute -top-40 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-indigo-500/20 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-10 h-80 w-80 rounded-full bg-sky-500/15 blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="relative w-full max-w-md rounded-3xl border border-white/10 bg-white/95 p-8 text-[#14142B] shadow-2xl backdrop-blur-xl sm:p-10"
      >
        <div className="mb-8 text-center">
          {!logoFailed ? (
            <img
              src="/GLT_logo.jpeg"
              alt="GLT Healthcare"
              onError={() => setLogoFailed(true)}
              className="mx-auto mb-4 h-14 w-auto rounded-lg object-contain"
            />
          ) : (
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#4F46E5] to-[#6D5BF0] text-xl font-black text-white shadow-[0_8px_20px_rgba(79,70,229,0.35)]">
              GLT
            </div>
          )}
          <h1 className="text-2xl font-black tracking-tight text-[#14142B]">GLT Healthcare</h1>
          <p className="mt-1 text-sm font-semibold text-[#64748B]">Doctor Portal Sign In</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email or Mobile"
            type="text"
            placeholder="doctor@glthealthcare.com"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            autoComplete="username"
            icon={FiMail}
            required
          />
          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            icon={FiLock}
            required
          />

          {error && (
            <div className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-xs font-semibold text-rose-700">
              <FiAlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <Button type="submit" fullWidth loading={loading} size="lg" className="mt-2">
            Sign In to Doctor Portal
          </Button>
        </form>

        <p className="mt-6 text-center text-xs text-[#64748B]">
          Credentials are assigned by your clinic administrator.
        </p>
      </motion.div>
    </div>
  );
}
