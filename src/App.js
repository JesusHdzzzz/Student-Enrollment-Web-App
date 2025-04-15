// App.js
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'; // Import Navigate
import Home from './Home';
import Admin from './Admin';
import Student from './Student';
import Teacher from './Teacher';
import Navigation from './Navigation';
import Login from './Login';  // Import Login
import './App.css';

function App() {
    const [user, setUser] = useState(null); // Track user authentication

    const handleLogin = (userData) => {
        setUser(userData); // Set user data on login
    };

    const handleLogout = () => {
        setUser(null);
    };

    //  Route Guards
    const PrivateRoute = ({ children, requiredRole }) => {
        if (!user) {
            return <Navigate to="/login" />;
        }

        if (requiredRole && user.role !== requiredRole) {
            return <div>Access Denied</div>; // Or redirect to an error page
        }

        return children;
    };


    return (
        <Router>
            <div className="app">
                <Navigation isLoggedIn={user !== null} onLogout={handleLogout} user={user} />  {/* Pass login state */}
                <div className="container">
                    <Routes>
                        <Route path="/login" element={<Login onLogin={handleLogin} />} />
                        <Route exact path="/" element={<Home />} />

                        <Route path="/admin" element={
                            <PrivateRoute requiredRole="admin">
                                <Admin />
                            </PrivateRoute>
                        } />
                        <Route path="/student" element={
                            <PrivateRoute requiredRole="student">
                                <Student />
                            </PrivateRoute>
                        } />
                        <Route path="/teacher" element={
                            <PrivateRoute requiredRole="teacher">
                                <Teacher />
                            </PrivateRoute>
                        } />
                    </Routes>
                </div>
            </div>
        </Router>
    );
}

export default App;