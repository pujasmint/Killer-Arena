
var canvas = document.querySelector("canvas");
canvas.width = window.innerWidth - 300;
canvas.height = window.innerHeight;

var c = canvas.getContext("2d");

// Archer Image
var archerHeightWidth = 100;
var archerImage = new Image();
var archerYPosition = canvas.height / 3;
archerImage.onload = function() {
  c.drawImage(
    archerImage,
    0,
    archerYPosition,
    archerHeightWidth,
    archerHeightWidth
  );
};
archerImage.src = "../images/archer.png";

// Arrow Image
var arrowImage = new Image();
arrowImage.src = "../images/arrow.svg";
var arrowYPosition = archerYPosition + 18;
var arrowXPosition = 90;
var arrowInProgress = false;

//Total Score
var remainingTime = 30000;
var startTime = 0;
var enemiesKilled = [];

//Demons
var demonHeightWidth = 150;

document.onkeydown = function(event) {
  if (!event) event = window.event;
  var code = event.keyCode;
  if (event.charCode && code == 0) code = event.charCode;
  if (remainingTime > 0) {
    switch (code) {
      case 38:
        animateArcher(archerYPosition - 20);
        break;
      case 40:
        animateArcher(archerYPosition + 20);
        break;
      case 32:
        if (arrowInProgress === false) {
          document.getElementById("arrow").play();
          arrowYPosition = archerYPosition + 18;
          shootArrow();
        }
        break;
    }
  }
  event.preventDefault();
};

// Archer Position
function animateArcher(newYPosition) {
  if (newYPosition > 0 && newYPosition < canvas.height - 100) {
    c.clearRect(0, archerYPosition, archerHeightWidth, archerHeightWidth);
    c.drawImage(
      archerImage,
      0,
      newYPosition,
      archerHeightWidth,
      archerHeightWidth
    );
    archerYPosition = newYPosition;
  }
}
// Arrow shoot

function shootArrow() {
  arrowInProgress = true;
  var arrow = requestAnimationFrame(shootArrow);
  c.clearRect(arrowXPosition - 20, arrowYPosition, 50, 20);
  c.drawImage(arrowImage, arrowXPosition, arrowYPosition, 50, 20);
  checkDemonHit(arrowXPosition, arrowYPosition);
  arrowXPosition = arrowXPosition + 15;
  arrowYPosition = arrowYPosition + 1;
  if (arrowXPosition > canvas.width || arrowYPosition > canvas.height) {
  cancelAnimationFrame(arrow);
  c.clearRect(arrowXPosition - 20, arrowYPosition, 50, 20);
  arrowInProgress = false;
  arrowYPosition = archerYPosition + 18;
  arrowXPosition = 90;
  }
}

//demon hit position

function checkDemonHit(arrowX, arrowY) {
  for (const dem of demons) {
    if (
      arrowX >= dem.positionX &&
      arrowX <= dem.positionX + demonHeightWidth &&
      arrowY >= dem.positionY &&
      arrowY <= dem.positionY + demonHeightWidth
    ) {
      dem.killed = true;
      c.clearRect(
        dem.positionX,
        dem.positionY,
        demonHeightWidth,
        demonHeightWidth
      );
      dem.positionX = 0;
      dem.positionY = 0;
      enemiesKilled.push({
      name: dem.name,
      point: dem.killPoints
      });
      document.getElementById("kill").play();
      remainingTime = remainingTime + dem.additionalTime;
      const collectedScore = getCollectedScore(enemiesKilled);
      calculateTotalScore(collectedScore);
    }
  }
}

// score conditions

function getCollectedScore(enemyList) {
  const collectedEnemyScore = {};
  for (let enemy of enemyList) {
    if (collectedEnemyScore[enemy.name]) {
      collectedEnemyScore[enemy.name].count++;
    } else {
      collectedEnemyScore[enemy.name] = {
        count: 1,
        point: enemy.point
      };
    }
  }
  return collectedEnemyScore;
}

// Total Score

function calculateTotalScore(collectedScore) {
  const killList = document.querySelector("#killList");
  let htmlString = "";
  let totalScore = 0;
  for (let enemy in collectedScore) {
    const totalEnemyScore =
      collectedScore[enemy].count * collectedScore[enemy].point;
    totalScore = totalScore + totalEnemyScore;
    htmlString =
      htmlString +
      `<div class="enemyItem">
     <span>${enemy}&nbsp;x&nbsp;${collectedScore[enemy].count}</span>
     <span>${totalEnemyScore}</span>
     </div>`;
  }
  killList.innerHTML = htmlString;
  document.querySelector("#totalScore").innerText = totalScore;
}

  
// demon creation
function createDemons() {
  for (let demon of demons) {
    if (demon.killed) {
      const demonImage = new Image();
      demonImage.onload = function() {
        demon.positionX = 150 + Math.random() * (canvas.width - 300);
        demon.positionY = Math.random() * (canvas.height - 200);
        c.drawImage(
          demonImage,
          demon.positionX,
          demon.positionY,
          demonHeightWidth,
          demonHeightWidth
        );
      };
      demon.killed = false;
      demonImage.src = demon.image;
    } else {
      if (startTime % demon.relocationTime === 0) {
        c.clearRect(
          demon.positionX,
          demon.positionY,
          demonHeightWidth,
          demonHeightWidth
        );
        const demonImage = new Image();
        demonImage.onload = function() {
          demon.positionX = 150 + Math.random() * (canvas.width - 300);
          demon.positionY = Math.random() * (canvas.height - 200);
          c.drawImage(
            demonImage,
            demon.positionX,
            demon.positionY,
            demonHeightWidth,
            demonHeightWidth
          );
        };
        demonImage.src = demon.image;
      }
    }
  }
}

// Start game

var timeCheckID = setInterval(() => {
  startTime = startTime + 1000;
  remainingTime = remainingTime - 1000;
  const min = Math.floor(remainingTime / 60000);
  const sec = (remainingTime - min * 60000) / 1000;
  document.querySelector("#remainingTime").innerText = `${min}:${sec}`;

  if (remainingTime <= 10000) {
    document.querySelector("#remainingTime").classList.add("text-red");
  } else {
    document.querySelector("#remainingTime").classList.remove("text-red");
  }

  if (remainingTime <= 0) {
    endGame();
  }
}, 1000);

// end game 

function endGame() {
  clearInterval(timeCheckID);
  clearInterval(demonIntervalID);
  document.getElementById("st").pause();
  document.getElementById("game-over").play();
}

var demonIntervalID = setInterval(createDemons, 2000);
