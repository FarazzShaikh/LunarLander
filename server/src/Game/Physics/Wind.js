import Physics from './_Physics';

export class Wind extends Physics {

    calculateForce(dt) {
        return {
            x : 0.08 * Math.sin(dt*20),
            y : 0
        }    
    } 
    
    calculateTorque(dt) {
        return 0
    }
}

