"use client";

import '../../globals.css'
import React, { useState } from "react";
import { SellerFormIfc } from "../../types/ifc";
import { DEFAULT_STRINGS, DEFAULT_NUMBERS, OPTIONS } from '../../types/const';
import CheckboxGroup from "../../components/CheckboxGroup";

const SellerFormComponent: React.FC = () => {
  const [formData, setFormData] = useState<SellerFormIfc>({
    business_name: DEFAULT_STRINGS.BUSINESS_NAME,
    industry: [],
    location: "",
    address: DEFAULT_STRINGS.ADDRESS,
    size: DEFAULT_NUMBERS.SIZE,
    price: DEFAULT_NUMBERS.PRICE,
    profit: DEFAULT_NUMBERS.PROFIT,
    expense: DEFAULT_NUMBERS.OTHER_EXPENSE,
    turnover: DEFAULT_NUMBERS.TURNOVER,
    license: [],
    transfer_method: [],
    reason: [],
    client_name: DEFAULT_STRINGS.CLIENT_NAME,
    mobile: DEFAULT_STRINGS.MOBILE,
    email: DEFAULT_STRINGS.EMAIL,
    meeting_location: DEFAULT_STRINGS.MEETING_LOCATION,
    contact_method: [],
    description: [],
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;

    const arrayFields: (keyof SellerFormIfc)[] = [
      "industry",
      "license",
      "transfer_method",
      "reason",
      "contact_method",
      "description",
    ];

    if (type === "checkbox" && arrayFields.includes(name as keyof SellerFormIfc)) {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({
        ...prev,
        [name]: checked
          ? [...(prev[name as keyof SellerFormIfc] as string[]), value]
          : (prev[name as keyof SellerFormIfc] as string[]).filter(
            (item) => item !== value
          ),
      }));
    } else if (
      ["price", "profit", "expense", "turnover"].includes(name)
    ) {
      setFormData((prev) => ({ ...prev, [name]: Number(value) }));
    } else if (arrayFields.includes(name as keyof SellerFormIfc)) {
      setFormData((prev) => ({
        ...prev,
        [name]: value.split(",").map((item) => item.trim()),
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/seller", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        alert("Seller form submitted successfully!");
        // Reset form or redirect
      } else {
        throw new Error("Failed to submit form");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Failed to submit form. Please try again.");
    }
  };

  return (
    <div className="container-fluid py-5">
      <div className="container">
        <h2 className="mb-5 text-center">Sell Your Business</h2>
        <form onSubmit={handleSubmit} className="bg-light p-4 rounded-lg shadow-lg">

          {/* Business Information */}<div className="mb-5">
            <h4 className="mb-4 pb-2 border-bottom">Business Information</h4>
            <div className="row g-4">
              <div className="col-md-6">
                <div className="mb-3">
                  <label htmlFor="business_name" className="form-label">Business Name</label>
                  <input
                    type="text"
                    className="form-control"
                    id="business_name"
                    name="business_name"
                    value={formData.business_name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="location" className="form-label">Location</label>
                  <select
                    className="form-select"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select location</option>
                    {OPTIONS.LOCATION.map((loc) => (
                      <option key={loc} value={loc}>{loc}</option>
                    ))}
                  </select>
                </div>
                <div className="mb-3">
                  <label htmlFor="address" className="form-label">Address</label>
                  <input
                    type="text"
                    className="form-control"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-3">
                  <CheckboxGroup
                    label="Industry"
                    name="industry"
                    options={OPTIONS.INDUSTRY}
                    selectedOptions={formData.industry}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-3">
                  <CheckboxGroup
                    label="License"
                    name="license"
                    options={OPTIONS.LICENSE}
                    selectedOptions={formData.license}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
          </div>


          {/* Financial Information */}
          <div className="mb-5">
            <h4 className="mb-4 pb-2 border-bottom">Financial Information</h4>
            <div className="row g-4">
              <div className="col-md-6">
                <div className="mb-3">
                  <label htmlFor="price" className="form-label">Price (HKD)</label>
                  <div className="input-group">
                    <span className="input-group-text">$</span>
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
                <div className="mb-3">
                  <label htmlFor="profit" className="form-label">Annual Profit (HKD)</label>
                  <div className="input-group">
                    <span className="input-group-text">$</span>
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
                <div className="mb-3">
                  <label htmlFor="expense" className="form-label">Monthly Expenses (HKD)</label>
                  <div className="input-group">
                    <span className="input-group-text">$</span>
                    <input
                      type="number"
                      className="form-control"
                      id="expense"
                      name="expense"
                      value={formData.expense}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-3">
                  <label htmlFor="turnover" className="form-label">Annual Turnover (HKD)</label>
                  <div className="input-group">
                    <span className="input-group-text">$</span>
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
                <div className="mb-3">
                  <label htmlFor="size" className="form-label">Size (sq ft)</label>
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
            </div>
          </div>


          {/* Transfer Information */}
          <div className="mb-5">
            <h4 className="mb-4 pb-2 border-bottom">Transfer Information</h4>
            <div className="row g-4">
              <div className="col-md-6">
                <div className="mb-3">
                  <CheckboxGroup
                    label="Transfer Method"
                    name="transfer_method"
                    options={OPTIONS.TRANSFER_METHOD}
                    selectedOptions={formData.transfer_method}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-3">
                  <CheckboxGroup
                    label="Reason for Selling"
                    name="reason"
                    options={OPTIONS.REASON}
                    selectedOptions={formData.reason}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
          </div>


          {/* Seller Contact Information */}
          <div className="mb-5">
            <h4 className="mb-4 pb-2 border-bottom">Seller Contact Information</h4>
            <div className="row g-3">
              <div className="col-md-6">
                <label htmlFor="client_name" className="form-label">Client Name</label>
                <input
                  type="text"
                  className="form-control"
                  id="client_name"
                  name="client_name"
                  value={formData.client_name}
                  onChange={handleChange}
                />
              </div>
              <div className="col-md-6">
                <label htmlFor="mobile" className="form-label">Mobile</label>
                <input
                  type="text"
                  className="form-control"
                  id="mobile"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="row g-3 mt-2">
              <div className="col-md-6">
                <label htmlFor="email" className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              <div className="col-md-6">
                <label htmlFor="meeting_location" className="form-label">Preferred Meeting Location</label>
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

            <div className="mt-3">
              <label className="form-label">Preferred Contact Method</label>
              <div className="d-flex flex-wrap gap-3">
                {OPTIONS.CONTACT_METHOD.map((method) => (
                  <div key={method} className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id={`contact_method_${method}`}
                      name="contact_method"
                      value={method}
                      checked={formData.contact_method.includes(method)}
                      onChange={handleChange}
                    />
                    <label className="form-check-label" htmlFor={`contact_method_${method}`}>
                      {method}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="mb-5">
            <h4 className="mb-4 pb-2 border-bottom">Additional Information</h4>
            <div>
              <label htmlFor="description" className="form-label">Business Description</label>
              <textarea
                className="form-control"
                id="description"
                name="description"
                value={formData.description.join('\n')}
                onChange={handleChange}
                rows={5}
                placeholder="Please provide any additional details about your business that potential buyers should know..."
              />
            </div>
          </div>

          <div className="mt-4 text-center">
            <button type="submit" className="btn btn-primary btn-lg px-5 py-3">
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SellerFormComponent;