# GLT Healthcare — Doctor Portal

React + Vite + Tailwind CSS + React Router + Framer Motion.

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:5173

**Login:** ab real backend se hota hai. Wahi email/password use karo
jo Admin panel se doctor account banate waqt diya gaya tha
(`POST /api/auth/login` with `role: "doctor"`). Koi demo/hardcoded
credential nahi hai.

## Backend integration (IMPORTANT — updated)

Yeh app ab **real backend API** (`https://glt.fctesting.shop/api`) se
connected hai. Base URL `.env` mein set hai:

```
VITE_API_BASE_URL=https://glt.fctesting.shop/api
```

Isko apne server ke hisaab se `.env` file mein change kar sakte ho.

### Kaunsi APIs connect hain (Admin ke Postman collection se)

| Feature | Endpoint | Service |
|---|---|---|
| Login | `POST /auth/login` (role: "doctor") | `services/auth/authService.js` |
| My Profile (view/update) | `GET/PUT /doctors/:id` | `services/profile/profileService.js` |
| Change Password | `PUT /doctors/:id/password` | `services/profile/profileService.js` |
| Patients list/detail | `GET /patients`, `GET /patients/:id` | `services/patients/patientService.js` |
| Vitals (record/update/history) | `POST /vitals/`, `PUT /vitals/:id`, `GET /vitals/patient/:id`, `GET /vitals/consultation/:id` | `services/vitals/vitalsService.js` |
| Consultations list/detail | `GET /consultations`, `GET /consultations/:id` | `services/consultations/consultationService.js` |
| Submit clinical details | `PUT /consultations/:id/clinical` | `services/consultations/consultationService.js` |
| Cancel consultation | `PUT /consultations/:id/cancel` | `services/consultations/consultationService.js` |
| Dashboard stats | *(no dedicated endpoint)* — computed client-side from real patients + consultations | `services/dashboard/dashboardService.js` |

### Prescriptions — abhi bhi local hai

Admin ke Postman collection mein **prescriptions ka koi API endpoint
nahi hai**, isliye yeh feature filhaal browser ke `localStorage` mein
hi save hota hai (key: `glt_doctor_prescriptions`). Jaise hi backend
team prescription ke liye REST route deti hai, sirf
`src/services/prescriptions/prescriptionService.js` ko update karna
hoga — koi page/component touch nahi karna padega.

Doctor apna account khud create/delete/status-change nahi kar sakta
(woh admin-only actions hain — `createDoctor`, `deleteDoctor`,
`setDoctorStatus`, `listDoctors` — isliye doctor panel mein include
nahi kiye gaye). Doctor sirf apni khud ki profile dekh/update kar
sakta hai aur apna password change kar sakta hai.

### Response shape

Backend har response `{ success, message, data }` shape mein bhejta
hai. `src/services/apiClient.js` automatically `data` ko unwrap kar
deta hai, aur `src/utils/normalize.js` field names (snake_case ↔
camelCase) ko UI ke expected shape mein map karta hai — agar backend
ka exact field naming thoda alag nikle to bas `normalize.js` ke
`pick(...)` calls mein wahi extra key-name add kar dena, kahin aur
kuch badalne ki zaroorat nahi.

### Assumptions jo maine liye hain (verify kar lena)

- `listConsultations` (`GET /consultations`) doctor ke apne hi
  consultations return karta hai (JWT token se backend filter karta
  hoga) — agar nahi, to query param add karna padega.
- Consultation object ke exact field names (`chief_complaint` vs
  `chiefComplaint` type) postman collection mein sirf request body ke
  liye diye the, response body confirm nahi thi — `normalizeConsultation()`
  dono variants handle karta hai, lekin agar list/detail response
  kuch aur hi naam use kare to `utils/normalize.js` mein update kar
  dena.
- `submitClinicalDetails` complete hone par consultation status khud
  "Completed" set kar deta hai — agar backend aisa nahi karta to ek
  alag status-update call add karni hogi.
- `updateSchedule` (reschedule) aur `scheduleConsultation` (naya
  consultation banana) — yeh admin-side actions hain, doctor panel
  mein include nahi kiye.

## Folder structure

```
src/
├── components/{ui,layout,common,dashboard,patients,consultations,prescriptions}
├── pages/{auth,doctor/{dashboard,patients,consultations,patient-history,prescriptions,profile,settings}}
├── services/{auth,dashboard,patients,vitals,consultations,prescriptions,profile}
├── context/AuthContext.jsx
├── hooks/useAuth.js
├── routes/ProtectedRoute.jsx
├── config/{api.js,endpoints.js}
├── constants/{roles.js,statuses.js,navigation.js}
└── utils/{storage.js,normalize.js,formatDate.js}
```

## Notes / things left as simple stubs

- Prescriptions: local-only (see above), no backend endpoint exists yet.
- PDF download / share buttons for prescriptions show a toast — wire
  to real generation once needed.
