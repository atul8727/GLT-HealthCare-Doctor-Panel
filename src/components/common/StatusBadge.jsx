import Badge from "../ui/Badge";
import { FiCheck, FiClock, FiX, FiActivity } from "react-icons/fi";

const STATUS_CONFIG = {
  Scheduled: { color: "warning", icon: FiClock },
  "In Progress": { color: "primary", icon: FiActivity },
  Completed: { color: "success", icon: FiCheck },
  Cancelled: { color: "danger", icon: FiX },
  Active: { color: "success", icon: FiCheck },
  Pending: { color: "warning", icon: FiClock },
  Inactive: { color: "danger", icon: FiX },
};

export default function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] || { color: "neutral", icon: null };
  const Icon = cfg.icon;

  return (
    <Badge color={cfg.color} className="inline-flex items-center gap-1 font-semibold">
      {Icon && <Icon className="h-3 w-3 shrink-0" />}
      <span>{status}</span>
    </Badge>
  );
}

