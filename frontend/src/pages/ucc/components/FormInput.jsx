function FieldMeta({ helperText, error }) {
  if (!helperText && !error) return <div className="ucc-field-meta" />;
  return <div className={`ucc-field-meta ${error ? 'is-error' : ''}`}>{error || helperText}</div>;
}

export function TextInput({
  label,
  required,
  value,
  onChange,
  name,
  type = 'text',
  placeholder,
  disabled,
  maxLength,
  error,
  helperText,
}) {
  return (
    <div className="ucc-field-block">
      <label className="ucc-field-label">
        {label}
        {required ? <span>*</span> : null}
      </label>
      <input
        type={type}
        value={value || ''}
        onChange={(event) => onChange(name, event.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        maxLength={maxLength}
        className={`ucc-field-control ${error ? 'is-error' : ''}`}
      />
      <FieldMeta helperText={helperText} error={error} />
    </div>
  );
}

export function SelectInput({
  label,
  required,
  value,
  onChange,
  name,
  options = [],
  placeholder,
  disabled,
  error,
  helperText,
}) {
  return (
    <div className="ucc-field-block">
      <label className="ucc-field-label">
        {label}
        {required ? <span>*</span> : null}
      </label>
      <select
        value={value || ''}
        onChange={(event) => onChange(name, event.target.value)}
        disabled={disabled}
        className={`ucc-field-control ${error ? 'is-error' : ''}`}
      >
        <option value="">{placeholder || 'Select...'}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <FieldMeta helperText={helperText} error={error} />
    </div>
  );
}

export function RadioGroup({
  label,
  required,
  value,
  onChange,
  name,
  options = [],
  error,
  helperText,
}) {
  return (
    <div className="ucc-field-block">
      <label className="ucc-field-label">
        {label}
        {required ? <span>*</span> : null}
      </label>
      <div className="ucc-choice-row">
        {options.map((option) => {
          const checked = value === option.value;
          return (
            <label key={option.value} className={`ucc-choice-pill ${checked ? 'is-checked' : ''}`}>
              <input
                type="radio"
                name={name}
                value={option.value}
                checked={checked}
                onChange={(event) => onChange(name, event.target.value)}
              />
              <span>{option.label}</span>
            </label>
          );
        })}
      </div>
      <FieldMeta helperText={helperText} error={error} />
    </div>
  );
}

export function CheckInput({ label, checked, onChange, name, error, helperText }) {
  return (
    <div className="ucc-field-block">
      <label className={`ucc-choice-pill ${checked ? 'is-checked' : ''}`}>
        <input
          type="checkbox"
          checked={checked || false}
          onChange={(event) => onChange(name, event.target.checked)}
        />
        <span>{label}</span>
      </label>
      <FieldMeta helperText={helperText} error={error} />
    </div>
  );
}
