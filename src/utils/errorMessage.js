// Converts backend errors into a message doctors can understand.
// A 403 means the backend is denying permission (the token isn't
// invalid, it just doesn't have access to that route) — this needs to
// be stated clearly so a developer/admin knows it's a backend-side fix.
export function friendlyError(err) {
  if (!err) return "Something went wrong. Please try again.";
  if (err.status === 403) {
    return (
      err.message ||
      "Access denied — this account (doctor role) doesn't have permission to call this API. Ask the backend team to enable doctor-role access for this route."
    );
  }
  if (err.status === 401) {
    return "Session expired. Please login again.";
  }
  return err.message || "Something went wrong. Please try again.";
}
