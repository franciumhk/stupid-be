import React from 'react';
import { BizSchema } from '../types/bizSchema';
import { useSession } from "next-auth/react";

const BizDetail: React.FC<{ business: BizSchema }> = ({ business }) => {
  const { data: session } = useSession();
  if (!session) {
    return (
      <div/>
    );
  }
  return (
    <div className="card-body p-5">
      <h1 className="display-4 mb-2" style={{ wordWrap: 'break-word', overflowWrap: 'break-word' }}>
        {business.title}
      </h1>
      <p className="lead text-muted mb-4">Reference ID: {business.ref_id}</p>

      <div className="row g-4">
        {/* Business Overview */}
        <div className="col-md-6">
          <div className="card h-100 border-0 shadow-sm">
            <div className="card-body">
              <h2 className="card-title h4 mb-4">Business Overview</h2>
              <dl className="row">
                <dt className="col-sm-6">Business Name</dt>
                <dd className="col-sm-6">{business.business_name}</dd>
                <dt className="col-sm-6">Business Type</dt>
                <dd className="col-sm-6">{business.business_type}</dd>
                <dt className="col-sm-6">Industry</dt>
                <dd className="col-sm-6">{business.industry.join(', ')}</dd>
                <dt className="col-sm-6">Labels</dt>
                <dd className="col-sm-6">{business.label.join(', ')}</dd>
                <dt className="col-sm-6">Founded</dt>
                <dd className="col-sm-6">{business.foundation_date}</dd>
                <dt className="col-sm-6">Availability</dt>
                <dd className="col-sm-6">{business.availability}</dd>
                <dt className="col-sm-6">Number of Partners</dt>
                <dd className="col-sm-6">{business.number_of_partners}</dd>
                <dt className="col-sm-6">Involvement</dt>
                <dd className="col-sm-6">{business.involvement.join(', ')}</dd>
              </dl>
            </div>
          </div>
        </div>

        {/* Location and Premises */}
        <div className="col-md-6">
          <div className="card h-100 border-0 shadow-sm">
            <div className="card-body">
              <h2 className="card-title h4 mb-4">Location and Premises</h2>
              <dl className="row">
                <dt className="col-sm-6">Location</dt>
                <dd className="col-sm-6">{business.location}</dd>
                <dt className="col-sm-6">Address</dt>
                <dd className="col-sm-6">{business.address}</dd>
                <dt className="col-sm-6">Business Situs</dt>
                <dd className="col-sm-6">{business.business_situs}</dd>
                <dt className="col-sm-6">Ownership Type</dt>
                <dd className="col-sm-6">{business.business_situs_owner_type}</dd>
                <dt className="col-sm-6">Size</dt>
                <dd className="col-sm-6">{business.size} sq ft</dd>
              </dl>
            </div>
          </div>
        </div>

        {/* Financial Information */}
        <div className="col-md-6">
          <div className="card h-100 border-0 shadow-sm">
            <div className="card-body">
              <h2 className="card-title h4 mb-4">Financial Information</h2>
              <dl className="row">
                <dt className="col-sm-6">Price</dt>
                <dd className="col-sm-6">${business.price.toLocaleString()}</dd>
                <dt className="col-sm-6">Minimum Price</dt>
                <dd className="col-sm-6">${business.min_price.toLocaleString()}</dd>
                <dt className="col-sm-6">Includes Inventory</dt>
                <dd className="col-sm-6">{business.price_include_inventory ? 'Yes' : 'No'}</dd>
                <dt className="col-sm-6">Deposit</dt>
                <dd className="col-sm-6">${business.deposit.toLocaleString()}</dd>
                <dt className="col-sm-6">First Installment</dt>
                <dd className="col-sm-6">${business.first_installment.toLocaleString()}</dd>
                <dt className="col-sm-6">Annual Profit</dt>
                <dd className="col-sm-6">${business.profit.toLocaleString()}</dd>
                <dt className="col-sm-6">Annual Turnover</dt>
                <dd className="col-sm-6">${business.turnover.toLocaleString()}</dd>
              </dl>
            </div>
          </div>
        </div>

        {/* Operational Costs */}
        <div className="col-md-6">
          <div className="card h-100 border-0 shadow-sm">
            <div className="card-body">
              <h2 className="card-title h4 mb-4">Operational Costs</h2>
              <dl className="row">
                <dt className="col-sm-6">Rent</dt>
                <dd className="col-sm-6">${business.rent.toLocaleString()}</dd>
                <dt className="col-sm-6">Renewal Rent</dt>
                <dd className="col-sm-6">${business.renewal_rent.toLocaleString()}</dd>
                <dt className="col-sm-6">Merchandise Cost</dt>
                <dd className="col-sm-6">${business.merchandise_cost.toLocaleString()}</dd>
                <dt className="col-sm-6">Electricity Bill</dt>
                <dd className="col-sm-6">${business.electricity_bill.toLocaleString()}</dd>
                <dt className="col-sm-6">Water Bill</dt>
                <dd className="col-sm-6">${business.water_bill.toLocaleString()}</dd>
                <dt className="col-sm-6">Management Fee</dt>
                <dd className="col-sm-6">${business.management_fee.toLocaleString()}</dd>
                <dt className="col-sm-6">Air Conditioning Fee</dt>
                <dd className="col-sm-6">${business.air_conditioning_fee.toLocaleString()}</dd>
                <dt className="col-sm-6">Rates and Government Rent</dt>
                <dd className="col-sm-6">${business.rates_and_government_rent.toLocaleString()}</dd>
                <dt className="col-sm-6">Renovation and Equipment</dt>
                <dd className="col-sm-6">${business.renovation_and_equipment.toLocaleString()}</dd>
                <dt className="col-sm-6">Other Expenses</dt>
                <dd className="col-sm-6">${business.other_expense.toLocaleString()}</dd>
              </dl>
            </div>
          </div>
        </div>

        {/* Staff Information */}
        <div className="col-md-6">
          <div className="card h-100 border-0 shadow-sm">
            <div className="card-body">
              <h2 className="card-title h4 mb-4">Staff Information</h2>
              <dl className="row">
                <dt className="col-sm-6">Number of Staff</dt>
                <dd className="col-sm-6">{business.number_of_staff}</dd>
                <dt className="col-sm-6">Staff Salary</dt>
                <dd className="col-sm-6">${business.staff_salary.toLocaleString()}</dd>
                <dt className="col-sm-6">Staff Retention</dt>
                <dd className="col-sm-6">{business.staff_remain}</dd>
                <dt className="col-sm-6">MPF</dt>
                <dd className="col-sm-6">${business.mpf.toLocaleString()}</dd>
              </dl>
            </div>
          </div>
        </div>

        {/* Business Details */}
        <div className="col-md-6">
          <div className="card h-100 border-0 shadow-sm">
            <div className="card-body">
              <h2 className="card-title h4 mb-4">Business Details</h2>
              <h3 className="h6 mb-3">Main Products/Services</h3>
              <ul className="list-group list-group-flush mb-4">
                {business.main_product_service.map((product, index) => (
                  <li key={product} className="list-group-item d-flex justify-content-between align-items-center">
                    {product}
                    <span className="badge bg-primary rounded-pill">{business.main_product_service_percentage[index]}%</span>
                  </li>
                ))}
              </ul>
              <dl className="row">
                <dt className="col-sm-6">Business Hours</dt>
                <dd className="col-sm-6">{business.business_hours}</dd>
                <dt className="col-sm-6">Licenses</dt>
                <dd className="col-sm-6">{business.license.join(', ')}</dd>
              </dl>
            </div>
          </div>
        </div>

        {/* Lease Information */}
        <div className="col-md-6">
          <div className="card h-100 border-0 shadow-sm">
            <div className="card-body">
              <h2 className="card-title h4 mb-4">Lease Information</h2>
              <dl className="row">
                <dt className="col-sm-6">Lease Term</dt>
                <dd className="col-sm-6">{business.lease_term} years</dd>
                <dt className="col-sm-6">Lease Expiry</dt>
                <dd className="col-sm-6">{business.lease_expiry_date}</dd>
              </dl>
            </div>
          </div>
        </div>

        {/* Transfer Details */}
        <div className="col-md-6">
          <div className="card h-100 border-0 shadow-sm">
            <div className="card-body">
              <h2 className="card-title h4 mb-4">Transfer Details</h2>
              <dl className="row">
                <dt className="col-sm-6">Transfer Method</dt>
                <dd className="col-sm-6">{business.transfer_method.join(', ')}</dd>
                <dt className="col-sm-6">Reason for Selling</dt>
                <dd className="col-sm-6">{business.reason.join(', ')}</dd>
              </dl>
            </div>
          </div>
        </div>

        {/* Additional Information */}
        <div className="col-12">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <h2 className="card-title h4 mb-4">Additional Information</h2>
              {business.description.map((desc, index) => (
                <p key={index} className="mb-3">{desc}</p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BizDetail;
