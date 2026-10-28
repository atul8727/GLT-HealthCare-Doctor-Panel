export default function MedicineRow({ medicine, index }) {
  return (
    <div className="py-2.5 text-sm">
      <div className="flex items-baseline justify-between gap-2">
        <p className="font-bold text-[#14142B]">
          <span className="mr-1.5 text-xs text-[#64748B]">{index}.</span>
          {medicine.name}
        </p>
        <span className="text-xs font-semibold text-[#4F46E5]">{medicine.dosage}</span>
      </div>
      <p className="mt-0.5 text-xs text-[#64748B]">
        {medicine.frequency} • {medicine.duration}
        {medicine.instructions ? ` • ${medicine.instructions}` : ""}
      </p>
    </div>
  );
}
