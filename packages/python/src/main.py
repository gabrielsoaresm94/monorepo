from __init__ import create_app
from database import db
from modules.audios.audios import audiosModule

app = create_app()
db.init_app(app)

app.register_blueprint(audiosModule)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True, use_reloader=True)