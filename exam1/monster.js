let yourHealth = document.getElementById('yHealth');
let monsHealth = document.getElementById('mHealth');

let countUse = 0;


function attack(){
     
    let x = Math.floor(Math.random() * 10);
    let y = Math.floor(Math.random() * 10);

    document.getElementById('finish').innerHTML  = " ";

    yourHealth.value -= x;
    monsHealth.value -= y;
    document.getElementById('test1').innerHTML  = "Player attacks and deals " + x ;
    document.getElementById('test2').innerHTML  = "Monster attacks and deals " + y ;
    countUse = 0;

    if((yourHealth.value == 0) && (monsHealth.value == 0)){
        removeTable();
        document.getElementById('finish').innerHTML  = " Draw Match ";
        yourHealth.value = 100;
        monsHealth.value = 100;
        document.getElementById('test1').innerHTML  = " ";
        document.getElementById('test2').innerHTML  = " ";
        document.getElementById('test3').innerHTML  = " ";
        document.getElementById('test4').innerHTML  = " "; 
    }

    if( yourHealth.value == 0 ){
        removeTable();
        document.getElementById('finish').innerHTML  = " Game Over!!! ";
        document.getElementById('test1').innerHTML  = "Monster Remaining Health : " +  monsHealth.value;

        yourHealth.value = 100;
        monsHealth.value = 100;
        
        document.getElementById('test2').innerHTML  = " ";
        document.getElementById('test3').innerHTML  = " ";
        document.getElementById('test4').innerHTML  = " ";
       
    }

    if( monsHealth.value == 0 ){
        removeTable();
        document.getElementById('finish').innerHTML  = " Congratulations You Won!!! ";
        document.getElementById('test1').innerHTML  = "Your Remaining Health : " + yourHealth.value;

        yourHealth.value = 100;
        monsHealth.value = 100;

        document.getElementById('test2').innerHTML  = " ";
        document.getElementById('test3').innerHTML  = " ";
        document.getElementById('test4').innerHTML  = " ";
        
    }
}


function heal(){

    let x = Math.floor(Math.random() * 10);

    if((yourHealth.value + x) > 100){
        alert("Error: Healing value cannot exceed 100%!!");
        return;
    }
    if(countUse >= 2){
        alert("Cannot Heal 3 times sequentially!!");
        return;
    }
    document.getElementById('finish').innerHTML  = " ";
    yourHealth.value += x;
    document.getElementById('test3').innerHTML  = "Player heals himself for " + x ;
    countUse += 1 ;
 }


 function special(){

    if( yourHealth.value <= monsHealth.value * 0.8 ){
       let x = Math.floor(Math.random() * 10);
       let y = Math.floor(Math.random() * 10) + 5;

       document.getElementById('finish').innerHTML  = " ";

       yourHealth.value -= x;
       monsHealth.value -= y;
       document.getElementById('test1').innerHTML  = "Player attacks and deals " + x ;
       document.getElementById('test2').innerHTML  = "Monster attacks and deals " + y ;
      
       countUse = 0;
    }
    else{
    alert('cannot use since your health is not less by 20%'); }
    return;
 }

 function giveUp(){

        removeTable();
        document.getElementById('finish').innerHTML  = " Game Over!!! <br> Monster is the Winner" ;

        yourHealth.value = 100;
        monsHealth.value = 100;

        document.getElementById('test1').innerHTML  = " ";
        document.getElementById('test2').innerHTML  = " ";
        document.getElementById('test3').innerHTML  = " ";
        document.getElementById('test4').innerHTML  = " ";
       
        countUse = 0;    
 }


 function removeTable() {

    var table = document.getElementById("tble");
    table.remove();
    document.getElementById('test').innerHTML  = "<input type='button' class='button' onclick='New()' value='Start New Game'>";

  }

  function New(){
    location.reload();
  }