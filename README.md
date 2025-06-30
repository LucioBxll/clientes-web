# Minima - Red Social Minimalista

## 📋 Descripción del Proyecto

Minima es una red social moderna y minimalista desarrollada como segundo parcial para la materia "Clientes Web Mobile". La aplicación permite a los usuarios compartir publicaciones, interactuar mediante comentarios, y gestionar sus perfiles de usuario en tiempo real.

## ✨ Funcionalidades Implementadas

### 🔐 Autenticación y Usuarios
- **Registro de usuarios** con email, contraseña y nombre de usuario
- **Inicio de sesión** con validación de credenciales
- **Gestión de perfil** con avatar personalizable
- **Edición de datos personales** (username, email, descripción)
- **Cerrar sesión** con redirección automática

### 📱 Feed de Publicaciones
- **Chat global** con publicaciones de todos los usuarios
- **Crear publicaciones** con texto e imágenes
- **Editar publicaciones** propias
- **Eliminar publicaciones** propias
- **Vista previa de imágenes** antes de publicar
- **Actualizaciones en tiempo real** usando Supabase Realtime

### 💬 Sistema de Comentarios
- **Comentar publicaciones** de otros usuarios
- **Ver comentarios** en tiempo real
- **Contador de comentarios** por publicación
- **Interfaz intuitiva** para gestionar comentarios

### 👤 Perfiles de Usuario
- **Ver perfil propio** con todas las publicaciones
- **Ver perfiles de otros usuarios** con sus publicaciones
- **Avatar personalizable** con subida de imágenes
- **Información de usuario** (username, email, descripción)
- **Fecha de registro** del usuario

### 🎨 Interfaz de Usuario
- **Diseño responsive** para móviles y desktop
- **Modo oscuro/claro** con persistencia
- **Navegación intuitiva** con sidebar
- **Animaciones suaves** y transiciones
- **Accesibilidad** con roles ARIA y navegación por teclado

### 🔒 Seguridad
- **Row Level Security (RLS)** implementado en Supabase
- **Autenticación requerida** para rutas protegidas
- **Validación de permisos** para editar/eliminar contenido
- **Protección de rutas** con guards de navegación

## 🛠️ Tecnologías Utilizadas

### Frontend
- **Vue.js 3** - Framework de JavaScript progresivo
- **Vite** - Herramienta de construcción y bundling
- **Vue Router** - Enrutamiento de la aplicación
- **Tailwind CSS** - Framework de CSS utilitario
- **Heroicons** - Iconografía moderna

### Backend (Supabase)
- **PostgreSQL** - Base de datos relacional
- **Supabase Auth** - Autenticación de usuarios
- **Supabase Storage** - Almacenamiento de archivos
- **Supabase Realtime** - Actualizaciones en tiempo real
- **Row Level Security (RLS)** - Seguridad a nivel de fila

## 📦 Instalación y Configuración

### Prerrequisitos
- Node.js (versión 16 o superior)
- npm o yarn
- Cuenta de Supabase

### Pasos de Instalación

1. **Clonar el repositorio:**
```bash
git clone https://github.com/LucioBxll/clientes-web.git
cd clientes-web
```

2. **Instalar dependencias:**
```bash
npm install
```

3. **Configurar variables de entorno:**
Crea un archivo `.env` en la raíz del proyecto:
```env
VITE_SUPABASE_URL=https://vhxdycwrrvtoqiwuebly.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZoeGR5Y3dycnZ0b3Fpd3VlYmx5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU2ODA3ODIsImV4cCI6MjA2MTI1Njc4Mn0.FQAmSgxmJKxXyMwHRIJ7IVCbLiu_1gTugaJVYrIowek
```

4. **Ejecutar en modo desarrollo:**
```bash
npm run dev
```

## 📁 Estructura del Proyecto

```
src/
├── components/          # Componentes reutilizables
├── pages/              # Páginas de la aplicación
├── services/           # Servicios y APIs
├── composables/        # Composables de Vue
├── router/             # Configuración de rutas
├── images/             # Imágenes estáticas
└── style.css           # Estilos globales
```

## 🎯 Características Técnicas

- **SPA (Single Page Application)** - Navegación sin recargas
- **Componentes Vue SFC** - Archivos .vue con template, script y style
- **API de Composición** - Uso de composables y refs
- **Gestión de estado reactiva** - Con Vue 3 Composition API
- **Rutas protegidas** - Autenticación requerida
- **Manejo de errores** - Interfaz de usuario para errores
- **Optimización de imágenes** - Compresión y formatos modernos

## 📝 Notas de Desarrollo

- El proyecto sigue las mejores prácticas de Vue.js 3
- Implementa patrones de diseño modernos
- Código documentado con comentarios JSDoc
- Estructura de archivos organizada y escalable


