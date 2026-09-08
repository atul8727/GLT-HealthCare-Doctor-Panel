import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiSearch, FiUsers, FiEye, FiLock } from "react-icons/fi";
import { patientService } from "../../../services/patients/patientService";
import Card from "../../../components/ui/Card";
import Table from "../../../components/ui/Table";
import Button from "../../../components/ui/Button";
import Badge from "../../../components/ui/Badge";
import EmptyState from "../../../components/ui/EmptyState";
import Spinner from "../../../components/ui/Spinner";
import { relativeFromNow } from "../../../utils/formatDate";
import { avatarColor, initialsOf } from "../../../utils/avatarColor";

export default function Patients() {
  const [patients, setPatients] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);
    const t = setTimeout(async () => {
      try {
        const data = await patientService.getPatients(query);
        if (active) setPatients(data);
      } catch (err) {
        if (active) setError(err);
      } finally {
        if (active) setLoading(false);
      }
    }, 250);
    return () => {
      active = false;
      clearTimeout(t);
    };
  }, [query]);

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }} className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-navy">My Patients</h1>
        <p className="text-sm text-muted mt-1">Manage and view patients assigned to you.</p>
      </div>

      <div className="relative max-w-sm">
        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-primary/60" size={16} />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search patient by name, ID or mobile..."
          className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary bg-white"
        />
      </div>

      <Card>
        {loading ? (
          <div className="flex justify-center py-14"><Spinner /></div>
        ) : error ? (
          <EmptyState
            icon={error.status === 403 ? FiLock : FiUsers}
            title={error.status === 403 ? "Permission denied" : "Kuch galat ho gaya"}
            subtitle={error.message}
          />
        ) : patients.length === 0 ? (
          <EmptyState icon={FiUsers} title="No patients found" subtitle="Try a different search term." />
        ) : (
          <Table columns={["Patient", "ID", "Age", "Gender", "Mobile", "Last Consultation", "Action"]}>
            {patients.map((p) => {
              const initials = initialsOf(p.name);
              return (
                <tr key={p.id}>
                  <td className="py-3 pr-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white font-semibold text-xs shrink-0 shadow-sm ${avatarColor(p.id)}`}>
                        {initials}
                      </div>
                      <span className="font-medium text-navy">{p.name}</span>
                    </div>
                  </td>
                  <td className="py-3 pr-4 text-muted whitespace-nowrap">#{p.id}</td>
                  <td className="py-3 pr-4 text-muted">{p.age || "—"}</td>
                  <td className="py-3 pr-4">
                    {p.gender ? (
                      <Badge color={p.gender === "Female" ? "rose" : p.gender === "Male" ? "primary" : "neutral"}>
                        {p.gender}
                      </Badge>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="py-3 pr-4 text-muted whitespace-nowrap">{p.mobile}</td>
                  <td className="py-3 pr-4 text-muted whitespace-nowrap">
                    {p.lastConsultationDate ? relativeFromNow(p.lastConsultationDate) : "No visits yet"}
                  </td>
                  <td className="py-3 pr-4">
                    <Link to={`/doctor/patients/${p.id}`}>
                      <Button size="sm" variant="secondary" icon={FiEye}>View</Button>
                    </Link>
                  </td>
                </tr>
              );
            })}
          </Table>
        )}
      </Card>
    </motion.div>
  );
}
