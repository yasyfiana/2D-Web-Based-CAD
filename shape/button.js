//button handler
activate_line = false;
activate_rect = false;
activate_polygon = false;

function line_button() {
    activate_line = !activate_line;
    activate_rect = false;
    activate_polygon = false;
    if (activate_line) {
        document.getElementById('linebtn').classList.add('active')
        document.getElementById('rectbtn').classList.remove('active')
        document.getElementById('polybtn').classList.remove('active')
    } else {
        document.getElementById('linebtn').classList.remove('active')
    }
}

var size_rect;

function rect_button(){
    activate_line = false;
    activate_rect = !activate_rect;
    activate_polygon = false;
    if (activate_rect) {
        size_rect = Number(prompt("Masukan ukuran panjang persegi"));
        document.getElementById('rectbtn').classList.add('active')
        document.getElementById('linebtn').classList.remove('active')
        document.getElementById('polybtn').classList.remove('active')
    } else {
        document.getElementById('rectbtn').classList.remove('active')
    }
}

var n_vec;

function polygon_button(){
    activate_line = false;
    activate_rect = false;
    activate_polygon = !activate_polygon;

    if (activate_polygon) {
        n_vec = Number(prompt("Masukan jumlah vertice", 3));
        document.getElementById('polybtn').classList.add('active')
        document.getElementById('linebtn').classList.remove('active')
        document.getElementById('rectbtn').classList.remove('active')
    } else {
        document.getElementById('rectbtn').classList.remove('active')
    }
}

