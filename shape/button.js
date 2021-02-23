//button handler

function line_button(){
    activate_line = true;
    activate_rect = false;
    activate_polygon = false;
}

var size_rect;

function rect_button(){
    activate_line = false;
    activate_rect = true;
    activate_polygon = false;
    size_rect = Number(prompt("Masukan ukuran panjang persegi"));
}

var n_vec;

function polygon_button(){
    activate_line = false;
    activate_rect = false;
    activate_polygon = true;

    n_vec = Number(prompt("Masukan jumlah vertice", 3));
}

