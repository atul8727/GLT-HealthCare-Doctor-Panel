import { FiTrash2, FiPlus } from "react-icons/fi";
import Input from "../ui/Input";
import Select from "../ui/Select";
import Button from "../ui/Button";

const FREQUENCIES = [
  "Once Daily",
  "Twice Daily",
  "Thrice Daily",
  "Every 6 Hours",
  "At Night",
  "As Needed",
];

export default function MedicineForm({ medicines, onChange }) {
  const update = (id, key, value) =>
    onChange(medicines.map((m) => (m.id === id ? { ...m, [key]: value } : m)));

  const remove = (id) => onChange(medicines.filter((m) => m.id !== id));

  const add = () =>
    onChange([
      ...medicines,
      { id: `MED-${Date.now()}`, name: "", dosage: "", frequency: "", duration: "", instructions: "" },
    ]);

  return (
    <div className="space-y-4">
      {medicines.map((m, i) => (
        <div
          key={m.id}
          className="relative rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-4 transition-all hover:border-slate-300 sm:p-5"
        >
          <div className="mb-4 flex items-center justify-between">
            <span className="flex items-center gap-2 text-sm font-bold text-[#14142B]">
              <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-indigo-100 text-xs font-extrabold text-[#4F46E5]">
                {i + 1}
              </span>
              Medicine {i + 1}
            </span>
            {medicines.length > 1 && (
              <button
                type="button"
                onClick={() => remove(m.id)}
                aria-label={`Remove medicine ${i + 1}`}
                className="cursor-pointer rounded-lg p-1.5 text-rose-500 transition-colors hover:bg-rose-50 hover:text-rose-600"
              >
                <FiTrash2 size={16} />
              </button>
            )}
          </div>

          <div className="grid gap-3.5 sm:grid-cols-2">
            <Input
              label="Medicine Name"
              value={m.name}
              onChange={(e) => update(m.id, "name", e.target.value)}
              placeholder="e.g. Paracetamol 650"
            />
            <Input
              label="Dosage"
              value={m.dosage}
              onChange={(e) => update(m.id, "dosage", e.target.value)}
              placeholder="e.g. 1 Tablet"
            />
            <Select
              label="Frequency"
              value={m.frequency}
              onChange={(e) => update(m.id, "frequency", e.target.value)}
              options={FREQUENCIES}
            />
            <Input
              label="Duration"
              value={m.duration}
              onChange={(e) => update(m.id, "duration", e.target.value)}
              placeholder="e.g. 5 Days"
            />
            <Input
              label="Instructions"
              value={m.instructions}
              onChange={(e) => update(m.id, "instructions", e.target.value)}
              placeholder="e.g. After meals with water"
              containerClassName="sm:col-span-2"
            />
          </div>
        </div>
      ))}

      <Button
        variant="outlineIndigo"
        icon={FiPlus}
        onClick={add}
        type="button"
        className="w-full sm:w-auto"
      >
        Add Another Medicine
      </Button>
    </div>
  );
}
