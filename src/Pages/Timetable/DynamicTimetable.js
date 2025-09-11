import React, { useState, useRef, useEffect } from "react";
import { toJpeg } from "html-to-image";
import "./DynamicTimetable.css";

const DynamicTimetable = ({ selectedCourses }) => {
  const [showInstructor, setShowInstructor] = useState(true);
  const [showVenue, setShowVenue] = useState(true);
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'barchart'
  const [stackedCourses, setStackedCourses] = useState({}); // For managing stacked conflicts
  const timelineBodyRef = useRef(null);
  const timeHeaderRef = useRef(null);

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

  const handleCourseClick = (day, timeSlot, courseIndex) => {
    const key = `${day}-${timeSlot}`;
    
    // Find courses at the same time slot
    const dayCourses = timetable[day];
    const conflictingCourses = dayCourses.filter(course => 
      `${course.start_time}-${course.end_time}` === timeSlot
    );
    
    if (conflictingCourses.length > 1) {
      // Move the clicked course to the bottom by updating the stackedCourses state
      const currentStack = stackedCourses[key] || conflictingCourses;
      const newStack = [...currentStack];
      const clickedCourse = newStack.splice(courseIndex, 1)[0];
      newStack.push(clickedCourse);
      
      setStackedCourses(prev => ({
        ...prev,
        [key]: newStack
      }));
    }
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
    
    // Generate bar chart data with timeline positioning
    const barChartData = {};
    days.forEach(day => {
      barChartData[day] = [];
      const dayCourses = timetable[day];
      
      // Group courses by time slot and apply reordering if needed
      const timeSlotGroups = {};
      dayCourses.forEach(course => {
        const timeKey = `${course.start_time}-${course.end_time}`;
        if (!timeSlotGroups[timeKey]) {
          timeSlotGroups[timeKey] = [];
        }
        timeSlotGroups[timeKey].push(course);
      });
      
      // Apply reordering for conflicts
      Object.entries(timeSlotGroups).forEach(([timeKey, courses]) => {
        const stackKey = `${day}-${timeKey}`;
        const reorderedCourses = stackedCourses[stackKey] || courses;
        
        reorderedCourses.forEach(course => {
          const formatTime = (time24) => {
            if (!time24) return "";
            let [hours, minutes] = time24.split(":");
            hours = parseInt(hours);
            const amOrPm = hours >= 12 ? "PM" : "AM";
            hours = hours % 12 || 12;
            return `${hours}:${minutes} ${amOrPm}`;
          };
          
          // Calculate position and width based on time using fixed scale
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
          
          const startIndex = findClosestTimeIndex(course.start_time);
          const endIndex = findClosestTimeIndex(course.end_time);
          
          // Ensure end index is at least 1 slot after start
          const finalEndIndex = Math.max(startIndex + 1, endIndex);
          
          barChartData[day].push({
            ...course,
            startIndex,
            endIndex: finalEndIndex,
            width: (finalEndIndex - startIndex) * 60, // 60px per 30min slot
            leftPosition: startIndex * 60,
            formattedTime: `${formatTime(course.start_time)} - ${formatTime(course.end_time)}`,
            isConflict: course.isConflict
          });
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
  
  // Debug logging (can be removed in production)
  // console.log('Current view mode:', viewMode);
  // console.log('Timetable data:', timetable);
  // console.log('Bar chart data:', barChartData);
  // console.log('Time grid:', timeGrid);

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
        <button onClick={exportToJpg} className="export-button">
          Export as JPG
        </button>
      </div>
      <div id="timetable" className="timetable">
        <div style={{marginBottom: '10px', fontSize: '12px', color: '#666'}}>
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
                      barChartData[day].map((course, courseIndex) => (
                        <div
                          key={courseIndex}
                          className={`course-bar ${course.isConflict ? 'conflict-bar' : ''}`}
                          onClick={() => handleCourseClick(day, `${course.start_time}-${course.end_time}`, courseIndex)}
                          style={{
                            left: `${course.leftPosition}px`,
                            width: `${course.width}px`,
                            zIndex: course.isConflict ? 5 - courseIndex : 1,
                            transform: course.isConflict ? `translateY(${courseIndex * 8}px)` : 'none'
                          }}
                        >
                          <div className="course-name">{course.courseName}</div>
                          {showInstructor && (
                            <div className="course-instructor">{course.instructor || 'N/A'}</div>
                          )}
                          {showVenue && (
                            <div className="course-venue">{course.venue || 'N/A'}</div>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="no-courses">No courses scheduled</div>
                    )}
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
