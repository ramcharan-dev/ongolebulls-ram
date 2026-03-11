import { Input, Select, Radio } from './FormField';
import { TAX_STATUSES, OCCUPATION_CODES, HOLDING_NATURES } from '../uccValidation';
import FormGrid from '../components/FormGrid';

export default function StepClientDetails({ data, errors, onChange }) {
  const update = (name, value) => {
    const updated = { ...data, [name]: value };
    // Auto-detect minor if tax status is "On behalf of Minor"
    if (name === 'taxStatus') {
      updated.isMinor = value === '02';
    }
    onChange(updated);
  };

  const isIndividual = ['01', '02', '03'].includes(data.taxStatus);

  return (
    <FormGrid>
      <Input label="Client Code (UCC)" name="clientCode" value={data.clientCode}
        onChange={update} error={errors.clientCode} required placeholder="e.g. ABC12345" maxLength={10} />

      <Input label="Primary Holder First Name" name="firstName" value={data.firstName}
        onChange={update} error={errors.firstName} required />

      <Input label="Middle Name" name="middleName" value={data.middleName}
        onChange={update} />

      <Input label="Last Name" name="lastName" value={data.lastName}
        onChange={update} />

      <Select label="Tax Status" name="taxStatus" value={data.taxStatus}
        onChange={update} error={errors.taxStatus} options={TAX_STATUSES} required />

      {isIndividual && (
        <Radio label="Gender" name="gender" value={data.gender}
          onChange={update} error={errors.gender} required
          options={[
            { value: 'M', label: 'Male' },
            { value: 'F', label: 'Female' },
            { value: 'T', label: 'Transgender' },
          ]}
        />
      )}

      <Input label="Date of Birth / Incorporation Date" name="dob" value={data.dob}
        onChange={update} error={errors.dob} required type="date" />

      <Select label="Occupation Code" name="occupationCode" value={data.occupationCode}
        onChange={update} error={errors.occupationCode} options={OCCUPATION_CODES} required />

      <Select label="Holding Nature" name="holdingNature" value={data.holdingNature}
        onChange={update} error={errors.holdingNature} options={HOLDING_NATURES} required />
    </FormGrid>
  );
}
