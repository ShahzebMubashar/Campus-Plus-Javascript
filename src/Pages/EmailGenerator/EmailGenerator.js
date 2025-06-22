import React, { useState, useEffect } from "react";
import "./EmailGenerator.css";
import cardImage1 from "./images/7119120_3343837.webp";
import cardImage2 from "./images/7119122_3469564.webp";
import cardImage3 from "./images/10839364_4528064.webp";
import cardImage4 from "./images/12892955_5098267.webp";
import cardImage5 from "./images/6183568_3053908.webp";
import Navbar from "../Index/components/Navbar.js";
import EmailCard from "./components/EmailCard.js";
import EmailForm from "./components/EmailForm.js";
import templateData from './emails.json';
import { copyEmail, downloadEmail } from "./copy&download.js";

export default function EmailGenerator() {
    const [showEmailForm, setShowEmailForm] = useState(false);
    const [showResult, setShowResult] = useState(false);
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
    const [teachers, setTeachers] = useState([]);

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

    useEffect(() => {
        setTeachers(templateData.teachers);
    }, []);

    function getLastName(fullName) {
        const nameParts = fullName.split(" ");
        return nameParts[nameParts.length - 1];
    }

    async function onGenEmail() {
        const {
            userName,
            classSection,
            rollNumber,
            selectedTeacher,
            teacherSalutation,
            customTeacher,
            emailType
        } = formData;

        const template = templateData.templates[emailType];
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

            setShowResult(true);
            setEmailBody(body);
        } else {
            console.error("Email type not found.");
        }
    }


    const handleCloseForm = () => {
        setShowEmailForm(false);
        setShowResult(false);  // ← reset the result view

    };


    return (
        <div className="email-generator">
            <Navbar />
            <header>
                <h1>Email Generator</h1>
                <p>Email likhni hai? HUM LIKH DETAY—just let us know what you need!</p>
            </header>
            <div className="container">
                {!showEmailForm ? (
                    <div className="card-container">
                        {cards.map((card) => (
                            <EmailCard key={card.title} data={card} setShowEmailForm={setShowEmailForm} />
                        ))}
                    </div>
                ) : (
                    <EmailForm
                        teachers={templateData.teachers}
                        formData={formData}
                        setFormData={setFormData}
                        onGenEmail={onGenEmail}
                        setShowEmailForm={setShowEmailForm}
                    />
                )}
                {showResult && (
                    <div className="appResultContainer">
                        <button className="closeIcon" onClick={handleCloseForm}></button>
                        <textarea id="app-body" rows="10" readOnly>
                            {emailBody}
                        </textarea>
                        <div className="button-container">
                            <button className="btn btn-success" onClick={() => copyEmail(emailBody)}>Copy Application</button>
                            <button className="btn btn-info" onClick={() => downloadEmail(emailBody)}>Download Application</button>
                        </div>
                    </div>
                )}
                <div className="copy-confirmation" id="copy-confirmation">Copied to clipboard!</div>
            </div>
        </div>
    );
}

