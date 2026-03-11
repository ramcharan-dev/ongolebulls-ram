import styled from 'styled-components';
import {
  StepCard,
  StepTitle,
  StepDescription,
  ErrorText,
} from './KycFormPrimitives';

const SelfieArea = styled.label`
  margin-top: 18px;
  border: 1px dashed #cbd5e1;
  border-radius: 14px;
  background: #f8fafc;
  min-height: 260px;
  display: grid;
  place-items: center;
  text-align: center;
  cursor: pointer;
  padding: 18px;

  strong {
    font-size: 16px;
    color: #1e293b;
  }

  p {
    margin: 8px 0 0;
    color: #64748b;
    font-size: 13px;
  }

  input {
    display: none;
  }
`;

const SelfiePreview = styled.img`
  width: min(280px, 100%);
  border-radius: 14px;
  object-fit: cover;
  border: 1px solid #cbd5e1;
  box-shadow: 0 10px 18px rgba(15, 23, 42, 0.09);
`;

export default function KycStepSelfieVerification({ data, errors, onSelfieUpload }) {
  const preview = data?.selfie?.preview;

  return (
    <StepCard>
      <StepTitle>Live Selfie Verification</StepTitle>
      <StepDescription>Please take a clear selfie for identity verification.</StepDescription>

      <SelfieArea>
        {preview ? <SelfiePreview src={preview} alt="Selfie preview" /> : null}
        <strong>{preview ? 'Retake Selfie' : 'Capture Selfie'}</strong>
        <p>{preview ? data?.selfie?.file?.name : 'Use front camera with clear lighting'}</p>
        <input
          type="file"
          accept="image/*"
          capture="user"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) onSelfieUpload(file);
          }}
        />
      </SelfieArea>

      {errors.selfie ? <ErrorText>{errors.selfie}</ErrorText> : null}
    </StepCard>
  );
}
