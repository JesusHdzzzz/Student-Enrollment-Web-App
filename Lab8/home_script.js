// --- DOM References ---
// We wait for the DOM to be loaded before getting these
let classListTableBodyHome;

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
 * Loads classes from localStorage.
 * Returns an array of class objects or an empty array if none found/error.
 */
function loadClassesFromStorage() {
    const storedClasses = localStorage.getItem(STORAGE_KEY);
    if (storedClasses) {
        try {
            // Attempt to parse the stored JSON
            const parsedClasses = JSON.parse(storedClasses);
            // Basic check if it's an array
            return Array.isArray(parsedClasses) ? parsedClasses : [];
        } catch (e) {
            console.error("Error parsing classes from localStorage:", e);
            // Return empty array if parsing fails
            return [];
        }
    }
    // Return empty array if nothing is stored
    return [];
}

/**
 * Renders the classes array into the HOME HTML table.
 * @param {Array} classes - The array of class objects to render.
 */
function renderHomeClasses(classes) {
    // Ensure the table body element is available
    if (!classListTableBodyHome) {
        console.error("Home class list table body not found!");
        return;
    }

    // Clear existing table rows
    classListTableBodyHome.innerHTML = '';

    if (!classes || classes.length === 0) {
        classListTableBodyHome.innerHTML = '<tr><td colspan="3" style="text-align:center;">No classes found. Add some on the Admin page!</td></tr>';
        return;
    }

    // Add a row for each class
    classes.forEach(cls => {
        const row = document.createElement('tr');

        // Format time for display (HH:MM AM/PM) - basic example
        const timeParts = cls.time ? cls.time.split(':') : ['00', '00'];
        const hours = parseInt(timeParts[0], 10);
        const minutes = timeParts[1];
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const displayHours = hours % 12 || 12; // Convert 0 or 12 to 12
        const formattedTime = `${String(displayHours).padStart(2, '0')}:${minutes} ${ampm}`;

        row.innerHTML = `
            <td>${escapeHTML(cls.teacher)}</td>
            <td>${escapeHTML(cls.students)}</td>
            <td>${escapeHTML(formattedTime)}</td>
            `;
        classListTableBodyHome.appendChild(row);
    });
}

// --- Initial Setup ---
// Wait until the HTML document is fully loaded and parsed
document.addEventListener('DOMContentLoaded', () => {
    // Now it's safe to get references to DOM elements
    classListTableBodyHome = document.getElementById('class-list-home');

    // Load classes from storage and render them
    const currentClasses = loadClassesFromStorage();
    renderHomeClasses(currentClasses);
});