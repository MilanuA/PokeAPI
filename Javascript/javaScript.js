const mainMenuBtn = document.querySelector(".mainMenu")
var path = window.location.pathname;
var page = path.split("/").pop();
var pokemons = []
var storedPokemons = JSON.parse(localStorage.getItem("pokemons"))

//#region Other things
if(page != 'index.html'){
    mainMenuBtn.addEventListener('click', () => {
        window.location.assign("/Pages/index.html")
    })
}


function supports_html5_storage() {
    try {
      return 'localStorage' in window && window['localStorage'] !== null;
    } catch (e) {
      return false;
    }
}

supports_html5_storage()
//#endregion

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

//#region index.html
if(page == 'index.html'){
    if(storedPokemons.length > 0)
    document.querySelector(".list").innerHTML += `<li><a href= "likedPokemons.html">Liked pokemons</a></li>`
}
//#endregion

//#region Game.html
if(page == "game.html"){
    const likeButton = document.querySelector(".like")
    const dislikeButton = document.querySelector(".dislike")

    var randomNumber = Math.floor(Math.random() * 899) + 1
    getPokemon(randomNumber)

    likeButton.addEventListener('click', () =>{
        randomNumber = Math.floor(Math.random() * 899) + 1
        getPokemon(randomNumber)
        pokemons.push(randomNumber)
        localStorage.setItem("pokemons", JSON.stringify(pokemons))
    })

    dislikeButton.addEventListener('click', () =>{
        randomNumber = Math.floor(Math.random() * 899) + 1
        getPokemon(Math.floor(Math.random() * 899) + 1)
    })
}

//#endregion

//#region Poke API
const colors = {
    fire: '#FDDFDF',
    grass: '#DEFDE0',
    electric: '#FCF7DE',
    water: '#DEF3FD',
    ground: '#f4e7da',
    rock: '#d5d5d4',
    fairy: '#fceaff',
    poison: '#98d7a5',
    bug: '#f8d5a3',
    dragon: '#97b3e6',
    psychic: '#eaeda1',
    flying: '#F5F5F5',
    fighting: '#E6E0D4',
    normal: '#F5F5F5'
};
const main_types = Object.keys(colors);

function getPokemon(pokemonName){
    fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`)
    .then((response) => response.json())
    .then((data) => {
        if(page != 'likedPokemons.html'){
            const pokemon = document.querySelector(".pokemon")
            const poke_types = data.types[0].type.name
            const type = main_types.find(type => poke_types.indexOf(type) > -1);
            const color = colors[type];
            
            pokemon.style.backgroundColor = color
    
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
        }
        
    })
    .catch((err) => {
        $(".notify").addClass("active");
        $("#notifyType").addClass("failure");
  
        setTimeout(function(){
        $(".notify").removeClass("active");
        $("#notifyType").removeClass("failure");
        },3000);
    });
}



//#endregion

//#region likedPokemons.Html

if(page == 'likedPokemons.html'){
}

//#endregion


//#region Test


//#endregion