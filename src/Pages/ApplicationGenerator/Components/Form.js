import React, { useState } from "react";

export default function Form({ formData,setFormData,setShowForm, formTitle,handleAppGen}) {
 
function onGenerateApplication(data){
    console.log(data)
handleAppGen();
    return true;
}
  const [errors, setErrors] = useState({});

  const handleCloseForm = () => {
    setShowForm(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((formData)=>({...formData, [name]: value }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.classSection) newErrors.classSection = "Class Section is required";
    if (!formData.rollNumber) newErrors.rollNumber = "Roll Number is required";
    if (!formData.phoneNumber || formData.phoneNumber.length < 10 || formData.phoneNumber.length > 15)
      newErrors.phoneNumber = "Valid Phone Number is required";
    if (!formData.recipientName || !formData.salutation)
      newErrors.recipientName = "Recipient details are required";
    if (!formData.campusName) newErrors.campus = "Campus selection is required";
    if (!formData.applicationType) newErrors.applicationType = "Application Type is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onGenerateApplication(formData);
    }
  };

  return (
    <div className="application-form">
      <button className="close-icon" onClick={handleCloseForm}>
        ×
      </button>
      <h5>{formTitle}</h5>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your name"
          />
          {errors.name && <span className="error">{errors.name}</span>}
        </div>
        <div className="form-group">
          <label>Class Section</label>
          <input
            type="text"
            name="classSection"
            value={formData.classSection}
            onChange={handleChange}
            placeholder="Enter your class section"
          />
          {errors.classSection && <span className="error">{errors.classSection}</span>}
        </div>
        <div className="form-group">
          <label>Roll Number</label>
          <input
            type="text"
            name="rollNumber"
            value={formData.rollNumber}
            onChange={handleChange}
            placeholder="Enter your roll number"
          />
          {errors.rollNumber && <span className="error">{errors.rollNumber}</span>}
        </div>
        <div className="form-group">
          <label>Phone Number</label>
          <input
            type="text"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            placeholder="Enter your phone number"
          />
          {errors.phoneNumber && <span className="error">{errors.phoneNumber}</span>}
        </div>
        <div className="form-group">
          <label>Recipient</label>
          <div className="recipient-input">
            <select
              name="salutation"
              value={formData.salutation}
              onChange={handleChange}
            >
              <option value="">Salutation</option>
              <option value="Mr.">Mr.</option>
              <option value="Ms.">Ms.</option>
              <option value="Dr.">Dr.</option>
            </select>
            <input
              type="text"
              name="recipientName"
              value={formData.recipientName}
              onChange={handleChange}
              placeholder="Enter the recipient full name"
            />
          </div>
          {errors.recipientName && <span className="error">{errors.recipientName}</span>}
        </div>
        <div className="form-group">
          <label>Select Campus</label>
          <select
            name="campusName"
            value={formData.campusName}
            onChange={handleChange}
          >
            <option value="">Campus</option>
            <option value="Main Campus">Main Campus</option>
            <option value="City Campus">City Campus</option>
          </select>
          {errors.campus && <span className="error">{errors.campus}</span>}
        </div>
        <div className="form-group">
          <label>Application Type</label>
          <select
            name="applicationType"
            value={formData.applicationType}
            onChange={handleChange}
          >
            <option value="">Select</option>
            <option value="Leave Application">Leave Application</option>
            <option value="Event Request">Event Request</option>
            <option value="Resource Request">Resource Request</option>
          </select>
          {errors.applicationType && <span className="error">{errors.applicationType}</span>}
        </div>
        <button type="submit" className="btn" onClick={handleSubmit}>Generate Application</button>
      </form>
    </div>
  );
}
