import { Link } from "react-router-dom";
import Card from "../ui/Card";
import PatientCard from "../common/PatientCard";
import EmptyState from "../ui/EmptyState";
import { FiUsers } from "react-icons/fi";

export default function RecentPatients({ patients, loading }) {
  return (
    <Card title="Recent Patients" icon={FiUsers}>
      {loading ? (
        <p className="py-6 text-sm text-[#64748B]">Loading...</p>
      ) : patients.length === 0 ? (
        <EmptyState icon={FiUsers} title="No recent patients" />
      ) : (
        <div className="divide-y divide-[#E2E8F0]">
          {patients.map((p) => (
            <PatientCard key={p.id} patient={p} />
          ))}
        </div>
      )}
      <Link
        to="/doctor/patients"
        className="mt-3 block border-t border-[#E2E8F0] pt-3 text-center text-sm font-semibold text-[#4F46E5] transition-colors hover:text-[#4338CA] hover:underline"
      >
        View All Patients →
      </Link>
    </Card>
  );
}