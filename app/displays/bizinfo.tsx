import React from 'react';
import { BusinessInfoViewIfc } from '@/app/types/ifc';
import { Row, Col, Card } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { 
  faMapMarkerAlt, faIndustry, faRulerCombined, faDollarSign, 
  faChartLine, faExchangeAlt, faQuestionCircle, 
  faIdCard, faTag, faUserTie, faMoneyBillWave, 
  faCoins, faCity, faWarehouse, faInfoCircle
} from '@fortawesome/free-solid-svg-icons';
import { faHeart as farHeart } from '@fortawesome/free-regular-svg-icons';
import { faHeart as fasHeart } from '@fortawesome/free-solid-svg-icons';
import styles from '../../public/css/BizInfo.module.css';
import { useFavorites } from '../components/FavoritesContext';

interface BizInfoProps {
  business: BusinessInfoViewIfc;
}

const InfoItem: React.FC<{ icon: IconDefinition; label: string; value: string | number | string[] | undefined }> = ({ icon, label, value }) => (
  <div className={`d-flex align-items-center mb-3 ${styles.infoItem}`}>
    <FontAwesomeIcon icon={icon} className={`me-2 text-primary ${styles.icon}`} fixedWidth />
    <div>
      <small className="text-muted">{label}</small>
      <div className="fw-bold">{Array.isArray(value) ? value.join(', ') : value || 'N/A'}</div>
    </div>
  </div>
);

const BizInfo: React.FC<BizInfoProps> = ({ business }) => {
  const { favorites, toggleFavorite } = useFavorites();
  const isFavorite = business.ref_id ? favorites.includes(business.ref_id) : false;

  return (
    <Card className={`shadow-sm ${styles.infoCard}`}>
      <Card.Body>
        <div className="d-flex justify-content-between align-items-start mb-3">
          <h3 className={`text-primary ${styles.sectionTitle}`}>{business.title || 'Untitled Business'}</h3>
          <button 
            onClick={() => business.ref_id && toggleFavorite(business.ref_id)} 
            className="btn btn-light btn-square me-3"
          >
            <FontAwesomeIcon icon={isFavorite ? fasHeart : farHeart} className="text-primary" />
          </button>
        </div>
        
        <Row>
          <Col md={6} lg={4}>
            <InfoItem icon={faMapMarkerAlt} label="Location" value={business.location} />
            <InfoItem icon={faCity} label="Business Situs" value={business.business_situs} />
            <InfoItem icon={faRulerCombined} label="Size" value={business.size ? `${business.size.toLocaleString()} sq ft` : undefined} />
            <InfoItem icon={faWarehouse} label="Rent" value={business.rent ? `$${business.rent.toLocaleString()}/month` : undefined} />
          </Col>
          
          <Col md={6} lg={4}>
            <InfoItem icon={faDollarSign} label="Price" value={business.price ? `$${business.price.toLocaleString()}` : undefined} />
            <InfoItem icon={faMoneyBillWave} label="Turnover" value={business.turnover ? `$${business.turnover.toLocaleString()}` : undefined} />
            <InfoItem icon={faCoins} label="Profit" value={business.profit ? `$${business.profit.toLocaleString()}` : undefined} />
            <InfoItem icon={faTag} label="Labels" value={business.label} />
          </Col>
          
          <Col md={6} lg={4}>
            <InfoItem icon={faIndustry} label="Industry" value={business.industry} />
            <InfoItem icon={faUserTie} label="Involvement" value={business.involvement} />
            <InfoItem icon={faExchangeAlt} label="Transfer Method" value={business.transfer_method} />
            <InfoItem icon={faIdCard} label="Licenses" value={business.license} />
          </Col>
        </Row>
        
        {business.reason && business.reason.length > 0 && (
          <Row className="mt-4">
            <Col>
              <h5 className={`mb-3 ${styles.subTitle}`}>
                <FontAwesomeIcon icon={faQuestionCircle} className="me-2 text-primary" />Reason for Sale
              </h5>
              <ul className="list-unstyled">
                {business.reason.map((item, index) => (
                  <li key={index} className="mb-2">
                    <FontAwesomeIcon icon={faChartLine} className="me-2 text-muted" />{item}
                  </li>
                ))}
              </ul>
            </Col>
          </Row>
        )}

        {business.description && business.description.length > 0 && (
          <Row className="mt-4">
            <Col>
              <h5 className={`mb-3 ${styles.subTitle}`}>
                <FontAwesomeIcon icon={faInfoCircle} className="me-2 text-primary" />Description
              </h5>
              {business.description.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </Col>
          </Row>
        )}

        <div className="text-end mt-3">
          <small className="text-muted">Ref ID: {business.ref_id || 'N/A'}</small>
        </div>
      </Card.Body>
    </Card>
  );
};

export default BizInfo;
