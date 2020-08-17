# Restaurants Backend

Easily make restaurant choices

## Getting Started

## Table of Contents

-   [Table of Contents](#table-of-contents)
-   [Built Using](#built-using)
-   [Installation and Configuration](#installation-and-configuration)
-   [Running the Application](#running-the-application)
    > -   [For testing](#for-testing)
    > -   [For Development](#for-development)
    > -   [Running with Docker](#running-with-docker)
    > -   [Production](#for-production)
-   [Configure Environment Variables](#configure-environment-variables)

## Built Using

-   [Node.js](https://nodejs.org/en/)

    > -   [Typescript](https://www.typescriptlang.org/)
    > -   [express](https://expressjs.com/)
    > -   [Sequelize](https://docs.sequelizejs.com/)
    > -   [Jest](https://jestjs.io/)

-   [PostgreSQL](https://www.postgresql.org/)

### Installation and Configuration

Before Installation, ensure you have node.js and PostgreSQL installed on your device.

-   Clone the Repository

```bash
git clone git@github.com:fidelisojeah/fueled.git
```

-   Install Dependencies

```bash
npm install
```

-   Configure Environment Variables

    > -   Configure Environment Variables as specified [Here](#configure-environment-variables)

-   Setup Database

    > -   You are required to create database schemas as well as users as specified in the config files

-   Migrate Database
    > -   Using the ORM [Sequelize](#built-using), migrate database designs

```bash
npm run migrate
```

-   Seed Database

```bash
npm run seed
```

### Running the application

Documentation is available at: [/api-docs](http://localhost:3000/api-docs)

#### For testing

The applications tests are run with jest

```bash
npm run test
```

#### For development

The application uses nodemon to enable quick reload on changes

```bash
npm run start:dev
```

### Running with Docker

it is possible to run the application with docker.

Simply have docker installed on your machine.

```bash
docker-compose up
```

#### Seeding the database with docker

-   Stop the application `docker-compose down`
-   Open the docker-compose.yml file and uncomment the seed line.
-   Comment out the run line
-   change restart to never
-   Run `docker-compose up`

** Similar steps to run migrations **

### For production

Coming soon

## Configure Environment Variables

The following Environment variables need to be set and exported for application to function properly

```
DATABASE_USERNAME= The name of database user
DATABASE_PASSWORD= the password of database user
DATABASE_NAME= The database name
LOGGER_LEVEL=debug
```
