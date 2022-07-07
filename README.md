# Nextjs OpenJira App

Para correr localment, se necesita la base de datos

```
docker-compose up -d
```

- el -d, significa **detached**

MongoDB URL Local:

```
mongodb://localhost:27017/entriesdb
```

## configurar las variables de entorno

renombrar el archivo **.env.template** a **.env**

- RECONSTRUIR MODULOS DE NODE

```
pnpm install
pnpm run dev
```

## llenar la base de datos con informacion de pruebas

```
http://localhost:3000/api/seed
```

## OJO! solo llamar en development dado que borra todos los registros antes de popular nuevamente la db
