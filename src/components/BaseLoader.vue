<template>
  <div class="flex justify-center items-center w-full h-full py-8">
    <span class="loader"></span>
  </div>
</template>

<script>
export default {
  name: 'BaseLoader'
}
</script>

<style scoped>
.loader {
  width: 3rem;
  height: 3rem;
  border: 4px solid #cbd5e1; /* slate-300 */
  border-top: 4px solid #2563eb; /* blue-600 */
  border-radius: 50%;
  animation: spin 1s linear infinite;
  display: inline-block;
}
@media (prefers-color-scheme: dark) {
  .loader {
    border: 4px solid #334155; /* slate-700 */
    border-top: 4px solid #60a5fa; /* blue-400 */
  }
}
@keyframes spin {
  to { transform: rotate(360deg); }
}
</style> 