const pokemonList = document.getElementById('pokemonList')
const loadMoreButton = document.getElementById('loadMoreButton')
const searchInput = document.getElementById('searchInput')
const typeFilter = document.getElementById('typeFilter')
const darkModeToggle = document.getElementById('darkModeToggle')

const maxRecords = 151
const limit = 10
let offset = 0
let allPokemons = []

function convertPokemonToLi(pokemon) {
    return `
        <li class="pokemon ${pokemon.type}">
            <span class="number">#${pokemon.number}</span>
            <span class="name">${pokemon.name}</span>

            <div class="detail">
                <ol class="types">
                    ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
                </ol>

                <img src="${pokemon.photo}" alt="${pokemon.name}">
            </div>
            <div class="extra-info">
                <small>Altura: ${pokemon.height / 10} m</small><br>
                <small>Peso: ${pokemon.weight / 10} kg</small>
            </div>
        </li>
    `
}

function renderPokemons(pokemons) {
    pokemonList.innerHTML = pokemons.map(convertPokemonToLi).join('')
}

function loadPokemonItens(offset, limit) {
    pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
        allPokemons = [...allPokemons, ...pokemons]
        renderPokemons(allPokemons)
    })
}

function filterPokemons() {
    const searchTerm = searchInput.value.toLowerCase()
    const type = typeFilter.value

    let filtered = allPokemons

    if (searchTerm) {
        filtered = filtered.filter(p => p.name.toLowerCase().includes(searchTerm) || p.number == searchTerm)
    }

    if (type !== 'all') {
        filtered = filtered.filter(p => p.types.includes(type))
    }

    renderPokemons(filtered)
}

searchInput.addEventListener('input', filterPokemons)
typeFilter.addEventListener('change', filterPokemons)

darkModeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark')
    darkModeToggle.textContent = document.body.classList.contains('dark') ? '☀️ Modo Claro' : '🌙 Modo Escuro'
})

loadPokemonItens(offset, limit)

loadMoreButton.addEventListener('click', () => {
    offset += limit
    const qtdRecordsWithNexPage = offset + limit

    if (qtdRecordsWithNexPage >= maxRecords) {
        const newLimit = maxRecords - offset
        loadPokemonItens(offset, newLimit)
        loadMoreButton.parentElement.removeChild(loadMoreButton)
    } else {
        loadPokemonItens(offset, limit)
    }
})