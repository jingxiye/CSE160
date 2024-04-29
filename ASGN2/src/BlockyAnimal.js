
// Import the drawPicture function from Picture.js
// import { drawPicture } from './Picture.js';

// ColoredPoint.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE = `
  attribute vec4 a_Position;
  uniform mat4 u_ModelMatrix;
  uniform mat4 u_GlobalRotateMatrix;
  uniform float u_Size;
  void main() {
    gl_Position = u_GlobalRotateMatrix * u_ModelMatrix * a_Position;
  }`

// Fragment shader program
var FSHADER_SOURCE =`
  precision mediump float;
  uniform vec4 u_FragColor;
  void main() {
    gl_FragColor = u_FragColor;
  }`;

// Global Variables
let canvas;
let gl;
let a_Position;
let u_FragColor;
let u_Size;
let u_ModelMatrix;
let g_yellowAngle = 0;
let g_magentaAngleL = 0;
let g_magentaAngleR = 0;
let g_footAngleR = 0;
let g_footAngleL = 0;
let g_footLiftR = 0;
let g_footLiftL = 0;
let g_globalAngle = 0; // Add this line
let g_yellowAnimation=false;
let g_magentaAnimation=false;
let g_runAnimation = false;
let maxSwingAngle = 25;
let maxLiftHeight = 0.1;
let g_armAngleR = 0;
let g_armAngleL = 0;
let g_bodyAngle = 0;


function setUpWebGL() {
   // Retrieve <canvas> element
   canvas = document.getElementById('webgl');

   // Get the rendering context for WebGL
   //gl = getWebGLContext(canvas);
   gl = canvas.getContext("webgl", { preserveDrawingBuffer: true });

   if (!gl) {
     console.log('Failed to get the rendering context for WebGL');
     return;
   }
   gl.enable(gl.DEPTH_TEST);
}


function connectVariablesToGLSL() {
  // Initialize shaders
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to intialize shaders.');
    return;
  }

  // // Get the storage location of a_Position
  a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if (a_Position < 0) {
    console.log('Failed to get the storage location of a_Position');
    return;
  }

  // Get the storage location of u_FragColor
  u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
  if (!u_FragColor) {
    console.log('Failed to get the storage location of u_FragColor');
    return;
  }

  // Get the storage location of u_ModelMatrix
  u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
  if (!u_ModelMatrix) {
    console.log('Failed to get the storage location of u_ModelMatrix');
    return;
  }

  u_GlobalRotateMatrix = gl.getUniformLocation(gl.program, 'u_GlobalRotateMatrix');
  if (!u_GlobalRotateMatrix) {
    console.log('Failed to get the storage location of u_GlobalRotateMatrix');
    return;
  }

  var identityM = new Matrix4();
  gl.uniformMatrix4fv(u_ModelMatrix, false, identityM.elements);
  
}

// Constants
const POINT = 0;
const TRIANGLE = 1;
const CIRCLE = 2;
const PICTURE = 3;

// Globals related to UI elements
let g_selectedColor = [1.0,1.0,1.0,1.0]; // Default white
let g_selectedSize = 5;
let g_selectedType = POINT;
let g_selectedSegments = 10;

// Set up actions for the HTML UI elements
function addActionsForHTMLUI() {

  document.getElementById('animationYellowOffButton').onclick = function() {g_yellowAnimation=false;};
  document.getElementById('animationYellowOnButton').onclick = function() {g_yellowAnimation=true;};


  document.getElementById('animationMagentaOffButton').onclick = function() {g_magentaAnimation=false;};
  document.getElementById('animationMagentaOnButton').onclick = function() {g_magentaAnimation=true;};
  
  document.getElementById('animationRunOffButton').onclick = function() {g_runAnimation=false;};
  document.getElementById('animationRunOnButton').onclick = function() {g_runAnimation=true;};

  document.getElementById('yellowSlide').addEventListener('mousemove', function() { g_yellowAngle = this.value; renderAllShapes(); });
  document.getElementById('magentaSlide').addEventListener('mousemove', function() { g_magentaAngleR = this.value; g_magentaAngleL = this.value; renderAllShapes(); });

  document.getElementById('angleSlide').addEventListener('mousemove',  function() { g_globalAngle = this.value; renderAllShapes();  });
  
}
function main() {
  // Set up canvas and get gl variables
  setUpWebGL();

  // Set up GLSL shader programs and connect JS variables to GLSL
  connectVariablesToGLSL();

  // Set up actions for the HTML UI Elements
  addActionsForHTMLUI();

  // Register function (event handler) to be called on a mouse press
  // canvas.onmousedown = click;
  canvas.onmousemove = function(ev) { if(ev.buttons == 1) {click(ev) } };

  // Specify the color for clearing <canvas>
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  // Clear <canvas>
  // gl.clear(gl.COLOR_BUFFER_BIT);
  // renderAllShapes();
  requestAnimationFrame(tick);

}

var g_startTime=performance.now() / 1000.0;
var g_seconds=performance.now() / 1000.0 - g_startTime;
// called by browser repeatedly whenever it's time

function tick() {
  // print some debug information so we know we are running
  g_seconds = performance.now() / 1000.0 - g_startTime;
  //console.log(performance.now());

  updateAnimationAngles();

  // draw everything
  renderAllShapes();
  // tell the browser to update again
  requestAnimationFrame(tick);
}


var g_shapesList = [];

function click(ev) {
  // Extract the event click and return it in WebGL
  let [x,y] = convertCoordinatesEventToGL(ev);

  // Create and store a new point object
  let point;
  if (g_selectedType == POINT) {
    point = new Point();
  } else if (g_selectedType == TRIANGLE) {
    point = new Triangle();
  } else if (g_selectedType == CIRCLE){
    point = new Circle();
    point.segments = g_selectedSegments;
  } else if (g_selectedType == PICTURE){
    point = new Picture();

  }
  point.position = [x,y];
  point.color = g_selectedColor.slice();
  point.size = g_selectedSize;
  g_shapesList.push(point);
  
  renderAllShapes();
}

function convertCoordinatesEventToGL(ev) {
  var x = ev.clientX; // x coordinate of a mouse pointer
  var y = ev.clientY; // y coordinate of a mouse pointer
  var rect = ev.target.getBoundingClientRect();

  x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
  y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);

  return([x,y]);
}

function updateAnimationAngles() {
  if (g_yellowAnimation) {
    g_yellowAngle = (20 * Math.sin(g_seconds));
  }
  if (g_magentaAnimation) {
    g_magentaAngleR = (50 * Math.sin(3 * g_seconds));
    g_magentaAngleL = (50 * Math.sin(3 * g_seconds));
  }
   // Right foot
  if (g_runAnimation) {
    var swingAngleR = Math.sin(20 * g_seconds) * maxSwingAngle;
    var liftHeightR = Math.abs(Math.sin(4 * g_seconds)) * maxLiftHeight;
    g_footAngleR = swingAngleR;
    g_footLiftR = liftHeightR;

    // Left foot
    var swingAngleL = Math.sin(20 * g_seconds + Math.PI) * maxSwingAngle; 
    var liftHeightL = Math.abs(Math.sin(4 * g_seconds + Math.PI)) * maxLiftHeight; 
    g_footAngleL = swingAngleL;
    g_footLiftL = liftHeightL;

    // Body rotation
    g_bodyAngle = Math.sin(4 * g_seconds) * 3; 

    // arm rotation
    g_armAngleL = Math.sin(4 * g_seconds) * maxSwingAngle;
    g_armAngleR = Math.sin(4 * g_seconds + Math.PI) * maxSwingAngle;
  
  }
  
}

function renderAllShapes() {
  // Check the time at the start of the function
  var startTime = performance.now();

  // Pass the matrix to u_ModelMatrix.attribute
  var globalRotMat=new Matrix4().rotate(g_globalAngle, 0,1,0);
  gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements);

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  gl.clear(gl.COLOR_BUFFER_BIT);

  //body
  body = new Cube();
  body.color = [1.0, 0.0, 0.0, 1.0];
  body.matrix.translate(-0.25, -0.55, 0.0);
  body.matrix.rotate(g_bodyAngle, 1, 0, 1);
  var bodyCoordinatesMat=new Matrix4(body.matrix);
  body.matrix.scale(0.5, 0.5, 0.5); 
  body.render();

  // right foot
  var footR = new Cube();
  footR.color = [0.0, 0.0, 0.0, 0.0];
  footR.matrix.translate(0.15,-0.7,0.15); 
  footR.matrix.translate(0, g_footLiftR, 0);
  footR.matrix.rotate(g_footAngleR, 1, 0, 0);
  footR.matrix.scale(0.1,0.18,0.15);

  // Render the foot
  footR.render();

  // Left foot
  var footL = new Cube();
  footL.color = [0.0, 0.0, 0.0, 0.0];
  footL.matrix.translate(-0.25,-0.7,0.15); 
  footL.matrix.translate(0, g_footLiftL, 0);
  footL.matrix.rotate(g_footAngleL, 1, 0, 0);
  footL.matrix.scale(0.1,0.18,0.15);

  // Render the foot
  footL.render();


  // left arm
  var armL = new Cube();
  armL.color = [1.0, 0.0, 1.0, 1.0];
  armL.matrix.set(bodyCoordinatesMat);
  armL.matrix.translate(-0.08, 0.65, 0.1);
  armL.matrix.rotate(-g_armAngleL,0,0,-1); // x-axis
  armL.matrix.translate(0, -0.55, 0);
  armL.matrix.scale(0.1,0.4,0.3);
  armL.render();


  // right arm
  var armR = new Cube();
  armR.color = [1.0, 0.0, 1.0, 1.0];
  armR.matrix.set(bodyCoordinatesMat); 
  armR.matrix.translate(0.48, 0.65, 0.1);
  armR.matrix.rotate(-g_armAngleR,0,0,-1); // x-axis
  armR.matrix.translate(0, -0.55, 0);
  armR.matrix.scale(0.1,0.4,0.3);
  armR.render();
  

  // bird head
  var yellow = new Cube();
  // yellow.color = [1,1,0,1];
  yellow.color = [1.0, 1.0, 0.0, 1.0];

  yellow.matrix.setTranslate(0,-0.15,0.05);
  yellow.matrix.rotate(-5,1,0,0); // rotate the arm
  yellow.matrix.rotate(-g_yellowAngle,1,0,0);
  
  var yellowCoordinatesMat=new Matrix4(yellow.matrix);
  yellow.matrix.scale(0.3,0.4,0.3);
  yellow.matrix.translate(-0.5, 0 + 0.1,0);
  yellow.render();


 // Right hari
  var earR = new Cube();
  earR.color = [1.0, 0.0, 0.0, 1.0];

  earR.matrix.set(yellowCoordinatesMat); 

  earR.matrix.translate(-0.03,0.4,0.01);
  earR.matrix.rotate(-g_magentaAngleR,0,0,-1);
  earR.matrix.scale(0.05,0.5,0.1);
  earR.render();

  // Left hair
  var earL = new Cube();
  earL.color = [1.0, 0.0, 0.0, 1.0];

  earL.matrix.set(yellowCoordinatesMat); 

  earL.matrix.translate(-0.03,0.4,0.01); 
  earL.matrix.rotate(-g_magentaAngleL,0,0,1);
  earL.matrix.scale(0.05,0.5,0.1);
  earL.render();

  // check the time at the end of the function and show on web page
  var duration = performance.now() - startTime;
  //sendTextToHTML("numdot: " + len + " ms: " + Math.floor(duration) + " fps: " + Math.floor(1000/duration), "numdot");
  //sendTextToHTML("ms: " + Math.floor(duration) + " fps: " + Math.floor(1000/duration));
}

// Set the text of a HTML element
function sendTextToHTML(text, htmlID) {
  var htmlElm = document.getElementById(htmlID);
  if (!htmlElm) {
    console.log("Failed to get " + htmlID + " from the HTML");
    return;
  }
  htmlElm.innerHTML = text;
}
