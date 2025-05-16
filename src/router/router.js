import { createRouter, createWebHistory } from "vue-router";
import { getCurrentUser } from '../services/auth';

// Definimos la lista de rutas de nuestra aplicación.
const routes = [
    { path: '/',            component: () => import('../pages/GlobalChat.vue') },
    { path: '/chat-global', component: () => import('../pages/GlobalChat.vue'), meta: { requiresAuth: true }},
    { path: '/ingresar',    component: () => import('../pages/Login.vue'), },
    { path: '/registro',    component: () => import('../pages/Register.vue'), },
    { path: '/perfil',      component: () => import('../pages/Profile.vue'), meta: { requiresAuth: true }},
    { path: '/perfil/:id',  component: () => import('../pages/ProfileFeed.vue') },
    { path: '/terminos',    component: () => import('../pages/Terms.vue'), },
    { path: '/privacidad',  component: () => import('../pages/Privacy.vue'), },
];


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