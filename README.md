# Votacions DAM 2026

Aplicació senzilla per votar i veure els resultats en temps real.

## Què necessites

- Node.js
- Docker (només si vols fer servir Docker)

## Executar manualment

Obre dos terminals.

**Terminal 1: backend**

```bash
cd back
npm install
npm start
```

**Terminal 2: frontend**

```bash
cd frontend
npm install
npm run dev
```

Obre [http://localhost:5173](http://localhost:5173).

Per entrar: usuari `user` i contrasenya `123`.

## Executar amb Docker

Des de l'arrel del projecte:

```bash
docker compose up --build
```

Obre [http://localhost:8080](http://localhost:8080).

Per aturar-ho:

```bash
docker compose down
```

## Executar amb Electron

Primer engega el backend com en l'opció manual (Terminal 1).

Després:

```bash
cd electron
npm install
npm start
```

Si canvies el frontend, actualitza la versió d'escriptori amb:

```bash
cd electron
npm run build
```
