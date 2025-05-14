<template>
  <footer role="contentinfo" class="text-gray-600 dark:text-gray-300 text-sm bg-emerald-50 dark:bg-neutral-900 border-t border-emerald-200 dark:border-gray-700 py-4">
    <div class="flex flex-col gap-2 items-center">
      <p class="text-center text-emerald-700 dark:text-emerald-400">Minima &copy; 2025. Todos los derechos reservados.</p>
      <nav aria-label="Enlaces legales" class="flex flex-wrap justify-center gap-3">
        <router-link to="/terminos" class="text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 hover:underline transition-colors">Términos y Condiciones</router-link>
        <router-link to="/privacidad" class="text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 hover:underline transition-colors">Privacidad</router-link>
        <a href="#" class="text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 hover:underline transition-colors">Contacto</a>
      </nav>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'Footer',
};
</script> 