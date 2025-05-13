<script>
import MainH1 from '../components/MainH1.vue';
import { AcademicCapIcon, CalendarIcon, ChatBubbleLeftRightIcon, BookOpenIcon } from '@heroicons/vue/24/outline';
import { getCurrentUser } from '../services/auth';
import BaseAlert from '../components/BaseAlert.vue';
import BaseSuccess from '../components/BaseSuccess.vue';
import Footer from '../components/Footer.vue';
import BlogCard from '../components/BlogCard.vue';

export default {
    name: 'Inicio',
    components: { 
        MainH1,
        AcademicCapIcon,
        CalendarIcon,
        ChatBubbleLeftRightIcon,
        BookOpenIcon,
        BaseAlert,
        BaseSuccess,
        Footer,
        BlogCard
    },
    data() {
        return {
            usuario: null,
            mensajeError: '',
            mensajeSuccess: '',
            novedadesDestacadas: [
                {
                    id: 1,
                    titulo: 'Semana de la Tecnología',
                    descripcion: 'No te pierdas los eventos especiales y charlas con expertos de la industria.',
                    fecha: '2025-06-20',
                    autor: 'Coordinación Académica',
                    imagen: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
                    mostrarDetalles: false,
                    nuevoComentario: '',
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
                    nuevoComentario: '',
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
                    nuevoComentario: '',
                    comentarios: []
                }
            ],
            proximosEventos: [
                {
                    id: 1,
                    nombre: 'Workshop de UX/UI',
                    fecha: '25 de Marzo',
                    hora: '18:00 hs'
                },
                {
                    id: 2,
                    nombre: 'Charla: Inteligencia Artificial',
                    fecha: '27 de Marzo',
                    hora: '19:30 hs'
                },
                {
                    id: 3,
                    nombre: 'Demo Day Proyectos',
                    fecha: '30 de Marzo',
                    hora: '17:00 hs'
                }
            ],
            accesosRapidos: [
                {
                    nombre: 'Blog',
                    icono: BookOpenIcon,
                    ruta: '/blog'
                },
                {
                    nombre: 'Calendario',
                    icono: CalendarIcon,
                    ruta: '/calendario'
                },
                {
                    nombre: 'Chat Global',
                    icono: ChatBubbleLeftRightIcon,
                    ruta: '/chat-global'
                },
                {
                    nombre: 'Recursos',
                    icono: BookOpenIcon,
                    ruta: '/recursos'
                }
            ],
            publicaciones: []
        }
    },
    methods: {
        alternarDetallesNovedad(novedad) {
            novedad.mostrarDetalles = !novedad.mostrarDetalles;
        },
        async agregarComentario(novedad) {
            if (novedad.nuevoComentario.trim()) {
                if (!this.usuario) {
                    this.mensajeError = 'Debes iniciar sesión para comentar.';
                    setTimeout(() => { this.mensajeError = ''; }, 4000);
                    return;
                }

                novedad.comentarios.push({
                    id: Date.now(),
                    autor: this.usuario.username || this.usuario.email,
                    texto: novedad.nuevoComentario
                });
                novedad.nuevoComentario = '';
                this.mensajeSuccess = 'Comentario agregado correctamente.';
                setTimeout(() => { this.mensajeSuccess = ''; }, 4000);
            }
        },
        guardarComoFechaImportante(novedad) {
            if (!this.usuario) {
                this.mensajeError = 'Debes iniciar sesión para guardar eventos.';
                setTimeout(() => { this.mensajeError = ''; }, 4000);
                return;
            }

            const evento = {
                id: Date.now(),
                fecha: new Date(novedad.fecha),
                titulo: novedad.titulo,
                hora: '00:00',
                descripcion: novedad.descripcion
            };
            
            const eventosGuardados = JSON.parse(localStorage.getItem('eventosCalendario') || '[]');
            eventosGuardados.push(evento);
            localStorage.setItem('eventosCalendario', JSON.stringify(eventosGuardados));
            
            this.mensajeSuccess = 'Evento guardado en el calendario.';
            setTimeout(() => { this.mensajeSuccess = ''; }, 4000);
        },
        cargarPublicaciones() {
            const guardadas = localStorage.getItem('blogPublicaciones');
            if (guardadas) {
                this.publicaciones = JSON.parse(guardadas);
            }
        }
    },
    async mounted() {
        this.usuario = await getCurrentUser();
        this.cargarPublicaciones();
    }
}
</script>

<template>
    <div class="w-full flex min-h-screen" :style="{'background-color': 'var(--color-primary)'}" dark:bg-gray-900>
        <!-- Contenido principal -->
        <div class="flex-1">
            <div class="container mx-auto">
                <BaseAlert v-if="mensajeError" type="error">{{ mensajeError }}</BaseAlert>
                <BaseSuccess v-if="mensajeSuccess">{{ mensajeSuccess }}</BaseSuccess>
                <!-- Hero Section -->
                <div class="px-4 sm:px-6 lg:px-8 py-8">
                    <section class="text-center py-12 px-4 mb-12 text-white rounded-lg" :style="{'background': 'linear-gradient(to right, var(--color-accent), #059669)'}">
                        <MainH1 class="text-4xl font-bold mb-4">¡Les damos la bienvenida a DV Social!</MainH1>
                        <p class="text-xl max-w-2xl mx-auto">
                            DV Social es la mejor red para enterarte de todo lo que sucede en la Escuela, conectar con otras
                            personas, como alumnos, profesores, etc.
                        </p>
                    </section>

                    <!-- Aquí iría el feed de publicaciones, puedes replicar la lógica de Blog.vue si lo deseas -->
                    <!-- Ejemplo de uso de BlogCard para cada publicación -->
                    <section class="mb-12">
                        <h2 class="text-2xl font-semibold mb-6 text-gray-900 dark:text-white">Publicaciones</h2>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <BlogCard v-for="publicacion in publicaciones" :key="publicacion.id" :publicacion="publicacion" :usuario="usuario" />
                        </div>
                    </section>

                    <!-- Secciones originales conservadas -->
                    <section class="mb-12">
                        <h2 class="text-2xl font-semibold mb-6 text-gray-900 dark:text-white">Novedades Destacadas</h2>
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div v-for="post in novedadesDestacadas" :key="post.id"
                                class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm hover:bg-emerald-100 dark:hover:bg-gray-700 transition-all duration-200">
                                <div class="flex justify-between items-start mb-4">
                                    <h3 class="text-lg font-semibold text-gray-900 dark:text-white">{{ post.titulo }}</h3>
                                    <button 
                                        @click="alternarDetallesNovedad(post)"
                                        class="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                                    >
                                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                </div>
                                <p class="text-gray-600 dark:text-gray-300 mb-4">{{ post.descripcion }}</p>
                                <div class="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
                                    <span>{{ post.autor }}</span>
                                    <span>{{ post.fecha }}</span>
                                </div>

                                <!-- Detalles expandibles -->
                                <div v-if="post.mostrarDetalles" class="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                                    <!-- Imagen del post -->
                                    <div class="mb-4">
                                        <img 
                                            :src="post.imagen" 
                                            :alt="post.titulo"
                                            class="w-full h-48 object-cover rounded-lg"
                                        >
                                    </div>

                                    <!-- Comentarios -->
                                    <div class="mb-4">
                                        <h4 class="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Comentarios</h4>
                                        <div class="space-y-3">
                                            <div v-for="comment in post.comentarios" :key="comment.id" 
                                                class="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                                                <div class="flex items-start space-x-3">
                                                    <div class="w-8 h-8 rounded-full flex items-center justify-center" :style="{'background-color': 'var(--color-secondary)'}" dark:bg-primary-900>
                                                        <span class="text-sm font-medium text-primary-600 dark:text-primary-400">
                                                            {{ comment.autor.charAt(0) }}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <p class="text-sm font-medium text-gray-700 dark:text-gray-300">{{ comment.autor }}</p>
                                                        <p class="text-sm text-gray-600 dark:text-gray-400">{{ comment.texto }}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Formulario de comentario -->
                                    <div class="mb-4">
                                        <textarea
                                            v-model="post.nuevoComentario"
                                            placeholder="Escribe un comentario..."
                                            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-gray-300"
                                            rows="2"
                                        ></textarea>
                                        <button
                                            @click="agregarComentario(post)"
                                            class="mt-2 px-3 py-1 text-sm rounded-lg hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600"
                                            :style="{'background-color': 'var(--color-accent)', color: 'white'}">
                                            Comentar
                                        </button>
                                    </div>

                                    <!-- Botón para guardar como fecha importante -->
                                    <button
                                        @click="guardarComoFechaImportante(post)"
                                        class="w-full flex items-center justify-center space-x-2 px-4 py-2 rounded-lg hover:bg-emerald-200 dark:hover:bg-emerald-800 transition-colors"
                                        :style="{'background-color': 'var(--color-secondary)', color: 'var(--color-text)'}">
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
                            <div v-for="event in proximosEventos" :key="event.id"
                                class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm hover:bg-emerald-100 dark:hover:bg-gray-700 transition-all duration-200">
                                <div class="flex items-center space-x-4">
                                    <div class="bg-emerald-100 dark:bg-emerald-900 p-3 rounded-full">
                                        <svg class="w-6 h-6 text-emerald-600 dark:text-emerald-400 group-hover:text-emerald-700 dark:group-hover:text-emerald-300" fill="none"
                                            stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 class="font-semibold text-gray-900 dark:text-white">{{ event.nombre }}</h3>
                                        <p class="text-sm text-gray-500 dark:text-gray-400">{{ event.fecha }} - {{ event.hora }}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    <!-- Quick Access Section -->
                    <section class="mb-12">
                        <h2 class="text-2xl font-semibold mb-6 text-gray-900 dark:text-white">Accesos Rápidos</h2>
                        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <router-link v-for="(item, index) in accesosRapidos" :key="index"
                                :to="item.ruta"
                                class="p-6 bg-white dark:bg-gray-800 rounded-lg text-center hover:bg-emerald-100 dark:hover:bg-gray-700 transition-all duration-200 group">
                                <component :is="item.icono"
                                    class="w-12 h-12 mx-auto mb-3 text-emerald-600 dark:text-emerald-400 group-hover:text-emerald-700 dark:group-hover:text-emerald-300" />
                                <span class="block text-gray-900 dark:text-white font-medium">{{ item.nombre }}</span>
                            </router-link>
                        </div>
                    </section>
                </div>
            </div>
        </div>
        <!-- Sidebar derecho con Footer tipo widget -->
        <aside class="hidden lg:flex flex-col w-1/4 border-l border-gray-200 dark:border-gray-800 p-4 h-screen sticky top-0 space-y-8">
            <!-- Otros widgets aquí si los hay -->
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                <Footer />
            </div>
        </aside>
        <!-- Botón flotante para nueva publicación -->
        <router-link to="/blog" class="fixed bottom-8 right-8 z-50">
            <button class="bg-primary-600 hover:bg-primary-700 text-white rounded-full shadow-lg w-16 h-16 flex items-center justify-center text-3xl focus:outline-none" :style="{'background-color': 'var(--color-accent)'}">
                +
            </button>
        </router-link>
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