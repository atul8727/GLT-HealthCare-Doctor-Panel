import { Link } from "react-router-dom";
import { relativeFromNow } from "../../utils/formatDate";
import { avatarColor, initialsOf } from "../../utils/avatarColor";

export default function PatientCard({ patient }) {
  const initials = initialsOf(patient.name);
  return (
    <Link
      to={`/doctor/patients/${patient.id}`}
      className="flex items-center justify-between py-3 hover:bg-primary-light/40 -mx-2 px-2 rounded-lg transition-colors"
    >
      <div className="flex items-center gap-3 min-w-0">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm shrink-0 shadow-sm ${avatarColor(patient.id)}`}>
          {initials}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium text-navy truncate">{patient.name}</p>
          <p className="text-xs text-muted">
            Last consultation:{" "}
            {patient.lastConsultationDate ? relativeFromNow(patient.lastConsultationDate) : "No visits yet"}
          </p>
        </div>
      </div>
    </Link>
  );
}
