
var shape = {

}

// function reder_obj(obj){
//   if(obj.type == "line"){
//     render_line(obj.vertices[0].x, obj.vertices[0].y, obj.vertices[1].x, obj.vertices[1].x, obj.colors.R_color, obj.colors.G_color, obj.colors.B_color);
//     console.log("halo");
//   }
//   else if (obj.type == "rect"){
//     console.log(obj.size  + " ini rect");
//     render_rect(obj.vertices[0].x, obj.vertices[0].y, Number(obj.size), obj.colors.R_color, obj.colors.G_color, obj.colors.B_color)
//   }
//   else if (obj.type == "polygon"){
    
//     render_polygon(obj.vertices, Number(obj.n_vertics), obj.colors.R_color, obj.colors.G_color, obj.colors.B_color );
//     console.log("ini polpol");
//     // console.log(x);
//   }
// }

function reder_obj(obj){
  if(obj.mode == "1"){
    render_line(obj.vertices[0], obj.vertices[1], obj.vertices[2], obj.vertices[3], obj.colors[0], obj.colors[1], obj.colors[2]);
    console.log("halo");
  }
  else if (obj.mode == "4"){

    var a = parseInt(obj.vertices[0]) - parseInt(obj.vertices[2]);
    var b = parseInt(obj.vertices[1])- parseInt(obj.vertices[3]);

    var c = Math.sqrt( a*a + b*b );

    console.log(obj.size  + " ini rect");
    render_rect(obj.vertices[0], obj.vertices[1], Number(c), obj.colors[0], obj.colors[1], obj.colors[2])
  }
  else if (obj.mode == "6"){
    
    render_polygon(obj.vertices, Number(obj.count), obj.colors[0], obj.colors[1], obj.colors[2]);
    console.log("ini polpol");
    // console.log(x);
  }
}

//Format JSON
// {
//   "id": "1",
//   "type": "line",
//   "n_vertics": "2",
//   "colors":
//     {
//       "R_color": "50",
//       "G_color": "50",
//       "B_color": "50"
//     },
//   "vertices":
//     [
//       { "x": "1.0", "y": "1.0" },
//       { "x": "1.0", "y": "2.0" }
//     ]
// }
var all_obj = [];


function uploadFile() {
  // document.getElementById('import').onclick = function() {
    var files = document.getElementById('selectFiles').files;
      // console.log(files);
      if (files.length <= 0) {
          return false;
      }
    
    var fr = new FileReader();
    
    fr.onload = function(e) { 
  //   console.log(e);
      var result = JSON.parse(e.target.result);
      var formatted = JSON.stringify(result, null, 2);
    	// document.getElementById('result').value = formatted;
      // console.log(result[0].vertices[0].x);
      all_obj = result;
      shape = result;
      // console.log(shape[1].vertices[0].x);
      //CALL THE RENDER FUNCTION
      for (let i = 0; i < result.length; i++) {
        reder_obj(result[i]);
        console.log(result.length);
      }
    }

    fr.readAsText(files.item(0));
  // };
}



function download(content, fileName, contentType) {
  var a = document.createElement("a");
  var file = new Blob([content], {type: contentType});
  a.href = URL.createObjectURL(file);
  a.download = fileName;
  a.click();
}

function test(){
//  console.log(carititik(58,89));
 download( JSON.stringify(obj), 'halo.json', 'text/plain"');
 
}