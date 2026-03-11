import { Select } from './FormField';
import { MOBILE_DECLARATION_CODES } from '../uccValidation';

export default function StepDeclaration({ data, errors, onChange }) {
  const update = (name, value) => onChange({ ...data, [name]: value });

  return (
    <div className="space-y-6">
      <Select label="Mobile Declaration Code" name="mobileDeclarationCode" value={data.mobileDeclarationCode}
        onChange={update} error={errors.mobileDeclarationCode} options={MOBILE_DECLARATION_CODES} required />

      <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
        <p>Indicate who the registered mobile number belongs to:</p>
        <ul className="list-disc list-inside mt-2 space-y-1">
          <li><strong>SE:</strong> Self — the mobile belongs to the primary holder</li>
          <li><strong>SP:</strong> Spouse — the mobile belongs to the spouse</li>
          <li><strong>DC:</strong> Dependent Children — the mobile belongs to a dependent child</li>
          <li><strong>GD:</strong> Guardian — the mobile belongs to the guardian</li>
        </ul>
      </div>
    </div>
  );
}
