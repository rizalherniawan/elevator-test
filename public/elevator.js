class Elevator {
    constructor(idx) {
        this.idx = idx
        this.currentFloor = 0
        this.previousFloor = 0
        this.targetFloor = 0
        this.animationId = null
        this.users = []
    }

    modifyCurrentFloorValue() {
        let gap, inLinear
        let isElevatorGoingUp = false
        if (this.currentFloor < this.targetFloor) {
            gap = this.targetFloor - this.currentFloor;
            isElevatorGoingUp = true
            inLinear = parseInt(this.targetFloor / 5)
        } else {
            gap = this.currentFloor - this.targetFloor
            inLinear = parseInt(this.previousFloor / 5)
        }

        if (isElevatorGoingUp) {
            if (gap < 5 || (this.currentFloor === 0 && this.currentFloor <= inLinear)
                || (this.currentFloor > 0 && (this.currentFloor - 5) < inLinear)) {
                this.currentFloor += 0.1
            } else {
                this.currentFloor += 0.2
            }
            if (this.currentFloor > this.targetFloor) this.currentFloor = this.targetFloor 
        } else {
            if (gap < 5 || (inLinear > 0 && this.currentFloor > parseInt(inLinear * 5))) {
                this.currentFloor -= 0.1
            } else {
                this.currentFloor -= 0.2
            }
            if (this.currentFloor < this.targetFloor) this.currentFloor = this.targetFloor
        }
    }

    setMan(mansIdx) {
        if(mansIdx == mans.length) {
            return
        }
        this.users.push(mans[mansIdx])
    }

    setElvToFirstFloor() {
        let firstFloor = {from: 1}
        this.users.push(firstFloor)
    }
}