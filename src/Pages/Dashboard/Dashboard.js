import React, { useEffect, useState } from "react";
import "./Dashboard.css";
import Navbar from "../Index/components/Navbar";
import Shahzebpic from "../../Assets/images/Shahzeb Mubashar (lesser size).webp";
//  Yelo
function AcademicDashboard() {
  const [courses, setCourses] = useState([
    { name: "Course 1", credits: 3, grade: "A" },
    { name: "Course 2", credits: 4, grade: "B+" },
    { name: "Course 3", credits: 3, grade: "A-" },
  ]);
  const [newCourse, setNewCourse] = useState({
    name: "",
    credits: 3,
    grade: "A",
  });
  const [User, setUser] = useState(null);
  const [editData, setEditData] = useState({
    name: "",
    degree: "",
    batch: "",
  });


  const gradePoints = {
    "A+": 4.0,
    A: 4.0,
    "A-": 3.7,
    "B+": 3.3,
    B: 3.0,
    "B-": 2.7,
    "C+": 2.3,
    C: 2.0,
    "C-": 1.7,
    "D+": 1.3,
    D: 1.0,
    "D-": 0.7,
    F: 0.0,
  };

  const calculateGPA = () => {
    if (courses.length === 0) return 0;
    let totalPoints = 0;
    let totalCredits = 0;

    courses.forEach((course) => {
      totalPoints += course.credits * gradePoints[course.grade];
      totalCredits += course.credits;
    });

    return totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : 0;
  };

  const addCourse = () => {
    if (newCourse.name.trim()) {
      setCourses([...courses, { ...newCourse }]);
      setNewCourse({ name: "", credits: 3, grade: "A" });
    }
  };

  const removeCourse = (index) => {
    const updatedCourses = [...courses];
    updatedCourses.splice(index, 1);
    setCourses(updatedCourses);
  };

  // const fetchEditProfile = async () => {
  //   try {
  //     const res = await fetch("http://localhost:4000/user/profile", {
  //       credentials: "include",
  //       method: "PUT",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify(editData),
  //     });

  //     const contentType = res.headers.get("content-type");
  //     if (!contentType || !contentType.includes("application/json")) {
  //       const text = await res.text();
  //       throw new Error(text || "Non-JSON response received");
  //     }

  //     const data = await res.json();

  //     if (!res.ok) {
  //       throw new Error(data.message || "Update failed");
  //     }

  //     setUser(data);
  //     setIsEditing(false);
  //     window.location.reload();
  //   } catch (error) {
  //     console.error("Update failed:", error.message);
  //   }
  // };

  const fetchUserInfo = async () => {
    try {
      const res = await fetch(`http://localhost:4000/User/profile`, {
        credentials: "include",
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        console.log(`Error`);
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();

      if (data) setUser(data);
      else setUser(null);
    } catch (error) {
      console.error("Error Fetching User Info:", error.message);
    }
  };

  useEffect(() => {
    fetchUserInfo();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCourse({
      ...newCourse,
      [name]: name === "credits" ? parseInt(value) || 0 : value,
    });
  };

  return (
    <div className="academic-dashboard">
      <Navbar />
      <div className="dashboardcontainer">
        {/* User Profile Section */}
        <section className="user-profile-section">
          <img src={Shahzebpic} alt="Profile" className="profile-picture" />
          <div className="user-info">
            <h1 className="user-name">{User?.name || "Loading..."}</h1>
            <h5 className="user-name-username">
              @{User?.username || "Loading..."}
            </h5>
            <div className="user-details">
              <div className="user-detail-item">
                <span className="user-detail-icon">📧</span>
                <span>{User?.email || "Loading..."}</span>
              </div>
              <div className="user-detail-item">
                <span className="user-detail-icon">🎓</span>
                <span>Roll No: {User?.rollnumber || "Loading..."}</span>
              </div>
            </div>
            <div className="academic-info">
              <div className="degree-badge">
                <span>🎓</span>
                <span>B.Sc Computer Science</span>
              </div>
              <div className="cgpa-badge">
                <span>📊</span>
                <span>CGPA: 3.85</span>
              </div>
              <div className="semester-badge">
                <span>📅</span>
                <span>Semester 6</span>
              </div>
              <div className="profile-actions">
                <button
                  className="profile-action-btn edit-profile"
                  onClick={() => window.location.href = '/profile'}
                >
                  <span className="action-icon">✏️</span>
                  Edit Profile
                </button>
                <button className="profile-action-btn change-password">
                  <span className="action-icon">🔒</span>
                  Change Password
                </button>
                <button className="profile-action-btn settings">
                  <span className="action-icon">⚙️</span>
                  Settings
                </button>
              </div>
            </div>
          </div>

        </section>

        {/* My Courses */}
        <section className="courses-section">
          <div className="section-header">
            <h2>📘 My Courses</h2>
            <a href="#" className="view-all">
              View all
            </a>
          </div>
          <div className="courses-grid">
            {[
              {
                title: "Cinema 4D",
                desc: "Elements design for websites and apps",
                progress: "08/12",
                percent: 66,
              },
              {
                title: "UI/UX Design",
                desc: "From concept to prototype",
                progress: "04/15",
                percent: 27,
              },
              {
                title: "Graphic Design",
                desc: "Digital computer graphics",
                progress: "01/10",
                percent: 10,
              },
            ].map((course, i) => (
              <div className="course-card" key={i}>
                <div className="course-content">
                  <h3>{course.title}</h3>
                  <p>{course.desc}</p>
                  <div className="progress-container">
                    <div className="progress-text">{course.progress}</div>
                    <div className="progress-bar">
                      <div
                        className="progress-fill"
                        style={{ width: `${course.percent}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
                <div className="course-arrow">
                  <svg viewBox="0 0 24 24">
                    <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
                  </svg>
                </div>
              </div>
            ))}

            <div className="course-card add-card">
              <div className="add-content">
                <div className="add-icon">+</div>
                <div>Add</div>
              </div>
            </div>
          </div>
        </section>

        {/* Upcoming Deadlines */}
        <section className="deadlines-section">
          <div className="section-header">
            <h2>⏰ Upcoming Deadlines</h2>
            <a href="#" className="view-all">
              View all
            </a>
          </div>
          <div className="deadlines-list">
            {[
              {
                title: "Database Systems Assignment",
                dueDate: "2024-03-15",
                course: "CS-301",
                priority: "high",
              },
              {
                title: "Software Engineering Project",
                dueDate: "2024-03-20",
                course: "CS-401",
                priority: "medium",
              },
            ].map((deadline, index) => (
              <div
                key={index}
                className="deadline-card"
                onClick={() => (window.location.href = "/assignment-details")}
              >
                <div className="deadline-content">
                  <h3>{deadline.title}</h3>
                  <div className="deadline-meta">
                    <span className="course-code">{deadline.course}</span>
                    <span className="due-date">
                      <span className="icon">📅</span>
                      {new Date(deadline.dueDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div
                  className={`priority-indicator ${deadline.priority}`}
                ></div>
              </div>
            ))}
          </div>
        </section>

        {/* Bottom Sections */}
        <div className="bottom-sections">
          {/* GPA Section */}
          <div className="gpa-calculator-section">
            <div className="section-header">
              <h2>🎓 GPA Calculator</h2>
            </div>

            <div className="gpa-card">
              <div className="gpa-display">
                <div className="gpa-circle">
                  <span className="gpa-value">{calculateGPA()}</span>
                  <span className="gpa-label">GPA</span>
                </div>
              </div>

              <div className="gpa-courses">
                <div className="course-list">
                  {courses.slice(0, 2).map((course, index) => (
                    <div
                      key={index}
                      className="course-item"
                      onClick={() => (window.location.href = "/course-details")}
                    >
                      <div className="course-details">
                        <span className="course-name">{course.name}</span>
                        <div className="course-meta">
                          <span>{course.credits} credits</span>
                          <span className="course-grade">{course.grade}</span>
                        </div>
                      </div>
                      <button
                        className="remove-course"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeCourse(index);
                        }}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>

                <div className="add-course-form">
                  <input
                    type="text"
                    name="name"
                    placeholder="Course name"
                    value={newCourse.name}
                    onChange={handleInputChange}
                    className="course-input"
                  />
                  <div className="course-form-row">
                    <select
                      name="credits"
                      value={newCourse.credits}
                      onChange={handleInputChange}
                      className="credits-select"
                    >
                      {[1, 2, 3, 4, 5].map((credit) => (
                        <option key={credit} value={credit}>
                          {credit} credits
                        </option>
                      ))}
                    </select>
                    <select
                      name="grade"
                      value={newCourse.grade}
                      onChange={handleInputChange}
                      className="grade-select"
                    >
                      {Object.keys(gradePoints).map((grade) => (
                        <option key={grade} value={grade}>
                          {grade}
                        </option>
                      ))}
                    </select>
                    <button className="add-course-btn" onClick={addCourse}>
                      Add
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Chatrooms Section */}
          <div className="chatrooms-section">
            <div className="section-header">
              <h2>💬 Chatrooms Joined</h2>
              <a href="#" className="view-all">
                View all
              </a>
            </div>

            <div className="chatrooms-list">
              {[
                {
                  title: "UI/UX Design Group",
                  members: 32,
                  online: 5,
                  active: true,
                },
                {
                  title: "Cinema 4D Beginners",
                  members: 18,
                  online: 2,
                  active: false,
                },
                {
                  title: "Graphic Design Portfolio",
                  members: 45,
                  online: 8,
                  active: true,
                },
              ].map((room, i) => (
                <div className="chatroom-card" key={i}>
                  <div className="chatroom-icon">
                    <svg viewBox="0 0 24 24">
                      <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z" />
                    </svg>
                  </div>
                  <div className="chatroom-info">
                    <h3>{room.title}</h3>
                    <p>
                      {room.members} members • {room.online} online
                    </p>
                  </div>
                  <div
                    className={`chatroom-status ${room.active ? "active" : ""}`}
                  ></div>
                </div>
              ))}

              <div className="chatroom-card add-chatroom">
                <div className="add-icon">+</div>
                <span>Join new chatroom</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AcademicDashboard;
