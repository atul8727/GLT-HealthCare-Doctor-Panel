import Badge from "../ui/Badge";
import { CONSULTATION_STATUS_COLOR } from "../../constants/statuses";

export default function StatusBadge({ status }) {
  const color = CONSULTATION_STATUS_COLOR[status] || "neutral";
  return <Badge color={color}>{status}</Badge>;
}
