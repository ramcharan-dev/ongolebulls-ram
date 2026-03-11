import { Input, Select } from './FormField';
import FormGrid from '../components/FormGrid';

export default function StepNriDetails({ data, errors, onChange, allData }) {
  const isNRI = ['21', '24'].includes(allData?.clientDetails?.taxStatus);
  const update = (name, value) => onChange({ ...data, [name]: value });

  if (!isNRI) return null;

  return (
    <FormGrid>
      <div className="ucc-span-2">
        <Input label="Foreign Address Line 1" name="foreignAddress1" value={data.foreignAddress1}
          onChange={update} error={errors.foreignAddress1} required />
      </div>
      <Input label="Foreign City" name="foreignCity" value={data.foreignCity}
        onChange={update} error={errors.foreignCity} required />
      <Input label="Foreign State" name="foreignState" value={data.foreignState}
        onChange={update} error={errors.foreignState} required />
      <Select label="Foreign Country" name="foreignCountry" value={data.foreignCountry}
        onChange={update} error={errors.foreignCountry} required
        options={[
          { value: 'US', label: 'United States' },
          { value: 'GB', label: 'United Kingdom' },
          { value: 'AE', label: 'UAE' },
          { value: 'SG', label: 'Singapore' },
          { value: 'CA', label: 'Canada' },
          { value: 'AU', label: 'Australia' },
          { value: 'DE', label: 'Germany' },
          { value: 'JP', label: 'Japan' },
        ]} />
      <Input label="Foreign Pincode" name="foreignPincode" value={data.foreignPincode}
        onChange={update} error={errors.foreignPincode} required />
    </FormGrid>
  );
}
