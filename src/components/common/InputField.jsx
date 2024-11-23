import React from 'react';
import PropTypes from 'prop-types';
import './InputField.css'; // Optional CSS file for styling

const InputField = ({
  label,
  type,
  name,
  value,
  onChange,
  placeholder,
  error,
  className,
}) => {
  return (
    <div className={`input-field ${className}`}>
      {label && <label htmlFor={name}>{label}</label>}
      <input
        type={type}
        name={name}
        id={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
      {error && <span className="input-error">{error}</span>}
    </div>
  );
};

InputField.propTypes = {
  label: PropTypes.string,
  type: PropTypes.oneOf(['text', 'password', 'email', 'number']),
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  error: PropTypes.string,
  className: PropTypes.string,
};

InputField.defaultProps = {
  type: 'text',
  placeholder: '',
  error: '',
  className: '',
};

export default InputField;
