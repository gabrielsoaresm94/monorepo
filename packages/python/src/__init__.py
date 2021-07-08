from flask import Flask

def create_app(test_config=None):
    app = Flask(__name__)
    # postgresql://username:password@server/db
    app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:root@127.0.0.1:5432/postgres'
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    app.secret_key = 'Codebrains'

    return app