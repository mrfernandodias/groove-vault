# Groove Vault — Web

Frontend em Vue 3, TypeScript, Vite e Tailwind CSS 4.

## Ambiente recomendado

Use o Node.js 24 e abra a raiz do repositório no VS Code para que as configurações de
`.vscode` sejam aplicadas. Ao abrir o projeto, instale as extensões recomendadas pelo editor.

## Configuração do projeto

```sh
npm install
```

## Desenvolvimento

```sh
npm run dev
```

Ao salvar, o VS Code formata com Prettier, corrige problemas seguros com ESLint/Oxlint e ordena
imports. O padrão do projeto usa ponto e vírgula, aspas duplas, linhas de até 100 caracteres e
ordenação automática de classes Tailwind.

## Qualidade de código

```sh
# Executa TypeScript, lint e verificação de formatação em paralelo
npm run check

# Corrige lint automaticamente
npm run lint:fix

# Formata todo o frontend
npm run format
```

`npm run lint` e `npm run format:check` apenas verificam os arquivos e não os alteram, por isso
são adequados para CI.

## Build de produção

```sh
npm run build
```
