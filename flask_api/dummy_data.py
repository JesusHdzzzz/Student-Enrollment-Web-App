# dummy_data.py

import os
import random
from models import session, Admin, Teacher, Student, Grade, Course

def insert_dummy_data():
    # Print current working directory and expected database file location.
    cwd = os.getcwd()
    db_path = os.path.abspath("database.db")
    print(f"Working directory: {cwd}")
    print(f"Database file should be at: {db_path}")
    
    try:
        # --- Create Admin ---
        admin1 = Admin(username="admin1", password="secret")
        session.add(admin1)
        session.commit()  # Admin ID is now available.
        print(f"Admin inserted with ID: {admin1.id}")

        # --- Create Teachers ---
        teacher_names = ["alice", "bob", "charlie"]
        teachers = []
        for name in teacher_names:
            teacher = Teacher(username=name, password=f"pass_{name}", admin=admin1)
            session.add(teacher)
            session.commit()  # Ensure each teacher gets an ID.
            teachers.append(teacher)
            print(f"Teacher inserted: {teacher.username} (ID: {teacher.id})")

        # --- Create Students ---
        student_names = [f"student{i}" for i in range(1, 11)]  # 10 students: student1, student2, ..., student10
        students = []
        for s in student_names:
            student = Student(username=s, password=f"pass_{s}", admin=admin1)
            session.add(student)
            session.commit()  # Commit to assign an ID.
            students.append(student)
            print(f"Student inserted: {student.username} (ID: {student.id})")

        # --- Create Courses ---
        courses_data = [
            {"name": "Mathematics", "time_offered": "MonWedFri 9-10am"},
            {"name": "History", "time_offered": "TueThu 11-12pm"},
            {"name": "Biology", "time_offered": "MonWed 1-2pm"},
            {"name": "Computer Science", "time_offered": "TueThu 2-3pm"},
            {"name": "Economics", "time_offered": "Fri 10-12am"},
        ]
        courses = []
        for i, data in enumerate(courses_data):
            # Assign teachers round-robin.
            teacher = teachers[i % len(teachers)]
            course = Course(
                name=data["name"],
                teacher_name=teacher.username,
                time_offered=data["time_offered"],
                students_enrolled=0,  # We'll update this count as students enroll.
                teacher=teacher,
                admin=admin1
            )
            session.add(course)
            session.commit()  # Commit to assign course ID.
            courses.append(course)
            print(f"Course inserted: {course.name} (ID: {course.id})")
        
        # --- Enroll Students in Courses ---
        # For each student, enroll in 2 to 4 random courses.
        for student in students:
            num_courses = random.randint(2, 4)
            selected_courses = random.sample(courses, num_courses)
            for course in selected_courses:
                student.courses.append(course)
                # Increase the students_enrolled count.
                course.students_enrolled = (course.students_enrolled or 0) + 1
            session.commit()
            print(f"{student.username} enrolled in {num_courses} courses.")
        
        # --- Create Grades for Each Enrollment ---
        # For each student, create a Grade record for each course they're enrolled in.
        for student in students:
            for course in student.courses:
                grade_value = round(random.uniform(60, 100), 2)  # Random grade between 60 and 100.
                grade = Grade(
                    course_id=course.id,
                    student_id=student.id,
                    teacher_id=course.teacher.id,
                    admin_id=admin1.id,
                    grade=grade_value
                )
                session.add(grade)
        session.commit()
        print("Grades inserted successfully!")
        
        print("Dummy data inserted successfully!")
    except Exception as e:
        session.rollback()
        print("An error occurred:", e)
    finally:
        session.close()

if __name__ == '__main__':
    insert_dummy_data()
