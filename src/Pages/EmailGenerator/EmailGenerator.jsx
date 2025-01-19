import React, { useState, useEffect } from "react";
import "./EmailGenerator.css";
import cardImage1 from "./7119120_3343837.svg";
import cardImage2 from "./7119122_3469564.svg";
import cardImage3 from "./10839364_4528064.svg";
import cardImage4 from "./12892955_5098267.svg";
import cardImage5 from "./6183568_3053908.svg";
import Navbar from "../Index/components/Navbar";


const EmailGenerator = () => {
    const [teachers, setTeachers] = useState([]);
    const [selectedTeacher, setSelectedTeacher] = useState("");
    const [customTeacher, setCustomTeacher] = useState("");
    const [teacherSalutation, setTeacherSalutation] = useState("");
    const [emailType, setEmailType] = useState("");
    const [formData, setFormData] = useState({
        userName: "",
        classSection: "",
        rollNumber: "",
    });
    const [showEmailForm, setShowEmailForm] = useState(false);

    useEffect(() => {
        // Load email templates and teachers
        const loadTemplates = async () => {
            const response = await fetch("/assets/templates/emails.json");
            const data = await response.json();
            setTeachers(data.teachers);
        };

        loadTemplates();
    }, []);

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
                        <div
                            className="card"
                            onClick={() => setShowEmailForm(true)}
                        >
                            <img src={cardImage1} alt="Card" />
                            <div className="card-footer">
                                <h4>Academic Submissions</h4>
                                <p>Manage your assignments and submissions efficiently.</p>
                            </div>
                        </div>
                        <div
                            className="card"
                            onClick={() => setShowEmailForm(true)}
                        >
                            <img src={cardImage2} alt="Card" />
                            <div className="card-footer">
                                <h4>Academic Adjustments</h4>
                                <p>Request changes to your academic schedule or enrollment.</p>
                            </div>
                        </div>
                        <div
                            className="card"
                            onClick={() => setShowEmailForm(true)}
                        >
                            <img src={cardImage3} alt="Card" />
                            <div className="card-footer">
                                <h4>Opportunities and Support</h4>
                                <p>Explore internships, TA positions, and other support opportunities.</p>
                            </div>
                        </div>
                        <div
                            className="card"
                            onClick={() => setShowEmailForm(true)}
                        >
                            <img src={cardImage4} alt="Card" />
                            <div className="card-footer">
                                <h4>Study Abroad</h4>
                                <p>Inquire about study abroad programs to enhance your experience.</p>
                            </div>
                        </div>
                        <div
                            className="card"
                            onClick={() => setShowEmailForm(true)}
                        >
                            <img src={cardImage5} alt="Card" />
                            <div className="card-footer">
                                <h4>General Requests</h4>
                                <p>Submit general requests and manage miscellaneous matters</p>
                            </div>
                        </div>
                    </div>
                ) : (
                    // Email Form Phase
                    <div className="email-form">
                        <button
                            className="close-icon"
                            onClick={() => setShowEmailForm(false)}
                        >
                            ✖
                        </button>
                        <h5>Email Form</h5>
                        <div className="form-group">
                            <label>Name</label>
                            <input
                                type="text"
                                placeholder="Enter your name"
                                value={formData.userName}
                                onChange={(e) =>
                                    setFormData({ ...formData, userName: e.target.value })
                                }
                            />
                        </div>
                        <div className="form-group">
                            <label>Class Section</label>
                            <input
                                type="text"
                                placeholder="Enter your class section"
                                value={formData.classSection}
                                onChange={(e) =>
                                    setFormData({ ...formData, classSection: e.target.value })
                                }
                            />
                        </div>
                        <div className="form-group">
                            <label>Roll Number</label>
                            <input
                                type="text"
                                placeholder="Enter your roll number"
                                value={formData.rollNumber}
                                onChange={(e) =>
                                    setFormData({ ...formData, rollNumber: e.target.value })
                                }
                            />
                        </div>
                        <div className="form-group">
                            <label>Teacher</label>
                            <select
                                value={selectedTeacher}
                                onChange={(e) => setSelectedTeacher(e.target.value)}
                            >
                                <option value="">Select Teacher</option>
                                {teachers.map((teacher) => (
                                    <option key={teacher.name} value={teacher.name}>
                                        {teacher.name}
                                    </option>
                                ))}
                                <option value="Other">Other</option>
                            </select>
                            {selectedTeacher === "Other" && (
                                <div className="custom-teacher">
                                    <input
                                        type="text"
                                        placeholder="Enter teacher's name"
                                        value={customTeacher}
                                        onChange={(e) => setCustomTeacher(e.target.value)}
                                    />
                                    <select
                                        value={teacherSalutation}
                                        onChange={(e) => setTeacherSalutation(e.target.value)}
                                    >
                                        <option value="">Salutation</option>
                                        <option value="Dr.">Dr.</option>
                                        <option value="Mr.">Mr.</option>
                                        <option value="Ms.">Ms.</option>
                                    </select>
                                </div>
                            )}
                        </div>
                        <div className="form-group">
                            <label>Email Type</label>
                            <select
                                value={emailType}
                                onChange={(e) => setEmailType(e.target.value)}
                            >
                                <option value="select">Select Email Type</option>
                                <option value="assignment">Assignment Email</option>
                                <option value="project">Project Email</option>
                            </select>
                        </div>
                        <button className="btn btn-primary">Submit</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EmailGenerator;
