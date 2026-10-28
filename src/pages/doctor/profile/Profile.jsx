import { motion } from "framer-motion";
import { FiUser, FiInfo, FiMail, FiPhone, FiAward } from "react-icons/fi";
import { useAuth } from "../../../hooks/useAuth";
import Card from "../../../components/ui/Card";
import Input from "../../../components/ui/Input";
import Badge from "../../../components/ui/Badge";
import Avatar from "../../../components/ui/Avatar";

export default function Profile() {
  const { user } = useAuth();

  const fields = [
    { label: "Full Name", value: user?.name, icon: FiUser },
    { label: "Email Address", value: user?.email, icon: FiMail },
    { label: "Mobile Number", value: user?.mobile, icon: FiPhone },
    { label: "Medical Specialization", value: user?.specialization, icon: FiAward },
  ].filter((f) => f.value);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="max-w-3xl space-y-5"
    >
      <div>
        <h1 className="text-2xl font-extrabold text-[#14142B]">My Profile</h1>
        <p className="mt-1 text-sm text-[#64748B]">Your verified professional information.</p>
      </div>

      <Card padding="p-6 sm:p-8">
        <div className="mb-6 flex flex-wrap items-center gap-4 border-b border-[#E2E8F0] pb-6">
          <Avatar name={user?.name || "Doctor"} id={user?.id} size="lg" />
          <div className="min-w-0">
            <p className="text-xl font-extrabold text-[#14142B]">{user?.name}</p>
            <div className="mt-1.5 flex flex-wrap items-center gap-2">
              <Badge color="primary">Doctor</Badge>
              {user?.specialization && (
                <span className="text-sm font-medium text-[#64748B]">{user.specialization}</span>
              )}
            </div>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {fields.map((f) => (
            <Input
              key={f.label}
              label={f.label}
              value={f.value}
              disabled
              icon={f.icon}
            />
          ))}
        </div>

        <div className="mt-6 flex items-start gap-2.5 rounded-xl border border-slate-200 bg-[#F8FAFC] p-4 text-xs text-[#64748B]">
          <FiInfo className="mt-0.5 h-4 w-4 shrink-0 text-[#4F46E5]" />
          <span>
            Profile details are managed centrally by your clinic administration. Please contact your administrator to update your credentials or contact details.
          </span>
        </div>
      </Card>
    </motion.div>
  );
}
