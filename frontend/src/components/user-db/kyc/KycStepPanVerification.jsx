import {
  StepCard,
  StepTitle,
  StepDescription,
  FormGrid,
  Field,
  FieldLabel,
  Required,
  Input,
  ErrorText,
  InlineRow,
  PillStatus,
  PrimaryAction,
} from './KycFormPrimitives';

export default function KycStepPanVerification({ data, errors, panStatus, onChange, onVerifyPan }) {
  return (
    <StepCard>
      <StepTitle>PAN Verification</StepTitle>
      <StepDescription>Verify your PAN details before continuing.</StepDescription>

      <FormGrid>
        <Field>
          <FieldLabel>PAN Number <Required>*</Required></FieldLabel>
          <Input
            value={data.panNumber || ''}
            onChange={(e) => onChange('panNumber', e.target.value.toUpperCase())}
            maxLength={10}
            placeholder="ABCDE1234F"
          />
          {errors.panNumber ? <ErrorText>{errors.panNumber}</ErrorText> : null}
        </Field>

        <Field>
          <FieldLabel>Name as per PAN <Required>*</Required></FieldLabel>
          <Input
            value={data.nameAsPerPan || ''}
            onChange={(e) => onChange('nameAsPerPan', e.target.value)}
            placeholder="Enter exact PAN name"
          />
          {errors.nameAsPerPan ? <ErrorText>{errors.nameAsPerPan}</ErrorText> : null}
        </Field>
      </FormGrid>

      <InlineRow>
        <PrimaryAction type="button" onClick={onVerifyPan} disabled={panStatus.state === 'loading'}>
          {panStatus.state === 'loading' ? 'Verifying...' : 'Verify PAN'}
        </PrimaryAction>

        <PillStatus $state={panStatus.state}>{panStatus.message || 'PAN not verified yet'}</PillStatus>
      </InlineRow>

      {errors.panVerification ? <ErrorText>{errors.panVerification}</ErrorText> : null}
    </StepCard>
  );
}
