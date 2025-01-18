import React, { useState } from "react";
import { toJpeg } from "html-to-image";
import "./DynamicTimetable.css";

const DynamicTimetable = ({ selectedCourses }) => {
  const [showInstructor, setShowInstructor] = useState(true);
  const [showVenue, setShowVenue] = useState(true);

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  const generateTimetable = () => {
    const timetable = {};
    days.forEach((day) => (timetable[day] = []));

    selectedCourses.forEach((course) => {
      let lectures;
      try {
        lectures = JSON.parse(course.lectures.replace(/'/g, '"').slice(1,-2));
      } catch (error) {
        console.error("Invalid lecture format:", course.lectures, error.message);
        return;
      }

      lectures.forEach(({ room, day, start_time, end_time }) => {
        if (timetable[day]) {
          timetable[day].push({
            courseName: `${course.course} - ${course.section}`,
            instructor: course.instructor,
            venue: room,
            start_time,
            time: `${start_time} - ${end_time}`,
          });
        }
      });
    });

    // Sort lectures by start_time for each day
    for (const day of days) {
      timetable[day].sort((a, b) => a.start_time.localeCompare(b.start_time));
    }

    return timetable;
  };

  const timetable = generateTimetable();

  const exportToJpg = () => {
    const timetableElement = document.getElementById("timetable");

    toJpeg(timetableElement, { quality: 0.95 })
      .then((dataUrl) => {
        const link = document.createElement("a");
        link.download = "timetable.jpg";
        link.href = dataUrl;
        link.click();
      })
      .catch((err) => console.error("Error exporting timetable:", err));
  };

  return (
    <div className="dynamic-timetable-container">
      <div className="options">
        <label>
          <input
            type="checkbox"
            checked={showInstructor}
            onChange={() => setShowInstructor(!showInstructor)}
          />
          Show Instructor
        </label>
        <label>
          <input
            type="checkbox"
            checked={showVenue}
            onChange={() => setShowVenue(!showVenue)}
          />
          Show Venue
        </label>
        <button onClick={exportToJpg} className="export-button">
          Export as JPG
        </button>
      </div>
      <div id="timetable" className="timetable">
        <table>
          <thead>
            <tr>
              <th>Day</th>
              <th>Course</th>
              <th>Time</th>
              {showInstructor && <th>Instructor</th>}
              {showVenue && <th>Venue</th>}
            </tr>
          </thead>
          <tbody>
            {days.map((day) => (
              <tr key={day}>
                <td className="day-column">{day}</td>
                <td>
                  {timetable[day].map((entry, index) => (
                    <div key={index} className="hex-item">
                      {entry.courseName}
                    </div>
                  ))}
                </td>
                <td>
                  {timetable[day].map((entry, index) => (
                    <div key={index}>{entry.time}</div>
                  ))}
                </td>
                {showInstructor && (
                  <td>
                    {timetable[day].map((entry, index) => (
                      <div key={index}>{entry.instructor}</div>
                    ))}
                  </td>
                )}
                {showVenue && (
                  <td>
                    {timetable[day].map((entry, index) => (
                      <div key={index}>{entry.venue}</div>
                    ))}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DynamicTimetable;
