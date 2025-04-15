import React, { useState } from 'react';
import './AddClassForm.css';

function AddClassForm({ onAddClass }) {
    const [name, setName] = useState('');
    const [teacher, setTeacher] = useState('');
    const [time, setTime] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

        /*
        const course_name = name;
        const course_teacher = teacher;
        const course_time = time.toString();
        const course = {course_name, course_teacher, course_time};
        console.log(course);

        fetch('http://127.0.0.1:5000/courses', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(course),
        })
            .then(response => {return response.json})
            .then(data => {
                console.log(course);
            })

        .catch(error => {
            console.error('Error adding course:', error);
        });
        */
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