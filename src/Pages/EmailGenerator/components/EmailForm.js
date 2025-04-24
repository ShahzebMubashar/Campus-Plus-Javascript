import React, { useState } from "react";
import templateData from '../emails.json'
const EmailForm = ({ teachers,formData,setFormData,onGenEmail }) => {
    let emailTypes=[]
  for(let key in templateData.templates) 
  {
    emailTypes.push(key)
  }
    const [showEmailForm, setShowEmailForm] = useState(true);

    const handleChange = (field, value) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const teacherName =
            formData.selectedTeacher === "Other"
                ? `${formData.teacherSalutation} ${formData.customTeacher}`
                : formData.selectedTeacher;

        const emailData = {
            userName: formData.userName,
            classSection: formData.classSection,
            rollNumber: formData.rollNumber,
            teacher: teacherName,
            emailType: formData.emailType,
        };

        console.log("Form Submitted:", emailData);

        // Reset the form or trigger additional actions here
        setFormData({
            userName: "",
            classSection: "",
            rollNumber: "",
            selectedTeacher: "",
            customTeacher: "",
            teacherSalutation: "",
            emailType: "select",
        });
        //setShowEmailForm(false);
        onGenEmail();
    };

    if (!showEmailForm) return null;

    return (
        <div className="email-form">
            <button
                className="close-icon"
                onClick={() => setShowEmailForm(false)}
            >
                ✖
            </button>
            <h5>Email Form</h5>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Name</label>
                    <input
                        type="text"
                        placeholder="Enter your name"
                        value={formData.userName}
                        onChange={(e) => handleChange("userName", e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label>Class Section</label>
                    <input
                        type="text"
                        placeholder="Enter your class section"
                        value={formData.classSection}
                        onChange={(e) => handleChange("classSection", e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label>Roll Number</label>
                    <input
                        type="text"
                        placeholder="Enter your roll number"
                        value={formData.rollNumber}
                        onChange={(e) => handleChange("rollNumber", e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label>Teacher</label>
                    <select
                        value={formData.selectedTeacher}
                        onChange={(e) => handleChange("selectedTeacher", e.target.value)}
                    >
                        <option value="">Select Teacher</option>
                        {teachers.map((teacher) => (
                            <option key={teacher.name} value={teacher.name}>
                                {teacher.name}
                            </option>
                        ))}
                        <option value="Other">Other</option>
                    </select>
                    {formData.selectedTeacher === "Other" && (
                        <div className="custom-teacher">
                            <input
                                type="text"
                                placeholder="Enter teacher's name"
                                value={formData.customTeacher}
                                onChange={(e) => handleChange("customTeacher", e.target.value)}
                            />
                            <select
                                value={formData.teacherSalutation}
                                onChange={(e) =>
                                    handleChange("teacherSalutation", e.target.value)
                                }
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
                        value={formData.emailType}
                        onChange={(e) => handleChange("emailType", e.target.value)}
                    >
                    {emailTypes.map(type=>(<option>{type}</option>))}
                        {/* <option value="select">Select Email Type</option>
                        <option value="assignment">Assignment Email</option>
                        <option value="project">Project Email</option> */}
                    </select>
                </div>
                <button type="submit" className="btn btn-primary">
                    Submit
                </button>
            </form>
        </div>
    );
};

export default EmailForm;
