import { useEffect, useRef, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { getUser } from '../../utils/storage';
import { saveDraft, submitUcc, getUccStatus, retryUcc } from '../../api/uccApi';
import { STEP_LABELS, validateStep } from './uccValidation';
import Stepper from './components/Stepper';
import FormCard from './components/FormCard';
import FormFooter from './components/FormFooter';
import './ucc-onboarding.css';
import StepClientDetails from './steps/StepClientDetails';
import StepJointHolder from './steps/StepJointHolder';
import StepGuardian from './steps/StepGuardian';
import StepPanDetails from './steps/StepPanDetails';
import StepClientType from './steps/StepClientType';
import StepBankDetails from './steps/StepBankDetails';
import StepAddress from './steps/StepAddress';
import StepContact from './steps/StepContact';
import StepCommunication from './steps/StepCommunication';
import StepNriDetails from './steps/StepNriDetails';
import StepKyc from './steps/StepKyc';
import StepAadhaar from './steps/StepAadhaar';
import StepDeclaration from './steps/StepDeclaration';
import StepNomination from './steps/StepNomination';
import StepNomineeDetails from './steps/StepNomineeDetails';
import ReviewScreen from './ReviewScreen';

const INITIAL_DATA = {
  clientDetails: {},
  jointHolder: { secondHolder: {}, thirdHolder: {} },
  guardian: {},
  panDetails: {},
  clientType: {},
  bankDetails: { banks: [{ accountType: '', accountNumber: '', micrCode: '', ifscCode: '', defaultBank: true }] },
  address: { country: 'IN' },
  contact: {},
  communication: {},
  nriDetails: {},
  kyc: {},
  aadhaar: {},
  declaration: {},
  nomination: {},
  nomineeDetails: { nominees: [] },
};

const STEP_KEYS = [
  'clientDetails',
  'jointHolder',
  'guardian',
  'panDetails',
  'clientType',
  'bankDetails',
  'address',
  'contact',
  'communication',
  'nriDetails',
  'kyc',
  'aadhaar',
  'declaration',
  'nomination',
  'nomineeDetails',
];

const STEP_DESCRIPTIONS = [
  'Start with core client identity details used to initiate UCC creation.',
  'Add second and third holder details if the folio holding is joint.',
  'Provide guardian details for minor registrations.',
  'Enter PAN details for the primary and joint holders.',
  'Select onboarding mode and DP preferences for demat users.',
  'Configure bank account details and default payout account.',
  'Capture permanent address and location details.',
  'Provide primary contact channels for all investor communication.',
  'Choose preferred statement and communication mode.',
  'Complete foreign address details for NRI tax statuses.',
  'Capture KYC mode and CKYC number where applicable.',
  'Confirm Aadhaar and paperless onboarding preference.',
  'Declare mobile ownership per BSE/SEBI requirements.',
  'Capture nomination intent and authentication mode.',
  'Add nominee records and allocation percentages.',
];

const PROGRESS_LABELS = [
  'Client',
  'Joint',
  'Guardian',
  'PAN',
  'Client Type',
  'Bank',
  'Address',
  'Contact',
  'Communication',
  'NRI',
  'KYC',
  'Aadhaar',
  'Declaration',
  'Nomination',
  'Nominees',
];

function StatusCard({ tone, title, body, actions }) {
  return (
    <div className={`ucc-status ucc-status-${tone}`}>
      <h2>{title}</h2>
      <p>{body}</p>
      {actions ? <div className="ucc-status-actions">{actions}</div> : null}
    </div>
  );
}

export default function UccRegistration() {
  const user = getUser();
  const autoSaveReady = useRef(false);
  const autoSaveTimer = useRef(null);
  const { control, reset, setValue } = useForm({
    defaultValues: INITIAL_DATA,
  });
  const formData = useWatch({ control }) || INITIAL_DATA;

  const [currentStep, setCurrentStep] = useState(0);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [uccStatus, setUccStatus] = useState(null);
  const [showReview, setShowReview] = useState(false);
  const [toast, setToast] = useState(null);
  const [autoSaveLabel, setAutoSaveLabel] = useState('');

  useEffect(() => {
    if (!user?.id) return;
    loadStatus();
  }, [user?.id]);

  useEffect(() => () => {
    if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);
  }, []);

  const loadStatus = async () => {
    try {
      setLoading(true);
      const res = await getUccStatus(user.id);
      const data = res.data?.data;
      if (data) {
        setUccStatus(data.status);
        reset({
          clientDetails: data.clientDetails || INITIAL_DATA.clientDetails,
          jointHolder: data.jointHolder || INITIAL_DATA.jointHolder,
          guardian: data.guardian || INITIAL_DATA.guardian,
          panDetails: data.panDetails || INITIAL_DATA.panDetails,
          clientType: data.clientType || INITIAL_DATA.clientType,
          bankDetails: data.bankDetails || INITIAL_DATA.bankDetails,
          address: data.address || INITIAL_DATA.address,
          contact: data.contact || INITIAL_DATA.contact,
          communication: data.communication || INITIAL_DATA.communication,
          nriDetails: data.nriDetails || INITIAL_DATA.nriDetails,
          kyc: data.kyc || INITIAL_DATA.kyc,
          aadhaar: data.aadhaar || INITIAL_DATA.aadhaar,
          declaration: data.declaration || INITIAL_DATA.declaration,
          nomination: data.nomination || INITIAL_DATA.nomination,
          nomineeDetails: data.nomineeDetails || INITIAL_DATA.nomineeDetails,
        });
      }
    } catch {
      // No existing registration state.
    } finally {
      setLoading(false);
    }
  };

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3200);
  };

  const buildDraftPayload = () => ({
    userId: user.id,
    currentStep,
    ...Object.fromEntries(STEP_KEYS.map((key) => [key, formData[key]])),
  });

  const persistDraft = async ({ auto = false } = {}) => {
    if (!user?.id) return;
    try {
      if (!auto) setSaving(true);
      await saveDraft(buildDraftPayload());
      setUccStatus('DRAFT');
      if (auto) {
        setAutoSaveLabel('Progress saved automatically');
      } else {
        showToast('Draft saved successfully');
      }
    } catch (err) {
      if (auto) {
        setAutoSaveLabel('Auto-save failed, please save manually');
      } else {
        showToast(err.userMessage || 'Failed to save draft', 'error');
      }
    } finally {
      if (!auto) setSaving(false);
    }
  };

  useEffect(() => {
    if (!user?.id || loading || submitting || showReview) return;
    if (uccStatus === 'SUCCESS' || uccStatus === 'PENDING' || uccStatus === 'FAILED') return;

    if (!autoSaveReady.current) {
      autoSaveReady.current = true;
      return;
    }

    if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);
    autoSaveTimer.current = setTimeout(() => {
      persistDraft({ auto: true });
    }, 1400);

    return () => {
      if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);
    };
  }, [formData, currentStep, loading, submitting, showReview, uccStatus, user?.id]);

  const updateStepData = (stepKey, data) => {
    setValue(stepKey, data, { shouldDirty: true, shouldTouch: true });
    setErrors({});
  };

  const handleNext = () => {
    const stepKey = STEP_KEYS[currentStep];
    const result = validateStep(currentStep, formData[stepKey], formData);
    if (!result.valid) {
      setErrors(result.errors);
      return;
    }

    setErrors({});
    if (currentStep === STEP_LABELS.length - 1) {
      setShowReview(true);
      return;
    }

    setCurrentStep((prev) => prev + 1);
  };

  const handlePrev = () => {
    if (showReview) {
      setShowReview(false);
      return;
    }
    setErrors({});
    setCurrentStep((prev) => Math.max(0, prev - 1));
  };

  const handleSubmit = async () => {
    if (!user?.id) return;
    try {
      setSubmitting(true);
      await submitUcc({
        userId: user.id,
        currentStep: 15,
        ...Object.fromEntries(STEP_KEYS.map((key) => [key, formData[key]])),
      });
      setUccStatus('PENDING');
      setShowReview(false);
      showToast('UCC registration submitted. We have started processing.');
    } catch (err) {
      showToast(err.userMessage || 'Submission failed', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRetry = async () => {
    if (!user?.id) return;
    try {
      setSubmitting(true);
      await retryUcc(user.id);
      setUccStatus('PENDING');
      showToast('Resubmitted for processing');
    } catch (err) {
      showToast(err.userMessage || 'Retry failed', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const isNRI = ['21', '24'].includes(formData.clientDetails?.taxStatus);
  const isJoint = ['JO', 'AS'].includes(formData.clientDetails?.holdingNature);
  const isMinor = formData.clientDetails?.isMinor;
  const hasNomination = formData.nomination?.nominationOpt === 'Y';

  const stepProps = {
    errors,
    onChange: (data) => updateStepData(STEP_KEYS[currentStep], data),
    allData: formData,
  };

  const stepComponents = [
    <StepClientDetails key={0} data={formData.clientDetails} {...stepProps} />,
    <StepJointHolder key={1} data={formData.jointHolder} {...stepProps} />,
    <StepGuardian key={2} data={formData.guardian} {...stepProps} />,
    <StepPanDetails key={3} data={formData.panDetails} {...stepProps} />,
    <StepClientType key={4} data={formData.clientType} {...stepProps} />,
    <StepBankDetails key={5} data={formData.bankDetails} {...stepProps} />,
    <StepAddress key={6} data={formData.address} {...stepProps} />,
    <StepContact key={7} data={formData.contact} {...stepProps} />,
    <StepCommunication key={8} data={formData.communication} {...stepProps} />,
    <StepNriDetails key={9} data={formData.nriDetails} {...stepProps} />,
    <StepKyc key={10} data={formData.kyc} {...stepProps} />,
    <StepAadhaar key={11} data={formData.aadhaar} {...stepProps} />,
    <StepDeclaration key={12} data={formData.declaration} {...stepProps} />,
    <StepNomination key={13} data={formData.nomination} {...stepProps} />,
    <StepNomineeDetails key={14} data={formData.nomineeDetails} {...stepProps} />,
  ];

  const conditionalNotice = (() => {
    if (currentStep === 1 && !isJoint) return 'Joint Holder is only needed for Joint / Anyone-or-Survivor holdings.';
    if (currentStep === 2 && !isMinor) return 'Guardian details are required only for minor investors.';
    if (currentStep === 9 && !isNRI) return 'NRI details are required only for NRI tax status.';
    if (currentStep === 14 && !hasNomination) return 'Nominee details appear only when nomination is opted.';
    return '';
  })();

  if (loading) {
    return (
      <div className="ucc-page-loader">
        <div className="ucc-spinner" />
      </div>
    );
  }

  if (uccStatus === 'SUCCESS') {
    return (
      <div className="ucc-page">
        <div className="ucc-wrap">
          <StatusCard
            tone="success"
            title="UCC Registration Successful"
            body="Your UCC is created successfully. You can proceed with investments."
          />
        </div>
      </div>
    );
  }

  if (uccStatus === 'PENDING') {
    return (
      <div className="ucc-page">
        <div className="ucc-wrap">
          <StatusCard
            tone="warning"
            title="UCC Registration Processing"
            body="Your registration is currently under processing."
            actions={(
              <button type="button" className="ucc-btn ucc-btn-primary" onClick={loadStatus}>
                Refresh Status
              </button>
            )}
          />
        </div>
      </div>
    );
  }

  if (uccStatus === 'FAILED') {
    return (
      <div className="ucc-page">
        <div className="ucc-wrap">
          <StatusCard
            tone="danger"
            title="UCC Registration Failed"
            body="There was an issue processing your registration. Retry now or edit and submit again."
            actions={(
              <>
                <button type="button" className="ucc-btn ucc-btn-danger" onClick={handleRetry} disabled={submitting}>
                  {submitting ? 'Retrying...' : 'Retry Submission'}
                </button>
                <button
                  type="button"
                  className="ucc-btn ucc-btn-secondary"
                  onClick={() => {
                    setUccStatus('DRAFT');
                    setCurrentStep(0);
                  }}
                >
                  Edit Details
                </button>
              </>
            )}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="ucc-page">
      {toast ? (
        <div className={`ucc-toast ${toast.type === 'error' ? 'is-error' : 'is-success'}`}>
          {toast.msg}
        </div>
      ) : null}

      <div className="ucc-wrap">
        <header className="ucc-topbar">
          <div>
            <p className="ucc-kicker">UCC Onboarding</p>
            <h1>UCC Registration</h1>
            <p className="ucc-subtitle">Unique Client Code onboarding with guided multi-step verification.</p>
          </div>
          <div className="ucc-step-pill">Step {showReview ? STEP_LABELS.length : currentStep + 1} of {STEP_LABELS.length}</div>
        </header>

        {!showReview ? (
          <Stepper
            steps={PROGRESS_LABELS}
            currentStep={currentStep}
            onStepClick={(step) => {
              if (step <= currentStep) setCurrentStep(step);
            }}
            conditionalSteps={{
              1: isJoint,
              2: isMinor,
              9: isNRI,
              14: hasNomination,
            }}
          />
        ) : (
          <div className="ucc-review-head">Final review. Verify every detail before secure submission.</div>
        )}

        <FormCard
          title={showReview ? 'Review and Confirm Submission' : STEP_LABELS[currentStep]}
          description={showReview ? 'Cross-check all details before final submission.' : STEP_DESCRIPTIONS[currentStep]}
          badge={showReview ? 'Final Step' : `Step ${currentStep + 1}`}
        >
          {showReview ? (
            <ReviewScreen formData={formData} />
          ) : (
            <>
              {conditionalNotice ? <div className="ucc-note">{conditionalNotice}</div> : null}
              {stepComponents[currentStep]}
            </>
          )}

          <div className="ucc-inline-meta">
            <span>{autoSaveLabel || 'Autosave enabled'}</span>
            <span>Fields marked * are mandatory.</span>
          </div>

          <FormFooter
            onPrev={handlePrev}
            onDraft={() => persistDraft({ auto: false })}
            onNext={showReview ? handleSubmit : handleNext}
            prevDisabled={currentStep === 0 && !showReview}
            draftDisabled={saving}
            nextDisabled={submitting}
            nextLabel={showReview ? (submitting ? 'Submitting...' : 'Confirm & Submit') : currentStep === STEP_LABELS.length - 1 ? 'Review' : 'Next'}
            savingDraft={saving}
          />
        </FormCard>
      </div>
    </div>
  );
}
