export default function MedicineRow({ medicine, index }) {
  return (
    <div className="text-sm py-2 border-b border-slate-100 last:border-0">
      <p className="font-medium text-navy">
        {index}. {medicine.name}
      </p>
      <p className="text-muted text-xs mt-0.5">
        {medicine.dosage} • {medicine.frequency} • {medicine.duration}
        {medicine.instructions ? ` • ${medicine.instructions}` : ""}
      </p>
    </div>
  );
}
