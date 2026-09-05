import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { FiEdit2, FiSave } from "react-icons/fi";
import { useAuth } from "../../../hooks/useAuth";
import { profileService } from "../../../services/profile/profileService";
import Card from "../../../components/ui/Card";
import Input from "../../../components/ui/Input";
import Button from "../../../components/ui/Button";
import Spinner from "../../../components/ui/Spinner";

export default function Profile() {
  const { user, setUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: user?.name || "", mobile: user?.mobile || "" });

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const full = await profileService.getProfile();
        setUser(full);
        setForm({ name: full?.name || "", mobile: full?.mobile || "" });
      } catch (err) {
        toast.error(err.message || "Profile load nahi ho payi");
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const initials = (user?.name || "D").split(" ").map((n) => n[0]).slice(0, 2).join("");

  const handleSave = async () => {
    setSaving(true);
    try {
      const updated = await profileService.updateProfile(form);
      setUser(updated);
      setEditing(false);
      toast.success("Profile updated");
    } catch (err) {
      toast.error(err.message || "Profile update nahi ho paaya");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="flex justify-center py-24"><Spinner size={32} /></div>;

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
            <p className="text-sm text-muted">{user?.specialization}</p>
          </div>
          <div className="ml-auto">
            {editing ? (
              <Button size="sm" icon={FiSave} loading={saving} onClick={handleSave}>Save</Button>
            ) : (
              <Button size="sm" variant="outline" icon={FiEdit2} onClick={() => setEditing(true)}>Edit Details</Button>
            )}
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <Input
            label="Full Name"
            value={form.name}
            disabled={!editing}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          />
          <Input
            label="Mobile"
            value={form.mobile}
            disabled={!editing}
            onChange={(e) => setForm((f) => ({ ...f, mobile: e.target.value }))}
          />
          <Input label="Email" value={user?.email} disabled />
          <Input label="Specialization" value={user?.specialization} disabled />
        </div>
        <p className="text-xs text-muted mt-4">
          Email login-id hai isliye yahan se change nahi kiya ja sakta — isko badalne ke liye clinic admin se contact karein.
        </p>
      </Card>
    </motion.div>
  );
}
