import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
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
    <div className="min-h-screen bg-navy flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-sm bg-card rounded-2xl shadow-card p-7"
      >
        <div className="text-center mb-7">
          <div className="w-12 h-12 rounded-xl bg-primary text-white flex items-center justify-center font-bold mx-auto mb-3">
            GLT
          </div>
          <p className="font-bold text-navy text-lg">GLT Healthcare</p>
          <p className="text-sm text-muted">Doctor Portal Login</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email"
            type="email"
            placeholder="doctor@glthealthcare.com"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            autoComplete="username"
          />
          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />
          {error && <p className="text-sm text-danger">{error}</p>}
          <Button type="submit" className="w-full" loading={loading}>
            Login
          </Button>
        </form>

        <p className="text-xs text-muted text-center mt-5">
          Login uss email/password se hoga jo admin ne aapka doctor account banate waqt diya hai.
        </p>
      </motion.div>
    </div>
  );
}
