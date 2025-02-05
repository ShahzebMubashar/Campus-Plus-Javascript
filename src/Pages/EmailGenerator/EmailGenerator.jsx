import React, { useState, useEffect } from "react";
import "./EmailGenerator.css";
import cardImage1 from "./images/7119120_3343837.webp";
import cardImage2 from "./images/7119122_3469564.webp";
import cardImage3 from "./images/10839364_4528064.webp";
import cardImage4 from "./images/12892955_5098267.webp";
import cardImage5 from "./images/6183568_3053908.webp";
import Navbar from "../Index/components/Navbar";
import templateData from './emails.json';
import EmailForm from "./components/EmailForm";
import EmailCard from "./components/EmailCard";
import { copyEmail, downloadEmail } from "./copy&download";

export default function EmailGenerator() {
  const cards = [
    {
      title: "Academic Submissions",
      description: "Manage your assignments and submissions efficiently.",
      image: cardImage1,
    },
    {
      title: "Academic Adjustments",
      description: "Request changes to your academic schedule or enrollment.",
      image: cardImage2,
    },
    {
      title: "Opportunities and Support",
      description: "Explore internships, TA positions, and other support opportunities.",
      image: cardImage3,
    },
    {
      title: "Study Abroad",
      description: "Inquire about study abroad programs to enhance your experience.",
      image: cardImage4,
    },
    {
      title: "General Requests",
      description: "Submit general requests and manage miscellaneous matters.",
      image: cardImage5,
    },
  ];

  const [teachers, setTeachers] = useState("")
  const [emailBody, setEmailBody] = useState("");
  const [formData, setFormData] = useState({
    userName: "",
    classSection: "",
    rollNumber: "",
    selectedTeacher: "",
    customTeacher: "",
    teacherSalutation: "",
    emailType: "select",
  });
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [showResult, setShowResult] = useState(false)
  useEffect(() => {
    // Load email templates and teachers
    const loadTemplates = async () => {

      setTeachers(templateData.teachers);
    };

    loadTemplates();
  }, []);

  function getLastName(fullName) {
    // Split the full name by spaces and get the last segment
    const nameParts = fullName.split(" ");
    return nameParts[nameParts.length - 1];
  }

  async function onGenEmail() {

    const {
      userName,
      classSection,
      rollNumber,
      selectedTeacher,
      teacherSalutation, customTeacher,
      emailType } = formData


    // const templates = await loadEmailTemplates();
    const template = templateData.templates[emailType];
    console.log(emailType);
    if (template) {
      const greeting = templateData.greeting;
      const subject = template.subject;
      let body = template.body;
      body = body.replace("{userName}", userName);
      body = body.replace("{classSection}", classSection);
      body = body.replace("{rollNumber}", rollNumber);

      body = `${greeting} ${selectedTeacher === "other"
          ? teacherSalutation + " " + getLastName(customTeacher)
          : getLastName(selectedTeacher)
        },\n\n${body}\n\nRegards,\n${userName}\nSection: ${classSection}\nRoll No: ${rollNumber}`;

      //   if (selectedTeacher === "other") {
      //     document.getElementById("teacher-email").value = "";
      //   } else {
      //     const teacherEmail =
      //       templateData.teachers.find((teacher) => teacher.name === selectedTeacher)
      //         ?.email || "Email not available";
      //     document.getElementById("teacher-email").value = teacherEmail;
      //   }
      setShowResult(true)

      setEmailBody(body)
    } else {
      console.error("Email type not found.");
    }
  }

  return (
    <div className="email-generator">
      <Navbar />
      {/* Fixed Header */}
      <header>
        <h1>Email Generator</h1>
        <p>Email likhni hai? HUM LIKH DETAY—just let us know what you need!</p>
      </header>

      <div className="container">
        {!showEmailForm ? (
          // Card Phase
          <div className="card-container">
            {cards.map((card) =>
              <EmailCard data={card} setShowEmailForm={setShowEmailForm} />
            )}
          </div>
        ) : (
          // Email Form Phase
          <EmailForm teachers={templateData.teachers} formData={formData} setFormData={setFormData} onGenEmail={onGenEmail}></EmailForm>
        )}
        {showResult ? (<><div className="appResultContainer">

          <button className="closeIcon"></button>
          <textarea id="app-body" rows="10"
            readonly>{emailBody}</textarea>
          <div className="button-container">
            <button className="btn btn-success" onClick={() => copyEmail(emailBody)}>Copy Application</button>
            <button className="btn btn-info" onClick={() => downloadEmail(emailBody)}>Download Application</button>
          </div>
        </div>
          <div className="copy-confirmation" id="copy-confirmation">Copied to clipboard!</div>

        </>) : (<p></p>)}            </div>
    </div>
  );
};

