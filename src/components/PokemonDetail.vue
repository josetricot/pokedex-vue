<template>
  <transition name="fade">
    <div class="overlay" @click.self="$emit('close')">
      <div class="detail-card">

        <!-- Transição entre Pokémon -->
        <transition name="pokemon-switch" mode="out-in">
          <div :key="pokemon.id">

            <!-- Botão fechar -->
            <button class="close-btn" @click="$emit('close')">✖</button>

            <!-- Cabeçalho -->
            <div class="header">
              <img :src="pokemon.sprites.other['official-artwork'].front_default" />
              <h2>#{{ pokemon.id }} - {{ pokemon.name }}</h2>

              <p class="types">
                <span
                  v-for="type in pokemon.types"
                  :key="type.type.name"
                  :class="'type ' + type.type.name"
                >
                  {{ type.type.name }}
                </span>
              </p>
            </div>

            <!-- Grid de informações -->
            <div class="info-grid">
              <div><strong>Altura:</strong> {{ pokemon.height / 10 }} m</div>
              <div><strong>Peso:</strong> {{ pokemon.weight / 10 }} kg</div>
              <div><strong>Experiência base:</strong> {{ pokemon.base_experience }}</div>
            </div>

            <!-- Habilidades -->
            <h3>Habilidades</h3>
            <ul>
              <li v-for="ability in pokemon.abilities" :key="ability.ability.name">
                {{ ability.ability.name }}
              </li>
            </ul>

            <!-- Estatísticas -->
            <h3>Estatísticas</h3>
            <ul>
              <li v-for="stat in pokemon.stats" :key="stat.stat.name">
                {{ stat.stat.name }}: {{ stat.base_stat }}
              </li>
            </ul>

            <!-- Fraquezas -->
            <h3>Fraquezas</h3>
            <div v-if="fraquezas.length">
              <span
                v-for="f in fraquezas"
                :key="f"
                :class="'weakness-badge ' + f"
              >
                {{ f }}
              </span>
            </div>
            <div v-else class="loading-weakness">
              Carregando fraquezas...
            </div>

            <!-- Botões de navegação -->
            <div class="nav-buttons">
              <button @click="$emit('prev')">⬅ Anterior</button>
              <button @click="$emit('next')">Próximo ➡</button>
            </div>

          </div>
        </transition>

      </div>
    </div>
  </transition>
</template>

<script>
export default {
  props: ["pokemon"],
  data() {
    return {
      fraquezas: []
    }
  },
  watch: {
    pokemon: {
      immediate: true,
      handler(newPokemon) {
        if (newPokemon) this.fetchFraquezas()
      }
    }
  },
  methods: {
    async fetchFraquezas() {
      this.fraquezas = []
      try {
        const fraquezasSet = new Set()

        for (const tipo of this.pokemon.types) {
          const response = await fetch(tipo.type.url)
          const data = await response.json()

          data.damage_relations.double_damage_from.forEach(dano => {
            fraquezasSet.add(dano.name)
          })
        }

        this.fraquezas = Array.from(fraquezasSet)
      } catch (error) {
        console.error("Erro ao buscar fraquezas:", error)
      }
    }
  }
}
</script>

<style scoped>
/* Fade da tela */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

/* Fundo escuro */
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.6);
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Card */
.detail-card {
  background: white;
  border-radius: 16px;
  padding: 20px;
  width: 90%;
  max-width: 480px;
  position: relative;
  box-shadow: 0 6px 20px rgba(0,0,0,0.3);
  animation: scaleUp 0.3s ease;
}

/* Animação inicial */
@keyframes scaleUp {
  from { transform: scale(0.8); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}

/* Botão fechar */
.close-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  background: #ff4d4d;
  color: white;
  border: none;
  border-radius: 50%;
  font-size: 16px;
  width: 28px;
  height: 28px;
  cursor: pointer;
}

/* Cabeçalho */
.header {
  text-align: center;
}

.header img {
  width: 150px;
  height: 150px;
}

.type {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 8px;
  color: white;
  margin: 2px;
  font-size: 0.9em;
  text-transform: capitalize;
}

/* Grid info */
.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  margin: 15px 0;
}

/* Fraquezas */
.weakness-badge {
  display: inline-block;
  color: white;
  padding: 5px 10px;
  border-radius: 10px;
  margin: 3px;
  text-transform: capitalize;
  font-size: 0.85em;
}

/* Texto carregando */
.loading-weakness {
  color: #777;
  font-style: italic;
  margin-bottom: 8px;
}

/* Transição ao trocar de Pokémon */
.pokemon-switch-enter-active,
.pokemon-switch-leave-active {
  transition: opacity 0.25s ease;
}
.pokemon-switch-enter-from,
.pokemon-switch-leave-to {
  opacity: 0;
}

/* Navegação */
.nav-buttons {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

.nav-buttons button {
  background: #007bff;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 8px 14px;
  cursor: pointer;
}

.nav-buttons button:hover {
  background: #0056b3;
}

/* Cores dos tipos */
.fire { background: #EE8130; }
.water { background: #6390F0; }
.grass { background: #7AC74C; }
.electric { background: #F7D02C; color: #333; }
.ice { background: #96D9D6; color: #333; }
.fighting { background: #C22E28; }
.poison { background: #A33EA1; }
.ground { background: #E2BF65; color: #333; }
.flying { background: #A98FF3; }
.psychic { background: #F95587; }
.bug { background: #A6B91A; }
.rock { background: #B6A136; color: #333; }
.ghost { background: #735797; }
.dragon { background: #6F35FC; }
.dark { background: #705746; }
.steel { background: #B7B7CE; color: #333; }
.fairy { background: #D685AD; }
.normal { background: #A8A77A; color: #333; }
</style>