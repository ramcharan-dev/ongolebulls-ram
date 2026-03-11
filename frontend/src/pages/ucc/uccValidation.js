import { z } from 'zod';

const PAN_REGEX = /^[A-Z]{5}[0-9]{4}[A-Z]$/;
const MOBILE_REGEX = /^[6-9][0-9]{9}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PINCODE_REGEX = /^[1-9][0-9]{5}$/;
const IFSC_REGEX = /^[A-Z]{4}0[A-Z0-9]{6}$/;

const requiredString = (label) => z.string().trim().min(1, `${label} is required`);
const optionalPan = (message) => z.string().optional().refine((value) => !value || PAN_REGEX.test(value), { message });

const mapZodErrors = (result) => {
  if (result.success) return {};

  const errors = {};
  for (const issue of result.error.issues) {
    const key = issue.path.length ? issue.path.join('.') : '_form';
    if (!errors[key]) errors[key] = issue.message;
  }
  return errors;
};

const clientDetailsSchema = z
  .object({
    clientCode: requiredString('Client Code (UCC)'),
    firstName: requiredString('First Name'),
    taxStatus: requiredString('Tax Status'),
    gender: z.string().optional(),
    dob: requiredString('Date of Birth / Incorporation Date'),
    occupationCode: requiredString('Occupation Code'),
    holdingNature: requiredString('Holding Nature'),
  })
  .superRefine((data, ctx) => {
    if (['01', '02', '03'].includes(data.taxStatus) && !data.gender) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['gender'],
        message: 'Gender is required for individual tax status',
      });
    }
  });

const jointHolderSchema = z.object({
  secondHolder: z.object({
    firstName: requiredString('Second Holder First Name'),
    lastName: requiredString('Second Holder Last Name'),
    dob: requiredString('Second Holder DOB'),
    pan: z.string().regex(PAN_REGEX, 'Valid PAN is required (e.g. ABCDE1234F)'),
  }),
});

const guardianSchema = z.object({
  guardianFirstName: requiredString('Guardian First Name'),
  guardianLastName: requiredString('Guardian Last Name'),
  guardianDob: requiredString('Guardian DOB'),
  guardianPan: z.string().regex(PAN_REGEX, 'Valid Guardian PAN is required'),
  guardianRelationshipCode: requiredString('Relationship Code'),
});

const panDetailsSchema = z.object({
  primaryPan: z.string().regex(PAN_REGEX, 'Valid Primary Holder PAN is required (e.g. ABCDE1234F)'),
  secondPan: optionalPan('Invalid Second Holder PAN format'),
  thirdPan: optionalPan('Invalid Third Holder PAN format'),
  guardianPan: optionalPan('Invalid Guardian PAN format'),
});

const clientTypeSchema = z
  .object({
    clientType: requiredString('Client Type'),
    defaultDp: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.clientType === 'D' && !data.defaultDp) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['defaultDp'],
        message: 'Default DP is required for Demat',
      });
    }
  });

const bankSchema = z.object({
  accountType: requiredString('Account Type'),
  accountNumber: requiredString('Account Number'),
  micrCode: requiredString('MICR Code'),
  ifscCode: z.string().regex(IFSC_REGEX, 'Valid IFSC Code is required (e.g. SBIN0001234)'),
  defaultBank: z.boolean().optional(),
});

const bankDetailsSchema = z
  .object({
    banks: z.array(bankSchema),
  })
  .superRefine((data, ctx) => {
    if (data.banks.length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['_bank'],
        message: 'At least one bank account is required',
      });
      return;
    }

    if (data.banks.length > 0 && !data.banks.some((bank) => bank.defaultBank)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['_bank'],
        message: 'One bank must be marked as default',
      });
    }
  });

const addressSchema = z.object({
  addressLine1: requiredString('Address Line 1'),
  city: requiredString('City'),
  state: requiredString('State'),
  pincode: z.string().regex(PINCODE_REGEX, 'Valid 6-digit Pincode is required'),
  country: requiredString('Country'),
});

const contactSchema = z.object({
  mobile: z.string().regex(MOBILE_REGEX, 'Valid 10-digit Mobile Number is required'),
  email: z.string().regex(EMAIL_REGEX, 'Valid Email is required'),
});

const communicationSchema = z.object({
  communicationMode: requiredString('Communication Mode'),
});

const nriDetailsSchema = z.object({
  foreignAddress1: requiredString('Foreign Address'),
  foreignCity: requiredString('Foreign City'),
  foreignState: requiredString('Foreign State'),
  foreignCountry: requiredString('Foreign Country'),
  foreignPincode: requiredString('Foreign Pincode'),
});

const kycSchema = z
  .object({
    kycType: requiredString('KYC Type'),
    ckycNumber: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.kycType === 'C' && !data.ckycNumber?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['ckycNumber'],
        message: 'CKYC Number is required',
      });
    }
  });

const aadhaarSchema = z.object({
  aadhaarUpdated: requiredString('Aadhaar Updated flag'),
  paperlessFlag: requiredString('Paperless Flag'),
});

const declarationSchema = z.object({
  mobileDeclarationCode: requiredString('Mobile Declaration Code'),
});

const nominationSchema = z
  .object({
    nominationOpt: requiredString('Nomination Opt'),
    nominationAuthMode: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.nominationOpt === 'Y' && !data.nominationAuthMode) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['nominationAuthMode'],
        message: 'Nomination Authentication Mode is required',
      });
    }
  });

const nomineePercentageSchema = z.preprocess(
  (value) => {
    if (value === '' || value === null || value === undefined) return NaN;
    return Number(value);
  },
  z.number().positive('Percentage must be > 0')
);

const nomineeSchema = z
  .object({
    name: requiredString('Nominee Name'),
    relationship: requiredString('Relationship'),
    percentage: nomineePercentageSchema,
    isMinor: z.string().optional(),
    nomineeDob: z.string().optional(),
    guardianName: z.string().optional(),
    identityType: requiredString('Identity Type'),
    identityNumber: requiredString('Identity Number'),
  })
  .superRefine((data, ctx) => {
    if (data.isMinor === 'Y') {
      if (!data.nomineeDob) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['nomineeDob'],
          message: 'Nominee DOB required for minor',
        });
      }
      if (!data.guardianName?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['guardianName'],
          message: 'Guardian Name required for minor',
        });
      }
    }
  });

const nomineeDetailsSchema = z
  .object({
    nominees: z.array(nomineeSchema),
  })
  .superRefine((data, ctx) => {
    if (data.nominees.length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['_nominee'],
        message: 'At least one nominee is required',
      });
      return;
    }

    const totalPct = data.nominees.reduce((sum, nominee) => sum + (Number(nominee.percentage) || 0), 0);
    const normalizedTotal = Number(totalPct.toFixed(2));

    if (data.nominees.length > 0 && normalizedTotal !== 100) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['_nominee'],
        message: `Total nominee percentage must equal 100% (currently ${normalizedTotal}%)`,
      });
    }
  });

export const STEP_LABELS = [
  'Client Details',
  'Joint Holder',
  'Guardian',
  'PAN Details',
  'Client Type',
  'Bank Details',
  'Address',
  'Contact',
  'Communication',
  'NRI Details',
  'KYC',
  'Aadhaar',
  'Declaration',
  'Nomination',
  'Nominee Details',
];

export function validateStep(stepIndex, data = {}, allData = {}) {
  let result = { success: true };

  switch (stepIndex) {
    case 0:
      result = clientDetailsSchema.safeParse(data || {});
      break;

    case 1:
      if (['JO', 'AS'].includes(allData?.clientDetails?.holdingNature)) {
        result = jointHolderSchema.safeParse(data || {});
      }
      break;

    case 2:
      if (allData?.clientDetails?.isMinor) {
        result = guardianSchema.safeParse(data || {});
      }
      break;

    case 3:
      result = panDetailsSchema.safeParse(data || {});
      break;

    case 4:
      result = clientTypeSchema.safeParse(data || {});
      break;

    case 5:
      result = bankDetailsSchema.safeParse(data || {});
      break;

    case 6:
      result = addressSchema.safeParse(data || {});
      break;

    case 7:
      result = contactSchema.safeParse(data || {});
      break;

    case 8:
      result = communicationSchema.safeParse(data || {});
      break;

    case 9:
      if (['21', '24'].includes(allData?.clientDetails?.taxStatus)) {
        result = nriDetailsSchema.safeParse(data || {});
      }
      break;

    case 10:
      result = kycSchema.safeParse(data || {});
      break;

    case 11:
      result = aadhaarSchema.safeParse(data || {});
      break;

    case 12:
      result = declarationSchema.safeParse(data || {});
      break;

    case 13:
      result = nominationSchema.safeParse(data || {});
      break;

    case 14:
      if (allData?.nomination?.nominationOpt === 'Y') {
        result = nomineeDetailsSchema.safeParse(data || {});
      }
      break;

    default:
      break;
  }

  const errors = mapZodErrors(result);
  return { valid: Object.keys(errors).length === 0, errors };
}

export const TAX_STATUSES = [
  { value: '01', label: 'Individual' },
  { value: '02', label: 'On behalf of Minor' },
  { value: '03', label: 'HUF' },
  { value: '04', label: 'Company' },
  { value: '06', label: 'Partnership Firm' },
  { value: '07', label: 'Body Corporate' },
  { value: '08', label: 'Trust' },
  { value: '11', label: 'Bank' },
  { value: '21', label: 'NRI - Repatriable' },
  { value: '24', label: 'NRI - Non Repatriable' },
];

export const OCCUPATION_CODES = [
  { value: '01', label: 'Business' },
  { value: '02', label: 'Service' },
  { value: '03', label: 'Professional' },
  { value: '04', label: 'Agriculture' },
  { value: '05', label: 'Retired' },
  { value: '06', label: 'Housewife' },
  { value: '07', label: 'Student' },
  { value: '08', label: 'Others' },
  { value: '41', label: 'Private Sector Service' },
  { value: '42', label: 'Public Sector / Govt. Service' },
];

export const HOLDING_NATURES = [
  { value: 'SI', label: 'Single' },
  { value: 'JO', label: 'Joint' },
  { value: 'AS', label: 'Anyone or Survivor' },
];

export const BANK_ACCOUNT_TYPES = [
  { value: 'SB', label: 'Savings' },
  { value: 'CB', label: 'Current' },
  { value: 'NE', label: 'NRE' },
  { value: 'NO', label: 'NRO' },
];

export const COMMUNICATION_MODES = [
  { value: 'P', label: 'Physical' },
  { value: 'E', label: 'Email' },
  { value: 'M', label: 'Mobile' },
];

export const KYC_TYPES = [
  { value: 'K', label: 'KRA Verified' },
  { value: 'C', label: 'CKYC' },
  { value: 'B', label: 'Biometric' },
  { value: 'E', label: 'Aadhaar eKYC' },
];

export const MOBILE_DECLARATION_CODES = [
  { value: 'SE', label: 'Self' },
  { value: 'SP', label: 'Spouse' },
  { value: 'DC', label: 'Dependent Children' },
  { value: 'GD', label: 'Guardian' },
];

export const NOMINATION_AUTH_MODES = [
  { value: 'W', label: 'Wet Signature' },
  { value: 'E', label: 'eSign' },
  { value: 'O', label: 'OTP' },
];

export const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Delhi', 'Jammu & Kashmir', 'Ladakh', 'Chandigarh', 'Puducherry',
  'Andaman & Nicobar Islands', 'Dadra & Nagar Haveli', 'Lakshadweep',
];

export const NOMINEE_RELATIONSHIPS = [
  'Spouse', 'Son', 'Daughter', 'Father', 'Mother', 'Brother', 'Sister',
  'Grand Father', 'Grand Mother', 'Grand Son', 'Grand Daughter',
  'Father-in-law', 'Mother-in-law', 'Daughter-in-law', 'Son-in-law',
  'Nephew', 'Niece', 'Uncle', 'Aunt', 'Others',
];

export const GUARDIAN_RELATIONSHIPS = [
  { value: 'F', label: 'Father' },
  { value: 'M', label: 'Mother' },
  { value: 'C', label: 'Court Appointed' },
];
