import React, { useEffect, useState } from "react";
import "./Dashboard.css";
import Navbar from "../Index/components/Navbar";
import Shahzebpic from "../../Assets/images/Shahzeb Mubashar (lesser size).webp";

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
  const [User, setUser] = useState({});
  const [currentCourses, setCurrentCourses] = useState([]);
  const [myRooms, setMyRooms] = useState([]);

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

  const fetchCurrentCourses = async () => {
    try {
      const res = await fetch("http://localhost:4000/user/current-courses", {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        throw new Error(`HTTP Error! Status: ${res.status}`);
      }

      const data = await res.json();
      setCurrentCourses(data);
    } catch (error) {
      console.error("Error fetching courses:", error.message);
    }
  };

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
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      setUser(data);
    } catch (error) {
      console.error("Error Fetching User Info:", error.message);
    }
  };

  const [tasks, setTodos] = useState([]);

  // Fetch tasks from backend
  const fetchTasks = async () => {
    try {
      const res = await fetch("http://localhost:4000/user/my-reminders", {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        setTodos([]);
        throw new Error("Failed to fetch tasks");
      }

      const data = await res.json();
      if (data) {
        setTodos(
          data.map((task) => ({
            id: task.taskid,
            title: task.content, // Changed from 'text' to 'title' to match deadlines structure
            completed: task.status,
            priority: task.priority.toLowerCase(),
            dueDate: new Date(task.duedate).toISOString().split("T")[0],
            dueTime: new Date(task.duedate).toTimeString().substring(0, 5),
            course: "Task", // Added to match deadlines structure
          }))
        );
        console.log(data);
      } else {
        setTodos([]);
      }
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [User?.userid]);

  const fetchJoinedRooms = async () => {
    try {
      const result = await fetch(
        `http://localhost:4000/Chatrooms/my-rooms/${User.userid}`,
        { credentials: "include" }
      );
      const data = await result.json();

      const formattedRooms = data.map((room) => ({
        title: room.name || "Unnamed Room",
        desc: room.description || "No description",
        online: Math.floor(Math.random() * 10),
        active: Math.random() > 0.5,
      }));

      setMyRooms(formattedRooms);
    } catch (error) {
      console.error("Error fetching rooms:", error);
      setMyRooms([]);
    }
  };

  useEffect(() => {
    fetchUserInfo();
  }, []);

  useEffect(() => {
    if (User?.userid) {
      fetchCurrentCourses();
      fetchJoinedRooms();
    }
  }, [User?.userid]);

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
                  onClick={() => (window.location.href = "/profile")}
                >
                  <span className="action-icon">✏️</span>
                  Edit Profile
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="courses-section">
          <div className="section-header">
            <h2>📘 My Courses</h2>
            <a href="#" className="view-all">
              View all
            </a>
          </div>
          <div className="courses-grid">
            {currentCourses.length > 0 ? (
              currentCourses.map((course, i) => (
                <div className="course-card" key={i}>
                  <div className="course-content">
                    <h3>{course.coursename || "Unnamed Course"}</h3>
                    <p>{course.coursecode || "No code available"}</p>
                    <div className="progress-container">
                      <div className="progress-text">
                        {Math.floor(Math.random() * 10)}/
                        {Math.floor(Math.random() * 15)}
                      </div>
                      <div className="progress-bar">
                        <div
                          className="progress-fill"
                          style={{
                            width: `${Math.floor(Math.random() * 100)}%`,
                          }}
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
              ))
            ) : (
              <div className="no-courses-message">
                No courses found for current semester
              </div>
            )}

            <div className="course-card add-card">
              <div className="add-content">
                <div className="add-icon">+</div>
                <div>Add</div>
              </div>
            </div>
          </div>
        </section>

        <section className="deadlines-section">
          <div className="section-header">
            <h2>⏰ Upcoming Deadlines</h2>
            <a href="#" className="view-all">
              View all
            </a>
          </div>
          <div className="deadlines-list">
            {/* Replace the hardcoded deadlines with your fetched todos */}
            {tasks.length > 0 ? (
              tasks.slice(0, 3).map((task, index) => (
                <div
                  key={task.id || index} // Use task.id if available, otherwise fall back to index
                  className="deadline-card"
                  onClick={() => console.log("Task clicked:", task.id)} // You can replace this with your navigation
                >
                  <div className="deadline-content">
                    <h3>{task.title}</h3>
                    <div className="deadline-meta">
                      <span className="course-code">{task.course}</span>
                      <span className="due-date">
                        <span className="icon">📅</span>
                        {new Date(
                          `${task.dueDate}T${task.dueTime}`
                        ).toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <div className={`priority-indicator ${task.priority}`}></div>
                </div>
              ))
            ) : (
              <div className="no-deadlines-message">
                No upcoming deadlines found
              </div>
            )}
          </div>
        </section>

        <div className="bottom-sections">
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

          <div className="chatrooms-section">
            <div className="section-header">
              <h2>💬 Chatrooms Joined</h2>
              <a href="#" className="view-all">
                View all
              </a>
            </div>

            <div className="chatrooms-list">
              {myRooms.length > 0 ? (
                <>
                  {myRooms.map((room, i) => (
                    <div className="chatroom-card" key={i}>
                      <div className="chatroom-icon">💬</div>
                      <div className="chatroom-info">
                        <h3>{room.title}</h3>
                        <p>{room.desc}</p>
                        <p> • {room.online} online</p>
                      </div>
                    </div>
                  ))}

                  <div className="chatroom-card add-chatroom">
                    <div className="add-icon">+</div>
                    <span>Join new chatroom</span>
                  </div>
                </>
              ) : (
                <div className="no-rooms-message">
                  You haven't joined any chatrooms yet
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <section className="quick-links-section">
        <div className="section-header">
          <h2>🔗 Quick Links</h2>
        </div>
        <div className="quick-links-grid">
          <a href="/playlists" className="quick-link-card">
            <div className="quick-link-icon youtube">
              <svg viewBox="0 0 24 24">
                <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
              </svg>
            </div>
            <h3>YouTube Playlists</h3>
            <p>Access curated educational content</p>
          </a>

          <a href="/timetable" className="quick-link-card">
            <div className="quick-link-icon timetable">
              <svg viewBox="0 0 24 24">
                <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM9 10H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm-8 4H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2z" />
              </svg>
            </div>
            <h3>Time Table</h3>
            <p>Generate your class schedule</p>
          </a>

          <a href="/datesheet" className="quick-link-card">
            <div className="quick-link-icon datesheet">
              <svg viewBox="0 0 24 24">
                <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM9 10H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm-8 4H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2z" />
              </svg>
            </div>
            <h3>Date Sheet</h3>
            <p>Create exam schedules</p>
          </a>

          <a href="/support" className="quick-link-card">
            <div className="quick-link-icon support">
              <svg viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z" />
              </svg>
            </div>
            <h3>Support</h3>
            <p>Get help and assistance</p>
          </a>

          <a href="/news" className="quick-link-card">
            <div className="quick-link-icon news">
              <svg viewBox="0 0 24 24">
                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V7h14v12zm-7-2h2v-4h4v-2h-4V7h-2v4H8v2h4z" />
              </svg>
            </div>
            <h3>News</h3>
            <p>Stay updated with campus news</p>
          </a>

          <a href="/applications" className="quick-link-card">
            <div className="quick-link-icon applications">
              <svg viewBox="0 0 24 24">
                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zM7 10h2v7H7zm4-3h2v10h-2zm4 6h2v4h-2z" />
              </svg>
            </div>
            <h3>Applications</h3>
            <p>Generate applications & emails</p>
          </a>
        </div>
      </section>
    </div>
  );
}

export default AcademicDashboard;
