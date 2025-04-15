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


@app.route("/students/<name>", methods=["GET"])
@cross_origin()
def loginStudents(name):
    student = session.query(Student).filter_by(username=name).first()
    if student:
        return jsonify({name: student.password})
    else:
        return jsonify({'error': 'Student not found'}), 404 # student doesn't exist



@app.route('/profile')
def my_profile():
    response_body = {
        "name": "Nagato",
        "about" :"Hello! I'm a full stack developer that loves python and javascript"
    }

    return response_body
'''
@app.route("/students/<name>", methods=["POST"])
def loginStudent(name):
    student = session.query(Student).filter_by(username=name).first()
    print(student.password)

    if not student:
        return jsonify({'error': 'Student not found'}), 404

    # Read JSON body
    data = request.get_json()
    entered_password = data.get('password')

    if entered_password == student.password:
        return jsonify({'username': student.username, 'role': student.role})
    else:
        return jsonify({'error': 'Invalid password'}), 403
'''
@app.route('/')
def home():
    return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=True)
