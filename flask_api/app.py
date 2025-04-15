from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
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

@app.route('/')
def home():
    return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=True)
