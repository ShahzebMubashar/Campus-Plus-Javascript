import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebookF,
  faTwitter,
  faInstagram,
  faLinkedinIn,
  faGithub,
} from "@fortawesome/free-brands-svg-icons";
import {
  faEnvelope,
  faPhone,
  faMapMarkerAlt,
} from "@fortawesome/free-solid-svg-icons";

const Footer = () => {
  return (
    <footer className="aboutcp-footer py-5 aboutcp-footer-hide-mobile">
      <div className="container">
        <div className="row g-4">
          <div className="col-lg-6 col-md-6 col-12 mb-4 mb-md-0 text-center text-md-start">
            <h4 className="aboutcp-footer-title">Campus+</h4>
            <p className="aboutcp-footer-text">
              Connecting students, faculty, and resources to enhance the
              university experience and build a stronger campus community. Our
              platform helps you stay connected with campus events, resources,
              and opportunities.
            </p>
            <div className="aboutcp-social-icons mt-4 d-flex justify-content-center justify-content-md-start">
              <button className="aboutcp-social-icon">
                <FontAwesomeIcon icon={faFacebookF} />
              </button>
              <button className="aboutcp-social-icon">
                <FontAwesomeIcon icon={faTwitter} />
              </button>
              <button className="aboutcp-social-icon">
                <FontAwesomeIcon icon={faInstagram} />
              </button>
              <button className="aboutcp-social-icon">
                <FontAwesomeIcon icon={faLinkedinIn} />
              </button>
              <button className="aboutcp-social-icon">
                <FontAwesomeIcon icon={faGithub} />
              </button>
            </div>
          </div>
          <div className="col-lg-6 col-md-6 col-12 text-center text-md-start">
            <h4 className="aboutcp-footer-title">Contact Us</h4>
            <div className="aboutcp-contact-info">
              <p>
                <FontAwesomeIcon icon={faMapMarkerAlt} className="me-2" /> FAST
                NUCES, Lahore, Pakistan
              </p>
              <p>
                <FontAwesomeIcon icon={faPhone} className="me-2" /> +92 000 000
                000
              </p>
              <p>
                <FontAwesomeIcon icon={faEnvelope} className="me-2" />{" "}
                productionsbymultidexters@gmail.com
              </p>
            </div>
            <div className="aboutcp-newsletter mt-4">
              <h5 className="aboutcp-footer-subtitle">
                Subscribe to our newsletter
              </h5>
              <div className="aboutcp-newsletter-form d-flex flex-column flex-sm-row justify-content-center justify-content-md-start align-items-center gap-2">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="aboutcp-form-input mb-2 mb-sm-0"
                  style={{ minWidth: 0, flex: 1 }}
                />
                <button className="aboutcp-form-button">Subscribe</button>
              </div>
            </div>
          </div>
        </div>
        <hr className="aboutcp-footer-divider" />
        <div className="row">
          <div className="col-12 text-center">
            <p className="aboutcp-copyright mb-0">
              Copyright © {new Date().getFullYear()} Campus+ Designed By
              MultiDexters
            </p>
          </div>
        </div>
      </div>
      <style>{`
                @media (max-width: 768px) {
                    .aboutcp-footer-hide-mobile {
                        display: none !important;
                    }
                }
                @media (max-width: 768px) {
                    .aboutcp-footer {
                        padding: 2rem 0 !important;
                    }
                    .aboutcp-footer-title {
                        font-size: 1.3rem;
                    }
                    .aboutcp-footer-text {
                        font-size: 0.95rem;
                        padding: 0 8px;
                    }
                    .aboutcp-contact-info p {
                        font-size: 0.95rem;
                    }
                    .aboutcp-newsletter-form {
                        flex-direction: column !important;
                        align-items: stretch !important;
                    }
                    .aboutcp-form-input {
                        width: 100% !important;
                        margin-bottom: 8px !important;
                    }
                    .aboutcp-form-button {
                        width: 100% !important;
                    }
                    .aboutcp-social-icons {
                        justify-content: center !important;
                        margin-bottom: 1rem;
                    }
                }
            `}</style>
    </footer>
  );
};

export default Footer;
