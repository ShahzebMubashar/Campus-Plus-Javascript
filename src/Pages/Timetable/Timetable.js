import React, { useEffect, useState } from "react";
import CourseList from "../Index/components/CourseList";
import Navbar from "../Index/components/Navbar";
import DynamicTimetable from "./DynamicTimetable";
import Footer from "../Footer/Footer";
import Select from "react-select"; // React-Select for searchable dropdowns
import "./Timetable.css";

const Timetable = () => {
  const [csvData, setCsvData] = useState([]);
  const [sections, setSections] = useState({});
  const [courses, setCourses] = useState({});
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [currentCourse, setCurrentCourse] = useState(null);

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
      return {
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
        lectures,
      };
    });
  };

  const processCsv = (data) => {
    const coursesBySection = {};
    const courseByName = {};

    data.forEach(({ courseCode, course, section }) => {
      if (section && course) {
        if (!coursesBySection[section]) coursesBySection[section] = [];
        coursesBySection[section].push({ courseCode, course });

        if (!courseByName[course])
          courseByName[course] = { course, sections: [] };
        courseByName[course].sections.push(section);
      }
    });

    setSections(
      Object.keys(coursesBySection)
        .filter((section) => !section.endsWith("1") && !section.endsWith("2"))
        .sort()
        .reduce((acc, key) => ({ ...acc, [key]: coursesBySection[key] }), {}),
    );

    setCourses(
      Object.keys(courseByName)
        .sort()
        .reduce((acc, key) => ({ ...acc, [key]: courseByName[key] }), {}),
    );

    setCsvData(data);
  };

  const addCourse = (courseName, section) => {
    const courseDetails = csvData.find(
      (row) => row.course === courseName && row.section === section,
    );
    if (
      courseDetails &&
      !selectedCourses.some(
        (c) => c.course === courseName && c.section === section,
      )
    ) {
      setSelectedCourses([...selectedCourses, courseDetails]);
    }
  };

  const addSection = (section) => {
    const updatedCourses = [...selectedCourses];

    csvData
      .filter(
        (row) =>
          row.section === section &&
          row.type === "Core" &&
          row.repeat === "False",
      )
      .forEach((course) => {
        if (
          !updatedCourses.some(
            (c) => c.courseCode === course.courseCode && c.section === section,
          )
        )
          updatedCourses.push(course);
      });

    ["1", "2"].forEach((lab) => {
      csvData
        .filter(
          (row) => row.section === `${section}${lab}` && row.repeat === "False",
        )
        .forEach((course) => {
          if (
            !updatedCourses.some(
              (c) =>
                c.courseCode === course.courseCode && c.section === section,
            )
          )
            updatedCourses.push(course);
        });
    });

    setSelectedCourses(updatedCourses);
  };

  const removeCourse = (courseCode) => {
    setSelectedCourses(
      selectedCourses.filter((c) => c.courseCode !== courseCode),
    );
  };

  const clearAllCourses = () => {
    setSelectedCourses([]);
  };
  const customstyles = {
    placeholder: (base) => ({
      ...base,
      color: "#1e293b",
      fontWeight: "500",
      fontSize: "0.95rem",
    }),
    control: (base, state) => ({
      ...base,
      borderColor: state.isFocused ? "#0d47a1" : "#e2e8f0",
      borderWidth: "2px",
      borderRadius: "10px",
      minHeight: "52px",
      boxShadow: state.isFocused
        ? "0 0 0 3px rgba(13, 71, 161, 0.15)"
        : "0 2px 4px rgba(13, 71, 161, 0.05)",
      "&:hover": {
        borderColor: "#0d47a1",
      },
    }),
    menu: (base) => ({
      ...base,
      zIndex: 10,
      borderRadius: "10px",
      boxShadow: "0 8px 24px rgba(13, 71, 161, 0.15)",
      overflow: "hidden",
    }),
    option: (base, state) => ({
      ...base,
      padding: "14px 18px",
      backgroundColor: state.isSelected
        ? "#0d47a1"
        : state.isFocused
          ? "#edf5ff"
          : base.backgroundColor,
      color: state.isSelected
        ? "white"
        : state.isFocused
          ? "#0d47a1"
          : "#1e293b",
      "&:hover": {
        backgroundColor: state.isSelected ? "#0d47a1" : "#edf5ff",
        color: state.isSelected ? "white" : "#0d47a1",
      },
    }),
  };

  return (
    <div>
      <Navbar />
      <div className="app-container">
        <h1 className="header">Timetable Course Selector</h1>
        <div className="selectors">
          <div style={{ width: "100%", marginBottom: "20px" }}>
            <label className="selector-label">Course Selection</label>
            <div style={{ display: "flex", gap: "20px" }}>
              <div style={{ flex: 1 }}>
                <Select
                  options={Object.keys(courses).map((course) => ({
                    label: course,
                    value: course,
                  }))}
                  onChange={(selected) => setCurrentCourse(selected?.value)}
                  placeholder="Add a Specific Course"
                  isSearchable
                  styles={customstyles}
                />
              </div>
              {currentCourse && (
                <div style={{ flex: 1 }}>
                  <Select
                    options={courses[currentCourse]?.sections
                      ?.sort()
                      .map((section) => ({
                        label: section,
                        value: section,
                      }))}
                    onChange={(selected) =>
                      addCourse(currentCourse, selected?.value)
                    }
                    placeholder={`Select a Section for ${currentCourse}`}
                    isSearchable
                    styles={customstyles}
                  />
                </div>
              )}
            </div>
          </div>

          <div style={{ width: "100%" }}>
            <label className="selector-label">Section Selection</label>
            <Select
              options={Object.keys(sections).map((section) => ({
                label: section,
                value: section,
              }))}
              onChange={(selected) => addSection(selected?.value)}
              placeholder="Add All Core Courses of a Section"
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
        <DynamicTimetable
          selectedCourses={selectedCourses}
        />
      </div>

      <Footer />
    </div>
  );
};

export default Timetable;
