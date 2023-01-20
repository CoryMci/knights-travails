const knight = function (position = [0, 0], path = []) {
  let currentPosition = position;
  let currentPath = path.concat([currentPosition]);
  console.log(path);

  const moves = [
    [-1, -2],
    [-1, 2],
    [1, -2],
    [1, 2],
    [-2, -1],
    [-2, 1],
    [2, -1],
    [2, 1],
  ];

  const validMoves = function () {
    const knights = [];
    moves.forEach((move) => {
      if (
        currentPosition[0] + move[0] >= 0 &&
        currentPosition[0] + move[0] <= 7 &&
        currentPosition[1] + move[1] >= 0 &&
        currentPosition[1] + move[1] <= 7
      ) {
        const newposition = [
          currentPosition[0] + move[0],
          currentPosition[1] + move[1],
        ]; //LEGAL moves
        //Make sure new position does not exist in previous moves/path
        const notInPath = (previousPosition) =>
          !(
            previousPosition[0] == newposition[0] &&
            previousPosition[1] == newposition[1]
          );
        if (currentPath.every(notInPath)) {
          knights.push(knight(newposition, currentPath));
        }
      }
    });
    console.log(knights);
    return knights;
    //return returnArray
  };

  return {
    validMoves,
    get position() {
      return currentPosition;
    },
    get path() {
      return currentPath;
    },
  };
};

const knightMoves = function (currentknight, target = [3, 7], queue = []) {
  if (
    currentknight.position[0] == target[0] &&
    currentknight.position[1] == target[1]
  ) {
    return currentknight;
  } else {
    queue = queue.concat(currentknight.validMoves());
    const nextKnight = queue.shift();
    return knightMoves(nextKnight, target, queue);
  }
};

const Ui = function () {
  let knightPosition = [0, 0];

  const generateBoard = function () {
    const board = document.querySelector(".board");
    for (let y = 0; y < 8; y++) {
      const bar = document.createElement("div");
      bar.classList.add("bar");
      for (let x = 0; x < 8; x++) {
        const square = document.createElement("div");
        square.classList.add("square");
        square.setAttribute("data-x", x);
        square.setAttribute("data-y", y);
        square.addEventListener("click", userAction);
        bar.appendChild(square);
      }
      board.prepend(bar);
    }
  };
  const userAction = function (e) {
    let targetX = e.target.dataset.x;
    let targetY = e.target.dataset.y;
    let otherSquares = document.querySelectorAll(".square");
    otherSquares.forEach((sq) => {
      sq.classList.remove("clicked");
      sq.classList.remove("path");
    });
    e.target.classList.add("clicked");
    const knightPath = knightMoves(knight(knightPosition), [
      targetX,
      targetY,
    ]).path;
    console.log(knightPath);
    knightPosition = knightPath[knightPath.length - 1];
    console.log(knightPosition);
    movePiece(knightPath);
  };

  const movePiece = function (array) {
    const knightY = document.querySelector("svg");
    const knightX = document.querySelector(".knight");

    array.forEach((position, index) => {
      setTimeout(() => {
        knightX.style.transform = `translateX(${position[0] * 50}px`;
      }, index * 2000);
      setTimeout(() => {
        knightY.style.transform = `translateY(-${position[1] * 50}px)`;
      }, index * 2000 + 1000);
      setTimeout(() => {
        markPath(position[0], position[1]);
      }, index * 2000 + 1000);
    });
  };
  const markPath = function (x, y) {
    let path = document.querySelector(`[data-x="${x}"][data-y="${y}"]`);
    path.classList.add("path");
  };

  return {
    generateBoard,
  };
};

const bort = Ui();
bort.generateBoard();
