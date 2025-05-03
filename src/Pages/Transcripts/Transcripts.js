import React, { useState, useEffect } from "react";
import "./Transcripts.css";
import Navbar from "../Index/components/Navbar";

const gradePoints = {
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

  const [newSemester, setNewSemester] = useState({
    name: "",
    year: "",
  });

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
  const semesterRefs = React.useRef({});

  useEffect(() => {
    if (selectedSemesterId && semesterRefs.current[selectedSemesterId]) {
      semesterRefs.current[selectedSemesterId].scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [selectedSemesterId]);

  useEffect(() => {
    const fetchTranscript = async () => {
      try {
        const response = await fetch("http://localhost:4000/Transcripts/", {
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.message || "Failed to fetch transcript data"
          );
        }

        const data = await response.json();
        setSemesters(data);
      } catch (err) {
        console.error("Error fetching transcript:", err);
        setError(err.message);
        setShowError(true);
        setTimeout(() => setShowError(false), 5000);
      } finally {
        setLoading(false);
      }
    };

    fetchTranscript();
  }, []);

  const calculateCourseGPA = (grade) => gradePoints[grade] || 0.0;

  const calculateSGPA = (courses) => {
    const { totalPoints, totalCredits } = courses.reduce(
      (acc, course) => ({
        totalPoints:
          acc.totalPoints + gradePoints[course.grade] * course.credits,
        totalCredits: acc.totalCredits + course.credits,
      }),
      { totalPoints: 0, totalCredits: 0 }
    );

    return totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : "0.00";
  };

  const calculateCGPA = () => {
    const { totalPoints, totalCredits } = semesters.reduce(
      (acc, semester) => ({
        totalPoints:
          acc.totalPoints +
          semester.courses.reduce(
            (sum, course) => sum + gradePoints[course.grade] * course.credits,
            0
          ),
        totalCredits:
          acc.totalCredits +
          semester.courses.reduce((sum, course) => sum + course.credits, 0),
      }),
      { totalPoints: 0, totalCredits: 0 }
    );

    return totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : "0.00";
  };

  const handleAddSemester = async () => {
    if (!newSemester.name || !newSemester.year) return;

    const semesterName = `${newSemester.name} ${newSemester.year}`;

    try {
      const response = await fetch(
        "http://localhost:4000/Transcripts/add-semester",
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: semesterName }),
        }
      );

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to add semester");

      setSemesters((prev) => [...prev, data]);
      setNewSemester({ name: "", year: "" });
      setShowAddSemesterModal(false);
    } catch (err) {
      console.error("Error adding semester:", err);
      setError(err.message);
      setShowError(true);
      setTimeout(() => setShowError(false), 5000);
    }
  };

  const handleAddCourse = async () => {
    if (!newCourse.semesterName) {
      setError("No semester selected");
      setShowError(true);
      return;
    }
    if (!newCourse.code?.trim()) {
      setError("Course code required");
      setShowError(true);
      return;
    }
    if (!newCourse.name?.trim()) {
      setError("Course name required");
      setShowError(true);
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:4000/Transcripts/add-course",
        {
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
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to add course");
      }

      const updated = await fetch("http://localhost:4000/Transcripts/", {
        credentials: "include",
      }).then((res) => res.json());

      setSemesters(updated);
      setNewCourse((prev) => ({
        semesterId: prev.semesterId,
        semesterName: prev.semesterName,
        code: "",
        name: "",
        credits: 3,
        grade: "A",
      }));
      setShowAddCourseModal(false);
    } catch (err) {
      console.error("Add course failed:", err);
      setError(err.message);
      setShowError(true);
    }
  };

  const handleRemoveCourse = async (semesterId, transcriptId) => {
    try {
      const response = await fetch(
        `http://localhost:4000/Transcripts/remove-course/${transcriptId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to remove course");
      }

      setSemesters((prev) =>
        prev.map((semester) =>
          semester.id === semesterId
            ? {
              ...semester,
              courses: semester.courses.filter(
                (course) => course.id !== transcriptId
              ),
            }
            : semester
        )
      );
    } catch (err) {
      console.error("Error removing course:", err);
      setError(err.message);
      setShowError(true);
      setTimeout(() => setShowError(false), 5000);
    }
  };

  const handleRemoveSemester = async (semesterId) => {
    try {
      const encodedName = encodeURIComponent(semesterId);

      const response = await fetch(
        `http://localhost:4000/Transcripts/remove-semester/${semesterId}`,
        { method: "DELETE", credentials: "include" }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to remove semester");
      }

      setSemesters((prev) =>
        prev.filter((semester) => semester.id !== semesterId)
      );
      setConfirmDeleteSemester(null);
    } catch (err) {
      console.error("Error removing semester:", err);
      setError(err.message);
      setShowError(true);
      setTimeout(() => setShowError(false), 5000);
    }
  };

  if (loading) return <div className="loading">Loading transcript data...</div>;

  return (
    <div className="transcripts-layout">
      {/* Sidebar for summary */}
      <aside className="transcripts-sidebar">
        <div className="sidebar-header">
          <h2>Transcript Summary</h2>
          <div className="sidebar-cgpa">
            <span>CGPA</span>
            <span className="cgpa-value">{calculateCGPA()}</span>
          </div>
        </div>
        <ul className="sidebar-semesters-list">
          {semesters.map((semester) => (
            <li
              key={semester.id}
              className={`sidebar-semester-item${selectedSemesterId === semester.id ? " selected" : ""}`}
              onClick={() => setSelectedSemesterId(semester.id)}
              style={{ cursor: "pointer" }}
            >
              <div className="sidebar-semester-name">{semester.name}</div>
              <div className="sidebar-semester-sgpa">
                SGPA: <span>{calculateSGPA(semester.courses)}</span>
              </div>
            </li>
          ))}
        </ul>
      </aside>

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
        </div>

        <button
          className="add-semester-btn"
          onClick={() => setShowAddSemesterModal(true)}
        >
          Add New Semester
        </button>

        {semesters.length === 0 ? (
          <p className="no-semesters">
            No semesters found. Add a semester to get started.
          </p>
        ) : (
          semesters.map((semester) => (
            <div
              key={semester.id}
              className={`semester-card${selectedSemesterId === semester.id ? " selected" : ""}`}
              ref={el => (semesterRefs.current[semester.id] = el)}
            >
              <div className="semester-header">
                <div className="semester-title">
                  <h2>{semester.name}</h2>
                  <span className="semester-gpa">
                    SGPA: {calculateSGPA(semester.courses)}
                  </span>
                </div>
                <div className="semester-actions">
                  <button
                    className="add-course-btn"
                    onClick={() => {
                      setNewCourse({
                        semesterId: semester.semesterId,
                        semesterName: semester.name || semester.semesterName,
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

              {confirmDeleteSemester === semester.id && (
                <div className="delete-confirmation">
                  <p>
                    Are you sure you want to delete this semester and all its
                    courses?
                  </p>
                  <div>
                    <button
                      className="confirm-delete-btn"
                      onClick={() => handleRemoveSemester(semester.id)}
                    >
                      Yes, Delete
                    </button>
                    <button
                      className="cancel-delete-btn"
                      onClick={() => setConfirmDeleteSemester(null)}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {semester.courses.length > 0 ? (
                <table className="courses-table">
                  <thead>
                    <tr>
                      <th>Code</th>
                      <th>Course Name</th>
                      <th>Credits</th>
                      <th>Grade</th>
                      <th>GPA Points</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {semester.courses.map((course) => (
                      <tr key={`${semester.id}-${course.id}`}>
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
                <p className="no-courses">No courses added for this semester</p>
              )}
            </div>
          ))
        )}

        {/* Add Semester Modal */}
        {showAddSemesterModal && (
          <div className="modal">
            <div className="modal-content">
              <h2>Add New Semester</h2>
              <div className="form-group">
                <label>Semester:</label>
                <select
                  value={newSemester.name}
                  onChange={(e) =>
                    setNewSemester((prev) => ({ ...prev, name: e.target.value }))
                  }
                >
                  <option value="">Select Semester</option>
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
                    setNewSemester((prev) => ({ ...prev, year: e.target.value }))
                  }
                  placeholder="2023"
                  min="2000"
                  max="2100"
                />
              </div>
              <div className="modal-actions">
                <button onClick={handleAddSemester}>Add Semester</button>
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
              <h2>Add New Course</h2>
              <div className="form-group">
                <label>Course Code:</label>
                <input
                  type="text"
                  value={newCourse.code}
                  onChange={(e) =>
                    setNewCourse((prev) => ({ ...prev, code: e.target.value }))
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
                    setNewCourse((prev) => ({ ...prev, name: e.target.value }))
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
                    setNewCourse((prev) => ({ ...prev, credits: e.target.value }))
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
                    setNewCourse((prev) => ({ ...prev, grade: e.target.value }))
                  }
                >
                  {Object.keys(gradePoints).map((grade) => (
                    <option key={grade} value={grade}>
                      {grade}
                    </option>
                  ))}
                </select>
              </div>
              <div className="modal-actions">
                <button onClick={handleAddCourse}>Add Course</button>
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
