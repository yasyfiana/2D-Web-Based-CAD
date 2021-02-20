var vertexShaderText = 
[
'precision mediump float;',
'',
'attribute vec2 vertPosition;',
'attribute vec3 vertColor;',
'varying vec3 fragColor;',
'uniform vec2 u_resolution;',
'',
'void main()',
'{',
'   fragColor = vertColor;',
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
'varying vec3 fragColor;',
'void main()',
'{',
'  gl_FragColor = vec4(fragColor, 1.0);',
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

function main(vertices, x) {
//
// initialization
//
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
    var colorAttribLocation = gl.getAttribLocation(program, 'vertColor');
    var resolutionUniformLocation = gl.getUniformLocation(program, "u_resolution");

    // Create a buffer and bind it to ARRAY_BUFFER
    var positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

//
// render
//
    // convert from clip space to pixels
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);


    gl.useProgram(program);

    gl.enableVertexAttribArray(positionAttributeLocation);
    gl.enableVertexAttribArray(colorAttribLocation);

    // Bind the position buffer.
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
    var size = 2;         // Number of elements per attribute
    var type = gl.FLOAT;   // type of elements = the data is 32bit floats
    var normalize = false; // don't normalize the data
    var stride = 5 * Float32Array.BYTES_PER_ELEMENT;  // Size of an individual vertex
    var offset = 0;        // Offset from the beginning of a single vertex to this attribute
    gl.vertexAttribPointer(
        positionAttributeLocation, size, type, normalize, stride, offset);
    gl.vertexAttribPointer(
        colorAttribLocation, 3, type, normalize, stride, 2 * Float32Array.BYTES_PER_ELEMENT);

    gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);
    // draw
    var offset = 0;
    var count = x;
    gl.drawArrays(gl.TRIANGLES, offset, count);
}
//contoh array setup posisi dan warna
// var rect = [
//     10, 20, 1.0, 1.0, 0.0,
//     80, 20, 1.0, 1.0, 0.0,
//     10, 30, 1.0, 1.0, 0.0,
//     10, 30, 1.0, 1.0, 0.0,
//     80, 20, 1.0, 1.0, 0.0,
//     80, 30, 1.0, 1.0, 0.0,
//     ];
// main(rect, 6);


function setRect(x,y,size,r,g,b){
    var x1 = x;
    var x2 = x + size;
    var y1 = y;
    var y2 = y + size;

    var rect =[
        x1, y1, r, g, b,
        x2, y1, r, g, b,
        x1, y2, r, g, b,
        x1, y2, r, g, b,
        x2, y1, r, g, b,
        x2, y2, r, g, b,
    ]

    return rect;
}
// create rectangle (x=6)
main(setRect(20,20,50,1,1,0),6);

function setTriangle(x1,y1,x2,y2,x3,y3,r,g,b){
    var triangle =[
        // X, Y,       R, G, B
        x1, y1, r, g, b,
        x2, y2, r, g, b,
        x3, y3, r, g, b,
    ]
    return triangle;
}
// create triangle (x=3)
// main(setTriangle(100, 200, 800, 200, 100, 300, 1, 1, 0), 3);


//poligon beloman