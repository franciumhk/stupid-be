import React, { useState } from 'react';

interface CheckboxGroupProps {
  label: string;
  name: string;
  options: string[];
  selectedOptions: string[];
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
}

const CheckboxGroup: React.FC<CheckboxGroupProps> = ({
  label,
  name,
  options,
  selectedOptions,
  onChange,
  error,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const showSearch = options.length > 5;

  const filteredOptions = showSearch
    ? options.filter(option => 
        option.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : options;

  return (
    <fieldset className="checkbox-group">
      <legend className="form-label">{label}</legend>
      {showSearch && (
        <input
          type="text"
          className="form-control mb-2"
          placeholder="Search options..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      )}
      <div className="border rounded p-3 checkbox-group-container">
        {filteredOptions.map((option) => (
          <div key={option} className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              id={`${name}-${option}`}
              name={name}
              value={option}
              checked={selectedOptions.includes(option)}
              onChange={onChange}
            />
            <label className="form-check-label" htmlFor={`${name}-${option}`}>
              {option}
            </label>
          </div>
        ))}
      </div>
      {error && <div className="text-danger mt-1">{error}</div>}
    </fieldset>
  );
};

export default CheckboxGroup;
