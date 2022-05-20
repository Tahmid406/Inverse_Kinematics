class Tentacle {
  constructor(pos, length, color, weight) {
    this.startPoint = pos;
    this.endPoint = pos;
    this.length = length;
    this.maxSpeed = 10;
    this.color = color;
    this.weight = weight;
  }

  calcNewPoints(target) {
    this.endPoint = target;
    let dir = p5.Vector.sub(this.startPoint, target).setMag(this.length);
    this.startPoint = p5.Vector.add(target, dir);
  }

  calcTarget(target) {
    let vect = p5.Vector.sub(target, this.endPoint);
    let modifier = this.maxSpeed;
    if (vect.magSq() < tentacleLength * tentacleLength) {
      modifier = map(
        vect.magSq(),
        0,
        tentacleLength * tentacleLength,
        0.5,
        tentacleLength
      );
    }
    vect.setMag(modifier);
    return p5.Vector.add(this.endPoint, vect);
  }

  render() {
    strokeWeight(this.weight);
    stroke(this.color);
    line(
      this.endPoint.x,
      this.endPoint.y,
      this.startPoint.x,
      this.startPoint.y
    );
  }
}

let tentacles = [];
let totalTentacles = 50;
let tentacleLength = 15;
let startWeight = 2;
let food;
let foodColor;
const foodRadius = 10;

function setup() {
  createCanvas(innerWidth, innerHeight);
  colorMode(HSB);

  //Making the head and putting it at index 0
  head = new Tentacle(
    createVector(width / 2, height / 2),
    tentacleLength,
    color(0, 0, 255),
    15
  );
  tentacles.push(head);

  //generating food.
  food = createVector(random(width), random(height));
  foodColor = color(int(random(256)), 255, 255);
}

function draw() {
  background(10);

  //updating head's position
  tentacles[0].calcNewPoints(
    tentacles[0].calcTarget(createVector(mouseX, mouseY))
  );
  tentacles[0].render();

  //updating tails' positions
  for (let i = 1; i < tentacles.length; i++) {
    tentacles[i].calcNewPoints(tentacles[i - 1].startPoint);
    tentacles[i].render();
  }

  //checking if the food is eaten
  let distFromFood = dist(
    tentacles[0].endPoint.x,
    tentacles[0].endPoint.y,
    food.x,
    food.y
  );
  if (distFromFood < foodRadius + 15) {
    tentacles.push(
      new Tentacle(
        createVector(
          tentacles[tentacles.length - 1].startPoint.x,
          tentacles[tentacles.length - 1].startPoint.y
        ),
        tentacleLength,
        foodColor,
        startWeight
      )
    );
    startWeight += 0.1;
    food = createVector(random(width), random(height));
    foodColor = color(int(random(256)), 255, 255);
  }

  fill(foodColor);
  noStroke();
  ellipse(food.x, food.y, foodRadius * 2, foodRadius * 2);
}
