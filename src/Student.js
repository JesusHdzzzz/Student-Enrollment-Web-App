import React, { useState, useEffect } from 'react';
import ClassTable from './ClassTable';
import { loadClassesFromStorage, loadStudentEnrollment, saveClassesToStorage, saveStudentEnrollment } from './utils';
import './Student.css';

function Student() {
    const [classes, setClasses] = useState([]);
    const [enrollment, setEnrollment] = useState([]);
    const [loading, setLoading] = useState(true);

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

        const classIndex = classes.findIndex(cls => cls.id === classId);

        if (classIndex === -1) {
            alert("Error: Class not found.");
            return;
        }

        if (enrollment.includes(classId)) {
            alert("You are already enrolled in this class.");
            return;
        }

        const updatedClasses = classes.map(cls =>
            cls.id === classId ? { ...cls, students: (cls.students || 0) + 1 } : cls
        );
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

    return (
        <div>
            <h1>Student Class Portal</h1>
            <h2>Available Classes</h2>
            {loading ? (
                <p style={{ textAlign: 'center' }}>Loading classes...</p>
            ) : (
                <ClassTable classes={classes} enrollment={enrollment} enroll={enroll} drop={drop} />
            )}
            <p style={{ fontSize: '0.9em', textAlign: 'center', marginTop: '15px' }}>
                Click "Enroll" to join a class or "Drop" to leave a class you are enrolled in.
            </p>
        </div>
    );
}

export default Student;