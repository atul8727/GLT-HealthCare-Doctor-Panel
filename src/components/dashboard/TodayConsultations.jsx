import { Link } from "react-router-dom";
import Card from "../ui/Card";
import Table from "../ui/Table";
import Button from "../ui/Button";
import StatusBadge from "../common/StatusBadge";
import EmptyState from "../ui/EmptyState";
import { FiCalendar } from "react-icons/fi";

export default function TodayConsultations({ consultations, loading }) {
  return (
    <Card>
      <div className="flex items-center justify-between mb-1">
        <p className="font-semibold text-navy">Today's Consultations</p>
        <Link to="/doctor/consultations" className="text-sm text-primary font-medium hover:underline">
          View All
        </Link>
      </div>
      {loading ? (
        <p className="text-sm text-muted py-6">Loading...</p>
      ) : consultations.length === 0 ? (
        <EmptyState icon={FiCalendar} title="No consultations today" />
      ) : (
        <Table columns={["Time", "Patient", "Type", "Status", "Action"]}>
          {consultations.map((c) => (
            <tr key={c.id}>
              <td className="py-3 pr-4 font-medium text-navy whitespace-nowrap">{c.time}</td>
              <td className="py-3 pr-4 text-navy whitespace-nowrap">{c.patient?.name}</td>
              <td className="py-3 pr-4 text-muted whitespace-nowrap">{c.type}</td>
              <td className="py-3 pr-4"><StatusBadge status={c.status} /></td>
              <td className="py-3 pr-4">
                <Link to={`/doctor/consultations/${c.id}`}>
                  <Button size="sm" variant={c.status === "Scheduled" ? "primary" : "outline"}>
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
