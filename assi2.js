
let txt="I have to practice my times tables over and over and over again so I can learn them.";

function replaceAll(text,search,replace){ //function acts as replaceAll
    
    let str = text.split(search);
    return str.join(replace);
}
let newtxt = replaceAll(txt,"over","more");
console.log(newtxt);

//-----------------------------------------------------------------------------------------------------------
let firstName = "Rakan";
let fathersName = "Rafeh";
let lastName = "Malaeb";
function concat(...str){ //function acts as concat

    return str.join(" ");

}
let newstr = concat(firstName, fathersName, lastName);
console.log(newstr);