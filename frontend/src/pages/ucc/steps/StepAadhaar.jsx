import { Radio } from './FormField';

export default function StepAadhaar({ data, errors, onChange }) {
  const update = (name, value) => onChange({ ...data, [name]: value });

  return (
    <div className="space-y-6">
      <Radio label="Aadhaar Updated" name="aadhaarUpdated" value={data.aadhaarUpdated}
        onChange={update} error={errors.aadhaarUpdated} required
        options={[
          { value: 'Y', label: 'Yes' },
          { value: 'N', label: 'No' },
        ]}
      />

      <Radio label="Paperless Flag" name="paperlessFlag" value={data.paperlessFlag}
        onChange={update} error={errors.paperlessFlag} required
        options={[
          { value: 'Z', label: 'Paperless (Z)' },
          { value: 'P', label: 'Paper (P)' },
        ]}
      />

      <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
        <p><strong>Aadhaar Updated:</strong> Whether Aadhaar details have been updated with KRA.</p>
        <p><strong>Paperless:</strong> Z = Paperless (digital), P = Paper (physical documents).</p>
      </div>
    </div>
  );
}
