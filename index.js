// GLOBALS
let coordinates = {
  x: [],
  y: [],
  n_vertices: 0,
  size: 0,
  color: '#000000',
  mode: 'Polygon'
};
let trackedObjects = [];
let currentTab = 1;
let currentTarget = undefined;
let counter = {
  line: 0,
  rect: 0,
  polygon: 0
}

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

function convertGlColor(colors) {
  let [r, g, b] = colors;
  let raw_r = r * 255;
  let raw_g = g * 255;
  let raw_b = b * 255;
  return `#${raw_r.toString(16)}${raw_g.toString(16)}${raw_b.toString(16)}`;
}

function flatten(coord, n) {
  let flattened = [];
  for (let i = 0; i < n; i++) {
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
    return
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
}

function trackObjectUI(id, name) {
  counter[name]++;
  let container = document.getElementsByClassName("object-lists")[0];
  let li = document.createElement('li');
  li.id = id
  li.innerHTML = `${name} Shape #${counter[name]}`;
  li.classList.add('object-item');
  li.addEventListener('click', function (e) {
    let id = parseInt(e.target.id);
    if (currentTarget)
    currentTarget.classList.remove('object-item-active');
    e.target.classList.add('object-item-active');
    currentTarget = e.target;
    let shapeObj = obj[id]
    console.log(shapeObj);
    
    // Update fields
    document.getElementById("jumlah").value = shapeObj.count;
    addFields()
    let inputX = document.getElementsByName('arrKoordinatX[]');
    let inputY = document.getElementsByName('arrKoordinatY[]');
    for (let i = 0; i < shapeObj.count; i++) {
      inputX[i].value = shapeObj.vertices[i*2];
      inputY[i].value = shapeObj.vertices[i*2+1];
    }
    document.getElementById('color').value = convertGlColor(shapeObj.colors);

    console.log('current target:')
    console.log(currentTarget)
  })
  container.appendChild(li);
}

function render() {
  if (isAnyNull()) {
    alert('Ada koordinat yang tidak terisi!')
    return
  }
  if (!isAllPositiveNumber()) {
    alert('Ada koordinat yang tidak valid!')
    return
  }
  if (coordinates.length < 2) {
    alert('Minimal harus ada 2 titik koordinat!')
    return
  }
  console.log(coordinates)
  let [r, g, b] = convertColor(coordinates.color)
  if (coordinates.mode === 'Line') {
    render_line(
      coordinates.x[0],
      coordinates.y[0],
      coordinates.x[1],
      coordinates.y[1],
      r, g, b
    )
  } else if (coordinates.mode === 'Rect') {
    render_rect(
      coordinates.x[0],
      coordinates.y[0],
      coordinates.size,
      r, g, b
    )
  } else if (coordinates.mode === 'Polygon') {
    // kalo bisa ada fungsi yg buat nyetel objectnya sih WKWK berasa menyusup kode orang
    render_polygon(
      flatten(coordinates, coordinates.n_vertices),
      coordinates.n_vertices,
      r, g, b
    )
  }
}

// MAIN
document.getElementById("jumlah").value = 0;
updateColor()
addFields()