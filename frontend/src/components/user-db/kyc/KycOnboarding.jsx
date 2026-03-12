import { useEffect, useMemo, useRef, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { getUser } from '../../../utils/storage';
import KycProgress from './KycProgress';
import KycStepNavigation from './KycStepNavigation';
import KycStepPersonalDetails from './KycStepPersonalDetails';
import KycStepPanVerification from './KycStepPanVerification';
import KycStepAadhaarVerification from './KycStepAadhaarVerification';
import KycStepAddressDetails from './KycStepAddressDetails';
import KycStepBankDetails from './KycStepBankDetails';
import KycStepNomineeDetails from './KycStepNomineeDetails';
import KycStepIdentityUpload from './KycStepIdentityUpload';
import KycStepSelfieVerification from './KycStepSelfieVerification';
import KycStepReviewSubmit from './KycStepReviewSubmit';
import {
  fetchBankByIFSC,
  sendAadhaarOTP,
  submitKYC,
  verifyAadhaarOTP,
  verifyPAN,
} from './kycApiPlaceholders';

const STEPS = [
  'Personal',
  'PAN',
  'Aadhaar',
  'Address',
  'Bank',
  'Nominee',
  'Upload',
  'Selfie',
  'Review',
];

const INITIAL_KYC_DATA = {
  personalDetails: {
    fullName: '',
    dob: '',
    gender: '',
    fatherName: '',
    motherName: '',
    maritalStatus: '',
    email: '',
    mobile: '',
  },
  panDetails: {
    panNumber: '',
    nameAsPerPan: '',
    verified: false,
  },
  aadhaarDetails: {
    aadhaarNumber: '',
    otp: '',
    verified: false,
  },
  addressDetails: {
    sameAsAadhaarAddress: false,
    currentAddress: '',
    city: '',
    state: '',
    pincode: '',
  },
  bankDetails: {
    accountNumber: '',
    confirmAccountNumber: '',
    ifscCode: '',
    bankName: '',
  },
  nomineeDetails: {
    nomineeName: '',
    relationship: '',
    nomineeDob: '',
    nomineeAddress: '',
  },
  documents: {
    panCardImage: null,
    aadhaarFrontImage: null,
    aadhaarBackImage: null,
    signatureImage: null,
    selfie: null,
  },
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MOBILE_REGEX = /^[6-9]\d{9}$/;
const PAN_REGEX = /^[A-Z]{5}[0-9]{4}[A-Z]$/;
const AADHAAR_REGEX = /^\d{12}$/;
const OTP_REGEX = /^\d{6}$/;
const PINCODE_REGEX = /^\d{6}$/;
const IFSC_REGEX = /^[A-Z]{4}0[A-Z0-9]{6}$/;

function getStepErrors(stepIndex, kycData, panStatus, aadhaarStatus) {
  const errors = {};

  if (stepIndex === 0) {
    const d = kycData.personalDetails;

    if (!d.fullName?.trim()) errors.fullName = 'Full name is required.';
    if (!d.dob) errors.dob = 'Date of birth is required.';
    if (!d.gender) errors.gender = 'Gender is required.';
    if (!d.fatherName?.trim()) errors.fatherName = 'Father name is required.';
    if (!d.motherName?.trim()) errors.motherName = 'Mother name is required.';
    if (!d.maritalStatus) errors.maritalStatus = 'Marital status is required.';
    if (!EMAIL_REGEX.test(d.email || '')) errors.email = 'Enter a valid email.';
    if (!MOBILE_REGEX.test(d.mobile || '')) errors.mobile = 'Enter a valid 10-digit mobile number.';
  }

  if (stepIndex === 1) {
    const d = kycData.panDetails;

    if (!PAN_REGEX.test(d.panNumber || '')) errors.panNumber = 'PAN format must be ABCDE1234F.';
    if (!d.nameAsPerPan?.trim()) errors.nameAsPerPan = 'Name as per PAN is required.';
    if (panStatus.state !== 'success') errors.panVerification = 'Verify PAN to continue.';
  }

  if (stepIndex === 2) {
    const d = kycData.aadhaarDetails;

    if (!AADHAAR_REGEX.test(d.aadhaarNumber || '')) errors.aadhaarNumber = 'Aadhaar number must be 12 digits.';
    if (!aadhaarStatus.otpSent) errors.aadhaarVerification = 'Send OTP and verify Aadhaar to continue.';
    if (aadhaarStatus.otpSent && !OTP_REGEX.test(d.otp || '')) errors.otp = 'Enter a valid 6-digit OTP.';
    if (!aadhaarStatus.verified) errors.aadhaarVerification = 'Aadhaar OTP verification is pending.';
  }

  if (stepIndex === 3) {
    const d = kycData.addressDetails;

    if (!d.currentAddress?.trim()) errors.currentAddress = 'Address is required.';
    if (!d.city?.trim()) errors.city = 'City is required.';
    if (!d.state?.trim()) errors.state = 'State is required.';
    if (!PINCODE_REGEX.test(d.pincode || '')) errors.pincode = 'Pincode must be 6 digits.';
  }

  if (stepIndex === 4) {
    const d = kycData.bankDetails;

    if (!d.accountNumber?.trim()) errors.accountNumber = 'Account number is required.';
    if (!d.confirmAccountNumber?.trim()) errors.confirmAccountNumber = 'Please confirm account number.';
    if (d.accountNumber && d.confirmAccountNumber && d.accountNumber !== d.confirmAccountNumber) {
      errors.confirmAccountNumber = 'Account numbers do not match.';
    }
    if (!IFSC_REGEX.test(d.ifscCode || '')) errors.ifscCode = 'Enter valid IFSC code.';
    if (!d.bankName?.trim()) errors.bankName = 'Bank name is required.';
  }

  if (stepIndex === 5) {
    const d = kycData.nomineeDetails;
    const hasAny = Object.values(d).some((value) => String(value || '').trim());

    if (hasAny) {
      if (!d.nomineeName?.trim()) errors.nomineeName = 'Nominee name is required.';
      if (!d.relationship?.trim()) errors.relationship = 'Relationship is required.';
      if (!d.nomineeDob?.trim()) errors.nomineeDob = 'Nominee DOB is required.';
      if (!d.nomineeAddress?.trim()) errors.nomineeAddress = 'Nominee address is required.';
    }
  }

  if (stepIndex === 6) {
    const d = kycData.documents;

    if (!d.panCardImage || !d.aadhaarFrontImage || !d.aadhaarBackImage || !d.signatureImage) {
      errors.documents = 'Upload PAN, Aadhaar front/back, and signature to continue.';
    }
  }

  if (stepIndex === 7) {
    const d = kycData.documents;

    if (!d.selfie) {
      errors.selfie = 'Selfie capture is required before review.';
    }
  }

  return errors;
}

const appear = keyframes`
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const Page = styled.div`
  display: grid;
  gap: 14px;
`;

const HeaderCard = styled.header`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 16px;
  box-shadow: ${({ theme }) => theme.shadows.sm};
  padding: 18px;

  h1 {
    margin: 0;
    font-size: 28px;
    color: ${({ theme }) => theme.colors.text};
    letter-spacing: -0.01em;
  }

  p {
    margin: 8px 0 0;
    color: ${({ theme }) => theme.colors.textMuted};
    font-size: 14px;
    line-height: 1.6;
  }
`;

const StepBody = styled.div`
  animation: ${appear} 220ms ease;
`;

const Alert = styled.div`
  border-radius: 10px;
  border: 1px solid ${({ theme }) => theme.colors.warningLight};
  background: #fffbeb;
  color: ${({ theme }) => theme.colors.warning};
  font-size: 12px;
  font-weight: 600;
  padding: 10px 12px;
`;

export default function KycOnboarding() {
  const [kycData, setKycData] = useState(INITIAL_KYC_DATA);
  const [currentStep, setCurrentStep] = useState(0);
  const [stepErrors, setStepErrors] = useState({});
  const documentsRef = useRef(INITIAL_KYC_DATA.documents);

  const [panStatus, setPanStatus] = useState({ state: 'idle', message: '' });
  const [aadhaarStatus, setAadhaarStatus] = useState({
    state: 'idle',
    loading: false,
    otpSent: false,
    verified: false,
    message: '',
  });
  const [ifscLookupState, setIfscLookupState] = useState({ state: 'idle', message: '' });
  const [submitState, setSubmitState] = useState({ state: 'idle', message: '' });

  useEffect(() => {
    const user = getUser();
    if (!user) return;

    setKycData((prev) => ({
      ...prev,
      personalDetails: {
        ...prev.personalDetails,
        fullName: prev.personalDetails.fullName || user.fullName || user.name || '',
        email: prev.personalDetails.email || user.email || '',
        mobile: prev.personalDetails.mobile || user.mobile || user.phone || '',
      },
    }));
  }, []);

  useEffect(() => {
    documentsRef.current = kycData.documents;
  }, [kycData.documents]);

  useEffect(() => {
    return () => {
      const docs = documentsRef.current || {};
      Object.values(docs).forEach((entry) => {
        if (entry?.preview && entry.preview.startsWith('blob:')) {
          URL.revokeObjectURL(entry.preview);
        }
      });
    };
  }, []);

  const currentStepErrors = useMemo(
    () => getStepErrors(currentStep, kycData, panStatus, aadhaarStatus),
    [currentStep, kycData, panStatus, aadhaarStatus]
  );

  const canProceed = Object.keys(currentStepErrors).length === 0;

  const updateSection = (section, field, value) => {
    setKycData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));

    setStepErrors({});
    setSubmitState({ state: 'idle', message: '' });
  };

  const updatePan = (field, value) => {
    updateSection('panDetails', field, value);
    setPanStatus({ state: 'idle', message: '' });
  };

  const updateAadhaar = (field, value) => {
    updateSection('aadhaarDetails', field, value);

    if (field === 'aadhaarNumber') {
      setAadhaarStatus({ state: 'idle', loading: false, otpSent: false, verified: false, message: '' });
      setKycData((prev) => ({
        ...prev,
        aadhaarDetails: {
          ...prev.aadhaarDetails,
          otp: '',
          verified: false,
        },
      }));
    }
  };

  const handleAddressSameAsAadhaar = (checked) => {
    setKycData((prev) => ({
      ...prev,
      addressDetails: {
        ...prev.addressDetails,
        sameAsAadhaarAddress: checked,
        currentAddress: checked ? 'Aadhaar linked address (auto-filled)' : prev.addressDetails.currentAddress,
        city: checked ? 'Hyderabad' : prev.addressDetails.city,
        state: checked ? 'Telangana' : prev.addressDetails.state,
        pincode: checked ? '500001' : prev.addressDetails.pincode,
      },
    }));
    setStepErrors({});
  };

  const handleBankChange = (field, value) => {
    updateSection('bankDetails', field, value);

    if (field === 'ifscCode') {
      setIfscLookupState({ state: 'idle', message: '' });
    }
  };

  const handleIFSCBlur = async () => {
    const ifscCode = (kycData.bankDetails.ifscCode || '').toUpperCase();
    if (!IFSC_REGEX.test(ifscCode)) {
      setIfscLookupState({ state: 'error', message: 'Invalid IFSC format. Use e.g. SBIN0001234' });
      return;
    }

    setIfscLookupState({ state: 'loading', message: 'Fetching bank name from IFSC...' });

    const response = await fetchBankByIFSC(ifscCode);

    if (response.bankName) {
      setKycData((prev) => ({
        ...prev,
        bankDetails: {
          ...prev.bankDetails,
          bankName: response.bankName,
        },
      }));
      setIfscLookupState({ state: 'success', message: `Bank detected: ${response.bankName}` });
      return;
    }

    setIfscLookupState({ state: 'error', message: 'Bank not found. Please enter bank name manually.' });
  };

  const handleDocumentUpload = (key, file) => {
    const preview = URL.createObjectURL(file);

    setKycData((prev) => {
      const old = prev.documents[key];
      if (old?.preview && old.preview.startsWith('blob:')) {
        URL.revokeObjectURL(old.preview);
      }

      return {
        ...prev,
        documents: {
          ...prev.documents,
          [key]: { file, preview },
        },
      };
    });

    setStepErrors({});
  };

  const handleSelfieUpload = (file) => {
    handleDocumentUpload('selfie', file);
  };

  const handleVerifyPan = async () => {
    try {
      setPanStatus({ state: 'loading', message: 'Verifying PAN details...' });
      const response = await verifyPAN(kycData.panDetails);

      setPanStatus({ state: 'success', message: response.message });
      setKycData((prev) => ({
        ...prev,
        panDetails: {
          ...prev.panDetails,
          verified: true,
        },
      }));
      setStepErrors({});
    } catch (error) {
      setPanStatus({ state: 'error', message: error.message || 'PAN verification failed.' });
      setKycData((prev) => ({
        ...prev,
        panDetails: {
          ...prev.panDetails,
          verified: false,
        },
      }));
    }
  };

  const handleSendAadhaarOtp = async () => {
    try {
      setAadhaarStatus((prev) => ({ ...prev, state: 'loading', loading: true, message: 'Sending OTP...' }));
      const response = await sendAadhaarOTP({ aadhaarNumber: kycData.aadhaarDetails.aadhaarNumber });

      setAadhaarStatus({
        state: 'success',
        loading: false,
        otpSent: true,
        verified: false,
        message: response.message,
      });
      setStepErrors({});
    } catch (error) {
      setAadhaarStatus({
        state: 'error',
        loading: false,
        otpSent: false,
        verified: false,
        message: error.message || 'Unable to send OTP.',
      });
    }
  };

  const handleVerifyAadhaarOtp = async () => {
    try {
      setAadhaarStatus((prev) => ({ ...prev, state: 'loading', loading: true, message: 'Verifying OTP...' }));
      const response = await verifyAadhaarOTP({ otp: kycData.aadhaarDetails.otp });

      setAadhaarStatus({
        state: 'success',
        loading: false,
        otpSent: true,
        verified: true,
        message: response.message,
      });
      setKycData((prev) => ({
        ...prev,
        aadhaarDetails: {
          ...prev.aadhaarDetails,
          verified: true,
        },
      }));
      setStepErrors({});
    } catch (error) {
      setAadhaarStatus((prev) => ({
        ...prev,
        state: 'error',
        loading: false,
        verified: false,
        message: error.message || 'OTP verification failed.',
      }));
      setKycData((prev) => ({
        ...prev,
        aadhaarDetails: {
          ...prev.aadhaarDetails,
          verified: false,
        },
      }));
    }
  };

  const handleNext = () => {
    const errors = getStepErrors(currentStep, kycData, panStatus, aadhaarStatus);

    if (Object.keys(errors).length > 0) {
      setStepErrors(errors);
      return;
    }

    setStepErrors({});
    setCurrentStep((prev) => Math.min(prev + 1, STEPS.length - 1));
  };

  const handlePrev = () => {
    setStepErrors({});
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const handleSubmit = async () => {
    try {
      setSubmitState({ state: 'loading', message: 'Submitting KYC application...' });
      const response = await submitKYC(kycData);
      setSubmitState({ state: 'success', message: `${response.message} Ref: ${response.referenceId}` });
    } catch (error) {
      setSubmitState({ state: 'error', message: error.message || 'KYC submission failed.' });
    }
  };

  const stepElement = (() => {
    switch (currentStep) {
      case 0:
        return (
          <KycStepPersonalDetails
            data={kycData.personalDetails}
            errors={stepErrors}
            onChange={(field, value) => updateSection('personalDetails', field, value)}
          />
        );
      case 1:
        return (
          <KycStepPanVerification
            data={kycData.panDetails}
            errors={stepErrors}
            panStatus={panStatus}
            onChange={updatePan}
            onVerifyPan={handleVerifyPan}
          />
        );
      case 2:
        return (
          <KycStepAadhaarVerification
            data={kycData.aadhaarDetails}
            errors={stepErrors}
            aadhaarStatus={aadhaarStatus}
            onChange={updateAadhaar}
            onSendOtp={handleSendAadhaarOtp}
            onVerifyOtp={handleVerifyAadhaarOtp}
          />
        );
      case 3:
        return (
          <KycStepAddressDetails
            data={kycData.addressDetails}
            errors={stepErrors}
            onChange={(field, value) => updateSection('addressDetails', field, value)}
            onToggleSameAsAadhaar={handleAddressSameAsAadhaar}
          />
        );
      case 4:
        return (
          <KycStepBankDetails
            data={kycData.bankDetails}
            errors={stepErrors}
            onChange={handleBankChange}
            ifscLookupState={ifscLookupState}
            onIFSCBlur={handleIFSCBlur}
          />
        );
      case 5:
        return (
          <KycStepNomineeDetails
            data={kycData.nomineeDetails}
            errors={stepErrors}
            onChange={(field, value) => updateSection('nomineeDetails', field, value)}
          />
        );
      case 6:
        return (
          <KycStepIdentityUpload
            data={kycData.documents}
            errors={stepErrors}
            onFileChange={handleDocumentUpload}
          />
        );
      case 7:
        return (
          <KycStepSelfieVerification
            data={kycData.documents}
            errors={stepErrors}
            onSelfieUpload={handleSelfieUpload}
          />
        );
      case 8:
        return (
          <KycStepReviewSubmit
            kycData={kycData}
            onEditStep={(step) => {
              setCurrentStep(step);
              setStepErrors({});
            }}
            onSubmit={handleSubmit}
            submitState={submitState}
          />
        );
      default:
        return null;
    }
  })();

  const nextLabel = currentStep === STEPS.length - 2 ? 'Review & Submit' : 'Next';

  return (
    <Page>
      <HeaderCard>
        <h1>Complete KYC</h1>
        <p>Secure, step-by-step KYC onboarding to activate your investment account.</p>
      </HeaderCard>

      <KycProgress
        steps={STEPS}
        currentStep={currentStep}
        onStepClick={(step) => setCurrentStep(step)}
      />

      {currentStep !== STEPS.length - 1 && Object.keys(stepErrors).length > 0 ? (
        <Alert>Please resolve highlighted fields to continue.</Alert>
      ) : null}

      <StepBody key={currentStep}>{stepElement}</StepBody>

      {currentStep !== STEPS.length - 1 ? (
        <KycStepNavigation
          currentStep={currentStep}
          totalSteps={STEPS.length}
          onPrev={handlePrev}
          onNext={handleNext}
          nextDisabled={!canProceed}
          nextLabel={nextLabel}
        />
      ) : null}
    </Page>
  );
}
