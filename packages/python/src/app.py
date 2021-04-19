from flask import Flask, request, jsonify, send_from_directory
app = Flask(__name__)

import services

@app.route('/')
def hello_world():
    return {
        "nome": "Hello, World!"
    }

@app.route('/audios',  methods=['POST'])
def criaAudio():
    if (request.is_json):
        print (request.is_json)
        body = request.get_json(force=True)

        nome = body.get("nome")
        caminhos = body.get("caminhos")

        textoRetornado = services.converteImgParaTexto(caminhos)
        nomeArquivoRetornado = services.converteTextoParaAudio(textoRetornado, nome)

        # return send_from_directory(directory='shared/audios', filename=("%s.mp3" % (nomeArquivoRetornado)), as_attachment=True)

        return {
            "message": "[INFO] - criaAudio - Áudio criado com sucesso.",
            "metadata": {
                "nome": nomeArquivoRetornado,
            },
            "status": true
        }
    else:
        return {
            "message": "[ERRO] - criaAudio - Problemas para criar áudio.",
            "erro": "Problem!",
            "status": false,
        }

app.run(host='0.0.0.0', port=5000, debug=True, use_reloader=True)