const gameBoard = document.querySelector("#gameBoard");
const ctx = gameBoard.getContext("2d");
const scoreText = document.querySelector("#scoreText");
const resetBtn = document.querySelector("#resetBtn");

// Get the game width & height
const gameWidth = gameBoard.width;
const gameHeight = gameBoard.height;

// Get some colors / properties
const boardBackground = "forestgreen";
const paddle1Color = "lightblue";
const paddle2Color = "red";
const paddleBorder = "black";
const ballColor = "yellow";
const ballBorderColor = "black";
const ballRadius = 12.5;
const paddleSpeed = 50; // How far do you want the paddle to move

// Some variables
let intervalID;
let ballSpeed = 1;
let ballX = gameWidth / 2; // Position of the ball
let ballY = gameHeight / 2;

// Direction of the ball on X & Y axis
let ballXDirection = 0;
let ballYDirection = 0;

// Player 1 & 2 scores
let player1Score = 0;
let player2Score = 0;

// Get those 2 paddles
let paddle1 = {
  width: 25,
  height: 100,
  x: 0,
  y: 0,
};

let paddle2 = {
  width: 25,
  height: 100,
  x: gameWidth - 25,
  y: gameHeight - 100,
};

// Add event listener
window.addEventListener("keydown", changeDirection);
resetBtn.addEventListener("click", resetGame);

gameStart();

function gameStart() {
  createBall();
  nextTick();
}

function nextTick() {
  intervalID = setTimeout(() => {
    clearBoard();
    drawPaddles();
    moveBall();
    drawBall(ballX, ballY);
    checkCollision();
    nextTick();
  }, 10);
}

function clearBoard() {
  ctx.fillStyle = boardBackground;
  ctx.fillRect(0, 0, gameWidth, gameHeight);
}

function drawPaddles() {
  ctx.strokeStyle = paddleBorder;

  ctx.fillStyle = paddle1Color;
  ctx.fillRect(paddle1.x, paddle1.y, paddle1.width, paddle1.height);
  ctx.strokeRect(paddle1.x, paddle1.y, paddle1.width, paddle1.height);

  ctx.fillStyle = paddle2Color;
  ctx.fillRect(paddle2.x, paddle2.y, paddle2.width, paddle2.height);
  ctx.strokeRect(paddle2.x, paddle2.y, paddle2.width, paddle2.height);
}

function createBall() {
  ballSpeed = 1;

  if (Math.round(Math.random()) == 1) {
    // Math.round(Math.random() will generate a random number between 0 & 1
    // If the number is 1 we'll move right else left
    ballXDirection = 1;
  } else {
    ballXDirection = -1;
  }

  // Same thing for UP & DOWN
  if (Math.round(Math.random()) == 1) {
    ballYDirection = Math.random() * 1; //more random directions
  } else {
    ballYDirection = Math.random() * -1; //more random directions
  }
  // When we'll create a new ball set in the middle
  ballX = gameWidth / 2;
  ballY = gameHeight / 2;

  // call the draw ball function & pass these parameters
  drawBall(ballX, ballY);
}

function moveBall() {
  // Update the X-coordinate of the ball based on its speed and direction
  ballX += ballSpeed * ballXDirection;

  // Update the Y-coordinate of the ball based on its speed and direction
  ballY += ballSpeed * ballYDirection;
}

function drawBall(ballX, ballY) {
  ctx.fillStyle = ballColor;
  ctx.strokeStyle = ballBorderColor;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(ballX, ballY, ballRadius, 0, 2 * Math.PI);
  ctx.stroke();
  ctx.fill();
}

function checkCollision() {
  if (ballY <= 0 + ballRadius) {
    ballYDirection *= -1;
  }

  if (ballY >= gameHeight - ballRadius) {
    ballYDirection *= -1;
  }

  // If the ball goes out of left boundary
  // player 2 wins
  if (ballX <= 0) {
    player2Score += 1;

    updateScore();
    createBall();

    return;
  }

  // If the ball goes out of right boundary
  // player 1 wins
  if (ballX >= gameWidth) {
    player1Score += 1;

    updateScore();
    createBall();

    return;
  }

  // Detect the collision on the paddles
  // It checks:
  // If left side of the ball has collided with the right side of paddle1
  if (ballX <= paddle1.x + paddle1.width + ballRadius) {
    if (ballY > paddle1.y && ballY < paddle1.y + paddle1.height) {
      ballX = paddle1.x + paddle1.width + ballRadius; // if ball gets stuck

      ballXDirection *= -1;
      ballSpeed += 1;
    }
  }

  // It checks:
  // If the right side of the ball has collided with the left side of paddle2
  if (ballX >= paddle2.x - ballRadius) {
    if (ballY > paddle2.y && ballY < paddle2.y + paddle2.height) {
      // This if condition is used to check 
      // If the ball is higher than the top edge of the paddle 
      // If the ball is lower than the top edge of the paddle
       
      ballX = paddle2.x - ballRadius; // if ball gets stuck

      ballXDirection *= -1;
      ballSpeed += 1;
    }
  }
}

function changeDirection(event) {
  // This will move the paddles
  const keyPressed = event.keyCode;

  // W & S for paddle 1
  // UP & DOWN Arrow for paddle 2
  const paddle1Up = 87;
  const paddle1Down = 83;
  const paddle2Up = 38;
  const paddle2Down = 40;

  switch (keyPressed) {
    case paddle1Up:
      if (paddle1.y > 0) {
        // Adding this condition to make sure 
        // Paddles doesn't go outside the boundary 
        paddle1.y -= paddleSpeed;
      }
      break;

    case paddle1Down:
      if (paddle1.y < gameHeight - paddle1.height) {
        paddle1.y += paddleSpeed;
      }
      break;

    case paddle2Up:
      if (paddle2.y > 0) {
        paddle2.y -= paddleSpeed;
      }
      break;

    case paddle2Down:
      if (paddle2.y < gameHeight - paddle2.height) {
        paddle2.y += paddleSpeed;
      }
      break;
  }
}

function updateScore() {
  scoreText.textContent = `${player1Score} : ${player2Score}`;
}

function resetGame() {
  player1Score = 0;

  player2Score = 0;

  paddle1 = {
    width: 25,
    height: 100,
    x: 0,
    y: 0,
  };

  paddle2 = {
    width: 25,
    height: 100,
    x: gameWidth - 25,
    y: gameHeight - 100,
  };

  ballSpeed = 1;
  ballX = 0;
  ballY = 0;
  ballXDirection = 0;
  ballYDirection = 0;

  updateScore();
  clearInterval(intervalID);
  gameStart();
}
