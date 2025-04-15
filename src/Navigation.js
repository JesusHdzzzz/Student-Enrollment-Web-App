// Navigation.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Navigation.css';

function Navigation({ isLoggedIn, onLogout, user }) {  // Receive props
    return (
        <div className="nav-container">
            <Link to="/" className="nav-button">View Classes (Home)</Link>
            {isLoggedIn ? (
                <>
                    {user.role === 'admin' && <Link to="/admin" className="nav-button">Admin Page</Link>}
                    {user.role === 'student' && <Link to="/student" className="nav-button">Student Portal</Link>}
                    {user.role === 'teacher' && <Link to="/teacher" className="nav-button">Teacher Portal</Link>}
                    <button onClick={onLogout} className="nav-button">Logout</button>
                </>
            ) : (
                <Link to="/login" className="nav-button">Login</Link>
            )}
        </div>
    );
}

export default Navigation;