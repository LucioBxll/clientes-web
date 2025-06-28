# Sistema de Chat Privado - Minima

Este sistema implementa un chat privado en tiempo real completo usando Vue 3 (Composition API) y Supabase.

## 🚀 Características

- ✅ Chat privado en tiempo real entre dos usuarios
- ✅ Mensajes instantáneos sin refrescar la página
- ✅ Scroll automático al último mensaje
- ✅ Diferenciación visual de mensajes propios vs ajenos
- ✅ Estados de carga y manejo de errores
- ✅ Cache inteligente de IDs de chat en localStorage
- ✅ Optimización de consultas con ordenamiento de user IDs
- ✅ Interfaz moderna y responsive con Tailwind CSS

## 📁 Estructura de Archivos

```
src/
├── pages/
│   └── PrivateChat.vue              # Página principal del chat
├── components/
│   └── PrivateChatButton.vue        # Botón para abrir chat privado
├── services/
│   └── private-chats.js             # Servicio para manejo de chats
├── composables/
│   └── useScrollToBottom.js         # Composable para scroll automático
└── router/
    └── router.js                    # Configuración de rutas
```

## 🗄️ Base de Datos

### Tablas Requeridas

#### `private_chats`
```sql
- id (UUID, PK)
- user1_id (UUID, FK -> users.id)
- user2_id (UUID, FK -> users.id)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

#### `private_messages`
```sql
- id (UUID, PK)
- chat_id (UUID, FK -> private_chats.id)
- sender_id (UUID, FK -> users.id)
- receiver_id (UUID, FK -> users.id)
- body (TEXT)
- created_at (TIMESTAMP)
```

## 🛠️ Instalación

### 1. Configurar Base de Datos

Ejecuta el script SQL en tu base de datos Supabase:

```sql
-- Ejecutar database-schema.sql en el SQL Editor de Supabase
```

### 2. Configurar Supabase Realtime

En el dashboard de Supabase:
1. Ve a Database > Replication
2. Habilita Realtime para la tabla `private_messages`
3. Configura las políticas de seguridad RLS

### 3. Variables de Entorno

Asegúrate de tener configuradas las variables de entorno:

```env
VITE_SUPABASE_URL=tu_url_de_supabase
VITE_SUPABASE_ANON_KEY=tu_clave_anonima_de_supabase
```

## 🎯 Uso

### Navegación

Los usuarios pueden acceder al chat privado de dos formas:

1. **Desde el perfil de otro usuario**: Botón "Chat privado"
2. **URL directa**: `/chat-privado/:userId`

### Funcionalidades

#### Envío de Mensajes
- Escribe en el campo de texto
- Presiona Enter o haz clic en "Enviar"
- Los mensajes aparecen instantáneamente

#### Tiempo Real
- Los mensajes nuevos aparecen automáticamente
- No es necesario refrescar la página
- Scroll automático al último mensaje

#### Estados Visuales
- **Mensajes propios**: Fondo azul, alineados a la derecha
- **Mensajes ajenos**: Fondo gris, alineados a la izquierda
- **Estados de carga**: Spinners y placeholders
- **Mensajes vacíos**: Estado informativo

## 🔧 API del Servicio

### `private-chats.js`

#### `getPrivateChat(sender_id, receiver_id)`
Obtiene o crea un chat privado entre dos usuarios.

#### `fetchPrivateChat(sender_id, receiver_id)`
Busca un chat privado existente.

#### `createPrivateChat(sender_id, receiver_id)`
Crea un nuevo chat privado.

#### `sendPrivateChatMessage(sender_id, receiver_id, body)`
Envía un mensaje en un chat privado.

#### `fetchLastPrivateChatMessages(sender_id, receiver_id, limit)`
Obtiene los últimos mensajes de un chat.

#### `subscribeToPrivateChatNewMessages(sender_id, receiver_id, callback)`
Suscribe a nuevos mensajes en tiempo real.

## 🎨 Composable

### `useScrollToBottom(options)`

#### Opciones
- `autoScroll`: Si debe hacer scroll automático (default: true)
- `threshold`: Umbral para determinar si está cerca del final (default: 100px)

#### Métodos
- `scrollToBottom(smooth)`: Scroll al final
- `autoScrollIfNearBottom()`: Scroll automático si está cerca del final
- `forceScrollToBottom()`: Fuerza scroll al final
- `checkIfNearBottom()`: Verifica posición

## 🔒 Seguridad

### Políticas RLS Implementadas

1. **private_chats**:
   - Usuarios solo pueden ver sus propios chats
   - Usuarios solo pueden crear chats donde participen

2. **private_messages**:
   - Usuarios solo pueden ver mensajes de sus chats
   - Usuarios solo pueden enviar mensajes como remitentes

### Validaciones

- Mensajes no pueden estar vacíos
- IDs de usuario deben ser válidos
- Ordenamiento consistente de user IDs

## 🚀 Optimizaciones

### Cache Inteligente
- IDs de chat cacheados en localStorage
- Reducción de consultas a la base de datos
- Consistencia en búsquedas

### Rendimiento
- Índices en columnas críticas
- Límite de mensajes cargados (default: 50)
- Debounce en eventos de scroll

### UX
- Scroll automático inteligente
- Estados de carga informativos
- Manejo de errores graceful

## 🐛 Solución de Problemas

### Mensajes no aparecen en tiempo real
1. Verificar que Realtime esté habilitado en Supabase
2. Comprobar políticas RLS
3. Verificar suscripción en consola

### Error al enviar mensajes
1. Verificar autenticación del usuario
2. Comprobar permisos en la base de datos
3. Revisar logs de Supabase

### Scroll no funciona
1. Verificar que el contenedor tenga `overflow-y-auto`
2. Comprobar que `containerRef` esté asignado
3. Verificar que no haya CSS que interfiera

## 📱 Responsive Design

El chat está optimizado para:
- **Desktop**: Layout completo con sidebar
- **Tablet**: Layout adaptativo
- **Mobile**: Layout vertical optimizado

## 🔄 Flujo de Datos

1. Usuario navega a `/chat-privado/:userId`
2. Se carga el perfil del usuario objetivo
3. Se busca/crea el chat privado
4. Se cargan mensajes existentes
5. Se suscribe a nuevos mensajes
6. Usuario puede enviar/recibir mensajes
7. Scroll automático al último mensaje

## 🎯 Próximas Mejoras

- [ ] Indicador de "escribiendo..."
- [ ] Notificaciones push
- [ ] Archivos adjuntos
- [ ] Emojis y reacciones
- [ ] Búsqueda de mensajes
- [ ] Historial de mensajes
- [ ] Bloqueo de usuarios
- [ ] Mensajes editados/eliminados 