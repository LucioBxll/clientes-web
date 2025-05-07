import { createRouter, createWebHistory } from "vue-router";
import { getCurrentUser } from '../services/auth';
// import Home from '../pages/Home.vue';

// Definimos la lista de rutas de nuestra aplicación.
const routes = [
    { path: '/', component: () => import('../pages/GlobalChat.vue') },
    { 
        path: '/chat-global',     
        component: () => import('../pages/GlobalChat.vue'),
        meta: { requiresAuth: true }
    },
    { path: '/ingresar',        component: () => import('../pages/Login.vue'), },
    { path: '/registro',        component: () => import('../pages/Register.vue'), },
    { 
        path: '/perfil',        
        component: () => import('../pages/Profile.vue'),
        meta: { requiresAuth: true }
    },
    { path: '/terminos',        component: () => import('../pages/Terms.vue'), },
    { path: '/privacidad',      component: () => import('../pages/Privacy.vue'), },
    { path: '/calendario',      component: () => import('../pages/Calendar.vue'), },
    { path: '/blog', component: () => import('../pages/Blog.vue'), },
    { path: '/novedades', component: () => import('../pages/Home.vue') },
];

// Creamos el router con createRouter.
// Esta función recibe un objeto de configuración que necesita tener 2 parámetros:
// 1. routes: la lista de rutas de nuestra aplicación.
// 2. history: el tipo de historial que queremos utilizar. Puede ser createWebHistory() o createWebHashHistory().
// createWebHistory() trabaja con URLs "comunes", donde el path se agrega al dominio. Requiere tener un servidor en Node.js
//  propiamente configurado para funcionar correctamente al refrescar la página.
//  Por ejemplo: http:///localhost:5173/chat-global
// createWebHashHistory() trabaja con URLs agregando un hash (#) para el path. Este modo funciona bien con el refresco
//  de la página, incluso sin un servidor en Node.js configurado.
//  Por ejemplo: http:///localhost:5173/#/chat-global
const router = createRouter({
    routes, // routes: routes
    history: createWebHistory(),
});

// Guard de navegación para proteger rutas que requieren autenticación
router.beforeEach(async (to, from, next) => {
    if (to.meta.requiresAuth) {
        const user = await getCurrentUser();
        if (!user.id) {
            // Redirigir al login si no está autenticado
            next('/ingresar');
        } else {
            next();
        }
    } else {
        next();
    }
});

// Para terminar, exportamos el router.
export default router;