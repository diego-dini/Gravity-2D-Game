import cellType from './cells.js';

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

// FPS tracking variables
let lastTime = 0;
let frameCount = 0;
let fps = 0;


const gameXDim = 65
const gameYDim = 32
const cellSize = 16
let currentCicle = 0
let gameGrid = []

canvas.width = gameXDim * cellSize;
canvas.height = gameYDim * cellSize;

for (let i = 0; i < gameXDim * gameYDim; i++){
	const values = [cellType.Sand, cellType.Air, cellType.Water]
	const randomIndex = Math.floor(Math.random() * values.length);
	gameGrid.push(new values[randomIndex](gameXDim))
}

function update() {
	const newGameGrid = gameGrid.slice()
	for (let i = gameGrid.length-1; i >= 0; i--){
		gameGrid[i].collapse(currentCicle,i,gameGrid,newGameGrid,gameXDim)
	}
	gameGrid = newGameGrid.slice()
	currentCicle ++
}


function draw() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	for (let x = 0; x < gameXDim; x++){
		for (let y = 0; y < gameYDim; y++){
			const cell = gameGrid[y*gameXDim+x]
			cell.draw(ctx)
			ctx.fillRect(x*cellSize, y*cellSize, cellSize, cellSize);
		}
	}
}

// Game loop function
function gameLoop(timestamp) {
	if (lastTime) {
		frameCount++;
		if (timestamp - lastTime >= 1000) {
			fps = frameCount;
			frameCount = 0;
			console.log(`FPS: ${fps}`);
			lastTime = timestamp;
		}
		
		if(frameCount % 30 == 0){
			update();
		}
		draw();
	} else {
		lastTime = timestamp;
	}
	requestAnimationFrame(gameLoop);
}
requestAnimationFrame(gameLoop);