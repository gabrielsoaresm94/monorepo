from flask import Flask

from modules.audios.audios import audiosModule
# from modules.audios.services import services

app = Flask(__name__)
app.register_blueprint(audiosModule)

if __name__ == '__main__': 
    app.run(host='0.0.0.0', port=5000, debug=True, use_reloader=True)