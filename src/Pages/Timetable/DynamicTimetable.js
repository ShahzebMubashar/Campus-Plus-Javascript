import React, { useState } from "react";
import { toJpeg } from "html-to-image";
import "./DynamicTimetable.css";

const DynamicTimetable = ({ selectedCourses }) => {
  const [showInstructor, setShowInstructor] = useState(true);
  const [showVenue, setShowVenue] = useState(true);

  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const detectConflicts = (lectures) => {
    // Add a flag `isConflict` to identify conflicting entries
    for (let i = 0; i < lectures.length; i++) {
      for (let j = i + 1; j < lectures.length; j++) {
        const a = lectures[i];
        const b = lectures[j];
        // Check if timings overlap
        if (
          (a.start_time < b.start_time && a.end_time > b.start_time) ||
          (b.start_time < a.start_time && b.end_time > a.start_time) ||
          a.start_time === b.start_time
        ) {
          a.isConflict = true;
          b.isConflict = true;
        }
      }
    }
  };

  const generateTimetable = () => {
    const timetable = {};
    days.forEach((day) => (timetable[day] = []));

    selectedCourses.forEach((course) => {
      let lectures;
      try {
        lectures = JSON.parse(
          course.lectures.replace(/'/g, '"').trim().slice(1, -1),
        );
      } catch (error) {
        console.error(
          "Invalid lecture format:",
          course.lectures.replace(/'/g, '"').trim().slice(1, -1),
          error.message,
        );
        return;
      }

      lectures.forEach(({ room, day, start_time, end_time }) => {
        if (timetable[day]) {
          const formatTime = (time24) => {
            if (!time24) return ""; // Handle potential null/undefined values
            let [hours, minutes] = time24.split(":");
            hours = parseInt(hours);
            const amOrPm = hours >= 12 ? "PM" : "AM";
            hours = hours % 12 || 12; // Convert to 12-hour format
            return `${hours}:${minutes} ${amOrPm}`;
          };

          const formattedStartTime = formatTime(start_time);
          const formattedEndTime = formatTime(end_time);
          timetable[day].push({
            courseName: `${course.course} - ${course.section}`,
            instructor: course.instructor,
            venue: room,
            start_time,
            end_time,
            time: `${formattedStartTime} - ${formattedEndTime}`,
            isConflict: false, // Default flag
          });
        }
      });
    });

    // Detect conflicts for each day
    for (const day of days) {
      detectConflicts(timetable[day]);
      timetable[day].sort((a, b) => a.start_time.localeCompare(b.start_time));
    }

    return timetable;
  };

  const timetable = generateTimetable();

  const exportToJpg = () => {
    const node = document.getElementById("timetable");
    if (!node) return;
  
    // Save original styles so we can restore later
    const originalStyle = {
      width: node.style.width,
      height: node.style.height,
      overflow: node.style.overflow,
    };
  
    // Force element to show all content (no scrolling cut)
    node.style.overflow = "visible";
    const fullWidth = node.scrollWidth;
    const fullHeight = node.scrollHeight;
    node.style.width = fullWidth + "px";
    node.style.height = fullHeight + "px";
  
    const pixelRatio = 2; // ensures good resolution
  
    toJpeg(node, {
      quality: 0.95,
      backgroundColor: "#ffffff",
      cacheBust: true,
      useCORS: true,
      pixelRatio: pixelRatio,
      width: fullWidth,
      height: fullHeight,
    })
      .then((dataUrl) => {
        const link = document.createElement("a");
        link.download = "timetable.jpg";
        link.href = dataUrl;
        link.click();
      })
      .catch((err) => console.error("Error exporting timetable:", err))
      .finally(() => {
        // Restore original styles
        node.style.width = originalStyle.width;
        node.style.height = originalStyle.height;
        node.style.overflow = originalStyle.overflow;
      });
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
                    <div
                      key={index}
                      className={entry.isConflict ? "conflict" : ""}
                    >
                      {entry.courseName}
                    </div>
                  ))}
                </td>
                <td>
                  {timetable[day].map((entry, index) => (
                    <div
                      key={index}
                      className={entry.isConflict ? "conflict" : ""}
                    >
                      {entry.time}
                    </div>
                  ))}
                </td>
                 {showInstructor && (
                   <td>
                     {timetable[day].map((entry, index) => (
                       <div key={index}>{entry.instructor || 'N/A'}</div>
                     ))}
                   </td>
                 )}
                 {showVenue && (
                   <td>
                     {timetable[day].map((entry, index) => (
                       <div key={index}>{entry.venue || 'N/A'}</div>
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
