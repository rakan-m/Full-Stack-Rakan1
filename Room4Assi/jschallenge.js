function getUserInput(event){
    if(event=='0'||event=='1'||event=='2'||event=='3'||event=='4'||event=='5'||event=='6'||event=='7'||event=='8'||event=='9'){
        userInput = document.getElementById("cal").value += event;   
    }
}

let userResult = 0;
let operation;
    function userOperation(event){
        switch(event){
            case '+':
                operation=event;
                userResult += +userInput;
                userInput = 0;
                document.getElementById("cal").value = '';
                break;
                case '-':
                    operation=event;
                    if(userResult==0){
                        userResult = +userInput;
                    }
                    else{
                        userResult = (userResult) - (+userInput);
                    }
                    userInput = 0;
                    document.getElementById("cal").value = '';
                break;
                case '*':
                    operation=event;
                    if(userResult == 0){
                        userResult = +userInput;
                    }
                    else{
                        userResult = userResult * +userInput;
                    }
                    
                    userInput = 1;
                    document.getElementById("cal").value = '';
                break;
                case '/':
                    operation=event;
                    if(userResult == 0){
                        userResult = +userInput;
                    }
                    else{
                        if(+userInput !== 0){
                            userResult = userResult / +userInput;
                        }
                        else {
                            clearCal();
                        }
                        
                    }
                    userInput = 0;
                    document.getElementById("cal").value = '';
                break;
        }
    }

function onEqual (){
        userOperation(operation);
        document.getElementById("cal").value = userResult;
}

function clearCal(){
        userResult = 0;
        userInput = 0;
        document.getElementById("cal").value = '';
}