class Elevator {
    constructor(idx) {
        this.idx = idx
        this.currentFloor = 0
        this.previousFloor = 0
        this.targetFloor = 0
        this.animationId = null
        this.users = []
        this.elvParams = []
    }

    getFloors(idx) {
        if (idx === mans.length) return null;
        return mans[idx];
    }

    modifyCurrentFloorValue() {
        let gap, step
        let inLinear = parseInt(this.targetFloor / 5)
        let isElevatorGoingUp = false
        if (this.currentFloor < this.targetFloor) {
            gap = this.targetFloor - this.currentFloor;
            isElevatorGoingUp = true
        } else if (this.currentFloor > this.targetFloor) {
            gap = this.currentFloor - this.targetFloor
        }

        if(gap < 5 || (this.currentFloor === 0 && this.currentFloor <= inLinear) 
            || (this.currentFloor > 0 && (this.currentFloor - 5) < inLinear) 
            || this.currentFloor > parseInt(inLinear * 5)) {
            step = 0.1
        } else {
            step = 0.2
        }

        if (isElevatorGoingUp) {
            this.currentFloor += step
        } else {
            this.currentFloor -= step
        }
    }

    setMan(mansIdx) {
        if(mansIdx == mans.length) {
            return
        }
        this.users.push(mans[mansIdx])
    }

    setElevatorParams() {
        this.elvParams = arguments;
    }
    
    getElevatorParams(){
        return this.elvParams;
    }
    
    clearElevatorParams() {
        this.elvParams = [];
    }

}