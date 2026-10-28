import { FiActivity } from "react-icons/fi";
import Card from "../ui/Card";
import { formatDateTime } from "../../utils/formatDate";

export default function VitalsCard({ vitals, title = "Latest Vitals" }) {
  if (!vitals) return null;
  const rows = [
    ["Blood Pressure", vitals.bp],
    ["Pulse Rate", vitals.pulse],
    ["Temperature", vitals.temperature],
    ["SpO₂", vitals.spo2],
    ["Weight", vitals.weight],
    ["Height", vitals.height],
    ["BMI", vitals.bmi],
  ];
  return (
    <Card title={title} icon={FiActivity}>
      <dl className="divide-y divide-[#E2E8F0]">
        {rows.map(([label, val]) => (
          <div key={label} className="flex items-center justify-between py-2.5 text-sm first:pt-0 last:pb-0">
            <dt className="text-[#64748B]">{label}</dt>
            <dd className="font-semibold text-[#14142B]">{val}</dd>
          </div>
        ))}
      </dl>
      {vitals.recordedOn && (
        <p className="mt-4 border-t border-[#E2E8F0] pt-3 text-xs text-[#64748B]">
          Recorded on: {formatDateTime(vitals.recordedOn)}
        </p>
      )}
    </Card>
  );
}