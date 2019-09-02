# Cloud Ace API

Simple API using Node.JS to authenticate username and password to database (PostgreSQL).

## Installation

1. Install latest node.js from [Node.js Official Website](https://nodejs.org/en/).
2. Install PostgreSQL (9.x.x) on your machine or connect remotely.
3. Run ``npm install`` to install dependencies from node package manager.
4. Set these environment variables:
   ```
   export DB_CONN = "<DB MAXIMUM CONNECTION POOL / Default to 10>"
   export DB_HOST = "<DB HOSTNAME / Default to 127.0.0.1>"
   export DB_PORT = "<DB PORT / Default to 5432>"
   export DB_USER = "<DB USERNAME / Default to root>"
   export DB_PASSWORD = "<DB PASSWORD / Default to ''>"
   export DB_NAME = "<YOUR DB NAME>"
   export API_SALT = "<SALT USED TO ENCRYPT/DECRYPT PASSWORD>"
   export API_BEARER = "<TOKEN USED TO AUTHENTICATE REQUEST>"
   ```
5. Run ``node server.js`` to start the application.

## API List
POST /login: to check username and password.
```json
{
    'username': 'YOUR_USERNAME_HERE',
    'password': 'YOUR_PASSWORD_HERE'
}
```

POST /register: to register new username and password.
```json
{
    'username': 'YOUR_USERNAME_HERE',
    'password': 'YOUR_PASSWORD_HERE'
}
```

Every request sent should be including Bearer Authorization that is exported on Machine's Environment Variables

## DDL

```sql
CREATE TABLE public.users
(
    id integer NOT NULL DEFAULT nextval('users_id_seq'::regclass),
    username character varying(255) COLLATE pg_catalog."default",
    password character varying(255) COLLATE pg_catalog."default",
    created_at timestamp without time zone,
    updated_at timestamp without time zone,
    CONSTRAINT users_pkey PRIMARY KEY (id)
)
```