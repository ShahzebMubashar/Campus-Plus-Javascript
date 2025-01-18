import React from "react";
import "./CourseList.css";

const CourseList = ({ courses, onRemove }) => {
  return (
    <div className="course-list-container">
      <h2 className="course-list-title">Available Courses</h2>
      <div className="course-list">
        {courses.map((course, index) => (
          <div key={index} className="course-item">
            <span>{course.course} - {course.section}</span>
            <button
              className="remove-button"
              onClick={() => onRemove(course.courseCode)}
            >
              &times; 
            </button> 
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseList;