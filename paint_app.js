//Variabile canvas
let tempcanvas;
var drawArea;
let saveImgData;
//Retine daca mouseul se misca
let isMoving = false;
//Stocheaza grosimea instrumentului
let thickInput;
let thicknessDrawn = 2;
//Instrumentul actual
let currentTool = 'line';
let canvasWidth = 600;
let canvasHeight = 600;
//Stocheaza culoarea selectata pentru desenarea instrumentelor
var colorInput; 
var selectedColor = 'red';
//Stocheaza daca mouseul este apasat
let mouseDownPos = new Array();
//Variabila care stocheaza desenul creat
var newDesen;
//Arrayul stocheaza formele desenate
let drawnShapes = [];
// //Indexul elementului ce va fi sters
// var index;
//Stocheaza daca butonul de erase este apasat
var eraser=false;
//Variabila in care se va stoca referinta catre elementul shapeList
var lista;
//Stochează datele despre dimensiunile utilizate pentru a crea formele
//care vor fi desenate pe măsură ce utilizatorul mișcă mouse-ul
class ShapeCoordonatesBox{

    constructor(stanga, sus, latime, inaltime) {

        this.left = stanga;
        this.top = sus;
        this.width = latime;
        this.height = inaltime;

    }

}
//Functia creaza obiectul ce va fi stochat in arrayul de desene
function objDrawn(xStart, yStart, xEnd, yEnd, tipDesen){

    this.xStart = xStart;
    this.yStart = yStart;
    this.xEnd = xEnd;
    this.yEnd = yEnd;
    this.type = tipDesen;

}
//Stocheaza pozitile lui x si y cand mouseul este apasat
class MouseDownPos{

    constructor(x,y) {

        this.x = x,
        this.y = y;

    }

}
//Stocheaza pozitile lui x si y
class Location{

    constructor(x,y) {

        this.x = x,
        this.y = y;

    }

}
//Stocheaza coordonatele stânga sus x & y și dimensiunea instrumentului
let shapeCoordBox = new ShapeCoordonatesBox(0,0,0,0);
//Retine poziția x & y unde userul a dat click
let mouseDown = new MouseDownPos(0,0);
// Retine pozitia x & y a mouseului
let locatie = new Location(0,0);
//Apeleaza functia setUpCanvas atunci cand se da refresh la pagina
document.addEventListener('DOMContentLoaded', setUpCanvas);
//Schimba culoare instrumentului
function changeColor(){
    
    let color = "red";
    colorInput = document.getElementById("colors"); 
    color = colorInput.value;
    return color;

}
//Schimba culoarea canvasului
 function changeColorCanvas(){

    if(eraser===true){
        drawArea.fillStyle = "white";
        drawArea.fillRect(0, 0, tempcanvas.width, tempcanvas.height);
        eraser = false;
         
    }
    else{
        colorInput = document.getElementById("colors"); 
        drawArea.fillStyle = colorInput.value;
        drawArea.fillRect(0, 0, tempcanvas.width, tempcanvas.height);
    }
}
//Schimba grosimea instrumentelor
function changeThickness(){

    thickInput =  document.getElementById("nrThickness").value;
     return thickInput;

}
//Functie care afiseaza lista
function displayElements(){
    lista = document.getElementById("shapesList");
    for(var i =0; i<drawnShapes.length; i++){
        lista.innerHTML += i+drawnShapes[i].type+ "<br>";
        
    }
}
//Functia care sterge un element oarecare
function deleteShapeFromLista(){
    eraser=true;
    drawArea.globalCompositeOperation = 'destination-out';
    drawArea.fillStyle = "white";
    drawArea.lineWidth = changeThickness();  
}
//Functia setUpCanvas readuce canvasul la setarile default atunci cand userul da refresh la pagina
function setUpCanvas(){

    tempcanvas = document.getElementById("tempcanvas");
    drawArea = tempcanvas.getContext('2d');
    drawArea.lineWidth = 2;

    //Executa functia evMDown cand mouseul este apasat
    tempcanvas.addEventListener("mousedown", evMDown);
    
    //Executa functia evMMove cand mouseul se misca
    tempcanvas.addEventListener("mousemove", evMMove);
    
    //Executa functia evMUp cand mouseul este eliberat
    tempcanvas.addEventListener("mouseup", evMUp);

    //Goleste arrayul la reincarcarea paginii
    if(drawnShapes.length>-1){
        var arrayLength = drawnShapes.length;
        var i=0;
        while(i < arrayLength)
        {
            drawnShapes.pop();
            i+=1;
        }
    }
}
 //Functia schimba instrumentul default cu cel selectat
function ChangeTool(toolClicked){

    eraser=false;
    document.getElementById("img-file-save").className = "";

    document.getElementById("line").className = "";
    
    document.getElementById("rectangle").className = "";
    
    document.getElementById("ellipse").className = "";

    //Evidențiați ultimul instrument selectat din toolbar
    document.getElementById(toolClicked).className = "selected";

    //Schimbați instrumentul actual utilizat pentru desen
    currentTool = toolClicked;
}
//Returnează poziția x & y a mouseului pe baza poziției canvasului din pagina html
function ObtPozMouse(x,y){

    //Obțineți dimensiunea și poziția pcanvasului din pagina web
    let canvasMarime = tempcanvas.getBoundingClientRect();

    return {
        x: (x - canvasMarime.left) * (tempcanvas.width  / canvasMarime.width),
        y: (y - canvasMarime.top)  * (tempcanvas.height / canvasMarime.height)};

}
 
function SaveCanvasImg(){
    
    //Salveaza imaginea din canvas
    saveImgData = drawArea.getImageData(0,0,tempcanvas.width,tempcanvas.height);
}
 
function RedesenareImgCanvas(){

    // Redesenare imagine canvas
    drawArea.putImageData(saveImgData,0,0);

}
 
function UpdateCoordonateNoiMouse(locatie){

    //Înălțimea și lățimea reprezinta diferenta dintre pozitia la click si 
    //pozitia curenta a mouseului
    shapeCoordBox.width = Math.abs(locatie.x - mouseDown.x);
    shapeCoordBox.height = Math.abs(locatie.y - mouseDown.y);
 
    //Dacă mouseul este sub locul unde a fost făcut click inițial pe mouse
    if(locatie.x > mouseDown.x){
 
        //Stocheaza mousedown deoarece este cel mai îndepărtat
        shapeCoordBox.left = mouseDown.x;
    } else {
 
        //Stocheaza locatia mouseului deoarece este cel mai îndepărtat
        shapeCoordBox.left = locatie.x;
    }
 
    //Dacă locația mouseului este mai jos de unde ați făcut click inițial
    if(locatie.y > mouseDown.y){
        
    //Stocheaza mousedown, deoarece este mai aproape de vârful canvasului
        shapeCoordBox.top = mouseDown.y;
    } else {
 
        //Altfel stocheaza pozitia mouseului
        shapeCoordBox.top = locatie.y;

    }
}
function newRetineCoordonateMiscare(locatie){

    //Stochează schimbarea înălțimii, lățimii, poziției (x, y) a punctelor din
    //stânga sus fiind fie locația clickului, fie a mouseului
    UpdateCoordonateNoiMouse(locatie);
 
    // Redesenare forma
    desenareFormaInstrument(locatie);
};
 
function evMDown(e){

    //Schimba pointerul mouseului
    tempcanvas.style.cursor = "grabbing"; 
    
    

    //Salveaza locatia
    locatie = ObtPozMouse(e.clientX, e.clientY);

    //Salveaza imaginea curenta din canvas
    SaveCanvasImg();

    //Retine pozitia mouseului cand userul face click
    mouseDown.x = locatie.x;
    mouseDown.y = locatie.y;

    //Retine ca mouseul este miscat
    isMoving = true;

};
 
function evMMove(e){

    //Schimba pointerul mouseului
    tempcanvas.style.cursor = "grabbing"; 
    

    locatie = ObtPozMouse(e.clientX, e.clientY);

    //Daca mouseul se misca imaginea se redeseneaza
    // si se retin noile coordonate
        if(isMoving){

            RedesenareImgCanvas();

            newRetineCoordonateMiscare(locatie);

        }

};
function evMUp(e){

     //Schimba pointerul mouseului
    tempcanvas.style.cursor = "grabbing"; 
    

    locatie = ObtPozMouse(e.clientX, e.clientY);

    RedesenareImgCanvas();

    newRetineCoordonateMiscare(locatie);

    isMoving = false;

};
//Functia care deseneaza formele cu preview
function desenareFormaInstrument(locatie){

    if(eraser !==true){
        drawArea.globalCompositeOperation = "destination-over";
    }
    selectedColor = changeColor();

    if(selectedColor!==null){

        drawArea.strokeStyle = selectedColor;
        drawArea.fillStyle = selectedColor;

    }
    else{

        drawArea.strokeStyle="red";
        drawArea.fillStyle="red";

    }

    thicknessDrawn = changeThickness();
    drawArea.lineWidth = thicknessDrawn;

    if(currentTool === "line"){
        //Deseneaza linie
        drawArea.beginPath();
        drawArea.moveTo(mouseDown.x, mouseDown.y);
        drawArea.lineTo(locatie.x, locatie.y);
        drawArea.stroke();
        
        //Functie care stocheaza in array formele desenate
        newDesen = new objDrawn(mouseDown.x,mouseDown.y, locatie.x, locatie.y, currentTool);       
        drawnShapes.push(newDesen);

    } else if(currentTool === "rectangle"){
        //Deseneaza dreptunghiul
        drawArea.strokeRect(shapeCoordBox.left, shapeCoordBox.top, shapeCoordBox.width, shapeCoordBox.height);
        //Functie care stocheaza in array formele desenate
        newDesen = new objDrawn(shapeCoordBox.left, shapeCoordBox.top,
             shapeCoordBox.width, shapeCoordBox.height, currentTool);
        drawnShapes.push(newDesen);


     } else if(currentTool === "ellipse"){
        //Deseneaza elipsa
        let radiusX = shapeCoordBox.width / 2;
        let radiusY = shapeCoordBox.height / 2;
        drawArea.beginPath();
        drawArea.ellipse(mouseDown.x, mouseDown.y, radiusX, radiusY, Math.PI / 4, 0, Math.PI * 2);
        drawArea.stroke();
        //Functie care stocheaza in array formele desenate
        newDesen = new objDrawn(mouseDown.x, mouseDown.y, radiusX, radiusY, currentTool);
        drawnShapes.push(newDesen);
     }
};
//Salveaza imagina in format png in directorul default
function SaveImg(){

    //Obțineți o referință la elementul "img-file-save"
    var imgFile = document.getElementById("img-file-save");

    //Descarca imaginea cand linkul este apasat
    imgFile.setAttribute('download', 'image.png');

    //Refera canvasul pentru a putea downloada imaginea
    imgFile.setAttribute('href', tempcanvas.toDataURL());

};