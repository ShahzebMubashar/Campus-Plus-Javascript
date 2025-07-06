import React, { useState } from "react";
import templateData from "../emails.json";

const EmailForm = ({
  teachers,
  formData,
  setFormData,
  onGenEmail,
  setShowEmailForm,
}) => {
  const [errors, setErrors] = useState({});
  const [showTooltip, setShowTooltip] = useState(false);
  let emailTypes = [];
  for (let key in templateData.templates) {
    emailTypes.push(key);
  }

  // Manual validation function
  function validate(values) {
    const errs = {};
    if (!values.userName) errs.userName = "Name is required";
    if (!values.classSection) errs.classSection = "Class Section is required";
    if (!values.rollNumber) {
      errs.rollNumber = "Roll Number is required";
    } else {
      // Accepts 22L1234 or 22L-1234 (case-insensitive)
      const rollPattern = /^\d{2}[LIPMF]\d{4}$/i;
      const rollPatternDash = /^\d{2}[LIPMF]-\d{4}$/i;
      if (!rollPattern.test(values.rollNumber) && !rollPatternDash.test(values.rollNumber)) {
        errs.rollNumber = "Roll Number Format: 22L1234 or 22L-1234";
      }
    }
    if (!values.selectedTeacher) errs.selectedTeacher = "Teacher is required";
    if (values.selectedTeacher === "Other") {
      if (!values.customTeacher) errs.customTeacher = "Teacher's name is required";
      if (!values.teacherSalutation) errs.teacherSalutation = "Salutation is required";
    }
    if (!values.emailType) errs.emailType = "Email Type is required";
    return errs;
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    const errs = validate(formData);
    setErrors(errs);
    if (Object.keys(errs).length === 0) {
      onGenEmail();
    } else {
      setShowTooltip(true);
      setTimeout(() => setShowTooltip(false), 2000);
    }
  }

  return (
    <div className="email-form">
      <button className="close-icon" onClick={() => setShowEmailForm(false)}>
        ✖
      </button>
      <h5>Email Form</h5>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Name</label>
          <input
            type="text"
            name="userName"
            value={formData.userName}
            onChange={handleChange}
            placeholder="Enter your name"
          />
          {errors.userName && <span className="error">{errors.userName}</span>}
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
          <label>Teacher</label>
          <select
            name="selectedTeacher"
            value={formData.selectedTeacher}
            onChange={handleChange}
          >
            <option value="">Select Teacher</option>
            {teachers.map((teacher) => (
              <option key={teacher.name} value={teacher.name}>
                {teacher.name}
              </option>
            ))}
            <option value="Other">Other</option>
          </select>
          {errors.selectedTeacher && <span className="error">{errors.selectedTeacher}</span>}
          {formData.selectedTeacher === "Other" && (
            <div className="custom-teacher">
              <input
                type="text"
                name="customTeacher"
                value={formData.customTeacher}
                onChange={handleChange}
                placeholder="Enter teacher's name"
              />
              {errors.customTeacher && <span className="error">{errors.customTeacher}</span>}
              <select
                name="teacherSalutation"
                value={formData.teacherSalutation}
                onChange={handleChange}
              >
                <option value="">Salutation</option>
                <option value="Dr.">Dr.</option>
                <option value="Mr.">Mr.</option>
                <option value="Ms.">Ms.</option>
              </select>
              {errors.teacherSalutation && <span className="error">{errors.teacherSalutation}</span>}
            </div>
          )}
        </div>
        <div className="form-group">
          <label>Email Type</label>
          <select
            name="emailType"
            value={formData.emailType}
            onChange={handleChange}
          >
            <option value="">Select Email Type</option>
            {emailTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          {errors.emailType && <span className="error">{errors.emailType}</span>}
        </div>
        <div
          style={{
            position: "relative",
            display: "inline-block",
            width: "100%",
          }}
        >
          <button
            type="submit"
            className="btn submit-btn-with-tooltip"
            disabled={false}
            onMouseEnter={() => {
              if (Object.keys(errors).length > 0) setShowTooltip(true);
            }}
            onMouseLeave={() => setShowTooltip(false)}
          >
            Submit
          </button>
          {Object.keys(errors).length > 0 && showTooltip && (
            <div className="submit-tooltip">
              You cannot submit until you fill the form correctly.
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

export default EmailForm;
