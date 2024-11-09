"use strict";
const cgpaCard = document.getElementById("cgpaCard");
const aggregateCard = document.getElementById("aggregateCard");
const cgpaCalculator = document.getElementById("cgpaCalculator");
const aggregateCalculator = document.getElementById("aggregateCalculator");
const sgpaSection = document.getElementById("sgpaSection");
const cgpaSection = document.getElementById("cgpaSection");
const coursesContainer = document.getElementById("coursesContainer");
const semestersContainer = document.getElementById("semestersContainer");
const calculateSGPAButton = document.getElementById("calculateSGPAButton");
const calculateCGPAButton = document.getElementById("calculateCGPAButton");

cgpaCard.addEventListener("click", function () {
  cgpaCalculator.classList.add("active");
  document.querySelector(".card-container").style.display = "none";
});

aggregateCard.addEventListener("click", function () {
  aggregateCalculator.classList.add("active");
  document.querySelector(".card-container").style.display = "none";
});

function closeCalculator() {
  cgpaCalculator.classList.remove("active");
  aggregateCalculator.classList.remove("active");
  document.querySelector(".card-container").style.display = "flex";
}

function showSGPA() {
  sgpaSection.style.display = "block";
  cgpaSection.style.display = "none";
}

function showCGPA() {
  sgpaSection.style.display = "none";
  cgpaSection.style.display = "block";
}

function generateCourses() {
  const numberOfCourses = document.getElementById("numberOfCourses").value;
  const coursesError = document.getElementById("courseError");
  coursesError.textContent = "";
  coursesContainer.innerHTML = "";

  if (numberOfCourses < 1) {
    coursesError.textContent = "Please enter a valid number of courses.";
    calculateSGPAButton.style.display = "none";
    return;
  }

  for (let i = 0; i < numberOfCourses; i++) {
    const inputGroup = document.createElement("div");
    inputGroup.classList.add("course-input-group");
    inputGroup.innerHTML = `
        <label for="courseName${i}" >Course Name</label>
        <input type="text" id="courseName${i}" placeholder="Enter Course Name">
      <label for="creditHours${i}">Credit Hours</label>
      <select id="creditHours${i}">
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
        <option value="4">4</option>
      </select>
      <label for="grade${i}">Grade</label>
      <select id="grade${i}">
        <option value="4.00">A/A+</option>
        <option value="3.67">A-</option>
        <option value="3.33">B+</option>
        <option value="3.00">B</option>
        <option value="2.67">B-</option>
        <option value="2.33">C+</option>
        <option value="2.00">C</option>
        <option value="1.67">C-</option>
        <option value="1.33">D+</option>
        <option value="1.00">D</option>
        <option value="0.00">F</option>
      </select>
    `;
    coursesContainer.appendChild(inputGroup);
  }
  calculateSGPAButton.style.display = "block";
}

function generateSemesters() {
  const numberOfSemesters = document.getElementById("numberOfSemesters").value;
  const semesterError = document.getElementById("semesterError");
  semestersContainer.innerHTML = "";
  semesterError.textContent = "";

  if (numberOfSemesters < 1) {
    semesterError.textContent = "Please enter a valid number of semesters.";
    calculateCGPAButton.style.display = "none";
    return;
  }

  for (let i = 0; i < numberOfSemesters; i++) {
    const semesterDiv = document.createElement("div");
    semesterDiv.className = "semester-input-group input-group";
    semesterDiv.innerHTML = `
          <h3 class="semester-title">Semester ${i + 1}</h3>
        <label for="semesterCreditHours${i}">Credit Hours</label>
        <input type="number" id="semesterCreditHours${i}" placeholder="Enter Credit Hours">
        <label for="semesterGPA${i}">GPA</label>
        <input type="number" id="semesterGPA${i}" step="0.01" placeholder="Enter GPA">
      `;
    semestersContainer.appendChild(semesterDiv);
  }
  calculateCGPAButton.style.display = "block";
}

function calculateSGPA() {
  const numberOfCourses = document.getElementById("numberOfCourses").value;
  let totalCreditHours = 0;
  let totalPoints = 0;

  for (let i = 0; i < numberOfCourses; i++) {
    const creditHours =
      parseFloat(document.getElementById(`creditHours${i}`).value) || 0;
    const grade = parseFloat(document.getElementById(`grade${i}`).value) || 0;
    totalCreditHours += creditHours;
    totalPoints += creditHours * grade;
  }

  const sgpa = totalCreditHours === 0 ? 0 : totalPoints / totalCreditHours;
  const sgpaResult = document.getElementById("sgpaResult");
  sgpaResult.textContent = `Your SGPA is: ${sgpa.toFixed(2)}`;
}

function calculateCGPA() {
  const numberOfSemesters = parseInt(
    document.getElementById("numberOfSemesters").value
  );
  const gpaError = document.getElementById("gpaError");
  gpaError.textContent = "";
  let totalPoints = 0;
  let totalCredits = 0;

  for (let i = 0; i < numberOfSemesters; i++) {
    const creditHours = parseFloat(
      document.getElementById(`semesterCreditHours${i}`).value
    );
    const gpa = parseFloat(document.getElementById(`semesterGPA${i}`).value);

    if (
      isNaN(creditHours) ||
      isNaN(gpa) ||
      gpa < 0 ||
      gpa > 4 ||
      creditHours <= 0 ||
      creditHours > 20
    ) {
      gpaError.textContent = `Please enter valid Credit Hours or GPA for semester ${
        i + 1
      }.`;
      return;
    }

    totalPoints += creditHours * gpa;
    totalCredits += creditHours;
  }

  const cgpa = totalPoints / totalCredits;
  const cgpaResult = document.getElementById("cgpaResult");
  cgpaResult.textContent = `Your CGPA is: ${cgpa.toFixed(2)}`;
}

function calculateAggregate() {
  const testType = document.getElementById("testType").value; // Assuming the dropdown has an id of "testType"

  const obtainedMarks = parseFloat(
    document.getElementById("obtainedMarks").value
  );
  const totalMarks = parseFloat(document.getElementById("totalMarks").value);
  const fscObtainedMarks = parseFloat(
    document.getElementById("fscObtainedMarks").value
  );
  const fscTotalMarks = parseFloat(
    document.getElementById("fscTotalMarks").value
  );
  const matricObtainedMarks = parseFloat(
    document.getElementById("matricObtainedMarks").value
  );
  const matricTotalMarks = parseFloat(
    document.getElementById("matricTotalMarks").value
  );
  const aggregateError = document.getElementById("aggregateError");
  aggregateError.textContent = "";

  let aggregate;

  // Test Marks Validation
  if (
    isNaN(obtainedMarks) ||
    isNaN(totalMarks) ||
    obtainedMarks < 0 ||
    obtainedMarks > totalMarks
  ) {
    aggregateError.textContent = "Please enter valid test marks.";
    return;
  }

  // FSc Marks Validation
  if (
    isNaN(fscObtainedMarks) ||
    isNaN(fscTotalMarks) ||
    fscObtainedMarks < 0 ||
    fscObtainedMarks > fscTotalMarks
  ) {
    aggregateError.textContent = "Please enter valid FSc marks.";
    return;
  }

  // Matric Marks Validation
  if (
    isNaN(matricObtainedMarks) ||
    isNaN(matricTotalMarks) ||
    matricObtainedMarks < 0 ||
    matricObtainedMarks > matricTotalMarks
  ) {
    aggregateError.textContent = "Please enter valid Matric marks.";
    return;
  }

  const fscPercentage = (fscObtainedMarks / fscTotalMarks) * 100;
  const matricPercentage = (matricObtainedMarks / matricTotalMarks) * 100;

  if (testType === "NTS") {
    const ntsPercentage = (obtainedMarks / totalMarks) * 100;
    aggregate =
      fscPercentage * 0.4 + ntsPercentage * 0.5 + matricPercentage * 0.1;
  } else if (testType === "NU") {
    const nuTestPercentage = (obtainedMarks / totalMarks) * 100;
    aggregate =
      fscPercentage * 0.4 + nuTestPercentage * 0.5 + matricPercentage * 0.1;
  }
  const aggregateResult = document.getElementById("aggregateResult");
  aggregateResult.textContent = `Your ${testType} Based Aggregate is: ${aggregate.toFixed(
    2
  )}%`;
}
