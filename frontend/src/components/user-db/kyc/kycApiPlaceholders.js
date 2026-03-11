const PAN_REGEX = /^[A-Z]{5}[0-9]{4}[A-Z]$/;

const MOCK_IFSC_BANK_MAP = {
  SBIN: 'State Bank of India',
  HDFC: 'HDFC Bank',
  ICIC: 'ICICI Bank',
  KKBK: 'Kotak Mahindra Bank',
  AXIS: 'Axis Bank',
  PUNB: 'Punjab National Bank',
};

export async function verifyPAN({ panNumber, nameAsPerPan }) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (!PAN_REGEX.test((panNumber || '').toUpperCase())) {
        reject(new Error('Invalid PAN format. Use format: ABCDE1234F'));
        return;
      }

      if (!nameAsPerPan || nameAsPerPan.trim().length < 3) {
        reject(new Error('Name as per PAN is required for verification.'));
        return;
      }

      resolve({
        success: true,
        message: 'PAN verified successfully.',
      });
    }, 900);
  });
}

export async function sendAadhaarOTP({ aadhaarNumber }) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (!/^\d{12}$/.test(aadhaarNumber || '')) {
        reject(new Error('Aadhaar number must be 12 digits.'));
        return;
      }

      resolve({
        success: true,
        otpToken: `aadhaar_${Date.now()}`,
        message: 'OTP sent to Aadhaar-linked mobile number.',
      });
    }, 900);
  });
}

export async function verifyAadhaarOTP({ otp }) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (!/^\d{6}$/.test(otp || '')) {
        reject(new Error('Enter a valid 6-digit OTP.'));
        return;
      }

      if (otp !== '123456') {
        reject(new Error('Incorrect OTP. Use 123456 for demo verification.'));
        return;
      }

      resolve({
        success: true,
        message: 'Aadhaar OTP verified successfully.',
      });
    }, 850);
  });
}

export async function fetchBankByIFSC(ifscCode) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const code = (ifscCode || '').toUpperCase().trim();
      const prefix = code.slice(0, 4);
      resolve({
        bankName: MOCK_IFSC_BANK_MAP[prefix] || '',
      });
    }, 500);
  });
}

export async function submitKYC(payload) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        referenceId: `KYC-${Date.now()}`,
        message: 'KYC submitted successfully. We will update your verification status shortly.',
        payload,
      });
    }, 1300);
  });
}
