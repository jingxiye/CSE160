// DrawTriangle.js (c) 2012 matsuda
let canvas;
let ctx;

function main() {  
  // Retrieve <canvas> element
  canvas = document.getElementById('example');  
  if (!canvas) { 
    console.log('Failed to retrieve the <canvas> element');
    return false; 
  } 
  //let v1 = new Vector3([2.25,2.25,0]);
  // Get the rendering context for 2DCG
  ctx = canvas.getContext('2d');
  // Draw a blue rectangle
  ctx.fillStyle = 'rgba(0, 0, 0, 1.0)'; // Set color to blue
  ctx.fillRect(0, 0, 400, 400);        // Fill a rectangle with the color
  //drawVector(v1, "red");
}

function drawVector(v,color){
  ctx.beginPath();
  ctx.strokeStyle = color;
  ctx.moveTo(200,200);
  ctx.lineTo(200 + (v.elements[0] * 20), 200 - (v.elements[1] * 20));
  ctx.stroke();
}

function handleDrawEvent(){
  //clear canvas
  ctx.clearRect(0,0,canvas.width,canvas.heigth);
  ctx.fillRect(0,0,400,400);
  //read the values of the text boxes to create v1
  let v1 = new Vector3([0,0,0]);
  let v2 = new Vector3([0,0,0]);
  v1.elements[0] = document.getElementById("v1_x").valueAsNumber;
  v1.elements[1] = document.getElementById("v1_y").valueAsNumber;
  v2.elements[0] = document.getElementById("v2_x").valueAsNumber;
  v2.elements[1] = document.getElementById("v2_y").valueAsNumber;
  //call drawVector
  drawVector(v1,"red");
  drawVector(v2,"blue");
  //handleDrawEvent();
}

function handleDrawOperationEvent(){
  //Clear the canvas.
  ctx.clearRect(0,0,canvas.width,canvas.heigth);
  ctx.fillRect(0,0,400,400);
  //Read the values of the text boxes to create v1 and call drawVector(v1, "red") .
  let v1 = new Vector3([0,0,0]);
  v1.elements[0] = document.getElementById("v1_x").valueAsNumber;
  v1.elements[1] = document.getElementById("v1_y").valueAsNumber;
  drawVector(v1,"red");
  //Read the values of the text boxes to create v2 and call drawVector(v2, "blue") . 
  let v2 = new Vector3([0,0,0]); 
  v2.elements[0] = document.getElementById("v2_x").valueAsNumber;
  v2.elements[1] = document.getElementById("v2_y").valueAsNumber;
  drawVector(v2,"blue");
  //Read the value of the selector and call the respective Vector3 function.
  let v3 = new Vector3([0, 0, 0]);
  let v4 = new Vector3([0, 0, 0]);
  let selector = document.getElementById("operation_selector").value;
  let scalar = document.getElementById("operation_scalar").value;
  if (selector === "Add") {
    v3 = v1.add(v2);
    drawVector(v3, "green");
  } else if (selector === "Subtract") {
    v3 = v1.sub(v2);
    drawVector(v3, "green");
  } else if (selector === "Multiply") {
    v3 = v1.mul(scalar);
    v4 = v2.mul(scalar);
    drawVector(v3, "green");
    drawVector(v4, "green");
  } else if (selector === "Divide") {
    v3 = v1.div(scalar);
    v4 = v2.div(scalar);
    drawVector(v3, "green");
    drawVector(v4, "green");
  } else if (selector === "Magnitude") {
    console.log("Magnitude v1: " + v1.magnitude());
    console.log("Magnitude v2: " + v2.magnitude());
  } else if (selector === "Normalize") {
    v3 = v1.normalize();
    v4 = v2.normalize();
    drawVector(v3, "green");
    drawVector(v4, "green");
  } else if (selector === "Angle Between") {
    angleBetween(v1, v2);
  } else if (selector === "Area") {
    areaTriangle(v1, v2);
  }
}

function angleBetween(v1,v2){
  let dotP = Vector3.dot(v1,v2);
  let nor1 = v1.normalize();
  let nor2 = v2.normalize();

  let frac = dotP / (nor1 * nor2);
  if (isNaN(frac) === true) { frac = 0; } 
  let angle = Math.acos(frac) * (180 / Math.PI);
  console.log("Angle: " + angle);
}

function areaTriangle(v1,v2){
  let croP = Vector3.cross(v1, v2);
  let croM = croP.magnitude();
  let area = croM / 2;
  console.log("Area of the triangle: " + area);
}