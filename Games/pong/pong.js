var c;
var ctx;
var ballX = 50;
var ballY = 50;
var ballSpeedX = 10;
var ballSpeedY = 4;

var paddle1Y = 250;
var paddle2Y = 250;
const PADDLE_HEIGHT = 100;
const PADDLE_WIDTH = 10;
const BALL_RADIUS = 10;
const WINNING_SCORE = 3;

var showWin = false;

var p1Score = 0;
var p2Score = 0;

function calculateMousePos(evt) {
  var rect = c.getBoundingClientRect();
  var root = document.documentElement;
  var mouseX = evt.clientX - rect.left - root.scrollLeft;
  var mouseY = evt.clientY - rect.top - root.scrollTop;
  return {
    x:mouseX,
    y:mouseY
  };
}

function handleMouseClick(evt) {
  if (showWin) {
    p1Score = 0;
    p2Score = 0;
    showWin = false;
  }
}

window.onload = function () {
  c = document.getElementById("pongCanvas");
  ctx = c.getContext('2d');
  var fps = 30;
  setInterval(function() {
    moveEverything();
    drawEverything();
  }, 1000/fps);

  // adds mouse click to restart event
  c.addEventListener('mousedown', handleMouseClick);

  // controls paddle movement
  c.addEventListener('mousemove',
      function(evt) {
        var mousePos = calculateMousePos(evt);
        paddle1Y = mousePos.y - (PADDLE_HEIGHT/2);
        reportMousePos(mousePos);
      });


};

function reportMousePos(mousePos) {
  var x = mousePos.x;
  var y = mousePos.y;
  document.getElementById("mousePos").innerHTML = "X: " + x + ", Y: " + y;
}

// reset the ball
function ballReset() {
  if (p1Score >= WINNING_SCORE || p2Score >= WINNING_SCORE) {
    showWin = true;
  }
  ballSpeedX = -ballSpeedX;
  ballX = c.width/2;
  ballY = c.height/2;
}

// moves all components
function moveEverything() {
  if (showWin) {
    return;
  }

  computerMovement();

  ballX += ballSpeedX;
  ballY += ballSpeedY;

  // if ball moves near right paddle boundry
  if (ballX >= (c.width - (BALL_RADIUS + PADDLE_WIDTH))) {
    // if ball hits right paddle
    if (ballY > paddle2Y && ballY < (paddle2Y + PADDLE_HEIGHT)) {
      // reverse direction
      ballSpeedX = -ballSpeedX;
      // affect the y velocity after paddle 2 hit
      var delta2Y = ballY - (paddle2Y + PADDLE_HEIGHT/2);
      ballSpeedY = delta2Y * 0.35;
    } else if (ballX >= c.width) {
      // give points to player 1
      p1Score++;  // must be BEFORE ballReset()
      // if ball passes right boundry
      ballReset();
    }
  } else if (ballX <= (BALL_RADIUS + PADDLE_WIDTH)) {
    // if ball approaches left side boundry
    // if ball hits left paddle
    if (ballY > paddle1Y && ballY < (paddle1Y + PADDLE_HEIGHT)) {
      // reverse direciton
      ballSpeedX = -ballSpeedX;
      // affect the y velocity
      var delta1Y = ballY - (paddle1Y + PADDLE_HEIGHT/2);
      ballSpeedY = delta1Y * 0.35;
    } else if (ballX <= 0) {
      // give player 2 points
      p2Score++;  // must be BEFORE ballReset()
      // if ball passes left boundry
      ballReset();
      }
  }
  // if ball approaches bottom boundry
  if (ballY >= (c.height - BALL_RADIUS)) {
    ballSpeedY = -ballSpeedY;
  } else if (ballY <= BALL_RADIUS) {
    // if ball approaches top boundry
    ballSpeedY = -ballSpeedY;
  }
}

// AI for computer paddle movement
function computerMovement() {
  var paddle2YCenter = paddle2Y + (PADDLE_HEIGHT/2);
  if (paddle2YCenter < ballY - (0.4*(PADDLE_HEIGHT))) {
    paddle2Y += 10;
  } else if (paddle2YCenter > ballY + (0.4*(PADDLE_HEIGHT))){
    paddle2Y -= 10;
  }
}

function drawNet() {
  for(var i = 0; i < c.height; i += 40) {
    colorRect(c.width/2 - 1, i, 2, 20, 'green');
  }
}

function drawEverything() {
  // fills canvas with gray
  colorRect(0, 0, c.width, c.height, "gray");
  // if WINNING_SCORE is reached
  if (showWin) {
    if (p1Score >= WINNING_SCORE) {
      ctx.fillStyle = "black";
      ctx.fillText("Left side Won!", 200, 300);
    } else if (p2Score >= WINNING_SCORE) {
      ctx.fillStyle = "black";
      ctx.fillText("Right side Won!", 200, 300);
    }
    ctx.fillStyle = "black";
    ctx.fillText("click to continue", 200, 200);
    return;
  }

  // draw table net
  drawNet();


  // left player paddle
  colorRect(0,paddle1Y,PADDLE_WIDTH,PADDLE_HEIGHT,"pink");

  // right player paddle
  colorRect((c.width - PADDLE_WIDTH),paddle2Y,PADDLE_WIDTH,PADDLE_HEIGHT,"purple");

  // draws the ball
  colorCircle(ballX, ballY, BALL_RADIUS, "orange");

  // draws the score
  ctx.fillStyle = "black";
  ctx.fillText("Player 1 Score: " + p1Score, 100, 100);
  ctx.fillText("Player 2 Score: " + p2Score, (c.width - 200), 100);

}


function colorRect(leftX, topY, width, height, drawColor) {
  ctx.fillStyle = drawColor;
  ctx.fillRect(leftX, topY, width, height);
}

function colorCircle(centerX, centerY, radius, drawColor) {
  ctx.fillStyle = drawColor;
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, Math.PI*2, true);
  ctx.fill();
}
