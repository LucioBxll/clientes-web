<template>
  <div class="bg-white dark:bg-neutral-900 rounded-lg p-6 max-w-md mx-auto">
    <h3 class="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Editar Publicación</h3>
    
    <form @submit.prevent="guardarCambios" class="space-y-4">
      <!-- Campo de texto -->
      <div>
        <label for="texto" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Texto de la publicación
        </label>
        <textarea
          id="texto"
          v-model="formulario.texto"
          rows="4"
          class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-neutral-800 dark:text-white"
          placeholder="Escribe tu publicación..."
          required
        ></textarea>
      </div>

      <!-- Imagen actual -->
      <div v-if="publicacion.image_url" class="space-y-2">
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Imagen actual
        </label>
        <div class="relative">
          <img 
            :src="publicacion.image_url" 
            alt="Imagen de la publicación" 
            class="w-full h-32 object-cover rounded-lg border border-gray-200 dark:border-gray-600"
          />
          <button
            type="button"
            @click="eliminarImagen"
            class="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 transition-colors"
          >
            <XMarkIcon class="w-4 h-4" />
          </button>
        </div>
      </div>

      <!-- Nueva imagen -->
      <div>
        <label for="nuevaImagen" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {{ publicacion.image_url ? 'Cambiar imagen' : 'Agregar imagen' }}
        </label>
        <input
          id="nuevaImagen"
          type="file"
          accept="image/*"
          @change="seleccionarImagen"
          class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-neutral-800 dark:text-white"
        />
        <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Formatos soportados: JPG, PNG, GIF. Máximo 5MB.
        </p>
      </div>

      <!-- Vista previa de nueva imagen -->
      <div v-if="nuevaImagen" class="space-y-2">
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Vista previa de nueva imagen
        </label>
        <div class="relative">
          <img 
            :src="urlVistaPrevia" 
            alt="Vista previa" 
            class="w-full h-32 object-cover rounded-lg border border-gray-200 dark:border-gray-600"
          />
          <button
            type="button"
            @click="cancelarNuevaImagen"
            class="absolute top-2 right-2 bg-gray-500 hover:bg-gray-600 text-white rounded-full p-1 transition-colors"
          >
            <XMarkIcon class="w-4 h-4" />
          </button>
        </div>
      </div>

      <!-- Botones -->
      <div class="flex gap-3 pt-4">
        <button
          type="button"
          @click="$emit('cancelar')"
          class="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-neutral-800 hover:bg-gray-50 dark:hover:bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
        >
          Cancelar
        </button>
        <button
          type="submit"
          :disabled="guardando"
          class="flex-1 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span v-if="guardando">Guardando...</span>
          <span v-else>Guardar Cambios</span>
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import { ref, computed } from 'vue';
import { XMarkIcon } from '@heroicons/vue/24/outline';
import { uploadPublicationImage } from '../services/storage';

export default {
  name: 'EditPublicationForm',
  components: { XMarkIcon },
  props: {
    publicacion: {
      type: Object,
      required: true
    }
  },
  emits: ['guardar', 'cancelar'],
  setup(props, { emit }) {
    const formulario = ref({
      texto: props.publicacion.body || ''
    });
    const nuevaImagen = ref(null);
    const urlVistaPrevia = ref('');
    const guardando = ref(false);

    const seleccionarImagen = (event) => {
      const archivo = event.target.files[0];
      if (archivo) {
        // Validar tamaño (5MB)
        if (archivo.size > 5 * 1024 * 1024) {
          alert('La imagen es demasiado grande. Máximo 5MB.');
          return;
        }
        
        nuevaImagen.value = archivo;
        const reader = new FileReader();
        reader.onload = (e) => {
          urlVistaPrevia.value = e.target.result;
        };
        reader.readAsDataURL(archivo);
      }
    };

    const cancelarNuevaImagen = () => {
      nuevaImagen.value = null;
      urlVistaPrevia.value = '';
    };

    const eliminarImagen = () => {
      nuevaImagen.value = 'eliminar';
      urlVistaPrevia.value = '';
    };

    const guardarCambios = async () => {
      guardando.value = true;
      try {
        let imagenUrl = props.publicacion.image_url;

        // Manejar la nueva imagen
        if (nuevaImagen.value === 'eliminar') {
          imagenUrl = null;
        } else if (nuevaImagen.value) {
          imagenUrl = await uploadPublicationImage(nuevaImagen.value);
        }

        emit('guardar', {
          id: props.publicacion.id,
          body: formulario.value.texto,
          image_url: imagenUrl
        });
      } catch (error) {
        console.error('Error al guardar la publicación:', error);
        alert('Error al guardar la publicación. Inténtalo de nuevo.');
      } finally {
        guardando.value = false;
      }
    };

    return {
      formulario,
      nuevaImagen,
      urlVistaPrevia,
      guardando,
      seleccionarImagen,
      cancelarNuevaImagen,
      eliminarImagen,
      guardarCambios
    };
  }
};
</script> 