export class Vec2D {
    constructor(x, y) {
        this.x = x
        this.y = y
    }

    add(vec) {
        this.x += vec.x
        this.y += vec.y
    }

    sub(vec) {
        this.x -= vec.x
        this.y -= vec.y
    }

    
}
