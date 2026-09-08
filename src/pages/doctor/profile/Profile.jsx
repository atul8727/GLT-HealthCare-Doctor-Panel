import { motion } from "framer-motion";
import { useAuth } from "../../../hooks/useAuth";
import Card from "../../../components/ui/Card";
import Input from "../../../components/ui/Input";

// Doctor role ke paas apni profile edit karne ka koi backend API
// nahi hai (woh admin ke through manage hoti hai) — isliye yeh page
// sirf login ke waqt mili info (session) read-only dikhata hai.
export default function Profile() {
  const { user } = useAuth();
  const initials = (user?.name || "D").split(" ").map((n) => n[0]).slice(0, 2).join("");

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }} className="max-w-2xl space-y-5">
      <div>
        <h1 className="text-xl font-bold text-navy">My Profile</h1>
        <p className="text-sm text-muted mt-1">Your professional information.</p>
      </div>

      <Card>
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-primary-light text-primary flex items-center justify-center font-bold text-xl">
            {initials}
          </div>
          <div>
            <p className="font-bold text-navy text-lg">{user?.name}</p>
            <p className="text-sm text-muted">{user?.specialization || "Doctor"}</p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <Input label="Full Name" value={user?.name || ""} disabled />
          <Input label="Doctor ID" value={user?.id || ""} disabled />
          <Input label="Email" value={user?.email || ""} disabled />
          <Input label="Specialization" value={user?.specialization || "—"} disabled />
        </div>
        <p className="text-xs text-muted mt-4">
          Profile details admin ke through manage hoti hain — badlaav ke liye apne clinic admin se
          contact karein.
        </p>
      </Card>
    </motion.div>
  );
}
