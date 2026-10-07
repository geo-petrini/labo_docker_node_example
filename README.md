# Stack Node.js + MongoDB — CRUD

Template minimale per avviare un'applicazione **Node.js / Express** (20 LTS) con **MongoDB**, e una piccola CRUD su una collezione `items`.

## Struttura

```
node/
├── README.md
├── .dockerignore
├── docker-compose.yml   # servizi app + db
├── Dockerfile           # immagine Node Alpine
├── package.json         # espress, mongodb
├── server.js            # Express: route web + API
├── db.js                # accesso MongoDB (MongoClient)
└── public/
    └── index.html       # pagina HTML che usa l'API via JS
```

## docker-compose.yml

```yaml
services:
  app:
    build: .
    container_name: node-mongo-app
    ports:
      - "3010:3000"
    environment:
      MONGO_URL: mongodb://mongo:27017
      MONGO_DB: esempio
    depends_on:
      mongo:
        condition: service_healthy

  mongo:
    image: mongo:7
    container_name: node-mongo-db
    ports:
      - "27018:27017"
    volumes:
      - mongo-data:/data/db
    healthcheck:
      test: ["CMD", "mongosh", "--quiet", "--eval", "db.adminCommand('ping')"]
      interval: 5s
      timeout: 5s
      retries: 10

volumes:
  mongo-data:
```

## Concetti toccati

- **Build** — `build: .` esegue il `Dockerfile` (Node 20 Alpine + `npm install`).
- **Port mapping** — `"3010:3000"` espone l'app; `"27018:27017"` espone MongoDB.
- **Variabili d'ambiente** — `MONGO_URL` e `MONGO_DB` vengono lette da `db.js`.
- **Volume nominato** — `mongo-data` (montato in `/data/db`) rende i dati persistenti.
- **Healthcheck** — l'app attende che MongoDB risponda a `db.adminCommand('ping')` prima di partire.

## API CRUD (items)

| Metodo | Endpoint | Descrizione |
|---|---|---|
| `GET` | `/api/items` | Lista |
| `POST` | `/api/items` | Crea (`{"title", "note"}`) |
| `GET` | `/api/items/:id` | Singolo (MongoDB `_id`) |
| `PUT` | `/api/items/:id` | Modifica (`{"title", "note"}`) |
| `DELETE` | `/api/items/:id` | Elimina |

Al primo avvio la collezione `items` viene creata automaticamente con un item di esempio.

## Comandi

```bash
# avviare (compila l'immagine la prima volta)
docker compose up --build

# aprire l'interfaccia web
# http://localhost:3010

# esempi con curl
curl http://localhost:3010/api/items
curl -X POST -H "Content-Type: application/json" -d '{"title":"Ciao","note":"da curl"}' http://localhost:3010/api/items
curl http://localhost:3010/api/items/ID_MONGO
curl -X PUT -H "Content-Type: application/json" -d '{"title":"Aggiornato","note":"ok"}' http://localhost:3010/api/items/ID_MONGO
curl -X DELETE http://localhost:3010/api/items/ID_MONGO

# stato e log
docker compose ps
docker compose logs -f

# fermare tutto
docker compose down

# fermare ed eliminare anche i volumi (perde i dati)
docker compose down -v
```