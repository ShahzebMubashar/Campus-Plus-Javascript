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
                                <img src={pic2} alt="SGPA Calculator" />
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
                                <img src={pic1} alt="Aggregate Calculator" />
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
                                    <h2 className="courses-title">Number of Courses</h2>
                                    <div className="input-container">
                                        <input
                                            type="number"
                                            value={numberOfCourses}
                                            onChange={(e) => setNumberOfCourses(e.target.value)}
                                            className="courses-input"
                                        />
                                    </div>
                                    <div className="generate-button-container">
                                        <button onClick={generateCourses} className="generate-btn">
                                            Generate
                                        </button>
                                    </div>

                                    {courses.length > 0 && (
                                        <div className="courses-container">
                                            {courses.map((course, index) => (
                                                <div key={index} className="course-row">
                                                    <div className="course-field">
                                                        <label>Course Name</label>
                                                        <input
                                                            type="text"
                                                            placeholder="Enter Course Name"
                                                            value={course.courseName}
                                                            onChange={(e) => {
                                                                const updated = [...courses]
                                                                updated[index].courseName = e.target.value
                                                                setCourses(updated)
                                                            }}
                                                        />
                                                    </div>
                                                    <div className="course-field">
                                                        <label>Credit Hours</label>
                                                        <select
                                                            value={course.creditHours}
                                                            onChange={(e) => {
                                                                const updated = [...courses]
                                                                updated[index].creditHours = e.target.value
                                                                setCourses(updated)
                                                            }}
                                                        >
                                                            <option value="0">0</option>
                                                            <option value="1">1</option>
                                                            <option value="2">2</option>
                                                            <option value="3">3</option>
                                                            <option value="4">4</option>
                                                        </select>
                                                    </div>
                                                    <div className="course-field">
                                                        <label>Grade</label>
                                                        <select
                                                            value={course.grade}
                                                            onChange={(e) => {
                                                                const updated = [...courses]
                                                                updated[index].grade = e.target.value
                                                                setCourses(updated)
                                                            }}
                                                        >
                                                            <option value="4.00">A/A+</option>
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
                                                </div>
                                            ))}
                                            <button onClick={calculateSGPA} className="calculate-btn">
                                                Calculate SGPA
                                            </button>
                                            {sgpaResult && <p className="result">Your SGPA is: {sgpaResult}</p>}
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="cgpa-calculator">
                                    <h2 className="courses-title">Number of Semesters</h2>
                                    <div className="input-container">
                                        <input
                                            type="number"
                                            value={numberOfSemesters}
                                            onChange={(e) => setNumberOfSemesters(e.target.value)}
                                            className="courses-input"
                                        />
                                    </div>
                                    <div className="generate-button-container">
                                        <button onClick={generateSemesters} className="generate-btn">
                                            Generate
                                        </button>
                                    </div>

                                    {semesters.length > 0 && (
                                        <div className="semesters-container">
                                            {semesters.map((semester, index) => (
                                                <div key={index} className="semester-row">
                                                    <div className="semester-field">
                                                        <label>Semester {index + 1}</label>
                                                    </div>
                                                    <div className="semester-field">
                                                        <label>Credit Hours</label>
                                                        <input
                                                            type="number"
                                                            placeholder="Credit Hours"
                                                            value={semester.creditHours}
                                                            onChange={(e) => {
                                                                const updated = [...semesters]
                                                                updated[index].creditHours = e.target.value
                                                                setSemesters(updated)
                                                            }}
                                                        />
                                                    </div>
                                                    <div className="semester-field">
                                                        <label>GPA</label>
                                                        <input
                                                            type="number"
                                                            placeholder="GPA"
                                                            value={semester.gpa}
                                                            onChange={(e) => {
                                                                const updated = [...semesters]
                                                                updated[index].gpa = e.target.value
                                                                setSemesters(updated)
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                            <button onClick={calculateCGPA} className="calculate-btn">
                                                Calculate CGPA
                                            </button>
                                            {cgpaResult && <p className="result">Your CGPA is: {cgpaResult}</p>}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )
                    }


                    {active && showAggregate && (
                        <div className="aggregate-calculator">
                            <h2>Aggregate Calculator</h2>
                            <label>Test Type</label>
                            <select value={testType} onChange={(e) => setTestType(e.target.value)}>
                                <option value="NU">NU</option>
                                <option value="NTS">NTS</option>
                            </select>
                            <label>Marks Obtained</label>
                            <input
                                type="number"
                                value={marks.obtainedMarks}
                                onChange={(e) => setMarks({ ...marks, obtainedMarks: e.target.value })}
                            />
                            <label>Total Marks</label>
                            <input
                                type="number"
                                value={marks.totalMarks}
                                onChange={(e) => setMarks({ ...marks, totalMarks: e.target.value })}
                            />
                            <label>FSC Marks</label>
                            <input
                                type="number"
                                value={marks.fscObtainedMarks}
                                onChange={(e) => setMarks({ ...marks, fscObtainedMarks: e.target.value })}
                            />
                            <label>FSC Total</label>
                            <input
                                type="number"
                                value={marks.fscTotalMarks}
                                onChange={(e) => setMarks({ ...marks, fscTotalMarks: e.target.value })}
                            />
                            <label>Matric Marks</label>
                            <input
                                type="number"
                                value={marks.matricObtainedMarks}
                                onChange={(e) => setMarks({ ...marks, matricObtainedMarks: e.target.value })}
                            />
                            <label>Matric Total</label>
                            <input
                                type="number"
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
