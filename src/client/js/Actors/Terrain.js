import { noise as Perlin } from '@chriscourses/perlin-noise'

export default class Terrain {
    constructor({state}) {
        this.state = state
        this.heightBuffer = []

        this.canvas = undefined
        this.bounds = {}

        this.needsUpdate = true
    }

    setContext(context) {
        this.canvas = context
        this.bounds = {
            top: 10E7,
            left: 0,
            right: Number(this.canvas.style.width.split('p')[0]),
            bottom: Number(this.canvas.style.height.split('p')[0]),
            lowest: -1
        }
    }

    genTerrain() {
        for (let x = 0; x < this.bounds.right; x++) {
            const cratorBig = Math.sin(x * 0.009) > 0 ? (Math.sin(x * 0.009) * 1.5) + 0.7 : 1
            const cratorSmall = Math.sin(x * 0.05) > 0 ? (Math.sin(x * 0.05) * 0.2) + 1 : 1

            const noise = (1 * 1 * Perlin(x * 0.01) * 100) + 500

            this.bounds.top = noise < this.bounds.top ? noise : this.bounds.top
            this.bounds.lowest = noise > this.bounds.top ? noise : this.bounds.lowest

            this.heightBuffer.push(noise)

        }
        this.state.setState('seaLevel', this.bounds.lowest)
        return this.heightBuffer;
    }

    drawTerrain(terrain) {
        var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        var polygon = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
        svg.style.width = '100%'
        svg.style.height = '100%'
        polygon.style.zIndex = '100'
        polygon.style.stroke = 'white'
        polygon.style.strokeWidth = '1px'
        polygon.style.zIndex = '100'
        svg.appendChild(polygon);

        terrain[0] = this.bounds.bottom + 10
        terrain[terrain.length - 1] = this.bounds.bottom + 10
        for (let x = 0; x < this.bounds.right; x++) {
            var point = svg.createSVGPoint();
            point.x = x === 0 ? x - 10 : x === this.bounds.right - 1 ? x + 10 : x === 1 ? x - 10 : x === this.bounds.right - 2 ? x + 10 : x;
            point.y = terrain[x];
            polygon.points.appendItem(point); 
        }

        this.canvas.appendChild(svg)
    }

    getValue(x) {
        return this.heightBuffer[x]
    }

}