# Documentação do Projeto

### Introdução

Este arquivo README serve como guia para instalação e execução do projeto. Ele fornece instruções detalhadas sobre como clonar o repositório Git, instalar as dependências e executar a aplicação.

## Pré-requisitos

Para seguir este guia, você precisará ter os seguintes softwares instalados em seu sistema:

1. `Git`
2. `Node.js`
3. `npm` (geralmente incluído com o Node.js)

## Instalação

1. **Clone o repositório Git:**

```
git clone https://github.com/rafaelbarross/english-learn-AI.git
```

2. **Instale as dependências:**

```
npm install
```

## Criando o Arquivo .env

O arquivo .env é crucial para armazenar variáveis de ambiente sensíveis, como credenciais de banco de dados, de forma segura.

1. **Crie um arquivo:** Navegue até o diretório raiz do projeto e crie um novo arquivo chamado `.env`

2. **Adicione as Variáveis de Ambiente:** Abra o arquivo .env no seu editor de texto. Adicione as seguintes variáveis de ambiente, substituindo os valores de exemplo pelos reais.

```ts
GOOGLE_API_KEY=<Your Google API Key>
```

## Execução

Para executar o projeto, utilize o seguinte comando:

```
npm run dev
```
<br/>

É isso, está tudo pronto!
