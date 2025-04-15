from flask import Flask, render_template, request, jsonify
from flask_cors import CORS, cross_origin
from flask_admin import Admin
from flask_admin.contrib.sqla import ModelView
from models import Admin as AdminModel, Student, Teacher, Grade, Course, session
import logging
import requests

# Import database objects and models from models.py
from models import engine, session, init_db, Student, Teacher, Admin as AdminModel, Grade, Course

app = Flask(__name__)
app.config['SECRET_KEY'] = 'your-secret-key'  # add your config settings

CORS(app, resources={r'/api/*': {"origins": "http://localhost:3000"}})

app.logger.setLevel(logging.DEBUG)

# Initialize the database tables
init_db()

# Setup Flask-Admin
admin = Admin(app, name='MyApp Admin', template_mode='bootstrap3', endpoint='admin_panel')

# Add model views for each model.
# Notice that since you already imported AdminModel as the model class for the 'admins' table,
# you can add it along with the others.
admin.add_view(ModelView(Student, session))
admin.add_view(ModelView(Teacher, session))
admin.add_view(ModelView(AdminModel, session))
admin.add_view(ModelView(Grade, session))
admin.add_view(ModelView(Course, session))

# Login ---------------------------------

@app.route("/students/<name>", methods=["GET"])
@cross_origin()
def getStudent(name):
    student = session.query(Student).filter_by(username=name).first()
    if student:
        return jsonify({name: student.password})
    else:
        return jsonify({'error': 'Student not found'}), 404 # student doesn't exist
    
@app.route("/teachers/<name>", methods=["GET"])
@cross_origin()
def getTeacher(name):
    teacher = session.query(Teacher).filter_by(username=name).first()
    if teacher:
        return jsonify({name: teacher.password})
    else:
        return jsonify({'error': 'Teacher not found'}), 404 # student doesn't exist
    
@app.route("/admins/<name>", methods=["GET"])
@cross_origin()
def getAdmin(name):
    admin = session.query(AdminModel).filter_by(username=name).first()
    if admin:
        return jsonify({name: admin.password})
    else:
        return jsonify({'error': 'Admin not found'}), 404 # student doesn't exist
    
# Add class -----------------------------

@app.route("/courses", methods=["POST"])
@cross_origin()
def addClass():
    classes = request.get_json()
    class_name = classes.get("course_name")
    class_teacher = classes.get("course_teacher")
    class_time = classes.get("course_time")

    entry = Course(name=class_name, teacher_name=class_teacher, time_offered=class_time, students_enrolled=0)
    session.add(entry)
    session.commit()

    return jsonify({"message": "Course added"})

# Get Classes ----------------------------

@app.route("/courses", methods=["GET"])
@cross_origin()
def getClasses():
    all = session.query(Course).all()
    classes = {}

    for cls in all:
        classes.append({
            "id": cls.id,
            "name": cls.name,
            "teacher": cls.teacher_name,
            "time": cls.time_offered,
            "students_enrolled": cls.students_enrolled
        })

    return jsonify(classes)



@app.route('/')
def home():
    return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=True)
