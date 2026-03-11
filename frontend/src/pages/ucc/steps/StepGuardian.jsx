import { Input, Select } from './FormField';
import { GUARDIAN_RELATIONSHIPS } from '../uccValidation';
import FormGrid from '../components/FormGrid';

export default function StepGuardian({ data, errors, onChange, allData }) {
  const isMinor = allData?.clientDetails?.isMinor;
  const update = (name, value) => onChange({ ...data, [name]: value });

  if (!isMinor) return null;

  return (
    <FormGrid>
      <Input label="Guardian First Name" name="guardianFirstName" value={data.guardianFirstName}
        onChange={update} error={errors.guardianFirstName} required />
      <Input label="Guardian Middle Name" name="guardianMiddleName" value={data.guardianMiddleName}
        onChange={update} />
      <Input label="Guardian Last Name" name="guardianLastName" value={data.guardianLastName}
        onChange={update} error={errors.guardianLastName} required />
      <Input label="Guardian DOB" name="guardianDob" value={data.guardianDob}
        onChange={update} error={errors.guardianDob} required type="date" />
      <Input label="Guardian PAN" name="guardianPan" value={data.guardianPan}
        onChange={update} error={errors.guardianPan} required placeholder="ABCDE1234F" maxLength={10} />
      <Select label="Relationship Code" name="guardianRelationshipCode" value={data.guardianRelationshipCode}
        onChange={update} error={errors.guardianRelationshipCode} options={GUARDIAN_RELATIONSHIPS} required />
    </FormGrid>
  );
}
