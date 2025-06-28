# 🚀 Guía de Uso de Realtime con Supabase

## 📋 Configuración Inicial

### 1. Habilitar Realtime en Supabase

1. Ve a tu proyecto de Supabase
2. Navega a **Database > Replication**
3. Asegúrate de que **"Realtime"** esté habilitado
4. Ejecuta el archivo `supabase-realtime-setup.sql` en el SQL Editor

### 2. Verificar Configuración

```sql
-- Verificar que las tablas estén habilitadas para Realtime
SELECT tablename FROM pg_publication_tables 
WHERE pubname = 'supabase_realtime' 
AND tablename IN ('private_messages', 'private_chats', 'users');
```

## 🎯 Uso en Componentes Vue

### Ejemplo 1: Chat Privado con Realtime

```vue
<template>
  <div>
    <div v-for="message in messages" :key="message.id">
      {{ message.body }}
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { usePrivateChatRealtime } from '../composables/useRealtime';
import { fetchPrivateChat } from '../services/private-chats';

const messages = ref([]);
const { subscribeToPrivateChat, unsubscribeFromPrivateChat } = usePrivateChatRealtime();

const setupRealtime = async (senderId, receiverId) => {
  // Obtener el chat
  const chat = await fetchPrivateChat(senderId, receiverId);
  
  if (chat) {
    // Suscribirse a mensajes en tiempo real
    subscribeToPrivateChat(chat.id, (newMessage) => {
      // Agregar nuevo mensaje a la lista
      messages.value.push(newMessage);
    });
  }
};

onMounted(() => {
  setupRealtime(currentUser.id, targetUser.id);
});

onUnmounted(() => {
  unsubscribeFromPrivateChat();
});
</script>
```

### Ejemplo 2: Lista de Chats con Actualizaciones en Tiempo Real

```vue
<template>
  <div>
    <div v-for="chat in chats" :key="chat.id">
      <h3>{{ chat.otherUser.username }}</h3>
      <p>{{ chat.lastMessage?.body }}</p>
      <span v-if="chat.unreadCount > 0" class="badge">
        {{ chat.unreadCount }}
      </span>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRealtime } from '../composables/useRealtime';
import { getUserPrivateChats } from '../services/private-chats';

const chats = ref([]);
const { subscribeToNewChats } = useRealtime();

const loadChats = async () => {
  chats.value = await getUserPrivateChats(currentUser.id);
};

const setupRealtime = () => {
  // Suscribirse a nuevos chats
  subscribeToNewChats(currentUser.id, (newChat) => {
    // Recargar la lista de chats
    loadChats();
  });
};

onMounted(() => {
  loadChats();
  setupRealtime();
});
</script>
```

### Ejemplo 3: Estado Online/Offline de Usuarios

```vue
<template>
  <div>
    <div v-for="user in users" :key="user.id">
      <span>{{ user.username }}</span>
      <div 
        :class="user.status === 'online' ? 'online' : 'offline'"
        class="status-indicator"
      ></div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRealtime } from '../composables/useRealtime';

const users = ref([]);
const { subscribeToUserStatusChanges } = useRealtime();

const setupUserStatus = () => {
  subscribeToUserStatusChanges((user, status) => {
    // Actualizar estado del usuario en la lista
    const userIndex = users.value.findIndex(u => u.id === user.id);
    if (userIndex !== -1) {
      users.value[userIndex].status = status === 'ONLINE' ? 'online' : 'offline';
    }
  });
};

onMounted(() => {
  setupUserStatus();
});
</script>
```

## 🔧 Servicios Disponibles

### 1. `useRealtime()` - Composable General

```javascript
const {
  isConnected,
  subscribeToChatMessages,
  unsubscribeFromChatMessages,
  subscribeToUserStatusChanges,
  subscribeToNewChats,
  cleanup
} = useRealtime();
```

### 2. `usePrivateChatRealtime()` - Composable Específico para Chat

```javascript
const {
  subscribeToPrivateChat,
  unsubscribeFromPrivateChat,
  currentChatId
} = usePrivateChatRealtime();
```

### 3. Servicios Directos

```javascript
import { 
  subscribeToChat, 
  unsubscribeFromChat,
  subscribeToUserStatus,
  subscribeToChats,
  initializeRealtime
} from '../services/realtime';
```

## 📡 Eventos Disponibles

### Eventos de Mensajes

- `INSERT` - Nuevo mensaje
- `UPDATE` - Mensaje actualizado (ej: marcado como leído)
- `DELETE` - Mensaje eliminado

### Eventos de Usuarios

- `ONLINE` - Usuario conectado
- `OFFLINE` - Usuario desconectado

### Eventos de Chats

- `NEW_CHAT` - Nuevo chat creado

## 🛠️ Funciones Avanzadas

### 1. Manejo de Errores

```javascript
const setupRealtimeWithErrorHandling = async (chatId) => {
  try {
    const subscription = subscribeToChat(chatId, (message) => {
      console.log('Nuevo mensaje:', message);
    });
    
    // Manejar errores de conexión
    subscription.on('error', (error) => {
      console.error('Error en Realtime:', error);
      // Reconectar automáticamente
      setTimeout(() => setupRealtimeWithErrorHandling(chatId), 5000);
    });
    
  } catch (error) {
    console.error('Error al configurar Realtime:', error);
  }
};
```

### 2. Reconexión Automática

```javascript
const setupRealtimeWithReconnection = (chatId, callback) => {
  let retryCount = 0;
  const maxRetries = 5;
  
  const connect = () => {
    try {
      const subscription = subscribeToChat(chatId, callback);
      
      subscription.on('error', () => {
        if (retryCount < maxRetries) {
          retryCount++;
          setTimeout(connect, 1000 * retryCount);
        }
      });
      
      return subscription;
    } catch (error) {
      if (retryCount < maxRetries) {
        retryCount++;
        setTimeout(connect, 1000 * retryCount);
      }
    }
  };
  
  return connect();
};
```

## 🔍 Debugging

### 1. Verificar Conexión

```javascript
// En la consola del navegador
supabase.channel('test').subscribe((status) => {
  console.log('Estado de conexión:', status);
});
```

### 2. Logs de Realtime

```javascript
// Habilitar logs detallados
supabase.channel('debug')
  .on('postgres_changes', { event: '*', schema: 'public' }, (payload) => {
    console.log('Cambio detectado:', payload);
  })
  .subscribe();
```

### 3. Verificar en Supabase Dashboard

1. Ve a **Database > Logs**
2. Filtra por "realtime"
3. Envía un mensaje desde tu aplicación
4. Deberías ver logs de Realtime en tiempo real

## ⚡ Optimizaciones

### 1. Limpieza de Suscripciones

```javascript
onUnmounted(() => {
  // Siempre limpiar suscripciones al desmontar
  unsubscribeFromPrivateChat();
  cleanup();
});
```

### 2. Debounce para Actualizaciones

```javascript
import { debounce } from 'lodash';

const debouncedUpdate = debounce((message) => {
  messages.value.push(message);
}, 100);

subscribeToChat(chatId, debouncedUpdate);
```

### 3. Cache de Mensajes

```javascript
const messageCache = new Map();

const handleNewMessage = (message) => {
  // Evitar duplicados
  if (!messageCache.has(message.id)) {
    messageCache.set(message.id, message);
    messages.value.push(message);
  }
};
```

## 🎉 ¡Listo!

Con esta configuración tienes un sistema completo de Realtime que:

- ✅ Recibe mensajes en tiempo real
- ✅ Actualiza estado de usuarios (online/offline)
- ✅ Maneja nuevos chats automáticamente
- ✅ Incluye manejo de errores y reconexión
- ✅ Es fácil de usar en componentes Vue
- ✅ Se limpia automáticamente al desmontar

¡Tu chat privado ahora es completamente en tiempo real! 🚀 