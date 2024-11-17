// app/components/Share.tsx
import React, { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShare, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { 
  faWhatsapp, 
  faTelegram
} from '@fortawesome/free-brands-svg-icons';

interface ShareProps {
  bottomPosition?: number;
  url?: string;
  title?: string;
  whatsappNumber?: string;
}

const Share: React.FC<ShareProps> = ({ 
  bottomPosition = 200,
  url = typeof window !== 'undefined' ? window.location.href : '',
  title = 'Check this out!',
  whatsappNumber
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showCopiedMessage, setShowCopiedMessage] = useState(false);
  const shareRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Only add the event listener in the browser environment
    if (typeof window !== 'undefined') {
      const handleClickOutside = (event: MouseEvent) => {
        if (shareRef.current && !shareRef.current.contains(event.target as Node)) {
          setIsOpen(false);
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, []);

  const handleShare = (platform: string) => {
    let shareUrl = '';
    switch (platform) {
      case 'whatsapp':
        const message = `${title} ${url}`;
        
        if (whatsappNumber) {
          const cleanNumber = whatsappNumber.replace(/\D/g, '');
          shareUrl = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
        } else {
          shareUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
        }
        window.open(shareUrl, '_blank');
        break;
      case 'telegram':
        shareUrl = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
        window.open(shareUrl, '_blank');
        break;
      case 'email':
        shareUrl = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent('Check out this link: ' + url)}`;
        window.open(shareUrl, '_blank');
        break;
      case 'copy':
        navigator.clipboard.writeText(url).then(() => {
          setShowCopiedMessage(true);
          setTimeout(() => setShowCopiedMessage(false), 2000);
        });
        break;
    }
  };

  return (
    <div ref={shareRef}>
      <div
        className="btn btn-lg btn-primary btn-lg-square"
        onClick={() => setIsOpen(!isOpen)}
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
      >
        <FontAwesomeIcon icon={faShare} />
      </div>

      {isOpen && (
        <div 
          className="card shadow"
          style={{
            position: 'fixed',
            right: '70px',
            bottom: `${bottomPosition - 50}px`,
            width: '200px',
            zIndex: 1000,
            backgroundColor: 'white',
            borderRadius: '4px'
          }}
        >
          <div className="card-header bg-primary text-white">
            Share via
          </div>
          <div className="list-group list-group-flush">
            <button 
              className="list-group-item list-group-item-action d-flex align-items-center gap-2"
              onClick={() => handleShare('whatsapp')}
            >
              <FontAwesomeIcon icon={faWhatsapp} className="text-success" /> WhatsApp
            </button>
            <button 
              className="list-group-item list-group-item-action d-flex align-items-center gap-2"
              onClick={() => handleShare('telegram')}
            >
              <FontAwesomeIcon icon={faTelegram} className="text-info" /> Telegram
            </button>
            <button 
              className="list-group-item list-group-item-action d-flex align-items-center gap-2"
              onClick={() => handleShare('email')}
            >
              <FontAwesomeIcon icon={faEnvelope} className="text-secondary" /> Email
            </button>
            <button 
              className="list-group-item list-group-item-action d-flex align-items-center gap-2"
              onClick={() => handleShare('copy')}
            >
              <i>📋</i> Copy Link
              {showCopiedMessage && (
                <span className="text-success ms-2">(Copied!)</span>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Share;
