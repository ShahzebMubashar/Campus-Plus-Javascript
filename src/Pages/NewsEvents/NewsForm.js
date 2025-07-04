import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import "./NewsForm.css";

const validationSchema = Yup.object({
  title: Yup.string().required("News Title is required"),
  description: Yup.string().required("Description is required"),
  category: Yup.string().required("Category is required"),
  // file: Yup.mixed().required('File/Image is required'), // Optional: Uncomment if file is required
});

const NewsForm = () => {
  const [showTooltip, setShowTooltip] = useState(false);
  return (
    <div className="news-form-container">
      <h2>Add News</h2>
      <Formik
        initialValues={{ title: "", description: "", category: "", file: null }}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          const formData = new FormData();
          formData.append("title", values.title);
          formData.append("description", values.description);
          formData.append("category", values.category);
          if (values.file) formData.append("file", values.file);
          // Submit logic here
          console.log("Form Submitted", values);
        }}
      >
        {({ isSubmitting, isValid, dirty, setFieldValue, values }) => {
          const isDisabled = isSubmitting || !isValid || !dirty;
          return (
            <Form className="news-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="title">News Title</label>
                  <Field
                    type="text"
                    id="title"
                    name="title"
                    placeholder="Enter news title"
                  />
                  <ErrorMessage
                    name="title"
                    component="span"
                    className="error"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="category">Category</label>
                  <Field as="select" id="category" name="category">
                    <option value="">Select a category</option>
                    <option value="event">Event</option>
                    <option value="announcement">Announcement</option>
                    <option value="general">General</option>
                  </Field>
                  <ErrorMessage
                    name="category"
                    component="span"
                    className="error"
                  />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="description">Description</label>
                <Field
                  as="textarea"
                  id="description"
                  name="description"
                  placeholder="Enter news description"
                  rows="3"
                />
                <ErrorMessage
                  name="description"
                  component="span"
                  className="error"
                />
              </div>
              <div className="form-group">
                <label htmlFor="file">Upload File/Image</label>
                <input
                  type="file"
                  id="file"
                  name="file"
                  accept="image/*,application/pdf"
                  onChange={(e) => setFieldValue("file", e.target.files[0])}
                />
                {/* Optionally show file error: <ErrorMessage name="file" component="span" className="error" /> */}
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
                  className="submit-btn submit-btn-with-tooltip"
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
                  {isSubmitting ? "Submitting..." : "Submit News"}
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

export default NewsForm;
