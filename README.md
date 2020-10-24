# Lunar Lander
A Remake of Atari's Lunar Lander, but in the Browser.
[Launch Lunar Lander](https://lunar-lander-js.herokuapp.com/)

![Demo](https://github.com/FarazzShaikh/LunarLander/blob/master/Assets/Demo.gif)


## **Controls**
| Action  | Keyboard  | Dualshock4 |
|---|---|---|
| Boost | `Space` | `X` |
| Rotate Left | `Left Arrow Key` | `L1` |
| Rotate Right | `Right Arrow Key` | `R1` |

Althought this gif does not demo it, Lunar Lander is a Relatime Massively multiplayer game.

## **Overview**
### What is Lunar Lander?
Lunar Lander is a single-player arcade game developed by Atari Inc. in the year 1979 for the Atari 6502 Vector Arcade System. Our remake of the classic will include all the features that made it popular but enhance them using modern web technologies, and expand them by adding multiplayer.
### What do we bring to the table?
Our version of Lunar Lander will be a multiplayer game that allows there to be many players that are given the same goals. This results in a “race” to secure the highest scoring landing pads.

### Team Roles
| Name  | HW Username  | Role  | Tasks |
|---|---|---|---|
| [Faraz Shaikh](https://github.com/farazzshaikh)  |   fzs3| Lead Developer  | Implimenting Physics, Overseeing and helping Others in the group. |
|  [Kishan Bapodra](https://github.com/KishanBapodra) |  bkj2 | Game Developer  | Developing game mechinics and intigrating various systems |
|  [Gaurav Nayar](https://github.com/GauravNayar) |  gan4 | Front End Developer  | Developing art assets and UI. |
|  [Mostafa Elsayed](https://github.com/TheChosenSir) |  mme10 | Backend Developer  | Helping impliment serverside code |
### Game Flow
The players take control of a spacecraft and must land it in relatively “flat” regions on the surface of the Moon. The player will use the Space key to apply thrust and the Left and Right Arrow keys to control rotation of the spacecraft. The Player must conserve fuel, minimize time taken and damage to the craft, and land with minimal velocity.
### Look and Feel
Lunar Lander has a very distinct art style employing the use of vector graphics to emulate the style of the Atari 6502 Vector’s Vector Graphics Engine.
Our remake will also employ the same style, staying true to the original's artistic vision.
### Genre
Lunar Lander was the most popular game in the “Lunar Lander” sub-Genre. It is classed as a Vehicle Simulation game.
### Target Audience
The game appeals to fans of classics arcade titles, and players who have a deep nostalgia for old school arcade games.

## **Multiplayer**
### Overview
Our game will use the classic Client-Server archicture for handling multiplayer. This Architecture offers many benifits such as Centralized control and Scalibility as well as offering a single source of Truth for all players. Multiplayer is implimented using WebSockets. WebSockets offer fast two-way communication over on TCP connection. This make it ideal for games where there is data being transmitted from server to client and then back to the server over 60 times per second.
All Calculations are done on the server and the resulting Position and rotation vectors are sent to the clients to update their positions.
### Implimentation
This project uses Socket.io as an abstraction for native WebSockets. This saves time and enables rapid developent, testing and addition of features.
We use two methos of communication:
#### Server Events
These are standalone events broadcast by the server to all players They are used to signal updates to data related to all players at once.
#### Request Events
These are events made by ether the server or the client to request some data from the other. These events are resolved by an _Acknowledgement_ event. These events are used to send specific data to a user for example, the seed for Terrain generation.
### Limitations of Our Implimentation.
Our implimention of multiplayer is highly dependant on the processing capability of our server, as we are limited on the resources on our server, this will limit the Scalability of our game. The game will be tested and optimized to acoomodate the maximum amount of players.

## **Technical Details**
### Movement
The movement of the spacecraft is based on real world physics. The player can control the thruster which propels the spacecraft in the direction of its normal (heading). The player can also control secondary thrusters that change the rotation of the spacecraft thus changing its normal direction. 

The behavior of these thrusters mimic real world phenomena like Inertia and Drag, hence the spacecraft feels heavy as it is accelerated and decelerates due to drag when the thrusters are not engaged. The spacecraft is also affected by gravity, being pulled towards the surface with a constant acceleration.

An interesting result of these different systems interacting at will, is the emergence of a Terminal Velocity, the spacecraft will accelerate due to gravity up until the drag produced by it is equal to the acceleration due to gravity at which point it would have reached its maximum possible velocity in a free fall. Therefore the interaction of various physical phenomena results in interesting emergent behavior with no processing overhead.

### Terrain
The terrain is procedurally generated by using an implementation of Perlin noise. This lets us generate coherent but random looking terrain that suits our purpose of emulating the surface of the Moon.

The moon’s characteristic creators are also generated procedurally by sampling a Sine wave, performing some math and multiplying the result with the base perlin noise layer. Multiple layers of Sine waves with deferring frequency and amplitudes simulate large and small craters.

The flat regions are implemented by selecting a random interval from the height-field and “squashing” it’s values to the median height in the interval. The size of the intervals are randomized from a minimum and a maximum value, intervals of smaller sizes yield more points.

The terrain is drawn by using a SVG tag with a custom path generated from the height-field. The starting and ending points are rendered offscreen preventing the edges of the path from showing in the viewport.

### Player
The player is a spacecraft rendered by an IMG tag. This allows us to use css transform properties such as “translate()” and “rotate()” to easily move and rotate the player in the viewport.

###  Collision
Collision checks are performed on every player object every frame. Both player-player collision and player-terrain collision are checked.

Collisions are handled by checking if the bounding boxes of the internal IMG tags that render the player overlaps with another bounding box, if they do overlap the player with the higher Z-index is pushed outside the bounding box. At 60fps this is not noticeable and appears as if the players have simply collided.


