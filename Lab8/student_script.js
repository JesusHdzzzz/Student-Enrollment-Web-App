// --- Constants ---
const STORAGE_KEY_CLASSES = 'schoolClasses'; // Key for the main class list
const STORAGE_KEY_ENROLLMENT = 'studentEnrollment'; // Key for student's enrolled class IDs

// --- DOM References ---
let studentClassListTableBody;

// --- Utility Functions ---
function escapeHTML(str) {
    const div = document.createElement('div');
    div.appendChild(document.createTextNode(String(str)));
    return div.innerHTML;
}

// --- Data Loading Functions ---
function loadClassesFromStorage() {
    const storedClasses = localStorage.getItem(STORAGE_KEY_CLASSES);
    if (storedClasses) {
        try {
            const parsed = JSON.parse(storedClasses);
            return Array.isArray(parsed) ? parsed : [];
        } catch (e) {
            console.error("Error parsing classes from localStorage:", e);
            return [];
        }
    }
    return []; // Return empty if nothing stored
}

function loadStudentEnrollment() {
    const storedEnrollment = localStorage.getItem(STORAGE_KEY_ENROLLMENT);
    if (storedEnrollment) {
        try {
            const parsed = JSON.parse(storedEnrollment);
            // Ensure it's an array of numbers (or convert if needed)
            return Array.isArray(parsed) ? parsed.map(Number).filter(id => !isNaN(id)) : [];
        } catch (e) {
            console.error("Error parsing student enrollment from localStorage:", e);
            return [];
        }
    }
    return []; // Return empty if nothing stored
}

// --- Data Saving Functions ---
function saveClassesToStorage(classes) {
    try {
        localStorage.setItem(STORAGE_KEY_CLASSES, JSON.stringify(classes));
    } catch (e) {
        console.error("Error saving classes to localStorage:", e);
        alert("Could not save class data updates.");
    }
}

function saveStudentEnrollment(enrollmentIds) {
    try {
        localStorage.setItem(STORAGE_KEY_ENROLLMENT, JSON.stringify(enrollmentIds));
    } catch (e) {
        console.error("Error saving student enrollment:", e);
        alert("Could not save enrollment status.");
    }
}

// --- Core Logic ---

/**
 * Enrolls the student in a class.
 * @param {number} classId - The ID of the class to enroll in.
 */
function enroll(classId) {
    if (!confirm(`Enroll in this class (ID: ${classId})?`)) {
        return;
    }

    let classes = loadClassesFromStorage();
    let studentEnrollment = loadStudentEnrollment();
    const classIndex = classes.findIndex(cls => cls.id === classId);

    // Validation
    if (classIndex === -1) {
        alert("Error: Class not found.");
        return;
    }
    if (studentEnrollment.includes(classId)) {
        alert("You are already enrolled in this class.");
        return;
    }
    // Optional: Add capacity check here if a 'capacity' field exists on class objects
    // if (classes[classIndex].students >= classes[classIndex].capacity) {
    //     alert("Sorry, this class is full.");
    //     return;
    // }


    // Update data
    classes[classIndex].students = (classes[classIndex].students || 0) + 1; // Increment student count
    studentEnrollment.push(classId); // Add class ID to student's list

    // Save updated data
    saveClassesToStorage(classes);
    saveStudentEnrollment(studentEnrollment);

    // Re-render the view
    renderStudentView();
    alert("Successfully enrolled!");
}

/**
 * Drops a class the student is enrolled in.
 * @param {number} classId - The ID of the class to drop.
 */
function drop(classId) {
     if (!confirm(`Drop this class (ID: ${classId})?`)) {
        return;
    }

    let classes = loadClassesFromStorage();
    let studentEnrollment = loadStudentEnrollment();
    const classIndex = classes.findIndex(cls => cls.id === classId);

    // Validation
    if (!studentEnrollment.includes(classId)) {
        alert("You are not enrolled in this class.");
        // Optionally, re-render in case the view was somehow outdated
        renderStudentView();
        return;
    }

    // Update data
    if (classIndex !== -1) { // Check if class still exists in main list
         classes[classIndex].students = Math.max(0, (classes[classIndex].students || 0) - 1); // Decrement, prevent going below 0
    } else {
        console.warn(`Class ID ${classId} not found in main list while dropping, only removing from student enrollment.`);
    }

    // Remove class ID from student's list
    studentEnrollment = studentEnrollment.filter(id => id !== classId);

    // Save updated data
    saveClassesToStorage(classes); // Save even if class wasn't found, to update count if it was
    saveStudentEnrollment(studentEnrollment);

    // Re-render the view
    renderStudentView();
    alert("Successfully dropped class!");
}

/**
 * Renders the student's view of the class list.
 */
function renderStudentView() {
    if (!studentClassListTableBody) {
        console.error("Student class list table body not found!");
        return;
    }

    const classes = loadClassesFromStorage();
    const studentEnrollment = loadStudentEnrollment(); // Get current enrollment status

    studentClassListTableBody.innerHTML = ''; // Clear current view

    if (classes.length === 0) {
        studentClassListTableBody.innerHTML = '<tr><td colspan="4" style="text-align:center;">No classes available. Check back later or contact Admin.</td></tr>';
        return;
    }

    classes.forEach(cls => {
        const isEnrolled = studentEnrollment.includes(cls.id);
        const row = document.createElement('tr');

        // Format time
        const timeParts = cls.time ? cls.time.split(':') : ['00', '00'];
        const hours = parseInt(timeParts[0], 10);
        const minutes = timeParts[1];
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const displayHours = hours % 12 || 12;
        const formattedTime = `${String(displayHours).padStart(2, '0')}:${minutes} ${ampm}`;

        // Create action button based on enrollment status
        let actionButtonHtml;
        if (isEnrolled) {
            actionButtonHtml = `<button class="drop-btn" onclick="drop(${cls.id})">Drop</button>`;
        } else {
            // Optional: Add disabled state if class is full (requires capacity field)
            // let disabled = cls.students >= cls.capacity ? 'disabled' : '';
            // actionButtonHtml = `<button class="enroll-btn" onclick="enroll(${cls.id})" ${disabled}>Enroll</button>`;
             actionButtonHtml = `<button class="enroll-btn" onclick="enroll(${cls.id})">Enroll</button>`;
        }

        row.innerHTML = `
            <td>${escapeHTML(cls.teacher)}</td>
            <td>${escapeHTML(cls.students)}</td>
            <td>${escapeHTML(formattedTime)}</td>
            <td>${actionButtonHtml}</td>
        `;
        studentClassListTableBody.appendChild(row);
    });
}

// --- Global Accessibility for onclick handlers ---
// Make functions available to be called directly from HTML onclick attributes
window.enroll = enroll;
window.drop = drop;

// --- Initialization ---
document.addEventListener('DOMContentLoaded', () => {
    studentClassListTableBody = document.getElementById('student-class-list');
    if (!studentClassListTableBody) {
         console.error("Element with ID 'student-class-list' not found!");
         return; // Stop if table body isn't found
    }
    renderStudentView(); // Initial render of the class list for the student
});