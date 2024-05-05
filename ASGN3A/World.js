var VSHADER_SOURCE = `
  precision mediump float;
  attribute vec4 a_Position;
  attribute vec2 a_UV;
  varying vec2 v_UV;
  uniform mat4 u_ModelMatrix;
  uniform mat4 u_GlobalRotateMatrix;
  uniform mat4 u_ViewMatrix;
  uniform mat4 u_ProjectionMatrix;
  void main() {
    gl_Position = u_ProjectionMatrix * u_ViewMatrix * u_GlobalRotateMatrix * u_ModelMatrix * a_Position;
    v_UV = a_UV;
  }`;

// Fragment shader program
var FSHADER_SOURCE = `
  precision mediump float;
  varying vec2 v_UV;
  uniform vec4 u_FragColor;
  uniform sampler2D u_Sampler0;
  uniform sampler2D u_Sampler1;
  uniform sampler2D u_Sampler2;
  uniform int u_whichTexture;
  void main() {
    if (u_whichTexture == -2) {
      gl_FragColor = u_FragColor;
    } else if (u_whichTexture == -1) {
      gl_FragColor = vec4(v_UV,1.0,1.0);
    } else if (u_whichTexture == 0) {
      gl_FragColor = texture2D(u_Sampler0, v_UV);
    } else if (u_whichTexture == 1) {
      gl_FragColor = texture2D(u_Sampler1, v_UV);
    } else if (u_whichTexture == 2) {
      gl_FragColor = texture2D(u_Sampler2, v_UV);
    } else {
      gl_FragColor = vec4(1.0, 0.2, 0.2, 1.0);
    }
  }`;


// Global variables
let canvas;
let gl;
let a_Position;
let a_UV;
let u_FragColor;
let u_ModelMatrix;
let u_GlobalRotateMatrix;
let u_ViewMatrix;
let u_ProjectionMatrix;
let u_Sampler0;
let u_Sampler1;
let u_Sampler2;
let u_whichTexture;
let camera = new Camera();
let currentAngle=[0.0,0.0];

function main() {
  
  // Set up canvas and GL variables
  setupWebGL();

  // Set up GLSL shader programs and connect GLSL variables
  connectVariablesToGLSL();

  // Set up actions for the HTML UI elements
  addActionsForHTMLUI();
  document.onkeydown = keydown;

  initTextures();
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  // Clear <canvas>
  requestAnimationFrame(tick);

  cameraMove(canvas, currentAngle);
}


function initTextures() {
  var image0 = new Image();  // Create the image object
  if (!image0) {
    console.log('Failed to create the image object');
    return false;
  }

  var image1 = new Image();  // Create the image object
  if (!image1) {
    console.log('Failed to create the image object');
    return false;
  }

  var image2 = new Image();  // Create the image object
  if (!image2) {
    console.log('Failed to create the image object');
    return false;
  }

  // Register the event handler to be called on loading an image
  image0.onload = function(){ sendImageToTEXTURE0(image0); };
  // Tell the browser to load an image
  image0.src = 'resources/wood.jpg';

  // Add more texture loading
  image1.onload = function(){ sendImageToTEXTURE1(image1); }
  
  image1.src = 'resources/grass.jpg';

  
  image2.onload = function(){ sendImageToTEXTURE2(image2); }
  
  image2.src = 'resources/leaf.jpg';
  
  return true;
}

function sendImageToTEXTURE0(image) {
  var texture0 = gl.createTexture();   // Create a texture object
  if (!texture0) {
    console.log('Failed to create the texture object');
    return false;
  }

  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); // Flip the image's y axis
  // Enable texture unit0
  gl.activeTexture(gl.TEXTURE0);
  // Bind the texture object to the target
  gl.bindTexture(gl.TEXTURE_2D, texture0);

  // Set the texture parameters
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  // Set the texture image
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
  
  // Set the texture unit 0 to the sampler
  gl.uniform1i(u_Sampler0, 0);
  
  console.log('finished loadTexture');
}

function sendImageToTEXTURE1(image) {
  var texture1 = gl.createTexture();   // Create a texture object
  if (!texture1) {
    console.log('Failed to create the texture object');
    return false;
  }

  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); // Flip the image's y axis
  // Enable texture unit0
  gl.activeTexture(gl.TEXTURE1);
  // Bind the texture object to the target
  gl.bindTexture(gl.TEXTURE_2D, texture1);

  // Set the texture parameters
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  // Set the texture image
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
  
  // Set the texture unit 0 to the sampler
  gl.uniform1i(u_Sampler1, 1);
  
  console.log('finished loadTexture');
}

function sendImageToTEXTURE2(image) {
  var texture2 = gl.createTexture();   // Create a texture object
  if (!texture2) {
    console.log('Failed to create the texture object');
    return false;
  }

  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); // Flip the image's y axis
  // Enable texture unit0
  gl.activeTexture(gl.TEXTURE2);
  // Bind the texture object to the target
  gl.bindTexture(gl.TEXTURE_2D, texture2);

  // Set the texture parameters
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  // Set the texture image
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
  
  // Set the texture unit 0 to the sampler
  gl.uniform1i(u_Sampler2, 2);
  
  console.log('finished loadTexture');
}



// Setup WebGL
function setupWebGL() {
  // Retrieve <canvas> element
  canvas = document.getElementById('webgl');

  // Get the rendering context for WebGL
  gl = canvas.getContext("webgl", { preserveDrawingBuffer: true});

  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }

  gl.enable(gl.DEPTH_TEST);
}


// Initialize shaders and connect JS Variables to GLSL
function connectVariablesToGLSL() {
  // Initialize shaders
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to intialize shaders.');
    return;
  }

  // Enable alpha blending for transparancy
  // Derived from WebGL Programming Guide Textbook Chapter 10: Alpha Blending
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

  a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if (a_Position < 0) {
    console.log('Failed to get the storage location of a_Position');
    return;
  }

  a_UV = gl.getAttribLocation(gl.program, 'a_UV');
  if (a_UV < 0) {
    console.log('Failed to get the storage location of a_UV');
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

  u_ViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix');
  if (!u_ViewMatrix) {
    console.log('Failed to get the storage location of u_ViewMatrix');
    return;
  }

  u_ProjectionMatrix = gl.getUniformLocation(gl.program, 'u_ProjectionMatrix');
  if (!u_ProjectionMatrix) {
    console.log('Failed to get the storage location of u_ProjectionMatrix');
    return;
  }

  u_Sampler0 = gl.getUniformLocation(gl.program, 'u_Sampler0');
  if (!u_Sampler0) {
    console.log('Failed to get the storage location of u_Sampler0');
    return false;
  }

  u_Sampler1 = gl.getUniformLocation(gl.program, 'u_Sampler1');
  if (!u_Sampler1) {
    console.log('Failed to get the storage location of u_Sampler1');
    return false;
  }

  u_Sampler2 = gl.getUniformLocation(gl.program, 'u_Sampler2');
  if (!u_Sampler2) {
    console.log('Failed to get the storage location of u_Sampler1');
    return false;
  }

  u_whichTexture = gl.getUniformLocation(gl.program, 'u_whichTexture');
  if (!u_whichTexture) {
    console.log('Failed to get the storage location of u_whichTexture');
    return false;
  }

  var identityM = new Matrix4();
  gl.uniformMatrix4fv(u_ModelMatrix, false, identityM.elements);
}


// Global variables related to UI elements
let g_stats = 0; // Debug stats

let g_globalAngleX = 180;
let g_globalAngleY = 0;

let g_longBoxAngle = 0;
let g_smallBoxAngle = 0;

let g_yellowAnimation = false;
let g_magentaAnimation = false;

// Set up actions for the HTML UI elements
function addActionsForHTMLUI() {
  // Slider Events
  document.getElementById('bottomBox').addEventListener('mousemove', function() { g_longBoxAngle = parseInt(this.value); renderScene(); }  );
  document.getElementById('topBox').addEventListener('mousemove', function() { g_smallBoxAngle = parseInt(this.value); renderScene(); });

  document.getElementById('on_animLong').onclick = function() { g_yellowAnimation = true; };
  document.getElementById('off_animLong').onclick = function() { g_yellowAnimation = false; };
  document.getElementById('on_animSmall').onclick = function() { g_magentaAnimation = true; };
  document.getElementById('off_animSmall').onclick = function() { g_magentaAnimation = false; };

  //document.getElementById('xcamera_slider').addEventListener('mousemove', function() { g_globalAngleX = parseInt(this.value); renderScene(); });
  //document.getElementById('ycamera_slider').addEventListener('mousemove', function() { g_globalAngleY = parseInt(this.value); renderScene(); });


  // Button Events (statistics and drawing)
  //document.getElementById('stats').onclick = function() { g_stats = 1; };
}


var g_startTime = performance.now()/1000.0;
var g_seconds = performance.now()/1000.0 - g_startTime;
let lastFrameTime = performance.now();
function tick() {
  let currentTime = performance.now();
  let deltaTime = currentTime - lastFrameTime;
  g_seconds = performance.now()/1000.0-g_startTime;

  // 计算 FPS
  let fps = Math.round(1000 / deltaTime);

  // 更新 lastFrameTime
  lastFrameTime = currentTime;

  // 更新 HTML 中的 FPS 显示
  document.getElementById('fpsDisplay').textContent = `FPS: ${fps}`;

  updateAnimationAngles();

  renderScene();

  requestAnimationFrame(tick);
}


function updateAnimationAngles() {
  if (g_yellowAnimation) {
    g_longBoxAngle = (45*Math.sin(g_seconds));
  }
  if (g_magentaAnimation) {
    g_smallBoxAngle = (45*Math.sin(3*g_seconds));
  }

}


function keydown(event) {
  switch (event.key) {
    case 'w':
      camera.moveForward();
      break;
    case 'a':
    camera.moveLeft();
      break;
    case 's':
      camera.moveBackwards();
      break;
    case 'd':
      camera.moveRight();
      break;
    case 'q':
      camera.panLeft();
      break;
    case 'e':
      camera.panRight();
      break;
    default:
      break;
  }
  renderScene();
}

function cameraMove(canvas, currentAngle) {
  let dragging = false;
  let lastX = -1;
  let lastY = -1;
  
  canvas.addEventListener('mousedown', function(ev) {
      dragging = true;
      lastX = ev.clientX;
      lastY = ev.clientY;
  });

  canvas.addEventListener('mouseup', function(ev) {
      dragging = false;
  });

  canvas.addEventListener('mousemove', function(ev) {
      if (dragging) {
          let deltaX = ev.clientX - lastX;
          let deltaY = ev.clientY - lastY;
          
          // 根据鼠标移动的方向和速度调整相机的角度
          let factor = 0.5;
          currentAngle[0] += factor * deltaY;
          currentAngle[1] += factor * deltaX;

          // 限制相机俯仰角度
          currentAngle[0] = Math.max(-90, Math.min(90, currentAngle[0]));

          // 更新相机的全局旋转矩阵
          let rotationMatrix = new Matrix4()
              .rotate(currentAngle[0], 1, 0, 0)
              .rotate(currentAngle[1], 0, 1, 0);
          gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, rotationMatrix.elements);
          renderScene(); 

          lastX = ev.clientX;
          lastY = ev.clientY;
      }
  });
}


function renderScene() {
  var startTime = performance.now(); // Debug information
  
  var rotationMatrix = new Matrix4()
        .rotate(currentAngle[0], 1, 0, 0)
        .rotate(currentAngle[1], 0, 1, 0);
  
  // Set view of view matrix
  var viewMat = new Matrix4();
  viewMat.setLookAt(
    camera.eye.elements[0], camera.eye.elements[1], camera.eye.elements[2], 
    camera.at.elements[0], camera.at.elements[1], camera.at.elements[2], 
    camera.up.elements[0], camera.up.elements[1], camera.up.elements[2]
  ).multiply(rotationMatrix);
  gl.uniformMatrix4fv(u_ViewMatrix, false, viewMat.elements);

  
  // Set perspective of projection matrix
  var projMat = new Matrix4();
  projMat.setPerspective(camera.fov, canvas.width/canvas.height, .1, 1000);  
  gl.uniformMatrix4fv(u_ProjectionMatrix, false, projMat.elements);

  var globalRotateMatrix = new Matrix4().rotate(currentAngle[0], 1.0, 0.0, 0.0);
  globalRotateMatrix.rotate(currentAngle[1], 0.0, 1.0, 0.0);

  // Set global rotation matrix
  var globalRotMat = new Matrix4();
  // globalRotMat.translate(0, g_globalTransformZ, 0);
  globalRotMat.rotate(g_globalAngleX,0,1,0);
  globalRotMat.rotate((g_globalAngleY % 360), 1, 0, 0);
  // globalRotMat.scale(0.9, 0.9, 0.9);
  gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements)
  
  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.clear(gl.COLOR_BUFFER_BIT);


  // Ground
  var floor = new Cube();
  floor.color = [1.0, 1.0, 1.0, 1.0];
  floor.textureNum = 1;
  floor.matrix.translate(0, -.75, 0.0);
  floor.matrix.scale(32,-.25, 32);
  floor.matrix.translate(-.5, 0, -0.5);
  floor.render();


  // Skybox
  var skybox = new Cube();
  skybox.color = [135/255, 206/255, 235/255, 1.0];
  skybox.textureNum = -2;
  skybox.matrix.scale(50, 50, 50);
  skybox.matrix.translate(-.5, -.5, -0.5);
  skybox.render();


  var body = new Cube();
  body.color = [1.0,0.0,0.0,1.0];
  body.textureNum = 0;
  body.matrix.translate(-.25, -.75, 0.0);
  body.matrix.rotate(-5, 1, 0, 0);
  body.matrix.scale(0.5, .3, .5);
  body.render();


  var leftArm = new Cube();
  leftArm.color = [1, 1, 0, 1];
  leftArm.textureNum = 0;
  leftArm.matrix.setTranslate(0, -.5, 0.0);
  leftArm.matrix.rotate(-5, 1, 0, 0);
  leftArm.matrix.rotate(g_longBoxAngle, 0, 0, 1);
  var yellowCoordinatesMat = new Matrix4(leftArm.matrix);
  leftArm.matrix.scale(0.25, .7, .5);
  leftArm.matrix.translate(-.5, 0, 0);
  leftArm.render();


  var box = new Cube();
  box.color = [1, 0, 1, 1];
  box.textureNum = 2;
  box.matrix = yellowCoordinatesMat;
  box.matrix.translate(0, 0.65, 0);
  box.matrix.rotate(g_smallBoxAngle, 0, 0, 1);
  box.matrix.scale(.3, .3, .3);
  box.matrix.translate(-.5, 0, -0.001);
  box.render();


  // Debug information
  var duration = performance.now() - startTime;
  if (g_stats === 1) {
    sendTextToHTML("fps: " + Math.floor(1000/duration), "numdot");
  }
}



// Debug stats
function sendTextToHTML(text, htmlID) {
  var htmlElm = document.getElementById(htmlID);
  if (!htmlElm) {
    console.log("Failed to get " + htmlID + " from HTML");
    return;
  }
  htmlElm.innerHTML = text;
}