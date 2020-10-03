# Lunar Lander
A Remake of Atari's Lunar Lander, but in the Browser.
## Notable Files
### `package.json`
This file contains information about our project like its name, version number and all its dependancies and dev-dependancies.
### `webpack.config.js`
This file contains configurtions for webpack. Webpack is a bundler that packages our code contained in multiple files into one file.
In our case Webpack is configures to bundle html, css and JS files in `/client/src` into `/client/dist`. `index.html` then reads from the bundle and not the source. It also bundles `/server/src` into `/server/dist` and the `npm run dev:server` command runs the bundle. Hence, if changes appear to not take effect, make sure to run `npm run build` to build the bundles again. _(See Bellow for more information on npm commands.)_

## Notable Folders
### `/server/`
This contains all the code related to our server. The webpack bundle is put in `/server/dist` and the main code must be put in `/server/src/`. `/server/server.js` is our [Express.js](https://expressjs.com/) server to serve to our clients. Use `/server/src/main.js` for Socket.io code.
### `/client/`
This contains all the client side code. The Client only renders, no calculations are done on the client side. `/client/dist` and `/client/src` are used the same as for the server. Use `/client/src/main.js` for Socket.io code. 
### `/shared/`
This contains one ## Notable Foldersfile `/shared/Consts.js`, used as a place to store constants used for Socket.io events and broadcasts. Use to store any constatnts that might be needed in both `/client/` and `/server/`.

## Debug Instructions
### `npm install`
This Command will insatll needed dependancies and dev-dependancies. Your code will not work without running this command. You only need to run this once after cloning.
### `npm run dev:server`
This Command will spin up a nodeJS server with express, The server debig console will be the one that you ran the command in. This will be hosted on [localhost:3000](http://localhost:3000). Hot reloading is disabled, thus, you will have to save, rerun the command and reload the browser tab everytime for it to take effect.
### `npm run dev:hot`
This Command will start a webpack dev server with hot reloading enabled. This will serve only the client side files hence, it is not recomended to use this. This will be hosted on [localhost:8080](http://localhost:8080).
### `npm run build`
This Command will build the webpack bundles for you. You will only need this if you want ot build the bundles without running the server as `npm run dev:xx` will automatically build the bundles for you when you run it.

