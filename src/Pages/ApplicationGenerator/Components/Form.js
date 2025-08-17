import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import templateData from "../check.json";

const validationSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  classSection: Yup.string().required("Class Section is required"),
  rollNumber: Yup.string().required("Roll Number is required"),
  phoneNumber: Yup.string()
    .min(10, "Phone Number must be at least 10 digits")
    .max(15, "Phone Number must be at most 15 digits")
    .required("Phone Number is required"),
  recipientName: Yup.string().required("Recipient details are required"),
  salutation: Yup.string().required("Salutation is required"),
  campusName: Yup.string().required("Campus selection is required"),
  applicationType: Yup.string().required("Application Type is required"),
});

export default function AppForm({
  formData,
  setFormData,
  setShowForm,
  formTitle,
  handleAppGen,
}) {
  const [showTooltip, setShowTooltip] = useState(false);

  function onGenerateApplication(data) {
    handleAppGen();
    return true;
  }

  const handleCloseForm = () => {
    setShowForm(false);
  };

  let appTypes = [];
  for (let key in templateData.templates) {
    appTypes.push(key);
  }

  return (
    <div className="application-form">
      <button className="close-icon" onClick={handleCloseForm}>
        ×
      </button>
      <h5>{formTitle}</h5>
      <Formik
        initialValues={formData}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          setFormData(values);
          onGenerateApplication(values);
        }}
        enableReinitialize
      >
        {({ isSubmitting, isValid, dirty }) => {
          const isDisabled = isSubmitting || !isValid || !dirty;
          return (
            <Form>
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <Field id="name" type="text" name="name" placeholder="Enter your name" />
                <ErrorMessage name="name" component="span" className="error" />
              </div>
              <div className="form-group">
                <label htmlFor="classSection">Class Section</label>
                <Field id="classSection" type="text" name="classSection" placeholder="Enter your class section" />
                <ErrorMessage name="classSection" component="span" className="error" />
              </div>
              <div className="form-group">
                <label htmlFor="rollNumber">Roll Number</label>
                <Field id="rollNumber" type="text" name="rollNumber" placeholder="Enter your roll number" />
                <ErrorMessage name="rollNumber" component="span" className="error" />
              </div>
              <div className="form-group">
                <label htmlFor="phoneNumber">Phone Number</label>
                <Field id="phoneNumber" type="text" name="phoneNumber" placeholder="Enter your phone number" />
                <ErrorMessage name="phoneNumber" component="span" className="error" />
              </div>
              <div className="form-group">
                <label htmlFor="salutation">Recipient</label>
                <div className="recipient-input">
                  <Field as="select" id="salutation" name="salutation">
                    <option value="">Salutation</option>
                    <option value="Mr.">Mr.</option>
                    <option value="Ms.">Ms.</option>
                    <option value="Dr.">Dr.</option>
                  </Field>
                  <Field id="recipientName" type="text" name="recipientName" placeholder="Enter the recipient full name" />
                </div>
                <ErrorMessage name="salutation" component="span" className="error" />
                <ErrorMessage name="recipientName" component="span" className="error" />
              </div>
              <div className="form-group">
                <label htmlFor="campusName">Select Campus</label>
                <Field as="select" id="campusName" name="campusName">
                  <option value="">Campus</option>
                  <option value="Main Campus">Main Campus</option>
                  <option value="City Campus">City Campus</option>
                </Field>
                <ErrorMessage name="campusName" component="span" className="error" />
              </div>
              <div className="form-group">
                <label htmlFor="applicationType">Application Type</label>
                <Field as="select" id="applicationType" name="applicationType">
                  <option value="">Select</option>
                  {appTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </Field>
                <ErrorMessage name="applicationType" component="span" className="error" />
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
                  disabled={isDisabled}
                  style={{
                    background: isDisabled ? "#b0b0b0" : undefined,
                    cursor: isDisabled ? "not-allowed" : undefined,
                  }}
                  onMouseEnter={() => {
                    if (isDisabled) setShowTooltip(true);
                  }}
                  onMouseLeave={() => setShowTooltip(false)}
                  onClick={(e) => {
                    if (isDisabled) {
                      setShowTooltip(true);
                      e.preventDefault();
                    }
                  }}
                >
                  {isSubmitting ? "Generating..." : "Generate Application"}
                </button>
                {isDisabled && showTooltip && (
                  <div className="submit-tooltip">
                    You cannot submit until you fill the form correctly.
                  </div>
                )}
              </div>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
}
