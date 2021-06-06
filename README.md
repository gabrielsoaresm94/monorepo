# Estudos para a construção de um monorepo
Este projeto visa o aprendizado de algumas boas práticas no que tange a construção do modelo de [monorepo]() e a oportunidade de estudar padronização de uma arquitetura de projeto com [nestjs](), além de lógica de programação utilizando [python](), consumo de bibliotecas para ajudar no processamento dos dados inseridos e as boas práticas do framework [flask]().

O projeto pode, ou não sofrer modificações, para se adequar num futuro, a utlização de bibliotecas e frameworks para a criação de interfaces, tais como [nextjs]() ou [react-native]().

## Escopo do projeto
TODO.

## Arquitetura
TODO.

## Como instalar (sistemas linux)
De início, como um projeto que roda com javascript, é preciso ter instalado o interpretador [nodejs](), e o gerenciador de pacotes [yarn](), por conta de ser um monorepo.

```
yarn install
```

Depois disso será necessário dispor de uma imagem Docker do banco Postgres, para a criação de um container com o banco que será utilizado pelo sistema:
```
docker run --name <nome-banco> -e TZ=America/Sao_Paulo -e POSTGRES_PASSWORD=<senha> -p 5432:5432 -d postgres
```
Assim como o Docker, listado acima, será preciso ter instalado o Dockercompose, para a criação de um container com a linguagem Python e das bibliotecas que serão utilizadas pela mesma, para o pacote `/python` funcionar e as mudanças feitas nas pastas contidas em `/shared` forem captadas pelo container. Ele pode ser rodado de forma independente utilizando os comandos a seguir, para disparar o shell script que foi criado para automatizar o processo:
```
cd packages/python
sudo bash ./start.sh
```

## Como rodar (sistemas linux)
Para o sistema funcionar, de maneira completa, é necessário rodar os pacotes `/api` e `/python`, além de iniciar o banco de dados pelo Docker, executando os seguintes passos:
```
docker start <nome-banco>
yarn run start:python
yarn run start:api
```

Para acessar diretamente o pacote da `/api` e ao rodar ter acesso aos logs:
```
cd packages/api
yarn run start:dev
```

## Gerenciamento de pacotes
TODO.

## Documentação de pacotes
TODO.

## Problemas e soluções
* Envio de multiplos arquivos - [artigo](https://betterprogramming.pub/nestjs-file-uploading-using-multer-f3021dfed733);
## Conteúdos e inspirações:
* Monorepo pela Rocketseat - [vídeo](https://www.youtube.com/watch?v=k5TkBcUTJus&t=44s) e [repo](https://github.com/rocketseat-content/youtube-monorepo);
* Monorepo Starter - [repo](https://github.com/palmerhq/monorepo-starter);
* NestJS Mono repo starter - [repo](https://github.com/scopsy/nestjs-monorepo-starter);
* NestJS mono-repo starter - [repo](https://github.com/BrunnerLivio/nestjs-monorepo-starter);
* NestJS auth - [Codebrains artigo](https://codebrains.io/nest-js-express-jwt-authentication-with-typeorm-and-passport/) e [wanago.io](https://wanago.io/2020/05/25/api-nestjs-authenticating-users-bcrypt-passport-jwt-cookies/);
* Stream de áudio com node - [artigo](http://cangaceirojavascript.com.br/streaming-audio-node/);