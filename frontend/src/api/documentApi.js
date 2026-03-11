/**
 * Customer KYC Document API — maps to CustomerDocumentController (/api/customer-documents)
 */
import api from './axiosConfig';

/**
 * POST /api/customer-documents/submit   (multipart/form-data)
 * Submit full KYC, bank details, up to 3 nominees, and document files.
 *
 * Required FormData fields:
 *   investorName, investorEmail, investorPhone, investorDOB (yyyy-MM-dd)
 *   panNumber (unique), aadhaarNumber, investorAddress
 *   bankAccountName, bankName, bankAccountNumber, bankIFSC, bankBranch
 *   bankAccountType, bankProofType, taxResidencyCountry, riskProfile
 *
 * Optional file fields:
 *   panCardFile, aadhaarCardFile, photographFile, bankProofFile, signatureFile
 *
 * Optional nominee fields (repeat for [1] and [2]):
 *   nominees[0].nomineeName, nominees[0].relationship, nominees[0].dateOfBirth
 *   nominees[0].allocationPercentage, nominees[0].nomineeAddress
 *   nominees[0].guardianName, nominees[0].guardianRelationship, nominees[0].guardianPan
 *
 * Returns: { success: true, message: "Documents submitted successfully", id: number }
 * Error 409: PAN number already exists
 *
 * @param {FormData} formData
 */
export const submitKycDocuments = (formData) =>
  api.post('/api/customer-documents/submit', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
