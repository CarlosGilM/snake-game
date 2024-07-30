const canvas = document.querySelector("canvas")
const ctx = canvas.getContext("2d")
const audio = new Audio('../assets/audio.mp3')
const score = document.querySelector(".score--value")
const finalScore = document.querySelector(".final-score > span")
const menu = document.querySelector(".menu-screen")
const buttonPlay = document.querySelector(".btn-play")

const sizeSqr = 30
let snake = [{ x: 150, y: 270 }, { x: 180, y: 270 }]

let direction, loopId


const incrementScore = () => {
	score.innerText = +score.innerText + 10
}
const randomNumber = (min, max) => {
	return Math.round(Math.random() * (max - min) + min)
}
const randomPosition = () => {
	const number = randomNumber(0, canvas.width - sizeSqr)
	return Math.round(number / 30) * 30
}

const randomColor = () => {
	const red = randomNumber(0, 255)
	const green = randomNumber(0, 255)
	const blue = randomNumber(0, 255)
	return `rgb(${red}, ${green}, ${blue})`
}

const food = {
	x: randomPosition(),
	y: randomPosition(),
	color: randomColor()
}

const drawFood = () => {
	const { x, y, color } = food

	ctx.shadowColor = color
	ctx.shadowBlur = 6
	ctx.fillStyle = color
	ctx.fillRect(x, y, sizeSqr, sizeSqr)
	ctx.shadowBlur = 0
}

const drawSnake = () => {
	ctx.fillStyle = "#ddd"

	snake.forEach((position, index) => {
		if (index == snake.length - 1) {
			ctx.fillStyle = "white"
		}
		ctx.fillRect(position.x, position.y, sizeSqr, sizeSqr)
	})
}

const drawGrid = () => {
	ctx.lineWidth = 1
	ctx.strokeStyle = "#191919"

	for (let i = 30; i < canvas.width; i += 30) {
		ctx.beginPath();
		ctx.lineTo(i, 0)
		ctx.lineTo(i, 600)
		ctx.stroke();

		ctx.beginPath();
		ctx.lineTo(0, i)
		ctx.lineTo(600, i)
		ctx.stroke();
	}

}

const moveSnake = () => {
	if (!direction) return
	const head = snake[snake.length - 1] //Recupera a cabecaa da cobra
	switch (direction) {
		case "right":
			snake.push({ x: head.x + sizeSqr, y: head.y })
			break;
		case "left":
			snake.push({ x: head.x - sizeSqr, y: head.y })
			break;
		case "down":
			snake.push({ x: head.x, y: head.y + sizeSqr })
			break;
		case "up":
			snake.push({ x: head.x, y: head.y - sizeSqr })
			break;
	}
	snake.shift() //Remove o primeiro elemento do array(Rabo da cobra)
}

const checkEat = () => {
	const head = snake[snake.length - 1]
	if (head.x == food.x && head.y == food.y) {
		incrementScore()
		snake.push(head)
		audio.play()
		let x = randomPosition()
		let y = randomPosition()

		while (snake.find((position) => position.x == x && position.y == y)) {
			x = randomPosition()
			y = randomPosition()
		}

		food.x = x
		food.y = y
		food.color = randomColor()
	}
}

const checkColision = () => {
	const head = snake[snake.length - 1]
	const canvasLimit = canvas.width - sizeSqr
	const neckIndex = snake.length - 2 //Tira a posicao da Cabeca para verificar se a cabeca bate no corpo

	const wallColision = (head.x < 0 || head.x > canvasLimit || head.y < 0 || head.y > canvasLimit)

	const selfColision = snake.find((position, index) => {
		return index < neckIndex && position.x == head.x && position.y == head.y
	})

	if (wallColision || selfColision) {
		gameOver()
	}
}

const gameOver = () => {
	direction = undefined
	menu.style.display = "flex"
	finalScore.innerText = score.innerText
	canvas.style.filter = "blur(4px)"
}


const gameLoop = () => {
	clearInterval(loopId)
	ctx.clearRect(0, 0, 600, 600)
	drawGrid()
	drawFood()
	moveSnake()
	drawSnake()
	checkEat()
	checkColision()

	loopId = setTimeout(() => {
		gameLoop()
	}, 200);
}

gameLoop();

document.addEventListener("keydown", ({ key }) => {
	if ((key == "ArrowUp" || key == "w") && direction != "down") {
		direction = "up"
	}
	if ((key == "ArrowDown" || key == "s") && direction != "up") {
		direction = "down"
	}
	if ((key == "ArrowLeft" || key == "a") && direction != "right") {
		direction = "left"
	}
	if ((key == "ArrowRight" || key == "d") && direction != "left") {
		direction = "right"
	}
})

buttonPlay.addEventListener("click", () => {
	score.innerText = "00"
	menu.style.display = "none"
	canvas.style.filter = "none"
	snake = [{ x: 150, y: 270 }, { x: 180, y: 270 }]
})
