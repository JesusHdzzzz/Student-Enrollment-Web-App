# dummy_data.py

import os
from models import session, Admin, Teacher, Student, Grade, Course

def insert_dummy_data():
    # Print working directory and absolute path of the database file.
    cwd = os.getcwd()
    db_path = os.path.abspath("database.db")
    print(f"Working directory: {cwd}")
    print(f"Database file should be at: {db_path}")
    
    try:
        # --- Create an Admin ---
        admin1 = Admin(username="admin1", password="secret")
        session.add(admin1)
        session.commit()  # Commit so that admin1 gets an ID
        print(f"Admin inserted with ID: {admin1.id}")

        # --- Create Teachers ---
        teacher1 = Teacher(username="teacher1", password="password1", admin=admin1)
        teacher2 = Teacher(username="teacher2", password="password2", admin=admin1)
        session.add_all([teacher1, teacher2])
        session.commit()
        print(f"Teachers inserted with IDs: {teacher1.id}, {teacher2.id}")

        # --- Create Students ---
        student1 = Student(username="student1", password="password1", admin=admin1)
        student2 = Student(username="student2", password="password2", admin=admin1)
        student3 = Student(username="student3", password="password3", admin=admin1)
        session.add_all([student1, student2, student3])
        session.commit()
        print(f"Students inserted with IDs: {student1.id}, {student2.id}, {student3.id}")

        # --- Create Courses ---
        # Create and flush each course to assign an ID.
        course1 = Course(
            name="Math 101",
            teacher_name=teacher1.username,
            time_offered="MonWedFri 9-10am",
            students_enrolled=30,
            teacher=teacher1,
            admin=admin1
        )
        session.add(course1)
        session.flush()  # Flush so that course1 gets an ID
        print(f"Course1 inserted with ID: {course1.id}")
        
        course2 = Course(
            name="History 202",
            teacher_name=teacher2.username,
            time_offered="TueThu 11am-12pm",
            students_enrolled=25,
            teacher=teacher2,
            admin=admin1
        )
        session.add(course2)
        session.flush()  # Flush so that course2 gets an ID
        print(f"Course2 inserted with ID: {course2.id}")
        
        session.commit()  # Final commit for courses

        # --- Create Grades ---
        grade1 = Grade(
            course_id=course1.id,
            student_id=student1.id,
            teacher_id=teacher1.id,
            admin_id=admin1.id,
            grade=95.0
        )
        grade2 = Grade(
            course_id=course1.id,
            student_id=student2.id,
            teacher_id=teacher1.id,
            admin_id=admin1.id,
            grade=87.0
        )
        grade3 = Grade(
            course_id=course2.id,
            student_id=student3.id,
            teacher_id=teacher2.id,
            admin_id=admin1.id,
            grade=92.0
        )
        session.add_all([grade1, grade2, grade3])
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
