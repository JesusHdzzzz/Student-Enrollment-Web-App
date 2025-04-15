import React, { useState } from 'react';
import './AddClassForm.css'; // Create an AddClassForm.css file

function AddClassForm({ onAddClass }) {
    const [teacherName, setTeacherName] = useState('');
    const [studentCount, setStudentCount] = useState('');
    const [classTime, setClassTime] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!teacherName || !studentCount || !classTime) {
            alert('Please fill in all fields.');
            return;
        }
        onAddClass({ teacher: teacherName, students: parseInt(studentCount, 10), time: classTime });
        setTeacherName('');
        setStudentCount('');
        setClassTime('');
    };

    return (
        <form id="add-class-form" onSubmit={handleSubmit}>
            <div className="form-group">
                <label htmlFor="teacher-name">Teacher's Name:</label>
                <input type="text" id="teacher-name" value={teacherName} onChange={(e) => setTeacherName(e.target.value)} required />
            </div>
            <div className="form-group">
                <label htmlFor="student-count">Number of Students Enrolled:</label>
                <input type="number" id="student-count" min="0" value={studentCount} onChange={(e) => setStudentCount(e.target.value)} required />
            </div>
            <div className="form-group">
                <label htmlFor="class-time">Class Time:</label>
                <input type="time" id="class-time" value={classTime} onChange={(e) => setClassTime(e.target.value)} required />
            </div>
            <button type="submit">Add Class</button>
        </form>
    );
}

export default AddClassForm;