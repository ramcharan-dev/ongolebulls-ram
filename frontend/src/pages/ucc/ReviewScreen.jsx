import {
  TAX_STATUSES,
  OCCUPATION_CODES,
  HOLDING_NATURES,
  BANK_ACCOUNT_TYPES,
  COMMUNICATION_MODES,
  KYC_TYPES,
  MOBILE_DECLARATION_CODES,
  NOMINATION_AUTH_MODES,
} from './uccValidation';

const lookup = (arr, val) => arr.find((o) => o.value === val)?.label || val || '—';

function Section({ title, children }) {
  return (
    <section className="ucc-review-section">
      <h3>{title}</h3>
      <div className="ucc-review-grid">{children}</div>
    </section>
  );
}

function Field({ label, value }) {
  if (!value && value !== 0) return null;
  return (
    <div className="ucc-review-field">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

export default function ReviewScreen({ formData }) {
  const cd = formData.clientDetails || {};
  const jh = formData.jointHolder || {};
  const gd = formData.guardian || {};
  const pan = formData.panDetails || {};
  const ct = formData.clientType || {};
  const bd = formData.bankDetails || {};
  const addr = formData.address || {};
  const cont = formData.contact || {};
  const comm = formData.communication || {};
  const nri = formData.nriDetails || {};
  const kyc = formData.kyc || {};
  const aad = formData.aadhaar || {};
  const decl = formData.declaration || {};
  const nom = formData.nomination || {};
  const nd = formData.nomineeDetails || {};

  return (
    <div className="ucc-review">
      <div className="ucc-review-alert">
        Review every section carefully before final UCC submission.
      </div>

      <Section title="1. Client Details">
        <Field label="Client Code" value={cd.clientCode} />
        <Field label="Name" value={[cd.firstName, cd.middleName, cd.lastName].filter(Boolean).join(' ')} />
        <Field label="Tax Status" value={lookup(TAX_STATUSES, cd.taxStatus)} />
        <Field label="Gender" value={cd.gender === 'M' ? 'Male' : cd.gender === 'F' ? 'Female' : cd.gender} />
        <Field label="DOB" value={cd.dob} />
        <Field label="Occupation" value={lookup(OCCUPATION_CODES, cd.occupationCode)} />
        <Field label="Holding Nature" value={lookup(HOLDING_NATURES, cd.holdingNature)} />
      </Section>

      {(jh.secondHolder?.firstName) && (
        <Section title="2. Joint Holder">
          <Field label="2nd Holder" value={[jh.secondHolder?.firstName, jh.secondHolder?.lastName].filter(Boolean).join(' ')} />
          <Field label="2nd Holder PAN" value={jh.secondHolder?.pan} />
          <Field label="3rd Holder" value={[jh.thirdHolder?.firstName, jh.thirdHolder?.lastName].filter(Boolean).join(' ')} />
        </Section>
      )}

      {gd.guardianFirstName && (
        <Section title="3. Guardian">
          <Field label="Guardian" value={[gd.guardianFirstName, gd.guardianLastName].filter(Boolean).join(' ')} />
          <Field label="Guardian PAN" value={gd.guardianPan} />
        </Section>
      )}

      <Section title="4. PAN Details">
        <Field label="Primary PAN" value={pan.primaryPan} />
        <Field label="Second PAN" value={pan.secondPan} />
        <Field label="Third PAN" value={pan.thirdPan} />
        <Field label="Guardian PAN" value={pan.guardianPan} />
      </Section>

      <Section title="5. Client Type">
        <Field label="Type" value={ct.clientType === 'D' ? 'Demat' : 'Physical'} />
        <Field label="Default DP" value={ct.clientType === 'D' ? (ct.defaultDp === 'C' ? 'CDSL' : 'NSDL') : '—'} />
      </Section>

      <Section title="6. Bank Details">
        {(bd.banks || []).map((bank, i) => (
          <div key={i} className="ucc-review-bank">
            <p>Bank Account {i + 1}</p>
            <div className="ucc-review-grid">
              <Field label="Account Type" value={lookup(BANK_ACCOUNT_TYPES, bank.accountType)} />
              <Field label="Account Number" value={bank.accountNumber} />
              <Field label="IFSC" value={bank.ifscCode} />
              <Field label="Default" value={bank.defaultBank ? 'Yes' : 'No'} />
            </div>
          </div>
        ))}
      </Section>

      <Section title="7. Address">
        <Field label="Address" value={[addr.addressLine1, addr.addressLine2, addr.addressLine3].filter(Boolean).join(', ')} />
        <Field label="City" value={addr.city} />
        <Field label="State" value={addr.state} />
        <Field label="Pincode" value={addr.pincode} />
        <Field label="Country" value={addr.country} />
      </Section>

      <Section title="8. Contact">
        <Field label="Mobile" value={cont.mobile} />
        <Field label="Email" value={cont.email} />
        <Field label="Residence Phone" value={cont.residencePhone} />
        <Field label="Office Phone" value={cont.officePhone} />
      </Section>

      <Section title="9. Communication">
        <Field label="Mode" value={lookup(COMMUNICATION_MODES, comm.communicationMode)} />
      </Section>

      {nri.foreignAddress1 && (
        <Section title="10. NRI Details">
          <Field label="Foreign Address" value={nri.foreignAddress1} />
          <Field label="Foreign City" value={nri.foreignCity} />
          <Field label="Foreign Country" value={nri.foreignCountry} />
        </Section>
      )}

      <Section title="11. KYC">
        <Field label="KYC Type" value={lookup(KYC_TYPES, kyc.kycType)} />
        <Field label="CKYC Number" value={kyc.ckycNumber} />
      </Section>

      <Section title="12. Aadhaar">
        <Field label="Aadhaar Updated" value={aad.aadhaarUpdated === 'Y' ? 'Yes' : 'No'} />
        <Field label="Paperless" value={aad.paperlessFlag === 'Z' ? 'Paperless' : 'Paper'} />
      </Section>

      <Section title="13. Declaration">
        <Field label="Mobile Declaration" value={lookup(MOBILE_DECLARATION_CODES, decl.mobileDeclarationCode)} />
      </Section>

      <Section title="14. Nomination">
        <Field label="Nomination" value={nom.nominationOpt === 'Y' ? 'Yes' : 'No'} />
        <Field label="Auth Mode" value={lookup(NOMINATION_AUTH_MODES, nom.nominationAuthMode)} />
      </Section>

      {(nd.nominees || []).length > 0 && (
        <Section title="15. Nominee Details">
          {nd.nominees.map((n, i) => (
            <div key={i} className="ucc-review-bank">
              <p>Nominee {i + 1}</p>
              <div className="ucc-review-grid">
                <Field label="Name" value={n.name} />
                <Field label="Relationship" value={n.relationship} />
                <Field label="Percentage" value={`${n.percentage}%`} />
                <Field label="Minor" value={n.isMinor === 'Y' ? 'Yes' : 'No'} />
              </div>
            </div>
          ))}
        </Section>
      )}
    </div>
  );
}
