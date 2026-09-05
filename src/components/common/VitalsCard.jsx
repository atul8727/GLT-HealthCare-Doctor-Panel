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
    <Card>
      <p className="font-semibold text-navy mb-3">{title}</p>
      <div className="space-y-2.5">
        {rows.map(([label, val]) => (
          <div key={label} className="flex items-center justify-between text-sm">
            <span className="text-muted">{label}</span>
            <span className="font-medium text-navy">{val}</span>
          </div>
        ))}
      </div>
      {vitals.recordedOn && (
        <p className="text-xs text-muted mt-3 pt-3 border-t border-slate-100">
          Recorded on: {formatDateTime(vitals.recordedOn)}
        </p>
      )}
    </Card>
  );
}
