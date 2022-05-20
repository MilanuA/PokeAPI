const input = document.getElementsByName('search')

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
        // document.getElementById('show_error').classList.add('show')
        // document.getElementById('show_error').classList.remove('hidden')
    });

    fetch(`https://pokeapi.co/api/v2/evolution-chain/${pokemonName}`)
    .then((response) => response.json())
    .then((data) => {
        console.log(data.chain.evolves_to)
    });
}

 
input[0].addEventListener('keypress', function(event) {
    if (event.key === "Enter") {
      event.preventDefault();
      getPokemon(input[0].value.toLowerCase())
      input[0].value = ''
    }
});
