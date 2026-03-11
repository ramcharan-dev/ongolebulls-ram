import { Input, Select } from './FormField';
import { INDIAN_STATES } from '../uccValidation';
import FormGrid from '../components/FormGrid';

export default function StepAddress({ data, errors, onChange }) {
  const update = (name, value) => onChange({ ...data, [name]: value });

  return (
    <FormGrid>
      <div className="ucc-span-2">
        <Input label="Address Line 1" name="addressLine1" value={data.addressLine1}
          onChange={update} error={errors.addressLine1} required />
      </div>
      <Input label="Address Line 2" name="addressLine2" value={data.addressLine2} onChange={update} />
      <Input label="Address Line 3" name="addressLine3" value={data.addressLine3} onChange={update} />
      <Input label="City" name="city" value={data.city}
        onChange={update} error={errors.city} required />
      <Select label="State" name="state" value={data.state}
        onChange={update} error={errors.state} required
        options={INDIAN_STATES.map(s => ({ value: s, label: s }))} />
      <Input label="Pincode" name="pincode" value={data.pincode}
        onChange={update} error={errors.pincode} required placeholder="e.g. 500001" maxLength={6} />
      <Select label="Country" name="country" value={data.country}
        onChange={update} error={errors.country} required
        options={[
          { value: 'IN', label: 'India' },
          { value: 'US', label: 'United States' },
          { value: 'GB', label: 'United Kingdom' },
          { value: 'AE', label: 'UAE' },
          { value: 'SG', label: 'Singapore' },
        ]} />
    </FormGrid>
  );
}
