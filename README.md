# Users Microservice y API Gateway

Este repositorio contiene dos servicios de backend para un sistema de gestión de usuarios usando microservicios con NestJS, Kafka y PostgreSQL, junto con Docker para levantar el entorno completo. Incluye el API Gateway y el Microservicio de Usuarios.

## Estructura del repositorio

/backend
api-gateway
src
app.module.ts
main.ts
users
users.controller.ts
users.module.ts
package.json
users-microservice
src
main.ts
app.module.ts
users
application
users-command.service.ts
users.service.ts
domain
aggregates
user.aggregate.ts
events
user.event.ts
infrastructure
user.entity.ts
users.module.ts
presentation
users.controller.ts
.env.example
package.json
docker-compose.yml

## Requisitos

Node.js v20 o superior
PostgreSQL 15 o superior
Docker y Docker Compose
Kafka (configurado en docker-compose)

## Configuración

1. En la carpeta `users-microservice` crear un archivo `.env` con los siguientes valores:

DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=tu_contraseña
DB_DATABASE=users_db
KAFKA_BROKER=localhost:9092

2. Asegurarse de que el `docker-compose.yml` apunte a los servicios correctos y los puertos estén disponibles.

## Docker Compose

El archivo docker-compose.yml incluye:

* Servicio de PostgreSQL
* Kafka y Zookeeper
* API Gateway
* Users Microservice

Se puede levantar todo el entorno con:

docker-compose up --build

## Uso

Para desarrollo local:

1. Levantar la base de datos, Kafka y los microservicios con Docker Compose.
2. Acceder al API Gateway en [http://localhost:3000](http://localhost:3000) y usar los endpoints:
   POST /users
   GET /users
   GET /users/:id
   PUT /users/:id
   DELETE /users/:id

El API Gateway solo enruta las solicitudes y envía eventos a Kafka. El microservicio de usuarios maneja la lógica de negocio, persistencia en PostgreSQL y envío de eventos de dominio.

## Patrón de arquitectura

* DDD (Domain Driven Design)
* CQRS (Command Query Responsibility Segregation)
* Event Sourcing usando Kafka
* TypeORM Repository Pattern para PostgreSQL

## Base de datos

Solo se utiliza la tabla `users`. Estructura principal:

id uuid primary key
first_name varchar not null
last_name varchar not null
cedula varchar unique not null, 10 caracteres
email varchar unique not null
phone varchar, 10 caracteres
role varchar default 'viewer'
status boolean default true
created_at timestamp
updated_at timestamp

## Despliegue

* Subir el repositorio a GitHub
* Configurar los secretos y variables de entorno en el servicio de hosting o VPS
* Levantar con docker-compose

## Endpoints principales

POST /users crea un usuario
GET /users lista usuarios
GET /users/:id obtiene un usuario
PUT /users/:id actualiza un usuario
DELETE /users/:id elimina un usuario (soft delete)

## Notas

* El microservicio se conecta directamente a la base de datos.
* El API Gateway no necesita conexión directa a la base de datos.
* Todos los cambios en usuarios generan eventos que se envían a Kafka.
* Se recomienda mantener las validaciones de frontend, backend y base de datos consistentes.
