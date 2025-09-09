import React, { useEffect, useState } from "react";
import CourseList from "../Index/components/CourseList";
import Navbar from "../Index/components/Navbar";
import DynamicTimetable from "./DynamicTimetable";
import Footer from "../Footer/Footer";
import Select from "react-select"; // React-Select for searchable dropdowns
import "./Timetable.css";
import { getAccessToken } from "../../utils/auth";
import { fetchCSVData, clearCSVCache } from "../../services/csvDataService";
import API_BASE_URL from "../../config/api";

const Timetable = () => {
  const [csvData, setCsvData] = useState([]);
  const [sections, setSections] = useState({});
  const [courses, setCourses] = useState({});
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [currentCourse, setCurrentCourse] = useState(null);
  const [csvFile, setCsvFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("");
  const [showAdminSection, setShowAdminSection] = useState(false);

  useEffect(() => {
    document.title = "Timetable | Campus Plus";
  }, []);

  useEffect(() => {
    // Check admin status from backend
    checkAdminStatus();

    // Fetch CSV data from backend with caching
    fetchCSVData('courses')
      .then((data) => processCsv(parseCsvData(data)))
      .catch((err) => {
        console.error("Error loading CSV:", err);
        // Fallback to local file if backend fails
        fetch(require("../../Assets/data/courses.csv"))
          .then((response) => response.text())
          .then((data) => processCsv(parseCsvData(data)))
          .catch((fallbackErr) => console.error("Fallback CSV load failed:", fallbackErr));
      });
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

      // Check required columns
      const header = lines[0].toLowerCase();
      const requiredColumns = ['id', 'title', 'code', 'section', 'instructor'];
      const missingColumns = requiredColumns.filter(col => !header.includes(col));

      if (missingColumns.length > 0) {
        setUploadStatus(`Invalid CSV structure: Missing required columns: ${missingColumns.join(', ')}`);
        return;
      }

      // Process the CSV data directly
      const parsedData = parseCsvData(fileContent);
      processCsv(parsedData);

      // Clear cache to force fresh data on next load
      clearCSVCache('courses');

      setUploadStatus("CSV processed successfully! Data updated.");
      setCsvFile(null);

      // Reset file input
      const fileInput = document.getElementById('csv-upload');
      if (fileInput) fileInput.value = '';

    } catch (error) {
      console.error("CSV processing error:", error);
      setUploadStatus("Error processing CSV file");
    }
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

        {/* Admin-only CSV upload section */}
        {showAdminSection && (
          <div className="admin-section">
            <h3>Admin Controls</h3>
            <div className="csv-upload-container">
              <input
                type="file"
                id="csv-upload"
                accept=".csv"
                onChange={handleCsvUpload}
              />
              <button
                onClick={uploadCsv}
                disabled={!csvFile}
                className="upload-button"
              >
                Process CSV File
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
