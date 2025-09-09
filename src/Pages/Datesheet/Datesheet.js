// Datesheet.js
import React, { useEffect, useState } from "react";
import Select from "react-select";
import DynamicDatesheet from "./DynamicDatesheet";
import "./Datesheet.css"; // New CSS for Datesheet
import CourseList from "../Index/components/CourseList";
import Navbar from "../Index/components/Navbar";
import Footer from "../Footer/Footer";
import { getAccessToken } from "../../utils/auth";
import API_BASE_URL from "../../config/api";
import { fetchCSVData, clearCSVCache } from "../../services/csvDataService";

const Datesheet = () => {
  const [csvData, setCsvData] = useState([]);
  const [datesheetData, setDatesheetData] = useState([]);
  const [sections, setSections] = useState({});
  const [courses, setCourses] = useState({});
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [currentCourse, setCurrentCourse] = useState(null);
  const [csvFile, setCsvFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("");
  const [showAdminSection, setShowAdminSection] = useState(false);

  useEffect(() => {
    // Check admin status from backend
    checkAdminStatus();
    
    // Fetch CSV data from backend with caching
    Promise.all([
      fetchCSVData('courses').catch(() => 
        fetch(require("../../Assets/data/courses.csv")).then((res) => res.text())
      ),
      fetchCSVData('datesheet').catch(() => 
        fetch(require("../../Assets/data/datesheet.csv")).then((res) => res.text())
      ),
    ]).then(([coursesRaw, datesheetRaw]) => {
      const parsedCourses = parseCourses(coursesRaw);
      const parsedDatesheet = parseDatesheet(datesheetRaw);
      processCsv(parsedCourses);
      setDatesheetData(parsedDatesheet);
      setCsvData(parsedCourses);
    }).catch((err) => {
      console.error("Error loading CSV data:", err);
    });
  }, []);

  const parseCourses = (data) => {
    const rows = data.split("\n").slice(1);
    return rows.map((row) => {
      const [
        id,
        title, // Changed from course
        code, // Changed from courseCode
        section,
        instructor,
        credit_hours,
        program,
        target_department, // Changed from target_dept
        parent_department, // Changed from parent_dept
        type,
        repeat,
        ...lectures2
      ] = row.split(",");
      const lectures = lectures2.join(",");
      return {
        id,
        course: title, // Mapped title to course
        courseCode: code, // Mapped code to courseCode
        section,
        instructor,
        credit_hours,
        program,
        target_dept: target_department, // Mapped target_department to target_dept
        parent_dept: parent_department, // Mapped parent_department to parent_dept
        type,
        repeat,
        lectures,
      };
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
      if (section && course) {
        if (!coursesBySection[section]) coursesBySection[section] = [];
        coursesBySection[section].push({
          courseCode,
          course,
          section,
          type,
          repeat,
        });

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
      (row) => !selectedCourses.some((c) => c.courseCode === row.courseCode && c.section === section),
    );
    setSelectedCourses([...selectedCourses, ...unique]);
  };

  const removeCourse = (courseCode, section) => {
    setSelectedCourses(
      selectedCourses.filter((c) => !(c.courseCode === courseCode && c.section === section)),
    );
  };

  const clearAllCourses = () => {
    setSelectedCourses([]);
  };

  const checkAdminStatus = async () => {
    try {
      const token = getAccessToken();
      if (!token) {
        setShowAdminSection(false);
        return;
      }

      const response = await fetch(`${API_BASE_URL}/auth/user-role`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setShowAdminSection(data.userRole === 'Admin');
      } else {
        setShowAdminSection(false);
      }
    } catch (error) {
      console.error('Error checking admin status:', error);
      setShowAdminSection(false);
    }
  };

  const handleCsvUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) {
      setUploadStatus("Please select a file");
      return;
    }
    
    if (file.type !== "text/csv" && !file.name.endsWith('.csv')) {
      setUploadStatus("Please select a valid CSV file");
      setCsvFile(null);
      return;
    }
    
    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      setUploadStatus("File size must be less than 10MB");
      setCsvFile(null);
      return;
    }
    
    setCsvFile(file);
    setUploadStatus("");
  };

  const uploadCsv = async () => {
    if (!csvFile) {
      setUploadStatus("Please select a CSV file first");
      return;
    }

    try {
      setUploadStatus("Processing CSV file...");
      
      // Read the file content
      const fileContent = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.onerror = reject;
        reader.readAsText(csvFile);
      });

      // Validate CSV structure
      const lines = fileContent.split('\n');
      if (lines.length < 2) {
        setUploadStatus("Invalid CSV file: Must contain at least a header row and one data row");
        return;
      }

      // Check required columns for datesheet
      const header = lines[0].toLowerCase();
      const requiredColumns = ['date', 'day', 'time slot', 'course code', 'course title'];
      const missingColumns = requiredColumns.filter(col => !header.includes(col));
      
      if (missingColumns.length > 0) {
        setUploadStatus(`Invalid CSV structure: Missing required columns: ${missingColumns.join(', ')}`);
        return;
      }

      // Process the CSV data directly
      const parsedData = parseDatesheet(fileContent);
      setDatesheetData(parsedData);
      
      // Clear cache to force fresh data on next load
      clearCSVCache('datesheet');
      
      setUploadStatus("Datesheet CSV processed successfully! Data updated.");
      setCsvFile(null);
      
      // Reset file input
      const fileInput = document.getElementById('datesheet-csv-upload');
      if (fileInput) fileInput.value = '';
      
    } catch (error) {
      console.error("CSV processing error:", error);
      setUploadStatus("Error processing CSV file");
    }
  };

  return (
    <div>
      <Navbar />
      <div className="datesheet-container">
        <h1 className="header">Datesheet Generator</h1>
        
        {/* Admin-only CSV upload section */}
        {showAdminSection && (
          <div className="admin-section">
            <h3>Admin Controls</h3>
            <div className="csv-upload-container">
              <input
                type="file"
                id="datesheet-csv-upload"
                accept=".csv"
                onChange={handleCsvUpload}
              />
              <button 
                onClick={uploadCsv}
                disabled={!csvFile}
                className="upload-button"
              >
                Process Datesheet CSV
              </button>
              {uploadStatus && (
                <div className={`upload-status ${uploadStatus.includes('success') ? 'success' : uploadStatus.includes('failed') || uploadStatus.includes('error') ? 'error' : 'info'}`}>
                  {uploadStatus}
                </div>
              )}
            </div>
          </div>
        )}

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
