import React, { useState } from "react";
import "./Calculator.css";
import Navbar from "../Index/components/Navbar"
import pic1 from "../../Assets/images/3580920.webp"
import pic2 from "../../Assets/images/8899729.webp"

const Calculator = () => {
    const [active, setActive] = useState(false);
    const [showSGPA, setShowSGPA] = useState(true);
    const [showAggregate, setShowAggregate] = useState(false);

    const [courses, setCourses] = useState([]);
    const [numberOfCourses, setNumberOfCourses] = useState("");

    const [semesters, setSemesters] = useState([]);
    const [numberOfSemesters, setNumberOfSemesters] = useState("");

    const [marks, setMarks] = useState({
        obtainedMarks: "",
        totalMarks: "",
        fscObtainedMarks: "",
        fscTotalMarks: "",
        matricObtainedMarks: "",
        matricTotalMarks: "",
    });

    const [testType, setTestType] = useState("NTS");

    const [sgpaResult, setSgpaResult] = useState(null);
    const [cgpaResult, setCgpaResult] = useState(null);
    const [aggregateResult, setAggregateResult] = useState(null);

    const generateCourses = () => {
        const count = Number.parseInt(numberOfCourses) || 0;
        setCourses(
            Array.from({ length: count }, () => ({
                courseName: "",
                creditHours: "1",
                grade: "4.00",
            }))
        );
    };

    const generateSemesters = () => {
        const count = Number.parseInt(numberOfSemesters) || 0;
        setSemesters(
            Array.from({ length: count }, () => ({
                creditHours: "",
                gpa: "",
            }))
        );
    };

    const calculateSGPA = () => {
        let totalCreditHours = 0;
        let totalGradePoints = 0;

        courses.forEach((course) => {
            totalCreditHours += Number.parseInt(course.creditHours);
            totalGradePoints +=
                Number.parseInt(course.creditHours) * Number.parseFloat(course.grade);
        });

        const sgpa = totalGradePoints / totalCreditHours;
        setSgpaResult(sgpa.toFixed(2));
    };

    const calculateCGPA = () => {
        let totalCreditHours = 0;
        let totalGradePoints = 0;

        semesters.forEach((semester) => {
            totalCreditHours += Number.parseInt(semester.creditHours);
            totalGradePoints +=
                Number.parseInt(semester.creditHours) * Number.parseFloat(semester.gpa);
        });

        const cgpa = totalGradePoints / totalCreditHours;
        setCgpaResult(cgpa.toFixed(2));
    };

    const calculateAggregate = () => {
        let aggregate;
        if (testType === "NU") {
            aggregate =
                ((Number.parseFloat(marks.obtainedMarks) / Number.parseFloat(marks.totalMarks)) * 0.5 +
                    (Number.parseFloat(marks.fscObtainedMarks) / Number.parseFloat(marks.fscTotalMarks)) * 0.3 +
                    (Number.parseFloat(marks.matricObtainedMarks) / Number.parseFloat(marks.matricTotalMarks)) * 0.2) * 100;
        } else {
            aggregate =
                ((Number.parseFloat(marks.obtainedMarks) / Number.parseFloat(marks.totalMarks)) * 0.6 +
                    (Number.parseFloat(marks.fscObtainedMarks) / Number.parseFloat(marks.fscTotalMarks)) * 0.2 +
                    (Number.parseFloat(marks.matricObtainedMarks) / Number.parseFloat(marks.matricTotalMarks)) * 0.2) * 100;
        }
        setAggregateResult(aggregate.toFixed(2));
    };

    return (
        <div className="calculator-app-container">
            <Navbar />

            {!active ? (
                <div className="calculator-landing-page">
                    <div className="calculator-header">
                        <h1>Academic Calculators</h1>
                        <p>Grades ka Stress? Aao dekhein kitna pani mai ho aap!</p>
                    </div>
                    <div className="calculator-cards-container">
                        <div className="calculator-card" onClick={() => {
                            setActive(true);
                            setShowAggregate(false);
                            setShowSGPA(true);
                        }}>
                            <div className="calculator-card-image">
                                <img src="" alt="SGPA Calculator" />
                            </div>
                            <div className="calculator-card-content">
                                <h2>SGPA/CGPA Calculator</h2>
                                <p>Calculate your semester or cumulative GPA.</p>
                            </div>
                        </div>
                        <div className="calculator-card" onClick={() => {
                            setActive(true);
                            setShowAggregate(true);
                        }}>
                            <div className="calculator-card-image">
                                <img src="/placeholder.svg" alt="Aggregate Calculator" />
                            </div>
                            <div className="calculator-card-content">
                                <h2>Aggregate Calculator</h2>
                                <p>Calculate your aggregate on NU/SAT test.</p>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="calculator-page">
                    <div className="calculator-header">
                        <h1>Academic Calculators</h1>
                        <p>Grades ka Stress? Aao dekhein kitna pani mai ho aap!</p>
                    </div>

                    {active && !showAggregate && (
                        <div className="sgpa-cgpa-section">
                            <div className="toggle-buttons">
                                <button onClick={() => setShowSGPA(true)} className={showSGPA ? "active" : ""}>SGPA</button>
                                <button onClick={() => setShowSGPA(false)} className={!showSGPA ? "active" : ""}>CGPA</button>
                            </div>

                            {showSGPA ? (
                                <div className="sgpa-calculator">
                                    <h2>SGPA Calculator</h2>
                                    <label>Number of Courses:</label>
                                    <input
                                        type="number"
                                        value={numberOfCourses}
                                        onChange={(e) => setNumberOfCourses(e.target.value)}
                                    />
                                    <button onClick={generateCourses}>Generate</button>
                                    {courses.map((course, index) => (
                                        <div key={index} className="course-input">
                                            <input
                                                type="text"
                                                placeholder="Course Name"
                                                value={course.courseName}
                                                onChange={(e) => {
                                                    const updated = [...courses];
                                                    updated[index].courseName = e.target.value;
                                                    setCourses(updated);
                                                }}
                                            />
                                            <select
                                                value={course.creditHours}
                                                onChange={(e) => {
                                                    const updated = [...courses];
                                                    updated[index].creditHours = e.target.value;
                                                    setCourses(updated);
                                                }}
                                            >
                                                <option value="0">0 CH</option>
                                                <option value="1">1 CH</option>
                                                <option value="2">2 CH</option>
                                                <option value="3">3 CH</option>
                                                <option value="4">4 CH</option>
                                            </select>
                                            <select
                                                value={course.grade}
                                                onChange={(e) => {
                                                    const updated = [...courses];
                                                    updated[index].grade = e.target.value;
                                                    setCourses(updated);
                                                }}
                                            >
                                                <option value="4.00">A+</option>
                                                <option value="4.00">A</option>
                                                <option value="3.67">A-</option>
                                                <option value="3.33">B+</option>
                                                <option value="3.00">B</option>
                                                <option value="2.67">B-</option>
                                                <option value="2.33">C+</option>
                                                <option value="2.00">C</option>
                                                <option value="1.67">D+</option>
                                                <option value="1.33">D</option>
                                                <option value="0.00">F</option>
                                            </select>
                                        </div>
                                    ))}
                                    <button onClick={calculateSGPA}>Calculate SGPA</button>
                                    {sgpaResult && <p>Your SGPA is: {sgpaResult}</p>}
                                </div>
                            ) : (
                                <div className="cgpa-calculator">
                                    <h2>CGPA Calculator</h2>
                                    <label>Number of Semesters:</label>
                                    <input
                                        type="number"
                                        value={numberOfSemesters}
                                        onChange={(e) => setNumberOfSemesters(e.target.value)}
                                    />
                                    <button onClick={generateSemesters}>Generate</button>
                                    {semesters.map((semester, index) => (
                                        <div key={index} className="semester-input">
                                            <label>Semester {index + 1}</label>
                                            <input
                                                type="number"
                                                placeholder="Credit Hours"
                                                value={semester.creditHours}
                                                onChange={(e) => {
                                                    const updated = [...semesters];
                                                    updated[index].creditHours = e.target.value;
                                                    setSemesters(updated);
                                                }}
                                            />
                                            <input
                                                type="number"
                                                placeholder="GPA"
                                                value={semester.gpa}
                                                onChange={(e) => {
                                                    const updated = [...semesters];
                                                    updated[index].gpa = e.target.value;
                                                    setSemesters(updated);
                                                }}
                                            />
                                        </div>
                                    ))}
                                    <button onClick={calculateCGPA}>Calculate CGPA</button>
                                    {cgpaResult && <p>Your CGPA is: {cgpaResult}</p>}
                                </div>
                            )}
                        </div>
                    )}

                    {showAggregate && (
                        <div className="aggregate-section">
                            <h2>Aggregate Calculator</h2>
                            <select value={testType} onChange={(e) => setTestType(e.target.value)}>
                                <option value="NTS">NTS</option>
                                <option value="NU">NU</option>
                            </select>
                            <input
                                type="number"
                                placeholder="Entry Test Marks"
                                value={marks.obtainedMarks}
                                onChange={(e) => setMarks({ ...marks, obtainedMarks: e.target.value })}
                            />
                            <input
                                type="number"
                                placeholder="Total Entry Test Marks"
                                value={marks.totalMarks}
                                onChange={(e) => setMarks({ ...marks, totalMarks: e.target.value })}
                            />
                            <input
                                type="number"
                                placeholder="FSC Marks"
                                value={marks.fscObtainedMarks}
                                onChange={(e) => setMarks({ ...marks, fscObtainedMarks: e.target.value })}
                            />
                            <input
                                type="number"
                                placeholder="Total FSC Marks"
                                value={marks.fscTotalMarks}
                                onChange={(e) => setMarks({ ...marks, fscTotalMarks: e.target.value })}
                            />
                            <input
                                type="number"
                                placeholder="Matric Marks"
                                value={marks.matricObtainedMarks}
                                onChange={(e) => setMarks({ ...marks, matricObtainedMarks: e.target.value })}
                            />
                            <input
                                type="number"
                                placeholder="Total Matric Marks"
                                value={marks.matricTotalMarks}
                                onChange={(e) => setMarks({ ...marks, matricTotalMarks: e.target.value })}
                            />
                            <button onClick={calculateAggregate}>Calculate Aggregate</button>
                            {aggregateResult && <p>Your Aggregate is: {aggregateResult}%</p>}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Calculator;
