<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-emerald-600/80">
    <span class="loader-text font-lovelo-line-bold">MINIMA</span>
  </div>
</template>

<script>
export default {
  name: 'BaseLoader'
}
</script>

<style scoped>
.loader-text {
  font-size: 3rem;
  font-family: 'Lovelo', 'Arial', sans-serif;
  font-weight: bold;
  letter-spacing: 0.1em;
  color: #111;
  background: linear-gradient(90deg, #10b981 50%, #111 50%);
  background-size: 200% 100%;
  background-position: 100% 0;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: fillGreen 1.5s linear infinite;
}

@keyframes fillGreen {
  0% {
    background-position: 100% 0;
  }
  100% {
    background-position: 0 0;
  }
}
</style> 