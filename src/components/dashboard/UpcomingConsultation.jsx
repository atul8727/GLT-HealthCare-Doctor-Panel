import { Link } from "react-router-dom";
import Card from "../ui/Card";
import Button from "../ui/Button";
import { FiVideo, FiEye } from "react-icons/fi";

export default function UpcomingConsultation({ consultation, loading }) {
  if (loading) return <Card><p className="text-sm text-muted">Loading...</p></Card>;
  if (!consultation) return null;
  const p = consultation.patient;

  return (
    <Card className="bg-gradient-to-br from-primary to-primary-dark text-white" padding="p-5">
      <p className="text-xs font-medium text-white/80 uppercase tracking-wide mb-3">Next Consultation</p>
      <p className="text-2xl font-bold">{consultation.time}</p>
      <p className="text-lg font-semibold mt-1">{p?.name}</p>
      <p className="text-sm text-white/80">{p?.age} Years • {p?.gender}</p>
      <p className="text-sm text-white/80 mt-1">{consultation.type} Consultation</p>
      <div className="flex flex-wrap gap-2 mt-4">
        <Link to={`/doctor/patients/${p?.id}`}>
          <Button size="sm" variant="secondary" icon={FiEye} className="!bg-white/15 !text-white hover:!bg-white/25">
            View Patient
          </Button>
        </Link>
        <a href={consultation.meetLink} target="_blank" rel="noreferrer">
          <Button size="sm" className="!bg-white !text-primary hover:!bg-slate-100" icon={FiVideo}>
            Join Google Meet
          </Button>
        </a>
      </div>
    </Card>
  );
}
