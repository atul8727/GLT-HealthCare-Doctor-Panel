import { avatarColor, initialsOf } from "../../utils/avatarColor";

const SIZES = {
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-14 w-14 text-lg",
};

/**
 * <Avatar name="Rahul Sharma" id={patient.id} size="md" />
 * Colour is derived from `id` (falls back to name) so it stays consistent.
 */
export default function Avatar({ name = "", id, size = "md", className = "" }) {
  return (
    <span
      className={`flex shrink-0 items-center justify-center rounded-full font-bold text-white shadow-sm ${
        SIZES[size] || SIZES.md
      } ${avatarColor(id ?? name)} ${className}`}
    >
      {initialsOf(name)}
    </span>
  );
}