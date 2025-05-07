<template>
  <li class="flex items-start gap-3 p-3 rounded-lg bg-primary-50 dark:bg-gray-700 hover:bg-primary-100 dark:hover:bg-gray-600 transition-colors">
    <slot name="avatar" />
    <article class="flex-1">
      <header class="font-semibold text-primary-700 dark:text-primary-400">
        {{ mensaje.username }}
      </header>
      <p class="text-secondary-600 dark:text-gray-300 break-words">{{ mensaje.body }}</p>
      <footer>
        <time class="text-xs md:text-sm text-secondary-400 dark:text-gray-500" :datetime="mensaje.created_at">
          {{ new Date(mensaje.created_at).toLocaleString() }}
        </time>
      </footer>
    </article>
  </li>
</template>

<script>
export default {
  name: 'MessageItem',
  props: {
    mensaje: Object
  }
}
</script> 