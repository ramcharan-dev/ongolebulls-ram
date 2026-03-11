import styled from 'styled-components';
import {
  StepCard,
  StepTitle,
  StepDescription,
  ErrorText,
  Required,
} from './KycFormPrimitives';

const UploadGrid = styled.div`
  margin-top: 22px;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;

  @media (max-width: 780px) {
    grid-template-columns: 1fr;
  }
`;

const UploadTile = styled.label`
  border: 1px dashed #cbd5e1;
  border-radius: 12px;
  background: #f8fafc;
  min-height: 190px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 14px;
  cursor: pointer;

  strong {
    display: block;
    margin-bottom: 6px;
    color: #1e293b;
    font-size: 14px;
  }

  p {
    margin: 0;
    color: #64748b;
    font-size: 12px;
  }

  input {
    display: none;
  }
`;

const PreviewImage = styled.img`
  width: 100%;
  height: 120px;
  object-fit: cover;
  border-radius: 10px;
  margin-bottom: 10px;
  border: 1px solid #cbd5e1;
`;

const DocumentError = styled.div`
  margin-top: 10px;
`;

const DOCUMENTS = [
  { key: 'panCardImage', label: 'PAN Card Image' },
  { key: 'aadhaarFrontImage', label: 'Aadhaar Front' },
  { key: 'aadhaarBackImage', label: 'Aadhaar Back' },
  { key: 'signatureImage', label: 'Signature Photo' },
];

export default function KycStepIdentityUpload({ data, errors, onFileChange }) {
  return (
    <StepCard>
      <StepTitle>Identity Upload</StepTitle>
      <StepDescription>Upload clear images for all mandatory documents.</StepDescription>

      <UploadGrid>
        {DOCUMENTS.map((item) => {
          const fileEntry = data[item.key] || null;
          const preview = fileEntry?.preview || '';

          return (
            <UploadTile key={item.key}>
              {preview ? <PreviewImage src={preview} alt={`${item.label} preview`} /> : null}
              <strong>{item.label} <Required>*</Required></strong>
              <p>{fileEntry?.file?.name || 'Tap to upload image'}</p>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) onFileChange(item.key, file);
                }}
              />
            </UploadTile>
          );
        })}
      </UploadGrid>

      {errors.documents ? (
        <DocumentError>
          <ErrorText>{errors.documents}</ErrorText>
        </DocumentError>
      ) : null}
    </StepCard>
  );
}
