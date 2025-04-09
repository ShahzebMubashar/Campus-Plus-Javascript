import React, { useEffect, useState } from "react";
import CourseList from "../Index/components/CourseList";
import BackToTopButton from "../Index/components/BackToTop"
import Navbar from "../Index/components/Navbar"
import DynamicTimetable from "./DynamicTimetable";
import Select from "react-select"; // React-Select for searchable dropdowns
import "./Timetable.css";
import { Nav } from "react-bootstrap";

const Timetable = () => {
  const [csvData, setCsvData] = useState([]);
  const [sections, setSections] = useState({});
  const [courses, setCourses] = useState({});
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [currentCourse, setCurrentCourse] = useState(null);
  const [showInstructor, setShowInstructor] = useState(true);
  const [showVenue, setShowVenue] = useState(true);

  useEffect(() => {
    fetch(require("../../Assets/data/courses.csv"))
      .then((response) => response.text())
      .then((data) => processCsv(parseCsvData(data)))
      .catch((err) => console.error("Error loading CSV:", err));
  }, []);

  const parseCsvData = (data) => {
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
      const lectures = lectures2.join(",");
      return { id, course, courseCode, section, instructor, credit_hours, program, target_dept, parent_dept, type, repeat, lectures };
    });
  };

  const processCsv = (data) => {
    const coursesBySection = {};
    const courseByName = {};

    data.forEach(({ courseCode, course, section }) => {
      if (section && course) {
        if (!coursesBySection[section]) coursesBySection[section] = [];
        coursesBySection[section].push({ courseCode, course });

        if (!courseByName[course]) courseByName[course] = { course, sections: [] };
        courseByName[course].sections.push(section);
      }
    });

    setSections(
      Object.keys(coursesBySection)
        .filter((section) => !section.endsWith("1") && !section.endsWith("2"))
        .sort()
        .reduce((acc, key) => ({ ...acc, [key]: coursesBySection[key] }), {})
    );

    setCourses(
      Object.keys(courseByName)
        .sort()
        .reduce((acc, key) => ({ ...acc, [key]: courseByName[key] }), {})
    );

    setCsvData(data);
  };

  const addCourse = (courseName, section) => {
    const courseDetails = csvData.find((row) => row.course === courseName && row.section === section);
    if (courseDetails && !selectedCourses.some((c) => c.course === courseName && c.section === section)) {
      setSelectedCourses([...selectedCourses, courseDetails]);
    }
  };

  const addSection = (section) => {
    const updatedCourses = [...selectedCourses];

    csvData
      .filter((row) => row.section === section && row.type === "Core" && row.repeat === "False")
      .forEach((course) => {
        if (!updatedCourses.some((c) => c.courseCode === course.courseCode && c.section === section)) updatedCourses.push(course);
      });

    ["1", "2"].forEach((lab) => {
      csvData
        .filter((row) => row.section === `${section}${lab}` && row.repeat === "False")
        .forEach((course) => {
          if (!updatedCourses.some((c) => c.courseCode === course.courseCode && c.section === section)) updatedCourses.push(course);
        });
    });

    setSelectedCourses(updatedCourses);
  };

  const removeCourse = (courseCode) => {
    setSelectedCourses(selectedCourses.filter((c) => c.courseCode !== courseCode));
  };

  const clearAllCourses = () => {
    setSelectedCourses([]);
  };
  const customstyles = {
    placeholder: (base) => ({
      ...base,
      color: '#333', // Darker placeholder color
      fontWeight: 'bold', // Make it bold
      fontSize: '16px', // Slightly larger font
    }),
    control: (base, state) => ({
      ...base,
      borderColor: state.isFocused ? '#66bb91' : '#ddd', // Highlight on focus
      boxShadow: state.isFocused ? '0 0 0 3px rgba(102, 187, 145, 0.2)' : 'none',
      '&:hover': {
        borderColor: '#66bb91',
      },
    }),
    menu: (base) => ({
      ...base,
      zIndex: 10, // Ensure menu is above other elements
    }),
  };

  return (
    <div>
      <Navbar />
      <div className="app-container">
        <h1 className="header">Timetable Course Selector</h1>
        <div className="selectors">
          <div style={{ flex: 1 }}>
            <Select
              options={Object.keys(courses).map((course) => ({ label: course, value: course }))}
              onChange={(selected) => setCurrentCourse(selected?.value)}
              placeholder="Add a Specific Course"
              isSearchable
              styles={customstyles}
            />
          </div>
          {currentCourse && (
            <div style={{ flex: 1 }}>
              <Select
                options={courses[currentCourse]?.sections?.sort().map((section) => ({
                  label: section,
                  value: section,
                }))}
                onChange={(selected) => addCourse(currentCourse, selected?.value)}
                placeholder={`Select a Section for ${currentCourse}`}
                isSearchable
                styles={customstyles}
              />
            </div>
          )}
        </div>
        <div style={{ flex: 1, marginTop: "15px" }}>
          <Select
            options={Object.keys(sections).map((section) => ({ label: section, value: section }))}
            onChange={(selected) => addSection(selected?.value)}
            placeholder="Add All Core Courses of a Section"
            isSearchable
            styles={customstyles}
          />
        </div>
        <CourseList courses={selectedCourses} onRemove={removeCourse} onRemoveAll={clearAllCourses} />
        <DynamicTimetable
          selectedCourses={selectedCourses}
          showInstructor={showInstructor}
          showVenue={showVenue}
        />
      </div>
      <BackToTopButton />
    </div>
  );
};

export default Timetable;
