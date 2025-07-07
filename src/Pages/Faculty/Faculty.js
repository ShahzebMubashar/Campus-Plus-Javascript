import React, { useState, useEffect } from "react";
import "./faculty.css";
import Navbar from "../Index/components/Navbar";
import facultyData from "./facultyData";
import BackToTopButton from "../Index/components/BackToTop";

// Define the slowScrollTo function
const slowScrollTo = (targetPosition, duration) => {
  const startPosition = window.pageYOffset;
  const distance = targetPosition - startPosition;
  let startTime = null;

  const animation = (currentTime) => {
    if (startTime === null) startTime = currentTime;
    const timeElapsed = currentTime - startTime;
    const run = ease(timeElapsed, startPosition, distance, duration);
    window.scrollTo(0, run);
    if (timeElapsed < duration) requestAnimationFrame(animation);
  };

  // Easing function for smooth scrolling
  const ease = (t, b, c, d) => {
    t /= d / 2;
    if (t < 1) return (c / 2) * t * t + b;
    t--;
    return (-c / 2) * (t * (t - 2) - 1) + b;
  };

  requestAnimationFrame(animation);
};

const FacultySection = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredFaculty, setFilteredFaculty] = useState(facultyData);

  useEffect(() => {
    // Smooth scroll setup
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach((link) => {
      link.addEventListener("click", function (e) {
        e.preventDefault();
        const targetId = this.getAttribute("href").substring(1);
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
          slowScrollTo(targetElement.offsetTop, 1000); // 1000ms = 1 second
        }
      });
    });

    // Scroll progress setup
    const progressCircle = document.querySelector(".progress-ring__circle");
    const radius = progressCircle ? progressCircle.r.baseVal.value : 0;
    const circumference = 2 * Math.PI * radius;

    if (progressCircle) {
      progressCircle.style.strokeDasharray = `${circumference} ${circumference}`;
      progressCircle.style.strokeDashoffset = circumference;
    }

    const updateProgress = () => {
      const scrollTop =
        document.documentElement.scrollTop || document.body.scrollTop;
      const scrollHeight =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;
      const scrollPercent = (scrollTop / scrollHeight) * 100;
      setProgress(scrollPercent, circumference);
    };

    const setProgress = (percent, circumference) => {
      const offset = circumference - (percent / 100) * circumference;
      if (progressCircle) {
        progressCircle.style.strokeDashoffset = offset;
      }
    };

    window.onscroll = updateProgress;
    updateProgress();

    return () => {
      window.onscroll = null; // Cleanup on component unmount
    };
  }, []);

  useEffect(() => {
    const handleSearch = () => {
      const query = searchQuery.toLowerCase();
      const filtered = Object.keys(facultyData).reduce((acc, school) => {
        const filteredFacultyList = facultyData[school].filter((faculty) =>
          faculty.name.toLowerCase().includes(query),
        );
        if (filteredFacultyList.length > 0) {
          acc[school] = filteredFacultyList;
        }
        return acc;
      }, {});
      setFilteredFaculty(filtered);
    };

    handleSearch();
  }, [searchQuery]);

  return (
    <main>
      <Navbar />
      <IntroSection />
      <SchoolsContainer />
      <SearchSection
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
      <NoResultsMessage filteredFaculty={filteredFaculty} />
      <FacultyContainers filteredFaculty={filteredFaculty} />
      <BackToTopButton />
    </main>
  );
};

const IntroSection = () => (
  <section className="intro-section" style={{ marginTop: "-90px" }}>
    <h1>Faculty Information</h1>
    <p>Need to find your prof? Names, offices, emails—sab kuch yahan milega</p>
  </section>
);

const SchoolsContainer = () => (
  <div className="schools-container">
    {["EE", "CV", "CS", "M", "SH"].map((school, index) => (
      <a href={`#${school}`} key={index}>
        <div className="school-box">{`FAST School of ${school}`}</div>
      </a>
    ))}
  </div>
);

const SearchSection = ({ searchQuery, setSearchQuery }) => (
  <section className="search-section">
    <div className="search-bar" style={{ position: "relative" }}>
      <input
        type="text"
        id="searchInput"
        placeholder="Search for a teacher..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <span
        className="search-icon"
        style={{
          position: "absolute",
          right: "18px",
          top: "50%",
          transform: "translateY(-50%)",
          color: "#888",
          fontSize: "18px",
          pointerEvents: "none",
        }}
      >
        <i className="fas fa-search"></i>
      </span>
    </div>
  </section>
);

const NoResultsMessage = ({ filteredFaculty }) => (
  <div
    id="noResultsMessage"
    className="no-results"
    style={{ display: Object.keys(filteredFaculty).length ? "none" : "block" }}
  >
    No results containing all your search terms were found.
    <p></p>
    <ul>
      <li>Make sure that all words are spelled correctly.</li>
      <li>Try different keywords.</li>
      <li>Try more general keywords.</li>
    </ul>
  </div>
);

const FacultyContainers = ({ filteredFaculty }) => (
  <>
    {Object.entries(filteredFaculty).map(([school, facultyList]) => (
      <FacultyContainer
        key={school}
        id={school}
        schoolName={`FAST School of ${school}`}
        facultyList={facultyList}
      />
    ))}
  </>
);

const FacultyContainer = ({ id, schoolName, facultyList }) => (
  <div className="faculty-container" id={id}>
    <h1 className="School-name">{schoolName}</h1>
    <div className="faculty-grid" id="facultyGrid">
      {facultyList.map((faculty, index) => (
        <FacultyCard key={index} faculty={faculty} />
      ))}
    </div>
  </div>
);

const FacultyCard = ({ faculty }) => {
  const copyEmail = (email) => {
    const tempInput = document.createElement("input");
    tempInput.value = email;
    document.body.appendChild(tempInput);

    tempInput.select();
    document.execCommand("copy");

    document.body.removeChild(tempInput);
  };

  return (
    <div className="faculty-card">
      <img src={faculty.image} alt={faculty.name} loading="lazy" />
      <h3>{faculty.name}</h3>
      <p>{faculty.position}</p>
      <p>{faculty.office}</p>
      <p className="contact-info">
        <span className="email">{faculty.email}</span>
        <i
          className="fa-regular fa-copy copy-icon"
          style={{ cursor: "pointer" }}
          onClick={() => copyEmail(faculty.email)}
        ></i>
      </p>
    </div>
  );
};

export default FacultySection;
