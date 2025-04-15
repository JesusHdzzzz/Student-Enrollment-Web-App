import React, { useState } from 'react';
import './AddClassForm.css';

function AddClassForm({ onAddClass }) {
    const [name, setName] = useState('');
    const [teacher, setTeacher] = useState('');
    const [time, setTime] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onAddClass({ name, teacher, time }); // Pass 'name' in the object
        setName('');
        setTeacher('');
        setTime('');
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                value={name} // Input for class name
                onChange={(e) => setName(e.target.value)}
                placeholder="Class Name"
                required
            />
            <input
                type="text"
                value={teacher}
                onChange={(e) => setTeacher(e.target.value)}
                placeholder="Teacher's Name"
                required
            />
            <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                required
            />
            <button type="submit">Add Class</button>
        </form>
    );
}

export default AddClassForm;