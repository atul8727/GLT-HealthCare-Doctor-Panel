// Backend errors ko doctor ke liye samajhne layak (Hindi/English mix)
// message mein convert karta hai. 403 ka matlab backend permission
// deny kar raha hai (token invalid nahi hai, sirf uss route ke liye
// access nahi hai) — isko clearly bata dena zaroori hai taaki
// developer/admin ko pata chale ki yeh backend-side fix hai.
export function friendlyError(err) {
  if (!err) return "Kuch galat ho gaya. Dobara try karein.";
  if (err.status === 403) {
    return (
      err.message ||
      "Access denied — is API ko call karne ki permission is account (doctor role) ke paas nahi hai. Backend team se is route par doctor-role access enable karwana hoga."
    );
  }
  if (err.status === 401) {
    return "Session expired. Please login again.";
  }
  return err.message || "Kuch galat ho gaya. Dobara try karein.";
}
