//Canvas context und andere Objekte
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const inputReCent = document.getElementById("reCenter");
const inputImCent = document.getElementById("imCenter")
const inputZoom = document.getElementById("zoom")
const inputMaxIter = document.getElementById("maxIter")
const selectColorFunc = document.getElementById("colorFunction")
const inputWidth = document.getElementById("width")
const inputHeight = document.getElementById("height")
const renderButton = document.getElementById("render")
const inputRe = document.getElementById("re")
const inputIm = document.getElementById("im")
const inputIter = document.getElementById("iter")
//Events
renderButton.addEventListener("click", function(e){
    grabInput();
    makeMandelbrot();
})
canvas.addEventListener("mousemove", updatePointInfo);
canvas.addEventListener("mousedown", mouseAction)

// Parameter
const zoomFactor = 2;
let reCenter;
let imCenter;
let zoom;
let maxIterations;
let colorFunc;
let width;
let height;
let points;

function updatePointInfo(evt) {
    var val = findPixel(evt, this);
    if(val.x <= 0 || val.y <= 0){
        return;
    }
    var point = points[val.x][val.y]
    inputRe.value = point[0];
    inputIm.value = point[1];
    inputIter.value = point[2];
}

function mouseAction(evt){
    var val = findPixel(evt, this);
    if(val.x <= 0 || val.y <= 0){
        return;
    }
    var point = points[val.x][val.y];
    reCenter = point[0];
    imCenter = point[1];
    if (evt.which == 1) {
        zoom *= zoomFactor;
    } else if(evt.which == 3) {
        zoom /= zoomFactor;
    }
    if (zoom < 1) {
        zoom = 1;
    }
    updateInput();
    makeMandelbrot();
}

function findPixel(evt, canvas) {
    var rect = canvas.getBoundingClientRect();
    var x = Math.floor(evt.clientX - rect.left);
    var y = Math.floor(evt.clientY - rect.top);
    return {
        x: x,
        y: y,
    };
}

//Renderfunction for Mandelbrotset
function makeMandelbrot() {
    var renderTime = Date.now();
    canvas.width = width;
    canvas.height = height;
    // Array enthaelt fuer jeden pixel ein Tupel [Re,Im,Iterationen]
    points = Array(width).fill(0).map(x => Array(height).fill(0))
    // Jeder Pixel der canvas wird durchlaufen
    for (y = 1; y < height; y++) {
        for (x = 1; x < width; x++) {
            // Convertierung von Pixel (x,y) zu complexer Zahl c = ca + cb*i
            var pxPerUnit = width / 4 * zoom;
            var ca = (x - width / 2) / pxPerUnit + reCenter;
            var cb = -1 * (y - height / 2) / pxPerUnit + imCenter;
            // Startwert der Folge z_i
            var i = 0;
            var za = 0;
            var zb = 0;
            // Folgenglieder bis z_maxIterations berechnen mit: z_i = (z_i-1)^2 + c
            while (i < maxIterations) {
                var temp = (za * za) - (zb * zb) + ca;
                zb = 2 * za * zb + cb;
                za = temp;
                // Folge divergiert wenn |z_i|^2 > 4
                if ((za * za) + (zb * zb) > 4) {
                    break;
                }
                i++;
            }
            points[x][y] = Array(ca, cb, i);
            colorPixel(x, y, i)
        }
    }
    renderTime = Date.now() - renderTime;
    console.log("Rendered in: " + renderTime + "ms");
}

//Input aus GUI
function grabInput() {
    reCenter = Number(inputReCent.value);
    imCenter = Number(inputImCent.value);
    zoom = Number(inputZoom.value);
    maxIterations = Number(inputMaxIter.value);
    colorFunc = window[selectColorFunc.value];
    width = Number(inputWidth.value);
    height = Number(inputHeight.value);   
}

function updateInput() {
    inputReCent.value = reCenter;
    inputImCent.value = imCenter;
    inputZoom.value = zoom;
    inputMaxIter.value = maxIterations;
    inputWidth.value = width;
    inputHeight.value = height; 
}

// Pixel wird gefärbt basierend auf den zum divergieren benötigten Iterationen
function colorPixel(x, y, iterations) {
    ctx.fillStyle = colorFunc(iterations);
    ctx.fillRect(x, y, 1, 1);
}

//------- color-functions -------

function blackwhite(iterations) {
    if (iterations >= maxIterations) {
        return "black";
    } else {
        return "white";
    }
}

function greyscale(iterations) {
    var ratio = (1 - (iterations / maxIterations));
    var val = ratio * 255
    return rgb(val, val, val);
}

function rainbow(iterations) {
    if (iterations >= maxIterations) {
        return "black";
    }
    var ratio = (1 - (iterations / maxIterations));
    return hsl(360 * ratio, 100, 50);
}

//------------------------------

function rgb(r, g, b) {
    return "rgb(" + r + "," + g + "," + b + ")";
}

function hsl(h, s, l) {
    return "hsl(" + h + "," + s + "%," + l + "%)";
}
