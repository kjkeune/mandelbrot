
self.onmessage = function (evt) {
    var points = new Float64Array(evt.data.pointsBuffer);
    // Jeder Pixel der canvas wird durchlaufen
    for (y = evt.data.id; y < evt.data.height; y += evt.data.workerCount) {
        for (x = 1; x < evt.data.width; x++) {
            // Convertierung von Pixel (x,y) zu complexer Zahl c = ca + cb*i
            var pxPerUnit = evt.data.width / 4 * evt.data.zoom;
            var ca = (x - evt.data.width / 2) / pxPerUnit + evt.data.reCenter;
            var cb = -1 * (y - evt.data.height / 2) / pxPerUnit + evt.data.imCenter;
            // Startwert der Folge z_i
            var i = 0;
            var za = 0;
            var zb = 0;
            // Folgenglieder bis z_maxIterations berechnen mit: z_i = (z_i-1)^2 + c
            while (i < evt.data.maxIterations) {
                var temp = (za * za) - (zb * zb) + ca;
                zb = 2 * za * zb + cb;
                za = temp;
                // Folge divergiert wenn |z_i|^2 > 4
                if ((za * za) + (zb * zb) > 4) {
                    break;
                }
                i++;
            }
            var index = (y * evt.data.width  + x) * 3;
            points[index] = ca;
            points[index + 1] = cb;
            points[index + 2] = i;
        }
        self.postMessage({y: y});
    }
    self.postMessage({done: true});
}
