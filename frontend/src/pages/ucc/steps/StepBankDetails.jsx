import { Input, Select, Checkbox } from './FormField';
import { BANK_ACCOUNT_TYPES } from '../uccValidation';
import FormGrid from '../components/FormGrid';

export default function StepBankDetails({ data, errors, onChange }) {
  const banks = data.banks || [];

  const updateBank = (index, name, value) => {
    const updated = [...banks];
    updated[index] = { ...updated[index], [name]: value };

    // If setting as default, unset others
    if (name === 'defaultBank' && value) {
      updated.forEach((b, i) => {
        if (i !== index) b.defaultBank = false;
      });
    }

    onChange({ ...data, banks: updated });
  };

  const addBank = () => {
    if (banks.length >= 5) return;
    onChange({ ...data, banks: [...banks, { accountType: '', accountNumber: '', micrCode: '', ifscCode: '', defaultBank: false }] });
  };

  const removeBank = (index) => {
    const updated = banks.filter((_, i) => i !== index);
    onChange({ ...data, banks: updated });
  };

  return (
    <div className="space-y-8">
      {errors._bank && <p className="text-sm font-medium text-rose-600">{errors._bank}</p>}

      {banks.map((bank, i) => (
        <div key={i} className="relative rounded-xl border border-slate-200 bg-slate-50/60 p-5">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-700">Bank Account {i + 1}</h3>
            {banks.length > 1 && (
              <button onClick={() => removeBank(i)} className="text-sm font-medium text-rose-600 hover:text-rose-700">
                Remove
              </button>
            )}
          </div>
          <FormGrid>
            <Select label="Account Type" name="accountType" value={bank.accountType}
              onChange={(n, v) => updateBank(i, n, v)} error={errors[`banks.${i}.accountType`]}
              options={BANK_ACCOUNT_TYPES} required />
            <Input label="Account Number" name="accountNumber" value={bank.accountNumber}
              onChange={(n, v) => updateBank(i, n, v)} error={errors[`banks.${i}.accountNumber`]} required />
            <Input label="MICR Code" name="micrCode" value={bank.micrCode}
              onChange={(n, v) => updateBank(i, n, v)} error={errors[`banks.${i}.micrCode`]} required maxLength={9} />
            <Input label="IFSC Code" name="ifscCode" value={bank.ifscCode}
              onChange={(n, v) => updateBank(i, n, v)} error={errors[`banks.${i}.ifscCode`]} required
              placeholder="SBIN0001234" maxLength={11} helperText="Format: 4 letters + 0 + 6 alphanumeric" />
            <Checkbox label="Default Bank" name="defaultBank" checked={bank.defaultBank}
              onChange={(n, v) => updateBank(i, n, v)} />
          </FormGrid>
        </div>
      ))}

      {banks.length < 5 && (
        <button onClick={addBank}
          className="h-11 w-full rounded-lg border border-dashed border-slate-300 px-4 text-sm font-semibold text-slate-600 transition hover:border-sky-400 hover:text-sky-700">
          + Add Bank Account ({banks.length}/5)
        </button>
      )}
    </div>
  );
}
