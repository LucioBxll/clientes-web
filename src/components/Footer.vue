<template>
  <footer role="contentinfo" class="text-gray-600 dark:text-gray-300 text-sm">
    <div class="flex flex-col gap-2 items-center">
      <p class="text-center">Davinci &copy; 2025. Todos los derechos reservados.</p>
      <nav aria-label="Enlaces legales" class="flex flex-wrap justify-center gap-3">
        <router-link to="/terminos" class="hover:underline">Términos y Condiciones</router-link>
        <router-link to="/privacidad" class="hover:underline">Privacidad</router-link>
        <a href="#" class="hover:underline">Contacto</a>
      </nav>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'Footer',
};
</script> 