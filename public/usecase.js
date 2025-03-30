class ElevatorUseCase {
    constructor(canvas,ctx) {
        Object.defineProperty(this, "canvas", {
            value: canvas,
            writable: false,
            configurable: false
        })
        Object.defineProperty(this, "ctx", {
            value: ctx,
            writable: false,
            configurable: false
        })
        Object.defineProperty(this, "totalFloors", {
            value: 50,
            writable: false,
            configurable: false
        })
        Object.defineProperty(this, "floorHeight", {
            value: 14,
            writable: false,
            configurable: false
        })
        Object.defineProperty(this, "elevatorHeight", {
            value: 13,
            writable: false,
            configurable: false
        })
        Object.defineProperty(this, "elevatorWidth", {
            value: 10,
            writable: false,
            configurable: false
        })
        this.elevators = []
        this.visited = new Set()
        this.startTime = new Date()
        this.finishTime = null
        this.deliveredCount = 0;
    }

    spawnElevatorInstances(amount) {
        for (let i = 0; i < amount; i++) {
            let elevator = new Elevator(i)
            this.elevators.push(elevator)
        }
    }

    updateDeliverCount(v) {
        if (v !== undefined && v > 0) {
          this.deliveredCount += v;
        }
        document.getElementById("startTime").innerHTML = this.startTime.toLocaleString();

        if (this.finishTime) {
            document.getElementById("finishTime").innerHTML = this.finishTime.toLocaleString();
            document.getElementById("gapTime").innerHTML = Math.ceil((this.finishTime - this.startTime) / 1000)
        }

        document.getElementById("counter").innerHTML = this.deliveredCount;
    }

    animateElevator(idx) {
        let elv = this.getElevatorByIdx(idx)
        if (elv.currentFloor !== elv.targetFloor) {
            elv.modifyCurrentFloorValue();
        }
    
        this.drawElevator(this.elevators.length);
    
        if (elv.currentFloor !== elv.targetFloor) {
            elv.animationId = requestAnimationFrame(() => this.animateElevator(idx));
        } else {
            elv.previousFloor = elv.currentFloor;
            cancelAnimationFrame(elv.animationId);
        }
    }

    getElevatorByIdx(idx) {
        return this.elevators[idx]
    }

    drawElevatorBox(xPos, yPos, wVal, hVal) {
        this.ctx.fillStyle = 'red';
        this.ctx.fillRect(xPos, yPos, wVal, hVal);
    }

    drawElevator() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = 'black';
        for (let i = 0; i < this.totalFloors; i++) {
            const yPosition = this.canvas.height - (i + 1) * this.floorHeight;
            this.ctx.fillText(`Floor ${i+1}`, 10, yPosition + this.floorHeight - 2);
            
            this.ctx.beginPath();
            this.ctx.moveTo(0, yPosition);
            this.ctx.lineTo(this.canvas.width, yPosition);
            this.ctx.stroke();
        
            this.ctx.beginPath();
            this.ctx.moveTo(110, yPosition)
            this.ctx.lineTo(110, yPosition+this.canvas.height)
            this.ctx.stroke();
        }
        
        let gapBetween = 0;
        
        for (let i = 0; i < this.elevators.length; i++) {
            if (i > 0) {
                gapBetween = i * 15;
            }
            const pos = 55 + gapBetween;
            let elv = this.elevators[i]
            this.drawElevatorBox(pos,this.canvas.height - (elv.currentFloor + 1) * this.floorHeight + (this.floorHeight - this.elevatorHeight), this.elevatorWidth, this.elevatorHeight)
            this.ctx.fillText('Waiting', 115, (this.totalFloors - elv.targetFloor - 0.25) * this.floorHeight);
            this.ctx.stroke()
        }
    }

    drawElevators() {
        for (let i = 0; i < this.elevators.length; i++) {
            this.drawElevator(this.elevators.length)
        }
    }

    async delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async go(idx, man) {
        return new Promise(async (resolve) => {
            let elv = this.getElevatorByIdx(idx);
            elv.targetFloor = man.from - 1;
            while (this.visited.has(man.from)) {
                await this.delay(100)
            }
            this.visited.add(man.from)
            this.animateElevator(idx)
            if (man.to) {
                await this.delay(3500)
                elv.targetFloor = man.to - 1
                while(this.visited.has(man.to)) {
                    await this.delay(100)
                }
                this.visited.add(man.to)
                this.animateElevator(idx, true)
                await this.delay(3500)
                this.visited.delete(man.from)
                this.visited.delete(man.to)
                await this.delay(300)
                this.updateDeliverCount(1)
            } else {
                this.visited.delete(man.from)
            }
            resolve()
        })
    }

    runElevators(elvIdx, mans) {
        return new Promise(async (resolve) => {
            for(let i = 0; i < mans.length; i++) {
                await this.go(elvIdx, mans[i])
            }
            resolve()
        })
    }

    async run(loopCount) {
        const promises = [];

        let elvIdx = 0
        
        for (let i = 0; i < loopCount; i++) {
            this.getElevatorByIdx(elvIdx).setMan(i)
            if (elvIdx == this.elevators.length - 1) {
                elvIdx = 0
            } else {
                elvIdx += 1
            }
        }
      
        for (let i = 0; i < this.elevators.length; i++) {
            this.getElevatorByIdx(i).setElvToFirstFloor()
            promises.push(this.runElevators(i, this.getElevatorByIdx(i).users));
        }
      
        return Promise.all(promises).then(() => {
            this.finishTime = new Date();
            this.updateDeliverCount();
            console.log("All elevators finished!");
        });
    }

}
