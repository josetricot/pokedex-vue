import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import PokemonGallery from './components/PokemonGallery.vue';

const app = createApp(App);

// registramos o componente globalmente
app.component('PokemonGallery', PokemonGallery);

app.mount('#app');