# Lunar Lander

*A Sci-Fi Survival Shooter, made entirely using the DOM and JavaScript*

## Index
### Developement
- [Requirments](#Requirments)
- [Notable Files](#Notable-Files)
- [Notable Folders](#Notable-Folders)
- [Debug Instructions](#Debug-Instructions)
- [Required Envornment Variables](Required-Envornment-Variables)
### Wiki
- [Simplified Working](#Simplified-Working)
- [Technical Details - Client](#Technical-Details---Client)
- [Technical Details – Server](#Technical-Details-–-Server)

## Requirments:
### FaunaDB
A [FaunaDB](https://fauna.com/) account as our database.

### Google Firebase
A [Firebase](https://firebase.google.com/) account to host the Crashed Ship generation fucntion. A [Blaze Plan](https://firebase.google.com/pricing) account is required to use Scheduled Functions.

Alternatively, you can transplant the Crashed Ship generation fucntion into the server at the cost of a larger memmory footprint.


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

### `npm run dev`

This Command will spin up a nodeJS server with express, The server debig console will be the one that you ran the command in. This will be hosted on [localhost:3000](http://localhost:3000). Hot reloading is disabled, thus, you will have to save, rerun the command and reload the browser tab everytime for it to take effect.

### `npm run build`

This Command will build the webpack bundles for you. You will only need this if you want ot build the bundles without running the server as `npm run dev:xx` will automatically build the bundles for you when you run it.

## Required Envornment Variables

Envornment Variables must be put in a file simply called `.env`. **There is no extention on this file**

### `NODE_ENV`
This tells the server what mode to launch the game in.
- `NODE_ENV=development` launches the game in development mode with hot reloading turned on.
-  `NODE_ENV=production` launches the game in production mode with hot reloading turned off.

### `PORT`
This is the default port to serve the game on in development.

### `DB_KEY`
The key for a FaunaDB Database where the collections:
- `HighScores`
- `KilledPlayers`
- `Ships`

are availabe.


## Simplified Working
The game is served using a basic ExpressJS-NodeJS server. The server serves the client folder on the root URL. We also use Webpack to bundle our application. This creates a smaller file size, resulting in faster load times and also minifies the code, making it hard to tamper with on the fly.

Webpack creates two bundles:
- The Entry point and title screen
- The Main application
  
we use this to take advantage of code splitting and Dynamic Imports, that is, we do not load the entire application at once. We first load the Title Screen then we load the game when the user enters a valid username and is ready to play. This makes the initial load of the game very fast. Webpack also allows us to use NPM packages with elegant imports in the client.

Our index.html loads our Title screen bundle, this is where the user is prompted to enter a username. We then check if this username exists in our database. If not, then the client makes a POST request to the server, and the server added the new user to the database. Once this transaction is complete the user connects to the server’s socket and begins the game.

The client’s requests to access the database are routed through the server. This means that we can perform server-side validation to anything the user might want to put into the database. This adds a layer of security. The database we use is called FaunaDB. FaunaDB is a database-as-a-service and uses a NoSQL Document Database. This type of database stores data in the form of collections of documents where each document is a JavaScript object. This lets us upload and retrieve data as simple JSON objects that parse into neat JavaScript object arrays. We use the database to store Player Data and Crashed Ships data.

Our game does not use user signup and login. Instead, we use a onetime guest “login” with a unique username. This reduces complexity and lends itself to a sort “pick up and play” style.

We also use Firebase Cloud Functions to generate new Crashed Ships every 30 minutes. This scheduled function is completely independent from the game and pushes its calculated list of objects directly to the database. We do this to reduce the uptime of our server. Our server can go to sleep if there is no activity on it but scheduling a function on our server keeps it active all the time. Using a cloud function also reduced the memory footprint of our server application as the amount of memory available to us on our hosting platform is limited. 

The necessary data for Crashed Ships and other resources is set though HTTP GET requests from the client. Other smaller data is sent though WebSockets using Socket.IO.
We use WebSockets to have fast, bi-directional communication between the client and server.
The server emits a “SERVER-TICK” every 30th of a second. This event is sent to all clients at the same time. The client listens to this event and then runs the game loop each tick. This is the game’s “heartbeat.” When the Player dies, their client is disconnected from the server, halting the game loop and prompting a refresh to restarts the game.

This game also used the browsers SessionStroage to keep track of the current user, in the case that the user refreshes the page before they die.

The user can play as long as they can and amass as many resources as they would like.

## Technical Details - Client
### Node
The most basic unit of the game is a Node. The class is a basic form of each game object. Every other game object class inherits from the Node class. It contains basic implementations of methods used to:
```js
Node.transform		    // Move the Node around.
Node.update			    // Update it on Screen.
Node._isInViewport	    // Check if the node is in the view port.

Additionally, it also holds basic properties like:

Node.position			// Position of the node in world space.
Node.rotation			// Rotation of the node in world space.
Node.scale			    // Scale of the object.
```
### Layer
The Layer class is a collection of Nodes, each layer has its own z-index that defiles is position in terms of being “closest to the camera.” Layers allow us to organize our Nodes into various groups. Layers also allow us to create layered effects using post processing layers at little to no processing overhead. Separating out various layers helps keep code discrete and simple.

### Renderer
The Renderer class is the “Middle-Man” between the Engine and the DOM. It handles adding and removing nodes, as well is more complex functions like:
```js
Renderer.scatterNode	// Randomly place a number of Nodes on a Layer.
Renderer.update		    // Main Update Function.
```
The Renderer’s main update function calls the update function in each registered node, that is a node add using addNode to the game.

### Engine
The engine is the “meat and potatoes” of the game. It has numerous functions that bridges various objects in the game. The engines update function calls the update function of the renderer on every game tick. This makes it the heart of the game.

### Controller
The Controller class is responsible for handling user input. There are two input methods that out game supports:
- Keyboard – Keyboard input is simply listed for using a key-down event listener. The code property of the event object is then used as key for the input map.
- DualShock4 (PS4) Controller – Controller input is handled by sampling the buttons property of the page’s gamepad object, then looking for pressed buttons and then mapping the button code to a key in the input map.

### Terrain
The Most important aspect of this game is its Terrain. The terrain not only serves as the backdrop but aids to the feeling of vastness of the surface of the moon.

The Terrain procedurally generated using Perlin Noise. Perlin Noise is a type of coherent gradient noise first introduced by Ken Perlin in 1983 (Perlin, 2007). It is widely used in Computer Graphics to generate infinite 2D or 3D terrain.

Here, we use html: 
```html
<svg>
	<polygon>
</svg>
```
tags from the W3 Svg Namespace. We can then define points using:
```html
const point = svg.createSVGPoint()
```
these points will then be set to the appropriate x and y coordinates where the x component is a value ranging from 0-screenWidth and the y component is the value of Perlin Noise sampled at a given x coordinate. These points are then appended to the polygon’s point list, which then creates a path along these points on the screen.

The path list is updated each frame as the x-coordinates are offset by the position of the player, this creates a rolling infinite terrain effect with a minimal memory footprint. The side effect of this is that we must sample the Perlin Noise algorithm screenWidth number of times, on each frame, this can be reduced down to only be calculated when there is a change in the offset, that is, only when the player is actually moving.

## Technical Details – Server
### Game
The game class is the “Engine” of the server. The class has properties like:
```js
Game.players			// Players currently in the game.
Game.terrainSeed		// Seed for consistent terrain generation across clients.
Game.dt			        // Delta time; Time between consecutive ticks.
```
This class also acts similar to the Client’s engine, bridging various classes in the server.

### Physics
Lunar Lander at its core is a physics-based shooter. We have attempted to simulate real life physics like velocity, inertia and gravity. This gives the flying mechanics a semi-physically accurate feel. 

This is done by applying a force to the player which changes its velocity and In turn its position. All Physics are Force based. This makes it easy to apply a formula to calculate a specific force for a specific physical phenomenon. All physics are calculated entirely on the server.

### Collision
This game supports terrain-player collision. We have achieved this by simply sampling the Perlin Noise value at the x-position of the player. This means that we do not have to calculate or store the point list on the server. As there can be an infinite number of players, it is not feasible to store a point list with all possible x-values. This method lets us calculate the point height of the terrain at the specific location of the player. Once a collision is detected, all player velocity is canceled.

### Database
The server also contains functions to access the database:
```js
DB.POST			    // Add to the database.
DB.GET				// Retrieve from the database
```
FaunaDB offers two ways to query its data
- GraphQL
- FQL
  
We use FQL, FaunaDB’s own query language. They also offer a NPM package that offers a Functional JavaScript based driver which compiles to FQL behind the scenes.
