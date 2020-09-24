import Player from './App/Player'
import Engine from './Engine/Engine'
import Renderer, { Layer } from './Engine/Renderer'

import { Boost } from './Engine/Physics/Boost'
import { Gravity } from './Engine/Physics/Gravity'

import { Vec2D } from './utils/Vectors'
import Terrain from './App/Terrain'
import { Collision } from './Engine/Physics/Collision'
import { Drag } from './Engine/Physics/Drag'

let renderer, engine

export default function main() {
    // Init renderer
    renderer = new Renderer({
        layers: [
            // Layer for the terrrain
            new Layer({name: 'Background', backgroundColor: 'black'}),
            //layer for Players
            new Layer({name: 'Sprite'}),
        ]
    })
    //Get layers as divs
    const nodes = renderer.getDoccumentNodes()
    //add Layers to the page
    nodes.forEach(n => document.body.append(n))
    
    //Init engine
    engine = new Engine({renderer: renderer})
    // Register terrain
    engine.registerTerrain(
        new Terrain()
    )
    // Register player
    engine.registerPlayer(
        new Player({
            name: 'Test1',
            size: {w: 25, h: 25},
            position: new Vec2D(100, 100),
            // Physics Modifiers
            modifiers: {
                gravity: new Gravity(),
                boost: new Boost(),
                drag: new Drag(),
                collision: new Collision({terrain: engine.terrain})
            }
        })
    )
    
    // Iniitial call to render
    render()
}

const isGameOver = false
function gameOver() {
    console.log('gameOver')
}

// Render called every frame
function render() {
    if(!isGameOver) {
        requestAnimationFrame(render)

        engine.update()
    } else {
        gameOver()
    }
    
}
