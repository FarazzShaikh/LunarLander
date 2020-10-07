import Drag from "./Physics/Drag"

// Class representing a player.
export class Player {
    constructor({socket, position, rotation}) {
        // Socket associated with the player
        this.socket = socket
        // Players position vector in 2D space
        this.position = position || {x: 0, y: 0}
        // Players rotation in radians.
        this.rotation = rotation || Math.PI * 2


        // Mass of the player
        this.mass = 1
        // Current velocity applied to player
        this.velocity = {x: 0, y: 0}
        // Current torque applied to player
        this.torque = 0
        // Current force being applied
        this.force = {x: 0, y: 0}
        this.physics = {
            drag: new Drag()
        }
    }

    /**
     * Calculate the Position of the Player
     * @param {Number} dt 
     */
    calcPosition(dt) {
        const prevPosition = {...this.position}

        this.position.x += this.velocity.x * dt * 100;
        this.position.y += this.velocity.y * dt * 100;

        return (this.position.x !== prevPosition.x) || (this.position.y !== prevPosition.y)
    }

    /**
     * Calculate the rotatioon of the player
     * @param {Number} dt 
     */
    calcRotation(dt) {
        const prevRotation = this.rotation
        const acc = this.torque / this.mass
        this.rotation += acc * dt

        return this.rotation !== prevRotation
    }

    /**
     * Apply a force to the player
     * @param {Object} force 
     */
    applyForce(force, isAlongNormal) {
        const f = {
            x: isAlongNormal ? force.x * -Math.sin(this.rotation): force.x, 
            y: isAlongNormal ? force.y * Math.cos(this.rotation): force.y
        }
        this.force.x += f.x
        this.force.y += f.y
    }

    /**
     * Apply a torque to the player
     * @param {Number} rot 
     */
    applyTorque(torque) {
        return this.torque += torque
    }

     /**
     * Calculate the velocity of the player
     */
    calcVelocity(dt) {
        const acc = {
            x: -this.force.x / this.mass,
            y: -this.force.y / this.mass
        }

        this.velocity.x += acc.x * dt
        this.velocity.y += acc.y * dt

        this.force = {x: 0, y: 0}
    }

    calcPhysics(dt) {
        Object.values(this.physics).forEach(p => {
            const f = p.calculateForce(dt, this.velocity)
            const t = p.calculateTorque(dt, this.torque)
            this.force.x += f.x
            this.force.y += f.y
            this.torque += t
        })
    }

    /**
     * Returns serialized form of Player.
     * Easy to transmit over Socket.emit().
     * @returns  Serialized form of Player.
     */
    getSerialized() {
        return {
            id: this.socket.id,
            position: this.position,
            rotation: this.rotation
        }
    }

    /**
     * Runs Every frame to perform physics calculations.
     * @param {Number} dt 
     */
    update(dt) {
        this.calcPhysics(dt)
        this.calcVelocity(dt)
        const didPositionChange = this.calcPosition(dt)
        const didRotationChange = this.calcRotation(dt)

        return didPositionChange || didRotationChange
    }
}