import { Link } from "react-router-dom";
import Card from "../ui/Card";
import Button from "../ui/Button";
import { FiVideo, FiEye } from "react-icons/fi";

export default function UpcomingConsultation({ consultation, loading }) {
  if (loading) return <Card><p className="text-sm text-[#64748B]">Loading...</p></Card>;
  if (!consultation) return null;
  const p = consultation.patient;

  return (
    <Card
      className="relative overflow-hidden !border-transparent !bg-gradient-to-br from-[#0F172A] via-[#2358D6] to-[#0EA5E9] text-white !shadow-[0_12px_28px_rgba(35,88,214,0.28)]"
      padding="p-5"
    >
      <div className="pointer-events-none absolute -right-8 -top-10 h-36 w-36 rounded-full bg-white/10" />
      <div className="pointer-events-none absolute -bottom-14 right-10 h-28 w-28 rounded-full bg-white/[0.07]" />
      <div className="relative">
        <p className="mb-3 text-xs font-bold uppercase tracking-wider text-white/80">Next Consultation</p>
        <p className="text-3xl font-extrabold">{consultation.time}</p>
        <p className="mt-1 text-lg font-bold">{p?.name}</p>
        <p className="text-sm text-white/80">{p?.age} Years • {p?.gender}</p>
        <p className="mt-1 text-sm text-white/80">{consultation.type} Consultation</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Link to={`/doctor/patients/${p?.id}`}>
            <Button
              size="sm"
              variant="outline"
              icon={FiEye}
              className="!border-white/30 !bg-white/15 !text-white hover:!bg-white/25"
            >
              View Patient
            </Button>
          </Link>
          <a href={consultation.meetLink} target="_blank" rel="noreferrer">
            <Button
              size="sm"
              variant="outline"
              className="!border-white !bg-white !text-[#1D6FE0] hover:!bg-blue-50"
              icon={FiVideo}
            >
              Join Google Meet
            </Button>
          </a>
        </div>
      </div>
    </Card>
  );
}