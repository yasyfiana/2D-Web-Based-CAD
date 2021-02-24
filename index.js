// GLOBALS
let coordinates = {
  x: [],
  y: [],
  n_vertices: 0,
  size: 0,
  color: '#000000',
  mode: 'Polygon'
};

const MAX_Y_CANVAS = 600
const MAX_X_CANVAS = 800

function resetCoordinates() {
  coordinates = {
    x: [],
    y: [],
    n_vertices: 0,
    size: 0,
    color: '#000000',
    mode: ''
  } 
}

function addFields() {
  let number = parseInt(document.getElementById("jumlah").value);
  coordinates.n_vertices = number;
  let container = document.getElementsByClassName("koor-container")[0];
  let n_member = container.childElementCount;
  let target = number - (n_member / 3);
  let i = target;
  if (target > 0) {
    while (i > 0) {
      container.appendChild(document.createTextNode("x" + ((n_member / 3) + (target - i) + 1)));
      let input = document.createElement("input");
      input.type = "number";
      input.name = "arrKoordinatX[]";
      input.id = `x${((n_member / 3) + (target - i) + 1)}`;
      input.min = 0;
      input.required = true;
      input.addEventListener('keyup', function (e) {
        if (e.code === 'Enter') {
          e.preventDefault();
          render();
        }
      })
      input.addEventListener('change', function (e) {
        updateCoordinate(e)
      })
      container.appendChild(input);

      container.appendChild(document.createTextNode("y" + ((n_member / 3) + (target - i) + 1)))
      input = document.createElement("input");
      input.type = "number";
      input.name = "arrKoordinatY[]";
      input.id = `y${((n_member / 3) + (target - i) + 1)}`;
      input.min = 0;
      input.required = true;
      input.addEventListener('keyup', function (e) {
        if (e.code === 'Enter') {
          e.preventDefault();
          render();
        }
      })
      input.addEventListener('change', function (e) {
        updateCoordinate(e)
      })
      container.appendChild(input);

      container.appendChild(document.createElement("br"));

      coordinates.x.push(null);
      coordinates.y.push(null);
      i--;
    }
  } else if (target < 0) {
    while (i < 0) {
      container.removeChild(container.lastChild);
      container.removeChild(container.lastChild);
      container.removeChild(container.lastChild);
      container.removeChild(container.lastChild);
      container.removeChild(container.lastChild);

      coordinates.x.pop();
      coordinates.y.pop();
      i++;
    }
  }
  console.log(coordinates)
}

function updateColor() {
  let color = document.getElementById("color").value;
  let textNode = document.getElementsByClassName('color-code')[0].getElementsByTagName('span')[0];
  textNode.innerHTML = color;
  coordinates.color = color;
}

function updateCoordinate(e) {
  let axis = e.target.id.charAt(0)
  let n = parseInt(e.target.id.substring(1))-1
  let newVal = parseInt(e.target.value)
  coordinates[axis][n] = newVal
}

function convertColor(color) {
  let raw_r = parseInt(color.substring(1, 3), 16),
    raw_g = parseInt(color.substring(3, 5), 16),
    raw_b = parseInt(color.substring(5, 7), 16);
  let r = raw_r / 255;
  let g = raw_g / 255;
  let b = raw_b / 255;
  return [r, g, b]
}

function flatten(coord) {
  let flattened = [];
  for (let i = 0; i < coordinates.n_vertices; i++) {
    flattened.push(coord.x[i]);
    flattened.push(coord.y[i]);
  }
  return flattened;
}

function isAnyNull() {
  for (let i = 0; i < coordinates.n_vertices; i++) {
    if (coordinates.x[i] === null || coordinates.y[i] === null) {
      console.log(`${coordinates.x[i]} || ${coordinates.y[i]}`)
      return true
    }
  }
  return false
}

function isAllPositiveNumber() {
  for (let i = 0; i < coordinates.n_vertices; i++) {
    if ((isNaN(coordinates.x[i]) || isNaN(coordinates.y[i])) && (coordinates.x[i] < 0 || coordinates.y[i] < 0)) {
      return false
    }
  }
  return true
}

function randomize() {
  let n = parseInt(document.getElementById("jumlah").value);
  if (n < 2) {
    alert('Minimal harus ada 2 titik koordinat!')
  }
  let inputX = document.getElementsByName('arrKoordinatX[]');
  let inputY = document.getElementsByName('arrKoordinatY[]');
  console.log(inputX)
  console.log(inputY)

  for (let i = 0; i < n; i++){
    coordinates.x[i] = Math.floor(Math.random() * MAX_X_CANVAS)
    coordinates.y[i] = Math.floor(Math.random() * MAX_Y_CANVAS)
    inputX[i].value = coordinates.x[i]
    inputY[i].value = coordinates.y[i]
  }
  if (n === 2) {
    coordinates.mode = "Line"
  } else {
    coordinates.mode = "Polygon"
  }
  render();
  obj.pop();
}

function render() {
  if (isAnyNull()) {
    alert('Ada koordinat yang tidak terisi!')
    return
  }
  if (!isAllPositiveNumber()) {
    alert('Ada koordinat yang tidak valid!')
  }
  if (coordinates.length < 2) {
    alert('Minimal harus ada 2 titik koordinat!')
  }
  console.log(coordinates)
  if (coordinates.mode === 'Line') {
    let [r, g, b] = convertColor(coordinates.color)
    setLine(
      coordinates.x[0],
      coordinates.y[0],
      coordinates.x[1],
      coordinates.y[1],
      r, g, b
    )
    draw()
  } else if (coordinates.mode === 'Rect') {
    let [r, g, b] = convertColor(coordinates.color)
    setRect(
      coordinates.x[0],
      coordinates.y[0],
      coordinates.size,
      r, g, b
    )
    draw()
  } else if (coordinates.mode === 'Polygon') {
    // kalo bisa ada fungsi yg buat nyetel objectnya sih WKWK berasa menyusup kode orang
    let shape = {
      'mode': gl.TRIANGLE_FAN,
      'vertices': flatten(coordinates),
      'count': coordinates.n_vertices,
      'colors': convertColor(coordinates.color)
    };
    obj.push(shape);
    draw();
  }
}

// MAIN
document.getElementById("jumlah").value = 0;
updateColor()