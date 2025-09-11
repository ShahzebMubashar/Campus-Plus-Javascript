import React, { useState, useRef, useEffect } from "react";
import { toJpeg } from "html-to-image";
import "./DynamicTimetable.css";

const DynamicTimetable = ({ selectedCourses }) => {
  const [showInstructor, setShowInstructor] = useState(true);
  const [showVenue, setShowVenue] = useState(true);
  const [showTimings, setShowTimings] = useState(false);
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'barchart'
  const [stackedCourses, setStackedCourses] = useState({}); // For managing stacked conflicts
  const timelineBodyRef = useRef(null);
  const timeHeaderRef = useRef(null);

  // Reset stacked courses when selected courses change
  useEffect(() => {
    setStackedCourses({});
  }, [selectedCourses]);

  // Handle window resize for responsive bar chart
  useEffect(() => {
    const handleResize = () => {
      // Force re-render by updating a dummy state
      setStackedCourses(prev => ({ ...prev }));
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
        // Check if timings overlap (improved logic)
        if (
          (a.start_time < b.end_time && a.end_time > b.start_time) ||
          (b.start_time < a.end_time && b.end_time > a.start_time)
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
  
    // For bar chart view, we need to handle overflow differently
    if (viewMode === 'barchart') {
      const timelineBody = node.querySelector('.timeline-body');
      const timeHeader = node.querySelector('.time-grid-header');
      
      if (timelineBody && timeHeader) {
        // Force both header and body to show full width
        timelineBody.style.overflow = "visible";
        timeHeader.style.overflow = "visible";
        
        // Get the full width from the time grid
        const timeCells = timeHeader.querySelectorAll('.time-header-cell');
        const getCellWidth = () => {
          if (window.innerWidth <= 480) return 30;
          if (window.innerWidth <= 768) return 40;
          return 60;
        };
        const cellWidth = getCellWidth();
        const dayLabelWidth = window.innerWidth <= 480 ? 60 : window.innerWidth <= 768 ? 80 : 120;
        const fullWidth = timeCells.length * cellWidth + dayLabelWidth;
        
        node.style.width = fullWidth + "px";
        node.style.height = "auto";
        node.style.overflow = "visible";
      }
    } else {
      // Original table view logic
      node.style.overflow = "visible";
      const fullWidth = node.scrollWidth;
      const fullHeight = node.scrollHeight;
      node.style.width = fullWidth + "px";
      node.style.height = fullHeight + "px";
    }
  
    const pixelRatio = 2; // ensures good resolution
  
    toJpeg(node, {
      quality: 0.95,
      backgroundColor: "#ffffff",
      cacheBust: true,
      useCORS: true,
      pixelRatio: pixelRatio,
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
        
        // Restore bar chart overflow styles
        if (viewMode === 'barchart') {
          const timelineBody = node.querySelector('.timeline-body');
          const timeHeader = node.querySelector('.time-grid-header');
          if (timelineBody) timelineBody.style.overflow = "auto";
          if (timeHeader) timeHeader.style.overflow = "hidden";
        }
      });
  };

  const handleCourseClick = (day, courseData) => {
    const dayCourses = timetable[day];
    
    // Find all courses that overlap with the clicked course
    const overlappingCourses = dayCourses.filter(otherCourse => {
      if (otherCourse.start_time === courseData.start_time && 
          otherCourse.end_time === courseData.end_time && 
          otherCourse.courseName === courseData.courseName) return false;
      return courseData.start_time < otherCourse.end_time && courseData.end_time > otherCourse.start_time;
    });
    
    if (overlappingCourses.length === 0) return;
    
    // Create conflict group
    const conflictGroup = [courseData, ...overlappingCourses].sort((a, b) => 
      a.start_time.localeCompare(b.start_time)
    );
    
    // Create unique group key
    const groupKey = `${day}-${conflictGroup.map(c => `${c.start_time}-${c.end_time}`).join('|')}`;
    
    // Get current order or use default
    const currentOrder = stackedCourses[groupKey] || conflictGroup;
    
    // Move clicked course to front
    const newOrder = currentOrder.filter(c => 
      !(c.start_time === courseData.start_time && 
        c.end_time === courseData.end_time && 
        c.courseName === courseData.courseName)
    );
    newOrder.push(courseData);
    
    setStackedCourses(prev => ({
      ...prev,
      [groupKey]: newOrder
    }));
  };

  const generateBarChartData = () => {
    // Get all unique time slots across all days
    const allTimeSlots = new Set();
    days.forEach(day => {
      timetable[day].forEach(course => {
        allTimeSlots.add(course.start_time);
        allTimeSlots.add(course.end_time);
      });
    });
    
    // Convert to array and sort
    const sortedTimeSlots = Array.from(allTimeSlots).sort();
    
    // Create a fixed time grid from 8 AM to 7 PM with 30-minute intervals
    const timeGrid = [];
    for (let hour = 8; hour <= 19; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        timeGrid.push(timeString);
      }
    }

    // Get responsive cell width based on screen size
    const getCellWidth = () => {
      if (window.innerWidth <= 480) return 30;
      if (window.innerWidth <= 768) return 40;
      return 60;
    };
    
    // Generate bar chart data with timeline positioning
    const barChartData = {};
    
    // Helper functions
    const formatTime = (time24) => {
      if (!time24) return "";
      let [hours, minutes] = time24.split(":");
      hours = parseInt(hours);
      const amOrPm = hours >= 12 ? "PM" : "AM";
      hours = hours % 12 || 12;
      return `${hours}:${minutes} ${amOrPm}`;
    };
    
    const findClosestTimeIndex = (targetTime) => {
      const [targetHour, targetMin] = targetTime.split(':').map(Number);
      const targetMinutes = targetHour * 60 + targetMin;
      
      let closestIndex = 0;
      let minDiff = Infinity;
      
      timeGrid.forEach((gridTime, index) => {
        const [gridHour, gridMin] = gridTime.split(':').map(Number);
        const gridMinutes = gridHour * 60 + gridMin;
        const diff = Math.abs(targetMinutes - gridMinutes);
        
        if (diff < minDiff) {
          minDiff = diff;
          closestIndex = index;
        }
      });
      
      return closestIndex;
    };
    
    const createConflictGroups = (courses) => {
      const groups = new Map();
      const processed = new Set();
      
      courses.forEach(course => {
        const courseId = `${course.start_time}-${course.end_time}-${course.courseName}`;
        if (processed.has(courseId)) return;
        
        const group = [course];
        processed.add(courseId);
        
        courses.forEach(otherCourse => {
          const otherCourseId = `${otherCourse.start_time}-${otherCourse.end_time}-${otherCourse.courseName}`;
          if (otherCourse === course || processed.has(otherCourseId)) return;
          
          if (course.start_time < otherCourse.end_time && course.end_time > otherCourse.start_time) {
            group.push(otherCourse);
            processed.add(otherCourseId);
          }
        });
        
        if (group.length > 1) {
          const groupKey = group.map(c => `${c.start_time}-${c.end_time}`).join('|');
          groups.set(groupKey, group);
        }
      });
      
      return groups;
    };
    
    days.forEach(day => {
      barChartData[day] = [];
      const dayCourses = timetable[day];
      const conflictGroups = createConflictGroups(dayCourses);
      
      dayCourses.forEach(course => {
        const startIndex = findClosestTimeIndex(course.start_time);
        const endIndex = findClosestTimeIndex(course.end_time);
        const finalEndIndex = Math.max(startIndex + 1, endIndex);
        const cellWidth = getCellWidth();
        
        // Find which conflict group this course belongs to
        let stackPosition = 0;
        let groupKey = null;
        
        for (const [key, group] of conflictGroups) {
          const courseInGroup = group.find(c => 
            c.start_time === course.start_time && 
            c.end_time === course.end_time && 
            c.courseName === course.courseName
          );
          
          if (courseInGroup) {
            groupKey = `${day}-${key}`;
            const reorderedGroup = stackedCourses[groupKey] || group;
            stackPosition = reorderedGroup.findIndex(c => 
              c.start_time === course.start_time && 
              c.end_time === course.end_time && 
              c.courseName === course.courseName
            );
            break;
          }
        }
        
        barChartData[day].push({
          ...course,
          startIndex,
          endIndex: finalEndIndex,
          width: (finalEndIndex - startIndex) * cellWidth,
          leftPosition: startIndex * cellWidth,
          formattedTime: `${formatTime(course.start_time)} - ${formatTime(course.end_time)}`,
          isConflict: course.isConflict,
          stackPosition: stackPosition,
          groupKey: groupKey
        });
      });
    });
    
    return { barChartData, timeGrid };
  };


  const { barChartData, timeGrid } = generateBarChartData();
  
  // Synchronize scrolling between header and body
  useEffect(() => {
    const timelineBody = timelineBodyRef.current;
    const timeHeader = timeHeaderRef.current;
    
    if (!timelineBody || !timeHeader) return;
    
    const handleScroll = (source, target) => {
      return () => {
        if (source.scrollLeft !== target.scrollLeft) {
          target.scrollLeft = source.scrollLeft;
        }
      };
    };
    
    const bodyScrollHandler = handleScroll(timelineBody, timeHeader);
    const headerScrollHandler = handleScroll(timeHeader, timelineBody);
    
    timelineBody.addEventListener('scroll', bodyScrollHandler);
    timeHeader.addEventListener('scroll', headerScrollHandler);
    
    return () => {
      timelineBody.removeEventListener('scroll', bodyScrollHandler);
      timeHeader.removeEventListener('scroll', headerScrollHandler);
    };
  }, [viewMode]);
  

  return (
    <div className="dynamic-timetable-container">
      <div className="options">
        <div className="view-toggle">
          <button 
            className={`toggle-btn ${viewMode === 'table' ? 'active' : ''}`}
            onClick={() => setViewMode('table')}
          >
            Table View
          </button>
          <button 
            className={`toggle-btn ${viewMode === 'barchart' ? 'active' : ''}`}
            onClick={() => setViewMode('barchart')}
          >
            Bar Chart
          </button>
        </div>
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
        {viewMode === 'barchart' && (
          <label>
            <input
              type="checkbox"
              checked={showTimings}
              onChange={() => setShowTimings(!showTimings)}
            />
            Show Timings
          </label>
        )}
        <button onClick={exportToJpg} className="export-button">
          Export as JPG
        </button>
      </div>
      <div id="timetable" className="timetable">
        <div className="view-indicator">
          Current view: {viewMode === 'table' ? 'Table View' : 'Bar Chart View'}
        </div>
        {viewMode === 'table' ? (
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
        ) : (
          <div className="bar-chart-view">
            <div className="timeline-header">
              <div className="day-label-header">Day</div>
              <div className="time-grid-header" ref={timeHeaderRef}>
                {timeGrid.length > 0 ? timeGrid.map((time, index) => (
                  <div key={index} className="time-header-cell">
                    {(() => {
                      const [hours, minutes] = time.split(':');
                      const hour = parseInt(hours);
                      const amOrPm = hour >= 12 ? 'PM' : 'AM';
                      const displayHour = hour % 12 || 12;
                      return minutes === '00' ? `${displayHour} ${amOrPm}` : '';
                    })()}
                  </div>
                )) : (
                  <div className="time-header-cell">No time data</div>
                )}
              </div>
            </div>
            <div className="timeline-body" ref={timelineBodyRef}>
              {days.map((day) => (
                <div key={day} className="timeline-row">
                  <div className="day-label">{day}</div>
                  <div className="time-grid">
                    {timeGrid.map((time, index) => (
                      <div key={index} className="time-cell"></div>
                    ))}
                    {barChartData[day] && barChartData[day].length > 0 ? (
                      barChartData[day].map((course, index) => (
                        <div
                          key={`${course.start_time}-${course.end_time}-${index}`}
                          className={`course-bar ${course.isConflict ? 'conflict-bar' : ''}`}
                          onClick={() => handleCourseClick(day, course)}
                          style={{
                            left: `${course.leftPosition}px`,
                            width: `${course.width}px`,
                            zIndex: course.isConflict ? 5 - course.stackPosition : 1,
                            transform: course.isConflict ? `translateY(${course.stackPosition * 8}px)` : 'none'
                          }}
                        >
                          <div className="course-name">{course.courseName}</div>
                          {showTimings && (
                            <div className="course-timing">{course.formattedTime}</div>
                          )}
                          {showInstructor && (
                            <div className="course-instructor">{course.instructor || 'N/A'}</div>
                          )}
                          {showVenue && (
                            <div className="course-venue">{course.venue || 'N/A'}</div>
                          )}
                        </div>
                      ))
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DynamicTimetable;
