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
const inputTime = document.getElementById("time");
//Events
renderButton.addEventListener("click", function (e) {
    grabInput();
    makeMandelbrot();
})
canvas.addEventListener("mousemove", updatePointInfo);
canvas.addEventListener("mousedown", mouseAction)

// Parameter
let width;
let height;
let reCenter;
let imCenter;
let zoom;
let maxIterations;
let colorFunc;
// Manuelle Parameter
const zoomFactor = 2;
const workerCount = 15;
// Globale variablen
let renderTime;
let points;
let rendering = false;
let workersDone = 0;
let workers;
initWorkers();

function initWorkers() {
    workers = Array(workerCount);
    for(i = 0; i < workerCount; i++){
        workers[i] = new Worker("mandelWorker.js");
        workers[i].onmessage = function (evt) {
            if(evt.data.done) {
                console.log("workerdone");
                workersDone++;
                if(workersDone == workerCount){
                    renderFinished();
                }
                return;
            }
            for (x = 0; x < width; x++) {
                var point = getPoint(x, evt.data.y)
                colorPixel(x, evt.data.y, point.iter);
            }
        }
    } 
}

//Renderfunction for Mandelbrotset
function makeMandelbrot() {
    renderStarted();
    canvas.width = width;
    canvas.height = height;
    // Array enthaelt fuer jeden pixel ein Tupel [Re,Im,Iterationen]
    const pointsBuffer = new SharedArrayBuffer(height * width  * 3 * 8);
    points = new Float64Array(pointsBuffer);
    for (i = 0; i < workerCount; i++) {
        const data = {
            id: i,
            workerCount: workerCount,
            width: width,
            height: height,
            reCenter: reCenter,
            imCenter: imCenter,
            zoom: zoom,
            maxIterations: maxIterations,
            pointsBuffer: pointsBuffer,
        }
        workers[i].postMessage(data);
    }   
}

function getPoint(x, y) {
    var index = (y * width + x) * 3;
    return {
        re: points[index],
        im: points[index + 1],
        iter: points[index + 2],
    }
}

function renderStarted() {
    rendering = true;
    renderButton.disabled = true;
    renderTime = Date.now();
    workersDone = 0;
}

function renderFinished() {
    rendering = false;
    renderButton.disabled = false;
    renderTime = Date.now() - renderTime;
    inputTime.value = renderTime / 1000;
}

// Pixel wird gefärbt basierend auf den zum divergieren benötigten Iterationen
function colorPixel(x, y, iterations) {
    ctx.fillStyle = colorFunc(iterations);
    ctx.fillRect(x, y, 1, 1);
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

function updatePointInfo(evt) {
    var val = findPixel(evt, this);
    if (val.x <= 0 || val.y <= 0 || points[val.y] == null) {
        return;
    }
    var point = getPoint(val.x, val.y)
    inputRe.value = point.re;
    inputIm.value = point.im;
    inputIter.value = point.iter;
}

function mouseAction(evt) {
    if (rendering) {
        return;
    }
    var val = findPixel(evt, this);
    if (val.x <= 0 || val.y <= 0) {
        return;
    }
    var point = getPoint(val.x, val.y)
    reCenter = point.re;
    imCenter = point.im;
    if (evt.which == 1) {
        zoom *= zoomFactor;
    } else if (evt.which == 3) {
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

//------- color-functions -------

function blackwhite(iterations) {
    if (iterations >= maxIterations) {
        return "black";
    } else {
        return "white";
    }
}

function greyscale(iterations) {
    var ratio = Math.log2((1 - (iterations / maxIterations)) + 1);
    var val = ratio * 255
    return rgb(val, val, val);
}

function rainbow(iterations) {
    if (iterations >= maxIterations) {
        return "black";
    }
    var ratio = Math.log2(iterations / maxIterations + 1);
    return hsl(360 * ratio, 100, 50);
}

//------------------------------

function rgb(r, g, b) {
    return "rgb(" + r + "," + g + "," + b + ")";
}

function hsl(h, s, l) {
    return "hsl(" + h + "," + s + "%," + l + "%)";
}



