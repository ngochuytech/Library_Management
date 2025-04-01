import React from 'react';
import { Link } from 'react-router-dom';

const SuccessForm = () => {
  return (
    <div className="success-container">
      <div className="success-icon">✓</div>
      <h2>Password Reset Successful</h2>
      <p>Your password has been successfully reset.</p>
      <p>You can now log in with your new password.</p>
      
      <Link to="/login" className="primary-button">
        Go to Login
      </Link>
    </div>
  );
};

export default SuccessForm;