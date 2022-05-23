var path = window.location.pathname;
var page = path.split("/").pop();
const mainMenuBtn = document.querySelector(".mainMenu")

mainMenuBtn.addEventListener('click', () => {
    window.location.assign("/Pages/index.html")
})

//#region pokedex.html
if(page == 'pokedex.html'){
    const input = document.getElementsByName('search')

    input[0].addEventListener('keypress', function(event) {
        if (event.key === "Enter") {
          event.preventDefault();
          getPokemon(input[0].value.toLowerCase())
          input[0].value = ''
        }
    });
    
}
//#endregion

//#region Game.html
if(page == "game.html"){
    const likeButton = document.querySelector(".like")
    const dislikeButton = document.querySelector(".dislike")

    getPokemon(Math.floor(Math.random() * 899) + 1)

    likeButton.addEventListener('click', () =>{
    getPokemon(Math.floor(Math.random() * 899) + 1)
    })

    dislikeButton.addEventListener('click', () =>{
        randomNumber = Math.floor(Math.random() * 899) + 1
        getPokemon(Math.floor(Math.random() * 899) + 1)
    })
}

//#endregion

//#region Poke API
function getPokemon(pokemonName){
    console.log(pokemonName)
    fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`)
    .then((response) => response.json())
    .then((data) => {

        document.querySelector(".sprite").innerHTML = `<img src="${data.sprites.other["official-artwork"].front_default}">`
        document.querySelector(".hp").innerHTML = `<h2>HP: ${data.stats[0].base_stat} </h2>`
        document.querySelector(".pokeName").innerHTML = `<h1>${data.name.charAt(0).toUpperCase() + data.name.slice(1)}</h1>`
        document.querySelector(".height").innerHTML = `<h2>${data.height / 10} m </h2>  <h3>Height</h3>`
        document.querySelector(".weight").innerHTML =   `<h2>${data.weight / 10} kg</h2> <h3>Weight</h3>`   
        
        if(data.types.length == 1){
            document.querySelector(".types").innerHTML =`
            <h2>${data.types[0].type.name}</h2>
            <h3>type</h3>
            `
        }
        else if(data.types.length == 2){
            document.querySelector(".types").innerHTML =`
            <h2>${data.types[0].type.name } / ${data.types[1].type.name} </h2>
            <h3>type</h3>
            `           
        }

        document.querySelector(".attack").innerHTML = `<h2>${data.stats[1].base_stat}</h2> <h3>Attack</h3>`
        document.querySelector(".defense").innerHTML = `<h2>${data.stats[2].base_stat}</h2> <h3>Defense</h3>`
        document.querySelector(".speed").innerHTML = `<h2>${data.stats[5].base_stat}</h2> <h3>Speed</h3>`       
    })
    .catch((err) => {
        createCustomAlert("We couldn't find the pokemon. Try a new one.")
    });
}

//#endregion

//#region Alert
var ALERT_TITLE = "Something went wrong";
var ALERT_BUTTON_TEXT = "Try new";

function createCustomAlert(txt) {
    d = document
  
    if(d.getElementById("modalContainer")) return
  
    mObj = d.getElementsByTagName("body")[0].appendChild(d.createElement("div"));
    mObj.id = "modalContainer";
    mObj.style.height = d.documentElement.scrollHeight + "px"
    
    alertObj = mObj.appendChild(d.createElement("div"))
    alertObj.id = "alertBox"
    if(d.all && !window.opera) alertObj.style.top = document.documentElement.scrollTop + "px";
    alertObj.style.left = (d.documentElement.scrollWidth - alertObj.offsetWidth)/2 + "px";
    alertObj.style.visiblity="visible"
  
    h1 = alertObj.appendChild(d.createElement("h1"))
    h1.appendChild(d.createTextNode(ALERT_TITLE))
  
    msg = alertObj.appendChild(d.createElement("p"))
    msg.innerHTML = txt;
  
    btn = alertObj.appendChild(d.createElement("a"))
    btn.id = "closeBtn"
    btn.style.width = '100px'
    btn.appendChild(d.createTextNode(ALERT_BUTTON_TEXT))
    btn.href = "#"
    btn.focus()
    btn.onclick = function() { removeCustomAlert(); return false }
  
    alertObj.style.display = "block"   
}
  
function removeCustomAlert() {
    document.getElementsByTagName("body")[0].removeChild(document.getElementById("modalContainer"));
}

function ful(){
  alert('Alert this pages');
}
//#endregion