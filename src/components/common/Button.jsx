import React from 'react';
import PropTypes from 'prop-types';
import './Button.css'; // Optional CSS file for styling

const Button = ({ label, onClick, type, disabled, className }) => {
  return (
    <button
      className={`app-button ${className}`}
      onClick={onClick}
      type={type}
      disabled={disabled}
    >
      {label}
    </button>
  );
};

Button.propTypes = {
  label: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  disabled: PropTypes.bool,
  className: PropTypes.string,
};

Button.defaultProps = {
  type: 'button',
  disabled: false,
  className: '',
};

export default Button;
