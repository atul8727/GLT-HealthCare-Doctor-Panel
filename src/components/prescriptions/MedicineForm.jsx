import { FiTrash2, FiPlus } from "react-icons/fi";
import Input from "../ui/Input";
import Select from "../ui/Select";
import Button from "../ui/Button";

const FREQUENCIES = ["Once Daily", "Twice Daily", "Thrice Daily", "Every 6 Hours", "At Night", "As Needed"];

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
        <div key={m.id} className="border border-slate-200 rounded-xl p-4 relative">
          <p className="text-sm font-semibold text-navy mb-3">Medicine {i + 1}</p>
          {medicines.length > 1 && (
            <button
              onClick={() => remove(m.id)}
              className="absolute top-3 right-3 text-danger hover:bg-red-50 p-1.5 rounded-md"
            >
              <FiTrash2 size={15} />
            </button>
          )}
          <div className="grid sm:grid-cols-2 gap-3">
            <Input label="Medicine Name" value={m.name} onChange={(e) => update(m.id, "name", e.target.value)} placeholder="e.g. Paracetamol" />
            <Input label="Dosage" value={m.dosage} onChange={(e) => update(m.id, "dosage", e.target.value)} placeholder="e.g. 500 mg" />
            <Select
              label="Frequency"
              value={m.frequency}
              onChange={(e) => update(m.id, "frequency", e.target.value)}
              options={FREQUENCIES}
            />
            <Input label="Duration" value={m.duration} onChange={(e) => update(m.id, "duration", e.target.value)} placeholder="e.g. 5 Days" />
            <Input
              label="Instructions"
              value={m.instructions}
              onChange={(e) => update(m.id, "instructions", e.target.value)}
              placeholder="e.g. After Food"
              containerClassName="sm:col-span-2"
            />
          </div>
        </div>
      ))}
      <Button variant="outline" icon={FiPlus} onClick={add} type="button">
        Add Medicine
      </Button>
    </div>
  );
}
