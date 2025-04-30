# DV Social - Aplicación de Chat Global

DV Social es una aplicación web desarrollada con Vue.js que permite a los usuarios participar en un chat global en tiempo real. La aplicación incluye autenticación de usuarios, modo oscuro/claro, y una interfaz responsive.

## Características principales

- 🔐 Autenticación de usuarios (registro e inicio de sesión)
- 💬 Chat global en tiempo real
- 🌓 Modo oscuro/claro
- 📱 Diseño responsive para móviles y desktop
- 🔄 Actualizaciones en tiempo real de mensajes
- 👤 Perfiles de usuario

## Requisitos previos

- Node.js (versión 16 o superior)
- npm o yarn
- Conexión a internet para la base de datos Supabase

## Instalación

1. Clona el repositorio:
```bash
git clone <url-del-repositorio>
cd clientes-web
```

2. Instala las dependencias:
```bash
npm install
# o si usas yarn
yarn install
```

3. Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:
```env
VITE_SUPABASE_URL=tu_url_de_supabase
VITE_SUPABASE_KEY=tu_api_key_de_supabase
```

## Ejecución

Para iniciar la aplicación en modo desarrollo:

```bash
npm run dev
# o si usas yarn
yarn dev
```

La aplicación estará disponible en `http://localhost:5173` (o el puerto que Vite asigne).

## Uso de la aplicación

1. **Registro/Inicio de sesión**
   - Accede a la página de registro para crear una nueva cuenta
   - O inicia sesión si ya tienes una cuenta
   - La autenticación es necesaria para enviar mensajes

2. **Chat Global**
   - Una vez autenticado, puedes ver y enviar mensajes en el chat global
   - Los mensajes se actualizan en tiempo real
   - Puedes ver el historial de mensajes anteriores

3. **Perfil de Usuario**
   - Accede a tu perfil desde el menú de usuario
   - Visualiza tu información personal

4. **Modo Oscuro/Claro**
   - Cambia entre modo oscuro y claro usando el botón en la barra de navegación
   - La preferencia se guarda automáticamente

## Tecnologías utilizadas

- Vue.js 3
- Vite
- Tailwind CSS
- Supabase (base de datos y autenticación)
- Vue Router

## Estructura del proyecto

```
clientes-web/
├── src/
│   ├── components/     # Componentes reutilizables
│   ├── pages/         # Páginas de la aplicación
│   ├── services/      # Servicios y lógica de negocio
│   ├── router/        # Configuración de rutas
│   ├── App.vue        # Componente raíz
│   └── main.js        # Punto de entrada
├── public/            # Archivos estáticos
└── package.json       # Dependencias y scripts
```