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

function toggleEditMode(bool) {
  if (bool) {
    document.getElementById('jumlah').readOnly = true;
    document.getElementById('render').innerHTML = 'Update!';
    document.getElementById('randomize').style.display = 'none';
  } else {
    document.getElementById('jumlah').readOnly = false;
    document.getElementById('render').innerHTML = 'Render!';
    document.getElementById('randomize').style.display = 'block';
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
        updateCoordinate(e.target)
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
        updateCoordinate(e.target)
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
}

function editObject(el) {
  resetCoordinates()
  let id = parseInt(el.id);
  if (currentTarget) {
    currentTarget.classList.remove('object-item-active');
  }
  el.classList.add('object-item-active');
  currentTarget = el;
  let shapeObj = obj[id]

  
  // Update fields
  document.getElementById("jumlah").value = shapeObj.count;
  addFields()
  let inputX = document.getElementsByName('arrKoordinatX[]');
  let inputY = document.getElementsByName('arrKoordinatY[]');
  for (let i = 0; i < shapeObj.count; i++) {
    inputX[i].value = shapeObj.vertices[i * 2];
    inputY[i].value = shapeObj.vertices[i * 2 + 1];
    updateCoordinate(inputX[i])
    updateCoordinate(inputY[i])
  }

  if(parseInt(shapeObj.mode) === 1){
    addFields();
    var new_length_input = Number(prompt("Masukan panjang garis baru"),0);
    var new_x = newPointLine(shapeObj.vertices[0],shapeObj.vertices[1],shapeObj.vertices[2],shapeObj.vertices[3],new_length_input)[0];
    var new_y = newPointLine(shapeObj.vertices[0],shapeObj.vertices[1],shapeObj.vertices[2],shapeObj.vertices[3],new_length_input)[1];

    console.log( new_x );
    console.log( new_y );

  }
  document.getElementById('color').value = convertGlColor(shapeObj.colors);
  console.log(convertGlColor(shapeObj.colors));
  updateColor()
  console.log(document.getElementById('color').value)

  coordinates.mode = 'Edit'
  toggleEditMode(true);
  console.log('Coordinates:')
  console.log(coordinates)
}

function updateColor() {
  let color = document.getElementById("color").value;
  let textNode = document.getElementsByClassName('color-code')[0].getElementsByTagName('span')[0];
  textNode.innerHTML = color;
  coordinates.color = color;
  if (coordinates.mode === 'Edit') {
    render();
  }
}

function updateCoordinate(el) {
  let axis = el.id.charAt(0)
  let n = parseInt(el.id.substring(1))-1
  let newVal = parseInt(el.value)
  coordinates[axis][n] = newVal
  if (coordinates.mode === 'Edit') {
    render()
  }
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
  let raw_r = Math.floor(r * 255);
  let raw_g = Math.floor(g * 255);
  let raw_b = Math.floor(b * 255);
  console.log(`#${padHexString(raw_r)}${padHexString(raw_g)}${padHexString(raw_b)}`);
  return `#${padHexString(raw_r)}${padHexString(raw_g)}${padHexString(raw_b)}`;
}

function padHexString(raw_color) {
  if (raw_color <= 16) {
    return `0${raw_color.toString(16)}`;
  } else {
    return `${raw_color.toString(16)}`
  }
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

function reset() {
  document.getElementById("jumlah").value = 0
  addFields()
  resetCoordinates()
  document.getElementById('color').value = coordinates.color;
  updateColor()
  if (currentTarget) {
    currentTarget.classList.remove('object-item-active');
  }
  currentTarget = undefined
  toggleEditMode(false);
}

function randomize() {
  let n = parseInt(document.getElementById("jumlah").value);
  if (n < 2) {
    alert('Minimal harus ada 2 titik koordinat!')
    return
  }
  let inputX = document.getElementsByName('arrKoordinatX[]');
  let inputY = document.getElementsByName('arrKoordinatY[]');

  for (let i = 0; i < n; i++){
    coordinates.x[i] = Math.floor(Math.random() * MAX_X_CANVAS)
    coordinates.y[i] = Math.floor(Math.random() * MAX_Y_CANVAS)
    inputX[i].value = coordinates.x[i]
    inputY[i].value = coordinates.y[i]
  }
  document.getElementById('color').value = convertGlColor([Math.random(), Math.random(), Math.random()]);
  updateColor();

  if (n === 2) {
    coordinates.mode = "Line"
  } else {
    coordinates.mode = "Polygon"
  }
  render();
}

function clearObjectUI() {
  reset()
  let container = document.getElementsByClassName("object-lists")[0];
  while (container.hasChildNodes()) {
    container.removeChild(container.lastChild);
  }

}

function trackObjectUI(id, name) {
  counter[name]++;
  let container = document.getElementsByClassName("object-lists")[0];
  let li = document.createElement('li');
  li.id = id
  li.innerHTML = `${name} Shape #${counter[name]}`;
  li.classList.add('object-item');
  li.addEventListener('click', function (e) {
    editObject(e.target)
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
    render_polygon(
      flatten(coordinates, coordinates.n_vertices),
      coordinates.n_vertices,
      r, g, b
    )
  } else if (coordinates.mode === 'Edit') {
    //update vertices
    for (let i = 0; i < coordinates.n_vertices; i++){
      obj[currentTarget.id].vertices[i*2] = coordinates.x[i]
      obj[currentTarget.id].vertices[i*2+1] = coordinates.y[i]
    }
    //update color
    obj[currentTarget.id].colors = convertColor(coordinates.color);
    draw();
  }
}

// MAIN
document.getElementById("jumlah").value = 0;
updateColor()
addFields()