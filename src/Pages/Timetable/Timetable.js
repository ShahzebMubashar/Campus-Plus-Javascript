import React, { useEffect, useState } from "react";
import DropdownSelector from "../Index/components/DropDownSelector";
import CourseList from "../Index/components/CourseList";
import DynamicTimetable from "./DynamicTimetable";
import "./Timetable.css";
import Navbar from '../Index/components/Navbar';
import Loader from '../Index/components/Loader'
import BackToTopButton from "../Index/components/BackToTop";

const Timetable = () => {
  const [csvData, setCsvData] = useState([]);
  const [sections, setSections] = useState({});
  const [courses, setCourses] = useState({});
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [currentCourse, setCurrentCourse] = useState(null);

  // Toggle for showing instructor and venue
  const [showInstructor, setShowInstructor] = useState(true);
  const [showVenue, setShowVenue] = useState(true);

  useEffect(() => {
    fetch(require("./courses.csv"))
      .then((response) => response.text())
      .then((data) => processCsv(parseCsvData(data)))
      .catch((err) => console.error("Error loading CSV:", err));
  }, []);

  // Parse CSV Data
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

  // Process CSV Data into structured format
  const processCsv = (data) => {
    const coursesBySection = {};
    const courseByName = {};

    data.forEach(({ courseCode, course, section }) => {
      if (!coursesBySection[section]) coursesBySection[section] = [];
      coursesBySection[section].push({ courseCode, course });

      if (!courseByName[course]) courseByName[course] = { course, sections: [] };
      courseByName[course].sections.push(section);
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

  // Add a course to the selected list
  const addCourse = (courseName, section) => {
    const courseDetails = csvData.find((row) => row.course === courseName && row.section === section);
    if (courseDetails && !selectedCourses.some((c) => c.course === courseName && c.section === section)) {
      setSelectedCourses([...selectedCourses, courseDetails]);
    }
  };

  // Add all courses from a section
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

  // Remove a course from the selected list
  const removeCourse = (courseCode) => {
    setSelectedCourses(selectedCourses.filter((c) => c.courseCode !== courseCode));
  };

  return (
    <div className="app-container">
      <Navbar />
      <Loader />
      <h1 className="header">Timetable Generator</h1>
      <div className="selectors">
        {/* Dropdown for selecting courses */}
        <DropdownSelector
          label="Select a Course"
          options={Object.keys(courses)}
          onSelect={(courseCode) => setCurrentCourse(courseCode)}
        />
        {currentCourse && (
          <DropdownSelector
            label={`Select a Section for ${currentCourse}`}
            options={courses[currentCourse]?.sections?.sort()}
            onSelect={(section) => addCourse(currentCourse, section)}
          />
        )}
      </div>
      {/* Dropdown for selecting sections */}
      <DropdownSelector
        label="Select a Section"
        options={Object.keys(sections)}
        onSelect={(section) => addSection(section)}
      />

      {/* Display selected courses */}
      <CourseList courses={selectedCourses} onRemove={removeCourse} />

      {/* Dynamic timetable display */}
      <DynamicTimetable
        selectedCourses={selectedCourses}
        showInstructor={showInstructor}
        showVenue={showVenue}
      />
      <BackToTopButton />
    </div>
  );
};

export default Timetable;
