isBlack = 0;

let urlString = window.location.href;

if ((window.location.href).includes("black")) {
    var offsets = document.getElementsByClassName("eval-gauge reverse")[0].getBoundingClientRect();
    isBlack = 1;
} else if ((window.location.href).includes("white")) {
    var offsets = document.getElementsByClassName("eval-gauge")[0].getBoundingClientRect();
    isBlack = 0;
}

gameId = urlString.substring(urlString.indexOf("org/"), urlString.indexOf("/", urlString.indexOf("org/"+3)));


// try {
//     var offsets = document.getElementsByClassName("eval-gauge reverse")[0].getBoundingClientRect();
//   } catch (error) {
//     console.error(error);
//     // expected output: ReferenceError: nonExistentFunction is not defined
//     // Note - error messages will vary depending on browser
// }
//     var offsets = document.getElementsByClassName("eval-gauge reverse")[0].getBoundingClientRect();

//const canvas = (document.getElementsByClassName("eval-gauge reverse"))[0];
// const node = document.getElementById("eval-gauge.reverse");
// canvas.fillRect(0, 0, 13.15, 501.34);
// const context = canvas.getContext("2d");

// const rectangle = document.createElement("div");

// const button = document.createElement("input");
// button.type = "button";
// button.value = "T\no\nt\na\nl\nl\ny\n \na\nn\n \ne\nv\na\nl\nu\na\nt\ni\no\nn \nb\na\nr\n";
// button.style.width = '30px'; // setting the width to 200px
// button.style.height = '501.34px'; // setting the height to 200px
// button.style.zIndex = "1000000000 !important";
// button.style.position = "fixed";


block_to_insert = document.createElement('div');
block_to_insert.id = 'overlay';
block_to_insert.className = 'inserted_block_class';

block_to_insert2 = document.createElement('div');
block_to_insert2.id = 'overlay1';
block_to_insert2.className = 'inserted_block_class';

block_to_insert.style.left = offsets.left+"px";
block_to_insert.style.top = offsets.top+"px";

block_to_insert2.style.left = offsets.left+"px";
block_to_insert2.style.top = offsets.top+"px";
var heightOfGeniusBar = offsets.bottom-offsets.top;
var widthOfGeniusBar = offsets.right-offsets.left;


//if isBlack I want the black bar to grow from the bottom
//if !isBlack I want the black bar to grow from the top
if (isBlack) {
    block_to_insert2.style.bottom = offsets.bottom+"px";
    block_to_insert2.style.top = (offsets.bottom-heightOfGeniusBar/2)+"px";              
} else {
    block_to_insert2.style.top = offsets.top+"px";
    block_to_insert2.style.bottom = (offsets.top+heightOfGeniusBar/2)+"px";
}

block_to_insert.style.height = heightOfGeniusBar+"px";
block_to_insert.style.width = widthOfGeniusBar+"px";
block_to_insert2.style.height = heightOfGeniusBar/2+"px";
block_to_insert2.style.width = widthOfGeniusBar+"px";

block_to_insert.innerHTML = '';
block_to_insert2.innerHTML = '';
 
container_block = document.getElementById('main-wrap');
container_block.appendChild(block_to_insert);
container_block.appendChild(block_to_insert2);

block_to_insert.display = "block";
block_to_insert2.display= "block";

block_to_insert.position = "absolute";
block_to_insert2.position = "absolute";

// Make the DIV element draggable:
// dragElement(document.getElementById("overlay"));
// dragElement(document.getElementById("overlay1"));

function displayAnalysis(number) {
  block_to_insert2.style.height = ((100-parseInt(number))*heightOfGeniusBar)+"px";
    if (isBlack) {
      block_to_insert2.style.bottom = offsets.bottom+"px";
  } else {
      block_to_insert2.style.top = offsets.top+"px";
  }
}


function dragElement(elmnt) {
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  if (document.getElementById(elmnt.id + "header")) {
    // if present, the header is where you move the DIV from:
    document.getElementById("overlay" + "header").onmousedown = dragMouseDown;
    document.getElementById("overlay1" + "header").onmousedown = dragMouseDown;

  } else {
    // otherwise, move the DIV from anywhere inside the DIV:
    elmnt.onmousedown = dragMouseDown;
    // document.getElementById("overlay1").onmousedown = dragMouseDown;

    // document.getElementById("overlay").onmousedown = dragMouseDown;
  }

  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // set the element's new position:
    elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
    elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
  }

  function closeDragElement() {
    // stop moving when mouse button is released:
    document.onmouseup = null;
    document.onmousemove = null;
  }
}
//const child = document.body.firstChild;
//const hm = document.body.eval-gauge.reverse;
// let myNode = node as Node;

// document.body.replaceChild(button, <Node>node);


// button.addEventListener("click", () => {
//     console.log("button_click");
//     document.body.style.backgroundColor = "red";
// });

// console.log(button);
// console.dir(button);

// chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
//     chrome.tabs.sendMessage(tabs[0].id, {createDiv: {width: "100px", height: "100px", innerHTML: "Hello"}}, function(response) {
//         console.log(response.confirmation);
//     });
// });