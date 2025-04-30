<script>
import { nextTick } from 'vue';
import MainH1 from '../components/MainH1.vue';
import { loadLastGlobalChatMessages, saveGlobalChatMessage, subscribeToGlobalChatNewMessages } from '../services/global-chat';
import { getCurrentUser } from '../services/auth';

export default {
    name: 'GlobalChat',
    components: { MainH1 },
    // La propiedad "data" nos permite definir cuáles son los valores del "state" del componente.
    // Entiéndase por "state" los datos propios del componente que pueden variar duranta la vida del mismo.
    // Esta propiedad debe tener una función que retorne un objeto con los datos.
    // data: function() {
    //     return {}
    // },
    // data: () => {
    //     return {}
    // },
    data() {
        return {
            messages: [],
            newMessage: {
                body: '',
            },
            error: null,
            currentUser: null,
            loading: false,
        }
    },
    // La propiedad "methods" permite definir las funciones que queremos que el componente tenga.
    methods: {
        async sendMessage() {
            if (!this.currentUser) {
                this.error = 'Debes iniciar sesión para enviar mensajes';
                return;
            }

            if (!this.newMessage.body.trim()) {
                this.error = 'El mensaje no puede estar vacío';
                return;
            }

            try {
                this.error = null;
                this.loading = true;
                const savedMessage = await saveGlobalChatMessage({
                    body: this.newMessage.body,
                });

                // Agregamos el mensaje a la lista localmente
                this.messages.push(savedMessage);
                this.newMessage.body = "";

                // Esperamos al siguiente tick para asegurar que el DOM se actualice
                await nextTick();
                this.$refs.chatContainer.scrollTop = this.$refs.chatContainer.scrollHeight;
            } catch (error) {
                console.error('Error al enviar mensaje:', error);
                this.error = 'Error al enviar el mensaje: ' + (error.message || 'Error desconocido');
            } finally {
                this.loading = false;
            }
        },
        async handleNewMessage(message) {
            console.log('Nuevo mensaje recibido en el componente:', message);
            this.messages.push(message);
            await nextTick();
            this.$refs.chatContainer.scrollTop = this.$refs.chatContainer.scrollHeight;
        }
    },
    async mounted() {
        try {
            // Obtener el usuario actual
            this.currentUser = await getCurrentUser();

            // Suscribirse a nuevos mensajes
            subscribeToGlobalChatNewMessages(this.handleNewMessage);

            // Cargar mensajes existentes
            this.messages = await loadLastGlobalChatMessages();
            await nextTick();
            this.$refs.chatContainer.scrollTop = this.$refs.chatContainer.scrollHeight;
        } catch (error) {
            console.error('Error al cargar el chat:', error);
            this.error = 'Error al cargar el chat: ' + (error.message || 'Error desconocido');
        }
    }
}
</script>

<template>
    <div class="bg-blue-50 dark:bg-gray-900 min-h-screen p-4">
        <div class="container mx-auto">
            <MainH1 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">Chat global</MainH1>

            <div class="flex flex-col md:flex-row gap-4">
                <section ref="chatContainer"
                    class="overflow-y-auto w-full md:w-9/12 h-[400px] md:h-[600px] p-4 md:p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-primary-100 dark:border-gray-700">
                    <h2 class="sr-only">Lista de mensajes</h2>

                    <ul class="flex flex-col gap-4">
                        <li v-for="message in messages" :key="message.id"
                            class="flex flex-col gap-0.5 p-3 rounded-lg bg-primary-50 dark:bg-gray-700 hover:bg-primary-100 dark:hover:bg-gray-600 transition-colors">
                            <div class="font-semibold text-primary-700 dark:text-primary-400">{{ message.username }}
                            </div>
                            <div class="text-secondary-600 dark:text-gray-300 break-words">{{ message.body }}</div>
                            <div class="text-xs md:text-sm text-secondary-400 dark:text-gray-500">{{ new
                                Date(message.created_at).toLocaleString() }}</div>
                        </li>
                    </ul>
                </section>
                <section class="w-full md:w-3/12">
                    <h2 class="text-xl md:text-2xl font-bold text-primary-600 dark:text-primary-400 mb-4">Enviar un mensaje</h2>

                    <div v-if="error"
                        class="mb-4 p-3 bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-800 rounded-lg">
                        <p class="text-red-600 dark:text-red-400 text-sm">{{ error }}</p>
                    </div>

                    <form action="#" @submit.prevent="sendMessage"
                        class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
                        <div class="mb-4">
                            <label for="body"
                                class="block mb-2 text-secondary-600 dark:text-gray-300 font-medium">Mensaje</label>
                            <textarea id="body"
                                class="w-full p-2 rounded-lg border border-primary-200 dark:border-gray-600 focus:border-primary-400 dark:focus:border-primary-500 focus:ring-2 focus:ring-primary-200 dark:focus:ring-primary-500/20 outline-none transition-all min-h-[80px] md:min-h-[100px] bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                v-model="newMessage.body" :disabled="!currentUser || loading"
                                placeholder="Escribe tu mensaje aquí..."></textarea>
                        </div>
                        <button type="submit"
                            class="w-full bg-primary-600 hover:bg-primary-500 focus:bg-primary-500 active:bg-primary-700 text-white font-semibold py-2 px-4 rounded-lg transition-all shadow-sm hover:shadow disabled:opacity-50 disabled:cursor-not-allowed"
                            :disabled="!currentUser || !newMessage.body.trim() || loading">
                            {{ loading ? 'Enviando...' : currentUser ? 'Enviar mensaje' : 'Inicia sesión para enviar mensajes' }}
                        </button>
                    </form>
                </section>
            </div>
        </div>
    </div>
</template>