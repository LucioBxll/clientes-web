<script>
import MainH1 from '../components/MainH1.vue';
import { AcademicCapIcon, CalendarIcon, ChatBubbleLeftRightIcon, BookOpenIcon } from '@heroicons/vue/24/outline';
import { getCurrentUser } from '../services/auth';

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
            user: null,
            featuredPosts: [
                {
                    id: 1,
                    title: 'Semana de la Tecnología',
                    excerpt: 'No te pierdas los eventos especiales y charlas con expertos de la industria.',
                    date: '2025-06-20',
                    author: 'Coordinación Académica',
                    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
                    showDetails: false,
                    newComment: '',
                    comments: [
                        {
                            id: 1,
                            author: 'Juan Pérez',
                            text: '¡Excelente iniciativa! ¿Habrá talleres prácticos?'
                        },
                        {
                            id: 2,
                            author: 'María García',
                            text: 'Me encantaría participar en las charlas de IA'
                        }
                    ]
                },
                {
                    id: 2,
                    title: 'Nuevos Cursos 2024',
                    excerpt: 'Descubre las nuevas carreras y especializaciones disponibles.',
                    date: '2024-03-18',
                    author: 'Secretaría Académica',
                    image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
                    showDetails: false,
                    newComment: '',
                    comments: [
                        {
                            id: 1,
                            author: 'Carlos López',
                            text: '¿Cuándo comienzan las inscripciones?'
                        }
                    ]
                },
                {
                    id: 3,
                    title: 'Hackathon DaVinci',
                    excerpt: '48 horas de programación, innovación y premios increíbles.',
                    date: '2024-03-15',
                    author: 'Club de Programación',
                    image: 'https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
                    showDetails: false,
                    newComment: '',
                    comments: []
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
                    name: 'Blog',
                    icon: BookOpenIcon,
                    route: '/blog'
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
    },
    methods: {
        togglePostDetails(post) {
            post.showDetails = !post.showDetails;
        },
        async addComment(post) {
            if (post.newComment.trim()) {
                if (!this.user) {
                    alert('Debes iniciar sesión para comentar');
                    return;
                }

                post.comments.push({
                    id: Date.now(),
                    author: this.user.username || this.user.email,
                    text: post.newComment
                });
                post.newComment = '';
            }
        },
        saveAsImportantDate(post) {
            if (!this.user) {
                alert('Debes iniciar sesión para guardar eventos');
                return;
            }

            const event = {
                id: Date.now(),
                date: new Date(post.date),
                title: post.title,
                time: '00:00',
                description: post.excerpt
            };
            
            const savedEvents = JSON.parse(localStorage.getItem('calendarEvents') || '[]');
            savedEvents.push(event);
            localStorage.setItem('calendarEvents', JSON.stringify(savedEvents));
            
            alert('Evento guardado en el calendario');
        }
    },
    async mounted() {
        this.user = await getCurrentUser();
    }
}
</script>

<template>
    <div class="w-full bg-blue-50 dark:bg-gray-900">
        <div class="container mx-auto">
            <!-- Hero Section -->
            <div class="px-4 sm:px-6 lg:px-8 py-8">
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
                            <div class="flex justify-between items-start mb-4">
                                <h3 class="text-lg font-semibold text-gray-900 dark:text-white">{{ post.title }}</h3>
                                <button 
                                    @click="togglePostDetails(post)"
                                    class="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                                >
                                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>
                            </div>
                            <p class="text-gray-600 dark:text-gray-300 mb-4">{{ post.excerpt }}</p>
                            <div class="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
                                <span>{{ post.author }}</span>
                                <span>{{ post.date }}</span>
                            </div>

                            <!-- Detalles expandibles -->
                            <div v-if="post.showDetails" class="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                                <!-- Imagen del post -->
                                <div class="mb-4">
                                    <img 
                                        :src="post.image" 
                                        :alt="post.title"
                                        class="w-full h-48 object-cover rounded-lg"
                                    >
                                </div>

                                <!-- Comentarios -->
                                <div class="mb-4">
                                    <h4 class="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Comentarios</h4>
                                    <div class="space-y-3">
                                        <div v-for="comment in post.comments" :key="comment.id" 
                                            class="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                                            <div class="flex items-start space-x-3">
                                                <div class="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
                                                    <span class="text-sm font-medium text-primary-600 dark:text-primary-400">
                                                        {{ comment.author.charAt(0) }}
                                                    </span>
                                                </div>
                                                <div>
                                                    <p class="text-sm font-medium text-gray-700 dark:text-gray-300">{{ comment.author }}</p>
                                                    <p class="text-sm text-gray-600 dark:text-gray-400">{{ comment.text }}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <!-- Formulario de comentario -->
                                <div class="mb-4">
                                    <textarea
                                        v-model="post.newComment"
                                        placeholder="Escribe un comentario..."
                                        class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-gray-300"
                                        rows="2"
                                    ></textarea>
                                    <button
                                        @click="addComment(post)"
                                        class="mt-2 px-3 py-1 bg-primary-600 text-white text-sm rounded-lg hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600"
                                    >
                                        Comentar
                                    </button>
                                </div>

                                <!-- Botón para guardar como fecha importante -->
                                <button
                                    @click="saveAsImportantDate(post)"
                                    class="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
                                >
                                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <span>Guardar como fecha importante</span>
                                </button>
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
                                    <p class="text-sm text-gray-500 dark:text-gray-400">{{ event.date }} - {{ event.time }}</p>
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