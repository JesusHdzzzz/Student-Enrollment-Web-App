import React, { useState, useEffect } from 'react';
import ClassTable from './ClassTable';
import { loadClassesFromStorage } from './utils'; // Create a utils.js for shared functions
import './Home.css';

function Home() {
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedClasses = loadClassesFromStorage();
        setClasses(storedClasses);
        setLoading(false);
    }, []);

    return (
        <div>
            <h1>Available School Classes</h1>
            {loading ? (
                <p style={{ textAlign: 'center' }}>Loading classes...</p>
            ) : (
                <ClassTable classes={classes} />
            )}
        </div>
    );
}

export default Home;