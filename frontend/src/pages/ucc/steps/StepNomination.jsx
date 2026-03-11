import { Radio, Select } from './FormField';
import { NOMINATION_AUTH_MODES } from '../uccValidation';

export default function StepNomination({ data, errors, onChange }) {
  const update = (name, value) => onChange({ ...data, [name]: value });

  return (
    <div className="space-y-6">
      <Radio label="Nomination Opt" name="nominationOpt" value={data.nominationOpt}
        onChange={update} error={errors.nominationOpt} required
        options={[
          { value: 'Y', label: 'Yes — I want to add nominees' },
          { value: 'N', label: 'No — I opt out of nomination' },
        ]}
      />

      {data.nominationOpt === 'Y' && (
        <Select label="Nomination Authentication Mode" name="nominationAuthMode" value={data.nominationAuthMode}
          onChange={update} error={errors.nominationAuthMode}
          options={NOMINATION_AUTH_MODES} required />
      )}

      <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
        <p><strong>Important:</strong> SEBI mandates nomination for mutual fund investments. If you opt out, you may need to provide a separate declaration.</p>
      </div>
    </div>
  );
}
