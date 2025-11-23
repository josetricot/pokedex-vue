<template>
  <div>
    <header>
      <slot name="header">
        <!-- conteúdo padrão se nenhum header for passado -->
        <h1>Projeto Vue CPW2 - Pokédex</h1>
      </slot>
    </header>

    <main>
      <slot>
        <!-- slot padrão: o conteúdo principal -->
        <PokemonGallery />
      </slot>
    </main>

    <footer>
      <slot name="footer">
        <!-- conteúdo padrão do rodapé -->
        <p>Projeto desenvolvido por José Athaualpa Kolesny Tricot</p>
      </slot>
    </footer>
  </div>
</template>

<script>
import PokemonGallery from './components/PokemonGallery.vue';

export default {
  name: "App",
  components: {
    PokemonGallery
  }
};
</script>

<style>
header, footer {
  text-align: center;
  padding: 10px;
  background-color: #fff;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
  margin-bottom: 20px;
}

footer {
  margin-top: 20px;
  font-size: 0.9em;
  color: #555;
}
</style>