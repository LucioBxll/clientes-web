<template>
  <footer role="contentinfo" class="bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-800 dark:to-blue-900 text-white py-6 shadow-inner w-full transition-colors duration-200">
    <div class="container mx-auto flex flex-col md:flex-row items-center justify-between px-4">
      <p class="text-center md:text-left text-sm">Davinci &copy; 2025. Todos los derechos reservados.</p>
      <nav aria-label="Enlaces legales" class="flex space-x-4 mt-2 md:mt-0">
        <router-link to="/terminos" class="hover:text-blue-200 dark:hover:text-gray-300 transition-colors">Términos y Condiciones</router-link>
        <router-link to="/privacidad" class="hover:text-blue-200 dark:hover:text-gray-300 transition-colors">Privacidad</router-link>
        <a href="#" class="hover:text-blue-200 dark:hover:text-gray-300 transition-colors">Contacto</a>
      </nav>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'Footer',
};
</script> 