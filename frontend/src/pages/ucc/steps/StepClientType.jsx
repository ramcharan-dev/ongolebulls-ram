import { Input, Radio } from './FormField';
import FormGrid from '../components/FormGrid';

export default function StepClientType({ data, errors, onChange }) {
  const update = (name, value) => onChange({ ...data, [name]: value });

  return (
    <div className="space-y-6">
      <Radio label="Client Type" name="clientType" value={data.clientType}
        onChange={update} error={errors.clientType} required
        options={[
          { value: 'P', label: 'Physical' },
          { value: 'D', label: 'Demat' },
        ]}
      />

      {data.clientType === 'D' && (
        <FormGrid className="mt-2 rounded-lg border border-slate-200 bg-slate-50 p-4">
          <Radio label="Default DP" name="defaultDp" value={data.defaultDp}
            onChange={update} error={errors.defaultDp} required
            options={[
              { value: 'C', label: 'CDSL' },
              { value: 'N', label: 'NSDL' },
            ]}
          />
          <Input label="CDSL DPID" name="cdslDpId" value={data.cdslDpId} onChange={update} placeholder="e.g. 12345678" />
          <Input label="CDSL Client ID" name="cdslClientId" value={data.cdslClientId} onChange={update} />
          <Input label="NSDL DPID" name="nsdlDpId" value={data.nsdlDpId} onChange={update} placeholder="e.g. IN301234" />
          <Input label="NSDL Client ID" name="nsdlClientId" value={data.nsdlClientId} onChange={update} />
        </FormGrid>
      )}
    </div>
  );
}
