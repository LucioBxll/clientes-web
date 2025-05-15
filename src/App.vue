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
import Footer from './components/Footer.vue';

export default {
    // El "name" define el nombre del componente. Es opcional.
    // Se supone que sea igual que el nombre del archivo.
    name: 'Aplicacion',
    // "components" recibe un objeto donde define los componentes que se van a usar en el <template>.
    components: {
        Navbar,
        Footer
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
    <div class="flex flex-col h-full bg-white dark:bg-neutral-950" >
        <header role="banner">
            <Navbar :isDark="isDark" @toggle-dark="toggleDarkMode" />
        </header>
        <main role="main" class="flex-grow container mx-auto">
            <RouterView />
        </main>
        <Footer v-if="$route.path !== '/'" />
    </div>
</template>

<style>
html, body {
    height: 100%;
    margin: 0;
    padding: 0;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
}

#app {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
}

/* Estilos globales para mejorar la experiencia de usuario */
* {
    cursor: default;
}

/* Elementos interactivos */
a, button, [role="button"], 
input[type="button"], 
input[type="submit"],
input[type="reset"],
select,
.router-link-active,
.router-link-exact-active,
[class*="hover"],
[class*="cursor-pointer"] {
    cursor: pointer !important;
}

/* Campos de entrada y áreas de texto */
input[type="text"],
input[type="email"],
input[type="password"],
input[type="search"],
input[type="tel"],
input[type="url"],
textarea,
[contenteditable="true"] {
    cursor: text !important;
    -webkit-user-select: text !important;
    -moz-user-select: text !important;
    -ms-user-select: text !important;
    user-select: text !important;
}

/* Evitar selección de texto en elementos no editables */
p, span, div, h1, h2, h3, h4, h5, h6, li, td, th {
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
}
</style>




