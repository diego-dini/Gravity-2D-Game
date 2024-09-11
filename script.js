const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const settings = {
	scale: 8,
	screen: { x: 160, y: 90 }
};

let lastTime = 0;
let targetFPS = 0;
const framesPerUpdate = 1; // Defina a quantidade de frames entre cada atualização do jogo

let frameCount = 0;

const mousePos = { x: 0, y: 0 };
let mousePressed = false

let map = []

setup()

function setup() {

	canvas.addEventListener("mousedown", (event) => {
		mousePressed = true
	})

	canvas.addEventListener("mouseup", (event) => {
		mousePressed = false
	})

	document.addEventListener('keydown', (event) => {
		console.log(targetFPS)
		switch (event.key) {
			case "+":
				targetFPS += 2
				if (targetFPS > 60) {
					targetFPS = 60
				}
				break;
			case "-":
				targetFPS -= 2
				if (targetFPS < 0) {
					targetFPS = 0
				}
				break;
			case "0":
				targetFPS = 1
				break;
			case "1":
				targetFPS = 60
				break;
		}
	})



	canvas.addEventListener("mousemove", (event) => {
		const rect = canvas.getBoundingClientRect();
		mousePos.x = Math.floor((event.clientX - rect.left) / settings.scale);
		mousePos.y = Math.floor((event.clientY - rect.top) / settings.scale);
	})

	canvas.width = settings.scale * settings.screen.x;
	canvas.height = settings.scale * settings.screen.y;


	for (let x = 0; x < settings.screen.x + 1; x++) {
		map.push([])
		for (let y = 0; y < settings.screen.y + 1; y++) {
			if (x == 0 || y == 0 || x == settings.screen.x || y == settings.screen.y) {
				map[x].push(99)
			} else {
				map[x].push(0)
			}

		}
	}

	gameLoop()
}

function gameLoop(timestamp) {
	const deltaTime = timestamp - lastTime;

	if (deltaTime > 1000 / targetFPS) {
		handleInput();
		frameCount++;
		if (frameCount >= framesPerUpdate) {
			update();
			frameCount = 0;
		}
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		render();
		lastTime = timestamp;
	}

	requestAnimationFrame(gameLoop);
}

function handleInput() {

	if (mousePressed == true) map[mousePos.x][mousePos.y] = 1;
}

function update() {
	let mapCopy = map.map(row => row.slice());
	for (let x = 1; x < settings.screen.x; x++) {
		for (let y = 1; y < settings.screen.y; y++) {
			let neightboors = 0
			neightboors += map[x - 1][y - 1] + neightboors + map[x][y - 1] + neightboors + map[x + 1][y - 1]
			neightboors += map[x - 1][y] + neightboors + neightboors + map[x + 1][y]
			neightboors += map[x - 1][y + 1] + neightboors + map[x][y + 1] + neightboors + map[x + 1][y + 1]
			switch (map[x][y]) {
				case 0:
					if (neightboors == 3) mapCopy[x][y] = 1
				case 1:
					if (neightboors < 2 || neightboors > 3) mapCopy[x][y] = 0
					if (neightboors == 2 || neightboors == 3) mapCopy[x][y] = 1
					break;
			}
		}
	}
	map = mapCopy;
}

function render() {
	for (let x = 1; x < settings.screen.x; x++) {
		for (let y = 1; y < settings.screen.y; y++) {
			if (map[x][y] == 1) {
				ctx.fillStyle = `white`;
			} else {
				ctx.fillStyle = `black`;
			}
			ctx.fillRect(x * settings.scale, y * settings.scale, settings.scale, settings.scale); // Corrigido os parâmetros do fillRect
		}
	}
}
