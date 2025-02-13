"use client"

import { useState } from "react"
import "./Calculator.css"
import pic1 from "../../Assets/images/3580920.webp"
import pic2 from "../../Assets/images/8899729.webp"
import Navbar from "../Index/components/Navbar"
import Footer from "../Footer/Footer"

const Calculator = () => {
    const [active, setActive] = useState(false)
    const [showSGPA, setShowSGPA] = useState(true)
    const [courses, setCourses] = useState([])
    const [semesters, setSemesters] = useState([])
    const [sgpaResult, setSgpaResult] = useState(null)
    const [cgpaResult, setCgpaResult] = useState(null)
    const [aggregateResult, setAggregateResult] = useState(null)
    const [numberOfCourses, setNumberOfCourses] = useState("")
    const [numberOfSemesters, setNumberOfSemesters] = useState("")
    const [testType, setTestType] = useState("NTS")
    const [marks, setMarks] = useState({
        obtainedMarks: "",
        totalMarks: "",
        fscObtainedMarks: "",
        fscTotalMarks: "",
        matricObtainedMarks: "",
        matricTotalMarks: "",
    })
    const [showAggregate, setShowAggregate] = useState(false)

    const generateCourses = () => {
        const count = Number.parseInt(numberOfCourses) || 0
        setCourses(Array.from({ length: count }, () => ({ courseName: "", creditHours: "1", grade: "4.00" })))
    }

    const generateSemesters = () => {
        const count = Number.parseInt(numberOfSemesters) || 0
        setSemesters(Array.from({ length: count }, () => ({ creditHours: "", gpa: "" })))
    }

    const calculateSGPA = () => {
        let totalCreditHours = 0
        let totalGradePoints = 0

        courses.forEach((course) => {
            totalCreditHours += Number.parseInt(course.creditHours)
            totalGradePoints += Number.parseInt(course.creditHours) * Number.parseFloat(course.grade)
        })

        const sgpa = totalGradePoints / totalCreditHours
        setSgpaResult(sgpa.toFixed(2))
    }

    const calculateCGPA = () => {
        let totalCreditHours = 0
        let totalGradePoints = 0

        semesters.forEach((semester) => {
            totalCreditHours += Number.parseInt(semester.creditHours)
            totalGradePoints += Number.parseInt(semester.creditHours) * Number.parseFloat(semester.gpa)
        })

        const cgpa = totalGradePoints / totalCreditHours
        setCgpaResult(cgpa.toFixed(2))
    }

    const calculateAggregate = () => {
        let aggregate
        if (testType === "NU") {
            aggregate =
                ((Number.parseFloat(marks.obtainedMarks) / Number.parseFloat(marks.totalMarks)) * 0.5 +
                    (Number.parseFloat(marks.fscObtainedMarks) / Number.parseFloat(marks.fscTotalMarks)) * 0.4 +
                    (Number.parseFloat(marks.matricObtainedMarks) / Number.parseFloat(marks.matricTotalMarks)) * 0.1) *
                100
        } else {
            aggregate =
                ((Number.parseFloat(marks.obtainedMarks) / Number.parseFloat(marks.totalMarks)) * 0.5 +
                    (Number.parseFloat(marks.fscObtainedMarks) / Number.parseFloat(marks.fscTotalMarks)) * 0.4 +
                    (Number.parseFloat(marks.matricObtainedMarks) / Number.parseFloat(marks.matricTotalMarks)) * 0.1) *
                100
        }
        setAggregateResult(aggregate.toFixed(2))
    }

    return (
        <div className="calculator-app-container">
            <Navbar />
            {!active ? (
                <div className="calculator-landing-page">
                    <div className="calculator-header">
                        <h1>Academic Calculators</h1>
                        <p>Grades ka Stess ? aao dekhain kitnai paani mai ho aap</p>
                    </div>

                    <div className="calculator-cards-container">
                        <div className="calculator-card" onClick={() => setActive(true)}>
                            <div className="calculator-card-image">
                                <img src={pic1 || "/placeholder.svg"} alt="SGPA Calculator" />
                            </div>
                            <div className="calculator-card-content">
                                <h2>SGPA/CGPA Calculator</h2>
                                <p>Calculate your semester or cumulative GPA.</p>
                            </div>
                        </div>
                        <div
                            className="calculator-card"
                            onClick={() => {
                                setActive(true)
                                setShowAggregate(true)
                            }}
                        >
                            <div className="calculator-card-image">
                                <img src={pic2 || "/placeholder.svg"} alt="Aggregate Calculator" />
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
                        <p>Grades ka Stess ? aao dekhain kitnai paani mai ho aap</p>
                    </div>

                    <div className="calculator-container">
                        <button
                            className="close-btn"
                            onClick={() => {
                                setActive(false)
                                setShowAggregate(false)
                            }}
                        >
                            ×
                        </button>

                        {showAggregate ? (
                            <div className="container mx-auto p-8">
                                <div className="aggregate-form">
                                    <h2>FAST Aggregate Calculator</h2>

                                    <div className="inputaggregate-group">
                                        <label>Test Type</label>
                                        <select value={testType} onChange={(e) => setTestType(e.target.value)} className="test-type-select">
                                            <option value="NU">NU</option>
                                            <option value="NTS">NTS</option>
                                        </select>
                                    </div>

                                    <div className="marks-row">
                                        <div className="marks-input">
                                            <label>Obtained Marks</label>
                                            <input
                                                type="number"
                                                value={marks.obtainedMarks}
                                                onChange={(e) => setMarks({ ...marks, obtainedMarks: e.target.value })}
                                                placeholder="Enter Obtained Marks"
                                            />
                                        </div>
                                        <div className="marks-input">
                                            <label>Total Marks</label>
                                            <input
                                                type="number"
                                                value={marks.totalMarks}
                                                onChange={(e) => setMarks({ ...marks, totalMarks: e.target.value })}
                                                placeholder="Enter Total Marks"
                                            />
                                        </div>
                                    </div>

                                    <div className="marks-row">
                                        <div className="marks-input">
                                            <label>FSc. Obtained Marks</label>
                                            <input
                                                type="number"
                                                value={marks.fscObtainedMarks}
                                                onChange={(e) => setMarks({ ...marks, fscObtainedMarks: e.target.value })}
                                                placeholder="Enter FSc Obtained Marks"
                                            />
                                        </div>
                                        <div className="marks-input">
                                            <label>FSc Total Marks</label>
                                            <input
                                                type="number"
                                                value={marks.fscTotalMarks}
                                                onChange={(e) => setMarks({ ...marks, fscTotalMarks: e.target.value })}
                                                placeholder="Enter FSc Total Marks"
                                            />
                                        </div>
                                    </div>

                                    <div className="marks-row">
                                        <div className="marks-input">
                                            <label>Matric Obtained Marks</label>
                                            <input
                                                type="number"
                                                value={marks.matricObtainedMarks}
                                                onChange={(e) => setMarks({ ...marks, matricObtainedMarks: e.target.value })}
                                                placeholder="Enter Matric Obtained Marks"
                                            />
                                        </div>
                                        <div className="marks-input">
                                            <label>Matric Total Marks</label>
                                            <input
                                                type="number"
                                                value={marks.matricTotalMarks}
                                                onChange={(e) => setMarks({ ...marks, matricTotalMarks: e.target.value })}
                                                placeholder="Enter Matric Total Marks"
                                            />
                                        </div>
                                    </div>

                                    <button className="calculateaggregate-btn" onClick={calculateAggregate}>
                                        Calculate
                                    </button>

                                    {aggregateResult && <div className="result">Your Aggregate is: {aggregateResult}%</div>}
                                </div>
                            </div>
                        ) : (
                            <div>
                                <h2>SGPA/CGPA Calculator</h2>

                                <div className="toggle-buttons">
                                    <button className={`toggle-btn ${showSGPA ? "active" : ""}`} onClick={() => setShowSGPA(true)}>
                                        SGPA
                                    </button>
                                    <button className={`toggle-btn ${!showSGPA ? "active" : ""}`} onClick={() => setShowSGPA(false)}>
                                        CGPA
                                    </button>
                                </div>

                                {showSGPA && (
                                    <div className="sgpa-form">
                                        <div className="input-group">
                                            <label>Number of Courses</label>
                                            <div className="generate-group">
                                                <input
                                                    type="number"
                                                    value={numberOfCourses}
                                                    onChange={(e) => setNumberOfCourses(e.target.value)}
                                                    placeholder="Enter Number of Courses"
                                                />
                                                <button className="generate-btn" onClick={generateCourses}>
                                                    Generate
                                                </button>
                                            </div>
                                        </div>

                                        {courses.map((course, index) => (
                                            <div key={index} className="course-row">
                                                <div className="course-input">
                                                    <label>Course Name</label>
                                                    <input
                                                        type="text"
                                                        value={course.courseName}
                                                        onChange={(e) => {
                                                            const updatedCourses = [...courses]
                                                            updatedCourses[index].courseName = e.target.value
                                                            setCourses(updatedCourses)
                                                        }}
                                                        placeholder="Enter Course Name"
                                                    />
                                                </div>
                                                <div className="course-input">
                                                    <label>Credit Hours</label>
                                                    <select
                                                        value={course.creditHours}
                                                        onChange={(e) => {
                                                            const updatedCourses = [...courses]
                                                            updatedCourses[index].creditHours = e.target.value
                                                            setCourses(updatedCourses)
                                                        }}
                                                    >
                                                        <option value="1">1</option>
                                                        <option value="2">2</option>
                                                        <option value="3">3</option>
                                                        <option value="4">4</option>
                                                    </select>
                                                </div>
                                                <div className="course-input">
                                                    <label>Grade</label>
                                                    <select
                                                        value={course.grade}
                                                        onChange={(e) => {
                                                            const updatedCourses = [...courses]
                                                            updatedCourses[index].grade = e.target.value
                                                            setCourses(updatedCourses)
                                                        }}
                                                    >
                                                        <option value="4.00">A/A+</option>
                                                        <option value="3.67">A-</option>
                                                        <option value="3.33">B+</option>
                                                        <option value="3.00">B</option>
                                                        <option value="2.67">B-</option>
                                                        <option value="2.33">C+</option>
                                                        <option value="2.00">C</option>
                                                        <option value="1.67">C-</option>
                                                        <option value="1.33">D+</option>
                                                        <option value="1.00">D</option>
                                                        <option value="0.00">F</option>
                                                    </select>
                                                </div>
                                            </div>
                                        ))}

                                        {courses.length > 0 && (
                                            <button className="calculate-btn" onClick={calculateSGPA}>
                                                Calculate SGPA
                                            </button>
                                        )}

                                        {sgpaResult && <div className="result">Your SGPA is: {sgpaResult}</div>}
                                    </div>
                                )}

                                {!showSGPA && (
                                    <div className="cgpa-form">
                                        <div className="input-group">
                                            <label>Number of Semesters</label>
                                            <div className="generate-group">
                                                <input
                                                    type="number"
                                                    value={numberOfSemesters}
                                                    onChange={(e) => setNumberOfSemesters(e.target.value)}
                                                    placeholder="Enter Number of Semesters"
                                                />
                                                <button className="generate-btn" onClick={generateSemesters}>
                                                    Generate
                                                </button>
                                            </div>
                                        </div>

                                        {semesters.map((semester, index) => (
                                            <div key={index} className="semester-row">
                                                <div className="semester-label">Semester {index + 1}</div>
                                                <div className="semester-inputs">
                                                    <div className="semester-input">
                                                        <label>Credit Hours</label>
                                                        <input
                                                            type="number"
                                                            value={semester.creditHours}
                                                            onChange={(e) => {
                                                                const updatedSemesters = [...semesters]
                                                                updatedSemesters[index].creditHours = e.target.value
                                                                setSemesters(updatedSemesters)
                                                            }}
                                                            placeholder="Enter Credit Hours"
                                                        />
                                                    </div>
                                                    <div className="semester-input">
                                                        <label>GPA</label>
                                                        <input
                                                            type="number"
                                                            step="0.01"
                                                            value={semester.gpa}
                                                            onChange={(e) => {
                                                                const updatedSemesters = [...semesters]
                                                                updatedSemesters[index].gpa = e.target.value
                                                                setSemesters(updatedSemesters)
                                                            }}
                                                            placeholder="Enter GPA"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}

                                        {semesters.length > 0 && (
                                            <button className="calculate-btn" onClick={calculateCGPA}>
                                                Calculate CGPA
                                            </button>
                                        )}

                                        {cgpaResult && <div className="result">Your CGPA is: {cgpaResult}</div>}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            )}
            <Footer />
        </div>
    )
}

export default Calculator

