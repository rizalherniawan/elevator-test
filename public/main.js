let elevatorsAmount = 3
let tripCycleAmount = 100
const canvas = document.getElementById('elevatorCanvas');
const ctx = canvas.getContext('2d');
let useCase = new ElevatorUseCase(canvas, ctx)
useCase.spawnElevatorInstances(elevatorsAmount)
useCase.drawElevators()
useCase.updateDeliverCount()
useCase.run(tripCycleAmount)