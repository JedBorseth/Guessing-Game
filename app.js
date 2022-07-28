"use strict";
// Set developer to true for debug
let currentScreen = ".splash";
let player1 = {};
let player2 = {};
let player3 = {};
let player4 = {};
let players = [];
let gameBoard = 1;
let gameArr = [];
let moveCount = 0;
let preventMove;
let developer = false;
const audio = [
  new Audio("./sounds/Select 1.wav"),
  new Audio("./sounds/Cancel 1.wav"),
  new Audio("./sounds/Bubble 1.wav"),
  new Audio("./sounds/Text 1.wav"),
  new Audio("./sounds/Hit damage 1.wav"),
  new Audio("./sounds/Confirm 1.wav"),
  new Audio("./sounds/Boss hit 1.wav"),
  new Audio("./sounds/Bubble heavy 1.wav"),
  new Audio("./sounds/Bubble heavy 2.wav"),
];
$(".player-select").hide();
$(".game-select").hide();
$(".game").hide();
$(".endgame").hide();
$(".help").toggle();
$("#splash-btn").on("click", () => {
  audio[2].play();
  $(currentScreen).hide();
  currentScreen = ".player-select";
  $(currentScreen).show();
});
$("#help-btn").on("click", () => {
  $(".help").toggle();
});
$(".add-player").on("click", (e) => {
  audio[4].play();
  switch (e.target.id) {
    case "p2":
      player2 = new Player(2, false, 0);
      break;
    case "p3":
      player3 = new Player(3, false, 0);
      break;
    case "p4":
      player4 = new Player(4, false, 0);
      break;
  }
  e.target.classList.add("hidden");
});
$(".menu").on("click", (e) => {
  switch (e.target.id) {
    case "p2-select":
      if (Object.keys(player2).length > 1) {
        setPlayerHighlight(player2);
        player2.handleSelect();
        e.target.style.background = "lightgreen";
      }
      break;
    case "p3-select":
      if (Object.keys(player3).length > 1) {
        setPlayerHighlight(player3);
        player3.handleSelect();
        e.target.style.background = "lightgreen";
      }
      break;
    case "p4-select":
      if (Object.keys(player4).length !== 0) {
        setPlayerHighlight(player4);
        player4.handleSelect();
        e.target.style.background = "lightgreen";
      }
      break;
    case "p1-select":
      if (Object.keys(player1).length !== 0) {
        setPlayerHighlight(player1);
        e.target.style.background = "lightgreen";
      }
      break;
  }
});
function setPlayerHighlight(highlighted) {
  player1.currentlySelected = false;
  player2.currentlySelected = false;
  player3.currentlySelected = false;
  player4.currentlySelected = false;
  highlighted.currentlySelected = true;
  $(".menu").children().css("background", "white");
}
function updatePlayers() {
  players = [];
  if (Object.keys(player1).length > 1) {
    players.push(player1);
  }
  if (Object.keys(player2).length > 1) {
    players.push(player2);
  }
  if (Object.keys(player3).length > 1) {
    players.push(player3);
  }
  if (Object.keys(player4).length > 1) {
    players.push(player4);
  }
}
$("#next-btn").on("click", () => {
  audio[1].play();
  updatePlayers();
  let i = 0;
  players.forEach((e) => {
    if (e.selectedProfile) {
      i++;
    }
  });
  if (i === players.length) {
    $(currentScreen).hide();
    currentScreen = ".game-select";
    $(currentScreen).show();
  }
});
$(".board-map").on("click", (e) => {
  $(".board-map").removeClass("selected");
  e.target.classList.toggle("selected");
  gameBoard = Number(e.target.getAttribute("value"));
  audio[0].play();
});
$("#start-game").on("click", () => {
  audio[8].play();
  $(currentScreen).hide();
  currentScreen = ".game";
  $(currentScreen).show();
  startGame();
});
function startGame() {
  $(".game").addClass(`board-bg-${gameBoard}`);
  $(".circles").hide();
  players.forEach((e) => {
    $(".player-board").append($(`#${e.selectedProfile}`));
  });
  checkBoard();
  playerMoves();
}
function checkBoard() {
  if (gameBoard === 1) {
    drawGameBoard(30);
    preventMove = 5;
  }
  if (gameBoard === 2) {
    drawGameBoard(24);
    preventMove = 4;
  }
  if (gameBoard === 3) {
    drawGameBoard(12);
    preventMove = 2;
  }
}
$("html").on("keydown", (key) => {
  if (currentScreen === ".game") {
    if (key.key === "ArrowRight" || key.key === "d") {
      players.forEach((e) => {
        e.movePlayer(1, 0);
      });
    }
    if (key.key === "ArrowLeft" || key.key === "a") {
      players.forEach((e) => {
        e.movePlayer(-1, 0);
      });
    }
    if (key.key === "ArrowUp" || key.key === "w") {
      players.forEach((e) => {
        e.movePlayer(0, -1);
      });
    }
    if (key.key === "ArrowDown" || key.key === "s") {
      players.forEach((e) => {
        e.movePlayer(0, 1);
      });
    }
    if (key.key === " " || key.key === "Enter") {
      players.forEach((e) => {
        e.checkHit();
      });
      playerMoves();
    }
  }
});
function drawGameBoard(tiles) {
  for (let i = 0; i < tiles; i++) {
    let gameEl = document.createElement("div");
    gameEl.setAttribute("class", "board-square");
    gameArr.push(gameEl);
    if (Math.floor(Math.random() * 2) === 1) {
      gameEl.setAttribute("class", "board-square secret");
      if (developer) gameEl.setAttribute("class", "board-square secret shown");
    }
    $(".game-board").append(gameEl);
  }
}
function playerMoves() {
  players.forEach((e) => {
    e.isTurn = false;
    $(`.player-${e.playerId}-game`).css("background", "grey");
  });
  $(`.player-${players[moveCount].playerId}-game`).css(
    "background",
    "lightgreen"
  );
  players[moveCount].isTurn = !players[moveCount].isTurn;
  moveCount++;
  if (moveCount > players.length - 1) moveCount = 0;
}
function handleEndgame() {
  $("#replay").on("click", () => {
    $(".game-board .board-square").remove();
    audio.forEach((e) => {
      e.play();
    });
    $(currentScreen).hide();
    currentScreen = ".splash";
    $(currentScreen).show();
    $(".player-board").children().remove();
    players.forEach((e) => {
      $(`.player-${e.playerId}-game`).text(`Player ${e.playerId}`);
      e.x = 1;
      e.y = 1;
      e.score = 0;
      e.missed = 0;
      e.selectedProfile = null;
    });
  });
  $("#replay-same").on("click", () => {
    $(".circles").hide();
    audio[3].play();
    $(".game-board .board-square").remove();
    $(currentScreen).hide();
    currentScreen = ".game";
    checkBoard();
    players.forEach((e) => {
      e.score = 0;
      e.missed = 0;
      $(`.player-${e.playerId}-game`).text(`Player ${e.playerId}`);
    });
    $(currentScreen).show();
  });
}
class Player {
  constructor(playerId, currentlySelected, score, selectedProfile) {
    this.playerId = playerId;
    this.score = score;
    this.selectedProfile = selectedProfile;
    this.currentlySelected = currentlySelected;
    this.isTurn = false;
    this.x = 1;
    this.y = 1;
    this.missed = 0;
    this.handleSelect = () => {
      $(".select-area").on("click", (e) => {
        if (this.currentlySelected) {
          if (e.target.id !== "") {
            audio[5].play();
            $(`#p${this.playerId}-select > div`).remove();
            $(`#${e.target.id}`)
              .clone()
              .appendTo($(`#p${this.playerId.toString()}-select`));
            this.selectedProfile = e.target.id;
          }
        }
      });
    };
    this.movePlayer = (right, down) => {
      if (this.isTurn) {
        if ((right === -1) & (this.x === 1)) return;
        if ((down === -1) & (this.y === 1)) return;
        if ((right === 1) & (this.x === 6)) return;
        if ((down === 1) & (this.y === preventMove)) return;
        this.x += right;
        this.y += down;
        $(".player-board")
          .children("#" + this.selectedProfile)
          .css("grid-column", this.x);
        $(".player-board")
          .children("#" + this.selectedProfile)
          .css("grid-row", this.y);
      }
    };
    this.checkHit = () => {
      if (this.isTurn) {
        const coordsY = this.y * 6;
        const coords = this.x + coordsY - 7;
        if (
          $(".game-board .board-square")[coords].classList.contains("secret")
        ) {
          audio[0].play();
          $(".player-board")
            .children("#" + this.selectedProfile)
            .css("background", "lightgreen");
          setTimeout(() => {
            $(".player-board")
              .children("#" + this.selectedProfile)
              .css("background", "lightslategrey");
          }, 500);
          this.score++;
          $(`.player-${this.playerId}-game`).text(
            `Player ${this.playerId}: ${this.score}`
          );
          $(".game-board .board-square")[coords].classList.remove("secret");
        } else {
          audio[6].play();
          this.missed++;
          $(".player-board")
            .children("#" + this.selectedProfile)
            .css("background", "red");
          setTimeout(() => {
            $(".player-board")
              .children("#" + this.selectedProfile)
              .css("background", "lightslategrey");
          }, 500);
        }
      }
      if (this.score >= 3) {
        $(".circles").show();
        audio[5].play();
        startConfetti();
        $(".endgame h3").html(
          `Player ${this.playerId} Wins! <br>Missed: ${this.missed}`
        );
        if (this.missed === 0) $(".endgame h3").css("color", "gold");
        else $(".endgame h3").css("color", "white");
        $(currentScreen).hide();
        currentScreen = ".endgame";
        $(currentScreen).show();
        handleEndgame();
        setTimeout(() => {
          stopConfetti();
        }, 2000);
      }
    };
  }
}
$(() => {
  $("#p1-select").css("background", "lightgreen");
  player1 = new Player(1, true, 0);
  player1.handleSelect();
  if (!developer)
    confirm(
      "Enable developer by changing developer variable to true. This lets you see the targets without having to guess."
    );
});
