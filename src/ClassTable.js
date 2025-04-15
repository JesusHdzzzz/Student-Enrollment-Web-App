import React from 'react';
import './ClassTable.css'; // Create a ClassTable.css file

function ClassTable({ classes, isAdmin, removeClass, enrollment, enroll, drop }) {
    const formatTime = (time) => {
        if (!time) return '00:00 AM';
        const [hours, minutes] = time.split(':');
        const hour = parseInt(hours, 10);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour % 12 || 12;
        return `${String(displayHour).padStart(2, '0')}:${minutes} ${ampm}`;
    };

    const escapeHTML = (str) => {
        const div = document.createElement('div');
        div.appendChild(document.createTextNode(String(str)));
        return div.innerHTML;
    };

    return (
        <table>
            <thead>
                <tr>
                    <th>Course Name</th>
                    <th>Teacher's Name</th>
                    <th>Students Enrolled</th>
                    <th>Class Time</th>
                    {isAdmin && <th>Actions</th>}
                    {enroll && drop && <th>Your Status / Action</th>}
                </tr>
            </thead>
            <tbody>
                {classes.length === 0 ? (
                    <tr><td colSpan={isAdmin ? 4 : 4} style={{ textAlign: 'center' }}>No classes scheduled yet.</td></tr>
                ) : (
                    classes.map(cls => (
                        <tr key={cls.id}>
                            <td>{escapeHTML(cls.course)}</td>
                            <td>{escapeHTML(cls.teacher)}</td>
                            <td>{escapeHTML(cls.students)}</td>
                            <td>{formatTime(cls.time)}</td>
                            {isAdmin && (
                                <td><button className="remove-btn" onClick={() => removeClass(cls.id)}>Remove</button></td>
                            )}
                            {enroll && drop && (
                                <td>
                                    {enrollment.includes(cls.id) ? (
                                        <button className="drop-btn" onClick={() => drop(cls.id)}>Drop</button>
                                    ) : (
                                        <button className="enroll-btn" onClick={() => enroll(cls.id)}>Enroll</button>
                                    )}
                                </td>
                            )}
                        </tr>
                    ))
                )}
            </tbody>
        </table>
    );
}

export default ClassTable;