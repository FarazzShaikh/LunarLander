import Player from './Actors/Player'
import Engine from './Engine/Engine'
import Renderer, { Layer } from './Engine/Renderer'

import { Boost } from './Engine/Physics/Boost'
import { Gravity } from './Engine/Physics/Gravity'

import { Vec2D } from './utils/Vectors'
import Terrain from './Actors/Terrain'
import { Collision } from './Engine/Physics/Collision'
import { Drag } from './Engine/Physics/Drag'
import HUD from './HUD/HUD'
import Store from './State/Store'

let renderer, engine

export default function main() {
    const store = new Store()
    // Init renderer
    renderer = new Renderer({
        layers: [
            // Layer for the terrrain
            new Layer({name: 'Background', backgroundColor: 'black'}),
            //layer for Players
            new Layer({name: 'Sprite'}),

            new Layer({name: 'HUD'}),
        ]
    })
    //Get layers as divs
    const nodes = renderer.getDoccumentNodes()
    //add Layers to the page
    nodes.forEach(n => document.body.append(n))
    
    //Init engine
    engine = new Engine({renderer: renderer, state: store})
    engine.registerHUD(
        new HUD()
    )
    engine.startTimer()

    // Register terrain
    engine.registerTerrain(
        new Terrain({
            state: store
        })
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
            },
            state: store
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
