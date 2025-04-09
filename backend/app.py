from flask import Flask
from routes.assignments import assignments_bp

app = Flask(__name__)
app.register_blueprint(assignments_bp)

if __name__ == '__main__':
    app.run(debug=True)