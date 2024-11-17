import React from 'react';
import { Form, Row, Col, Button, InputGroup } from 'react-bootstrap';
import { Range } from 'react-range';
import { OPTIONS, DEFAULT_LIMITS } from '../types/const';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faDollarSign, faChartLine, faMapMarkerAlt, faIndustry } from '@fortawesome/free-solid-svg-icons';
import styles from '../../public/css/SearchForm.module.css';

interface SearchParams {
  keyword: string;
  priceRange: [number, number];
  turnoverRange: [number, number];
  location: string;
  industry: string;
}

interface SearchFormProps {
  searchParams: SearchParams;
  handleSearchChange: (name: string, value: string | number | [number, number]) => void;
  handleSearch: (e: React.FormEvent) => void;
  handleResetSearch: () => void;
}

const SearchForm: React.FC<SearchFormProps> = ({ 
  searchParams, 
  handleSearchChange, 
  handleSearch, 
  handleResetSearch,
}) => {
  return (
    <Form onSubmit={handleSearch} className="mb-4 shadow p-4 bg-white rounded">
      <Row className="g-3">
        <Col md={4}>
          <InputGroup>
            <InputGroup.Text><FontAwesomeIcon icon={faSearch} /></InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="Keyword"
              name="keyword"
              value={searchParams.keyword}
              onChange={(e) => handleSearchChange('keyword', e.target.value)}
            />
          </InputGroup>
        </Col>
        <Col md={4}>
          <Form.Label className="fw-bold">
            <FontAwesomeIcon icon={faDollarSign} className="me-2" />
            Price Range: ${searchParams.priceRange[0].toLocaleString()} - ${searchParams.priceRange[1].toLocaleString()}
          </Form.Label>
          <Range
            step={DEFAULT_LIMITS.STEP_PRICE}
            min={DEFAULT_LIMITS.MIN_PRICE}
            max={DEFAULT_LIMITS.MAX_PRICE}
            values={searchParams.priceRange}
            onChange={(values) => handleSearchChange('priceRange', values as [number, number])}
            renderTrack={({ props, children }) => (
              <div {...props} className={styles.rangeTrack}>
                {children}
              </div>
            )}
            renderThumb={({ props }) => {
              const { key, ...restProps } = props;
              return (
                <div
                  key={key}
                  {...restProps}
                  className={styles.orangeThumb}
                />
              );
            }}
          />
        </Col>
        <Col md={4}>
          <Form.Label className="fw-bold">
            <FontAwesomeIcon icon={faChartLine} className="me-2" />
            Turnover Range: ${searchParams.turnoverRange[0].toLocaleString()} - ${searchParams.turnoverRange[1].toLocaleString()}
          </Form.Label>
          <Range
            step={DEFAULT_LIMITS.STEP_TURNOVER}
            min={DEFAULT_LIMITS.MIN_TURNOVER}
            max={DEFAULT_LIMITS.MAX_TURNOVER}
            values={searchParams.turnoverRange}
            onChange={(values) => handleSearchChange('turnoverRange', values as [number, number])}
            renderTrack={({ props, children }) => (
              <div {...props} className={styles.rangeTrack}>
                {children}
              </div>
            )}
            renderThumb={({ props }) => {
              const { key, ...restProps } = props;
              return (
                <div
                  key={key}
                  {...restProps}
                  className={styles.orangeThumb}
                />
              );
            }}
          />
        </Col>
        <Col md={4}>
          <InputGroup>
            <InputGroup.Text><FontAwesomeIcon icon={faMapMarkerAlt} /></InputGroup.Text>
            <Form.Select
              name="location"
              value={searchParams.location}
              onChange={(e) => handleSearchChange('location', e.target.value)}
            >
              <option value="">Select Location</option>
              {OPTIONS.LOCATION.map((location, index) => (
                <option key={index} value={location}>{location}</option>
              ))}
            </Form.Select>
          </InputGroup>
        </Col>
        <Col md={4}>
          <InputGroup>
            <InputGroup.Text><FontAwesomeIcon icon={faIndustry} /></InputGroup.Text>
            <Form.Select
              name="industry"
              value={searchParams.industry}
              onChange={(e) => handleSearchChange('industry', e.target.value)}
            >
              <option value="">Select Industry</option>
              {OPTIONS.INDUSTRY.map((industry, index) => (
                <option key={index} value={industry}>{industry}</option>
              ))}
            </Form.Select>
          </InputGroup>
        </Col>
        <Col md={2}>
          <Button type="submit" variant="primary" className={`w-100 ${styles.searchButton}`}>
            <>
              <FontAwesomeIcon icon={faSearch} className="me-2" />
              Search
            </>
          </Button>
        </Col>
        <Col md={2}>
          <Button 
            type="button" 
            variant="outline-secondary" 
            className={`w-100 ${styles.resetButton}`}
            onClick={handleResetSearch}
          >
            Reset
          </Button>
        </Col>
      </Row>
    </Form>
  );
};

export default SearchForm;
