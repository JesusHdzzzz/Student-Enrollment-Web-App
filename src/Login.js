// Login.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css'; // Create a Login.css for styling

const REST_API = "/api";

function Login({ onLogin }) { // Receive a callback function for login
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('student'); // Default role
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        function login(event) {
            event.preventDefault();

            const name = document.getElementById("username").value;

            fetch(`${REST_API}/students/${name}`)
                .then(response => response.text())
                .then (text => {
                    return JSON.parse(corrected);
                })
                .then (data => {
                    
                })

                .catch(error => {
                    console.error('Error fetching student:', error)
                    alert("Error");
                });
        }

        // **IMPORTANT:** Replace this with your actual authentication logic!
        // This is a simplified example. In a real app, you'd send the
        // username/password to a server for verification.
        let user;
        if (username === 'admin' && password === 'admin') {
            user = { username: 'admin', role: 'admin' };
        } else if (username === 'teacher' && password === 'teacher') {
            user = { username: 'teacher', role: 'teacher' };
        } else if (username === 'student' && password === 'student') {
            user = { username: 'student', role: 'student' };
        } else {
            alert('Invalid credentials');
            return;
        }

        if (user) {
            onLogin(user); // Send user data back to App.js
            navigate('/');  // Redirect to home page after login
        }
    };

    return (
        <div className="login-container">
            <h1>Login</h1>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="username">Username:</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="role">Role:</label>
                    <select
                        id="role"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                    >
                        <option value="student">Student</option>
                        <option value="teacher">Teacher</option>
                        <option value="admin">Admin</option>
                    </select>
                </div>
                <button type="submit">Login</button>
            </form>
        </div>
    );
}

export default Login;