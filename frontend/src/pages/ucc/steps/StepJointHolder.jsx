import { Input, Select } from './FormField';
import { KYC_TYPES } from '../uccValidation';
import FormGrid from '../components/FormGrid';

export default function StepJointHolder({ data, errors, onChange, allData }) {
  const isJoint = ['JO', 'AS'].includes(allData?.clientDetails?.holdingNature);

  const updateHolder = (holder, name, value) => {
    onChange({ ...data, [holder]: { ...data[holder], [name]: value } });
  };

  if (!isJoint) return null;

  return (
    <div className="space-y-8">
      {/* Second Holder */}
      <div>
        <h3 className="mb-4 border-b border-slate-200 pb-2 text-base font-semibold text-slate-700">Second Holder</h3>
        <FormGrid>
          <Input label="First Name" name="firstName" value={data.secondHolder?.firstName}
            onChange={(n, v) => updateHolder('secondHolder', n, v)} error={errors['secondHolder.firstName']} required />
          <Input label="Middle Name" name="middleName" value={data.secondHolder?.middleName}
            onChange={(n, v) => updateHolder('secondHolder', n, v)} />
          <Input label="Last Name" name="lastName" value={data.secondHolder?.lastName}
            onChange={(n, v) => updateHolder('secondHolder', n, v)} error={errors['secondHolder.lastName']} required />
          <Input label="Date of Birth" name="dob" value={data.secondHolder?.dob}
            onChange={(n, v) => updateHolder('secondHolder', n, v)} error={errors['secondHolder.dob']} required type="date" />
          <Input label="PAN" name="pan" value={data.secondHolder?.pan}
            onChange={(n, v) => updateHolder('secondHolder', n, v)} error={errors['secondHolder.pan']} required
            placeholder="ABCDE1234F" maxLength={10} helperText="PAN must be valid format (ABCDE1234F)" />
          <Select label="KYC Type" name="kycType" value={data.secondHolder?.kycType}
            onChange={(n, v) => updateHolder('secondHolder', n, v)} options={KYC_TYPES} />
        </FormGrid>
      </div>

      {/* Third Holder (Optional) */}
      <div>
        <h3 className="mb-4 border-b border-slate-200 pb-2 text-base font-semibold text-slate-700">Third Holder (Optional)</h3>
        <FormGrid>
          <Input label="First Name" name="firstName" value={data.thirdHolder?.firstName}
            onChange={(n, v) => updateHolder('thirdHolder', n, v)} />
          <Input label="Middle Name" name="middleName" value={data.thirdHolder?.middleName}
            onChange={(n, v) => updateHolder('thirdHolder', n, v)} />
          <Input label="Last Name" name="lastName" value={data.thirdHolder?.lastName}
            onChange={(n, v) => updateHolder('thirdHolder', n, v)} />
          <Input label="Date of Birth" name="dob" value={data.thirdHolder?.dob}
            onChange={(n, v) => updateHolder('thirdHolder', n, v)} type="date" />
          <Input label="PAN" name="pan" value={data.thirdHolder?.pan}
            onChange={(n, v) => updateHolder('thirdHolder', n, v)} placeholder="ABCDE1234F" maxLength={10}
            helperText="Use uppercase PAN format" />
          <Select label="KYC Type" name="kycType" value={data.thirdHolder?.kycType}
            onChange={(n, v) => updateHolder('thirdHolder', n, v)} options={KYC_TYPES} />
        </FormGrid>
      </div>
    </div>
  );
}
