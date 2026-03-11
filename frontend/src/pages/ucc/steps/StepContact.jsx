import { Input } from './FormField';
import FormGrid from '../components/FormGrid';

export default function StepContact({ data, errors, onChange }) {
  const update = (name, value) => onChange({ ...data, [name]: value });

  return (
    <FormGrid>
      <Input label="Mobile Number" name="mobile" value={data.mobile}
        onChange={update} error={errors.mobile} required placeholder="9876543210" maxLength={10} />
      <Input label="Email" name="email" value={data.email}
        onChange={update} error={errors.email} required type="email" placeholder="investor@example.com" />
      <Input label="Residence Phone" name="residencePhone" value={data.residencePhone}
        onChange={update} placeholder="Optional" />
      <Input label="Office Phone" name="officePhone" value={data.officePhone}
        onChange={update} placeholder="Optional" />
    </FormGrid>
  );
}
