# Monorepo boilerplate
Este projeto visa o aprendizado de algumas boas práticas no que tange a construção do modelo de [monorepo](https://pt.stackoverflow.com/questions/452607/o-que-%C3%A9-um-monorepo-quais-s%C3%A3o-as-suas-vantagens-e-desvantagens) e a oportunidade de estudar padronização de uma arquitetura de projeto com [nestjs](https://docs.nestjs.com/), além de lógica de programação com [python](https://www.python.org/), boas práticas do framework [flask](https://flask.palletsprojects.com/en/2.0.x/) e o consumo de bibliotecas para ajudar no processamento dos dados inseridos.

## Escopo do projeto
O monorepo, pode conter múltiplos pacotes dependendo dos requisitos da aplicação. Neste projeto estão inclusos estes componentes:

- `shared`: Compartilha os arquivos estáticos entre servidores
- `packages`:
    - `api`: NestJS Api server (depende de `shared` + `python`)
    - `python`: Flask server (depende de `shared`)
    - `ui`: React components, storybook
    - `web`: Next app (depende de `ui` + `api` + `shared` + `python`)
    <!-- - `mobile`: React-native app (depende de `api` + `shared` + `python`) -->

## Como instalar (sistemas linux)
De início, como um projeto que roda com javascript, é preciso ter instalado o interpretador [nodejs](https://nodejs.org/en/), e o gerenciador de pacotes [yarn](https://yarnpkg.com/getting-started), por conta de ser um monorepo.

```
yarn
# or yarn install
```

Depois disso, para inicializar tanto o banco como os demais serviços (pacotes), com o seguinte comando:
```
docker-compose build
```

### .env
Necessário também copiar o arquivo, .env.example e colocar as informações sensíveis para o arquivo .env.

### Migrations
Rodar migrations escritas para gerar tabelas no banco:
```
cd packages/api
yarn run migration:run
```

Exemplo de como criar uma migration:
```bash
yarn run typeorm:cli -- migration:create -n <NomeMigration>
```

## Como rodar (sistemas linux)
Utilizando a biblioteca `Lerna` e consumindo os scripts do `package.json`, o sistema inicia com os comandos listados a seguir. Lembrando que para o sistema funcionar, de maneira completa, é necessário rodar os pacotes `/api` e `/python`, além de iniciar o banco de dados, com o seguinte comando:
```
docker-compose up
```

Alguns comandos listados:

- _`yarn start`_: Roda o comando `yarn start` em todos os projetos ts:
  - api: Inicia a api em modo dev na porta 3001
- _`yarn run start:api`_: Inicia a api em modo dev na porta 3001
- _`yarn run start:service`_: Inicia o pacote python em modo dev na porta 5000 e banco de dados
- _`yarn lint`_: Aciona lint em todos os projetos ts
<!-- - _`yarn build`_: Builda todos os projetos ts -->
<!-- - _`yarn test`_: Testa todos os projetos ts -->

Para acessar diretamente o pacote da `/api` e ao rodar ter acesso aos logs:
```
cd packages/api
yarn run start:dev
```

## Gerenciamento de pacotes
O gerenciamento dos pacotes criados para este `monorepo`, é feito com [Lerna](https://github.com/lerna/lerna).

## Documentação de pacotes
- `packages`:
    - [api](packages/api/openapi.yaml)
    - [python](packages/python/openapi.yaml)

## Problemas e soluções
* Envio de multiplos arquivos - [artigo](https://betterprogramming.pub/nestjs-file-uploading-using-multer-f3021dfed733);
## Conteúdos e inspirações:
* Monorepo pela Rocketseat - [vídeo](https://www.youtube.com/watch?v=k5TkBcUTJus&t=44s) e [repo](https://github.com/rocketseat-content/youtube-monorepo);
* Monorepo Starter - [repo](https://github.com/palmerhq/monorepo-starter);
* NestJS Mono repo starter - [repo](https://github.com/scopsy/nestjs-monorepo-starter);
* NestJS mono-repo starter - [repo](https://github.com/BrunnerLivio/nestjs-monorepo-starter);
* NestJS auth - [Codebrains artigo](https://codebrains.io/nest-js-express-jwt-authentication-with-typeorm-and-passport/) e [wanago.io](https://wanago.io/2020/05/25/api-nestjs-authenticating-users-bcrypt-passport-jwt-cookies/);
* Stream de áudio com node - [artigo](http://cangaceirojavascript.com.br/streaming-audio-node/);