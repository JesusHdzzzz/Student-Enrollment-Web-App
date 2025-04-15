import React, { useState, useEffect } from 'react';
import ClassTable from './ClassTable';
import AddClassForm from './AddClassForm';
import { loadClassesFromStorage, saveClassesToStorage } from './utils';
import './Admin.css';

function Admin() {
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [nextId, setNextId] = useState(1); // Initialize nextId

    useEffect(() => {
        const storedClasses = loadClassesFromStorage();
        setClasses(storedClasses);
        setLoading(false);

        // Determine nextId based on loaded data
        if (storedClasses.length > 0) {
            const maxId = Math.max(0, ...storedClasses.map(c => typeof c.id === 'number' ? c.id : 0));
            setNextId(maxId + 1);
        } else {
            setNextId(1);
        }
    }, []);

    const addClass = (newClass) => {
        const classToAdd = { ...newClass, id: nextId };
        setClasses([...classes, classToAdd]);
        saveClassesToStorage([...classes, classToAdd]);
        setNextId(nextId + 1);
    };

    const removeClass = (id) => {
        const updatedClasses = classes.filter(cls => cls.id !== id);
        setClasses(updatedClasses);
        saveClassesToStorage(updatedClasses);
    };

    return (
        <div>
            <h1>Class Schedule Administration</h1>
            <h2>Current Classes (Editable)</h2>
            {loading ? (
                <p style={{ textAlign: 'center' }}>Loading classes...</p>
            ) : (
                <ClassTable classes={classes} isAdmin={true} removeClass={removeClass} />
            )}
            <h2>Add New Class</h2>
            <AddClassForm onAddClass={addClass} />
        </div>
    );
}

export default Admin;