FROM ubuntu:20.10

RUN apt-get update
RUN apt-get install -y python3 python3-dev python3-pip
# tesseract-ocr-[lang] all
RUN apt-get install -y libleptonica-dev tesseract-ocr-por libtesseract-dev

COPY ./packages/python/src /app
COPY ./shared/audios /app/shared/audios
COPY ./shared/images /app/shared/images

COPY requirements.txt /
RUN pip3 install -r /requirements.txt

WORKDIR /app

EXPOSE 5000

CMD [ "python3", "./app.py" ]

# /usr/bin/python3 -m pip install -U pylint --user
