# Midas

Midas is a real-time, collaborative rapid-prototyping tool.

## Tech Stach

#### Built using:

- React Frontend
- Node, Express, Postgres and Redis Backend
- Graphql API
- Electron desktop application

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

For development, you will need Node.js and npm installed on your environment.

    $ node --version
    v13.11.0

    $ npm --version
    6.13.7

### Installing

    $ git clone https://github.com/IsaacAderogba/midas.git
    $ cd midas
    $ npm install
    $ cd client
    $ npm install

### Starting Development Server

Execute command from root folder. Starts both the server and the client in development mode.

    $ npm run dev

Open [http://localhost:3000](http://localhost:3000) to view it in the browser. Server is at [http://localhost:5000](http://localhost:5000)

### Running the tests

Execute command from root folder. First script runs testing for both the server and the client

    $ npm run test
    $ npm run test-server
    $ npm run test-client

### Deployment / Build For Production

    $ npm run build

Builds the app for production to the `public` folder in the root directory.
It correctly bundles React in production mode and optimizes the build for the best performance.

## Available Scripts

From root folder

    Starts index.js using node command - for heroku
    $ npm run start

    Starts index.js using nodemon as a file watcher
    $ npm run server

    Starts react client app
    $ npm run client

    Tests server in interactive mode
    $ npm run test-server

    Tests clients in interactive mode
    $ npm run test-client

    Tests server and client using concurrently
    $ npm run test

    Starts server and client using concurrently
    $ npm run dev

    Starts server, client and electron instance
    $ npm run electron
