import { Link } from "react-router-dom";
import Card from "../ui/Card";
import Table from "../ui/Table";
import Button from "../ui/Button";
import Avatar from "../ui/Avatar";
import StatusBadge from "../common/StatusBadge";
import EmptyState from "../ui/EmptyState";
import { FiCalendar } from "react-icons/fi";

export default function TodayConsultations({ consultations, loading }) {
  return (
    <Card
      title="Today's Consultations"
      icon={FiCalendar}
      action={
        <Link
          to="/doctor/consultations"
          className="text-sm font-semibold text-[#4F46E5] transition-colors hover:text-[#4338CA] hover:underline"
        >
          View All
        </Link>
      }
    >
      {loading ? (
        <p className="py-6 text-sm text-[#64748B]">Loading...</p>
      ) : consultations.length === 0 ? (
        <EmptyState icon={FiCalendar} title="No consultations today" />
      ) : (
        <Table columns={["Time", "Patient", "Type", "Status", "Action"]}>
          {consultations.map((c) => (
            <tr key={c.id}>
              <td className="whitespace-nowrap px-5 py-4 text-sm font-bold text-[#14142B]">{c.time}</td>
              <td className="whitespace-nowrap px-5 py-4">
                <div className="flex items-center gap-3">
                  <Avatar name={c.patient?.name} id={c.patient?.id} size="sm" />
                  <span className="text-sm font-semibold text-[#14142B]">{c.patient?.name}</span>
                </div>
              </td>
              <td className="whitespace-nowrap px-5 py-4 text-sm text-[#64748B]">{c.type}</td>
              <td className="px-5 py-4"><StatusBadge status={c.status} /></td>
              <td className="px-5 py-4">
                <Link to={`/doctor/consultations/${c.id}`}>
                  <Button size="sm" variant={c.status === "Scheduled" ? "primary" : "actionView"}>
                    {c.status === "Scheduled" ? "Join" : "View"}
                  </Button>
                </Link>
              </td>
            </tr>
          ))}
        </Table>
      )}
    </Card>
  );
}