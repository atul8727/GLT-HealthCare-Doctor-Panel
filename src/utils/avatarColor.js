// Har patient/doctor ko ek consistent (unhi ki ID se derive hui)
// colorful gradient avatar deta hai — plain monochrome avatars ki
// jagah UI mein thoda life aur visual distinction aata hai.
const AVATAR_COLORS = [
  "bg-gradient-to-br from-sky-400 to-blue-600",
  "bg-gradient-to-br from-violet-400 to-indigo-600",
  "bg-gradient-to-br from-emerald-400 to-teal-600",
  "bg-gradient-to-br from-amber-400 to-orange-500",
  "bg-gradient-to-br from-rose-400 to-pink-600",
];

export function avatarColor(id) {
  const n = Math.abs(String(id ?? "").split("").reduce((a, c) => a + c.charCodeAt(0), 0));
  return AVATAR_COLORS[n % AVATAR_COLORS.length];
}

export function initialsOf(name = "") {
  return name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase() || "?";
}
