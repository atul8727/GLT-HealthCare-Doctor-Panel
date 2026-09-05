import { Link } from "react-router-dom";
import Card from "../ui/Card";
import PatientCard from "../common/PatientCard";
import EmptyState from "../ui/EmptyState";
import { FiUsers } from "react-icons/fi";

export default function RecentPatients({ patients, loading }) {
  return (
    <Card>
      <p className="font-semibold text-navy mb-1">Recent Patients</p>
      {loading ? (
        <p className="text-sm text-muted py-6">Loading...</p>
      ) : patients.length === 0 ? (
        <EmptyState icon={FiUsers} title="No recent patients" />
      ) : (
        <div className="divide-y divide-slate-50">
          {patients.map((p) => (
            <PatientCard key={p.id} patient={p} />
          ))}
        </div>
      )}
      <Link to="/doctor/patients" className="block text-center text-sm font-medium text-primary hover:underline mt-3 pt-3 border-t border-slate-100">
        View All Patients →
      </Link>
    </Card>
  );
}
