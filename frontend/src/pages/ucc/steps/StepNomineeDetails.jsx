import { Input, Select, Radio } from './FormField';
import { NOMINEE_RELATIONSHIPS } from '../uccValidation';
import FormGrid from '../components/FormGrid';

export default function StepNomineeDetails({ data, errors, onChange, allData }) {
  const hasNomination = allData?.nomination?.nominationOpt === 'Y';
  const nominees = data.nominees || [];

  if (!hasNomination) return null;

  const updateNominee = (index, name, value) => {
    const updated = [...nominees];
    updated[index] = { ...updated[index], [name]: value };
    onChange({ ...data, nominees: updated });
  };

  const addNominee = () => {
    if (nominees.length >= 3) return;
    onChange({
      ...data,
      nominees: [...nominees, {
        name: '', relationship: '', percentage: '', isMinor: 'N',
        nomineeDob: '', guardianName: '', guardianPan: '',
        identityType: '', identityNumber: '', email: '', mobile: '',
        address: '', city: '', pincode: '', country: 'IN',
      }],
    });
  };

  const removeNominee = (index) => {
    onChange({ ...data, nominees: nominees.filter((_, i) => i !== index) });
  };

  // Calculate total percentage
  const totalPct = nominees.reduce((sum, n) => sum + (Number(n.percentage) || 0), 0);

  return (
    <div className="space-y-8">
      {errors._nominee && (
        <div className="rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">{errors._nominee}</div>
      )}

      {/* Percentage indicator */}
      {nominees.length > 0 && (
        <div className="flex items-center gap-3">
          <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${
                totalPct === 100 ? 'bg-emerald-500' : totalPct > 100 ? 'bg-red-500' : 'bg-amber-500'
              }`}
              style={{ width: `${Math.min(totalPct, 100)}%` }}
            />
          </div>
          <span className={`text-sm font-semibold ${
            totalPct === 100 ? 'text-emerald-600' : 'text-amber-600'
          }`}>
            {totalPct}%
          </span>
        </div>
      )}

      {nominees.map((nominee, i) => (
        <div key={i} className="rounded-xl border border-slate-200 bg-slate-50/70 p-5">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-700">Nominee {i + 1}</h3>
            <button onClick={() => removeNominee(i)} className="text-sm font-medium text-rose-600 hover:text-rose-700">Remove</button>
          </div>

          <FormGrid>
            <Input label="Nominee Name" name="name" value={nominee.name}
              onChange={(n, v) => updateNominee(i, n, v)} error={errors[`nominees.${i}.name`]} required />

            <Select label="Relationship" name="relationship" value={nominee.relationship}
              onChange={(n, v) => updateNominee(i, n, v)} error={errors[`nominees.${i}.relationship`]} required
              options={NOMINEE_RELATIONSHIPS.map(r => ({ value: r, label: r }))} />

            <Input label="Percentage (%)" name="percentage" value={nominee.percentage}
              onChange={(n, v) => updateNominee(i, n, v)} error={errors[`nominees.${i}.percentage`]} required type="number" />

            <Radio label="Is Minor?" name="isMinor" value={nominee.isMinor}
              onChange={(n, v) => updateNominee(i, n, v)} error={errors[`nominees.${i}.isMinor`]} required
              options={[{ value: 'Y', label: 'Yes' }, { value: 'N', label: 'No' }]} />

            {nominee.isMinor === 'Y' && (
              <>
                <Input label="Nominee DOB" name="nomineeDob" value={nominee.nomineeDob}
                  onChange={(n, v) => updateNominee(i, n, v)} error={errors[`nominees.${i}.nomineeDob`]} required type="date" />
                <Input label="Guardian Name" name="guardianName" value={nominee.guardianName}
                  onChange={(n, v) => updateNominee(i, n, v)} error={errors[`nominees.${i}.guardianName`]} required />
                <Input label="Guardian PAN" name="guardianPan" value={nominee.guardianPan}
                  onChange={(n, v) => updateNominee(i, n, v)} placeholder="ABCDE1234F" maxLength={10}
                  helperText="PAN format: ABCDE1234F" />
              </>
            )}

            <Select label="Identity Type" name="identityType" value={nominee.identityType}
              onChange={(n, v) => updateNominee(i, n, v)} error={errors[`nominees.${i}.identityType`]} required
              options={[
                { value: 'PAN', label: 'PAN' },
                { value: 'AADHAAR', label: 'Aadhaar' },
                { value: 'PASSPORT', label: 'Passport' },
                { value: 'DRIVING_LICENSE', label: 'Driving License' },
                { value: 'VOTER_ID', label: 'Voter ID' },
              ]} />
            <Input label="Identity Number" name="identityNumber" value={nominee.identityNumber}
              onChange={(n, v) => updateNominee(i, n, v)} error={errors[`nominees.${i}.identityNumber`]} required />

            <Input label="Email" name="email" value={nominee.email}
              onChange={(n, v) => updateNominee(i, n, v)} type="email" />
            <Input label="Mobile" name="mobile" value={nominee.mobile}
              onChange={(n, v) => updateNominee(i, n, v)} maxLength={10} />
            <Input label="Address" name="address" value={nominee.address}
              onChange={(n, v) => updateNominee(i, n, v)} />
            <Input label="City" name="city" value={nominee.city}
              onChange={(n, v) => updateNominee(i, n, v)} />
            <Input label="Pincode" name="pincode" value={nominee.pincode}
              onChange={(n, v) => updateNominee(i, n, v)} maxLength={6} />
          </FormGrid>
        </div>
      ))}

      {nominees.length < 3 && (
        <button onClick={addNominee}
          className="h-11 w-full rounded-lg border border-dashed border-slate-300 px-4 text-sm font-semibold text-slate-600 transition hover:border-sky-400 hover:text-sky-700">
          + Add Nominee ({nominees.length}/3)
        </button>
      )}
    </div>
  );
}
