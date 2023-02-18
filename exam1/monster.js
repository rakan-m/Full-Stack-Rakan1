let yourHealth = document.getElementById('yHealth');
let monsHealth = document.getElementById('mHealth');
let log = document.getElementById('log');
let result = document.getElementById('result');

let countUse = 0;


function attack(){
     
    let x = Math.floor(Math.random() * 25); 
    let y = Math.floor(Math.random() * 25);

    yourHealth.value -= x;
    monsHealth.value -= y;

    result.innerHTML += "<p><span style=color:orange;>Monster </span>attacks and deals <span style=color:red;>" + x + "</span></p>";

    result.innerHTML += "<p><span style=color:blueviolet;>Player </span>attacks and deals <span style=color:red;>" + y + "</span></p>";

    /* const newPar = document.createElement("p"); //create a new paragraph  //Another way to Add the results
    newPar.style.textAlign = "center";
    newPar.innerHTML = "<span style=color:orange;>Monster </span>attacks and deals <span style=color:red;>" + x + "</span>";
    result.appendChild(newPar);

    const newPar2 = document.createElement("p"); //create a new paragraph
    newPar2.style.textAlign = "center";
    newPar2.innerHTML = "<span style=color:blueviolet;>Player </span>attacks and deals <span style=color:red;>" + y + "</span>";
    result.appendChild(newPar2); */
   
    check();
    countUse = 0;
}


function heal(){

    let x = Math.floor(Math.random() * 15);

    if((yourHealth.value + x) > 100){
        alert("Healing value cannot exceed 100%!!");
        return;
    }
    if(countUse >= 2){
        alert("Cannot Heal 3 times sequentially!!");
        return;
    }

    yourHealth.value += x;

    result.innerHTML += "<p><span style='color:blueviolet;'>Player </span>heals himself for <span style='color:green;'>" + x + "</span></p>";

   /* const newPar3 = document.createElement("p"); //Another way
    newPar3.style.textAlign = "center";
    newPar3.innerHTML = "<span style='color:blueviolet;'>Player </span>heals himself for <span style='color:green;'>" + x + "</span>";
    result.appendChild(newPar3);  */

    countUse ++ ;

 }


 function special(){

    if( yourHealth.value <= monsHealth.value * 0.8 ){ //player health less by 20%

       let x = Math.floor(Math.random() * 20);
       let y = Math.floor(Math.random() * 20) + 20;

       yourHealth.value -= x;
       monsHealth.value -= y;

       result.innerHTML += "<p><span style=color:orange;>Monster </span>attacks and deals <span style=color:red;>" + x + "</span></p>";

       result.innerHTML += "<p><span style=color:blueviolet;>Player </span>attacks and deals <span style=color:red;>" + y + "</span></p>";

       /*  const newPar4 = document.createElement("p");
       newPar4.style.textAlign = "center";
       newPar4.innerHTML = "<span style=color:orange;>Monster </span>attacks and deals <span style=color:red;>" + x + "</span>";
       result.appendChild(newPar4);
   
       const newPar5 = document.createElement("p");
       newPar5.style.textAlign = "center";
       newPar5.innerHTML = "<span style=color:blueviolet;>Player </span>attacks and deals <span style=color:red;>" + y + "</span>";
       result.appendChild(newPar5);  */
       
       check();
       countUse = 0;
    }
    else{
    alert('cannot use since your health is not less by 20%'); }
    return;
 }

 function giveUp(){ 

        removeTable();
        log.style.display = "none";

        result.innerHTML  = "<p align='center' style='font-size: xx-large;font-weight: bold;color:blueviolet;'>Game Over! </p><p align=center style='font-size:medium;'>Monster is the Winner!</p>";
 
 }
function check(){

    if((yourHealth.value == 0) && (monsHealth.value == 0)){ //Draw Match
        removeTable();

        log.style.display = "none";
        result.innerHTML = " ";

        result.innerHTML = "<p align='center' style='font-size: xx-large;font-weight: bold;color:blueviolet;'>Game Over! </p><p align='center' style='font-size:medium;'> Draw Match! </p>";

    }

    if( yourHealth.value == 0 ){ //Monster Won
        removeTable();

        log.style.display = "none";
        result.innerHTML = " ";

        result.innerHTML  = "<p align='center' style='font-size: xx-large;font-weight: bold;color:blueviolet;'>Game Over! </p><p align='center' style='font-size:medium;'> Monster Won!!! </p><p align='center'>Monster Remaining Health : "
        + monsHealth.value + "%</p>";
       
    }

    if( monsHealth.value == 0 ){ //Player Won
        removeTable();

        log.style.display = "none";
        result.innerHTML = " ";

        result.innerHTML  = "<p align='center' style='font-size: xx-large;font-weight: bold;color:blueviolet;'>Game Over! </p><p align='center' style='font-size:medium;'> You Won!!! </p><p align='center'>Your Remaining Health : "
        + yourHealth.value + "%</p>";

    }
}

 function removeTable() {

    var table = document.getElementById("tble");
    table.remove();
    document.getElementById('test').innerHTML  = "<input type='button' class='button' onclick='newGame()' value='Start New Game'>";

  }

  function newGame(){
    location.reload();
  }