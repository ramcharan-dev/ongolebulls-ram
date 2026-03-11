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

export default function KycStepAadhaarVerification({
  data,
  errors,
  aadhaarStatus,
  onChange,
  onSendOtp,
  onVerifyOtp,
}) {
  return (
    <StepCard>
      <StepTitle>Aadhaar Verification</StepTitle>
      <StepDescription>Use OTP-based Aadhaar verification to continue your KYC journey.</StepDescription>

      <FormGrid>
        <Field>
          <FieldLabel>Aadhaar Number <Required>*</Required></FieldLabel>
          <Input
            value={data.aadhaarNumber || ''}
            onChange={(e) => onChange('aadhaarNumber', e.target.value.replace(/\D/g, ''))}
            maxLength={12}
            placeholder="12-digit Aadhaar number"
          />
          {errors.aadhaarNumber ? <ErrorText>{errors.aadhaarNumber}</ErrorText> : null}
        </Field>

        {aadhaarStatus.otpSent ? (
          <Field>
            <FieldLabel>Aadhaar OTP <Required>*</Required></FieldLabel>
            <Input
              value={data.otp || ''}
              onChange={(e) => onChange('otp', e.target.value.replace(/\D/g, ''))}
              maxLength={6}
              placeholder="Enter 6-digit OTP"
            />
            {errors.otp ? <ErrorText>{errors.otp}</ErrorText> : null}
          </Field>
        ) : null}
      </FormGrid>

      <InlineRow>
        <PrimaryAction type="button" onClick={onSendOtp} disabled={aadhaarStatus.loading || aadhaarStatus.verified}>
          {aadhaarStatus.loading && !aadhaarStatus.otpSent ? 'Sending OTP...' : 'Send OTP'}
        </PrimaryAction>

        {aadhaarStatus.otpSent ? (
          <PrimaryAction type="button" onClick={onVerifyOtp} disabled={aadhaarStatus.loading || aadhaarStatus.verified}>
            {aadhaarStatus.loading ? 'Verifying OTP...' : aadhaarStatus.verified ? 'OTP Verified' : 'Verify OTP'}
          </PrimaryAction>
        ) : null}

        <PillStatus $state={aadhaarStatus.state}>{aadhaarStatus.message || 'Aadhaar not verified yet'}</PillStatus>
      </InlineRow>

      {errors.aadhaarVerification ? <ErrorText>{errors.aadhaarVerification}</ErrorText> : null}
    </StepCard>
  );
}
