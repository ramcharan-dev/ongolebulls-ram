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
  ErrorText,
} from './KycFormPrimitives';

const MARITAL_OPTIONS = ['Single', 'Married', 'Divorced', 'Widowed'];

export default function KycStepPersonalDetails({ data, errors, onChange }) {
  return (
    <StepCard>
      <StepTitle>Personal Details</StepTitle>
      <StepDescription>Provide your personal information exactly as per official records.</StepDescription>

      <FormGrid>
        <Field>
          <FieldLabel>Full Name <Required>*</Required></FieldLabel>
          <Input value={data.fullName || ''} onChange={(e) => onChange('fullName', e.target.value)} placeholder="Enter full name" />
          {errors.fullName ? <ErrorText>{errors.fullName}</ErrorText> : null}
        </Field>

        <Field>
          <FieldLabel>Date of Birth <Required>*</Required></FieldLabel>
          <Input type="date" value={data.dob || ''} onChange={(e) => onChange('dob', e.target.value)} />
          {errors.dob ? <ErrorText>{errors.dob}</ErrorText> : null}
        </Field>

        <Field>
          <FieldLabel>Gender <Required>*</Required></FieldLabel>
          <Select value={data.gender || ''} onChange={(e) => onChange('gender', e.target.value)}>
            <option value="">Select gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </Select>
          {errors.gender ? <ErrorText>{errors.gender}</ErrorText> : null}
        </Field>

        <Field>
          <FieldLabel>Marital Status <Required>*</Required></FieldLabel>
          <Select value={data.maritalStatus || ''} onChange={(e) => onChange('maritalStatus', e.target.value)}>
            <option value="">Select marital status</option>
            {MARITAL_OPTIONS.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </Select>
          {errors.maritalStatus ? <ErrorText>{errors.maritalStatus}</ErrorText> : null}
        </Field>

        <Field>
          <FieldLabel>Father&apos;s Name <Required>*</Required></FieldLabel>
          <Input value={data.fatherName || ''} onChange={(e) => onChange('fatherName', e.target.value)} placeholder="As per PAN/KYC records" />
          {errors.fatherName ? <ErrorText>{errors.fatherName}</ErrorText> : null}
        </Field>

        <Field>
          <FieldLabel>Mother&apos;s Name <Required>*</Required></FieldLabel>
          <Input value={data.motherName || ''} onChange={(e) => onChange('motherName', e.target.value)} placeholder="As per records" />
          {errors.motherName ? <ErrorText>{errors.motherName}</ErrorText> : null}
        </Field>

        <Field>
          <FieldLabel>Email ID <Required>*</Required></FieldLabel>
          <Input type="email" value={data.email || ''} onChange={(e) => onChange('email', e.target.value)} placeholder="name@example.com" />
          {errors.email ? <ErrorText>{errors.email}</ErrorText> : null}
        </Field>

        <Field>
          <FieldLabel>Mobile Number <Required>*</Required></FieldLabel>
          <Input value={data.mobile || ''} onChange={(e) => onChange('mobile', e.target.value)} maxLength={10} placeholder="10-digit number" />
          {errors.mobile ? <ErrorText>{errors.mobile}</ErrorText> : null}
        </Field>
      </FormGrid>
    </StepCard>
  );
}
