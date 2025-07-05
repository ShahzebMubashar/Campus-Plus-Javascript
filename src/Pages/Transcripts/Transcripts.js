import React, { useState, useEffect, useRef } from "react";
import "./Transcripts.css";
import Navbar from "../Index/components/Navbar";
import { FaBars } from "react-icons/fa";

const gradePoints = {
  I: null, // In-progress courses (excluded from GPA)
  "A+": 4.0,
  A: 4.0,
  "A-": 3.67,
  "B+": 3.33,
  B: 3.0,
  "B-": 2.67,
  "C+": 2.33,
  C: 2.0,
  "C-": 1.67,
  "D+": 1.33,
  D: 1.0,
  F: 0.0,
};

function TranscriptsPage() {
  const [semesters, setSemesters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showError, setShowError] = useState(false);
  const [user, setUser] = useState(null);
  const [newSemester, setNewSemester] = useState({ name: "", year: "" });
  const [newCourse, setNewCourse] = useState({
    semesterId: "",
    semesterName: "",
    code: "",
    name: "",
    credits: 3,
    grade: "A",
  });
  const [showAddSemesterModal, setShowAddSemesterModal] = useState(false);
  const [showAddCourseModal, setShowAddCourseModal] = useState(false);
  const [confirmDeleteSemester, setConfirmDeleteSemester] = useState(null);
  const [selectedSemesterId, setSelectedSemesterId] = useState(null);
  const semesterRefs = useRef({});
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLargeScreen, setIsLargeScreen] = useState(
    window.matchMedia("(min-width: 901px)").matches,
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 901px)");
    const handleResize = () => setIsLargeScreen(mediaQuery.matches);
    mediaQuery.addEventListener("change", handleResize);
    return () => mediaQuery.removeEventListener("change", handleResize);
  }, []);

  // Fetch data on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // First try to get OAuth user info
        const oauthRes = await fetch("http://localhost:4000/auth/current-user", {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });

        let userData = null;
        if (oauthRes.ok) {
          const oauthData = await oauthRes.json();
          if (oauthData.isAuthenticated) {
            // OAuth user - fetch additional profile data
            const profileRes = await fetch("http://localhost:4000/User/profile", {
              credentials: "include",
            });
            userData = profileRes.ok ? await profileRes.json() : null;
          }
        }

        // If not OAuth user, try regular session-based authentication
        if (!userData) {
          const userRes = await fetch("http://localhost:4000/User/profile", {
            credentials: "include",
          });
          userData = userRes.ok ? await userRes.json() : null;
        }

        // Fetch transcript data
        const transcriptRes = await fetch("http://localhost:4000/Transcripts/", {
          credentials: "include",
        });

        if (!transcriptRes.ok) {
          // If transcript not found or error, set empty array
          setSemesters([]);
          setUser(userData);
          return;
        }

        const transcriptData = await transcriptRes.json();

        // Ensure transcriptData is an array
        if (Array.isArray(transcriptData)) {
          setSemesters(transcriptData);
          // Set the first semester as selected by default if available
          if (transcriptData.length > 0 && !selectedSemesterId) {
            setSelectedSemesterId(transcriptData[0].id);
          }
        } else {
          // If response is not an array, set empty array
          setSemesters([]);
        }
        setUser(userData);
      } catch (err) {
        setError(err.message);
        setShowError(true);
        setTimeout(() => setShowError(false), 5000);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [selectedSemesterId]);

  // When selectedSemesterId changes, scroll to that semester card
  useEffect(() => {
    if (selectedSemesterId && semesterRefs.current[selectedSemesterId]) {
      semesterRefs.current[selectedSemesterId].scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [selectedSemesterId]);

  // GPA Calculations (excludes "I" grades)
  const calculateCourseGPA = (grade) =>
    grade === "I" ? "In Progress" : gradePoints[grade]?.toFixed(2) || "0.00";

  const calculateSGPA = (courses) => {
    // Ensure courses is an array before using reduce
    if (!Array.isArray(courses)) {
      return "0.00";
    }

    const { totalPoints, totalCredits } = courses.reduce(
      (acc, course) => {
        if (course.grade === "I") return acc;
        return {
          totalPoints:
            acc.totalPoints + (gradePoints[course.grade] || 0) * course.credits,
          totalCredits: acc.totalCredits + course.credits,
        };
      },
      { totalPoints: 0, totalCredits: 0 },
    );
    return totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : "0.00";
  };

  const calculateCGPA = () => {
    // Ensure semesters is an array before using reduce
    if (!Array.isArray(semesters)) {
      return "0.00";
    }

    const { totalPoints, totalCredits } = semesters.reduce(
      (acc, semester) => ({
        totalPoints:
          acc.totalPoints +
          (Array.isArray(semester.courses) ? semester.courses.reduce(
            (sum, course) =>
              course.grade === "I"
                ? sum
                : sum + (gradePoints[course.grade] || 0) * course.credits,
            0,
          ) : 0),
        totalCredits:
          acc.totalCredits +
          (Array.isArray(semester.courses) ? semester.courses.reduce(
            (sum, course) =>
              course.grade === "I" ? sum : sum + course.credits,
            0,
          ) : 0),
      }),
      { totalPoints: 0, totalCredits: 0 },
    );
    return totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : "0.00";
  };

  // Course/Semester Management
  const handleAddSemester = async () => {
    if (!newSemester.name || !newSemester.year) return;
    try {
      const res = await fetch(
        "http://localhost:4000/Transcripts/add-semester",
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: `${newSemester.name} ${newSemester.year}`,
          }),
        },
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setSemesters([...semesters, data]);
      setShowAddSemesterModal(false);
    } catch (err) {
      setError(err.message);
      setShowError(true);
    }
  };

  const handleAddCourse = async () => {
    if (!newCourse.code.trim() || !newCourse.name.trim()) {
      setError("Course code and name required");
      setShowError(true);
      return;
    }

    try {
      const res = await fetch("http://localhost:4000/Transcripts/add-course", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          coursecode: newCourse.code.trim(),
          coursename: newCourse.name.trim(),
          credits: parseInt(newCourse.credits),
          grade: newCourse.grade,
          semester: newCourse.semesterName,
        }),
      });
      if (!res.ok) throw new Error((await res.json()).message);
      const updated = await fetch("http://localhost:4000/Transcripts/", {
        credentials: "include",
      }).then((r) => r.json());
      setSemesters(updated);
      setShowAddCourseModal(false);
    } catch (err) {
      setError(err.message);
      setShowError(true);
    }
  };

  const handleRemoveCourse = async (semesterId, courseId) => {
    try {
      await fetch(
        `http://localhost:4000/Transcripts/remove-course/${courseId}`,
        {
          method: "DELETE",
          credentials: "include",
        },
      );
      setSemesters(
        semesters.map((semester) =>
          semester.id === semesterId
            ? {
              ...semester,
              courses: semester.courses.filter((c) => c.id !== courseId),
            }
            : semester,
        ),
      );
    } catch (err) {
      setError(err.message);
      setShowError(true);
    }
  };

  const handleRemoveSemester = async (semesterId) => {
    try {
      await fetch(
        `http://localhost:4000/Transcripts/remove-semester/${semesterId}`,
        {
          method: "DELETE",
          credentials: "include",
        },
      );
      setSemesters(semesters.filter((s) => s.id !== semesterId));
      setConfirmDeleteSemester(null);
    } catch (err) {
      setError(err.message);
      setShowError(true);
    }
  };

  // Function to get user's initials from name or username
  const getUserInitials = () => {
    // Try to use name first, then fallback to username if available
    const displayName = user?.name || user?.username || "";

    if (!displayName) return "U";

    return displayName
      .split(" ")
      .filter((_, index, array) => index === 0 || index === array.length - 1)
      .map((name) => name[0])
      .join("")
      .toUpperCase();
  };

  if (loading) return <div className="loading">Loading transcript data...</div>;

  return (
    <div className="transcripts-layout">
      {/* Sidebar for large screens only */}
      {isLargeScreen && (
        <aside className="transcripts-sidebar desktop-sidebar">
          <div className="sidebar-profile">
            <div className="lms-profile-avatar">{getUserInitials()}</div>
            <h2>{user?.name || "Student"}</h2>
          </div>
          <hr />
          <div className="sidebar-cgpa-section">
            <span>CGPA</span>
            <span className="cgpa-value">{calculateCGPA()}</span>
          </div>
          <hr />
          <ul className="sidebar-semesters-list">
            {Array.isArray(semesters) && semesters.map((semester) => (
              <li
                key={semester.id}
                className={selectedSemesterId === semester.id ? "selected" : ""}
                onClick={() => setSelectedSemesterId(semester.id)}
              >
                <div className="sidebar-semester-name">{semester.name}</div>
                <div className="sidebar-semester-sgpa">
                  SGPA: {calculateSGPA(semester.courses)}
                </div>
              </li>
            ))}
          </ul>
        </aside>
      )}
      {/* Main Content */}
      <div className="transcripts-container">
        <Navbar />
        {showError && (
          <div className="error-banner">
            {error}
            <button onClick={() => setShowError(false)}>×</button>
          </div>
        )}

        <h1>Academic Transcript</h1>
        <div className="gpa-summary">
          <h3>
            CGPA: <span>{calculateCGPA()}</span>
          </h3>
          <p>
            <em>
              Note: In-progress courses (I) are excluded from GPA calculations
            </em>
          </p>
        </div>

        <button
          className="add-semester-btn"
          onClick={() => setShowAddSemesterModal(true)}
        >
          Add New Semester
        </button>

        {!Array.isArray(semesters) || semesters.length === 0 ? (
          <p className="no-semesters">
            No semesters found. Add a semester to get started.
          </p>
        ) : (
          semesters.map((semester) => (
            <div
              key={semester.id}
              className={`semester-card${selectedSemesterId === semester.id ? " selected" : ""}`}
              ref={(el) => (semesterRefs.current[semester.id] = el)}
            >
              <div
                className="semester-header"
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: "10px",
                }}
              >
                <h2>{semester.name}</h2>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    flexWrap: "wrap",
                  }}
                >
                  <span className="semester-gpa">
                    SGPA: {calculateSGPA(semester.courses)}
                  </span>
                  <div
                    className="semester-actions"
                    style={{ display: "flex", gap: "8px" }}
                  >
                    <button
                      className="add-course-btn"
                      onClick={() => {
                        setNewCourse({
                          semesterId: semester.id,
                          semesterName: semester.name,
                          code: "",
                          name: "",
                          credits: 3,
                          grade: "A",
                        });
                        setShowAddCourseModal(true);
                      }}
                    >
                      Add Course
                    </button>
                    <button
                      className="remove-semester-btn"
                      onClick={() => setConfirmDeleteSemester(semester.id)}
                    >
                      Remove Semester
                    </button>
                  </div>
                </div>
              </div>

              {confirmDeleteSemester === semester.id && (
                <div className="delete-confirmation">
                  <p>Delete this semester and all its courses?</p>
                  <button onClick={() => handleRemoveSemester(semester.id)}>
                    Confirm
                  </button>
                  <button onClick={() => setConfirmDeleteSemester(null)}>
                    Cancel
                  </button>
                </div>
              )}

              {Array.isArray(semester.courses) && semester.courses.length > 0 ? (
                <table className="courses-table">
                  <thead>
                    <tr>
                      <th>Code</th>
                      <th>Course</th>
                      <th>Credits</th>
                      <th>Grade</th>
                      <th>Points</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {semester.courses.map((course) => (
                      <tr
                        key={course.id}
                        className={course.grade === "I" ? "in-progress" : ""}
                      >
                        <td>{course.code}</td>
                        <td>{course.name}</td>
                        <td>{course.credits}</td>
                        <td>{course.grade}</td>
                        <td>{calculateCourseGPA(course.grade)}</td>
                        <td>
                          <button
                            className="remove-btn"
                            onClick={() =>
                              handleRemoveCourse(semester.id, course.id)
                            }
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="no-courses">No courses in this semester</p>
              )}
            </div>
          ))
        )}

        {/* Add Semester Modal */}
        {showAddSemesterModal && (
          <div className="modal">
            <div className="modal-content">
              <h2>Add Semester</h2>
              <div className="form-group">
                <label>Term:</label>
                <select
                  value={newSemester.name}
                  onChange={(e) =>
                    setNewSemester({ ...newSemester, name: e.target.value })
                  }
                >
                  <option value="">Select Term</option>
                  <option value="Spring">Spring</option>
                  <option value="Summer">Summer</option>
                  <option value="Fall">Fall</option>
                </select>
              </div>
              <div className="form-group">
                <label>Year:</label>
                <input
                  type="number"
                  value={newSemester.year}
                  onChange={(e) =>
                    setNewSemester({ ...newSemester, year: e.target.value })
                  }
                  placeholder="2023"
                  min="2000"
                />
              </div>
              <div className="modal-actions">
                <button onClick={handleAddSemester}>Add</button>
                <button onClick={() => setShowAddSemesterModal(false)}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Add Course Modal */}
        {showAddCourseModal && (
          <div className="modal">
            <div className="modal-content">
              <h2>Add Course to {newCourse.semesterName}</h2>
              <div className="form-group">
                <label>Course Code:</label>
                <input
                  type="text"
                  value={newCourse.code}
                  onChange={(e) =>
                    setNewCourse({ ...newCourse, code: e.target.value })
                  }
                  placeholder="CS101"
                />
              </div>
              <div className="form-group">
                <label>Course Name:</label>
                <input
                  type="text"
                  value={newCourse.name}
                  onChange={(e) =>
                    setNewCourse({ ...newCourse, name: e.target.value })
                  }
                  placeholder="Introduction to Programming"
                />
              </div>
              <div className="form-group">
                <label>Credits:</label>
                <input
                  type="number"
                  value={newCourse.credits}
                  onChange={(e) =>
                    setNewCourse({ ...newCourse, credits: e.target.value })
                  }
                  min="1"
                  max="5"
                />
              </div>
              <div className="form-group">
                <label>Grade:</label>
                <select
                  value={newCourse.grade}
                  onChange={(e) =>
                    setNewCourse({ ...newCourse, grade: e.target.value })
                  }
                >
                  <option value="I">In Progress (I)</option>
                  {Object.keys(gradePoints)
                    .filter((g) => g !== "I")
                    .map((grade) => (
                      <option key={grade} value={grade}>
                        {grade}
                      </option>
                    ))}
                </select>
              </div>
              <div className="modal-actions">
                <button onClick={handleAddCourse}>Add</button>
                <button onClick={() => setShowAddCourseModal(false)}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default TranscriptsPage;
