import { Link } from "react-router-dom";
import { relativeFromNow } from "../../utils/formatDate";
import Avatar from "../ui/Avatar";

export default function PatientCard({ patient }) {
  return (
    <Link
      to={`/doctor/patients/${patient.id}`}
      className="-mx-2 flex items-center justify-between rounded-xl px-2 py-3 transition-colors hover:bg-indigo-50/60"
    >
      <div className="flex min-w-0 items-center gap-3">
        <Avatar name={patient.name} id={patient.id} />
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-[#14142B]">{patient.name}</p>
          <p className="text-xs text-[#64748B]">
            Last consultation:{" "}
            {patient.lastConsultationDate ? relativeFromNow(patient.lastConsultationDate) : "No visits yet"}
          </p>
        </div>
      </div>
    </Link>
  );
}