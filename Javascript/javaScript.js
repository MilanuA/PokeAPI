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
        const url1 = `https://pokeapi.co/api/v2/pokemon/${pokemonName}`
        const url2 = `https://pokeapi.co/api/v2/pokemon-species/${pokemonName}/ `
     
        const results = Promise.all([fetch(url1), fetch(url2)])
        const dataPromises = (await results).map(results => results.json())
        const finalData = Promise.all(dataPromises).then(finalData =>createPokemon(finalData))
    }
    catch(err){
        showError()
    }
   
}


const getAbility = async name =>{
    $(".moreInfo").html('')

    try{
        const url =  `https://pokeapi.co/api/v2/ability/${name}/`
        const res = await fetch(url)
        const abilityData = await res.json()

        showInfo(abilityData)
    }
    catch(err){
        showError()
    }
}

function createPokemon(data){
    const basicData = data[0]
    const moreInfo = data[1]

    console.log(moreInfo)
    //#region  variables
    const sprite = basicData.sprites.other["official-artwork"].front_default
    const hp = basicData.stats[0].base_stat
    const name = basicData.name.charAt(0).toUpperCase() + basicData.name.slice(1)
    const height = basicData.height / 10
    const weight = basicData.weight / 10
    const attack = basicData.stats[1].base_stat
    const defense = basicData.stats[2].base_stat
    const speed = basicData.stats[5].base_stat
    const id = basicData.id.toString()
    const type = basicData.types
    //#endregion

    if(page != 'likedPokemons.html'){
        $(".pokemon").css({"backgroundColor" : pokemonColor(data[0]) })
        $(".sprite").html(`<img src="${sprite}">`)
        $(".hp").html(`<h2>HP: ${hp} </h2>`)
        $(".pokeName").html(`<h1>${name}</h1>`)
        $(".height").html(`<h2>${height} m </h2>  <h3>Height</h3>`) 
        $(".weight").html(`<h2>${weight} kg</h2> <h3>Weight</h3>` )  
        
        $(".spriteHolder").css({
            "background-color" : "rgba(255, 255, 255, 0.6",
            "border-radius" : "50%",
            "width" : "320px",
            "height" : "320px",
            "margin-left" : "auto",
            "margin-right" : "auto"
        })

        if(type.length == 1){
           $(".types").html(`
            <h2>${type[0].type.name}</h2>
            <h3>type</h3>
            `)
        }
        else if(type.length == 2){
            $(".types").html(`
            <h2>${type[0].type.name } / ${type[1].type.name} </h2>           
            <h3>type</h3> 
            `)       
        }
    
        $(".attack").html(`<h2>${attack}</h2> <h3>Attack</h3>`)
        $(".defense").html(`<h2>${defense}</h2> <h3>Defense</h3>`)
        $(".speed").html(`<h2>${speed}</h2> <h3>Speed</h3>`)  

        for(let i = 0; i < basicData.abilities.length; i++){
            getAbility(basicData.abilities[i].ability.name)    
        }

        if(moreInfo.egg_groups.length == 1){
            $(".eggGroup").html(`
            <h3>${moreInfo.egg_groups[0].name}</h3>          
            `)
        }
        else if(moreInfo.egg_groups.length == 2){
            $(".eggGroup").html(`   
            <h3>${moreInfo.egg_groups[0].name} and ${moreInfo.egg_groups[1].name}</h3>          
            `)
        }
        
        $(".hatchTime").html(`${moreInfo.hatch_counter * 253} steps`)
        $(".captureInfo").html(`${moreInfo.capture_rate}`)

        if(moreInfo.gender_rate != -1){
            let femaleRatio = (100 / 8) * moreInfo.gender_rate
            $(".progress").css({
                "height":30,
                "width" :250,
                "border" : "2px solid #000",  
                "background" : `linear-gradient(to right,rgb(255, 0, 179) 20% ${femaleRatio}%,  blue 10% 20%)`       
            })
    
            
                $(".genderText").html(`female: ${femaleRatio}%  ‎ ‏ ‏ male: ${100 - femaleRatio}%`)
        }
        else
            $(".genderText").html("genderless")
    }
   
    
    if(page == 'likedPokemons.html'){
        const pokemonEl = document.createElement('div')
        pokemonEl.classList.add('pokemon')
        pokemonEl.style.backgroundColor = pokemonColor(basicData)
    
        const pokeInnerHTML = `
            <div class="img-container">
                <img src="${sprite}">
            </div>
            <div class="info">
                <span class="number">#${id.padStart(3, '0')}</span>              
                <h3 class="name">${name}</h3>
            </div>
        `;
    
        pokemonEl.innerHTML = pokeInnerHTML
        $(".poke-container").append(pokemonEl)
    }
}

function showInfo(data){
    const abilityElement = document.createElement('div')
    abilityElement.classList.add('ability')

    const abilityInnerHTML = `
    <h2>${data.name.toUpperCase()}</h2>
    <h3>${data.effect_entries[1].effect}</h3>
    `;

    abilityElement.innerHTML = abilityInnerHTML
    $(".moreInfo").append(abilityElement)
}
//#endregion

//#region likedPokemons.Html
if(page == 'likedPokemons.html'){

    function showPokemons(){
        for(let i = 0; i < storedPokemons.length; i++){
            getPokemon(storedPokemons[i])
        }
    }


    showPokemons()

    $(document).ready(function() {
        $('.searchBar').keypress(function (e) {
            var key = e.which;
            if(key == 13)  
             {
               $('input[name = butAssignProd]').click();
                getPokemon(input.val().toLowerCase())
                input.val('')
             }
        }) 
    })

    //#region  Sorting
    $("#sort").on('change', function(){
        var selectedVal = $(this).val();
        switch(selectedVal){
            case 'ascending':
                ascending()
            break;
            case 'descending':
                descending()
            break;
        }
    });

    function ascending(){
        $(".poke-container").html('')
        storedPokemons.sort(function(a, b){return a-b})
        pokemons = storedPokemons
        showPokemons()

        localStorage.setItem("pokemons", JSON.stringify(pokemons))
    }

    function descending(){
        $(".poke-container").html('')
        storedPokemons.sort(function(a, b){return b-a})
        pokemons = storedPokemons
        showPokemons()

        localStorage.setItem("pokemons", JSON.stringify(pokemons))
    }
    //#endregion
}
//#endregion

//#region searchPokemon.html
if(page == 'searchPokemon.html'){
    const input = $(".searchBar")

    $(document).ready(function() {
        $('.searchBar').keypress(function (e) {
            var key = e.which;
            if(key == 13)  
             {
               $('input[name = butAssignProd]').click();
                getPokemon(input.val().toLowerCase())
                input.val('')
             }
        }) 
    })
}
//#endregion

//#region Game.html
if(page == "game.html"){
    var randomNumber = Math.floor(Math.random() * 899) + 1
    getPokemon(randomNumber)

    $(document).ready(function() {
        $(".like").click(function(){
            randomNumber = Math.floor(Math.random() * 899) + 1
            getPokemon(randomNumber)
            pokemons.push(randomNumber)
            localStorage.setItem("pokemons", JSON.stringify(pokemons))
        }); 

        $(".dislike").click(function(){
            randomNumber = Math.floor(Math.random() * 899) + 1
            getPokemon(Math.floor(Math.random() * 899) + 1)
        }); 
    });
}

//#endregion