import React, { useState, useEffect } from "react";
import { AdminFormIfc } from "../types/ifc";
import {
  DEFAULT_STRINGS,
  DEFAULT_NUMBERS,
  DEFAULT_DATES,
  DEFAULT_OPTIONS,
  OPTIONS,
} from "../types/const";
import CheckboxGroup from "../components/CheckboxGroup";

interface AdminFormProps {
  onSubmit: (formData: AdminFormIfc) => void;
  onCancel: () => void;
  initialData?: AdminFormIfc | null;
}

const AdminFormComponent: React.FC<AdminFormProps> = ({
  onSubmit,
  onCancel,
  initialData
}) => {
  const [formData, setFormData] = useState<AdminFormIfc>(initialData || {
    availability: DEFAULT_OPTIONS.AVAILABILITY,
    business_name: DEFAULT_STRINGS.BUSINESS_NAME,
    title: DEFAULT_STRINGS.TITLE,
    business_type: DEFAULT_OPTIONS.BUSINESS_TYPE,
    industry: [DEFAULT_OPTIONS.INDUSTRY],
    label: [DEFAULT_OPTIONS.LABEL],
    foundation_date: DEFAULT_DATES.FOUNDATION,
    number_of_partners: DEFAULT_NUMBERS.NUMBER_OF_PARTNERS,
    location: DEFAULT_OPTIONS.LOCATION,
    address: DEFAULT_STRINGS.ADDRESS,
    business_situs: DEFAULT_OPTIONS.BUSINESS_SITUS,
    business_situs_owner_type: DEFAULT_OPTIONS.BUSINESS_SITUS_OWNER_TYPE,
    size: DEFAULT_NUMBERS.SIZE,
    price: DEFAULT_NUMBERS.PRICE,
    min_price: DEFAULT_NUMBERS.MIN_PRICE,
    price_include_inventory: false,
    deposit: DEFAULT_NUMBERS.DEPOSIT,
    first_installment: DEFAULT_NUMBERS.FIRST_INSTALLMENT,
    profit: DEFAULT_NUMBERS.PROFIT,
    turnover: DEFAULT_NUMBERS.TURNOVER,
    rent: DEFAULT_NUMBERS.RENT,
    renewal_rent: DEFAULT_NUMBERS.RENEWAL_RENT,
    merchandise_cost: DEFAULT_NUMBERS.MERCHANDISE_COST,
    electricity_bill: DEFAULT_NUMBERS.ELECTRICITY_BILL,
    water_bill: DEFAULT_NUMBERS.WATER_BILL,
    management_fee: DEFAULT_NUMBERS.MANAGEMENT_FEE,
    air_conditioning_fee: DEFAULT_NUMBERS.AIR_CONDITIONING_FEE,
    rates_and_government_rent: DEFAULT_NUMBERS.RATES_AND_GOVERNMENT_RENT,
    renovation_and_equipment: DEFAULT_NUMBERS.RENOVATION_AND_EQUIPMENT,
    other_expense: DEFAULT_NUMBERS.OTHER_EXPENSE,
    number_of_staff: DEFAULT_NUMBERS.NUMBER_OF_STAFF,
    staff_salary: DEFAULT_NUMBERS.STAFF_SALARY,
    staff_remain: DEFAULT_OPTIONS.STAFF_REMAIN,
    mpf: DEFAULT_NUMBERS.MPF,
    main_product_service: ["Food"],
    main_product_service_percentage: [80],
    business_hours: DEFAULT_STRINGS.BUSINESS_HOURS,
    license: [DEFAULT_OPTIONS.LICENSE],
    lease_term: DEFAULT_NUMBERS.LEASE_TERM,
    lease_expiry_date: DEFAULT_DATES.LEASE_EXPIRY,
    transfer_method: [DEFAULT_OPTIONS.TRANSFER_METHOD],
    reason: [DEFAULT_OPTIONS.REASON],
    involvement: [DEFAULT_OPTIONS.INVOLVEMENT],
    agent: DEFAULT_OPTIONS.AGENT,
    client_name: DEFAULT_STRINGS.CLIENT_NAME,
    mobile: DEFAULT_STRINGS.MOBILE,
    email: DEFAULT_STRINGS.EMAIL,
    meeting_location: DEFAULT_STRINGS.MEETING_LOCATION,
    description: ["NA"],
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;

    setFormData((prev) => {
      // Handle checkbox inputs
      if (type === "checkbox") {
        const checked = (e.target as HTMLInputElement).checked;

        // Special case for price_include_inventory (single checkbox)
        if (name === "price_include_inventory") {
          return { ...prev, [name]: checked };
        }

        // Handle checkbox groups (like industry)
        const arrayField = prev[name as keyof AdminFormIfc] as string[];
        return {
          ...prev,
          [name]: checked
            ? [...arrayField, value]
            : arrayField.filter((item) => item !== value),
        };
      }

      // Handle number inputs
      if (type === "number") {
        return { ...prev, [name]: Number(value) || 0 };
      }

      // Handle specific fields that should be stored as arrays
      if (
        [
          "main_product_service",
          "main_product_service_percentage",
          "description",
        ].includes(name)
      ) {
        return { ...prev, [name]: value.split("\n") };
      }

      // Handle all other input types
      return { ...prev, [name]: value };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Admin Form</h2>
      <form onSubmit={handleSubmit} className="bg-light p-4 rounded shadow">
        <div className="row mb-3">
          <div className="col-md-6">
            <label htmlFor="business_name" className="form-label">
              Business Name
            </label>
            <input
              type="text"
              className="form-control"
              id="business_name"
              name="business_name"
              value={formData.business_name}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-6">
            <label htmlFor="title" className="form-label">
              Title
            </label>
            <input
              type="text"
              className="form-control"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="row mb-3">

          <div className="col-md-2">
            <label htmlFor="availability" className="form-label">
              Availability
            </label>
            <select
              className="form-select"
              id="availability"
              name="availability"
              value={formData.availability}
              onChange={handleChange}
            >
              <option value="">Select availability</option>
              {OPTIONS.AVAILABILITY.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-4">
            <label htmlFor="business_type" className="form-label">
              Business Type
            </label>
            <select
              className="form-select"
              id="business_type"
              name="business_type"
              value={formData.business_type}
              onChange={handleChange}
            >
              <option value="">Select Business Type</option>
              {OPTIONS.BUSINESS_TYPE.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-3">
            <CheckboxGroup
              label="Industry"
              name="industry"
              options={OPTIONS.INDUSTRY}
              selectedOptions={formData.industry}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-3">
            <CheckboxGroup
              label="Label"
              name="label"
              options={OPTIONS.LABEL}
              selectedOptions={formData.label}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="row mb-3">
          <div className="col-md-6">
            <label htmlFor="foundation_date" className="form-label">
              Foundation Date
            </label>
            <input
              type="date"
              className="form-control"
              id="foundation_date"
              name="foundation_date"
              value={formData.foundation_date}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-6">
            <label htmlFor="number_of_partners" className="form-label">
              Number of Partners
            </label>
            <input
              type="number"
              className="form-control"
              id="number_of_partners"
              name="number_of_partners"
              value={formData.number_of_partners}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="row mb-3">
          <div className="col-md-6">
            <label htmlFor="location" className="form-label">
              Location
            </label>
            <select
              className="form-select"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
            >
              <option value="">Select Location</option>
              {OPTIONS.LOCATION.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-6">
            <label htmlFor="address" className="form-label">
              Address
            </label>
            <textarea
              className="form-control"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              rows={3}
            ></textarea>
          </div>
        </div>

        <div className="row mb-3">
          <div className="col-md-6">
            <label htmlFor="business_situs" className="form-label">
              Business Situs
            </label>
            <select
              className="form-select"
              id="business_situs"
              name="business_situs"
              value={formData.business_situs}
              onChange={handleChange}
            >
              <option value="">Select Business Situs</option>
              {OPTIONS.BUSINESS_SITUS.map((situs) => (
                <option key={situs} value={situs}>
                  {situs}
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-6">
            <label htmlFor="business_situs_owner_type" className="form-label">
              Business Situs Owner Type
            </label>
            <select
              className="form-select"
              id="business_situs_owner_type"
              name="business_situs_owner_type"
              value={formData.business_situs_owner_type}
              onChange={handleChange}
            >
              <option value="">Select Owner Type</option>
              {OPTIONS.BUSINESS_SITUS_OWNER_TYPE.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Financial Information */}
        <h4 className="mt-4 mb-3">Financial Information</h4>
        <div className="row mb-3">
          <div className="col-md-3">
            <label htmlFor="price" className="form-label">
              Price (HKD)
            </label>
            <div className="input-group">
              <div className="input-group-prepend">
                <span className="input-group-text">$</span>
              </div>
              <input
                type="number"
                className="form-control"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="col-md-3">
            <label htmlFor="Min price" className="form-label">
              Min Price (HKD)
            </label>
            <div className="input-group">
              <div className="input-group-prepend">
                <span className="input-group-text">$</span>
              </div>
              <input
                type="number"
                className="form-control"
                id="min_price"
                name="min_price"
                value={formData.min_price}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="col-md-2">
            <div className="form-check mt-4">
              <input
                className="form-check-input"
                type="checkbox"
                id="price_include_inventory"
                name="price_include_inventory"
                checked={!!formData.price_include_inventory}
                onChange={handleChange}
              />
              <label
                className="form-check-label"
                htmlFor="price_include_inventory"
              >
                Price Includes Inventory
              </label>
            </div>
          </div>
          <div className="col-md-4">
            <label htmlFor="size" className="form-label">
              Size (sq ft)
            </label>
            <input
              type="number"
              className="form-control"
              id="size"
              name="size"
              value={formData.size}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="row mb-3">
          <div className="col-md-4">
            <label htmlFor="deposit" className="form-label">
              Deposit (HKD)
            </label>
            <div className="input-group">
              <div className="input-group-prepend">
                <span className="input-group-text">$</span>
              </div>
              <input
                type="number"
                className="form-control"
                id="deposit"
                name="deposit"
                value={formData.deposit}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="col-md-4">
            <label htmlFor="first_installment" className="form-label">
              First Installment (HKD)
            </label>
            <div className="input-group">
              <div className="input-group-prepend">
                <span className="input-group-text">$</span>
              </div>
              <input
                type="number"
                className="form-control"
                id="first_installment"
                name="first_installment"
                value={formData.first_installment}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="col-md-4">
            <label htmlFor="profit" className="form-label">
              Profit (HKD)
            </label>
            <div className="input-group">
              <div className="input-group-prepend">
                <span className="input-group-text">$</span>
              </div>
              <input
                type="number"
                className="form-control"
                id="profit"
                name="profit"
                value={formData.profit}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        <div className="row mb-3">
          <div className="col-md-4">
            <label htmlFor="turnover" className="form-label">
              Turnover (HKD)
            </label>
            <div className="input-group">
              <div className="input-group-prepend">
                <span className="input-group-text">$</span>
              </div>
              <input
                type="number"
                className="form-control"
                id="turnover"
                name="turnover"
                value={formData.turnover}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="col-md-4">
            <label htmlFor="rent" className="form-label">
              Rent (HKD)
            </label>
            <div className="input-group">
              <div className="input-group-prepend">
                <span className="input-group-text">$</span>
              </div>
              <input
                type="number"
                className="form-control"
                id="rent"
                name="rent"
                value={formData.rent}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="col-md-4">
            <label htmlFor="renewal_rent" className="form-label">
              Renewal Rent (HKD)
            </label>
            <div className="input-group">
              <div className="input-group-prepend">
                <span className="input-group-text">$</span>
              </div>
              <input
                type="number"
                className="form-control"
                id="renewal_rent"
                name="renewal_rent"
                value={formData.renewal_rent}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        {/* Operational Costs */}
        <h4 className="mt-4 mb-3">Operational Costs</h4>
        <div className="row mb-3">
          <div className="col-md-4">
            <label htmlFor="merchandise_cost" className="form-label">
              Merchandise Cost (HKD)
            </label>
            <div className="input-group">
              <div className="input-group-prepend">
                <span className="input-group-text">$</span>
              </div>
              <input
                type="number"
                className="form-control"
                id="merchandise_cost"
                name="merchandise_cost"
                value={formData.merchandise_cost}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="col-md-4">
            <label htmlFor="electricity_bill" className="form-label">
              Electricity Bill (HKD)
            </label>
            <div className="input-group">
              <div className="input-group-prepend">
                <span className="input-group-text">$</span>
              </div>
              <input
                type="number"
                className="form-control"
                id="electricity_bill"
                name="electricity_bill"
                value={formData.electricity_bill}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="col-md-4">
            <label htmlFor="water_bill" className="form-label">
              Water Bill (HKD)
            </label>
            <div className="input-group">
              <div className="input-group-prepend">
                <span className="input-group-text">$</span>
              </div>
              <input
                type="number"
                className="form-control"
                id="water_bill"
                name="water_bill"
                value={formData.water_bill}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>
        <div className="row mb-3">
          <div className="col-md-4">
            <label htmlFor="management_fee" className="form-label">
              Management Fee (HKD)
            </label>
            <div className="input-group">
              <div className="input-group-prepend">
                <span className="input-group-text">$</span>
              </div>
              <input
                type="number"
                className="form-control"
                id="management_fee"
                name="management_fee"
                value={formData.management_fee}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="col-md-4">
            <label htmlFor="air_conditioning_fee" className="form-label">
              Air Conditioning Fee (HKD)
            </label>
            <div className="input-group">
              <div className="input-group-prepend">
                <span className="input-group-text">$</span>
              </div>
              <input
                type="number"
                className="form-control"
                id="air_conditioning_fee"
                name="air_conditioning_fee"
                value={formData.air_conditioning_fee}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="col-md-4">
            <label htmlFor="rates_and_government_rent" className="form-label">
              Rates and Government Rent (HKD)
            </label>
            <div className="input-group">
              <div className="input-group-prepend">
                <span className="input-group-text">$</span>
              </div>
              <input
                type="number"
                className="form-control"
                id="rates_and_government_rent"
                name="rates_and_government_rent"
                value={formData.rates_and_government_rent}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        <div className="row mb-3">
          <div className="col-md-6">
            <label htmlFor="renovation_and_equipment" className="form-label">
              Renovation and Equipment (HKD)
            </label>
            <div className="input-group">
              <div className="input-group-prepend">
                <span className="input-group-text">$</span>
              </div>
              <input
                type="number"
                className="form-control"
                id="renovation_and_equipment"
                name="renovation_and_equipment"
                value={formData.renovation_and_equipment}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="col-md-6">
            <label htmlFor="other_expense" className="form-label">
              Other Expenses (HKD)
            </label>
            <div className="input-group">
              <div className="input-group-prepend">
                <span className="input-group-text">$</span>
              </div>
              <input
                type="number"
                className="form-control"
                id="other_expense"
                name="other_expense"
                value={formData.other_expense}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        {/* Staff Information */}
        <h4 className="mt-4 mb-3">Staff Information</h4>
        <div className="row mb-3">
          <div className="col-md-4">
            <label htmlFor="number_of_staff" className="form-label">
              Number of Staff
            </label>
            <input
              type="number"
              className="form-control"
              id="number_of_staff"
              name="number_of_staff"
              value={formData.number_of_staff}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-4">
            <label htmlFor="staff_salary" className="form-label">
              Staff Salary (HKD)
            </label>
            <input
              type="number"
              className="form-control"
              id="staff_salary"
              name="staff_salary"
              value={formData.staff_salary}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-4">
            <label htmlFor="mpf" className="form-label">
              MPF (HKD)
            </label>
            <input
              type="number"
              className="form-control"
              id="mpf"
              name="mpf"
              value={formData.mpf}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="row mb-3">
          <div className="col-md-12">
            <label className="form-label">Staff Remain</label>
            <div>
              {OPTIONS.STAFF_REMAIN.map((option) => (
                <div key={option} className="form-check form-check-inline">
                  <input
                    className="form-check-input"
                    type="radio"
                    id={`staff_remain_${option}`}
                    name="staff_remain"
                    value={option}
                    checked={formData.staff_remain === option}
                    onChange={handleChange}
                  />
                  <label
                    className="form-check-label"
                    htmlFor={`staff_remain_${option}`}
                  >
                    {option}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Business Details */}
        <h4 className="mt-4 mb-3">Business Details</h4>
        <div className="row mb-3">
          <div className="col-md-6">
            <label htmlFor="main_product_service" className="form-label">
              Main Products/Services
            </label>
            <textarea
              className="form-control"
              id="main_product_service"
              name="main_product_service"
              value={formData.main_product_service.join("\n")}
              onChange={handleChange}
              rows={3}
            ></textarea>
          </div>
          <div className="col-md-6">
            <label
              htmlFor="main_product_service_percentage"
              className="form-label"
            >
              Main Products/Services Percentage
            </label>
            <textarea
              className="form-control"
              id="main_product_service_percentage"
              name="main_product_service_percentage"
              value={formData.main_product_service_percentage.join("\n")}
              onChange={handleChange}
              rows={3}
            ></textarea>
          </div>
        </div>

        <div className="row mb-3">
          <div className="col-md-6">
            <label htmlFor="business_hours" className="form-label">
              Business Hours
            </label>
            <input
              type="text"
              className="form-control"
              id="business_hours"
              name="business_hours"
              value={formData.business_hours}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-6">
            <CheckboxGroup
              label="License"
              name="license"
              options={OPTIONS.LICENSE}
              selectedOptions={formData.license}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Lease Information */}
        <h4 className="mt-4 mb-3">Lease Information</h4>
        <div className="row mb-3">
          <div className="col-md-6">
            <label htmlFor="lease_term" className="form-label">
              Lease Term (months)
            </label>
            <input
              type="number"
              className="form-control"
              id="lease_term"
              name="lease_term"
              value={formData.lease_term}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-6">
            <label htmlFor="lease_expiry_date" className="form-label">
              Lease Expiry Date
            </label>
            <input
              type="date"
              className="form-control"
              id="lease_expiry_date"
              name="lease_expiry_date"
              value={formData.lease_expiry_date}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Transfer Details */}
        <h4 className="mt-4 mb-3">Transfer Details</h4>
        <div className="row mb-3">
          <div className="col-md-4">
            <CheckboxGroup
              label="Transfer Method"
              name="transfer_method"
              options={OPTIONS.TRANSFER_METHOD}
              selectedOptions={formData.transfer_method}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-4">
            <CheckboxGroup
              label="Reason for Selling"
              name="reason"
              options={OPTIONS.REASON}
              selectedOptions={formData.reason}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-4">
            <CheckboxGroup
              label="Involvement"
              name="involvement"
              options={OPTIONS.INVOLVEMENT}
              selectedOptions={formData.involvement}
              onChange={handleChange}
            />
          </div>
        </div>
        {/* Contact Information */}
        <h4 className="mt-4 mb-3">Contact Information</h4>
        <div className="row mb-3">
          <div className="col-md-6">
            <label htmlFor="agent" className="form-label">
              Agent
            </label>
            <select
              className="form-select"
              id="agent"
              name="agent"
              value={formData.agent}
              onChange={handleChange}
            >
              {OPTIONS.AGENT.map((agent) => (
                <option key={agent} value={agent}>
                  {agent}
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-6">
            <label htmlFor="client_name" className="form-label">
              Client Name
            </label>
            <input
              type="text"
              className="form-control"
              id="client_name"
              name="client_name"
              value={formData.client_name}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="row mb-3">
          <div className="col-md-6">
            <label htmlFor="mobile" className="form-label">
              Mobile
            </label>
            <input
              type="text"
              className="form-control"
              id="mobile"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-6">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              type="email"
              className="form-control"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="row mb-3">
          <div className="col-md-12">
            <label htmlFor="meeting_location" className="form-label">
              Meeting Location
            </label>
            <input
              type="text"
              className="form-control"
              id="meeting_location"
              name="meeting_location"
              value={formData.meeting_location}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Additional Information */}
        <h4 className="mt-4 mb-3">Additional Information</h4>
        <div className="row mb-3">
          <div className="col-md-12">
            <label htmlFor="description" className="form-label">
              Description
            </label>
            <textarea
              className="form-control"
              id="description"
              name="description"
              value={formData.description.join("\n")}
              onChange={handleChange}
              rows={5}
            ></textarea>
          </div>
        </div>

        <div className="text-center">
          <button type="submit" className="btn btn-primary me-2">{initialData ? 'Update' : 'Create'}</button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onCancel}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminFormComponent;
