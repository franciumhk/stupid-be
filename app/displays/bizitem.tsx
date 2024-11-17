import React, { useState } from 'react';
import Link from 'next/link';
import { BusinessItemViewIfc, BusinessInfoViewIfc } from '@/app/types/ifc';
import BizInfo from './bizinfo';
import { Spinner } from 'react-bootstrap';
import { BACKEND_URL } from '../types/config';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as farHeart } from '@fortawesome/free-regular-svg-icons';
import { faHeart as fasHeart } from '@fortawesome/free-solid-svg-icons';
import { useFavorites } from '../components/FavoritesContext';
interface BusinessItemProps {
  business: BusinessItemViewIfc;
  delay: number;
}

export const BusinessItem: React.FC<BusinessItemProps> = ({ business, delay }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [businessInfo, setBusinessInfo] = useState<BusinessInfoViewIfc | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { favorites, toggleFavorite } = useFavorites();
  const isFavorite = favorites.includes(business.ref_id);

  const toggleExpand = async () => {
    if (!isExpanded && !businessInfo) {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`${BACKEND_URL}/api/py/businesses_info/${business.ref_id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch business info');
        }
        const data: BusinessInfoViewIfc = await response.json();
        setBusinessInfo(data);
        setIsExpanded(true);
      } catch (err) {
        setError('Failed to load business information. Please try again.');
        console.error('Error fetching business info:', err);
      } finally {
        setIsLoading(false);
      }
    } else {
      setIsExpanded(!isExpanded);
    }
  };

  return (
    <div>
      {isLoading ? (
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <div className="business-item mb-4 wow fadeInUp" data-wow-delay={`${delay}s`}>
          <div
            className="row g-4 cursor-pointer border rounded p-4 transition-bg"
            onClick={toggleExpand}
            style={{
              backgroundColor: isExpanded ? '--secondary' : 'white',
              transition: 'background-color 0.3s ease'
            }}
          >
            <div className="col-sm-12 col-md-8 d-flex align-items-center">
              <img className="flex-shrink-0 img-fluid border rounded" src="/img/com-logo-1.jpg" alt="" style={{ width: '80px', height: '80px' }} />
              <div className="text-start ps-4">
                <h5 className="mb-3">{business.title}</h5>
                <span className="text-truncate me-3"><i className="fa fa-map-marker-alt text-primary me-2"></i>{business.location}</span>
                <span className="text-truncate me-3"><i className="fa-solid fa-industry text-primary me-2"></i>{business.industry.join(', ')}</span>
                <span className="text-truncate me-3"><i className="fa-solid fa-up-right-and-down-left-from-center text-primary me-2"></i>{business.size} ft</span>
                <span className="text-truncate me-3"><i className="far fa-money-bill-alt text-primary me-2"></i>${business.price}</span>
                <span className="text-truncate me-3"><i className="fa-solid fa-money-bill-trend-up text-primary me-2"></i>${business.turnover}</span>
                <span className="text-truncate me-3"><i className="far fa-calendar-alt text-primary me-2"></i>{business.involvement.join(', ')}</span>
              </div>
            </div>
            <div className="col-sm-12 col-md-4 d-flex flex-column align-items-start align-items-md-end justify-content-center">
              <div className="d-flex mb-3">
                <button onClick={() => toggleFavorite(business.ref_id)} className="btn btn-light btn-square me-3">
                  <FontAwesomeIcon icon={isFavorite ? fasHeart : farHeart} className="text-primary" />
                </button>
                <Link href={`/business/${business.ref_id}`} className="btn btn-primary" onClick={(e) => e.stopPropagation()}>
                  More Info
                </Link>
              </div>
              <small className="text-truncate me-3"><i className="fa-solid fa-hashtag text-primary me-2"></i>{business.ref_id}</small>
            </div>
          </div>
          {isExpanded && (
            <div className="row mt-4 border-top pt-4">
              <div className="col-12">
                {error ? (
                  <div className="alert alert-danger" role="alert">
                    {error}
                  </div>
                ) : businessInfo ? (
                  <BizInfo business={businessInfo} />
                ) : (
                  <div className="text-center">
                    <Spinner animation="border" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </Spinner>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>

  );
};


export const BizitemComponent: React.FC<{ bizitems: BusinessItemViewIfc[] }> = ({ bizitems }) => (
  <>
    {bizitems.map((business, index) => (
      <BusinessItem
        key={business.ref_id}
        business={business}
        delay={0.1 * index}
      />
    ))}
  </>
);
