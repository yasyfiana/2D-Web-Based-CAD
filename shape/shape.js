var vertexShaderText = 
[
'precision mediump float;',
'',
'attribute vec2 vertPosition;',

'uniform vec2 u_resolution;',
'',
'void main()',
'{',
    // convert the rectangle from pixels to 0.0 to 1.0
'   vec2 zeroToOne = vertPosition / u_resolution;',
    // convert from 0->1 to 0->2
'   vec2 zeroToTwo = zeroToOne * 2.0;',
    // convert from 0->2 to -1->+1 (clipspace)
'   vec2 clipSpace = zeroToTwo - 1.0;',
'   gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);',
'}'
].join('\n');

var fragmentShaderText =
[
'precision mediump float;',
'',
'uniform vec4 fragColor;',
'void main()',
'{',
'  gl_FragColor = fragColor;',
'}'
].join('\n');

function createShader(gl, type, source) {
    var shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (success) {
    return shader;
    }

    console.log(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
}

function createProgram(gl, vertexShader, fragmentShader) {
    var program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    var success = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (success) {
    return program;
    }

    console.log(gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
}

var canvas = document.querySelector("#cnvs"); // the canvas
var gl = canvas.getContext("webgl");
if (!gl) {
    console.log('WebGL not supported, falling back on experimental-webgl');
}
if (!gl) {
    alert('Your browser does not support WebGL');
}
gl.clearColor(0.75, 0.85, 0.8, 1.0);
gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

// create shaders, upload the GLSL source, compile the shaders, and link the two shaders into a program
var vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderText);
var fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderText);
var program = createProgram(gl, vertexShader, fragmentShader);
var positionAttributeLocation = gl.getAttribLocation(program, "vertPosition");
var colorAttribLocation = gl.getUniformLocation(program, 'fragColor');

var resolutionUniformLocation = gl.getUniformLocation(program, "u_resolution");
// Create a buffer and bind it to ARRAY_BUFFER
var positionBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
gl.enableVertexAttribArray(positionAttributeLocation);

// gl.enableVertexAttribArray(colorAttribLocation);
// gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

//
// render
//
// convert from clip space to pixels
gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
gl.useProgram(program);
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

// Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
var size = 2;         // Number of elements per attribute
var type = gl.FLOAT;   // type of elements = the data is 32bit floats
var normalize = false; // don't normalize the data
var stride = 0;  // Size of an individual vertex
var offset = 0;        // Offset from the beginning of a single vertex to this attribute
gl.vertexAttribPointer(
    positionAttributeLocation, size, type, normalize, stride, offset);

    // gl.vertexAttribPointer(
//     colorAttribLocation, 3, type, normalize, stride, 2 * Float32Array.BYTES_PER_ELEMENT);

gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);





function draw() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    var offset = 0;
    
    for (var i = 0; i<obj.length; i++) {
        console.log(obj[i]);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(obj[i].vertices), gl.STATIC_DRAW);
        gl.uniform4f(colorAttribLocation,obj[i].colors[0],obj[i].colors[1],obj[i].colors[2], 1);
        gl.drawArrays(obj[i].mode, offset, obj[i].count);
    }
}


function setRect(x,y,size,r,g,b){
    var x1 = Number(x);
    var x2 = Number(x) + Number(size);
    var y1 = Number(y);
    var y2 = Number(y) + Number(size);
    var vertices=[
        x1, y1,
        x2, y1,
        x1, y2,
        x1, y2,
        x2, y1,
        x2, y2,
    ]
    
    var color=[
        r,g,b,
    ]
    console.log(vertices);

    obj.push({
        "mode" : gl.TRIANGLES,
        "vertices" : vertices,
        "count" : 6,
        "colors": color
    })
}
function setLine(x1,y1,x2,y2,r,g,b){
    var line =[
        x1,y1,
        x2,y2,
    ]
    console.log(line + "iyaaaa");

    var color=[
        r,g,b,
    ]

    obj.push({
        "mode" : gl.LINES,
        "vertices" : line,
        "count" : 2,
        "colors": color

    })
}

function setPolygon(verticex, n_vertices, r,g,b){
    // new_vert = verticex.flat();
    // var new_vert = [];
    // // console.log(new_vert);
    var color = [r,g,b];
    // for (let i = 0; i < verticex.length; i++) {
    //     new_vert.push(Number(verticex[i].x));
    //     new_vert.push(Number(verticex[i].y));
    //    // console.log(result[i]);
    //   }
    // console.log(new_vert.flat());

    obj.push({
        "mode" : gl.TRIANGLE_FAN,
        "vertices" : verticex,
        "count" : n_vertices,
        "colors": color
    })
}

function clear_canv(){ //belom bisa gatau knp wkwk
    console.log("masuk paeko");
    obj = [];
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    clearObjectUI();
    // obj.push({
    //     "mode" : gl.POINTS,
    //     "vertices" : [0,0],
    //     "count" : 1,
    //     "colors" : [0,0,0]
    // })
    // draw();
}

/// MAIN
var obj=[];

// setRect(20,20,50,1,1,0);
// setLine(30,50,100,80,1,1,0)
// // setRect(30,50,100,1,1,0);
// draw();
////////////
console.log(obj);


///mencoba pickup pickup

var canva = document.querySelector('#cnvs');
var count_vec=0;
var verticez=[];
var new_vert=[];
var isDragging = false;
var startDragging = [undefined, undefined]
var transformed = [0, 0]
var pointClicked = undefined

function getMousePosition(canvas, event) { 
    let pos = []; 
    let x = event.clientX;  //8 tuh jarak putih ke canvas !!nanti perlu diubah lagi
    let y = event.clientY; 
    console.log("Coordinate x: " + x, "Coordinate y: " + y);
    pos.push(x);
    pos.push(y)
    return(pos);
} 

canva.addEventListener('mousedown',(e) =>{
    vec = getMousePosition(canva,e);

    if (activate_line){
        verticez.push(vec);
        count_vec= count_vec+1;
        if(count_vec ==2){
            console.log(verticez);
            render_line(verticez[0][0],verticez[0][1],verticez[1][0],verticez[1][1],1,1,0);
            verticez=[];
            count_vec = 0;
        }
    }

    else if (activate_rect){
        verticez.push(vec);
        render_rect(verticez[0][0],verticez[0][1],size_rect,1,1,0);
        console.log(size_rect);
        verticez=[];
    }

    else if (activate_polygon){
        console.log('poligon bos');
        verticez.push(vec);
        count_vec= count_vec+1;
        console.log(count_vec);
        console.log(verticez);
        if (count_vec == n_vec) {
            new_vert = verticez.flat();
            render_polygon(
                new_vert,
                count_vec,
                1, 1, 0
            )
            // console.log(new_vert);
            // var color = [1,1,0];
            // obj.push({
            //     "mode" : gl.TRIANGLE_FAN,
            //     "vertices" : new_vert,
            //     "count" : count_vec,
            //     "colors": color
            // })
            // draw();
            verticez=[];
            count_vec = 0;
        }
    }
    else {
        let x = carititik(vec[0], vec[1])
        if (typeof x === 'undefined') {
            return
        }
        isDragging = true;
        startDragging = vec
        pointClicked = x
    }
   
})

canva.addEventListener('mousemove', function(e) {
    if (isDragging) {
        vec = getMousePosition(canva,e);

        let [idx_obj, jarak, idx_vert] = pointClicked;
        console.log('point clicked:')
        console.log(`${idx_obj}|${jarak}`)
        console.log(idx_vert)
        console.log(`object:`)
        console.log(obj[idx_obj])
        let targetDisplacementX = vec[0] - startDragging[0] - transformed[0]
        let targetDisplacementY = vec[1] - startDragging[1] - transformed[1]
        transformed[0] += targetDisplacementX
        transformed[1] += targetDisplacementY
        console.log(`target displacement: ${targetDisplacementX}, ${targetDisplacementY}`)
        for (let i = 0; i < idx_vert.length; i++) {
            obj[idx_obj].vertices[idx_vert[i]*2] += targetDisplacementX
            obj[idx_obj].vertices[idx_vert[i]*2 + 1] += targetDisplacementY
        }
        console.log(`object after:`)
        console.log(obj[idx_obj])
        draw();
    }
})

canva.addEventListener('mouseup', e => {
    vec = getMousePosition(canva,e);

    if (isDragging) {
        isDragging = false;
        startDragging = [undefined, undefined]
        transformed = [0, 0]
        pointClicked = undefined;
    }
})

function render_line(x1,y1,x2,y2,r,g,b){
    setLine(x1, y1, x2, y2, r, g, b);
    trackObjectUI(obj.length-1, 'line');
    draw();
}

function render_rect(x,y,size,r,g,b){
    setRect(x, y, size, r, g, b);
    trackObjectUI(obj.length-1, 'rect');
    draw();
}
function render_polygon(v,n,r,g,b){
    setPolygon(v, n, r, g, b);
    trackObjectUI(obj.length-1, 'polygon');
    draw();
}

function newPointLine(x1, y1, x2, y2, new_length) {
    var a = 0;
    var b = 0;
    var c = 0;

    var m = (y2-y1)/(x2-x1);
    
    a = 1;
    b = -2 * x1 + m;
    c = Math.pow(x1, 2) + (-1 * m * x1) + y1 - Math.pow(new_length, 2);

    var x_new = (-1 * b + Math.sqrt(Math.pow(b, 2) - (4 * a * c))) / (2 * a); 
    var y_new = y1 + m * (x_new - x1);

    var hasil = [x1, y1, x_new, y_new ];

    return(hasil);
}

function newRect(x,y, new_rec_l){
    var x1 = Number(x);
    var x2 = Number(x) + Number(new_rec_l);
    var y1 = Number(y);
    var y2 = Number(y) + Number(new_rec_l);

    // var hasil = []

    var vertices=[
        x1, y1,
        x2, y1,
        x1, y2,
        x1, y2,
        x2, y1,
        x2, y2,
    ]
    return(vertices);
}

function carititik(x_mouse, y_mouse){

    // Cari titik terdekat
    var number_obj = -1;
    var nilai_obj = 99999;
    var indeks_obj = [0];

    const RADIUS = 20;

    for (var i = (obj.length - 1); i >= 0; i--) {
        var ver = obj[i].vertices;
        // console.log(typeof obj[i].mode)
        // console.log(obj[i].mode)
        if (obj[i].mode === 4) {
            for (let j = 0; j < (ver.length) / 2; j++){
                console.log(`obj yang ke ${i}`)
                console.log(obj[i])
                console.log(`jarak: ${jarak(ver[j*2], ver[j*2 + 1], x_mouse, y_mouse)}`)
                console.log(`j: ${j} | verX = ${ver[j*2]} verY = ${ver[j*2+1]}`)
                if (jarak(ver[j*2], ver[j*2 + 1], x_mouse, y_mouse) < nilai_obj) {
                    nilai_obj = jarak(ver[j*2], ver[j*2 + 1], x_mouse, y_mouse);
                    indeks_obj = [j];
                    number_obj = i;
                }
            }
            console.log('indeksobj:')
            console.log(indeks_obj)
            if (indeks_obj == 2 || indeks_obj == 3){ indeks_obj = [2, 3]}
            else if (indeks_obj == 1 || indeks_obj == 4) { indeks_obj = [1, 4] }
            else {indeks_obj = [indeks_obj]}
        } else {
            for (let j = 0; j < (ver.length) / 2; j++){
                // console.log(`obj yang ke ${i}`)
                // console.log(obj[i])
                // console.log(`jarak: ${jarak(ver[j*2], ver[j*2 + 1], x_mouse, y_mouse)}`)
                // console.log(`j: ${j} | verX = ${ver[j*2]} verY = ${ver[j*2+1]}`)
                if (jarak(ver[j*2], ver[j*2 + 1], x_mouse, y_mouse) < nilai_obj) {
                    nilai_obj = jarak(ver[j*2], ver[j*2 + 1], x_mouse, y_mouse);
                    indeks_obj = [j];
                    number_obj = i;
                }
            }
        }
    }

    if (nilai_obj > RADIUS) {
        return undefined
    }
    return [number_obj,nilai_obj,indeks_obj];

}


function jarak(x1, y1, x2, y2) {
    var a = parseInt(x1) - parseInt(x2);
    var b = parseInt(y1) - parseInt(y2);

    return (Math.sqrt(a * a + b * b));
    
}

function calculateSize(n, vertices) {
    if (n === 2) {
        return Math.sqrt(Math.pow(vertices[2] - vertices[0], 2) + Math.pow(vertices[3] - vertices[1], 2));
    } else if (n === 4) {
        let a = parseInt(vertices[0]) - parseInt(vertices[2]);
        let b = parseInt(vertices[1])- parseInt(vertices[3]);

        return Math.sqrt( a*a + b*b );
    } else {
        return undefined;
    }
}

function isTriangularRect(n, vertices) {
    return (n === 6) && (vertices[4] === vertices[6] && vertices[5] === vertices[7])
}

// main(moveLine(setLine(50,50,20,50,1,1,0),100),2,"line")

// function moveLine(oldVertice, range){
//     var newVertice=[];
//     var x = range/2;
    

//     for(i=0; i<oldVertice.length; i++){
//         if (i==0 || i ==1){
//             newVertice.push(oldVertice[i]+range);
//         }
//         else{
//             newVertice.push(oldVertice[i]);
//         }
//     }
//     return newVertice;
// }


