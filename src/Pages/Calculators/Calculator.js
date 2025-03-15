import React, { useState } from "react";
import "./Calculator.css";

const Calculator = () => {
    const [active, setActive] = useState(false);
    const [showSGPA, setShowSGPA] = useState(true);
    const [courses, setCourses] = useState([]);
    const [semesters, setSemesters] = useState([]);
    const [sgpaResult, setSgpaResult] = useState(null);
    const [cgpaResult, setCgpaResult] = useState(null);
    const [aggregateResult, setAggregateResult] = useState(null);
    const [numberOfCourses, setNumberOfCourses] = useState("");
    const [numberOfSemesters, setNumberOfSemesters] = useState("");
    const [testType, setTestType] = useState("NTS");
    const [marks, setMarks] = useState({
        obtainedMarks: "",
        totalMarks: "",
        fscObtainedMarks: "",
        fscTotalMarks: "",
        matricObtainedMarks: "",
        matricTotalMarks: "",
    });
    const [showAggregate, setShowAggregate] = useState(false);

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
                ((Number.parseFloat(marks.obtainedMarks) /
                    Number.parseFloat(marks.totalMarks)) *
                    0.5 +
                    (Number.parseFloat(marks.fscObtainedMarks) /
                        Number.parseFloat(marks.fscTotalMarks)) *
                    0.3 +
                    (Number.parseFloat(marks.matricObtainedMarks) /
                        Number.parseFloat(marks.matricTotalMarks)) *
                    0.2) *
                100;
        } else {
            aggregate =
                ((Number.parseFloat(marks.obtainedMarks) /
                    Number.parseFloat(marks.totalMarks)) *
                    0.6 +
                    (Number.parseFloat(marks.fscObtainedMarks) /
                        Number.parseFloat(marks.fscTotalMarks)) *
                    0.2 +
                    (Number.parseFloat(marks.matricObtainedMarks) /
                        Number.parseFloat(marks.matricTotalMarks)) *
                    0.2) *
                100;
        }
        setAggregateResult(aggregate.toFixed(2));
    };

    return (
        <div className="calculator-app-container">
            <nav className="navbar">Navbar</nav>
            {!active ? (
                <div className="calculator-landing-page">
                    <div className="calculator-header">
                        <h1>Academic Calculators</h1>
                        <p>Grades ka Stress? Aao dekhein kitna pani mai ho aap!</p>
                    </div>
                    <div className="calculator-cards-container">
                        <div className="calculator-card" onClick={() => setActive(true)}>
                            <div className="calculator-card-image">
                                <img src="/placeholder.svg" alt="SGPA Calculator" />
                            </div>
                            <div className="calculator-card-content">
                                <h2>SGPA/CGPA Calculator</h2>
                                <p>Calculate your semester or cumulative GPA.</p>
                            </div>
                        </div>
                        <div
                            className="calculator-card"
                            onClick={() => {
                                setActive(true);
                                setShowAggregate(true);
                            }}
                        >
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
                </div>
            )}
        </div>
    );
};

export default Calculator;
