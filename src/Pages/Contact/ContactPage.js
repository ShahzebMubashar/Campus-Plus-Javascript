import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import "./ContactPage.css";
import Navbar from "../Index/components/Navbar";
import Footer from "../Footer/Footer";
import API_BASE_URL from "../../config/api";

const validationSchema = Yup.object({
  name: Yup.string().required("Full Name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  phone: Yup.string().required("Phone Number is required"),
  message: Yup.string().required("Message is required"),
  policy: Yup.bool().oneOf([true], "You must agree to the privacy policy"),
});

const ContactPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="contact-main-container">
      <div className="contact-page-container">
        <Navbar />
        <header className="contact-header">
          <h1>Contact Us</h1>
          <p>Your direct line to answers, assistance, and more!</p>
        </header>
        <div className="contact-card">
          <h2>Contact Us</h2>
          <p>
            We'd love to hear from you. Send us a message, and our team will
            respond promptly!
          </p>
          <Formik
            initialValues={{
              name: "",
              email: "",
              phone: "",
              message: "",
              policy: false,
            }}
            validationSchema={validationSchema}
            onSubmit={async (values, { resetForm }) => {
              setIsSubmitting(true);
              setSubmitMessage("");
              try {
                const response = await fetch(
                  `${API_BASE_URL}/api/email/send-email`,
                  {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify(values),
                  },
                );
                if (response.ok) {
                  setSubmitMessage("Message sent successfully!");
                  resetForm();
                } else {
                  setSubmitMessage("Failed to send message. Please try again.");
                }
              } catch (error) {
                setSubmitMessage("An error occurred. Please try again later.");
              }
              setIsSubmitting(false);
            }}
          >
            {({ isValid, dirty }) => {
              const isDisabled = isSubmitting || !isValid || !dirty;
              return (
                <Form className="contact-form">
                  <div className="form-group">
                    <Field type="text" name="name" placeholder="Full Name" />
                    <ErrorMessage
                      name="name"
                      component="span"
                      className="error"
                    />
                  </div>
                  <div className="form-group">
                    <Field type="email" name="email" placeholder="Email" />
                    <ErrorMessage
                      name="email"
                      component="span"
                      className="error"
                    />
                  </div>
                  <div className="form-group">
                    <Field type="tel" name="phone" placeholder="Phone Number" />
                    <ErrorMessage
                      name="phone"
                      component="span"
                      className="error"
                    />
                  </div>
                  <div className="form-group">
                    <Field
                      as="textarea"
                      name="message"
                      placeholder="What's on your mind?"
                      rows="4"
                    />
                    <ErrorMessage
                      name="message"
                      component="span"
                      className="error"
                    />
                  </div>
                  <div className="form-group-checkbox">
                    <Field type="checkbox" id="policy" name="policy" />
                    <label htmlFor="policy">
                      I agree to the privacy policy and consent to the
                      processing of my data.
                    </label>
                    <ErrorMessage
                      name="policy"
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
                      {isSubmitting ? "Sending..." : "Send Message"}
                    </button>
                    {isDisabled && showTooltip && (
                      <div className="submit-tooltip">
                        You cannot submit until you fill the form correctly.
                      </div>
                    )}
                  </div>
                  {submitMessage && (
                    <p className="submit-message">{submitMessage}</p>
                  )}
                </Form>
              );
            }}
          </Formik>
        </div>
        <div className="social-media">
          <h3>Follow Us</h3>
          <div className="social-icons">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="fab fa-facebook-f"></i>
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="fab fa-twitter"></i>
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="fab fa-instagram"></i>
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="fab fa-linkedin-in"></i>
            </a>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ContactPage;
