import { Input } from './FormField';
import FormGrid from '../components/FormGrid';

export default function StepPanDetails({ data, errors, onChange }) {
  const update = (name, value) => onChange({ ...data, [name]: value?.toUpperCase() });

  return (
    <FormGrid>
      <Input label="Primary Holder PAN" name="primaryPan" value={data.primaryPan}
        onChange={update} error={errors.primaryPan} required placeholder="ABCDE1234F" maxLength={10}
        helperText="PAN must be valid format (ABCDE1234F)" />
      <Input label="Second Holder PAN" name="secondPan" value={data.secondPan}
        onChange={update} error={errors.secondPan} placeholder="ABCDE1234F" maxLength={10}
        helperText="Use uppercase PAN format" />
      <Input label="Third Holder PAN" name="thirdPan" value={data.thirdPan}
        onChange={update} error={errors.thirdPan} placeholder="ABCDE1234F" maxLength={10}
        helperText="Use uppercase PAN format" />
      <Input label="Guardian PAN" name="guardianPan" value={data.guardianPan}
        onChange={update} error={errors.guardianPan} placeholder="ABCDE1234F" maxLength={10}
        helperText="Required only for minor/guardian cases" />
    </FormGrid>
  );
}
