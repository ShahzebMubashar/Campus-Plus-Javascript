import React, { useEffect } from "react";
import "./BackToTop.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

const BackToTopButton = () => {
  const topFunction = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    const myBtn = document.getElementById("myBtn");
    const progressCircle = document.querySelector(".progress-ring__circle");

    if (progressCircle) {
      const r = progressCircle.r && progressCircle.r.baseVal ? progressCircle.r.baseVal.value : null;
      if (r !== null && r !== undefined) {
        const radius = r;
        const circumference = 2 * Math.PI * radius;
        progressCircle.style.strokeDasharray = `${circumference} ${circumference}`;
        progressCircle.style.strokeDashoffset = circumference;

        const setProgress = (percent) => {
          const offset = circumference - (percent / 100) * circumference;
          progressCircle.style.strokeDashoffset = offset;
        };

        const updateProgress = () => {
          const scrollTop =
            window.pageYOffset ||
            document.documentElement.scrollTop ||
            document.body.scrollTop;
          const scrollHeight =
            Math.max(
              document.documentElement.scrollHeight,
              document.body.scrollHeight,
            ) - window.innerHeight;
          const scrollPercent = (scrollTop / scrollHeight) * 100;
          setProgress(scrollPercent);
        };

        const handleScroll = () => {
          // Ensure button is always visible
          if (myBtn) {
            myBtn.style.display = "flex";
          }
          // Update progress circle
          updateProgress();
        };

        window.addEventListener("scroll", handleScroll);

        // Initial update when the page loads
        updateProgress();

        // Cleanup the event listener when the component unmounts
        return () => {
          window.removeEventListener("scroll", handleScroll);
        };
      }
    } else {
      console.warn("Element '.progress-ring__circle' not found in the DOM.");
    }
  }, []);

  return (
    <div id="myBtnContainer">
      <svg className="progress-ring" width="90" height="90">
        <circle
          className="progress-ring__circle"
          stroke="#3498db"
          fill="transparent"
          strokeWidth="5"
          r="35"
          cx="45"
          cy="45"
        />
      </svg>
      <button id="myBtn" onClick={topFunction} style={{ display: "flex" }}>
        <i className="fas fa-rocket"></i>
      </button>
    </div>
  );
};

export default BackToTopButton;
