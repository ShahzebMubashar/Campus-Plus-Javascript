import React, { useState } from 'react';
import './Calculator.css';

const Calculator = () => {
    // State for SGPA & CGPA

    const [active, setActive] = useState(false);
    const [showSGPA, setShowSGPA] = useState(true);
    const [courses, setCourses] = useState([]);
    const [semesters, setSemesters] = useState([]);
    const [sgpaResult, setSgpaResult] = useState(null);
    const [cgpaResult, setCgpaResult] = useState(null);
    const [aggregateResult, setAggregateResult] = useState(null);

    // SGPA/CGPA form data
    const [numberOfCourses, setNumberOfCourses] = useState('');
    const [numberOfSemesters, setNumberOfSemesters] = useState('');
    const [testType, setTestType] = useState('NTS');
    const [marks, setMarks] = useState({
        obtainedMarks: '',
        totalMarks: '',
        fscObtainedMarks: '',
        fscTotalMarks: '',
        matricObtainedMarks: '',
        matricTotalMarks: '',
    });

    // Handle course/semester creation
    const generateCourses = () => {
        const coursesArray = [];
        for (let i = 0; i < numberOfCourses; i++) {
            coursesArray.push({
                courseName: '',
                creditHours: '1',
                grade: '4.00',
            });
        }
        setCourses(coursesArray);
    };

    const generateSemesters = () => {
        const semestersArray = [];
        for (let i = 0; i < numberOfSemesters; i++) {
            semestersArray.push({
                creditHours: '',
                gpa: '',
            });
        }
        setSemesters(semestersArray);
    };

    // Calculate SGPA
    const calculateSGPA = () => {
        let totalCreditHours = 0;
        let totalPoints = 0;

        courses.forEach((course) => {
            const creditHours = parseFloat(course.creditHours) || 0;
            const grade = parseFloat(course.grade) || 0;
            totalCreditHours += creditHours;
            totalPoints += creditHours * grade;
        });

        const sgpa = totalCreditHours === 0 ? 0 : totalPoints / totalCreditHours;
        setSgpaResult(sgpa.toFixed(2));
    };

    // Calculate CGPA
    const calculateCGPA = () => {
        let totalPoints = 0;
        let totalCredits = 0;

        semesters.forEach((semester) => {
            const creditHours = parseFloat(semester.creditHours);
            const gpa = parseFloat(semester.gpa);
            if (isNaN(creditHours) || isNaN(gpa) || gpa < 0 || gpa > 4) {
                return;
            }
            totalPoints += creditHours * gpa;
            totalCredits += creditHours;
        });

        const cgpa = totalCredits === 0 ? 0 : totalPoints / totalCredits;
        setCgpaResult(cgpa.toFixed(2));
    };

    // Calculate Aggregate
    const calculateAggregate = () => {
        const { obtainedMarks, totalMarks, fscObtainedMarks, fscTotalMarks, matricObtainedMarks, matricTotalMarks } = marks;

        const fscPercentage = (fscObtainedMarks / fscTotalMarks) * 100;
        const matricPercentage = (matricObtainedMarks / matricTotalMarks) * 100;
        const testPercentage = (obtainedMarks / totalMarks) * 100;

        let aggregate = 0;

        if (testType === 'NTS') {
            aggregate = fscPercentage * 0.4 + testPercentage * 0.5 + matricPercentage * 0.1;
        } else if (testType === 'NU') {
            aggregate = fscPercentage * 0.4 + testPercentage * 0.5 + matricPercentage * 0.1;
        }

        setAggregateResult(aggregate.toFixed(2));
    };

    return (
        <div>
            <div className={`intro-section`}>
                <h1>Welcome to the Calculator</h1>
                <p>Calculate your SGPA, CGPA, and Aggregate!</p>
                <button className="btn" onClick={() => setActive(!active)}>Open Calculator</button>
            </div>

            {active && (
                <div className="calculator-container active">
                    <button className="close-btn" onClick={() => setActive(false)}>X</button>
                    <h2 className="calculator-title">Enter Your Marks and Courses</h2>

                    {/* Show SGPA or CGPA */}
                    <div className="toggle-buttons">
                        <button onClick={() => setShowSGPA(true)} className={`toggle-btn ${showSGPA ? 'active' : ''}`}>SGPA</button>
                        <button onClick={() => setShowSGPA(false)} className={`toggle-btn ${!showSGPA ? 'active' : ''}`}>CGPA</button>
                    </div>

                    {/* SGPA Section */}
                    {showSGPA && (
                        <div id="sgpaSection">
                            <input
                                type="number"
                                value={numberOfCourses}
                                onChange={(e) => setNumberOfCourses(e.target.value)}
                                placeholder="Number of Courses"
                            />
                            <button onClick={generateCourses}>Generate Courses</button>

                            {courses.map((course, index) => (
                                <div key={index} className="course-input-group">
                                    <input
                                        type="text"
                                        value={course.courseName}
                                        onChange={(e) => {
                                            const updatedCourses = [...courses];
                                            updatedCourses[index].courseName = e.target.value;
                                            setCourses(updatedCourses);
                                        }}
                                        placeholder="Course Name"
                                    />
                                    <select
                                        value={course.creditHours}
                                        onChange={(e) => {
                                            const updatedCourses = [...courses];
                                            updatedCourses[index].creditHours = e.target.value;
                                            setCourses(updatedCourses);
                                        }}
                                    >
                                        <option value="1">1</option>
                                        <option value="2">2</option>
                                        <option value="3">3</option>
                                        <option value="4">4</option>
                                    </select>
                                    <select
                                        value={course.grade}
                                        onChange={(e) => {
                                            const updatedCourses = [...courses];
                                            updatedCourses[index].grade = e.target.value;
                                            setCourses(updatedCourses);
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
                            ))}
                            <button className="btn" onClick={calculateSGPA}>Calculate SGPA</button>

                            {sgpaResult && <div id="sgpaResult">Your SGPA is: {sgpaResult}</div>}
                        </div>
                    )}

                    {/* CGPA Section */}
                    {!showSGPA && (
                        <div id="cgpaSection">
                            <input
                                type="number"
                                value={numberOfSemesters}
                                onChange={(e) => setNumberOfSemesters(e.target.value)}
                                placeholder="Number of Semesters"
                            />
                            <button onClick={generateSemesters}>Generate Semesters</button>

                            {semesters.map((semester, index) => (
                                <div key={index} className="semester-input-group">
                                    <input
                                        type="number"
                                        value={semester.creditHours}
                                        onChange={(e) => {
                                            const updatedSemesters = [...semesters];
                                            updatedSemesters[index].creditHours = e.target.value;
                                            setSemesters(updatedSemesters);
                                        }}
                                        placeholder="Credit Hours"
                                    />
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={semester.gpa}
                                        onChange={(e) => {
                                            const updatedSemesters = [...semesters];
                                            updatedSemesters[index].gpa = e.target.value;
                                            setSemesters(updatedSemesters);
                                        }}
                                        placeholder="GPA"
                                    />
                                </div>
                            ))}
                            <button className="btn" onClick={calculateCGPA}>Calculate CGPA</button>

                            {cgpaResult && <div id="cgpaResult">Your CGPA is: {cgpaResult}</div>}
                        </div>
                    )}

                    {/* Aggregate Section */}
                    <div id="aggregateSection">
                        <input
                            type="number"
                            value={marks.obtainedMarks}
                            onChange={(e) => setMarks({ ...marks, obtainedMarks: e.target.value })}
                            placeholder="Test Marks Obtained"
                        />
                        <input
                            type="number"
                            value={marks.totalMarks}
                            onChange={(e) => setMarks({ ...marks, totalMarks: e.target.value })}
                            placeholder="Test Total Marks"
                        />
                        <input
                            type="number"
                            value={marks.fscObtainedMarks}
                            onChange={(e) => setMarks({ ...marks, fscObtainedMarks: e.target.value })}
                            placeholder="FSC Marks Obtained"
                        />
                        <input
                            type="number"
                            value={marks.fscTotalMarks}
                            onChange={(e) => setMarks({ ...marks, fscTotalMarks: e.target.value })}
                            placeholder="FSC Total Marks"
                        />
                        <input
                            type="number"
                            value={marks.matricObtainedMarks}
                            onChange={(e) => setMarks({ ...marks, matricObtainedMarks: e.target.value })}
                            placeholder="Matric Marks Obtained"
                        />
                        <input
                            type="number"
                            value={marks.matricTotalMarks}
                            onChange={(e) => setMarks({ ...marks, matricTotalMarks: e.target.value })}
                            placeholder="Matric Total Marks"
                        />
                        <select
                            value={testType}
                            onChange={(e) => setTestType(e.target.value)}
                        >
                            <option value="NTS">NTS</option>
                            <option value="NU">NU</option>
                        </select>
                        <button className="btn" onClick={calculateAggregate}>Calculate Aggregate</button>

                        {aggregateResult && <div id="aggregateResult">Your Aggregate is: {aggregateResult}</div>}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Calculator;
