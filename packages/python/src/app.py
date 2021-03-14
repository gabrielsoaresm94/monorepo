from flask import Flask, request, jsonify, send_from_directory
app = Flask(__name__)

import services

@app.route('/')
def hello_world():
    return {
        "nome": "Hello, World!"
    }

# TODO - Adicionar "./shared" aos caminhos
@app.route('/audios',  methods=['POST'])
def retornaAudio():
    if (request.is_json):
        print (request.is_json)
        body = request.get_json(force=True)

        nome = body.get("nome")
        caminhos = body.get("caminhos")

        textoRetornado = services.converteImgParaTexto(caminhos)
        nomeArquivoRetornado = services.converteTextoParaAudio(textoRetornado, nome)

        return send_from_directory(directory='shared/audios', filename=("%s.mp3" % (nomeArquivoRetornado)), as_attachment=True)

        # return {
        #     "nome": nome,
        #     "caminhos": caminhos
        #     "texto": textoRetornado
        # }
    else:
        return {
            "erro": "Problem!"
        }

app.run(host='0.0.0.0', port=5000, debug=True, use_reloader=True)