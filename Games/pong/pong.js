var c;
var ctx;
var ballX = 50;
var ballSpeedX = 10;
var ballY;

window.onload = function () {
  c = document.getElementById("pongCanvas");
  ctx = c.getContext('2d');
  var fps = 30;
  setInterval(function() {
    moveEverything();
    drawEverything();
  }, 1000/fps);
};

function moveEverything() {
  console.log(ballX);

  ballX += ballSpeedX;
  if (ballX >= (c.width-10)) {
    ballSpeedX = -ballSpeedX;
  } else if (ballX <= 10) {
    ballSpeedX = -ballSpeedX;
  }
}

function drawEverything() {
  // fills canvas with gray
  colorRect(0, 0, c.width, c.height, "gray");

  // left player paddle
  colorRect(0,210,10,200,"white");

  // draws the ball
  colorCircle(ballX, 100, 10, "orange");
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
