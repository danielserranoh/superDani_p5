/* TRASPASO DE supedDani.pde a javascript para correr en P5 

    DATOS DE LOS RIZOS - SE CARGARAN DESDE JSON
    El formato del json para las coordenadas es 
      "coord": [ 
        vertice1, 
        puntoControlVertice1to2, puntoControlVertice2to1, 
        vertice2, 
        puntoControlVertice2to3, puntoControlVertice3to2, 
        vertice3 
      ]
    este formato permite detectar errores en la escritura y en la estructura
    En el futuro molaría cargar desde un SVG, posiblemente habría que normalizar
*/

/* ######################## GLOBAL VARIABLES #################################### */
// SYSTEM
var window__width = 0;
var window__height = 0;

var superDani_coord;
var eye_mode = "normal";
var CONTEXT_MODE ="breeze";
var wind_speed = 0;
var wind_offset = 0;
var theta = 0.0;
var SCALE_FACTOR = 1830;

var eye_separation = [124, -20];  //<---------------------------- WARNING TESTING


/* ##### FLAGS ##### */

// flag de testing: 1 = activado;
var construction = 1;



function preload() {
  // Get the most recent superDani_coord in the database
  // read form GITHUB
  /* por algun oscuro motivo funciona sin comentar. Pero lo que quiero es cargar el de local, y si falla el de github
    var url =
    'https://github.com/danielserranoh/superDani_p5/' +
    'data/superDani_coord.json';
    superDani_coord = loadJSON(url, drawFromJson, failedJson);
  */
  // read from local
  superDani_coord = loadJSON('/data/superDani_coord.json');
}


function setup() {
  //load screen size at startup
  var window__width= windowWidth;
  var window__height = windowHeight;
  //setup the canvas
    createCanvas(1920, 1920);
    colorMode(RGB,255);
    //background(255,255,255);
  //setup the stroke
    stroke(10,10,10);
    noFill();
    strokeCap(ROUND);

  // frameRate(5);

  }


function draw(){
  background(250,250,252,102); // drawing the background as the fist function should help redraw the sceen every frame
  // Note, by allowing some transparency, there is a nice "following+blurring" effect


  // in order to be able to separate concerns, the angle is going to be referenced to the p5's environment variable frameCount
  //theta += 0.02;
  theta = frameCount/50;
  translate(-60,-260);

  // Launches all the functions drawing superDani
  
  var num_strokes = superDani_coord.objects.length;  // calculates the number of strokes (objects) to draw
  for (var istroke = 0; istroke < num_strokes; istroke +=1){
    drawCharacterFromJson(istroke);
  }
  //drawEyes();
  drawOjito();
  // then sets up the way the hair is going to move
  var angle = wind_speed + pow(theta, wind_speed*4/6);
  wind_offset = 5*(wind_speed+pow(2,wind_speed));

  var x = 0;
  var y = 0;
   // Calculate y value based off of sine function
   x = map(cos(theta-angle), -1, 1, -40, 40)- wind_offset;
   y = map(sin(theta + angle), -1, 1, -20, 20);
   var y1 = map(sin(theta + angle), -1, 1, -40, 40);
   var y2 = map(sin(theta*4/10 + angle/2), -1, 1, -25, 25);
   var y3 = map(sin(theta*9/10 + angle), -1, 1, -40, 40);
   var y4 = map(sin(theta + angle), -1, 1, -40, 40);





//  A context is going to make react superDani in a certain way.
//   Basically. chooses a transformation to apply to transform SuperDani
    switch (CONTEXT_MODE) {
      case "shock":
        drawShock(rizo0,38, x, y);
        drawShock(rizo1, 32, x, y1);
        drawShock(rizo2, 28, x, y2);
        drawShock(rizo3, 30, x, y3);
        drawShock(rizo3b, 25, x, y3*1/4);
        drawShock(rizo4, 32, x, y4);
        drawShock(rizo4b, 25, x*12/10, y4);
        drawShock(rizo5, 30, x, y1/2);
        drawShock(rizo5b, 24, x*12/10, y1/2);
        drawShock(rizo6, 25, x, y/3);
        drawShock(rizo6b, 24, x, y/3);
      break;
      case "breeze":
        stroke(10,10,10);
         drawRizo(0, x, y);
         drawRizo(1, x, y1);
         drawRizo(2, x, y2);
         drawRizo(3, x, y3);
         drawRizo(7, x, y3*1/4);
         drawRizo(4, x, y4);
         drawRizo(8, x*12/10, y4);
         drawRizo(5, x, y1/2);
         drawRizo(9, x*12/10, y1/2);
         drawRizo(6, x, y/3);
         drawRizo(10, x, y/3);
      break;
      case "fear":
         drawEjeRizo(rizo0, 38, x, y);
         drawEjeRizo(rizo1, 32, x, y1);
         drawEjeRizo(rizo2, 28, x, y2);
         drawEjeRizo(rizo3, 30, x, y3);
         drawEjeRizo(rizo3b, 25, x, y3*1/4);
         drawEjeRizo(rizo4, 32, x, y4);
         drawEjeRizo(rizo4b, 25, x*12/10, y4);
         drawEjeRizo(rizo5, 30, x, y1/2);
         drawEjeRizo(rizo5b, 24, x*12/10, y1/2);
         drawEjeRizo(rizo6, 25, x, y/3);
         drawEjeRizo(rizo6b, 24, x, y/3);
      break;

    }

 }


// This funcion uses a keystroke to assign a CONTEXT
// The idea is that a combination of transformations can create a mood.
// The mood is a function of the context


function keyPressed() {
  // local variables
  var x = 0;

  if (key == 'W') {
    if (wind_speed < 5){
      wind_speed += 1;
    }
    else if(wind_speed > 3){
      eye_mode = "suffering";
    }
  }
  else if (key == 'w') {
    if (wind_speed > 0){
      wind_speed -= 1;
    }
  }
  else if(key == 'f' || key == 'F') {
      eye_mode = "normal";
      CONTEXT_MODE = "fear";

    }

   else if (key == 'l' || key == 'L') {
      eye_mode = "left";

    }
    else if (key == 'r' || key == 'R') {
       eye_mode = "right";
    }
    else if (key == 's' || key == 'S') {
      CONTEXT_MODE = "shock";
      wind_speed = 0;
      eye_mode = "suffering";
    }
    else {
      CONTEXT_MODE = "breeze";
      eye_mode = "normal";
      // uhmmmmm
    }

  }


function drawEyes() {
  // local variables
  var x = 0;
  var y = 0;

   switch(eye_mode){
   case "normal":
      //look normal
        bezier(1171+x,1070, 1168+x,1074, 1159+x,1062, 1159+x,1054);
        bezier(1170+x,1064, 1177+x,1074, 1171+x,1053, 1161+x,1053);
      x = eye_separation[0];
      y = eye_separation[1];
      beginShape();
        vertex(1171+x,1070+y);
        bezierVertex(1168+x,1074+y, 1159+x,1062+y, 1159+x,1054+y);
      endShape();
      beginShape();
        vertex(1170+x,1064+y);
        bezierVertex(1177+x,1074+y, 1171+x,1053+y, 1161+x,1053+y);
      endShape();
      break;
   case "left":
      //wlook left
      beginShape();
        vertex(1147+x,1072);
        bezierVertex(1144+x,1076, 1142+x,1061, 1159+x,1054);
      endShape();
      beginShape();
        vertex(1186+x,1057);
        bezierVertex(1193+x,1061, 1152+x,1054, 1142+x,1053);
      endShape();
      x = eye_separation[0];
      beginShape();
        vertex(1147+x,1072);
        bezierVertex(1144+x,1076, 1142+x,1061, 1159+x,1054);
      endShape();
      beginShape();
        vertex(1186+x,1057);
        bezierVertex(1193+x,1061, 1152+x,1054, 1142+x,1053);
      endShape();
      break;
    case "right":
      //look right
      // hay que cambiar las coordenadas
      bezier(1171+x,1070, 1168+x,1074, 1159+x,1062, 1159+x,1054);
      bezier(1170+x,1064, 1177+x,1074, 1171+x,1053, 1161+x,1053);
      x = eye_separation[0];
      y = eye_separation[1];
      bezier(1171+x,1070+y, 1168+x,1074+y, 1159+x,1062+y, 1159+x,1054+y);
      bezier(1170+x,1064+y, 1177+x,1074+y, 1171+x,1053+y, 1161+x,1053+y);
      //drawColoretes();
      break;
    case "suffering":
      //close eyes
      bezier(1175+x,1082, 1181+x,1069, 1152+x,1069, 1142+x,1069);
      bezier(1174+x,1074, 1170+x,1075, 1171+x,1053, 1141+x,1067);
      x = eye_separation[0];
      y = eye_separation[1];
      bezier(1175+x,1082, 1181+x,1069, 1152+x,1069, 1142+x,1069);
      bezier(1174+x,1074, 1170+x,1075, 1171+x,1053, 1141+x,1067);
      break;
    }

}



function drawRizo(num_rizo, xpos, ypos) {
  // Test if the object is valid with a logical XOR)
  // alternative using the ternary operator if(superDani_coord.objects[num_rizo].type ? ! "rizo" : "rizillo"){
  if ( !superDani_coord.objects[num_rizo].type == "rizo" != !superDani_coord.objects[num_rizo].type =="rizillo"){
    console.log("error en objeto pasado a drawRizo. Se ha pasado " + superDani_coord.objects[num_rizo].type + " Verificar en json objeto: " + num_rizo);
    //this should be terminated here
    
  }
  // local variables
  var scale_factor = SCALE_FACTOR;
  var x = xpos;
  var y = ypos;
  var data_points = superDani_coord.objects[num_rizo].coord;
  var num_coord = data_points.length;
  var num_points = (data_points.length/2-2)/3;
  var rizo_points = new Array(num_coord); //<---------------------------- WARNING TESTING
  var weight = scale_factor * superDani_coord.objects[num_rizo].weight;
  //if testing the integrity of the matrix is needed:
  //data_points.length debe must be !ODD =>  mod(data_points.length/2)==0
  //and check for mod((data_points.length-2)/3)==0
  
  if (superDani_coord.objects[num_rizo].type == "rizo"){
    first_moving_coord = 4; // Adds X, Y to every coordinate but the origin vertex and its handler (4 first coordinates)
      for(coord=0; coord < 4; coord+=1) {
        rizo_points[coord] = scale_factor * data_points[coord];
      }
   } else if (superDani_coord.objects[num_rizo].type == "rizillo"){
    first_moving_coord = 0; // the behaviour must be different between a "rizillo" and a "rizo"
   }

  // // Adds X, Y any coordinate >= first_moving_coord coordinate
  for(var icoord=first_moving_coord; icoord < num_coord-1; icoord +=2){
    rizo_points[icoord] = scale_factor * data_points[icoord] + x;
    rizo_points[icoord+1] = scale_factor * data_points[icoord+1] + y;
  }

  //rizo_points = scale_factor * rizo_points;  // WHY IS THIS NOT WORKING?
  strokeWeight(weight);

  for(var point = 0; point < num_points+1; point += 1) {
    var c = point*6;  // coordenada inicial
    bezier(
      rizo_points[c],rizo_points[c+1], 
      rizo_points[c+2],rizo_points[c+3], rizo_points[c+4],rizo_points[c+5], 
      rizo_points[c+6],rizo_points[c+7]);
    // Si el flag constuction ON entonces dibuja las constuctoras de las bezier
    if (construction == 1){
      //configura trazos
      stroke(255,0,255,128);
      strokeWeight(2);
      //DIBUJA LAS CURVAS
      bezier(
        data_points[c],data_points[c+1], 
        data_points[c+2],data_points[c+3], data_points[c+4],data_points[c+5], 
        data_points[c+6],data_points[c+7]);
      // DIBUJA LOS PUNTOS
      ellipse(data_points[c],data_points[c+1],weight/2,weight/2);
      ellipse(data_points[c+6],data_points[c+7],weight/2,weight/2);
      // DIBUJA LOS PUNTOS DE CONTROL
      ellipse(data_points[c+2],data_points[c+3],weight/4,weight/4);
      ellipse(data_points[c+4],data_points[c+5],weight/4,weight/4);
      //TRAZA LAS LINEAS DE CONTROL
      line(data_points[c],data_points[c+1],data_points[c+2],data_points[c+3]);
      line(data_points[c+4],data_points[c+5],data_points[c+6],data_points[c+7]);
      //reconfigura trazos - No creo que esto sea una buena práctica ¿No hay un get?

      stroke(10,10,10);
      strokeWeight(weight);
    }
    // fin de las constructoras
  }

}


/* ######################## DEBUG MODE ON ####################################*/
function drawShock(data_points, weight, xpos, ypos) {
  var x = 2*xpos;
  var y = 2*ypos;
  var num_coord = data_points.length;
  var num_points = (data_points.length/2-2)/3;
  var rizo_points = new Array(num_coord);
  //testar la integridad de la matriz:
  //data_points.length debe ser par  mod(data_points.length/2)=0
  //y cumplir que mod((data_points.length-2)/3)=0

  var eshock = round(xpos);  // redondea la posición de x para sacar un trigger para el cambio de color

    strokeWeight(weight);
//  if ( eshock%2 == 0 ) {  // Cambio de color por stroke. en función de si eshock es par o impar
  if (round(random(2))==1) {
    stroke(255, 196, 10);
    y=-y;
  }
  else {
   stroke(196, 168, 148);
  }

  rizo_points[0] = data_points[0];
  rizo_points[1] = data_points[1];
  rizo_points[2] = data_points[2];
  rizo_points[3] = data_points[3];
  // Suma X e Y a todas las coordenadas menos las del punto de origen y su manipulador (4 primeras coordenadas)
  for(var coord=4; coord < num_coord-1; coord +=2){
    //if (round(random(2))==2) {x=-x;}
    rizo_points[coord] = data_points[coord]+x ;
    rizo_points[coord+1] = data_points[coord+1]+y ;
  }
  line(rizo_points[0],rizo_points[1], rizo_points[6]-random(weight/2),rizo_points[7]-random(weight/2));

  for(var point = 1; point < num_points; point += 1) {
    var c = point*6;  // coordenada inicial
    var n = 2*(point+1);
    strokeWeight(weight/2+random(weight/2));
    line(rizo_points[c],rizo_points[c+1], random(n)+rizo_points[c+6],random(n)+rizo_points[c+7]);

    }
  //stroke(48,48,48);
}

  /* ######################## DEBUG MODE OFF #################################### */






/* ######################## DEBUG MODE ON ####################################
function drawColoretes() {
  var x = 0;
  var y = 0;

  //ellipse(1160+x,1110+y,50,20);
  //ellipse(1160+x,1070+y,20,0);
  x = eye_separation[0];
  y = eye_separation[1];
  strokeWeight(0);
  //ellipse(1160+x,1070+y,20,0);
  fill(255,0,0,100);
  push();
   translate(1190,1110);
   rotate(atan(y/x));
   ellipse(x/2,y/2+20,x*2,40);
  pop();
  noFill();

}


  ######################## DEBUG MODE OFF #################################### */

/* ######################## DEBUG MODE ON #################################### */
function drawEjeRizo(data_points, weight, xpos, ypos) {
  // Se trata de conectar el punto de origen y el de final del rizo
  // este eje será el director de como se encoje o ensancha el rizo
  // Se puede usar para el efecto de la lluvia y para el susto

  // SUSTO: todos los puntos deberían de pegarse al eje.
  // El problema es como desenrroscar el rizo, pero es básicamente un problema de rotación
  var num_coord = data_points.length;
  var num_points = (data_points.length/2-2)/3;
  var rizo_points = new Array(4);
  //testar la integridad de la matriz:
  //data_points.length debe ser par  mod(data_points.length/2)=0
  //y cumplir que mod((data_points.length-2)/3)=0
  strokeWeight(weight);
  rizo_points[0] = data_points[0];
  rizo_points[1] = data_points[1];
  rizo_points[2] = data_points[num_coord-2];
  rizo_points[3] = data_points[num_coord-1];
  line(rizo_points[0], rizo_points[1], rizo_points[2], rizo_points[3]);

}

  /*######################## DEBUG MODE OFF #################################### */

/* -----------------------
DEV - testing This
*/

function drawOjito() {
  
  var scale_factor = SCALE_FACTOR;
  //var data_points = superDani_coord.objects.OjoD.coord; // no funciona. ¿Como lo puedo hacer por el nombre?
  var data_points = superDani_coord.objects[13].coord; // OJOD
  var weight = superDani_coord.objects[13].weight;
  for(var i=0; i<data_points.length; i++) {
    data_points[i] *= scale_factor;
  }
  stroke(10,10,10);
  strokeWeight(weight*scale_factor);
  beginShape();
    vertex(data_points[1],data_points[2]);
    bezierVertex(data_points[3],data_points[4], data_points[5],data_points[6], data_points[7],data_points[8]);
    bezierVertex(data_points[9],data_points[10], data_points[11],data_points[12], data_points[13],data_points[14]);
  endShape();
}

function drawFromJson (character_data) {
  console.log("file loaded")
  var num_strokes = character_data.objects.length;
  for (var istroke = 0; istroke < num_trazos; istroke +=1){
    drawRizoFromJson(istroke);
  }
  
}

function failedJson(error){
  console.log("Error en loadJSON " + error);
}

function drawCharacterFromJson(num_stroke) {
  var scale_factor = SCALE_FACTOR;
  var x = 0;
  var y = 0;
  var data_points = superDani_coord.objects[num_stroke].coord;
  var num_coord = data_points.length;
  var num_points = (data_points.length/2-2)/3;
  var stroke_points = new Array(num_coord);
  
  var weight = scale_factor * superDani_coord.objects[num_stroke].weight;
  
  // Suma X e Y a todas las coordenadas menos las del punto de origen y su manipulador (4 primeras coordenadas)
  // además, escala para que se ajuste
  
 
  for(var icoord=0; icoord < num_coord-1; icoord +=2){
    stroke_points[icoord] = scale_factor * data_points[icoord] + x;
    stroke_points[icoord+1] = scale_factor * data_points[icoord+1] + y;
    
  }
  strokeWeight(weight);
  stroke(0,250,250);
  for(var point = 0; point < num_points+1; point += 1) {
    var c = point*6;  // coordenada inicial
    bezier(
      stroke_points[c],stroke_points[c+1], 
      stroke_points[c+2],stroke_points[c+3], stroke_points[c+4],stroke_points[c+5], 
      stroke_points[c+6],stroke_points[c+7]);
  }
  stroke(10,10,10);
}


/*

class Rizo {
  // Variables
  var xpos;
  var ypos;
  var weight;

  // Contstructor
  Rizo() {
    // Calcula el número de puntos de la curva
    //contruye el vértice inicial

  }

}
*/
