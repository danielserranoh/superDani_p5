/* TRASPASO DE supedDani.pde a javascript para correr en P5 */

//Global Varibles
var superDani_coord;
var eye_mode = "normal";
var CONTEXT_MODE ="breeze";
var wind_speed = 0;
var wind_offset = 0;
var theta = 0.0;

var eye_separation = [124, -20];  //<---------------------------- WARNING TESTING



//DATOS DE LOS RIZOS - SE CARGARAN EN EL FUTURO DESDE CSV o SVG y hay que normalizarlos
// formato: (vertice1, puntoControlVertice1to2, puntoControlVertice2to1, vertice2, puntoControlVertice2to3, puntoControlVertice3to2, vertice3);
var rizo0 = [1368,809, 1449,716, 1636,548, 1591,446,  1552,336, 1469,300, 1396,328, 1322,356, 1275,431, 1275,497, 1275,562, 1315,609, 1358,609, 1401,609, 1455,545, 1435,497, 1415,449, 1368,450, 1346,469];
var rizo1 = [1300,817, 1273,826, 1189,759, 1181,663, 1173,567, 1361,261, 1202,87, 1137,30, 1032,-61, 835,58, 679,175, 716,312, 772,367, 818,405, 893,426, 930,379, 967,332, 977,249, 919,210, 861,171, 820,191, 820,245];
var rizo2 = [1127,836, 1050,867, 1004,788, 1004, 720, 1004,652, 1099,613, 1084,530, 1069,447, 960,456, 919,487, 878,518, 853,578, 886,614, 919,650, 999,632, 968,575];
var rizo3 = [1033,863, 828,927, 691,517, 656,417, 621,317, 552,103, 342,58, 132,13, -11,259, 1,360, -5,453, 135,574, 242,508, 289,477, 286,381, 236,340, 191,303, 158,360, 167,377];
var rizo3b = [451,194, 386,182, 293,210, 305,304, 317,398, 507,346, 393,251];
var rizo4 = [747,906, 670,937, 614,843, 624,790, 634,737, 680,677, 634,580, 588,483, 488,498, 446,537, 404,576, 423,648, 456,684, 489,720, 569,702, 539,645];
var rizo4b = [246,635, 187,584, 134,655, 139,694, 144,733, 182,742, 203,694];
var rizo5 = [791,1063, 685,1046, 660,980, 578,867, 496,754, 379,689, 289,762, 199,835, 247,935, 287,988, 327,1041, 414,1068, 456,992, 498,916, 356,831, 356,980];
var rizo5b = [175,806, 84,806, -33,851, 65,1004, 163,1157, 242,965, 139,975];
var rizo6 = [754,1156, 684,1098, 555,1110, 569,1244, 583,1378, 781,1307, 700,1210, 680,1186, 657,1199, 657,1215];
var rizo6b = [877,1218, 818,1167, 772,1220, 777,1259, 782,1298, 836,1306, 827,1254];
var careto = [1036,1344,1053,1344, 1056,1448, 1207,1418, 1358,1388, 1443,1272, 1443,1178,1443,1084, 1378,942, 1368,902, 1348,861, 1348,831, 1368,809];


// flag de testing: 1 = activado;
var construction = 1;

function preload() {
  // Get the most recent superDani_coord in the database
  // read from GITHUB
  /*var url =
   'https://github.com/danielserranoh/superDani_p5/' +
    'data/superDani_coord.json';
  superDani_coord = loadJSON(url);
  */
  // read from local
  superDani_coord = loadJSON('/data/superDani_coord.json');
}


function setup() {
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


  // in order to be able to separate concerns, the angle is going to be referenced to the p5 system variable frameCount
  //theta += 0.02;
  theta = frameCount/50;
  translate(0,-200);

  // Launches all the functions drawing superDani
  drawFace();
  drawBody();
  drawEyes();
  drawRizoFromJson();
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


// Launches all the functions drawing the hair
   drawRizo(rizo0, 38, x, y);
   drawRizo(rizo1, 32, x, y1);
   drawRizo(rizo2, 28, x, y2);
   drawRizo(rizo3, 30, x, y3);
   drawRizillo(rizo3b, 25, x, y3*1/4);
   drawRizo(rizo4, 32, x, y4);
   drawRizillo(rizo4b, 25, x*12/10, y4);
   drawRizo(rizo5, 30, x, y1/2);
   drawRizillo(rizo5b, 24, x*12/10, y1/2);
   drawRizo(rizo6, 25, x, y/3);
   drawRizo(rizo6b, 24, x, y/3);



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
         drawRizo(rizo0, 38, x, y);
         drawRizo(rizo1, 32, x, y1);
         drawRizo(rizo2, 28, x, y2);
         drawRizo(rizo3, 30, x, y3);
         drawRizillo(rizo3b, 25, x, y3*1/4);
         drawRizo(rizo4, 32, x, y4);
         drawRizillo(rizo4b, 25, x*12/10, y4);
         drawRizo(rizo5, 30, x, y1/2);
         drawRizillo(rizo5b, 24, x*12/10, y1/2);
         drawRizo(rizo6, 25, x, y/3);
         drawRizo(rizo6b, 24, x, y/3);
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



function drawRizo(data_points, weight, xpos, ypos) {
  // local variables
  var x = xpos;
  var y = ypos;
  var num_coord = data_points.length;
  var num_points = (data_points.length/2-2)/3;
  var rizo_points = new Array(num_coord); //<---------------------------- WARNING TESTING
  //testar la integridad de la matriz:
  //data_points.length debe ser par  mod(data_points.length/2)=0
  //y cumplir que mod((data_points.length-2)/3)=0

  rizo_points[0] = data_points[0];
  rizo_points[1] = data_points[1];
  rizo_points[2] = data_points[2];
  rizo_points[3] = data_points[3];
  // Suma X e Y a todas las coordenadas menos las del punto de origen y su manipulador (4 primeras coordenadas)
  for(var coord=4; coord < num_coord-1; coord +=2){
    rizo_points[coord] = data_points[coord] + x;
    rizo_points[coord+1] = data_points[coord+1] + y;
  }
  strokeWeight(weight);

  for(var point = 0; point < num_points+1; point += 1) {
    var c = point*6;  // coordenada inicial
    bezier(rizo_points[c],rizo_points[c+1], rizo_points[c+2],rizo_points[c+3], rizo_points[c+4],rizo_points[c+5], rizo_points[c+6],rizo_points[c+7]);



    // Si el flag constuction ON entonces dibuja las constuctoras de las bezier
    if (construction == 1){
      //configura trazos
      stroke(255,0,255,128);
      strokeWeight(2);
      //DIBUJA LAS CURVAS
      bezier(data_points[c],data_points[c+1], data_points[c+2],data_points[c+3], data_points[c+4],data_points[c+5], data_points[c+6],data_points[c+7]);
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



function drawRizillo(data_points, weight, xpos, ypos) {
  var x = xpos;
  var y = ypos;
  var num_coord = data_points.length;
  var num_points = (data_points.length/2-2)/3;
  var rizo_points = new Array(num_coord); //<---------------------------- WARNING TESTING
  //testar la integridad de la matriz:
  //data_points.length debe ser par  mod(data_points.length/2)=0
  //y cumplir que mod((data_points.length-2)/3)=0


  // Suma X e Y a todas las coordenadas menos las del punto de origen y su manipulador (4 primeras coordenadas)
  for(var coord=0; coord < num_coord-1; coord +=2){
    rizo_points[coord] = data_points[coord] + x;
    rizo_points[coord+1] = data_points[coord+1] + y;
  }
  strokeWeight(weight);

  for(var point = 0; point < num_points+1; point += 1) {
    var c = point*6;  // coordenada inicial
    bezier(rizo_points[c],rizo_points[c+1], rizo_points[c+2],rizo_points[c+3], rizo_points[c+4],rizo_points[c+5], rizo_points[c+6],rizo_points[c+7]);


    // Si el flag constuction ON entonces dibuja las constuctoras de las bezier
    if (construction == 1){
      //configura trazos
      stroke(255,0,255,128);
      strokeWeight(2);
      //DIBUJA LAS CURVAS
      bezier(data_points[c],data_points[c+1], data_points[c+2],data_points[c+3], data_points[c+4],data_points[c+5], data_points[c+6],data_points[c+7]);
      // DIBUJA LOS PUNTOS
      ellipse(data_points[c],data_points[c+1],weight/2,weight/2);
      ellipse(data_points[c+6],data_points[c+7],weight/2,weight/2);
      // DIBUJA LOS PUNTOS DE CONTROL
      ellipse(data_points[c+2],data_points[c+3],weight/4,weight/4);
      ellipse(data_points[c+4],data_points[c+5],weight/4,weight/4);
      //TRAZA LAS LINEAS DE CONTROL
      line(data_points[c],data_points[c+1],data_points[c+2],data_points[c+3]);
      line(data_points[c+4],data_points[c+5],data_points[c+6],data_points[c+7]);
      //reconfigura trazos
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
function drawBody() {
    // cuerpesito
  strokeWeight(36);
  bezier(730,1738, 730,1609, 801,1443, 839,1378);
  bezier(1029,1765, 1085,1601, 1053,1344,  1036,1344);
}



function drawFace() {
  //careto
  strokeWeight(38);
  beginShape();
   //inicio frontal
    vertex(1036,1344);
    bezierVertex(1053,1344, 1056,1448, 1207,1418); //
    bezierVertex(1358,1388, 1443,1272, 1443,1178);
    bezierVertex(1443,1084, 1378,942, 1368,902);
    bezierVertex(1348,861, 1348,831, 1368,809);
  endShape();
  //orejilla
  strokeWeight(25);
  beginShape();
    vertex(911,1023);
    bezierVertex(837,954, 815,1030, 820,1069);
    bezierVertex(825,1108, 883,1122, 898,1108);
  endShape();
  stroke(255,0,255,128);
  strokeWeight(2);
  bezier(911,1023, 837,954, 815,1030, 820,1069);
  bezier(820,1069, 825,1108, 883,1122, 898,1108);
  stroke(10,10,10);
}


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

function drawRizoFromJson() {
  var x = 0;
  var y = 0;
  var data_points = superDani_coord.objects[0].coord;
  var num_coord = data_points.length;
  var num_points = (data_points.length/2-2)/3;
  var rizo_points = new Array(num_coord);
  
  var weight = 1826*superDani_coord.objects[0].weight;
  
  // Suma X e Y a todas las coordenadas menos las del punto de origen y su manipulador (4 primeras coordenadas)
  // además, escala para que se ajuste
  for(var coord=0; coord < num_coord-1; coord +=2){
    rizo_points[coord] = 1826*data_points[coord] + x;
    rizo_points[coord+1] = 1826*data_points[coord+1] + y;
  }
  strokeWeight(weight);
  stroke(0,250,250);
  for(var point = 0; point < num_points+1; point += 1) {
    var c = point*6;  // coordenada inicial
    bezier(rizo_points[c],rizo_points[c+1], rizo_points[c+2],rizo_points[c+3], rizo_points[c+4],rizo_points[c+5], rizo_points[c+6],rizo_points[c+7]);
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
