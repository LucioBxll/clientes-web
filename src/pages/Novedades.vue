<script>
import { ref, onMounted } from 'vue';

export default {
  name: 'Novedades',
  setup() {
    // Lista de novedades destacadas
    const novedades = ref([
      {
        id: 1,
        titulo: 'Semana de la Tecnología',
        descripcion: 'No te pierdas los eventos especiales y charlas con expertos de la industria.',
        fecha: '2025-06-20',
        autor: 'Coordinación Académica',
        imagen: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
        mostrarDetalles: false,
        comentarios: [
          {
            id: 1,
            autor: 'Juan Pérez',
            texto: '¡Excelente iniciativa! ¿Habrá talleres prácticos?'
          },
          {
            id: 2,
            autor: 'María García',
            texto: 'Me encantaría participar en las charlas de IA'
          }
        ]
      },
      {
        id: 2,
        titulo: 'Nuevos Cursos 2024',
        descripcion: 'Descubre las nuevas carreras y especializaciones disponibles.',
        fecha: '2024-03-18',
        autor: 'Secretaría Académica',
        imagen: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
        mostrarDetalles: false,
        comentarios: [
          {
            id: 1,
            autor: 'Carlos López',
            texto: '¿Cuándo comienzan las inscripciones?'
          }
        ]
      },
      {
        id: 3,
        titulo: 'Hackathon DaVinci',
        descripcion: '48 horas de programación, innovación y premios increíbles.',
        fecha: '2024-03-15',
        autor: 'Club de Programación',
        imagen: 'https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
        mostrarDetalles: false,
        comentarios: []
      }
    ]);

    const alternarDetallesNovedad = (novedad) => {
      novedad.mostrarDetalles = !novedad.mostrarDetalles;
    };

    return {
      novedades,
      alternarDetallesNovedad
    };
  }
};
</script>

<template>
  <div class="w-full bg-blue-50 dark:bg-gray-900 min-h-screen py-8">
    <div class="max-w-4xl mx-auto px-4">
      <h1 class="text-3xl font-bold mb-8 text-gray-900 dark:text-white text-center">Novedades</h1>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div v-for="novedad in novedades" :key="novedad.id"
          class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow hover:bg-blue-100 dark:hover:bg-gray-700 transition-all duration-200">
          <div class="flex justify-between items-start mb-4">
            <h2 class="text-xl font-semibold text-gray-900 dark:text-white">{{ novedad.titulo }}</h2>
            <button @click="alternarDetallesNovedad(novedad)" class="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
          <p class="text-gray-600 dark:text-gray-300 mb-4">{{ novedad.descripcion }}</p>
          <div class="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400 mb-2">
            <span>{{ novedad.autor }}</span>
            <span>{{ novedad.fecha }}</span>
          </div>
          <div v-if="novedad.mostrarDetalles" class="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <img :src="novedad.imagen" :alt="novedad.titulo" class="w-full h-48 object-cover rounded-lg mb-4">
            <div>
              <h4 class="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Comentarios</h4>
              <div v-if="novedad.comentarios.length === 0" class="text-gray-400">Sin comentarios aún.</div>
              <div v-else class="space-y-3">
                <div v-for="comentario in novedad.comentarios" :key="comentario.id" class="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                  <div class="flex items-start space-x-3">
                    <div class="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
                      <span class="text-sm font-medium text-primary-600 dark:text-primary-400">
                        {{ comentario.autor.charAt(0) }}
                      </span>
                    </div>
                    <div>
                      <p class="text-sm font-medium text-gray-700 dark:text-gray-300">{{ comentario.autor }}</p>
                      <p class="text-sm text-gray-600 dark:text-gray-400">{{ comentario.texto }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.shadow {
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}
</style> 