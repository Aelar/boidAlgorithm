config =  {
  "canvas":{
    "w":5000,
    "h":5000,
  },
  "numberOfBoids":50,
  "boids":[]
}

var canvas = document.getElementById('canvas'),
context = canvas.getContext('2d');
var img = new Image();

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function drawRotatedImage(image, x, y, angle)
{
    // save the current co-ordinate system
    // before we screw with it
    context.save();

    // move to the middle of where we want to draw our image
    context.translate(x, y);

    // rotate around that point, converting our
    // angle from degrees to radians
    context.rotate(angle);

    // draw it up and to the left by half the width
    // and height of the image
    context.drawImage(image,0,0, 32, 32);

    // and restore the co-ords to how they were when we began
    context.restore();
}

function init() {

  img.src="img/boid.svg"
  for (var i = 0; i < config.numberOfBoids; i++) {
    x=getRandomInt(config.canvas.w/5)
    y=getRandomInt(config.canvas.h/5)
    b = {"x":x,
        "y":y,
      "v":{"x":getRandomInt(100),"y":getRandomInt(100)}}
        config.boids.push(b)

        img.onload = function() {
          for (var i in config.boids) {
            context.drawImage(img,config.boids[i].x,config.boids[i].y,32,32)
          }
        }
      }

      loop()

}

function dotProduct(u,v) {

  return (u.x*v.x) + (u.x*v.x)

}

function lenghtOfVector(u) {
  return Math.sqrt(Math.pow(u.x,2)+Math.pow(u.y,2))
}

function radians_to_degrees(radians)
{
  var pi = Math.PI;
  return radians * (180/pi);
}

function rotationAngle(u,v) {
  return Math.acos((dotProduct(u,v))/(lenghtOfVector(u)*lenghtOfVector(v)))
}

function sumVectors(v1,v2) {
  v= {"x":v1.x+v2.x,
      "y":v1.y+v2.y}
      return v
}

function drawBoids(){
  context.clearRect(0, 0, canvas.width, canvas.height);
  for (var i in config.boids) {
    b = {"x":10,"y":0}

    //context.drawImage(img,config.boids[i].x,config.boids[i].y,32,32)
    drawRotatedImage(img,config.boids[i].x,config.boids[i].y,rotationAngle(b,config.boids[i].v))
  }
}

function rule1(bj) {
  var pcj = {"x":0,"y":0}
  for (var b in config.boids) {
    if (bj.x != config.boids[b].x || bj.y != config.boids[b].y) {
      pcj = sumVectors(pcj,config.boids[b])
    }
  }
  pcj.x /= (config.numberOfBoids - 1)
  pcj.y /= (config.numberOfBoids - 1)

  pcj.x = (pcj.x - bj.x)/100
  pcj.y = (pcj.y - bj.y)/100

  return pcj
}

function rule2(bj) {
 var v = { "x":0, "y":0}
 for (var b in config.boids) {
   if (bj.x != config.boids[b].x || bj.y != config.boids[b].y) {
     if(Math.abs(config.boids[b].x - bj.x) < 15){
       v.x = v.x - (bj.x - config.boids[b].x)/3
     }
     if(Math.abs(config.boids[b].y - bj.y) < 15){
       v.y = v.y - (bj.y - config.boids[b].y)/3
     }
   }
 }
 return v
}

function rule3(bj) {
  var v = { "x":0, "y":0}
  for (var b in config.boids) {
    if (bj.x != config.boids[b].x || bj.y != config.boids[b].y) {
      v.x = v.x + config.boids[b].v.x
      v.y = v.y + config.boids[b].v.y
    }
  }
    v.x = (v.x)/100
    v.y = (v.y)/100

    v.x = (v.x - bj.v.x)/8
    v.y = (v.y - bj.v.y)/8

    return v;
}

function preventOOB(b) {
  if ((config.boids[b].x + config.boids[b].v.x) > 5000 || (config.boids[b].x + config.boids[b].v.x) < 0) {
    config.boids[b].v.x = -config.boids[b].v.x
  }
  if ((config.boids[b].y + config.boids[b].v.y) > 5000 || (config.boids[b].y + config.boids[b].v.y) < 0) {
    config.boids[b].v.y = -config.boids[b].v.y
  }
}

function moveAllBoids() {
  var v1,v2,v3,b;
  for (var b in config.boids) {
    v1=rule1(config.boids[b]);
    v2=rule2(config.boids[b]);
    v3=rule3(config.boids[b]);
    config.boids[b].v.x = (config.boids[b].v.x + v1.x + v2.x + v3.x)/1.2
    config.boids[b].v.y = (config.boids[b].v.y + v1.y + v2.y + v3.y)/1.2

    preventOOB(b);

    config.boids[b].x += config.boids[b].v.x
    config.boids[b].y += config.boids[b].v.y

  }
}

function loop() {
  moveAllBoids()
  drawBoids()
  setTimeout(loop,10)
}

init()
