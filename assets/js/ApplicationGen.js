//classSection, userName, rollNumber, campusName, recipientName,  applicationTypes
window.onload = function () {
  loadAppTemplates();
};

async function loadAppTemplates() {
  const response = await fetch("/assets/templates/applications.json");
  const data = await response.json();
  return data;
}

function showAppGen(title, applicationTypes) {
  const applicationTypeSelect = document.getElementById("app-type");
  applicationTypeSelect.innerHTML = ""; // Clear previous options
  applicationTypes.forEach((type) => {
    const option = document.createElement("option");
    option.value = type.toLowerCase().replace(/\s+/g, "-");
    option.innerText = type;
    applicationTypeSelect.appendChild(option);
  });
  document.getElementById("app-gen-container").style.display = "block";
  document.getElementById("card-container").style.display = "none";
  document.getElementById("app-gen-title").textContent = title;
}

function closeAppGen() {
  // Hide the application generator and result containers
  document.getElementById("app-gen-container").style.display = "none";
  document.getElementById("app-result-container").style.display = "none";
  document.getElementById("card-container").style.display = "flex";

  // Clear all input fields
  document.getElementById("user-name").value = "";
  document.getElementById("class-section").value = "";
  document.getElementById("roll-number").value = "";
  document.getElementById("phone-number").value = "";
  document.getElementById("recipient-salutation").value = "";
  document.getElementById("recipient-name").value = "";
  document.getElementById("campus-select").value = "";
  document.getElementById("app-type").value = "";

  // Hide any error messages
  document.getElementById("name-error").style.display = "none";
  document.getElementById("class-error").style.display = "none";
  document.getElementById("roll-error").style.display = "none";
  document.getElementById("phone-error").style.display = "none";
  document.getElementById("recipient-name-error").style.display = "none";
  document.getElementById("campus-error").style.display = "none";
  document.getElementById("app-type-error").style.display = "none";
}


function formatDate() {
  const options = { year: "numeric", month: "long", day: "numeric" };
  const today = new Date();
  return today.toLocaleDateString("en-US", options);
}

async function showAppResult() {
  const userName = document.getElementById("user-name").value.trim();
  const classSection = document.getElementById("class-section").value.trim();
  const rollNumber = document.getElementById("roll-number").value.trim();
  const phoneNumber = document.getElementById("phone-number").value.trim();
  const recipientName = document.getElementById("recipient-name").value.trim();
  const salutation = document
    .getElementById("recipient-salutation")
    .value.trim();
  const campusName = document.getElementById("campus-select").value.trim();
  const applicationType = document.getElementById("app-type").value;
  const todayDate = formatDate();
  const nameError = document.getElementById("name-error");
  const classError = document.getElementById("class-error");
  const rollError = document.getElementById("roll-error");
  const phoneError = document.getElementById("phone-error");
  const recipientError = document.getElementById("recipient-name-error");
  const campusError = document.getElementById("campus-error");
  const applicationError = document.getElementById("app-type-error");

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
  if (!phoneNumber || phoneNumber.length < 10 || phoneNumber.length > 15) {
    phoneError.style.display = "block";
    hasError = true;
  } else {
    phoneError.style.display = "none";
  }
  if (!recipientError || !salutation) {
    recipientError.style.display = "block";
    hasError = true;
  } else {
    recipientError.style.display = "none";
  }
  if (!campusName) {
    campusError.style.display = "block";
    hasError = true;
  } else {
    campusError.style.display = "none";
  }
  if (applicationType === "select") {
    applicationError.style.display = "block";
    hasError = true;
  } else {
    applicationError.style.display = "none";
  }

  if (hasError) {
    return;
  }

  const templates = await loadAppTemplates();
  const template = templates.templates[applicationType];

  if (template) {
    const greeting = templates.greeting;
    const subject = template.subject;
    // Split the name by spaces
    const nameParts = recipientName.split(" ");
    // Get the last name
    const lastName = nameParts[nameParts.length - 1];
    let body = template.body;
    body = body.replace("{todayDate}", todayDate);
    body = body.replace("{subject}", subject);
    body = body.replace("{userName}", userName);
    body = body.replace("{classSection}", classSection);
    body = body.replace("{rollNumber}", rollNumber);
    body = body.replace("{phoneNumber}", phoneNumber);
    body = `${todayDate}\n\n${recipientName}\n\n[Add Department]\n\nFAST-NUCES,\n\n${campusName}.\n\nSubject: ${subject}\n\n${greeting} ${salutation}${lastName},\n\n${body}\n\nYours sincerely,\n${userName}\nSection: ${classSection}      Roll No: ${rollNumber}\nPhone No: ${phoneNumber}`;

    document.getElementById("app-body").textContent = body;
    document.getElementById("app-result-container").style.display = "block";
  } else {
    console.error("Application type not found.");
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

function copySubject() {
  copyToClipboard(document.getElementById("app-subject").value);
}

function copyApp() {
  copyToClipboard(document.getElementById("app-body").value);
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

async function downloadApplication() {
  const { Document, Packer, Paragraph, TextRun } = docx;

  // Get the application body content
  const appBody = document.getElementById("app-body").value;

  // Split the content into paragraphs
  const paragraphs = appBody.split("\n").map(
    (line) =>
      new Paragraph({
        children: [new TextRun(line)],
      })
  );

  // Create a new Document
  const doc = new Document({
    sections: [
      {
        properties: {},
        children: paragraphs,
      },
    ],
  });

  // Create a .docx file and trigger download
  Packer.toBlob(doc)
    .then((blob) => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "Application.docx";
      document.body.appendChild(a);
      a.click();

      // Clean up
      setTimeout(() => {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      }, 0);
    })
    .catch((err) => {
      console.error("Error creating .docx file:", err);
    });
}
