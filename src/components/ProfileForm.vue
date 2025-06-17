<template>
  <div>
    <div class="flex flex-col items-center mb-4">
      <img v-if="preview" :src="preview" alt="Previsualización" class="h-24 w-24 rounded-full object-cover border-2 border-emerald-400 shadow mb-2" />
    </div>
    <h2 class="text-xl font-bold mb-4 text-gray-900 dark:text-white">Editar perfil</h2>
    <div class="mb-4">
      <label for="pf-nombreUsuario" class="block text-gray-700 dark:text-gray-300 mb-1">Nombre de usuario</label>
      <input id="pf-nombreUsuario" v-model="form.nombreUsuario" type="text" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 text-gray-900 dark:text-gray-200" />
    </div>
    <div class="mb-4">
      <label for="pf-email" class="block text-gray-700 dark:text-gray-300 mb-1">Correo electrónico</label>
      <input id="pf-email" :value="form.email" type="email" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-400 cursor-not-allowed" readonly />
    </div>
    <div class="mb-4">
      <label for="pf-descripcion" class="block text-gray-700 dark:text-gray-300 mb-1">Descripción</label>
      <textarea id="pf-descripcion" v-model="form.descripcion" rows="3" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 text-gray-900 dark:text-gray-200" placeholder="Contanos algo sobre vos..."></textarea>
    </div>
    <div class="mb-4">
      <label for="pf-avatar" class="block text-gray-700 dark:text-gray-300 mb-1">Imagen de perfil</label>
      <input id="pf-avatar" type="file" accept="image/*" @change="onFileChange" class="block w-full text-sm text-black dark:text-white file:mr-2 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 dark:file:bg-neutral-900 file:text-emerald-700 dark:file:text-emerald-400 hover:file:bg-emerald-100 dark:hover:file:bg-emerald-800" />
    </div>
    <div class="flex justify-end gap-2">
      <button @click="$emit('cancelar')" class="px-4 py-2 rounded bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-500">Cancelar</button>
      <button @click="$emit('guardar', { ...form, avatar: selectedAvatar })" class="w-full p-3 rounded-lg bg-gray-900 dark:bg-neutral-950 hover:bg-gray-900 dark:hover:bg-emerald-800 focus:bg-gray-900 dark:focus:bg-gray-900 active:bg-blue-700 dark:active:bg-blue-600 text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed">Guardar</button>
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
      form: { ...this.value },
      selectedAvatar: null,
      preview: this.value.avatar_url || null
    }
  },
  methods: {
    onFileChange(e) {
      this.selectedAvatar = e.target.files[0] || null;
      if (this.selectedAvatar) {
        this.preview = URL.createObjectURL(this.selectedAvatar);
      } else {
        this.preview = this.value.avatar_url || null;
      }
    }
  },
  watch: {
    value(newVal) {
      this.form = { ...newVal };
      this.preview = newVal.avatar_url || null;
    }
  }
}
</script> 