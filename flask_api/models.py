from sqlalchemy import create_engine, Column, Integer, String, Float, ForeignKey
from sqlalchemy.orm import sessionmaker, declarative_base, relationship

# Create the engine and session
engine = create_engine('sqlite:///database.db')
Session = sessionmaker(bind=engine)
session = Session()

# Create the base class for declarative models
Base = declarative_base()

class Student(Base):
    __tablename__ = 'students'
    id = Column(Integer, primary_key=True)
    username = Column(String(50))
    password = Column(String(50))
    
    admin_id = Column(Integer, ForeignKey('admins.id'))
    admin = relationship('Admin', backref='students')
    
    grades = relationship('Grade', backref='student')

class Teacher(Base):
    __tablename__ = 'teachers'
    id = Column(Integer, primary_key=True)
    username = Column(String(50))
    password = Column(String(50))
    
    admin_id = Column(Integer, ForeignKey('admins.id'))
    admin = relationship('Admin', backref='teachers')
    
    courses = relationship('Course', backref='teacher')
    grades = relationship('Grade', backref='teacher')

class Admin(Base):
    __tablename__ = 'admins'
    id = Column(Integer, primary_key=True)
    username = Column(String(50))
    password = Column(String(50))
    
    courses = relationship('Course', backref='admin')
    # These relationships are defined in Student and Teacher as backrefs:
    # students = relationship('Student', backref='admin')
    # teachers = relationship('Teacher', backref='admin')
    grades = relationship('Grade', backref='admin')

class Grade(Base):
    __tablename__ = 'grades'
    id = Column(Integer, primary_key=True)
    course_id = Column(Integer, ForeignKey('courses.id'))
    grade = Column(Float)

    student_id = Column(Integer, ForeignKey('students.id'))
    teacher_id = Column(Integer, ForeignKey('teachers.id'))
    admin_id = Column(Integer, ForeignKey('admins.id'))

class Course(Base):
    __tablename__ = 'courses'
    id = Column(Integer, primary_key=True)
    name = Column(String(50))
    teacher_name = Column(String(50))
    time_offered = Column(String(50))
    students_enrolled = Column(Integer)
    
    teacher_id = Column(Integer, ForeignKey('teachers.id'))
    admin_id = Column(Integer, ForeignKey('admins.id'))
    
    grades = relationship('Grade', backref='course')

# Optionally, you can include a helper function to create the tables.
def init_db():
    Base.metadata.create_all(engine)
