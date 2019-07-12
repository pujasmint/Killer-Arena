setTimeout(() => document.getElementById("st").play(),1000);

var canvas = document.querySelector("canvas");
canvas.width = window.innerWidth - 300;
canvas.height = window.innerHeight;
var c = canvas.getContext("2d");

class Archer {
    constructor(archerX, archerY, archerWidth, archerHeight, archerImage){
    this.archerX = archerX;
    this.archerY = archerY;
    this.archerWidth = archerWidth;
    this.archerHeight = archerHeight;
    this.archerImage = new Image();
    this.archerImage.src = archerImage;
} 

drawArcher(){
    this.archerImage.onload = c.drawImage(
    this.archerImage,
    this.archerX,
    this.archerY,
    this.archerWidth, 
    this.innerHeight
        );
    }
}

const archer = new Archer(0, canvas.height/3, 100, 100, "../images/archer.png"); 

class Arrow {
    constructor(arrowX, arrowY, arrowWidth, arrowHeight, arrowImage, arrowProgress){
    this.arrowX = arrowX;
    this.arrowY = arrowY;
    this.arrowWidth = arrowWidth;
    this.arrowHeight = arrowHeight;
    this.arrowImage = new Image();
    this.arrowImage.src = arrowImage;
    this.arrowProgress = arrowProgress
} 
drawArrow() {
    this.arrowImage.onload = c.drawImage(
    this.arrowImage,
    this.arrowX,
    this.arrowY,
    this.arrowWidth, 
    this.arrowHeight,
    this.arrowProgress,
       );
}
shootArrow(){
    this.arrowProgress = true;
    var arrow = requestAnimationFrame(shootArrow);
    c.clearRect(this.arrowX - 20, this.arrowY, 50, 20);
    
}

}
const arrow = new Arrow(90, archer.archerY + 18, 100, 100, "../images/arrow.svg", flase); 

class demon{
    constructor(){ }

    createDemons(){
        for(let demon of demons){
            if(demon.killed) {
            const demonImage = new Image();
            demonImage.onload() {
            demon.demonX = 150 + Math.random() * (canvas.width -300);
            demon.demonY = Math.random() * (canvas.height -200);
            c.drawImage(
                demon.demonImage,
                demon.demonX ;
                demon.demonY;
                demon.height;
                demon.width;
            );
            };
            demon.killed = false;
            demonImage.src = demon.image;
            } else {

            }
        }
    }

}