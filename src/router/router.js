import { createRouter, createWebHistory } from "vue-router";
import { getCurrentUser } from '../services/auth';

// Definimos la lista de rutas de nuestra aplicación.
const routes = [
    { path: '/',            component: () => import('../pages/GlobalChat.vue'), meta: { requiresAuth: true } },
    { path: '/chat-global', component: () => import('../pages/GlobalChat.vue'), meta: { requiresAuth: true }},
    { path: '/ingresar',    component: () => import('../pages/Login.vue'), meta: { requiresAuth: false } },
    { path: '/registro',    component: () => import('../pages/Register.vue'), meta: { requiresAuth: false } },
    { path: '/perfil',      component: () => import('../pages/Profile.vue'), meta: { requiresAuth: true }},
    { path: '/perfil/:id',  component: () => import('../pages/ProfileFeed.vue'), meta: { requiresAuth: true } },
    { path: '/chat-privado/:userId', component: () => import('../pages/PrivateChat.vue'), meta: { requiresAuth: true } },
    { path: '/terminos',    component: () => import('../pages/Terms.vue'), meta: { requiresAuth: false } },
    { path: '/privacidad',  component: () => import('../pages/Privacy.vue'), meta: { requiresAuth: false } },
];


const router = createRouter({
    routes, // routes: routes
    history: createWebHistory(),
});

// Guard de navegación para proteger rutas que requieren autenticación
router.beforeEach(async (to, from, next) => {
    const user = await getCurrentUser();
    // Si la ruta requiere autenticación y no hay usuario, redirige al login
    if (to.meta.requiresAuth && (!user || !user.id)) {
        next('/ingresar');
    } else {
        next();
    }
});

// Para terminar, exportamos el router.
export default router;