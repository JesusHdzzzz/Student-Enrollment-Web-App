// utils.js
const STORAGE_KEY_CLASSES = 'schoolClasses';
const STORAGE_KEY_ENROLLMENT = 'studentEnrollment';

export function loadClassesFromStorage() {
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
    return [];
}

export function saveClassesToStorage(classes) {
    try {
        localStorage.setItem(STORAGE_KEY_CLASSES, JSON.stringify(classes));
    } catch (e) {
        console.error("Error saving classes to localStorage:", e);
        alert("Could not save class data updates.");
    }
}

export function loadStudentEnrollment() {
    const storedEnrollment = localStorage.getItem(STORAGE_KEY_ENROLLMENT);
    if (storedEnrollment) {
        try {
            const parsed = JSON.parse(storedEnrollment);
            return Array.isArray(parsed) ? parsed.map(Number).filter(id => !isNaN(id)) : [];
        } catch (e) {
            console.error("Error parsing student enrollment from localStorage:", e);
            return [];
        }
    }
    return [];
}

export function saveStudentEnrollment(enrollmentIds) {
    try {
        localStorage.setItem(STORAGE_KEY_ENROLLMENT, JSON.stringify(enrollmentIds));
    } catch (e) {
        console.error("Error saving student enrollment:", e);
        alert("Could not save enrollment status.");
    }
}

export function loadTeacherClasses(teacherId) {
    const classes = loadClassesFromStorage();
    return classes.filter(cls => cls.teacherId === teacherId);
}