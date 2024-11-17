"use client";

import '../../globals.css'
import React, { useState, useCallback, useEffect } from "react";
import { BuyerFormIfc } from "../../types/ifc";
import { DEFAULT_STRINGS, DEFAULT_NUMBERS, OPTIONS } from "../../types/const";
import Cookies from 'js-cookie';

const initialFormData: BuyerFormIfc = {
  client_name: DEFAULT_STRINGS.CLIENT_NAME,
  mobile: DEFAULT_STRINGS.MOBILE,
  email: DEFAULT_STRINGS.EMAIL,
  meeting_location: DEFAULT_STRINGS.MEETING_LOCATION,
  contact_method: [],
  ref_id: [],
  capital: DEFAULT_NUMBERS.PRICE,
  involvement: [],
  description: [],
};

const BuyerFormComponent: React.FC = () => {
  const [formData, setFormData] = useState<BuyerFormIfc>(initialFormData);

  const updateFormWithFavorites = useCallback(() => {
    const favoritesString = Cookies.get('favorites');
    if (favoritesString) {
      const favorites = JSON.parse(favoritesString);
      if (Array.isArray(favorites) && favorites.length > 0) {
        setFormData(prevData => ({
          ...prevData,
          ref_id: favorites,
          description: [`Interested in businesses: ${favorites.join(', ')}`],
        }));
      } else {
        // Reset ref_id and description if no favorites
        setFormData(prevData => ({
          ...prevData,
          ref_id: [],
          description: [],
        }));
      }
    } else {
      // Reset ref_id and description if no favorites cookie
      setFormData(prevData => ({
        ...prevData,
        ref_id: [],
        description: [],
      }));
    }
  }, []);
  
  useEffect(() => {
    updateFormWithFavorites();

    // Set up an interval to check for changes in the favorites cookie
    const intervalId = setInterval(updateFormWithFavorites, 1000); // Check every second

    // Clean up the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, [updateFormWithFavorites]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value, type } = e.target;

      setFormData((prev) => {
        if (type === "checkbox") {
          const checked = (e.target as HTMLInputElement).checked;
          const arrayField = prev[name as keyof BuyerFormIfc] as string[];
          return {
            ...prev,
            [name]: checked
              ? [...arrayField, value]
              : arrayField.filter((item) => item !== value),
          };
        }

        if (name === "capital") {
          return { ...prev, [name]: Number(value) || 0 };
        }

        if (name === "ref_id") {
          return {
            ...prev,
            [name]: value.split(",").map((item) => item.trim()),
          };
        }

        if (name === "description") {
          return { ...prev, [name]: value.split("\n") };
        }

        return { ...prev, [name]: value };
      });
    },
    []
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      try {
        const response = await fetch("/api/buyer", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        if (response.ok) {
          alert("Buyer form submitted successfully!");
          setFormData(initialFormData); // Reset form
        } else {
          throw new Error("Failed to submit form");
        }
      } catch (error) {
        console.error("Error submitting form:", error);
        alert("Failed to submit form. Please try again.");
      }
    },
    [formData]
  );

  return (
    <div className="container mt-5">
      <h2 className="mb-4 text-center">Buyer Information Form</h2>
      <form onSubmit={handleSubmit} className="bg-light p-4 rounded shadow">
        <div className="mt-3">
          <label htmlFor="ref_id" className="form-label">
            Reference IDs
          </label>
          <input
            type="text"
            className="form-control"
            id="ref_id"
            name="ref_id"
            value={formData.ref_id.join(", ")}
            onChange={handleChange}
            placeholder="Enter comma-separated values"
          />
        </div>
        <div className="row g-3 mt-2">
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
              required
            />
          </div>
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
              required
            />
          </div>
        </div>

        <div className="row g-3 mt-2">
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
              required
            />
          </div>
          <div className="col-md-6">
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

        <div className="mt-3">
          <label className="form-label">Contact Method</label>
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
                <label
                  className="form-check-label"
                  htmlFor={`contact_method_${method}`}
                >
                  {method}
                </label>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-3">
          <label htmlFor="capital" className="form-label">
            Capital
          </label>
          <div className="input-group">
            <span className="input-group-text">$</span>
            <input
              type="number"
              className="form-control"
              id="capital"
              name="capital"
              value={formData.capital}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="mt-3">
          <label className="form-label">Involvement</label>
          <div className="d-flex flex-wrap gap-3">
            {OPTIONS.INVOLVEMENT.map((time) => (
              <div key={time} className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id={`involvement_${time}`}
                  name="involvement"
                  value={time}
                  checked={formData.involvement.includes(time)}
                  onChange={handleChange}
                />
                <label
                  className="form-check-label"
                  htmlFor={`involvement_${time}`}
                >
                  {time}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-3">
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
            placeholder="Enter any additional information here..."
          />
        </div>

        <div className="mt-4 text-center">
          <button type="submit" className="btn btn-primary btn-lg">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default BuyerFormComponent;
