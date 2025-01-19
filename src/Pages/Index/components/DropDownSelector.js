import React from "react";

const DropdownSelector = ({ label, options, onSelect }) => {
  return (
    <div className="dropdown-selector">
      <label>{label}</label>
      <select className="form-select" onChange={(e) => onSelect(e.target.value)}>
        <option value="">-- Select --</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
};

export default DropdownSelector;
