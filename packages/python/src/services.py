import pytesseract as ocr
from PIL import Image
from gtts import gTTS
import os

def converteImgParaTexto(enderecos):
    extencoes_de_imgs = ['.jpg', '.jpeg', '.png']
    textos = []

    # Trasnforma imagens em textos
    for endereco in enderecos:
        if endereco.endswith(tuple(extencoes_de_imgs)):
            endereco_arquivo = ("./shared/images/%s" % endereco)
            img = Image.open(endereco_arquivo)
            textos.append(ocr.image_to_string(img, lang='por'))

    # Une textos (tranforma em um única linha)
    linha = [str(texto.replace('\n', ' ')) for texto in textos]
    trata_linha = [str(palavra.replace('- ', '')) for palavra in linha]
    linha_tratada = " ".join(trata_linha)

    return linha_tratada

def converteTextoParaAudio(texto, nome, lingua="pt"):
    transforma_em_audio = gTTS(texto, lang=lingua)
    transforma_em_audio.save("%s.mp3" % os.path.join("./shared/audios", nome))

    path_audio = ("./shared/audios/%s.mp3" % nome)
    size_bytes = os.path.getsize(path_audio)

    return size_bytes