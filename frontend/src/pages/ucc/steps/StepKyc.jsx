import { Input, Select } from './FormField';
import { KYC_TYPES } from '../uccValidation';
import FormGrid from '../components/FormGrid';

export default function StepKyc({ data, errors, onChange }) {
  const update = (name, value) => onChange({ ...data, [name]: value });

  return (
    <div className="space-y-6">
      <FormGrid>
        <Select label="Primary Holder KYC Type" name="kycType" value={data.kycType}
          onChange={update} error={errors.kycType} options={KYC_TYPES} required />

        {data.kycType === 'C' && (
          <Input label="CKYC Number" name="ckycNumber" value={data.ckycNumber}
            onChange={update} error={errors.ckycNumber} required placeholder="14-digit CKYC number" maxLength={14} />
        )}
      </FormGrid>

      <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
        <p><strong>K (KRA):</strong> KYC verified through KRA (KYC Registration Agency)</p>
        <p><strong>C (CKYC):</strong> Central KYC — requires CKYC number</p>
        <p><strong>B (Biometric):</strong> KYC done via biometric verification</p>
        <p><strong>E (Aadhaar eKYC):</strong> KYC done via Aadhaar-based eKYC</p>
      </div>
    </div>
  );
}
