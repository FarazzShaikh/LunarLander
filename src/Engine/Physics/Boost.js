export class Boost {
    constructor() {
        this.boostStrength = {x: 0, y: 0}
        this.active = false
        this.framerate = 1 / 60

        document.addEventListener("keydown", (e) => {
            if (!e.repeat) {
                switch (e.code) {
                    case 'Space':
                        this.boostStrength.y = 5
                        this.active = true
                        break;
                    case 'ArrowRight':
                        this.boostStrength.x = -1
                        this.boostStrength.y = 0
                        this.active = true
                        break;
                    case 'ArrowLeft':
                        this.boostStrength.x = 1
                        this.boostStrength.y = 0
                        this.active = true
                        break;

                    default:
                        break;
                }
            }



        });
    }

    calculate(dt, position, velocity, mass, bounds) {
        if (this.active) {
            console.log('boost')
            if (velocity.y > -100) {
                velocity.x -= this.boostStrength.x
                velocity.y -= this.boostStrength.y
                position.x += velocity.x * this.framerate * 100;
                position.y += velocity.y * this.framerate * 100;
            }

        }
        this.boostStrength = {x: 0, y: 0}
        this.active = false
    }
}