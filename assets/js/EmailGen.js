//classSection, userName, rollNumber, receiverName, emailType
window.onload = function () {
  loadEmailTemplates();
  setDefaultTeacherOption();
};

async function loadEmailTemplates() {
  const response = await fetch("/assets/templates/emails.json");
  const data = await response.json();
  populateTeacherDropdown(data.teachers); // Populate the dropdown with teacher names
  return data;
}

function setDefaultTeacherOption() {
  const teacherSelect = document.getElementById("teacher-select");
  // Set default option
  teacherSelect.innerHTML = '<option value="">Select Teacher</option>';
  teacherSelect.value = ""; // Ensure no default selection
}

function populateTeacherDropdown(teachers) {
  const teacherSelect = document.getElementById("teacher-select");
  // Skip adding the default option again
  teachers.forEach((teacher) => {
    const option = document.createElement("option");
    option.value = teacher.name;
    option.textContent = teacher.name;
    teacherSelect.appendChild(option);
  });
  // Add the 'Other' option at the end
  const otherOption = document.createElement("option");
  otherOption.value = "other";
  otherOption.textContent = "Other";
  teacherSelect.appendChild(otherOption);
}

function handleTeacherSelection() {
  const teacherSelect = document.getElementById("teacher-select");
  const teacherEmailContainer = document.getElementById(
    "teacher-email-container"
  );
  const customTeacherContainer = document.getElementById(
    "custom-teacher-container"
  );

  if (teacherSelect.value === "other") {
    teacherEmailContainer.style.display = "none";
    customTeacherContainer.style.display = "block";
  } else {
    teacherEmailContainer.style.display = "block";
    customTeacherContainer.style.display = "none";
  }
}

function showEmailGen(title, emailTypes) {
  const emailTypeSelect = document.getElementById("email-type");
  emailTypeSelect.innerHTML = ""; // Clear previous options
  emailTypes.forEach((type) => {
    const option = document.createElement("option");
    option.value = type.toLowerCase().replace(/\s+/g, "-");
    option.innerText = type;
    emailTypeSelect.appendChild(option);
  });
  document.getElementById("email-gen-container").style.display = "block";
  document.getElementById("card-container").style.display = "none";
  document.getElementById("email-gen-title").textContent = title;
}

function closeEmailGen() {
  document.getElementById("email-gen-container").style.display = "none";
  document.getElementById("email-result-container").style.display = "none";
  document.getElementById("card-container").style.display = "flex";
  // Clear all form inputs
  document.getElementById("user-name").value = "";
  document.getElementById("class-section").value = "";
  document.getElementById("roll-number").value = "";
  document.getElementById("teacher-select").value = "";
  document.getElementById("custom-teacher-name").value = "";
  document.getElementById("teacher-salutation").value = "";
  document.getElementById("email-type").value = "";

  // Hide error messages if any
  document.getElementById("name-error").style.display = "none";
  document.getElementById("class-error").style.display = "none";
  document.getElementById("roll-error").style.display = "none";
  document.getElementById("teacher-select-error").style.display = "none";
  document.getElementById("teacher-salutation-error").style.display = "none";
  document.getElementById("email-type-error").style.display = "none";

  // Hide the custom teacher input container
  document.getElementById("custom-teacher-container").style.display = "none";
}

function getLastName(fullName) {
  // Split the full name by spaces and get the last segment
  const nameParts = fullName.split(" ");
  return nameParts[nameParts.length - 1];
}

async function showEmailResult() {
  const userName = document.getElementById("user-name").value.trim();
  const classSection = document.getElementById("class-section").value.trim();
  const rollNumber = document.getElementById("roll-number").value.trim();
  const selectedTeacher = document.getElementById("teacher-select").value;
  const customTeacherName = document
    .getElementById("custom-teacher-name")
    .value.trim();
  const emailType = document.getElementById("email-type").value;
  const salutation = document.getElementById("teacher-salutation").value.trim();
  const teachersalutation = document
    .getElementById("teacher-salutation")
    .value.trim();
  const nameError = document.getElementById("name-error");
  const classError = document.getElementById("class-error");
  const rollError = document.getElementById("roll-error");
  const teacherSelectError = document.getElementById("teacher-select-error");
  const teacherError = document.getElementById("teacher-salutation-error");
  const emailError = document.getElementById("email-type-error");

  let hasError = false;

  if (!userName) {
    nameError.style.display = "block";
    hasError = true;
  } else {
    nameError.style.display = "none";
  }

  if (!classSection) {
    classError.style.display = "block";
    hasError = true;
  } else {
    classError.style.display = "none";
  }

  if (!rollNumber) {
    rollError.style.display = "block";
    hasError = true;
  } else {
    rollError.style.display = "none";
  }

  if (!selectedTeacher){
    teacherSelectError.style.display = "block";
    hasError = true;
  } else {
    teacherSelectError.style.display = "none";
  }

  if((!customTeacherName || !salutation) && selectedTeacher === "Other"){
    teacherError.style.display = "block";
    hasError = true;
  } else {
    teacherError.style.display = "none";
  }



  if (emailType === "select") {
    emailError.style.display = "block";
    hasError = true;
  } else {
    emailError.style.display = "none";
  }

  if (hasError) {
    return;
  }

  const templates = await loadEmailTemplates();
  const template = templates.templates[emailType];

  if (template) {
    const greeting = templates.greeting;
    const subject = template.subject;
    let body = template.body;
    body = body.replace("{userName}", userName);
    body = body.replace("{classSection}", classSection);
    body = body.replace("{rollNumber}", rollNumber);

    body = `${greeting} ${
      selectedTeacher === "other"
        ? teachersalutation + " " + getLastName(customTeacherName)
        : getLastName(selectedTeacher)
    },\n\n${body}\n\nRegards,\n${userName}\nSection: ${classSection}\nRoll No: ${rollNumber}`;

    if (selectedTeacher === "other") {
      document.getElementById("teacher-email").value = "";
    } else {
      const teacherEmail =
        templates.teachers.find((teacher) => teacher.name === selectedTeacher)
          ?.email || "Email not available";
      document.getElementById("teacher-email").value = teacherEmail;
    }

    document.getElementById("email-subject").value = subject;
    document.getElementById("email-body").textContent = body;
    document.getElementById("email-result-container").style.display = "block";
  } else {
    console.error("Email type not found.");
  }
}

async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    showCopyConfirmation();
  } catch (err) {
    console.error("Failed to copy: ", err);
  }
}

function copyTeacherEmail() {
  const teacherEmail = document.getElementById("teacher-email").value;
  if (teacherEmail) {
    navigator.clipboard
      .writeText(teacherEmail)
      .then(() => {
        showCopyConfirmation();
      })
      .catch((err) => {
        console.error("Failed to copy email: ", err);
      });
  } else {
    console.error("No email to copy.");
  }
}

function copySubject() {
  copyToClipboard(document.getElementById("email-subject").value);
}

function copyEmail() {
  copyToClipboard(document.getElementById("email-body").value);
}

function showCopyConfirmation() {
  const confirmation = document.getElementById("copy-confirmation");
  confirmation.classList.add("show");
  setTimeout(() => {
    confirmation.classList.remove("show");
  }, 2000);
}

function clearSelection() {
  if (window.getSelection) {
    window.getSelection().removeAllRanges();
  } else if (document.selection) {
    document.selection.empty();
  }
}
