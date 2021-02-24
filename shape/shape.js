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
    var new_vert = [];
    // console.log(new_vert);
    var color = [r,g,b];
    for (i = 0; i < verticex.length; i++) {
        new_vert.push(Number(verticex[i].x));
        new_vert.push(Number(verticex[i].y));
       // console.log(result[i]);
      }
    console.log(new_vert.flat());

    obj.push({
        "mode" : gl.TRIANGLE_FAN,
        "vertices" : new_vert.flat(),
        "count" : n_vertices,
        "colors": color
    })
}

function clear(){ //belom bisa gatau knp wkwk
    obj =[];
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
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

function getMousePosition(canvas, event) { 
    let pos = []; 
    let x = event.clientX-8;  //8 tuh jarak putih ke canvas !!nanti perlu diubah lagi
    let y = event.clientY-8; 
    console.log("Coordinate x: " + x, "Coordinate y: " + y);
    pos.push(x);
    pos.push(y)
    return(pos);
} 

canva.addEventListener('mousedown',(e) =>{
    vec = getMousePosition(canva,e);
    console.log(vec);

    if (activate_line){
        verticez.push(vec);
        count_vec= count_vec+1;
        if(count_vec ==2){
            console.log(verticez);
            setLine(verticez[0][0],verticez[0][1],verticez[1][0],verticez[1][1],1,1,0);
            draw();
            verticez=[];
            count_vec = 0;
        }
    }

    else if (activate_rect){
        verticez.push(vec);
        setRect(verticez[0][0],verticez[0][1],size_rect,1,1,0);
        draw();
        console.log(size_rect);
        verticez=[];
    }

    else if (activate_polygon){
        console.log('poligon bos');
        verticez.push(vec);
        count_vec= count_vec+1;
        console.log(count_vec);
        console.log(verticez);
        if(count_vec == n_vec){
            new_vert = verticez.flat();
            console.log(new_vert);
            var color = [1,1,0];
            obj.push({
                "mode" : gl.TRIANGLE_FAN,
                "vertices" : new_vert,
                "count" : count_vec,
                "colors": color
            })
            draw();
            verticez=[];
            count_vec = 0;
        }
    }
   
})

function render_line(x1,y1,x2,y2,r,g,b){
    setLine(x1,y1,x2,y2,r,g,b);
    draw();
}

function render_rect(x,y,size,r,g,b){
    setRect(x,y,size,r,g,b);
    draw();
}
function render_polygon(v,n,r,g,b){
    setPolygon(v,n,r,g,b);
    draw();
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


