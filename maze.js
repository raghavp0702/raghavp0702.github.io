var canvas;
var context;

var output;

var WIDTH = 1200;
var HEIGHT = 800;

var tileW = 20;
var tileH = 20;
var tileRowCount = 25;
var tileColumnCount = 40;

var startingx=0, startingy=0, endingx , endingy;

var boundX = 0;
var boundY = 0;

var tiles = [];

// for ( c = 0; c < endingx; c++) {
//   tiles[c] = [];
//   for ( r = 0; r < endingy; r++) {
//     tiles[c][r] = { x: c * (tileW + 3), y: r * (tileH + 3), state: "e" };
//   }
// }

// tiles[0][0].state = "s";
// tiles[tileColumnCount - 1][tileRowCount - 1].state = "f";

function getValues()
{
    // startingx = document.getElementById('startingx').value;
    
    endingx = parseInt(document.getElementById('endx').value);
    
    endingy = parseInt(document.getElementById('endy').value);
    if( endingx === NaN || endingy === NaN)
    {
        startingx=0, startingy=0;
        endingx=tileColumnCount-1 ;
        endingy=tileRowCount-1 ;
        document.getElementById('output').innerHTML = "Please enter a value";
    }
    else{
        document.getElementById('output').innerHTML = "";
    }

    
    for(c =0;c < endingx;c++)
    {
        tiles[c]  = [];
        for(r =0;r<endingy;r++)
        {
            tiles[c][r] = {x:c*(tileW+3), y:r*(tileH+3), state:'e'}
        }
    }
    tileRowCount=endingy;
    tileColumnCount=endingx;


    tiles[startingx][startingy].state = 's';
    tiles[endingx-1][endingy-1].state= 'f';
    
  // output.innerHTML = "Click on Solve to solve the maze";

    init();
}

function rect(x, y, w, h, state) {
  if (state === "s") {
    context.fillStyle = "#00FF00";
  } else if (state === "f") {
    context.fillStyle = "#FF0000";
  } else if (state === "x") {
    context.fillStyle = "#2E6171";
  } else if (state === "w") {
    context.fillStyle = "#F17F29";
  } else if (state === "e") {
    context.fillStyle = "#EAE0D5";
  } else {
    context.fillStyle = "#B79FAD";
  }
  context.beginPath();
  context.rect(x, y, w, h);
  context.closePath();
  context.fill();
}

function clear() {
  context.clearRect(0, 0, WIDTH, HEIGHT);
}

function draw() {
  clear();

  for ( c = 0; c < endingx; c++) {
    for ( r = 0; r < endingy; r++) {
      rect(tiles[c][r].x, tiles[c][r].y, tileW, tileH, tiles[c][r].state);
    }
  }
}

function solveMaze() {
  var Xqueue = [0];
  var Yqueue = [0];

  var isPathFound = false;

  var currentX;
  var currentY;

  while (Xqueue.length > 0 && !isPathFound) {
    currentX = Xqueue.shift();
    currentY = Yqueue.shift();

    if (currentX > 0) {
      if (tiles[currentX - 1][currentY].state === "f") {
        isPathFound = true;
      }
    }

    if (currentX < tileColumnCount - 1) {
      if (tiles[currentX + 1][currentY].state === "f") {
        isPathFound = true;
      }
    }
    if (currentY > 0) {
      if (tiles[currentX][currentY - 1].state === "f") {
        isPathFound = true;
      }
    }

    if (currentY < tileRowCount - 1) {
      if (tiles[currentX][currentY + 1].state === "f") {
        isPathFound = true;
      }
    }

    // if not reached the f yet

    if (currentX > 0) {
      if (tiles[currentX - 1][currentY].state === "e") {
        Xqueue.push(currentX - 1);
        Yqueue.push(currentY);
        tiles[currentX - 1][currentY].state =
          tiles[currentX][currentY].state + "l";
      }
    }

    if (currentX < tileColumnCount - 1) {
      if (tiles[currentX + 1][currentY].state === "e") {
        Xqueue.push(currentX + 1);
        Yqueue.push(currentY);
        tiles[currentX + 1][currentY].state =
          tiles[currentX][currentY].state + "r";
      }
    }
    if (currentY > 0) {
      if (tiles[currentX][currentY - 1].state === "e") {
        Xqueue.push(currentX);
        Yqueue.push(currentY - 1);

        tiles[currentX][currentY - 1].state =
          tiles[currentX][currentY].state + "u";
      }
    }

    if (currentY < tileRowCount - 1) {
      if (tiles[currentX][currentY + 1].state === "e") {
        Xqueue.push(currentX);
        Yqueue.push(currentY + 1);

        tiles[currentX][currentY + 1].state =
          tiles[currentX][currentY].state + "d";
      }
    }
  }

  if (!isPathFound) {
    document.getElementById('output').innerHTML = "NO SOLUTION!";
  } else {
    document.getElementById('output').innerHTML = "SOLVED!";

    var path = tiles[currentX][currentY].state;
    var pathLength = path.length;
    var currX = 0;
    var currY = 0;

    for (var i = 0; i < pathLength - 1; i++) {
      if (path.charAt(i + 1) === "u") {
        currY--;
      } else if (path.charAt(i + 1) === "d") {
        currY++;
      } else if (path.charAt(i + 1) === "r") {
        currX++;
      } else if (path.charAt(i + 1) === "l") {
        currX--;
      }
      if (
        tiles[currX][currY].state !== "s" &&
        tiles[currX][currY].state !== "f"
      )
        tiles[currX][currY].state = "x";
    }
  }
}

function resetMaze() {
  for ( c = 0; c < tileColumnCount; c++) {
    tiles[c] = [];
    for ( r = 0; r < tileRowCount; r++) {
      tiles[c][r] = { x: c * (tileW + 3), y: r * (tileH + 3), state: "e" };
    }
  }

  tiles[0][0].state = "s";
  tiles[tileColumnCount - 1][tileRowCount - 1].state = "f";
  document.getElementById("output").innerHTML = "";
}

function init() {
  canvas = document.getElementById("myCanvas");
  context = canvas.getContext("2d");

  output = document.getElementById("output");

  return setInterval(draw, 10);
}

function myMove(e) {
  var x = e.pageX - canvas.offsetLeft;
  var y = e.pageY - canvas.offsetTop;

  for ( c = 0; c < tileColumnCount; c++) {
    for ( r = 0; r < tileRowCount; r++) {
      if (
        c * (tileW + 3) < x &&
        x < c * (tileW + 3) + tileW &&
        r * (tileH + 3) < y &&
        y < r * (tileH + 3) + tileH
      ) {
        if (tiles[c][r].state === "e" && (c !== boundX || r !== boundY)) {
          tiles[c][r].state = "w";
          boundX = c;
          boundY = r;
        } else if (
          tiles[c][r].state === "w" &&
          (c !== boundX || r !== boundY)
        ) {
          tiles[c][r].state = "e";
          boundX = c;
          boundY = r;
        }
      }
    }
  }
}

function myDown(e) {
  canvas.onmousemove = myMove;
  var x = e.pageX - canvas.offsetLeft;
  var y = e.pageY - canvas.offsetTop;

  for ( c = 0; c < tileColumnCount; c++) {
    for ( r = 0; r < tileRowCount; r++) {
      if (
        c * (tileW + 3) < x &&
        x < c * (tileW + 3) + tileW &&
        r * (tileH + 3) < y &&
        y < r * (tileH + 3) + tileH
      ) {
        if (tiles[c][r].state === "e") {
          tiles[c][r].state = "w";
          boundX = c;
          boundY = r;
        } else if (tiles[c][r].state === "w") {
          tiles[c][r].state = "e";
          boundX = c;
          boundY = r;
        }
      }
    }
  }
}

function myUp(e) {
  canvas.onmousemove = null;
}

// function calls
init();
canvas.onmouseup = myUp;
canvas.onmousedown = myDown;