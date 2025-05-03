<template>
  <div class="min-h-screen bg-blue-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
    <div class="max-w-3xl mx-auto">
      <h1 class="text-3xl font-bold text-center mb-8 text-primary-600 dark:text-primary-400">Calendario</h1>
      
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-colors duration-200">
        <!-- Controles del calendario -->
        <div class="flex items-center justify-between mb-6">
          <button 
            @click="previousMonth" 
            class="p-2 rounded-lg text-primary-600 dark:text-primary-400 hover:bg-primary-100 dark:hover:bg-gray-700 transition-colors"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h2 class="text-xl font-semibold text-gray-700 dark:text-gray-300">
            {{ currentMonthName }} {{ currentYear }}
          </h2>
          <button 
            @click="nextMonth" 
            class="p-2 rounded-lg text-primary-600 dark:text-primary-400 hover:bg-primary-100 dark:hover:bg-gray-700 transition-colors"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        <!-- Días de la semana -->
        <div class="grid grid-cols-7 gap-1 mb-2">
          <div 
            v-for="day in weekDays" 
            :key="day" 
            class="text-center text-sm font-medium text-gray-500 dark:text-gray-400 py-2"
          >
            {{ day }}
          </div>
        </div>

        <!-- Días del mes -->
        <div class="grid grid-cols-7 gap-1">
          <div 
            v-for="day in calendarDays" 
            :key="day.date"
            :class="[
              'p-2 text-center rounded-lg transition-colors cursor-pointer',
              day.isCurrentMonth 
                ? 'text-gray-700 dark:text-gray-300 hover:bg-primary-100 dark:hover:bg-gray-700' 
                : 'text-gray-400 dark:text-gray-500',
              day.isToday ? 'bg-primary-100 dark:bg-gray-700 font-bold' : '',
              day.isSelected ? 'bg-primary-200 dark:bg-gray-600' : '',
              hasEvents(day.date) ? 'ring-2 ring-primary-500 dark:ring-primary-400' : ''
            ]"
            @click="selectDate(day)"
          >
            {{ day.day }}
            <div v-if="hasEvents(day.date)" class="w-1 h-1 mx-auto mt-1 rounded-full bg-primary-500 dark:bg-primary-400"></div>
          </div>
        </div>

        <!-- Eventos del día seleccionado -->
        <div v-if="selectedDate" class="mt-6">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-semibold text-gray-700 dark:text-gray-300">
              Eventos para {{ selectedDate.toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) }}
            </h3>
            <button 
              @click="showEventForm = true"
              class="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 transition-colors"
            >
              Agregar Evento
            </button>
          </div>

          <!-- Lista de eventos -->
          <div class="space-y-2">
            <div 
              v-for="event in eventsForSelectedDate" 
              :key="event.id"
              class="p-3 rounded-lg bg-primary-50 dark:bg-gray-700 border border-primary-200 dark:border-gray-600"
            >
              <div class="flex items-center justify-between">
                <span class="font-medium text-gray-700 dark:text-gray-300">{{ event.title }}</span>
                <div class="flex items-center space-x-2">
                  <span class="text-sm text-gray-500 dark:text-gray-400">{{ event.time }}</span>
                  <button 
                    @click="deleteEvent(event.id)"
                    class="text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
              <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">{{ event.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal para agregar evento -->
    <div v-if="showEventForm" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md">
        <h3 class="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-4">Agregar Nuevo Evento</h3>
        
        <form @submit.prevent="addEvent">
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Título</label>
              <input 
                v-model="newEvent.title"
                type="text" 
                required
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-gray-300"
              >
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Hora</label>
              <input 
                v-model="newEvent.time"
                type="time" 
                required
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-gray-300"
              >
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Descripción</label>
              <textarea 
                v-model="newEvent.description"
                rows="3"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-gray-300"
              ></textarea>
            </div>
          </div>

          <div class="mt-6 flex justify-end space-x-3">
            <button 
              type="button"
              @click="showEventForm = false"
              class="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button 
              type="submit"
              class="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 transition-colors"
            >
              Guardar Evento
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Calendar',
  data() {
    return {
      currentDate: new Date(),
      selectedDate: null,
      showEventForm: false,
      weekDays: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'],
      newEvent: {
        title: '',
        time: '',
        description: ''
      },
      events: []
    }
  },
  computed: {
    currentMonthName() {
      return this.currentDate.toLocaleDateString('es-ES', { month: 'long' })
    },
    currentYear() {
      return this.currentDate.getFullYear()
    },
    calendarDays() {
      const year = this.currentDate.getFullYear()
      const month = this.currentDate.getMonth()
      
      const firstDay = new Date(year, month, 1)
      const lastDay = new Date(year, month + 1, 0)
      
      const prevMonthDays = firstDay.getDay()
      const nextMonthDays = 6 - lastDay.getDay()
      
      const days = []
      
      const prevMonth = new Date(year, month, 0)
      for (let i = prevMonthDays - 1; i >= 0; i--) {
        days.push({
          date: new Date(year, month - 1, prevMonth.getDate() - i),
          day: prevMonth.getDate() - i,
          isCurrentMonth: false
        })
      }
      
      for (let i = 1; i <= lastDay.getDate(); i++) {
        const date = new Date(year, month, i)
        days.push({
          date,
          day: i,
          isCurrentMonth: true,
          isToday: this.isToday(date),
          isSelected: this.selectedDate && this.isSameDay(date, this.selectedDate)
        })
      }
      
      for (let i = 1; i <= nextMonthDays; i++) {
        days.push({
          date: new Date(year, month + 1, i),
          day: i,
          isCurrentMonth: false
        })
      }
      
      return days
    },
    eventsForSelectedDate() {
      if (!this.selectedDate) return []
      return this.events.filter(event => this.isSameDay(event.date, this.selectedDate))
    }
  },
  methods: {
    previousMonth() {
      this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() - 1, 1)
    },
    nextMonth() {
      this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 1)
    },
    selectDate(day) {
      if (day.isCurrentMonth) {
        this.selectedDate = day.date
      }
    },
    isToday(date) {
      const today = new Date()
      return this.isSameDay(date, today)
    },
    isSameDay(date1, date2) {
      return date1.getDate() === date2.getDate() &&
             date1.getMonth() === date2.getMonth() &&
             date1.getFullYear() === date2.getFullYear()
    },
    hasEvents(date) {
      return this.events.some(event => this.isSameDay(event.date, date))
    },
    addEvent() {
      const event = {
        id: Date.now(),
        date: new Date(this.selectedDate),
        title: this.newEvent.title,
        time: this.newEvent.time,
        description: this.newEvent.description
      }
      
      this.events.push(event)
      this.saveEvents()
      
      this.newEvent = {
        title: '',
        time: '',
        description: ''
      }
      this.showEventForm = false
    },
    deleteEvent(eventId) {
      this.events = this.events.filter(event => event.id !== eventId)
      this.saveEvents()
    },
    saveEvents() {
      localStorage.setItem('calendarEvents', JSON.stringify(this.events))
    },
    loadEvents() {
      const savedEvents = localStorage.getItem('calendarEvents')
      if (savedEvents) {
        this.events = JSON.parse(savedEvents).map(event => ({
          ...event,
          date: new Date(event.date)
        }))
      }
    }
  },
  mounted() {
    this.loadEvents()
  }
}
</script>

<style scoped>
/* Estilos adicionales si son necesarios */
</style> 