import {
  StepCard,
  StepTitle,
  StepDescription,
  FormGrid,
  Field,
  FieldLabel,
  Input,
  Select,
  Textarea,
  ErrorText,
  FullSpan,
  HelperText,
} from './KycFormPrimitives';

const RELATIONSHIPS = ['Spouse', 'Father', 'Mother', 'Son', 'Daughter', 'Sibling', 'Other'];

export default function KycStepNomineeDetails({ data, errors, onChange }) {
  return (
    <StepCard>
      <StepTitle>Nominee Details</StepTitle>
      <StepDescription>Nominee details are optional but strongly recommended for smoother claim processing.</StepDescription>

      <FormGrid>
        <Field>
          <FieldLabel>Nominee Name</FieldLabel>
          <Input value={data.nomineeName || ''} onChange={(e) => onChange('nomineeName', e.target.value)} placeholder="Nominee full name" />
          {errors.nomineeName ? <ErrorText>{errors.nomineeName}</ErrorText> : null}
        </Field>

        <Field>
          <FieldLabel>Relationship</FieldLabel>
          <Select value={data.relationship || ''} onChange={(e) => onChange('relationship', e.target.value)}>
            <option value="">Select relationship</option>
            {RELATIONSHIPS.map((item) => (
              <option value={item} key={item}>{item}</option>
            ))}
          </Select>
          {errors.relationship ? <ErrorText>{errors.relationship}</ErrorText> : null}
        </Field>

        <Field>
          <FieldLabel>Nominee Date of Birth</FieldLabel>
          <Input type="date" value={data.nomineeDob || ''} onChange={(e) => onChange('nomineeDob', e.target.value)} />
          {errors.nomineeDob ? <ErrorText>{errors.nomineeDob}</ErrorText> : null}
        </Field>

        <FullSpan>
          <Field>
            <FieldLabel>Nominee Address</FieldLabel>
            <Textarea value={data.nomineeAddress || ''} onChange={(e) => onChange('nomineeAddress', e.target.value)} placeholder="Nominee address" />
            {errors.nomineeAddress ? <ErrorText>{errors.nomineeAddress}</ErrorText> : null}
          </Field>
        </FullSpan>
      </FormGrid>

      <HelperText>If nominee details are entered, all nominee fields become mandatory.</HelperText>
    </StepCard>
  );
}
