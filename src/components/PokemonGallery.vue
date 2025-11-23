<template>
  <div>
    <h1>Pokédex - Primeira Geração</h1>

    <!-- Filtros -->
    <div class="filters">
      <div class="type-buttons">
        <button
          class="type-btn"
          :class="{ active: selectedType === '' }"
          @click="selectedType = ''"
        >
          Listar todos
        </button>

        <button
          v-for="t in tiposDisponiveis"
          :key="t"
          class="type-btn"
          :style="{ backgroundColor: typeColors[t] }"
          :class="{ active: selectedType === t }"
          @click="selectedType = t"
        >
          {{ t }}
        </button>
      </div>

      <div class="order-buttons">
        <button
          class="order-btn"
          :class="{ active: orderBy === 'id' }"
          @click="orderBy = 'id'"
        >
          ID
        </button>

        <button
          class="order-btn"
          :class="{ active: orderBy === 'az' }"
          @click="orderBy = 'az'"
        >
          A-Z
        </button>

        <button
          class="order-btn"
          :class="{ active: orderBy === 'za' }"
          @click="orderBy = 'za'"
        >
          Z-A
        </button>
      </div>

      <!-- Barra de pesquisa -->
      <input
        type="text"
        v-model="searchQuery"
        placeholder="Pesquisar Pokémon..."
        class="search-input"
      />
    </div>

    <!-- GALERIA -->
    <div class="pokemon-gallery">
      <PokemonCard
        v-for="pokemon in pokemonsFiltrados"
        :key="pokemon.name"
        :pokemon="pokemon"
        @click="selectPokemon(pokemon)"
      />
    </div>

    <PokemonDetail
      v-if="selectedPokemon"
      :pokemon="selectedPokemon"
      @close="selectedPokemon = null"
      @next="showNext"
      @prev="showPrev"
    />
  </div>
</template>

<script>
import PokemonCard from './PokemonCard.vue'
import PokemonDetail from './PokemonDetail.vue'

export default {
  components: { PokemonCard, PokemonDetail },
  data() {
    return {
      pokemons: [],
      selectedPokemon: null,
      limit: 151,

      selectedType: "",
      tiposDisponiveis: [
        "fire", "water", "grass", "electric", "ice",
        "fighting", "poison", "ground", "flying",
        "psychic", "bug", "rock", "ghost", "dragon",
        "dark", "steel", "fairy", "normal"
      ],

      searchQuery: "",

      orderBy: "id",

      typeColors: {
        fire: "#F08030",
        water: "#6890F0",
        grass: "#78C850",
        electric: "#F8D030",
        ice: "#98D8D8",
        fighting: "#C03028",
        poison: "#A040A0",
        ground: "#E0C068",
        flying: "#A890F0",
        psychic: "#F85888",
        bug: "#A8B820",
        rock: "#B8A038",
        ghost: "#705898",
        dragon: "#7038F8",
        dark: "#705848",
        steel: "#B8B8D0",
        fairy: "#EE99AC",
        normal: "#A8A878"
      }
    }
  },

  computed: {
    pokemonsFiltrados() {
      let list = this.pokemons
        .filter(p => {
          if (!this.selectedType) return true;
          return p.types.includes(this.selectedType);
        })
        .filter(p =>
          p.name.toLowerCase().includes(this.searchQuery.toLowerCase())
        );

      if (this.orderBy === "id") {
        list.sort((a, b) => a.id - b.id);
      } else if (this.orderBy === "az") {
        list.sort((a, b) => a.name.localeCompare(b.name));
      } else if (this.orderBy === "za") {
        list.sort((a, b) => b.name.localeCompare(a.name));
      }

      return list;
    }
  },

  mounted() {
    this.fetchPokemons()
  },

  methods: {
    async fetchPokemons() {
      try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${this.limit}`)
        const data = await response.json()

        const results = await Promise.all(
          data.results.map(async (p) => {
            const full = await fetch(p.url).then(r => r.json());
            return {
              name: p.name,
              url: p.url,
              id: full.id,
              types: full.types.map(t => t.type.name)
            };
          })
        );

        this.pokemons = results;

      } catch (error) {
        console.error("Erro ao buscar Pokémons:", error)
      }
    },

    async selectPokemon(pokemon) {
      try {
        const response = await fetch(pokemon.url)
        const fullData = await response.json()
        this.selectedPokemon = fullData
      } catch (error) {
        console.error("Erro ao carregar Pokémon selecionado:", error)
      }
    },

    async showNext() {
      try {
        const currentId = this.selectedPokemon.id
        if (currentId < this.limit) {
          const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${currentId + 1}`)
          this.selectedPokemon = await response.json()
        }
      } catch (error) {
        console.error("Erro ao carregar próximo Pokémon:", error)
      }
    },

    async showPrev() {
      try {
        const currentId = this.selectedPokemon.id
        if (currentId > 1) {
          const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${currentId - 1}`)
          this.selectedPokemon = await response.json()
        }
      } catch (error) {
        console.error("Erro ao carregar Pokémon anterior:", error)
      }
    }
  }
}
</script>

<style scoped>

.order-buttons {
  display: flex;
  gap: 8px;
  margin-left: 10px;
}

.order-btn {
  padding: 6px 12px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  background: #555;
  color: white;
  transition: transform 0.1s, opacity 0.2s;
}

.order-btn:hover {
  transform: scale(1.05);
  opacity: 0.9;
}

.order-btn.active {
  outline: 2px solid white;
  box-shadow: 0 0 6px rgba(0,0,0,0.2);
}

.pokemon-gallery {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 16px;
  margin-top: 20px;
}

.filters {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 10px;
}

.type-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.type-btn {
  padding: 6px 12px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  text-transform: capitalize;
  color: white;
  background: #888;
  transition: transform 0.1s, opacity 0.2s;
}

.type-btn:hover {
  transform: scale(1.05);
  opacity: 0.9;
}

.type-btn.active {
  outline: 2px solid white;
  box-shadow: 0 0 6px rgba(0,0,0,0.2);
}

.search-input {
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid #ccc;
  font-size: 14px;
}
</style>