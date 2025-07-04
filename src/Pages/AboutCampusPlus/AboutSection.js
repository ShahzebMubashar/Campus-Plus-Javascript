import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay } from "@fortawesome/free-solid-svg-icons";

const AboutSection = () => {
  return (
    <section
      id="about"
      className="bg-cover"
      style={{ backgroundImage: "url(../assets/images/cover_3.webp)" }}
    >
      <div className="overlay"></div>
      <div className="container text-white text-center">
        <div className="row">
          <div className="col-12 section-intro text-center" data-aos="fade-up">
            <h1>Watch our video</h1>
            <div className="divider"></div>
            <p>
              Discover how Campus+ enhances your university experience through
              our engaging video.
              <br />
              Watch now to see our platform in action!
            </p>
            <a href="#" className="video-btn">
              <FontAwesomeIcon icon={faPlay} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
