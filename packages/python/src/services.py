import pytesseract as ocr
from PIL import Image
from gtts import gTTS
import os

def converteImgParaTexto(enderecos):
    # TODO Pedir essa informação da requisição
    extencoes_de_imgs = ['.jpg', '.jpeg', '.png']
    textos = []

    # Trasnforma imagens em textos
    for endereco in enderecos:
        if endereco.endswith(tuple(extencoes_de_imgs)):
            img = Image.open(endereco)
            textos.append(ocr.image_to_string(img, lang='por'))

    # Une textos (tranforma em um única linha)
    linha = [str(texto.replace('\n', ' ')) for texto in textos]
    trata_linha = [str(palavra.replace('- ', '')) for palavra in linha]
    linha_tratada = " ".join(trata_linha)

    # print(linha_tratada)

    return linha_tratada

def converteTextoParaAudio(texto, nome, lingua="pt"):
    transforma_em_audio = gTTS(texto, lang=lingua)
    # transforma_em_audio.save(nome + '.mp3')
    transforma_em_audio.save("%s.mp3" % os.path.join("./shared/audios", nome))
    return nome