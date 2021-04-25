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

        texto_retornado = services.converteImgParaTexto(caminhos)

        # nome_arquivo_retornado = services.converteTextoParaAudio(texto_retornado, nome)
        # return send_from_directory(directory='shared/audios', filename=("%s.mp3" % (nome_arquivo_retornado)), as_attachment=True)

        tamanho_arquivo_retornado = services.converteTextoParaAudio(texto_retornado, nome)
        tamnho = tamanho_arquivo_retornado / (1024 * 1024)

        return {
            "message": "[INFO] {criaAudio} - Áudio criado com sucesso.",
            "metadata": {
                "nome": nome,
                "tamanho": tamnho,
                "formato": "audio/mp3"
            },
            "status": bool(True)
        }
    else:
        return {
            "message": "[ERRO] {criaAudio} - Problemas para criar áudio.",
            "erro": "Problem!",
            "status": bool(False),
        }

app.run(host='0.0.0.0', port=5000, debug=True, use_reloader=True)