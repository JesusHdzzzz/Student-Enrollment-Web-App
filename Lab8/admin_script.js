// --- DOM References ---
let classListTableBodyAdmin;
let addClassForm;
let teacherNameInput;
let studentCountInput;
let classTimeInput;

// --- Constants ---
const STORAGE_KEY = 'schoolClasses';

// --- Utility Functions ---
/**
 * Basic HTML escaping function to prevent XSS
 */
function escapeHTML(str) {
    const div = document.createElement('div');
    div.appendChild(document.createTextNode(String(str))); // Ensure input is string
    return div.innerHTML;
}

/**
 * Loads classes from localStorage or returns default data.
 */
function loadClassesForAdmin() {
    const storedClasses = localStorage.getItem(STORAGE_KEY);
    const defaultClasses = [
        { id: 1, teacher: 'Dr. Ada Lovelace', students: 25, time: '09:00' },
        { id: 2, teacher: 'Mr. Charles Babbage', students: 30, time: '10:30' },
        { id: 3, teacher: 'Ms. Grace Hopper', students: 22, time: '13:00' }
    ];

    if (storedClasses) {
        try {
            const parsedClasses = JSON.parse(storedClasses);
            // Basic check if it's an array
            return Array.isArray(parsedClasses) ? parsedClasses : defaultClasses;
        } catch (e) {
            console.error("Error parsing classes from localStorage, using defaults.", e);
            return defaultClasses; // Fallback to default if parsing fails
        }
    }
    return defaultClasses; // Return defaults if nothing is stored
}

/**
 * Saves the current classes array to localStorage.
 */
function saveClassesToStorage() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(classes));
    } catch (e) {
        console.error("Error saving classes to localStorage:", e);
        alert("Could not save class data. LocalStorage might be full or disabled.");
    }
}

// --- Data Storage ---
// Load initial data
let classes = loadClassesForAdmin();
// Determine nextId based on loaded data to prevent reuse within session
let nextId = classes.length > 0 ? Math.max(0, ...classes.map(c => typeof c.id === 'number' ? c.id : 0)) + 1 : 1;


/**
 * Renders the classes array into the ADMIN HTML table.
 */
function renderAdminClasses() {
    if (!classListTableBodyAdmin) return;

    classListTableBodyAdmin.innerHTML = ''; // Clear existing rows

    if (classes.length === 0) {
        classListTableBodyAdmin.innerHTML = '<tr><td colspan="4" style="text-align:center;">No classes scheduled yet. Add one below!</td></tr>';
        return;
    }

    classes.forEach(cls => {
        const row = document.createElement('tr');
        row.setAttribute('data-id', cls.id);

        const timeParts = cls.time ? cls.time.split(':') : ['00', '00'];
        const hours = parseInt(timeParts[0], 10);
        const minutes = timeParts[1];
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const displayHours = hours % 12 || 12;
        const formattedTime = `${String(displayHours).padStart(2, '0')}:${minutes} ${ampm}`;

        row.innerHTML = `
            <td>${escapeHTML(cls.teacher)}</td>
            <td>${escapeHTML(cls.students)}</td>
            <td>${escapeHTML(formattedTime)}</td>
            <td><button class="remove-btn" onclick="removeClass(${cls.id})">Remove</button></td>
        `;
        classListTableBodyAdmin.appendChild(row);
    });
}

/**
 * Adds a new class based on form input and saves.
 * @param {Event} event - The form submission event.
 */
function addClass(event) {
    event.preventDefault();

    const teacher = teacherNameInput.value.trim();
    const students = parseInt(studentCountInput.value, 10);
    const time = classTimeInput.value;

    if (!teacher || isNaN(students) || students < 0 || !time) {
        alert('Please fill in all fields correctly.');
        return;
    }

    const newClass = {
        id: nextId++,
        teacher: teacher,
        students: students,
        time: time
    };

    classes.push(newClass);
    saveClassesToStorage(); // <-- Save after adding
    renderAdminClasses();
    addClassForm.reset();
}

/**
 * Removes a class by its ID and saves.
 * @param {number} id - The ID of the class to remove.
 */
// Make removeClass globally accessible for the inline onclick handler
window.removeClass = function(id) {
   if (confirm('Are you sure you want to remove this class?')) {
       classes = classes.filter(cls => cls.id !== id);
       saveClassesToStorage(); // <-- Save after removing
       renderAdminClasses();
   }
}

// --- Event Listeners and Initial Setup ---
document.addEventListener('DOMContentLoaded', () => {
    // Get Admin page specific elements
    classListTableBodyAdmin = document.getElementById('class-list-admin');
    addClassForm = document.getElementById('add-class-form');
    teacherNameInput = document.getElementById('teacher-name');
    studentCountInput = document.getElementById('student-count');
    classTimeInput = document.getElementById('class-time');

    if (addClassForm) {
       addClassForm.addEventListener('submit', addClass);
    } else {
        console.error("Add class form not found on admin page!");
    }

    // Initial Render for Admin page
    renderAdminClasses();
});