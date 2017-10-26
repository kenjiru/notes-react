Install the node modules:

`npm install`

Install the TypeScript definition files:

`npm run typings`

Start the webpack-dev-server:

`npm run debug`

Build the project:

`npm run build`

## Run electron in dev mode
```
npm start
NODE_ENV=development electron .
```

## Note for electron
The following npm scripts do not works:

* electron-main-dev
* electron-renderer-dev
