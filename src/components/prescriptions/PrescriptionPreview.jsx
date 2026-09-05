import MedicineRow from "../common/MedicineRow";
import { formatDate } from "../../utils/formatDate";

export default function PrescriptionPreview({ prescription, patient, doctor }) {
  return (
    <div id="prescription-preview" className="bg-white p-6 sm:p-8 rounded-xl border border-slate-200 max-w-xl mx-auto text-navy">
      <div className="text-center border-b border-slate-200 pb-4 mb-4">
        <p className="font-bold text-lg tracking-wide">GLT HEALTHCARE</p>
        <p className="text-xs text-muted">Healthcare & Teleconsultation</p>
      </div>

      <div className="flex justify-between items-start mb-4 text-sm">
        <div>
          <p className="font-semibold">{doctor?.name}</p>
          <p className="text-muted text-xs">{doctor?.specialization}</p>
        </div>
        <p className="text-muted text-xs">
          {prescription?.id && `${prescription.id}`} <br />
          {formatDate(prescription?.date)}
        </p>
      </div>

      <div className="border-t border-dashed border-slate-300 pt-4 mb-4 text-sm">
        <p className="font-semibold">Patient: {patient?.name}</p>
        <p className="text-muted text-xs mt-0.5">
          Age: {patient?.age} • Gender: {patient?.gender}
        </p>
        <p className="mt-2">
          <span className="text-muted text-xs">Diagnosis:</span> <br />
          <span className="font-medium">{prescription?.diagnosis || "—"}</span>
        </p>
      </div>

      <div className="border-t border-dashed border-slate-300 pt-4 mb-4">
        <p className="text-xs font-semibold text-muted uppercase mb-2">Medicines</p>
        {prescription?.medicines?.length ? (
          prescription.medicines.map((m, i) => <MedicineRow key={m.id || i} medicine={m} index={i + 1} />)
        ) : (
          <p className="text-sm text-muted">No medicines added.</p>
        )}
      </div>

      {prescription?.testsRecommended && (
        <div className="border-t border-dashed border-slate-300 pt-3 mb-3 text-sm">
          <p className="text-xs font-semibold text-muted uppercase mb-1">Tests Recommended</p>
          <p>{prescription.testsRecommended}</p>
        </div>
      )}

      <div className="border-t border-dashed border-slate-300 pt-3 mb-3 text-sm">
        <p className="text-xs font-semibold text-muted uppercase mb-1">Advice</p>
        <p>{prescription?.additionalAdvice || "—"}</p>
      </div>

      {prescription?.followUpDate && (
        <div className="border-t border-dashed border-slate-300 pt-3 mb-6 text-sm">
          <p className="text-xs font-semibold text-muted uppercase mb-1">Follow-up</p>
          <p>{formatDate(prescription.followUpDate)}</p>
        </div>
      )}

      <div className="text-right text-sm mt-8">
        <p className="border-t border-slate-300 inline-block pt-1 px-4">Doctor Signature</p>
      </div>
    </div>
  );
}
