FROM ubuntu:18.04

RUN apt-get update

# Postgres
RUN apt-get install -y curl ca-certificates gnupg sudo

# PGP key to verify their Debian packages.
RUN curl https://www.postgresql.org/media/keys/ACCC4CF8.asc | sudo apt-key add -

RUN mkdir -p /etc/apt/sources.list.d/

# Seleciona versão 12, do banco de dados.
RUN echo "deb http://apt.postgresql.org/pub/repos/apt/ bionic-pgdg main" > /etc/apt/sources.list.d/pgdg.list

RUN apt-get update
RUN apt-get upgrade -y

ARG DEBIAN_FRONTEND=noninteractive
RUN apt-get install -y postgresql-12 postgresql-client-12

# Python
RUN apt-get install -y python3 python3-dev python3-pip
# tesseract-ocr-[lang] all
RUN apt-get install -y libleptonica-dev tesseract-ocr-por libtesseract-dev

COPY ./packages/python/src /app
COPY ./shared/audios /app/shared/audios
COPY ./shared/images /app/shared/images

COPY requirements.txt /
RUN pip3 install --upgrade pip
RUN pip3 install -r /requirements.txt

WORKDIR /app

EXPOSE 5000

CMD [ "python3", "./main.py" ]
