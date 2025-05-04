import React, { useState, useEffect } from "react";
import "./ApplicationGenerator.css";
import cardImage1 from "./images/7119120_3343837.webp";
import cardImage2 from "./images/7119122_3469564.webp";
import cardImage3 from "./images/10839364_4528064.webp";
import cardImage4 from "./images/12892955_5098267.webp";
import cardImage5 from "./images/6183568_3053908.webp";
import Navbar from "../Index/components/Navbar.js";
import Card from "./Components/Card.js";
import Form from "./Components/Form.js";
import templateData from './check.json';
import { copyApplication, downloadApplication } from "./copyanddownload.js";

export default function ApplicationGenerator() {
    const [showForm, setShowForm] = useState(false);
    const [formTitle, setFormTitle] = useState("");
    const [showResult, setShowResult] = useState(false);
    const [templates, setTemplates] = useState("");
    const [formData, setFormData] = useState({
        name: "",
        classSection: "",
        rollNumber: "",
        phoneNumber: "",
        salutation: "",
        recipientName: "",
        campusName: "",
        applicationType: "",
        todayDate:new Date().toISOString().split('T')[0]
    });
    const [appBody, setAppBody] = useState("");
    let emailTypes=[]
    for (let key in templateData.templates){
emailTypes.push(key);
   }
    const Cards = [
        { title: "Academic Requests", info: "Submit applications related to academic matters, such as leave requests or exam retakes.", image: cardImage1 },
        { title: "Organizational and Event Requests", info: "Apply for permissions to organize events or change classroom settings.", image: cardImage2 },
        { title: "Facility and Resource Requests", info: "Request additional facilities or resources for your campus.", image: cardImage3 },
        { title: "Job and Role Application", info: "Submit your applications for job roles such as Lab Teaching Assistant or similar positions.", image: cardImage4 },
        { title: "Appeals and Ethical Concerns", info: "File appeals for disciplinary actions or raise concerns about ethical matters within the institution.", image: cardImage5 }
    ];

    useEffect(() => {
        const fetchTemplates = async () => {
            try {
                const template = await loadAppTemplates();
                setTemplates(template);
            } catch (e) {
                console.error(e);
            }
        };

        fetchTemplates();
    }, []);

    async function loadAppTemplates() {
        const response = await fetch("./template.json?cache_bust=" + new Date().getTime());
        const data = await response.json();
        return data;
    }

    function formatDate() {
        const options = { year: "numeric", month: "long", day: "numeric" };
        const today = new Date();
        return today.toLocaleDateString("en-US", options);
    }

    async function handleAppGen() {
        setShowResult(true);
        const { name, applicationType, recipientName, todayDate, classSection, rollNumber, phoneNumber, campusName, salutation } = formData;

        const template = templateData.templates[applicationType];
        if (template) {
            const greeting = templateData.greeting;
            const subject = template.subject;
            const nameParts = recipientName.split(" ");
            const lastName = nameParts[nameParts.length - 1];
            let body = template.body;
            body = body.replace("{todayDate}", todayDate);
            body = body.replace("{subject}", subject);
            body = body.replace("{userName}", name);
            body = body.replace("{classSection}", classSection);
            body = body.replace("{rollNumber}", rollNumber);
            body = body.replace("{phoneNumber}", phoneNumber);

            body = `${formatDate()}\n\n${recipientName}\n\n[Add Department]\n\nFAST-NUCES,\n\n${campusName}.\n\nSubject: ${subject}\n\n${greeting} ${salutation}${lastName},\n\n${body}\n\nYours sincerely,\n${name}\nSection: ${classSection}     \n Roll No: ${rollNumber}\nPhone No: ${phoneNumber}`;

            setAppBody(body);
        }
    }

    const handleCardClick = (title) => {
        setFormTitle(title);
        setShowForm(true);
        setFormData(prev=>({...prev,applicationType:title}))
    };

    const handleCloseForm = () => {
        setShowForm(false);
    };

    return (
        <div className="application-generator">
            <Navbar />
            <header>
                <h1>Application Generator</h1>
                <p>Generate applications for academic, organizational, and other purposes!</p>
            </header>
            {!showForm ? (
                <div className="container">
                    <div className="card-container">
                        {Cards.map((card) => (
                            <Card data={card} handleCardClick={handleCardClick} key={card.title}/>
                        ))}
                    </div>
                </div>
            ) : (
                <Form formTitle={formTitle} formData={formData} setFormData={setFormData} setShowForm={setShowForm} handleAppGen={handleAppGen} />
            )}

            {showResult && (
                <div className="appResultContainer">
                    <button className="closeIcon" onClick={handleCloseForm}></button>
                    <textarea id="app-body" rows="10" readOnly>{appBody}</textarea>
                    <div className="button-container">
                        <button className="btn btn-success" onClick={() => copyApplication(appBody)}>Copy Application</button>
                        <button className="btn btn-info" onClick={() => downloadApplication(appBody)}>Download Application</button>
                    </div>
                </div>
            )}
            <div className="copy-confirmation" id="copy-confirmation">Copied to clipboard!</div>
        </div>
    );
}
