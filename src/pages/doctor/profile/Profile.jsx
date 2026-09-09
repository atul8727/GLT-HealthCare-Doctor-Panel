import { motion } from "framer-motion";
import { useAuth } from "../../../hooks/useAuth";
import Card from "../../../components/ui/Card";
import Input from "../../../components/ui/Input";
import Badge from "../../../components/ui/Badge";
import { avatarColor, initialsOf } from "../../../utils/avatarColor";

// Doctors don't have a backend API to edit their own profile (that is
// managed via the admin) — so this page only shows the info received at
// login (the session) as read-only.
export default function Profile() {
  const { user } = useAuth();
  const initials = initialsOf(user?.name || "Doctor");

  // Only show fields the backend actually returned for this account,
  // instead of padding the form with empty "—" placeholders.
  const fields = [
    { label: "Full Name", value: user?.name },
    { label: "Email", value: user?.email },
    { label: "Mobile", value: user?.mobile },
    { label: "Specialization", value: user?.specialization },
  ].filter((f) => f.value);

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }} className="max-w-2xl space-y-5">
      <div>
        <h1 className="text-xl font-bold text-navy">My Profile</h1>
        <p className="text-sm text-muted mt-1">Your professional information.</p>
      </div>

      <Card>
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <div
            className={`w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-xl shrink-0 shadow-sm ${avatarColor(
              user?.id
            )}`}
          >
            {initials}
          </div>
          <div className="min-w-0">
            <p className="font-bold text-navy text-lg truncate">{user?.name}</p>
            <div className="flex items-center gap-2 mt-1">
              <Badge color="primary">Doctor</Badge>
              {user?.specialization && <span className="text-sm text-muted">{user.specialization}</span>}
            </div>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          {fields.map((f) => (
            <Input key={f.label} label={f.label} value={f.value} disabled />
          ))}
        </div>
        <p className="text-xs text-muted mt-4">
          Profile details are managed by the admin — please contact your clinic admin to make
          changes.
        </p>
      </Card>
    </motion.div>
  );
}
