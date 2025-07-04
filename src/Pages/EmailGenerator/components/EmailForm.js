import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import templateData from "../emails.json";

const validationSchema = Yup.object({
  userName: Yup.string().required("Name is required"),
  classSection: Yup.string().required("Class Section is required"),
  rollNumber: Yup.string().required("Roll Number is required"),
  selectedTeacher: Yup.string().required("Teacher is required"),
  customTeacher: Yup.string().when("selectedTeacher", {
    is: "Other",
    then: Yup.string().required("Teacher's name is required"),
    otherwise: Yup.string(),
  }),
  teacherSalutation: Yup.string().when("selectedTeacher", {
    is: "Other",
    then: Yup.string().required("Salutation is required"),
    otherwise: Yup.string(),
  }),
  emailType: Yup.string().required("Email Type is required"),
});

const EmailForm = ({
  teachers,
  formData,
  setFormData,
  onGenEmail,
  setShowEmailForm,
}) => {
  const [showTooltip, setShowTooltip] = useState(false);
  let emailTypes = [];
  for (let key in templateData.templates) {
    emailTypes.push(key);
  }

  return (
    <div className="email-form">
      <button className="close-icon" onClick={() => setShowEmailForm(false)}>
        ✖
      </button>
      <h5>Email Form</h5>
      <Formik
        initialValues={formData}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          setFormData({ ...values });
          onGenEmail();
        }}
        enableReinitialize
      >
        {({ isSubmitting, isValid, dirty, values }) => {
          const isDisabled = isSubmitting || !isValid || !dirty;
          return (
            <Form>
              <div className="form-group">
                <label>Name</label>
                <Field
                  type="text"
                  name="userName"
                  placeholder="Enter your name"
                />
                <ErrorMessage
                  name="userName"
                  component="span"
                  className="error"
                />
              </div>
              <div className="form-group">
                <label>Class Section</label>
                <Field
                  type="text"
                  name="classSection"
                  placeholder="Enter your class section"
                />
                <ErrorMessage
                  name="classSection"
                  component="span"
                  className="error"
                />
              </div>
              <div className="form-group">
                <label>Roll Number</label>
                <Field
                  type="text"
                  name="rollNumber"
                  placeholder="Enter your roll number"
                />
                <ErrorMessage
                  name="rollNumber"
                  component="span"
                  className="error"
                />
              </div>
              <div className="form-group">
                <label>Teacher</label>
                <Field as="select" name="selectedTeacher">
                  <option value="">Select Teacher</option>
                  {teachers.map((teacher) => (
                    <option key={teacher.name} value={teacher.name}>
                      {teacher.name}
                    </option>
                  ))}
                  <option value="Other">Other</option>
                </Field>
                <ErrorMessage
                  name="selectedTeacher"
                  component="span"
                  className="error"
                />
                {values.selectedTeacher === "Other" && (
                  <div className="custom-teacher">
                    <Field
                      type="text"
                      name="customTeacher"
                      placeholder="Enter teacher's name"
                    />
                    <ErrorMessage
                      name="customTeacher"
                      component="span"
                      className="error"
                    />
                    <Field as="select" name="teacherSalutation">
                      <option value="">Salutation</option>
                      <option value="Dr.">Dr.</option>
                      <option value="Mr.">Mr.</option>
                      <option value="Ms.">Ms.</option>
                    </Field>
                    <ErrorMessage
                      name="teacherSalutation"
                      component="span"
                      className="error"
                    />
                  </div>
                )}
              </div>
              <div className="form-group">
                <label>Email Type</label>
                <Field as="select" name="emailType">
                  <option value="">Select Email Type</option>
                  {emailTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </Field>
                <ErrorMessage
                  name="emailType"
                  component="span"
                  className="error"
                />
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
                  {isSubmitting ? "Submitting..." : "Submit"}
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
};

export default EmailForm;
