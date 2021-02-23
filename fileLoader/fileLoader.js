var shape = {

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
    	document.getElementById('result').value = formatted;
      console.log(result[0].vertices[0].x);
      
      shape = result;
      console.log(shape[1].vertices[0].x);
      //CALL THE RENDER FUNCTION
      // for (i = 0; i < result.length; i++) {
        
      // }
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
 download( JSON.stringify(shape), 'halo.json', 'text/plain"');
 
}