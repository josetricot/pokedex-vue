<template>
  <div class="pokemon-card">
    <img :src="imageUrl" :alt="pokemon.name" />
    <h3>{{ pokemon.name }}</h3>
  </div>
</template>

<script>
export default {
  props: ["pokemon"],
  computed: {
    imageUrl() {
      const id = this.pokemon.url.split("/").filter(Boolean).pop()
      return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`
    }
  }
}
</script>

<style scoped>
.pokemon-card {
  background: white;
  border-radius: 12px;
  padding: 12px;
  text-align: center;
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
  cursor: pointer;
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.pokemon-card:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(0,0,0,0.2);
}

.pokemon-card img {
  width: 100px;
  height: 100px;
}
</style>