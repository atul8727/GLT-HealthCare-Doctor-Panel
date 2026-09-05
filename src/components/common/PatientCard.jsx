import { Link } from "react-router-dom";
import { relativeFromNow } from "../../utils/formatDate";

export default function PatientCard({ patient }) {
  const initials = patient.name.split(" ").map((n) => n[0]).slice(0, 2).join("");
  return (
    <Link
      to={`/doctor/patients/${patient.id}`}
      className="flex items-center justify-between py-3 hover:bg-slate-50 -mx-2 px-2 rounded-lg transition-colors"
    >
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-10 h-10 rounded-full bg-primary-light text-primary flex items-center justify-center font-semibold text-sm shrink-0">
          {initials}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium text-navy truncate">{patient.name}</p>
          <p className="text-xs text-muted">
            Last consultation:{" "}
            {patient.lastConsultationDate ? relativeFromNow(patient.lastConsultationDate) : "—"}
          </p>
        </div>
      </div>
    </Link>
  );
}
