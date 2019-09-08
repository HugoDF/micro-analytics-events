## Requirements

- Node 10
- Yarn 1.x or npm
- SQLite3

## Setup

1. Clone the repository
2. Run `yarn` or `npm install` installs all required dependencies.
3. Run `node setup.js` to create the SQLite3 database at `.date/main.db`

## npm scripts

> Equivalent `npm run <script>` should also work

- `yarn dev` will start micro in dev mode using [micro-dev](https://github.com/zeit/micro-dev)
- `yarn start` will start [micro](https://github.com/zeit/micro) in production mode on the port defined by PORT environment variable (default 3000)
  - `prestart` runs `setup.js` which will the SQLite3 events table if it doesn't exist.
- `yarn reset` **DANGER** will remove and re-initialise the SQLite3 database
- `yarn lint` will lint all of the files with [xo](https://github.com/xojs/xo)
- `yarn format` will run lint with `--fix` option on all the examples files (and tests).

## Deploying 

### On Glitch

This was designed to run on glitch.com, hence the use of SQLite3.

You can remix it directly from https://glitch.com/~interesting-protocol or deploy from this repository/your fork using Glitch's GitHub import feature.

## LICENSE

Code is licensed under the [MIT License](./LICENSE).

