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

function showError(){
    $(".notify").addClass("active");
    $("#notifyType").addClass("failure");

    setTimeout(function(){
    $(".notify").removeClass("active");
    $("#notifyType").removeClass("failure");
    },3000);
}
supports_html5_storage()


//#endregion

//#region searchPokemon.html
if(page == 'searchPokemon.html'){
    $('#disableDiv').hide();
    
    const input = document.getElementsByName('search')

    input[0].addEventListener('keypress', function(event) {
        if (event.key === "Enter") {
            $('#disableDiv').show();
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
//#region  Pokemon Color
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

function pokemonColor(pokemon){
    const poke_types = pokemon.types.map(type => type.type.name)
    const type = main_types.find(type => poke_types.indexOf(type) > -1)
    
    const color = colors[type]

    return color
}
//#endregion

const getPokemon = async pokemonName =>{
    try{
        const url = `https://pokeapi.co/api/v2/pokemon/${pokemonName}`
        const res = await fetch(url)
        const data = await res.json()
        
        createPokemon(data)
    }
    catch(err){
        showError()
    }
}

function createPokemon(data){
    const sprite = data.sprites.other["official-artwork"].front_default
    const hp = data.stats[0].base_stat
    const name = data.name.charAt(0).toUpperCase() + data.name.slice(1)
    const height = data.height / 10
    const weight = data.weight / 10
    const attack = data.stats[1].base_stat
    const defense = data.stats[2].base_stat
    const speed = data.stats[5].base_stat
    
    if(page != 'likedPokemons.html'){
        const pokemon = document.querySelector(".pokemon")         
        pokemon.style.backgroundColor = pokemonColor(data)
    
        document.querySelector(".sprite").innerHTML = `<img src="${sprite}">`
        document.querySelector(".hp").innerHTML = `<h2>HP: ${hp} </h2>`
        document.querySelector(".pokeName").innerHTML = `<h1>${name}</h1>`
        document.querySelector(".height").innerHTML = `<h2>${height} m </h2>  <h3>Height</h3>`
        document.querySelector(".weight").innerHTML =  `<h2>${weight} kg</h2> <h3>Weight</h3>`   
        
        if(data.types.length == 1){
            document.querySelector(".types").innerHTML =`
            <h2>${data.types[0].type.name}</h2>
            <h3>type</h3>
            `
        }
        else if(data.types.length == 2){
            document.querySelector(".types").innerHTML =`
            <h2>${data.types[0].type.name } / ${data.types[1].type.name} </h2>           
            <h3>type</h3> `           
        }
    
        document.querySelector(".attack").innerHTML = `<h2>${attack}</h2> <h3>Attack</h3>`
        document.querySelector(".defense").innerHTML = `<h2>${defense}</h2> <h3>Defense</h3>`
        document.querySelector(".speed").innerHTML = `<h2>${speed}</h2> <h3>Speed</h3>`       
    }
    
    if(page == 'likedPokemons.html'){
        createPokemonCard(data)
    }
}
//#endregion

//#region likedPokemons.Html
if(page == 'likedPokemons.html'){
    function showPokemons(){
        for(let i = 0; i < storedPokemons.length; i++){
            getPokemon(storedPokemons[i])
        }
    }

    function createPokemonCard(pokemon) {
        const pokemonEl = document.createElement('div');
        pokemonEl.classList.add('pokemon');

        const name = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)
        const sprite =pokemon.sprites.other["official-artwork"].front_default

        pokemonEl.style.backgroundColor = pokemonColor(pokemon)
    
        const pokeInnerHTML = `
            <div class="img-container">
                <img src="${sprite}">
            </div>
            <div class="info">
                <span class="number">#${pokemon.id.toString().padStart(3, '0')}</span>              
                <h3 class="name">${name}</h3>
            </div>
        `;
    
        pokemonEl.innerHTML = pokeInnerHTML;  
        poke_container.appendChild(pokemonEl);
    }
    showPokemons()
}
//#endregion

