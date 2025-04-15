import React, { useState, useEffect } from 'react';
import ClassTable from './ClassTable';
import { loadClassesFromStorage, loadStudentEnrollment, saveClassesToStorage, saveStudentEnrollment } from './utils';
import './Student.css';

function Student() {
    const [classes, setClasses] = useState([]);
    const [enrollment, setEnrollment] = useState([]);
    const [loading, setLoading] = useState(true);
    const [studentId, setStudentId] = useState('student'); // Replace with actual student ID logic

    useEffect(() => {
        const storedClasses = loadClassesFromStorage();
        const storedEnrollment = loadStudentEnrollment();
        setClasses(storedClasses);
        setEnrollment(storedEnrollment);
        setLoading(false);
    }, []);

    const enroll = (classId) => {
        if (!window.confirm(`Enroll in this class (ID: ${classId})?`)) {
            return;
        }

        const studentId = 'student';

        const updatedClasses = classes.map(cls => {
            if (cls.id === classId) {
                return {
                    ...cls,
                    students: (cls.students || 0) + 1,
                    enrolledStudents: [...(cls.enrolledStudents || []), { id: studentId }],
                };
            }
            return cls;
        });
        const updatedEnrollment = [...enrollment, classId];

        setClasses(updatedClasses);
        setEnrollment(updatedEnrollment);
        saveClassesToStorage(updatedClasses);
        saveStudentEnrollment(updatedEnrollment);
        alert("Successfully enrolled!");
    };

    const drop = (classId) => {
        if (!window.confirm(`Drop this class (ID: ${classId})?`)) {
            return;
        }

        const classIndex = classes.findIndex(cls => cls.id === classId);

        if (!enrollment.includes(classId)) {
            alert("You are not enrolled in this class.");
            return;
        }

        const updatedClasses = classIndex !== -1
            ? classes.map(cls =>
                cls.id === classId ? { ...cls, students: Math.max(0, (cls.students || 0) - 1) } : cls
            )
            : classes;

        const updatedEnrollment = enrollment.filter(id => id !== classId);

        setClasses(updatedClasses);
        setEnrollment(updatedEnrollment);
        saveClassesToStorage(updatedClasses);
        saveStudentEnrollment(updatedEnrollment);
        alert("Successfully dropped class!");
    };

    const getStudentGrade = (classId) => {
        const classObj = classes.find(cls => cls.id === classId);
        if (classObj && classObj.enrolledStudents) {
            const student = classObj.enrolledStudents.find(s => s.id === studentId);
            return student ? student.grade : 'Not Graded';
        }
        return 'Not Enrolled';
    };

    const renderStudentClassTable = () => {
        const studentClasses = classes.filter(cls => enrollment.includes(cls.id));
        return (
            <table>
                <thead>
                    <tr>
                        <th>Class Name</th> {/* Display Class Name */}
                        <th>Teacher</th>
                        <th>Time</th>
                        <th>Grade</th>
                    </tr>
                </thead>
                <tbody>
                    {studentClasses.map(cls => (
                        <tr key={cls.id}>
                            <td>{cls.name}</td> {/* Display Class Name */}
                            <td>{cls.teacher}</td>
                            <td>{cls.time}</td>
                            <td>{getStudentGrade(cls.id)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        );
    };

    return (
        <div>
            <h1>Student Class Portal</h1>
            <h2>My Enrolled Classes</h2>
            {loading ? (
                <p style={{ textAlign: 'center' }}>Loading classes...</p>
            ) : (
                enrollment.length > 0 ? renderStudentClassTable() : <p>Not enrolled in any classes yet.</p>
            )}
            <h2>Available Classes</h2>
            <ClassTable classes={classes} enrollment={enrollment} enroll={enroll} drop={drop} />
            <p style={{ fontSize: '0.9em', textAlign: 'center', marginTop: '15px' }}>
                Click "Enroll" to join a class or "Drop" to leave a class you are enrolled in.
            </p>
        </div>
    );
}

export default Student;