<script>
import MainH1 from '../components/MainH1.vue';
import { AcademicCapIcon, CalendarIcon, ChatBubbleLeftRightIcon, BookOpenIcon } from '@heroicons/vue/24/outline';

export default {
    name: 'Home',
    components: { 
        MainH1,
        AcademicCapIcon,
        CalendarIcon,
        ChatBubbleLeftRightIcon,
        BookOpenIcon
    },
    data() {
        return {
            featuredPosts: [
                {
                    id: 1,
                    title: 'Semana de la Tecnología',
                    excerpt: 'No te pierdas los eventos especiales y charlas con expertos de la industria.',
                    date: '2024-03-20',
                    author: 'Coordinación Académica'
                },
                {
                    id: 2,
                    title: 'Nuevos Cursos 2024',
                    excerpt: 'Descubre las nuevas carreras y especializaciones disponibles.',
                    date: '2024-03-18',
                    author: 'Secretaría Académica'
                },
                {
                    id: 3,
                    title: 'Hackathon DaVinci',
                    excerpt: '48 horas de programación, innovación y premios increíbles.',
                    date: '2024-03-15',
                    author: 'Club de Programación'
                }
            ],
            upcomingEvents: [
                {
                    id: 1,
                    name: 'Workshop de UX/UI',
                    date: '25 de Marzo',
                    time: '18:00 hs'
                },
                {
                    id: 2,
                    name: 'Charla: Inteligencia Artificial',
                    date: '27 de Marzo',
                    time: '19:30 hs'
                },
                {
                    id: 3,
                    name: 'Demo Day Proyectos',
                    date: '30 de Marzo',
                    time: '17:00 hs'
                }
            ],
            quickAccess: [
                {
                    name: 'Campus Virtual',
                    icon: AcademicCapIcon,
                    route: '/campus'
                },
                {
                    name: 'Calendario',
                    icon: CalendarIcon,
                    route: '/calendario'
                },
                {
                    name: 'Chat Global',
                    icon: ChatBubbleLeftRightIcon,
                    route: '/chat-global'
                },
                {
                    name: 'Recursos',
                    icon: BookOpenIcon,
                    route: '/recursos'
                }
            ]
        }
    }
}
</script>

<template>
    <div class="w-full bg-blue-50 dark:bg-gray-900">
        <div class="container mx-auto">
            <!-- Hero Section -->


            <div class=" px-4 sm:px-6 lg:px-8 py-8">
                <section class="text-center py-12 px-4 mb-12 bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-800 dark:to-blue-900 text-white rounded-lg">
                    <MainH1 class="text-4xl font-bold mb-4">¡Les damos la bienvenida a DV Social!</MainH1>
                    <p class="text-xl max-w-2xl mx-auto">
                        DV Social es la mejor red para enterarte de todo lo que sucede en la Escuela, conectar con otras
                        personas, como alumnos, profesores, etc.
                    </p>
                </section>
                <!-- Featured Posts Section -->
                <section class="mb-12">
                    <h2 class="text-2xl font-semibold mb-6 text-gray-900 dark:text-white">Novedades Destacadas</h2>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div v-for="post in featuredPosts" :key="post.id"
                            class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm hover:bg-blue-100 dark:hover:bg-gray-700 transition-all duration-200">
                            <h3 class="text-lg font-semibold mb-2 text-gray-900 dark:text-white">{{ post.title }}</h3>
                            <p class="text-gray-600 dark:text-gray-300 mb-4">{{ post.excerpt }}</p>
                            <div class="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
                                <span>{{ post.author }}</span>
                                <span>{{ post.date }}</span>
                            </div>
                        </div>
                    </div>
                </section>

                <!-- Upcoming Events Section -->
                <section class="mb-12">
                    <h2 class="text-2xl font-semibold mb-6 text-gray-900 dark:text-white">Próximos Eventos</h2>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div v-for="event in upcomingEvents" :key="event.id"
                            class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm hover:bg-blue-100 dark:hover:bg-gray-700 transition-all duration-200">
                            <div class="flex items-center space-x-4">
                                <div class="bg-blue-100 dark:bg-blue-900 p-3 rounded-full">
                                    <svg class="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none"
                                        stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 class="font-semibold text-gray-900 dark:text-white">{{ event.name }}</h3>
                                    <p class="text-sm text-gray-500 dark:text-gray-400">{{ event.date }} - {{ event.time
                                    }}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <!-- Quick Access Section -->
                <section class="mb-12">
                    <h2 class="text-2xl font-semibold mb-6 text-gray-900 dark:text-white">Accesos Rápidos</h2>
                    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <router-link v-for="(item, index) in quickAccess" :key="index"
                            :to="item.route"
                            class="p-6 bg-white dark:bg-gray-800 rounded-lg text-center hover:bg-blue-100 dark:hover:bg-gray-700 transition-all duration-200 group">
                            <component :is="item.icon"
                                class="w-12 h-12 mx-auto mb-3 text-blue-600 dark:text-blue-400 group-hover:text-blue-700 dark:group-hover:text-blue-300" />
                            <span class="block text-gray-900 dark:text-white font-medium">{{ item.name }}</span>
                        </router-link>
                    </div>
                </section>
            </div>
        </div>
    </div>
</template>

<style scoped>
.shadow-sm {
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}

.shadow-md {
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}
</style>