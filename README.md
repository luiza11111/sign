# sign-language-helper-vue

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VS Code](https://code.visualstudio.com/) + [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Recommended Browser Setup

- Chromium-based browsers (Chrome, Edge, Brave, etc.):
  - [Vue.js devtools](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd)
  - [Turn on Custom Object Formatter in Chrome DevTools](http://bit.ly/object-formatters)
- Firefox:
  - [Vue.js devtools](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)
  - [Turn on Custom Object Formatter in Firefox DevTools](https://fxdx.dev/firefox-devtools-custom-object-formatters/)

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Backend / PostgreSQL

The backend lives in the `server` folder. To run it locally:

```sh
cd server
npm install
cp .env.example .env
# fill .env with your PostgreSQL settings and JWT_SECRET
npm run dev
```

Use `DATABASE_URL` when deploying to Render, or set `DB_USER`, `DB_PASSWORD`, `DB_HOST`, `DB_PORT`, and `DB_NAME` for local Postgres.

### Connecting to a remote PostgreSQL instance (options)

1) Direct `DATABASE_URL` (recommended)

 - On the machine where you run the server, create `server/.env` from the example and set:

```env
DATABASE_URL=postgres://user:password@db-host.example.com:5432/sign
JWT_SECRET=your_jwt_secret
PORT=3002
```

Then start the server:

```bash
cd server
npm install
npm start
```

2) SSH tunnel (if the DB host is not directly reachable)

 - From the server machine, open an SSH tunnel to the remote DB host (replace `user@remote-host`):

```bash
ssh -L 5432:localhost:5432 user@remote-host
# keep the tunnel open in that terminal, then in another terminal run the server
cd server
cp .env.example .env
# set DB_HOST=localhost, DB_PORT=5432 (or use DATABASE_URL pointing to localhost)
npm install
npm start
```

3) Notes

 - If you use `DATABASE_URL`, the server will prefer it over individual DB_* variables.
 - The server will still serve `/api/proxy` and `/api/scrape-sign` even if the DB is unreachable; only routes that read/write DB (history, dictionary, users) require DB access.


### Compile and Minify for Production

```sh
npm run build
```
" " 
