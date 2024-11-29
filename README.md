# Northcoders News API

This Project is an API for a mini news article website written in JavaScript with ExpressJS and PostrgreSQL. Users can view articles and comment on them aswell as vote on any article. Other endpoints include deleting comments and having the abilty to sort articles by topic, date, comment count e.t.c. A list of all avaliable endpoints is available within the endpoints.json file.

# Link to Hosted API

https://backend-project-tkj2.onrender.com/api

# Setup guide

# Cloning the repository

To clone this repository run the following command in the terminal git clone https://github.com/imys1/imys-be-nc-news.git

# Installing dependencies

To install required dependencies for this project use the command npm install this will install the following dependencies:

npm
dotenv
express
supertest
pg/format
jest/sorted/extended
husky

# Setting up Development & Test Environments

Create a testing file called .env.test within this new file set up the test database with the script PGDATABASE=nc_news_test

Create a development file called .env.development within this new file set up the dev database with the script PGDATABASE=nc_news

# Seeding the Databases

To seed the newly created databases run the commands

1. npm run setup-dbs
2. npm run seed

# Testing for this project

This project uses Jest to ensure all functions are passing to run tests use the command npm test

# Minimum versions of Node.js and PostgreSQL needed to run the project

Node.js: 19.0.0 or later
PostgreSQL: 12.12 or later
