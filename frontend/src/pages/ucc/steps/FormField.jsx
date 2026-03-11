// Shared form field components used across all UCC steps
import { CheckInput, RadioGroup, SelectInput, TextInput } from '../components/FormInput';

export function Input({ label, name, value, onChange, error, type = 'text', placeholder, required, disabled, maxLength, helperText }) {
  return (
    <TextInput
      label={label}
      name={name}
      value={value}
      onChange={onChange}
      error={error}
      type={type}
      placeholder={placeholder}
      required={required}
      disabled={disabled}
      maxLength={maxLength}
      helperText={helperText}
    />
  );
}

export function Select({ label, name, value, onChange, error, options, required, disabled, placeholder, helperText }) {
  return (
    <SelectInput
      label={label}
      name={name}
      value={value}
      onChange={onChange}
      error={error}
      options={options}
      required={required}
      disabled={disabled}
      placeholder={placeholder}
      helperText={helperText}
    />
  );
}

export function Radio({ label, name, value, onChange, error, options, required, helperText }) {
  return (
    <RadioGroup
      label={label}
      name={name}
      value={value}
      onChange={onChange}
      error={error}
      options={options}
      required={required}
      helperText={helperText}
    />
  );
}

export function Checkbox({ label, name, checked, onChange, error, helperText }) {
  return (
    <CheckInput label={label} name={name} checked={checked} onChange={onChange} error={error} helperText={helperText} />
  );
}
