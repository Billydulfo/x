var renglonActual;
var db;

var k=0;
// OBTIENE TODOS LOS ELEMENTOS DE LA BASE DE DATOS
function getAll(tx) {
    tx.executeSql('SELECT * FROM DEMO', [], actualizaTablaWeb, errorOperacionSQL);
}

//ACTUALIZA LA TABLA QUE SE LE DESPLIEGA AL USUARIO id, corte, faltante, excedente, total
function actualizaTablaWeb(tx, results) {
    
    var tblText='<table id="t01"><tr><th>ID</th> <th>Corte</th> <th>Faltante</th> <th>Excedente</th> <th>Total</th></tr>';
    var len = results.rows.length;
    console.log("Renglones:"+results.rows.length);
    for (var i = 0; i < len; i++) {
        tblText +='<tr><td>' + results.rows.item(i).id +'</td><td>' 
                + results.rows.item(i).corte +'</td><td>'
                + results.rows.item(i).faltante +'</td><td>'
                + results.rows.item(i).excedente +'</td><td>' 
                + results.rows.item(i).total +'</td></tr>';
    }
    tblText +="</table>";
    //REEMPLAZA EL CONTENIDO DE LA ETIQUETA DIV3
    console.log(tblText);
    document.getElementById("div3").innerHTML =tblText;
    k++;

}
// ERROR EN LA CREACION DE LA BD
function errorOperacionSQL(err) {
    alert("Error procesando el SQL: "+err.code);
}

//SE TIENE EXITO AL TENER ACCESO A LA BD.
function exitoSQL() {
    db.transaction(getAll, errorOperacionSQL);
    
}

//REALIZA LA TRANSACCION (INSERTAR) Y VERIFICA SI NO HAY UN ERROR

function insertar(tx) {
    tx.executeSql('INSERT INTO Demo (id, corte, faltante, excedente, total) VALUES ("' +document.getElementById("txtFecha").value 
            +'","'+document.getElementById("txtCorte").value
            +'","'+document.getElementById("txtFaltante").value 
            +'","'+document.getElementById("txtExcedente").value                    
            +'","'+document.getElementById("txtTotal").value +'")');
}
function insertarBD() {
    db.transaction(insertar, errorOperacionSQL, exitoSQL);
}

function calculaCorte(total){
    var corte= document.getElementById("txtCorte").value;
    var resta=0;
    var excedente=0;
    var faltante=0;

    if(total==corte){
        document.getElementById("txtExcedente").innerHTML = '0';
        document.getElementById("txtFaltante").innerHTML = '0';
    }
    if(total>corte){
        faltante= total-corte;
        document.getElementById("txtExcedente").innerHTML = '0';
        document.getElementById("txtFaltante").innerHTML = faltante;
    }    
    if(total<corte){
        excedente= corte-total;
        document.getElementById("txtExcedente").innerHTML = excedente;
        document.getElementById("txtFaltante").innerHTML = '0';
    }
    cargarDB();
    insertarBD();
}

function generaCorte(){
    var producto = document.getElementById("txtProducto1").value;
    var monto = document.getElementById("txtMonto1").value;
    var total= producto*monto;
    producto = document.getElementById("txtProducto2").value;
    monto = document.getElementById("txtMonto2").value;
    total= total + producto*monto;
    producto = document.getElementById("txtProducto3").value;
    monto = document.getElementById("txtMonto3").value;
    total= total + producto*monto;
    producto = document.getElementById("txtProducto4").value;
    monto = document.getElementById("txtMonto4").value;
    total= total + producto*monto;
    producto = document.getElementById("txtProducto5").value;
    monto = document.getElementById("txtMonto5").value;
    total= total + producto*monto;
    document.getElementById("txtTotal").innerHTML= total;
    calculaCorte(total);
}

// CREAR LA TABLA DE LA BASE DE DATOS
function creaTabla(tx) {
    tx.executeSql('CREATE TABLE IF NOT EXISTS Demo (id DATE NOT NULL PRIMARY KEY, corte, faltante, excedente,total)');
}

// VERIFICA SI ESTA LISTO PARA TRABAJAR CON LA BD y si se requiere MANDA
// A CREAR UNA TABLA
// Parametros: Nombre, Version, Display name, y el tamanio
function cargarDB() {
    db = window.openDatabase("miDB", "1.0", "Demo BDatos", 200000);
    if(db==null){
      document.getElementById('div3').style.display='none';
    }
    db.transaction(creaTabla, errorOperacionSQL, exitoSQL);  
}