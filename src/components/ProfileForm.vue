<template>
  <div>
    <h2 class="text-xl font-bold mb-4 text-gray-900 dark:text-white">Editar perfil</h2>
    <div class="mb-4">
      <label class="block text-gray-700 dark:text-gray-300 mb-1">Nombre de usuario</label>
      <input v-model="form.nombreUsuario" type="text" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-200" />
    </div>
    <div class="mb-4">
      <label class="block text-gray-700 dark:text-gray-300 mb-1">Correo electrónico</label>
      <input :value="form.email" type="email" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-400 cursor-not-allowed" readonly />
    </div>
    <div class="mb-4">
      <label class="block text-gray-700 dark:text-gray-300 mb-1">Descripción</label>
      <textarea v-model="form.descripcion" rows="3" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-200" placeholder="Contanos algo sobre vos..."></textarea>
    </div>
    <div class="flex justify-end gap-2">
      <button @click="$emit('cancelar')" class="px-4 py-2 rounded bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-500">Cancelar</button>
      <button @click="$emit('guardar', form)" class="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700">Guardar</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProfileForm',
  props: {
    value: Object
  },
  data() {
    return {
      form: { ...this.value }
    }
  },
  watch: {
    value(newVal) {
      this.form = { ...newVal };
    }
  }
}
</script> 