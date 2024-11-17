// app/components/WhatsApp.tsx
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';

interface WhatsAppProps {
  phoneNumber: string;
  initialMessage?: string;
  bottomPosition?: number;
}

const WhatsApp: React.FC<WhatsAppProps> = ({ 
  phoneNumber, 
  initialMessage = "Hello, I'm interested in your services!",
  bottomPosition = 140
}) => {
  const handleWhatsAppClick = () => {
    // Remove any non-numeric characters from the phone number
    const formattedNumber = phoneNumber.replace(/\D/g, '');
    const encodedMessage = encodeURIComponent(initialMessage);
    const whatsappUrl = `https://wa.me/${formattedNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div
      onClick={handleWhatsAppClick}
      className="btn btn-lg btn-success btn-lg-square"
      style={{
        position: 'fixed',
        right: '20px',
        bottom: `${bottomPosition}px`,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        cursor: 'pointer',
        width: '40px',
        height: '40px',
        borderRadius: '4px',
        zIndex: 1000
      }}
      title="Contact us on WhatsApp"
    >
      <FontAwesomeIcon icon={faWhatsapp} />
    </div>
  );
};

export default WhatsApp;
