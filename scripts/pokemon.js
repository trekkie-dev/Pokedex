const pokemonSearch = document.querySelector(".search-bar");
const numberFilter = document.querySelector("#pokemon-number");
const nameFilter = document.querySelector("#pokemon-name");
const pokemonList = document.querySelector(".pokemon-list");
const pokemonNotFound = document.querySelector(".pokemon-not-found");

const filterButton = document.querySelector('.pokemon-filter');
const filterCluster = document.getElementById('filter-cluster');

const typeColors = {
  normal: "#A8A77A",
  fire: "#EE8130",
  water: "#6390F0",
  electric: "#F7D02C",
  grass: "#7AC74C",
  ice: "#96D9D6",
  fighting: "#C22E28",
  poison: "#A33EA1",
  ground: "#E2BF65",
  flying: "#A98FF3",
  psychic: "#F95587",
  bug: "#A6B91A",
  rock: "#B6A136",
  ghost: "#735797",
  dragon: "#6F35FC",
  dark: "#705746",
  steel: "#B7B7CE",
  fairy: "#D685AD",
};

let allPokemon = [];

fetch(`https://pokeapi.co/api/v2/pokemon?limit=200`)
  .then((response) => response.json())
  .then((data) => {
    allPokemon = data.results;
    showPokemon(allPokemon);
  })

  async function fetchPokemonData(id) {
    try {
      const [pokemon] = await Promise.all([
        fetch(`https://pokeapi.co/api/v2/pokemon/${id}`).then((res) => res.json()),
      ]);
  
      const primaryType = pokemon.types[0]?.type?.name;
      const secondaryType = pokemon.types[1]?.type?.name;
  
      return { success: true, primaryType, secondaryType };
    } catch (error) {
      console.error("Failed to fetch Pokemon data before redirect", error);
      return { success: true, primaryType };
    }
  }

async function showPokemon(pokemonArray) {
  pokemonList.innerHTML = "";

  for (const pokemon of pokemonArray) {
    try {
      const pokemonID = pokemon.url.split("/")[6];
      const formattedID = pokemonID.padStart(3, "0");
      const response = await fetchPokemonData(pokemonID);
      const primaryType = response?.primaryType || "normal";
      const secondaryType = response?.secondaryType;
      const listItem = document.createElement("div");

      // if (typeof secondaryType === "undefined") {
      //   document.getElementById(".secondary").style.display = "none"
      // }

      listItem.className = "list-item";
      listItem.style.backgroundColor = typeColors[primaryType] || "var(--pokeball-red)";
      listItem.innerHTML = `
        <div class="pokemon-details">
          <div class="pokemon-types">
            <p>${primaryType}</p>
          </div>
          <p>${formattedID}</p>
          <h2>${pokemon.name}</h2>
        </div>
        <div class="pokemon-sprite">
          <img src="https://raw.githubusercontent.com/pokeapi/sprites/master/sprites/pokemon/other/dream-world/${pokemonID}.svg" 
                alt="${pokemon.name}" />
        </div>
        <span class="favorite-icon material-icons-outlined">favorite_border</span>
      `;
      listItem.addEventListener("click", async () => {
        const success = await fetchPokemonData(pokemonID);
        if (success) {
          window.location.href = `./pokemon-details.html?id=${pokemonID}`;
        }
      });

      pokemonList.appendChild(listItem);
    } catch (error) {
    }
  }
}
  

pokemonSearch.addEventListener("keyup", handleSearch);

function handleSearch() {
  const searchTerm = pokemonSearch.value.toLowerCase();
  let filteredPokemon;

  if (numberFilter.checked) {
    filteredPokemon = allPokemon.filter((pokemon) => {
      const pokemonID = pokemon.url.split("/")[6];
      return pokemonID.startsWith(searchTerm);
    });
  } else if (nameFilter.checked) {
    filteredPokemon = allPokemon.filter((pokemon) => {
      return pokemon.name.toLowerCase().startsWith(searchTerm);
    });
  } else {
    filteredPokemon = allPokemon;
  }

  showPokemon(filteredPokemon);

  if (filteredPokemon.length === 0) {
    pokemonNotFound.style.display = "block";
  } else {
    pokemonNotFound.style.display = "none";
  }
}

const clearSearch = document.querySelector(".clear-icon");
clearSearch.addEventListener("click", clearSearchBar);

function clearSearchBar() {
  pokemonSearch.value = "";
  showPokemon(allPokemon);
  pokemonNotFound.style.display = "none";
}

filterButton.addEventListener('click', () => {
  // Check the current display style of the filter section
  if (filterCluster.style.display === 'none' || filterCluster.style.display === '') {
    // Show the filter section and change button text
    filterCluster.style.display = 'block';
  } else {
    // Hide the filter section and change button text back
    filterCluster.style.display = 'none';
  }
});
// Makes sure the radio buttons clear correctly when a different radio is selected
numberFilter.addEventListener("change", handleSearch);
nameFilter.addEventListener("change", handleSearch);
