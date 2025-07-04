import { toJpeg } from "html-to-image";
import "./DynamicDatesheet.css";

const DynamicDatesheet = ({ selectedCourses, datesheetData }) => {
  const userCourseCodes = selectedCourses.map((c) => c.courseCode);
  const matchedDates = datesheetData.filter((d) =>
    userCourseCodes.includes(d.courseCode),
  );

  // Convert 24-hour time format to 12-hour format
  const formatTime = (timeSlot) => {
    if (!timeSlot) return "";

    // Extract start and end times
    const times = timeSlot.split(" - ");
    if (times.length !== 2) return timeSlot;

    const formatSingleTime = (time24) => {
      let [hours, minutes] = time24.split(":");
      hours = Number.parseInt(hours);
      const amOrPm = hours >= 12 ? "PM" : "AM";
      hours = hours % 12 || 12; // Convert to 12-hour format
      return `${hours}:${minutes} ${amOrPm}`;
    };

    const formattedStartTime = formatSingleTime(times[0]);
    const formattedEndTime = formatSingleTime(times[1]);

    return `${formattedStartTime} - ${formattedEndTime}`;
  };

  // Detect conflicts in exam schedule
  const detectConflicts = () => {
    const processedDates = [...matchedDates];
    for (let i = 0; i < processedDates.length; i++) {
      processedDates[i].isConflict = false;
    }
    for (let i = 0; i < processedDates.length; i++) {
      const a = processedDates[i];
      for (let j = i + 1; j < processedDates.length; j++) {
        const b = processedDates[j];

        // Check if dates are the same
        if (a.date === b.date) {
          // Check if time slots overlap
          const aSlot = a.timeSlot.split(" - ");
          const bSlot = b.timeSlot.split(" - ");

          if (aSlot.length === 2 && bSlot.length === 2) {
            const aStart = aSlot[0];
            const aEnd = aSlot[1];
            const bStart = bSlot[0];
            const bEnd = bSlot[1];

            // Simple overlap check
            if (
              (aStart <= bStart && aEnd > bStart) ||
              (bStart <= aStart && bEnd > aStart) ||
              aStart === bStart
            ) {
              a.isConflict = true;
              b.isConflict = true;
            }
          }
        }
      }
    }

    return processedDates;
  };

  const processedDates = detectConflicts();

  // Function to export the datesheet as a JPG image
  // Uses html-to-image library to convert the HTML table to an image
  const exportToJpg = () => {
    const datesheetElement = document.getElementById("datesheet-table");
    const clone = datesheetElement.cloneNode(true);

    const cover = document.createElement("div");
    cover.style.position = "fixed";
    cover.style.top = "0";
    cover.style.left = "0";
    cover.style.width = "100vw";
    cover.style.height = "100vh";
    cover.style.background = "white";
    cover.style.zIndex = "-998";
    cover.style.pointerEvents = "none"; // user can’t click it
    document.body.appendChild(cover);

    clone.style.position = "fixed";
    clone.style.top = "0";
    clone.style.left = "0";
    clone.style.zIndex = "-999";
    clone.style.width = "1280px";
    clone.style.height = "auto";
    clone.style.overflow = "hidden";

    document.body.appendChild(clone);

    toJpeg(clone, { quality: 0.95, useCORS: true })
      .then((dataUrl) => {
        const link = document.createElement("a");
        link.download = "datesheet.jpg";
        link.href = dataUrl;
        link.click();
      })
      .catch((err) => console.error("Error exporting datesheet:", err))
      .finally(() => {
        document.body.removeChild(clone);
        document.body.removeChild(cover);
      });
  };

  return (
    <div className="dynamic-datesheet-container">
      <button onClick={exportToJpg} className="export-button">
        Export as JPG
      </button>
      <div className="datesheet-table" id="datesheet-table">
        <table>
          <thead>
            <tr>
              <th>Course Code</th>
              <th>Course Title</th>
              <th>Date</th>
              <th>Day</th>
              <th>Time Slot</th>
            </tr>
          </thead>
          <tbody>
            {processedDates.map((entry, idx) => {
              const course = selectedCourses.find(
                (c) => c.courseCode === entry.courseCode,
              );
              return (
                <tr key={idx}>
                  <td className={entry.isConflict ? "conflict" : ""}>
                    {course?.courseCode}
                  </td>
                  <td className={entry.isConflict ? "conflict" : ""}>
                    {course?.course}
                  </td>
                  <td className={entry.isConflict ? "conflict" : ""}>
                    {entry.date}
                  </td>
                  <td className={entry.isConflict ? "conflict" : ""}>
                    {entry.day}
                  </td>
                  <td className={entry.isConflict ? "conflict" : ""}>
                    {formatTime(entry.timeSlot)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DynamicDatesheet;
