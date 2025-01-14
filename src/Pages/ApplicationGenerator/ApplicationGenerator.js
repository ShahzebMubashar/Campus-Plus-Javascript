import React, { useState } from "react";
import "./ApplicationGenerator.css";
import cardImage1 from "./7119120_3343837.svg";
import cardImage2 from "./7119122_3469564.svg";
import cardImage3 from "./10839364_4528064.svg";
import cardImage4 from "./12892955_5098267.svg";
import cardImage5 from "./6183568_3053908.svg";

const ApplicationGenerator = () => {
    const [showForm, setShowForm] = useState(false);
    const [formTitle, setFormTitle] = useState("");

    const handleCardClick = (title) => {
        setFormTitle(title);
        setShowForm(true);
    };

    const handleCloseForm = () => {
        setShowForm(false);
    };

    return (
        <div className="application-generator">
            <header>
                <h1>Application Generator</h1>
                <p>Generate applications for academic, organizational, and other purposes!</p>
            </header>
            {!showForm ? (
                <div className="container">
                    <div className="card-container">
                        <div className="card" onClick={() => handleCardClick("Academic Requests")}>
                            <img src={cardImage1} alt="Academic Requests" />
                            <div className="card-footer">
                                <h4>Academic Requests</h4>
                                <p>Submit applications related to academic matters, such as leave requests or exam retakes.</p>
                            </div>
                        </div>
                        <div className="card" onClick={() => handleCardClick("Organizational and Event Requests")}>
                            <img src={cardImage2} alt="Organizational Requests" />
                            <div className="card-footer">
                                <h4>Organizational and Event Requests</h4>
                                <p>Apply for permissions to organize events or change classroom settings.</p>
                            </div>
                        </div>
                        <div className="card" onClick={() => handleCardClick("Facility and Resource Requests")}>
                            <img src={cardImage3} alt="Resource Requests" />
                            <div className="card-footer">
                                <h4>Facility and Resource Requests</h4>
                                <p>Request additional facilities or resources for your campus.</p>
                            </div>
                        </div>
                        {/* Add more cards as needed */}
                    </div>
                </div>
            ) : (
                <div className="application-form">
                    <button className="close-icon" onClick={handleCloseForm}>
                        ×
                    </button>
                    <h5>{formTitle}</h5>
                    <div className="form-group">
                        <label>Name</label>
                        <input type="text" placeholder="Enter your name" />
                    </div>
                    <div className="form-group">
                        <label>Class Section</label>
                        <input type="text" placeholder="Enter your class section" />
                    </div>
                    <div className="form-group">
                        <label>Roll Number</label>
                        <input type="text" placeholder="Enter your roll number" />
                    </div>
                    <div className="form-group">
                        <label>Phone Number</label>
                        <input type="text" placeholder="Enter your phone number" />
                    </div>
                    <div className="form-group">
                        <label>Recipient</label>
                        <div className="recipient-input">
                            <select>
                                <option>Salutation</option>
                                <option>Mr.</option>
                                <option>Ms.</option>
                                <option>Dr.</option>
                            </select>
                            <input type="text" placeholder="Enter the recipient full name" />
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Select Campus</label>
                        <select>
                            <option>Campus</option>
                            <option>Main Campus</option>
                            <option>City Campus</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Application Type</label>
                        <select>
                            <option>Select</option>
                            <option>Leave Application</option>
                            <option>Event Request</option>
                            <option>Resource Request</option>
                        </select>
                    </div>
                    <button className="btn">Generate Application</button>
                </div>
            )}
        </div>
    );
};

export default ApplicationGenerator;
