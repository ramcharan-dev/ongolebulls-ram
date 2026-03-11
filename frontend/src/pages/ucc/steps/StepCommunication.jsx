import { Radio } from './FormField';
import { COMMUNICATION_MODES } from '../uccValidation';

export default function StepCommunication({ data, errors, onChange }) {
  const update = (name, value) => onChange({ ...data, [name]: value });

  return (
    <div className="space-y-6">
      <Radio label="Communication Mode" name="communicationMode" value={data.communicationMode}
        onChange={update} error={errors.communicationMode} required options={COMMUNICATION_MODES} />

      <div className="mt-2 rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
        <p><strong>P (Physical):</strong> Communication via postal mail</p>
        <p><strong>E (Email):</strong> Communication via email</p>
        <p><strong>M (Mobile):</strong> Communication via SMS/mobile</p>
      </div>
    </div>
  );
}
