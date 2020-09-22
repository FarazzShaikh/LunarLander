import { noise as Perlin } from '@chriscourses/perlin-noise'

export default class Terrain {
    constructor(width, height) {
        this.terrain = []
        this.width = width
        this.height = height
    }

    genTerrain() {
        for (let x = 0; x < this.width; x++) {
            let nosie = Perlin(x * 0.01) * 1
            this.terrain.push(nosie)

        }
        return this.terrain;
    }

    getValue(x) {
        return this.terrain[x]
    }

}