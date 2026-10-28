import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiUsers, FiEye, FiLock } from "react-icons/fi";
import { patientService } from "../../../services/patients/patientService";
import Card from "../../../components/ui/Card";
import Table from "../../../components/ui/Table";
import Button from "../../../components/ui/Button";
import Badge from "../../../components/ui/Badge";
import Avatar from "../../../components/ui/Avatar";
import SearchInput from "../../../components/ui/SearchInput";
import EmptyState from "../../../components/ui/EmptyState";
import Spinner from "../../../components/ui/Spinner";
import { relativeFromNow } from "../../../utils/formatDate";

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
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="space-y-5"
    >
      <div>
        <h1 className="text-2xl font-extrabold text-[#14142B]">My Patients</h1>
        <p className="mt-1 text-sm text-[#64748B]">Manage and view patients assigned to you.</p>
      </div>

      <Card padding="p-4 sm:p-6">
        <div className="mb-5">
          <SearchInput
            value={query}
            onChange={setQuery}
            placeholder="Search patient by name or mobile..."
          />
        </div>

        {loading ? (
          <div className="flex justify-center py-14">
            <Spinner />
          </div>
        ) : error ? (
          <EmptyState
            icon={error.status === 403 ? FiLock : FiUsers}
            title={error.status === 403 ? "Permission denied" : "Something went wrong"}
            subtitle={error.message}
          />
        ) : patients.length === 0 ? (
          <EmptyState icon={FiUsers} title="No patients found" subtitle="Try a different search term." />
        ) : (
          <Table columns={["Patient", "Age", "Gender", "Mobile", "Last Consultation", "Action"]}>
            {patients.map((p) => (
              <tr key={p.id} className="transition-colors hover:bg-slate-50/80">
                <td className="whitespace-nowrap px-5 py-4">
                  <div className="flex items-center gap-3">
                    <Avatar name={p.name} id={p.id} />
                    <span className="font-bold text-[#14142B]">{p.name}</span>
                  </div>
                </td>
                <td className="px-5 py-4 text-[#14142B]">{p.age || "—"}</td>
                <td className="px-5 py-4">
                  {p.gender ? (
                    <Badge color={p.gender === "Female" ? "rose" : p.gender === "Male" ? "primary" : "neutral"}>
                      {p.gender}
                    </Badge>
                  ) : (
                    "—"
                  )}
                </td>
                <td className="whitespace-nowrap px-5 py-4 text-[#14142B]">{p.mobile}</td>
                <td className="whitespace-nowrap px-5 py-4 text-[#64748B]">
                  {p.lastConsultationDate ? relativeFromNow(p.lastConsultationDate) : "No visits yet"}
                </td>
                <td className="px-5 py-4">
                  <Link to={`/doctor/patients/${p.id}`}>
                    <Button size="sm" variant="actionView" icon={FiEye}>
                      View
                    </Button>
                  </Link>
                </td>
              </tr>
            ))}
          </Table>
        )}
      </Card>
    </motion.div>
  );
}