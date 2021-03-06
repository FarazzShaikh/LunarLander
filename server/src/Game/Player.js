import { DEFAULTS, REQUEST } from '../../../shared/Consts';
import Drag from './Physics/Drag';
import Gravity from './Physics/Gravity';
import Wind from './Physics/Wind';

// Class representing a player.
export class Player {
	constructor({
		socket,
		position,
		rotation,
		velocity,
		resources,
		name,
		uuid,
		value,
		health,
		setDamage,
	}) {
		// Socket associated with the player
		this.socket = socket;

		// Players position vector in 2D space
		this.position = position || { x: 0, y: 0 };
		// Players rotation in radians.
		this.rotation = rotation || 0;

		// Mass of the player
		this.mass = 1;
		// Current velocity applied to player
		this.velocity = velocity || { x: 0, y: 0 };
		// Current torque applied to player
		this.torque = 0;
		// Current force being applied
		this.force = { x: 0, y: 0 };
		this.physics = {
			drag: new Drag(),
			wind: new Wind(),
			gravity: new Gravity(),
		};
		//Player fuel value (starts at 100)
		this.resources = resources;
		this.health = health;
		this.name = name;
		this.uuid = uuid;
		this.value = value;
		this.fire = 0;

		this.setDamage = setDamage;
	}

	setFire() {
		this.fire += 1;
	}

	clearFire() {
		this.fire = 0;
	}

	damage(val) {
		if (this.health > 0) {
			this.health -= val;
			if (this.health <= 0) {
				this.socket.emit(REQUEST.REQUEST_DELETE_PLAYER.req);
				return;
			}

			this.setDamage(this.uuid, 'HighScores', {
				resources: {
					fuel: Math.floor(this.resources.fuel),
					W: Math.floor(this.resources.W),
					scrap: Math.floor(this.resources.scrap),
				},
				health: Math.floor(this.health),
				value: Math.floor(
					100 * this.resources.fuel + this.resources.W + 10 * this.resources.scrap
				),
			}).catch((e) => console.error(e));
		} else {
			this.socket.emit(REQUEST.REQUEST_DELETE_PLAYER.req);
		}
	}

	/**
	 * Calculate the Position of the Player
	 * @param {Number} dt
	 */
	calcPosition(dt) {
		const prevPosition = { ...this.position };

		this.position.x += this.velocity.x * dt * 100;
		this.position.y += this.velocity.y * dt * 100;

		return (
			this.position.x !== prevPosition.x || this.position.y !== prevPosition.y
		);
	}

	/**
	 * Calculate the rotatioon of the player
	 * @param {Number} dt
	 */
	calcRotation(dt) {
		const prevRotation = this.rotation;
		const acc = this.torque / this.mass;
		this.rotation += acc * dt;

		return this.rotation !== prevRotation;
	}

	/**
	 * Apply a force to the player only if there is fuel.
	 * @param {Object} force
	 */
	applyForce(force, isAlongNormal, dt) {
		if (this.resources.fuel > 0) {
			this.resources.fuel -= DEFAULTS.FUEL.f;
			const f = {
				x: isAlongNormal ? force.x * -Math.sin(this.rotation) : force.x,
				y: isAlongNormal ? force.y * Math.cos(this.rotation) : force.y,
			};
			this.force.x += f.x;
			this.force.y += f.y;

			this.overrideTerrainCollision = true;
			this.movementState = null;

			this.calcVelocity(dt);
		}
	}

	/**
	 * Apply a torque to the player
	 * @param {Number} rot
	 */
	applyTorque(torque) {
		if (this.resources.fuel > 0) {
			this.resources.fuel -= DEFAULTS.FUEL.ft;
			return (this.torque += torque);
		}
	}

	/**
	 * Calculate the velocity of the player
	 */
	calcVelocity(dt) {
		const acc = {
			x: -this.force.x / this.mass,
			y: -this.force.y / this.mass,
		};

		this.velocity.x += acc.x * dt;
		this.velocity.y += acc.y * dt;

		this.force = { x: 0, y: 0 };
	}

	calcPhysics(dt) {
		Object.values(this.physics).forEach((p) => {
			const f = p.calculateForce(dt, this.velocity);
			const t = p.calculateTorque(dt, this.torque);
			this.force.x += f.x;
			this.force.y += f.y;
			this.torque += t;
		});
	}

	setMovementState(state) {
		if (this.resources.fuel > 0) {
			this.movementState = state;
		} else {
			this.movementState = null;
		}
	}

	/**
	 * Returns serialized form of Player.
	 * Easy to transmit over Socket.emit().
	 * @returns  Serialized form of Player.
	 */
	getSerialized() {
		return {
			name: this.name,
			id: this.socket.id,
			position: this.position,
			rotation: this.rotation,
			velocity: this.velocity,
			movementState: this.movementState,
			resources: this.resources,
			health: this.health,
			value: this.value,
			fire: this.fire,
		};
	}

	/**
	 * Runs Every frame to perform physics calculations.
	 * @param {Number} dt
	 */
	update(dt, collision) {
		this.calcPhysics(dt);
		this.calcVelocity(dt);

		if (collision(this) && !this.overrideTerrainCollision) {
			this.velocity = {
				x: 0,
				y: 0,
			};
			this.movementState = null;
			this.torque = 0;
		}

		this.overrideTerrainCollision = false;
		const didPositionChange = this.calcPosition(dt);
		const didRotationChange = this.calcRotation(dt);

		return didPositionChange || didRotationChange;
	}
}
