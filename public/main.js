// determine elevators amount
let elevatorsAmount = 3

// determine desired cycle loop
let tripCycleAmount = 100

// get the canvas element where the elevator simulation will be drawn
const canvas = document.getElementById('elevatorCanvas');

// get the 2D rendering context for drawing on the canvas
const ctx = canvas.getContext('2d');

// initiate ElevatorUseCase instance
let useCase = new ElevatorUseCase(canvas, ctx)

// spawn Elevator intances
useCase.spawnElevatorInstances(elevatorsAmount)

// initiate the layout of elevators
useCase.drawElevators()

// intiate the start time of the animation
useCase.updateDeliverCount()

// run the elevators animation
useCase.run(tripCycleAmount)