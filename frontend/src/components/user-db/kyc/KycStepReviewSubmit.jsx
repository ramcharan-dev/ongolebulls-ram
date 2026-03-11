import styled from 'styled-components';
import { StepCard, StepTitle, StepDescription, PrimaryAction, PillStatus } from './KycFormPrimitives';

const ReviewGrid = styled.div`
  margin-top: 18px;
  display: grid;
  gap: 12px;
`;

const ReviewBlock = styled.section`
  border: 1px solid #dbe4ef;
  border-radius: 12px;
  background: #f8fbff;
  padding: 14px;
`;

const BlockHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;

  h3 {
    margin: 0;
    font-size: 14px;
    color: #1e293b;
  }
`;

const EditButton = styled.button`
  height: 30px;
  border: 1px solid #bfdbfe;
  background: #eff6ff;
  color: #1d4ed8;
  border-radius: 8px;
  padding: 0 10px;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
`;

const KvGrid = styled.div`
  margin-top: 10px;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;

  @media (max-width: 680px) {
    grid-template-columns: 1fr;
  }
`;

const Kv = styled.div`
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: #fff;
  padding: 8px;

  span {
    display: block;
    font-size: 11px;
    color: #64748b;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    font-weight: 700;
  }

  strong {
    display: block;
    margin-top: 4px;
    font-size: 13px;
    color: #0f172a;
    word-break: break-word;
  }
`;

const SubmitRow = styled.div`
  margin-top: 18px;
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
`;

function ReviewField({ label, value }) {
  return (
    <Kv>
      <span>{label}</span>
      <strong>{value || '—'}</strong>
    </Kv>
  );
}

function maskAadhaar(value) {
  if (!value || value.length < 4) return value;
  return `XXXXXXXX${value.slice(-4)}`;
}

export default function KycStepReviewSubmit({ kycData, onEditStep, onSubmit, submitState }) {
  const { personalDetails, panDetails, aadhaarDetails, bankDetails, nomineeDetails } = kycData;

  return (
    <StepCard>
      <StepTitle>Review & Submit</StepTitle>
      <StepDescription>Review all details carefully before final submission.</StepDescription>

      <ReviewGrid>
        <ReviewBlock>
          <BlockHeader>
            <h3>Personal Details</h3>
            <EditButton type="button" onClick={() => onEditStep(0)}>Edit</EditButton>
          </BlockHeader>
          <KvGrid>
            <ReviewField label="Full Name" value={personalDetails.fullName} />
            <ReviewField label="Date of Birth" value={personalDetails.dob} />
            <ReviewField label="Gender" value={personalDetails.gender} />
            <ReviewField label="Mobile" value={personalDetails.mobile} />
            <ReviewField label="Email" value={personalDetails.email} />
            <ReviewField label="Marital Status" value={personalDetails.maritalStatus} />
          </KvGrid>
        </ReviewBlock>

        <ReviewBlock>
          <BlockHeader>
            <h3>PAN Details</h3>
            <EditButton type="button" onClick={() => onEditStep(1)}>Edit</EditButton>
          </BlockHeader>
          <KvGrid>
            <ReviewField label="PAN Number" value={panDetails.panNumber} />
            <ReviewField label="Name as per PAN" value={panDetails.nameAsPerPan} />
          </KvGrid>
        </ReviewBlock>

        <ReviewBlock>
          <BlockHeader>
            <h3>Aadhaar Details</h3>
            <EditButton type="button" onClick={() => onEditStep(2)}>Edit</EditButton>
          </BlockHeader>
          <KvGrid>
            <ReviewField label="Aadhaar Number" value={maskAadhaar(aadhaarDetails.aadhaarNumber)} />
            <ReviewField label="OTP Verified" value={aadhaarDetails.verified ? 'Yes' : 'No'} />
          </KvGrid>
        </ReviewBlock>

        <ReviewBlock>
          <BlockHeader>
            <h3>Bank Details</h3>
            <EditButton type="button" onClick={() => onEditStep(4)}>Edit</EditButton>
          </BlockHeader>
          <KvGrid>
            <ReviewField label="Account Number" value={bankDetails.accountNumber} />
            <ReviewField label="IFSC" value={bankDetails.ifscCode} />
            <ReviewField label="Bank Name" value={bankDetails.bankName} />
          </KvGrid>
        </ReviewBlock>

        <ReviewBlock>
          <BlockHeader>
            <h3>Nominee Details</h3>
            <EditButton type="button" onClick={() => onEditStep(5)}>Edit</EditButton>
          </BlockHeader>
          <KvGrid>
            <ReviewField label="Nominee Name" value={nomineeDetails.nomineeName} />
            <ReviewField label="Relationship" value={nomineeDetails.relationship} />
            <ReviewField label="Date of Birth" value={nomineeDetails.nomineeDob} />
            <ReviewField label="Address" value={nomineeDetails.nomineeAddress} />
          </KvGrid>
        </ReviewBlock>
      </ReviewGrid>

      <SubmitRow>
        <PrimaryAction type="button" onClick={onSubmit} disabled={submitState.state === 'loading' || submitState.state === 'success'}>
          {submitState.state === 'loading' ? 'Submitting...' : submitState.state === 'success' ? 'Submitted' : 'Submit KYC'}
        </PrimaryAction>
        <PillStatus $state={submitState.state}>{submitState.message || 'Ready to submit'}</PillStatus>
      </SubmitRow>
    </StepCard>
  );
}
