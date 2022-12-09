
const pokeApi = {}

function convertPokeApiDetailToPokemon(pokeDetail) {
    const pokemon = new Pokemon()
    pokemon.number = pokeDetail.id
    pokemon.name = pokeDetail.name

    const types = pokeDetail.types.map((typeSlot) => typeSlot.type.name)
    const [type] = types

    pokemon.types = types
    pokemon.type = type
    
    const abilities = pokeDetail.abilities.map((ability) => ability.ability.name)
    const [ability] = abilities

    pokemon.abilities = abilities 
    pokemon.ability = ability

    // pokemon.photo = pokeDetail.sprites.other.dream_world.front_default
    pokemon.photo = pokeDetail.sprites.versions['generation-v']['black-white'].animated.front_default

    return pokemon

}



pokeApi.getPokemonDetail = (pokemon) => {
    return fetch(pokemon.url)
        .then((response) => response.json())       //busca uma lista com os detalhes do pokemon e converte e um json
        .then(convertPokeApiDetailToPokemon)
}

pokeApi.getPokemons = (offset = 0, limit = 1) => {
    const url = `https://pokeapi.co/api/v2/pokemon/?offset=${offset}&limit=${limit}`

    return fetch(url)                               // Busca a lista no endereço da API, retorna no formato response HTTP
        .then((response) => response.json())            // Converte o response HTTP em JSON
        .then((jsonBody) => jsonBody.results)           // filtra todo o arquivo json em uma lista de pokemons
        .then((pokemons) => pokemons.map(pokeApi.getPokemonDetail)) // mapeia a lista de pokemons em uma lista de requisições do detalhes
        .then((detailRequests) => Promise.all(detailRequests))      // espera que todas as requisições terminem 
        .then((pokemonsDetails) => pokemonsDetails)                 // retorna uma lista com os detalhes dos pokemons
}
