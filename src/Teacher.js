import React, { useState, useEffect } from 'react';
import { loadClassesFromStorage, saveClassesToStorage } from './utils';
import './Teacher.css';

function Teacher() {
    const [classes, setClasses] = useState([]);
    const [teacherId, setTeacherId] = useState('teacher'); // static for simplicity
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const allClasses = loadClassesFromStorage();
        const myClasses = allClasses.filter(cls => cls.teacherId === teacherId);
        setClasses(myClasses);
        setLoading(false);
    }, [teacherId]);


    const handleGradeChange = (classId, studentId, newGrade) => {
        const updatedClasses = classes.map(cls => {
            if (cls.id === classId) {
                const updatedStudents = cls.enrolledStudents.map(student =>
                    student.id === studentId ? { ...student, grade: newGrade } : student
                );
                return { ...cls, enrolledStudents: updatedStudents };
            }
            return cls;
        });

        setClasses(updatedClasses);

        // Update main classes in storage
        const allClasses = loadClassesFromStorage();
        const updatedAllClasses = allClasses.map(cls => {
            if (cls.id === classId) {
                const updatedStudents = cls.enrolledStudents.map(student =>
                    student.id === studentId ? { ...student, grade: newGrade } : student
                );
                return { ...cls, enrolledStudents: updatedStudents };
            }
            return cls;
        });

        saveClassesToStorage(updatedAllClasses);
        alert(`Updated grade for Student ${studentId} in Class ${classId}.`);
    };

    const renderClassTable = () => {
        return classes.map(cls => (
            <div key={cls.id} className="class-box">
                <h3>{cls.name} (ID: {cls.id})</h3>
                <p>Time: {cls.time}</p>
                {cls.enrolledStudents && cls.enrolledStudents.length > 0 ? (
                    <table className="grade-table">
                        <thead>
                            <tr>
                                <th>Student ID</th>
                                <th>Grade</th>
                                <th>Edit</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cls.enrolledStudents.map(student => (
                                <tr key={student.id}>
                                    <td>{student.id}</td>
                                    <td>{student.grade ?? 'N/A'}</td>
                                    <td>
                                        <input
                                            type="text"
                                            defaultValue={student.grade}
                                            onBlur={(e) => handleGradeChange(cls.id, student.id, e.target.value)}
                                            placeholder="Enter grade"
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>No students enrolled.</p>
                )}
            </div>
        ));
    };

    return (
        <div>
            <h1>Teacher Dashboard</h1>
            <div>
                <h2>My Classes</h2>
                {loading ? <p>Loading classes...</p> : renderClassTable()}
                <p style={{ fontSize: '0.9em', textAlign: 'center', marginTop: '15px' }}>
                    Click on a grade cell to edit. Changes save on blur.
                </p>
            </div>
        </div>
    );
}

export default Teacher;