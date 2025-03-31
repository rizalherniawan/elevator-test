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

    /**
     *  create elevator classes based on inserted amount
     *  @param {Number} amount - number to determine the amount of elevator classes that are going to be spawned
     */ 
    spawnElevatorInstances(amount) {
        for (let i = 0; i < amount; i++) {
            let elevator = new Elevator(i)
            this.elevators.push(elevator)
        }
    }

    /**
     * marks the start time and end time of elevator and count amount of elevator trips after delivery
     * @param {Number} v - amount of elevator trips after delivery
     */
    updateDeliverCount(v) {
        // count elevator trip after delivery
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

    /**
     * animate the elevators
     * @param {Number} idx - index of elevators as referenced by the elevators array
     */
    animateElevator(idx) {
        // get elevator from elevators array by index
        let elv = this.getElevatorByIdx(idx)
        if (elv.currentFloor !== elv.targetFloor) {

            // modify the value of current floor property that belongs to elevator class
            elv.modifyCurrentFloorValue();
        }
    
        this.drawElevator(this.elevators.length);
    
        if (elv.currentFloor !== elv.targetFloor) {

            // enable elevators to be animated and mark it as animationId which is the property of elevator class
            elv.animationId = requestAnimationFrame(() => this.animateElevator(idx));
        } else {
            elv.previousFloor = elv.currentFloor;

            // stop the animation frame
            cancelAnimationFrame(elv.animationId);
        }
    }

    /**
     * access elevator from elevators array by index 
     * @param {Number} idx - index of elevators as referenced by the elevators array
     * @returns {Elevator} - elevator class
     */
    getElevatorByIdx(idx) {
        return this.elevators[idx]
    }

    /**
     * draw elevator box
     * @param {Number} xPos - x position
     * @param {Number} yPos - y position
     * @param {Number} wVal - elevator width
     * @param {Number} hVal - elevator height
     */
    drawElevatorBox(xPos, yPos, wVal, hVal) {
        this.ctx.fillStyle = 'red';
        this.ctx.fillRect(xPos, yPos, wVal, hVal);
    }

    /**
     * draw elevator
     */
    drawElevator() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = 'black';

        // draw layout of floors
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
        
        // draw elevators box 
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

    /**
     * draw elevators in bulk based on the amount of elevator instances
     */
    drawElevators() {
        for (let i = 0; i < this.elevators.length; i++) {
            this.drawElevator(this.elevators.length)
        }
    }

    /**
     * delay operation
     * @param {Number} ms - desired delayed time
     * @returns {Promise} - a promise that holds delayed time
     */
    async delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * move the elevator
     * @param {Number} idx - elevator index
     * @param {Object} man - man object inside mans array in data.js file
     * @returns {Promise} - a promise to marks elevator if certain elevator successfully deliver people
     */
    async go(idx, man) {
        return new Promise(async (resolve) => {
            let elv = this.getElevatorByIdx(idx);
            elv.targetFloor = man.from - 1;

            // check whether one of the elevator already reach certain floor with "from" property
            while (this.visited.has(man.from)) {

                // delay operation
                await this.delay(100)
            }

            // add floor destination or "from" propery to queue
            this.visited.add(man.from)

            // animate elevator
            this.animateElevator(idx)
            if (man.to) {
                await this.delay(3500)
                elv.targetFloor = man.to - 1

                // check whether one of the elevator already reach certain floor with "to" property
                while(this.visited.has(man.to)) {
                    await this.delay(100)
                }

                // add floor destination or "to" propery to queue
                this.visited.add(man.to)

                this.animateElevator(idx, true)
                await this.delay(3500)

                // delete "from property" from queue 
                this.visited.delete(man.from)

                // delete "to property" from queue 
                this.visited.delete(man.to)
                await this.delay(300)

                // count 
                this.updateDeliverCount(1)
            } else {
                this.visited.delete(man.from)
            }
            resolve()
        })
    }

    /**
     * run elevator in sequence according to the order of its destinations floor
     * @param {Number} elvIdx - index of elevator
     * @param {Array<Object>} mans - array of object that stores list destinations floor of certain elevator
     * @returns {Promise}
     */
    runElevators(elvIdx, mans) {
        return new Promise(async (resolve) => {
            for(let i = 0; i < mans.length; i++) {
                await this.go(elvIdx, mans[i])
            }
            resolve()
        })
    }

    /**
     * run multiple elevators in asynchronous  
     * @param {Number} loopCount - number of desired loop
     * @returns {Promise}
     */
    async run(loopCount) {
        const promises = [];

        let elvIdx = 0
        
        // set list of floor destinations to each elevator class inside elevator array
        for (let i = 0; i < loopCount; i++) {
            this.getElevatorByIdx(elvIdx).setMan(i)
            if (elvIdx == this.elevators.length - 1) {
                elvIdx = 0
            } else {
                elvIdx += 1
            }
        }
      
        // assign list of floor destinations to each elevator instance
        for (let i = 0; i < this.elevators.length; i++) {
            this.getElevatorByIdx(i).setElvToFirstFloor()
            promises.push(this.runElevators(i, this.getElevatorByIdx(i).users));
        }
      
        // enable elevators to run in asynchronous
        return Promise.all(promises).then(() => {
            this.finishTime = new Date();
            this.updateDeliverCount();
            console.log("All elevators finished!");
        });
    }

}
