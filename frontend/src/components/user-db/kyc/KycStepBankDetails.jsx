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
} from './KycFormPrimitives';

export default function KycStepBankDetails({ data, errors, onChange, ifscLookupState, onIFSCBlur }) {
  return (
    <StepCard>
      <StepTitle>Bank Details</StepTitle>
      <StepDescription>Your bank account will be used for payouts and redemption credits.</StepDescription>

      <FormGrid>
        <Field>
          <FieldLabel>Bank Account Number <Required>*</Required></FieldLabel>
          <Input
            value={data.accountNumber || ''}
            onChange={(e) => onChange('accountNumber', e.target.value.replace(/\D/g, ''))}
            placeholder="Enter account number"
          />
          {errors.accountNumber ? <ErrorText>{errors.accountNumber}</ErrorText> : null}
        </Field>

        <Field>
          <FieldLabel>Confirm Account Number <Required>*</Required></FieldLabel>
          <Input
            value={data.confirmAccountNumber || ''}
            onChange={(e) => onChange('confirmAccountNumber', e.target.value.replace(/\D/g, ''))}
            placeholder="Re-enter account number"
          />
          {errors.confirmAccountNumber ? <ErrorText>{errors.confirmAccountNumber}</ErrorText> : null}
        </Field>

        <Field>
          <FieldLabel>IFSC Code <Required>*</Required></FieldLabel>
          <Input
            value={data.ifscCode || ''}
            onChange={(e) => onChange('ifscCode', e.target.value.toUpperCase())}
            onBlur={onIFSCBlur}
            maxLength={11}
            placeholder="SBIN0001234"
          />
          {errors.ifscCode ? <ErrorText>{errors.ifscCode}</ErrorText> : null}
        </Field>

        <Field>
          <FieldLabel>Bank Name <Required>*</Required></FieldLabel>
          <Input
            value={data.bankName || ''}
            onChange={(e) => onChange('bankName', e.target.value)}
            placeholder="Auto-fetched from IFSC"
          />
          {errors.bankName ? <ErrorText>{errors.bankName}</ErrorText> : null}
        </Field>
      </FormGrid>

      <InlineRow>
        <PillStatus $state={ifscLookupState.state}>{ifscLookupState.message || 'Enter IFSC to auto-fetch bank name'}</PillStatus>
      </InlineRow>
    </StepCard>
  );
}
