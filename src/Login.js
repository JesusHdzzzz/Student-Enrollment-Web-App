// Login.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css'; // Create a Login.css for styling

function Login({ onLogin }) { // Receive a callback function for login
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('student'); // Default role
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        let user;

        const name = username;
        
        if (role === 'student') {
            fetch(`http://127.0.0.1:5000/students/${name}`)
                .then(response => {return response.json()})
                .then (data => {
                    if (password === data[name]) {
                        user = { username: name, role: 'student'};
                        console.log(user)
                        onLogin(user); // Send user data back to App.js
                        navigate('/student');  // Redirect to home page after login
                    }
                    else {
                        alert('Invalid credentials');
                    }
                })

                .catch(error => {
                    console.error('Error fetching credentials:', error)
                    alert('Error');
                });
        }
        else if (role === 'teacher') {
            fetch(`http://127.0.0.1:5000/teachers/${name}`)
                .then(response => {return response.json()})
                .then (data => {
                    if (password === data[name]) {
                        user = { username: name, role: 'teacher'};
                        console.log(user)
                        onLogin(user); // Send user data back to App.js
                        navigate('/teacher');  // Redirect to home page after login
                    }
                    else {
                        alert('Invalid credentials');
                    }
                })

                .catch(error => {
                    console.error('Error fetching credentials:', error)
                    alert('Error');
                });
        }
        else if (role === 'admin') {
            fetch(`http://127.0.0.1:5000/admins/${name}`)
                .then(response => {return response.json()})
                .then (data => {
                    if (password === data[name]) {
                        user = { username: name, role: 'admin'};
                        console.log(user)
                        onLogin(user); // Send user data back to App.js
                        navigate('/admin');  // Redirect to home page after login
                    }
                    else {
                        alert('Invalid credentials');
                    }
                })

                .catch(error => {
                    console.error('Error fetching credentials:', error)
                    alert('Error');
                });
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