import {
  StepCard,
  StepTitle,
  StepDescription,
  FormGrid,
  Field,
  FieldLabel,
  Required,
  Input,
  Select,
  Textarea,
  ErrorText,
  CheckboxRow,
  FullSpan,
} from './KycFormPrimitives';

const STATES = [
  'Andhra Pradesh',
  'Delhi',
  'Gujarat',
  'Karnataka',
  'Maharashtra',
  'Tamil Nadu',
  'Telangana',
  'West Bengal',
];

export default function KycStepAddressDetails({ data, errors, onChange, onToggleSameAsAadhaar }) {
  return (
    <StepCard>
      <StepTitle>Address Details</StepTitle>
      <StepDescription>Enter your current communication address for KYC records.</StepDescription>

      <CheckboxRow>
        <input
          type="checkbox"
          checked={Boolean(data.sameAsAadhaarAddress)}
          onChange={(e) => onToggleSameAsAadhaar(e.target.checked)}
        />
        <span>Same as Aadhaar Address</span>
      </CheckboxRow>

      <FormGrid>
        <FullSpan>
          <Field>
            <FieldLabel>Current Address <Required>*</Required></FieldLabel>
            <Textarea
              value={data.currentAddress || ''}
              onChange={(e) => onChange('currentAddress', e.target.value)}
              placeholder="Flat, Street, Area"
              disabled={Boolean(data.sameAsAadhaarAddress)}
            />
            {errors.currentAddress ? <ErrorText>{errors.currentAddress}</ErrorText> : null}
          </Field>
        </FullSpan>

        <Field>
          <FieldLabel>City <Required>*</Required></FieldLabel>
          <Input
            value={data.city || ''}
            onChange={(e) => onChange('city', e.target.value)}
            placeholder="City"
            disabled={Boolean(data.sameAsAadhaarAddress)}
          />
          {errors.city ? <ErrorText>{errors.city}</ErrorText> : null}
        </Field>

        <Field>
          <FieldLabel>State <Required>*</Required></FieldLabel>
          <Select
            value={data.state || ''}
            onChange={(e) => onChange('state', e.target.value)}
            disabled={Boolean(data.sameAsAadhaarAddress)}
          >
            <option value="">Select state</option>
            {STATES.map((state) => (
              <option value={state} key={state}>{state}</option>
            ))}
          </Select>
          {errors.state ? <ErrorText>{errors.state}</ErrorText> : null}
        </Field>

        <Field>
          <FieldLabel>Pincode <Required>*</Required></FieldLabel>
          <Input
            value={data.pincode || ''}
            onChange={(e) => onChange('pincode', e.target.value.replace(/\D/g, ''))}
            maxLength={6}
            placeholder="6-digit pincode"
            disabled={Boolean(data.sameAsAadhaarAddress)}
          />
          {errors.pincode ? <ErrorText>{errors.pincode}</ErrorText> : null}
        </Field>
      </FormGrid>
    </StepCard>
  );
}
