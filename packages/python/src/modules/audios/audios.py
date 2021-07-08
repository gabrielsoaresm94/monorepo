from flask import Blueprint, request, jsonify, send_from_directory
from modules.audios.services import converteImgParaTexto, converteTextoParaAudio, removeAudio
from decorators import token_required

audiosModule = Blueprint('audios', __name__)

@audiosModule.route('/')
@token_required
def index():
    return {
        "nome": "Hello, World!"
    }

@audiosModule.route('/audios',  methods=['POST'])
def criaAudio():
    if (request.is_json):
        print (request.is_json)
        body = request.get_json(force=True)

        nome = body.get("nome")
        caminhos = body.get("caminhos")

        texto_retornado = converteImgParaTexto(caminhos)

        # nome_arquivo_retornado = converteTextoParaAudio(texto_retornado, nome)
        # return send_from_directory(directory='shared/audios', filename=("%s.mp3" % (nome_arquivo_retornado)), as_attachment=True)

        tamanho_arquivo_retornado = converteTextoParaAudio(texto_retornado, nome)
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

@audiosModule.route('/audios/<nome>',  methods=['DELETE'])
def removeAudio(nome):
    audio_removido = removeAudio(nome)

    if (audio_removido):
        return {
            "message": "[INFO] {removeAudio} - Áudio removido com sucesso.",
            "status": bool(True)
        }
    else:
        return {
            "message": "[ERRO] {removeAudio} - Problemas para remover áudio.",
            "erro": "Problem!",
            "status": bool(False),
        }
