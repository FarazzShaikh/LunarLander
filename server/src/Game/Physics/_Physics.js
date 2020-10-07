// Parent class of all physics classes
export default class Physics {
    // Assert Abstract Class
    constructor() {
        if (this.constructor == Physics) {
            throw new Error("Physics is an Abstract classes. Abstract classes can't be instantiated.");
        }
    }

    /**
     * Calculates the force to apply.
     */
    calculateForce() {
        throw new Error("Abstract Method has no implementation");
    }

    /**
     * Calculates the Torque to apply
     */
    calculateTorque() {
        throw new Error("Abstract Method has no implementation");
    }

}