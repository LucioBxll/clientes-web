<template>
  <div class="min-h-screen py-8 px-4 sm:px-6 lg:px-8 transition-colors duration-200" :style="{'background-color': 'var(--color-primary)'}" dark:bg-gray-900>
    <div class="max-w-3xl mx-auto">
      <BaseLoader v-if="cargando" />
      <template v-else>
        <BaseAlert v-if="mensajeError" type="error">{{ mensajeError }}</BaseAlert>
        <BaseSuccess v-if="mensajeSuccess">{{ mensajeSuccess }}</BaseSuccess>
        <h1 class="text-3xl font-bold text-center mb-8 text-emerald-600 dark:text-emerald-400">Calendario</h1>
        
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-colors duration-200">
          <!-- Controles del calendario -->
          <div class="flex items-center justify-between mb-6">
            <button 
              @click="mesAnterior" 
              class="p-2 rounded-lg text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-gray-700 transition-colors"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h2 class="text-xl font-semibold text-gray-700 dark:text-gray-300">
              {{ nombreMesActual }} {{ anioActual }}
            </h2>
            <button 
              @click="mesSiguiente" 
              class="p-2 rounded-lg text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-gray-700 transition-colors"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          <!-- Días de la semana -->
          <div class="grid grid-cols-7 gap-1 mb-2">
            <div 
              v-for="dia in diasSemana" 
              :key="dia" 
              class="text-center text-sm font-medium text-gray-500 dark:text-gray-400 py-2"
            >
              {{ dia }}
            </div>
          </div>

          <!-- Días del mes -->
          <div class="grid grid-cols-7 gap-1">
            <div 
              v-for="dia in diasCalendario" 
              :key="dia.fecha"
              :class="[
                'p-2 text-center rounded-lg transition-colors cursor-pointer',
                dia.esMesActual 
                  ? 'text-gray-700 dark:text-gray-300 hover:bg-emerald-100 dark:hover:bg-gray-700' 
                  : 'text-gray-400 dark:text-gray-500',
                dia.esHoy ? 'bg-emerald-100 dark:bg-gray-700 font-bold' : '',
                dia.esSeleccionado ? 'bg-emerald-200 dark:bg-gray-600' : '',
                tieneEventos(dia.fecha) ? 'ring-2 ring-emerald-500 dark:ring-emerald-400' : ''
              ]"
              @click="seleccionarFecha(dia)"
            >
              {{ dia.dia }}
              <div v-if="tieneEventos(dia.fecha)" class="w-1 h-1 mx-auto mt-1 rounded-full bg-emerald-500 dark:bg-emerald-400"></div>
            </div>
          </div>

          <!-- Eventos del día seleccionado -->
          <div v-if="fechaSeleccionada" class="mt-6">
            <div class="flex justify-between items-center mb-4">
              <h3 class="text-lg font-semibold text-gray-700 dark:text-gray-300">
                Eventos para {{ fechaSeleccionada.toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) }}
              </h3>
              <button 
                @click="mostrarFormularioEvento = true"
                class="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 transition-colors"
              >
                Agregar Evento
              </button>
            </div>

            <!-- Lista de eventos -->
            <div class="space-y-2">
              <EventCard 
                v-for="evento in eventosDeFechaSeleccionada" 
                :key="evento.id" 
                :evento="evento" 
                @eliminar="eliminarEvento"
              />
            </div>
          </div>
        </div>
      </template>
    </div>

    <!-- Modal para agregar evento -->
    <BaseModal v-if="mostrarFormularioEvento" @close="mostrarFormularioEvento = false">
      <h3 class="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-4">Agregar Nuevo Evento</h3>
      
      <form @submit.prevent="agregarEvento">
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Título</label>
            <input 
              v-model="nuevoEvento.titulo"
              type="text" 
              required
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:text-gray-300"
            >
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Hora</label>
            <input 
              v-model="nuevoEvento.hora"
              type="time" 
              required
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:text-gray-300"
            >
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Descripción</label>
            <textarea 
              v-model="nuevoEvento.descripcion"
              rows="3"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:text-gray-300"
            ></textarea>
          </div>
        </div>

        <div class="mt-6 flex justify-end space-x-3">
          <button 
            type="button"
            @click="mostrarFormularioEvento = false"
            class="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            Cancelar
          </button>
          <button 
            type="submit"
            class="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 transition-colors"
          >
            Guardar Evento
          </button>
        </div>
      </form>
    </BaseModal>
  </div>
</template>

<script>
import EventCard from '../components/EventCard.vue';
import BaseModal from '../components/BaseModal.vue';
import BaseLoader from '../components/BaseLoader.vue';
import BaseAlert from '../components/BaseAlert.vue';
import BaseSuccess from '../components/BaseSuccess.vue';

export default {
  name: 'Calendario',
  components: { EventCard, BaseModal, BaseLoader, BaseAlert, BaseSuccess },
  data() {
    return {
      fechaActual: new Date(),
      fechaSeleccionada: null,
      mostrarFormularioEvento: false,
      diasSemana: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'],
      nuevoEvento: {
        titulo: '',
        hora: '',
        descripcion: ''
      },
      eventos: [],
      cargando: true,
      mensajeError: '',
      mensajeSuccess: ''
    }
  },
  computed: {
    nombreMesActual() {
      return this.fechaActual.toLocaleDateString('es-ES', { month: 'long' })
    },
    anioActual() {
      return this.fechaActual.getFullYear()
    },
    diasCalendario() {
      const anio = this.fechaActual.getFullYear()
      const mes = this.fechaActual.getMonth()
      
      const primerDia = new Date(anio, mes, 1)
      const ultimoDia = new Date(anio, mes + 1, 0)
      
      const diasPrevioMes = primerDia.getDay()
      const diasSiguienteMes = 6 - ultimoDia.getDay()
      
      const dias = []
      
      const mesAnterior = new Date(anio, mes, 0)
      for (let i = diasPrevioMes - 1; i >= 0; i--) {
        dias.push({
          fecha: new Date(anio, mes - 1, mesAnterior.getDate() - i),
          dia: mesAnterior.getDate() - i,
          esMesActual: false
        })
      }
      
      for (let i = 1; i <= ultimoDia.getDate(); i++) {
        const fecha = new Date(anio, mes, i)
        dias.push({
          fecha,
          dia: i,
          esMesActual: true,
          esHoy: this.esHoy(fecha),
          esSeleccionado: this.fechaSeleccionada && this.sonMismoDia(fecha, this.fechaSeleccionada)
        })
      }
      
      for (let i = 1; i <= diasSiguienteMes; i++) {
        dias.push({
          fecha: new Date(anio, mes + 1, i),
          dia: i,
          esMesActual: false
        })
      }
      
      return dias
    },
    eventosDeFechaSeleccionada() {
      if (!this.fechaSeleccionada) return []
      return this.eventos.filter(evento => this.sonMismoDia(evento.fecha, this.fechaSeleccionada))
    }
  },
  methods: {
    mesAnterior() {
      this.fechaActual = new Date(this.fechaActual.getFullYear(), this.fechaActual.getMonth() - 1, 1)
    },
    mesSiguiente() {
      this.fechaActual = new Date(this.fechaActual.getFullYear(), this.fechaActual.getMonth() + 1, 1)
    },
    seleccionarFecha(dia) {
      if (dia.esMesActual) {
        this.fechaSeleccionada = dia.fecha
      }
    },
    esHoy(fecha) {
      const hoy = new Date()
      return this.sonMismoDia(fecha, hoy)
    },
    sonMismoDia(fecha1, fecha2) {
      return fecha1.getDate() === fecha2.getDate() &&
             fecha1.getMonth() === fecha2.getMonth() &&
             fecha1.getFullYear() === fecha2.getFullYear()
    },
    tieneEventos(fecha) {
      return this.eventos.some(evento => this.sonMismoDia(evento.fecha, fecha))
    },
    agregarEvento() {
      if (!this.nuevoEvento.titulo || !this.nuevoEvento.hora) {
        this.mensajeError = 'Por favor, completa todos los campos obligatorios.';
        setTimeout(() => { this.mensajeError = ''; }, 4000);
        return;
      }
      const evento = {
        id: Date.now(),
        fecha: new Date(this.fechaSeleccionada),
        titulo: this.nuevoEvento.titulo,
        hora: this.nuevoEvento.hora,
        descripcion: this.nuevoEvento.descripcion
      }
      
      this.eventos.push(evento)
      this.guardarEventos()
      
      this.nuevoEvento = {
        titulo: '',
        hora: '',
        descripcion: ''
      }
      this.mostrarFormularioEvento = false
      this.mensajeSuccess = 'Evento agregado correctamente.';
      setTimeout(() => { this.mensajeSuccess = ''; }, 4000);
    },
    eliminarEvento(idEvento) {
      this.eventos = this.eventos.filter(evento => evento.id !== idEvento)
      this.guardarEventos()
      this.mensajeSuccess = 'Evento eliminado correctamente.';
      setTimeout(() => { this.mensajeSuccess = ''; }, 4000);
    },
    guardarEventos() {
      localStorage.setItem('eventosCalendario', JSON.stringify(this.eventos))
    },
    cargarEventos() {
      const guardados = localStorage.getItem('eventosCalendario')
      if (guardados) {
        this.eventos = JSON.parse(guardados).map(evento => ({
          ...evento,
          fecha: new Date(evento.fecha)
        }))
      }
    }
  },
  mounted() {
    this.cargarEventos()
    this.cargando = false
  }
}
</script>

<style scoped>
/* Estilos adicionales si son necesarios */
</style> 