# Storefront Backend Project

## Getting Started

- To get started, clone this repo and run `yarn or npm i` in your terminal at the project root.

- you have to have a .env file in the repo, it has to contain the following variables
POSTGRES_HOST=127.0.0.1
POSTGRES_DB=todos_dev
POSTGRES_TEST_DB=todos_test
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
NODE_ENV=dev

- you have to create two databases with the value you set in POSTGRES_DB, POSTGRES_TEST_DB, this is an example for the SQL needed when connected to psql
`
CREATE USER username123 WITH PASSWORD 'password123';    
CREATE DATABASE todos_dev;  
\c todos_dev
GRANT ALL PRIVILEGES ON DATABASE todos_dev TO username123;
CREATE DATABASE todos_test;
\c todos_test
GRANT ALL PRIVILEGES ON DATABASE todos_test TO username123;
`

## Overview


### 1.  DB Creation and Migrations

- to run migrations up on dev environment run `npm run devdb-up`, to run migrations down it run `npm run devdb-reset`
- to run migrations up on test environment run `npm run testdb-up`, to run migrations down it run `npm run testdb-reset`
- to create a new migration run :db-migrate create todos --sql-file

### 2. database.json
this is given to the db-migrate to setup different databases (test/dev), for more info check :
https://db-migrate.readthedocs.io/en/latest/Getting%20Started/configuration/


### 3. Local host ports
-for the database, port is not specified so it will run on the selected port for postgres installation (default is 5432)
-server is running on port 3000