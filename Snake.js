const numSize = 20; // Bariable names with const are written in UPPER CASE.
const eventApple = new Event('strEatingApple')
const SNAKE_CLASS_NAME = "colored";
const LEFT_KEY = 37
const UP_KEY = 38
const RIGHT_KEY = 39
const DOWN_KEY = 40

var matTable = [];
var strAppleTd;
var numMovement;
var currentMovement = LEFT_KEY;
var objSnake = { // Check it.
    arrSnake: [],
    snakeSize: 3
}
var strHeadTd;


function snakeHead(){
    strHeadTd = objSnake.arrSnake[objSnake.snakeSize - 1];
    return strHeadTd;
}

function initGame() {
    addTable(); // addeventlistener. DOMcontentloaded
    objSnake.arrSnake = initSnake();
    addApple();
}

// Creates Board (table)
function addTable() {
    var strMyTableDiv = document.getElementById("myDynamicTable");

    var htmlTable = document.createElement('TABLE');
    htmlTable.border = '1';

    var htmlTableBody = document.createElement('TBODY');
    htmlTable.appendChild(htmlTableBody);

    for (var i = 0; i < numSize; i++) {
        var htmlTr = document.createElement('TR');
        htmlTableBody.appendChild(htmlTr);
        matTable.push([])

        for (var j = 0; j < numSize; j++) {
            var htmlTd = document.createElement('TD');
            htmlTd.width = '25';
            htmlTd.height = '25'
            htmlTr.appendChild(htmlTd);
            htmlTd.setAttribute("id", getIdFromRowAndCol(i, j));
            matTable[i].push(getIdFromRowAndCol(i, j));
        }
    }
    strMyTableDiv.appendChild(htmlTable);
}
// row + col => id (str)
function getIdFromRowAndCol(row, col) {
    var rowString = row.toString();
    if (row < 10) {
        rowString = "0" + rowString;
    }
    var colString = col.toString();
    if (col < 10) {
        colString = "0" + colString;
    }
    var strTdId = rowString + colString;
    return strTdId;
}
// id => row, col
function getRowAndColFromId(strId) {
    if (strId.length !== 4) {
        return [-1, -1]; // input validation
    }
    var row = parseInt(strId.slice(0, 2));
    var col = parseInt(strId.slice(2));
    return [row, col];
}
// Intializes snake.
function initSnake() {
    var numMiddle = Math.ceil(numSize / 2) - 1;
    var row = numMiddle;
    var col = numMiddle;
    var strCurrentTd;
    var arrSnake = [];
    for (var i = objSnake.snakeSize; i > 0; i--) {
        strCurrentTd = getIdFromRowAndCol(row, col);
        arrSnake.push(strCurrentTd);
        colorTd(strCurrentTd);
        col++
    }
    arrSnake.reverse();
    strHeadTd = arrSnake[arrSnake.length-1];
    return arrSnake;
}
// Colors td 
function colorTd(strTd) {
    var htmlTd = document.getElementById(strTd);
    htmlTd.classList.add(SNAKE_CLASS_NAME);
}
// Direction from click.
function buttonClick(event) {
    if (event.keyCode <= DOWN_KEY && event.keyCode >= LEFT_KEY) { //between 37-40. Direction key codes.
        numMovement = event.keyCode;
    }
}

function addEventListener(){
    document.addEventListener("keydown", buttonClick);
    document.addEventListener("strEatingApple", enlargeSnake);
}

// Automatic movement
function movementTimer() {
    var losingScenario1 = NumberOfRepsInArr()
    var losingScenario2 = isTouchingBorder();
    if(losingScenario1 || losingScenario2){
        return gameOver();
    }
    var arrCurrentTd = getRowAndColFromId(strHeadTd);
    var strTailTd = objSnake.arrSnake[0];
    var htmlFormerTd = document.getElementById(strTailTd);

    if (numMovement === LEFT_KEY && currentMovement !== RIGHT_KEY) { // Left
        if (arrCurrentTd[1] !== 0) {
            arrCurrentTd[1] -= 1;
        }
        currentMovement = LEFT_KEY;
    } else if (numMovement === LEFT_KEY && currentMovement === RIGHT_KEY) {
        arrCurrentTd[1] += 1;
        currentMovement = RIGHT_KEY;
    } else if (numMovement === UP_KEY && currentMovement !== DOWN_KEY) { // Up
        if (arrCurrentTd[0] !== 0) {
            arrCurrentTd[0] -= 1;
        }
        currentMovement = UP_KEY;
    } else if (numMovement === UP_KEY && currentMovement === DOWN_KEY) {
        if (arrCurrentTd[0] !== numSize - 1) {
            arrCurrentTd[0] += 1;
        }
        currentMovement = DOWN_KEY;
    } else if (numMovement === RIGHT_KEY && currentMovement !== LEFT_KEY) { // Right
        if (arrCurrentTd[1] !== numSize - 1) {
            arrCurrentTd[1] += 1;
        }
        currentMovement = RIGHT_KEY;
    } else if (numMovement === RIGHT_KEY && currentMovement === LEFT_KEY) {
        if (arrCurrentTd[1] !== 0) {
            arrCurrentTd[1] -= 1;
        }
        currentMovement = LEFT_KEY;
    } else if (numMovement === DOWN_KEY && currentMovement !== UP_KEY) { // Down
        if (arrCurrentTd[0] !== numSize - 1) {
            arrCurrentTd[0] += 1;
        }
        currentMovement = DOWN_KEY;
    } else if (numMovement === DOWN_KEY && currentMovement === UP_KEY) {
        if (arrCurrentTd[0] !== 0) {
            arrCurrentTd[0] -= 1;
        }
    }
    if(numMovement){
        htmlFormerTd.classList.remove(SNAKE_CLASS_NAME);
        strHeadTd = getIdFromRowAndCol(arrCurrentTd[0], arrCurrentTd[1]);
        objSnake.arrSnake.push(strHeadTd);
        objSnake.arrSnake.shift();
        colorTd(strHeadTd);
    
        if (strHeadTd === strAppleTd) {
            document.dispatchEvent(eventApple);
        }
    }
}

// Initialize apple
function addApple() {
    var rowApple = Math.floor(Math.random() * (numSize - 1));
    var colApple = Math.floor(Math.random() * (numSize - 1));
    strAppleTd = getIdFromRowAndCol(rowApple, colApple);
    while(objSnake.arrSnake.includes(strAppleTd)){
        var rowApple = Math.floor(Math.random() * (numSize - 1));
        var colApple = Math.floor(Math.random() * (numSize - 1));
        strAppleTd = getIdFromRowAndCol(rowApple, colApple);
    }
    var htmlAppleTd = document.getElementById(strAppleTd);
    htmlAppleTd.classList.add("apple");
}
function removeApple() {
    if(strAppleTd){
        var htmlAppleTd = document.getElementById(strAppleTd);
        htmlAppleTd.classList.remove("apple");
    }
}

// Enlarges snake when it eats apple
function enlargeSnake() {
    removeApple();
    addApple()
    var arrNewHead = getRowAndColFromId(objSnake.arrSnake[0]);
    switch (currentMovement) {
        case LEFT_KEY:
            arrNewHead[1]++
            break;
        case UP_KEY:
            arrNewHead[0]++
            break;
        case RIGHT_KEY:
            arrNewHead[1]--
            break;
        case DOWN_KEY:
            arrNewHead[0]--
            break;
    }
    var strNewHead = getIdFromRowAndCol(arrNewHead[0], arrNewHead[1]);
    objSnake.arrSnake.unshift(strNewHead);
    objSnake.snakeSize ++;
}
// Snake eats itself
function NumberOfRepsInArr() {
    for (var x = 0; x < objSnake.snakeSize-1; x++) {
        if (strHeadTd === objSnake.arrSnake[x]) {
            return true;
        }
    } return false;
}
function isTouchingBorder() {
    var arr = getRowAndColFromId(strHeadTd);
    if ((numMovement === LEFT_KEY && arr[1] === 0) ||
        (numMovement === UP_KEY && arr[0] === 0) ||
        (numMovement === RIGHT_KEY && arr[1] === 19) ||
        (numMovement === DOWN_KEY && arr[0] === 19)) {
            return true;
    }
    return false;
}
// Game over properties
function gameOver() {
    var arrGameOver = ["0300", "0301", "0303", "0302", "0600", "0400", "0500", "0600", "0700", "0701", "0702", "0703", "0603", "0503", "0502",
        "0405", "0505", "0605", "0705", "0305", "0306", "0308", "0308", "0408", "0508", "0608", "0708", "0507", "0506", "0307",
        "0710", "0610", "0510", "0410", "0310", "0410", "0411", "0512", "0413", "0314", "0414", "0514", "0614", "0714", "0716", "0717",
        "0718", "0719", "0616", "0516", "0416", "0316", "0317", "0318", "0319", "0516", "0517", "0518", "0519", "0916", "0917", "0918", "1019",
        "1119", "1218", "1217", "1216", "1116", "1016", "1316", "1416", "1419", "1319", "0516", "0517", "0518", "0519",
        "1514", "1411", "1513", "1512", "1511", "1311", "1211", "1111", "1011", "0911", "0912", "0913", "0914", "1214", "1213", "1212",
        "1519", "1516", "0901", "1000", "1100", "1200", "1300", "1400", "1501", "1502", "1403", "1303", "1203", "1103", "1003", "0902",
        "0905", "1005", "1105", "1205", "1305", "1406", "1507", "1408", "1309", "1209", "1109", "1009", "0909"]

    clearInterval(generateMovement);
    clearInterval(initAppleInterval);
    for (i = 0; i < objSnake.snakeSize; i++) {
        document.getElementById(objSnake.arrSnake[i]).classList.remove(SNAKE_CLASS_NAME);
    }
    document.getElementById(strAppleTd).classList.remove("apple");
    for (var i = 0; i < arrGameOver.length; i++) {
        document.getElementById(arrGameOver[i]).classList.add(SNAKE_CLASS_NAME);
    }
}

initGame();
addEventListener();
var generateMovement = setInterval(movementTimer, 150);

var initAppleInterval = setInterval(function(){
    removeApple();
    addApple();
},5000);