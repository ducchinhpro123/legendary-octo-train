import React from 'react';

const Alert = ({ type, message, onClose }) => {
  const alertClass = `alert alert-${type} alert-dismissible fade show`;
  
  return (
    <div className={alertClass} role="alert">
      {message}
      {onClose && (
        <button 
          type="button" 
          className="btn-close" 
          aria-label="Close"
          onClick={onClose}
        ></button>
      )}
    </div>
  );
};

export default Alert;