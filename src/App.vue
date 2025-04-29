<script>
// Acá va la lógica del componente.
// En los componentes que usan la Options API, debemos exportar como default un objeto con la configuración del componente.
// Si queremos usar otros componentes, es necesario importarlos.
// En la Options API, es necesario también declarar los componentes que vamos a usar.
// Una vez importado correctamente, podemos usarlo en el template con la sintaxis <Componente></Componente> o
// <Componente />.
// import Home from './pages/Home.vue';

import { subscribeToUserState } from './services/auth';
import { ref, onMounted, watch } from 'vue';
import Navbar from './components/Navbar.vue';

export default {
    // El "name" define el nombre del componente. Es opcional.
    // Se supone que sea igual que el nombre del archivo.
    name: 'App',
    // "components" recibe un objeto donde define los componentes que se van a usar en el <template>.
    components: {
        Navbar
    },
    data() {
        return {
            user: {
                id: null,
                email: null,
            },
        }
    },
    methods: {
        // handleLogin(userData) {
        //     this.user = userData;
        // }
    },
    mounted() {
        // Nos suscribimos al estado de autenticación.
        subscribeToUserState(newUserState => this.user = newUserState);
    },
    setup() {
        const isDark = ref(false);

        // Función para cambiar el tema
        const toggleDarkMode = () => {
            isDark.value = !isDark.value;
            localStorage.setItem('darkMode', isDark.value);
            updateTheme();
        };

        // Función para actualizar el tema en el DOM
        const updateTheme = () => {
            if (isDark.value) {
                document.documentElement.classList.add('dark');
            } else {
                document.documentElement.classList.remove('dark');
            }
        };

        // Al montar el componente, verificar si hay una preferencia guardada
        onMounted(() => {
            const savedTheme = localStorage.getItem('darkMode');
            if (savedTheme !== null) {
                isDark.value = savedTheme === 'true';
            } else {
                // Si no hay preferencia guardada, usar la preferencia del sistema
                isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches;
            }
            updateTheme();
        });

        // Observar cambios en isDark para actualizar el tema
        watch(isDark, updateTheme);

        return {
            isDark,
            toggleDarkMode
        };
    }
}
</script>

<template>
    <!-- 
    Tailwind sigue, en general, algunas convenciones para sus estilos.
    - Para algunos estilos que tienen una lista posible de valores ya pre-definidos (y que no colisionan con valores de
    otros estilos), Tailwind utiliza como nombre de la clase el valor del estilo. Por ejemplo, los display.
        Si queremos:
            display: flex;                  => flex
            display: inline-block;          => inline-block
            display: grid;                  => grid
    - Para la mayoría de los estilos, Tailwind utiliza el formato de: estilo-valor
    El valor puede ser una keyword, en el caso de estilos que así lo requieren (como "justify-contents"), o puede
    ser una medida (como en "font-size"), o podrá ser algún otro tipo de valor (como para colores).
    Por ejemplo, clases como "justify-contents", "gap", "margin", "background-color", etc.
        Si queremos:
            margin: 1rem;                   => m-4
            padding-top: .5rem;             => pt-2
            background-color: white;        => bg-white
    Lo que pueden ir notando, es que para la mayoría de los estilos que aceptan una dimensión (número más unidad de 
    medida), aceptan una serie de posibles valores, empezando por un número que es el múltiplo de 4 que queremos aplicar,
    o dicho de otra forma, el múltiplo de .25rem que queremos aplicar.
    -->
    <div class="min-h-screen flex flex-col bg-primary-50 dark:bg-gray-900 transition-colors duration-200">
        <Navbar :isDark="isDark" @toggle-dark="toggleDarkMode" />
        <div class="flex-1 container mx-auto px-4 py-8">
            <!-- <router-view /> -->
            <RouterView />
            <!-- <RouterView
                @login="handleLogin"
            /> -->
        </div>
        <footer class="bg-primary-600 dark:bg-gray-800 text-white py-6 shadow-inner w-full transition-colors duration-200">
            <div class="container mx-auto flex flex-col md:flex-row items-center justify-between px-4">
                <p class="text-center md:text-left text-sm">Davinci &copy; 2025. Todos los derechos reservados.</p>
                <div class="flex space-x-4 mt-2 md:mt-0">
                    <a href="#" class="hover:text-primary-200 dark:hover:text-gray-300 transition-colors">Términos</a>
                    <a href="#" class="hover:text-primary-200 dark:hover:text-gray-300 transition-colors">Privacidad</a>
                    <a href="#" class="hover:text-primary-200 dark:hover:text-gray-300 transition-colors">Contacto</a>
                </div>
            </div>
        </footer>
    </div>
</template>

<style>
/* Asegurarse de que las transiciones sean suaves */
.transition-colors {
    transition-property: background-color, border-color, color, fill, stroke;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    transition-duration: 200ms;
}
</style>