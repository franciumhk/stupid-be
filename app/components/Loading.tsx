import React from 'react';

interface SpinnerProps {
  show: boolean;
}

export const Spinner: React.FC<SpinnerProps> = ({ show }) => {
  if (!show) return null;

  return (
    <div 
      className="show bg-white position-fixed translate-middle w-100 vh-100 top-50 start-50 d-flex align-items-center justify-content-center"
      style={{ zIndex: 9999 }}
    >
      <div 
        className="spinner-border text-primary" 
        style={{ width: '3rem', height: '3rem' }} 
        role="status"
      >
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );
};

export default function Loading() {
  return <Spinner show={true} />;
}
