// Datesheet.js
import React, { useEffect, useState } from "react";
import Select from "react-select";
import DynamicDatesheet from "./DynamicDatesheet";
import "./Datesheet.css"; // New CSS for Datesheet
import CourseList from "../Index/components/CourseList";
import Navbar from "../Index/components/Navbar";
import Footer from "../Footer/Footer";

const Datesheet = () => {
  const [csvData, setCsvData] = useState([]);
  const [datesheetData, setDatesheetData] = useState([]);
  const [sections, setSections] = useState({});
  const [courses, setCourses] = useState({});
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [currentCourse, setCurrentCourse] = useState(null);

  useEffect(() => {
    Promise.all([
      fetch(require("../../Assets/data/courses.csv")).then((res) => res.text()),
      fetch(require("../../Assets/data/datesheet.csv")).then((res) =>
        res.text(),
      ),
    ]).then(([coursesRaw, datesheetRaw]) => {
      const parsedCourses = parseCourses(coursesRaw);
      const parsedDatesheet = parseDatesheet(datesheetRaw);
      processCsv(parsedCourses);
      setDatesheetData(parsedDatesheet);
      setCsvData(parsedCourses);
    });
  }, []);

  const parseCourses = (data) => {
    const rows = data.split("\n").slice(1);
    return rows.map((row) => {
      const [
        id,
        course,
        courseCode,
        section,
        instructor,
        credit_hours,
        program,
        target_dept,
        parent_dept,
        type,
        repeat,
        ...lectures2
      ] = row.split(",");
      return { course, courseCode, section, type, repeat };
    });
  };

  const parseDatesheet = (data) => {
    const rows = data.replace(/\r/g, "").split("\n").slice(1);
    return rows.map((row) => {
      const [date, day, timeSlot, courseCode, courseTitle] = row.split(",");
      return { date, day, timeSlot, courseCode, courseTitle };
    });
  };

  const processCsv = (data) => {
    const coursesBySection = {};
    const courseByName = {};

    data.forEach(({ courseCode, course, section, type, repeat }) => {
      if (!coursesBySection[section]) coursesBySection[section] = [];
      coursesBySection[section].push({
        courseCode,
        course,
        section,
        type,
        repeat,
      });

      if (course) {
        if (!courseByName[course])
          courseByName[course] = { course, sections: [], type, repeat };
        courseByName[course].sections.push(section);
      }
    });

    const sortedSections = Object.keys(coursesBySection)
      .filter((section) => !section.endsWith("1") && !section.endsWith("2"))
      .sort()
      .reduce((acc, key) => {
        acc[key] = coursesBySection[key];
        return acc;
      }, {});

    const sortedCourses = Object.keys(courseByName)
      .sort()
      .reduce((acc, key) => {
        acc[key] = courseByName[key];
        return acc;
      }, {});

    setSections(sortedSections);
    setCourses(sortedCourses);
  };

  const addCourse = (courseName, section) => {
    const courseDetails = csvData.find(
      (row) => row.course === courseName && row.section === section,
    );
    if (
      courseDetails &&
      !selectedCourses.some(
        (c) =>
          c.courseCode === courseDetails.courseCode && c.section === section,
      )
    ) {
      setSelectedCourses([...selectedCourses, courseDetails]);
    }
  };

  const addSection = (section) => {
    const newCourses = csvData.filter(
      (row) =>
        row.section === section &&
        row.type === "Core" &&
        row.repeat === "False",
    );
    const unique = newCourses.filter(
      (row) => !selectedCourses.some((c) => c.courseCode === row.courseCode),
    );
    setSelectedCourses([...selectedCourses, ...unique]);
  };

  const removeCourse = (courseCode) => {
    setSelectedCourses(
      selectedCourses.filter((c) => c.courseCode !== courseCode),
    );
  };

  const clearAllCourses = () => {
    setSelectedCourses([]);
  };

  return (
    <div>
      <Navbar />
      <div className="datesheet-container">
        <h1 className="header">Datesheet Generator</h1>
        <div className="selectors">
          <div style={{ flex: "1 1 0%" }}>
            <Select
              options={Object.keys(courses).map((course) => ({
                label: course,
                value: course,
              }))}
              onChange={(selected) => setCurrentCourse(selected?.value)}
              placeholder="Add a Course"
              isSearchable
              styles={customstyles}
            />
          </div>
          {currentCourse && (
            <div style={{ flex: "1 1 0%" }}>
              <Select
                options={courses[currentCourse]?.sections
                  ?.sort()
                  .map((sec) => ({ label: sec, value: sec }))}
                onChange={(selected) =>
                  addCourse(currentCourse, selected?.value)
                }
                placeholder={`Select section for ${currentCourse}`}
                isSearchable
                styles={customstyles}
              />
            </div>
          )}
          <div style={{ flex: "1 1 100%", marginTop: "15px" }}>
            <Select
              options={Object.keys(sections).map((sec) => ({
                label: sec,
                value: sec,
              }))}
              onChange={(selected) => addSection(selected?.value)}
              placeholder="Add entire section"
              isSearchable
              styles={customstyles}
            />
          </div>
        </div>
        <CourseList
          courses={selectedCourses}
          onRemove={removeCourse}
          onRemoveAll={clearAllCourses}
        />
        <DynamicDatesheet
          selectedCourses={selectedCourses}
          datesheetData={datesheetData}
        />
      </div>
      <Footer />
    </div>
  );
};

export default Datesheet;

const customstyles = {
  placeholder: (base) => ({
    ...base,
    color: "#333",
    fontWeight: "bold",
    fontSize: "16px",
  }),
  control: (base, state) => ({
    ...base,
    borderColor: state.isFocused ? "#66bb91" : "#ddd",
    boxShadow: state.isFocused ? "0 0 0 3px rgba(102, 187, 145, 0.2)" : "none",
    "&:hover": {
      borderColor: "#66bb91",
    },
  }),
  menu: (base) => ({
    ...base,
    zIndex: 10,
  }),
};
