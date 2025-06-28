# Configuración de Supabase para Chat Privado

## 🚨 IMPORTANTE: Pasos Requeridos

Para que el chat privado funcione correctamente, debes seguir estos pasos en tu proyecto de Supabase:

### Paso 1: Crear las Tablas

1. Ve a tu **Dashboard de Supabase**
2. Navega a **SQL Editor**
3. Copia y pega el contenido del archivo `setup-chat-tables.sql`
4. Haz clic en **"Run"** para ejecutar el script

### Paso 2: Habilitar Realtime

1. En el dashboard, ve a **Database** → **Replication**
2. Busca la tabla `private_messages`
3. Activa el toggle para **"Enable realtime"**
4. Guarda los cambios

### Paso 3: Verificar Políticas RLS

1. Ve a **Database** → **Tables**
2. Verifica que las tablas `private_chats` y `private_messages` existan
3. Verifica que RLS esté habilitado en ambas tablas
4. Verifica que las políticas estén creadas correctamente

## 🔍 Verificación de Configuración

### Verificar Tablas
```sql
-- Ejecutar en SQL Editor para verificar
SELECT table_name, table_type 
FROM information_schema.tables 
WHERE table_name IN ('private_chats', 'private_messages');
```

### Verificar Políticas
```sql
-- Ejecutar en SQL Editor para verificar políticas
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename IN ('private_chats', 'private_messages');
```

### Verificar Realtime
```sql
-- Ejecutar en SQL Editor para verificar realtime
SELECT * FROM pg_publication_tables 
WHERE tablename IN ('private_chats', 'private_messages');
```

## 🐛 Solución de Problemas Comunes

### Error: "new row violates row-level security policy"

**Causa**: Las políticas RLS no están configuradas correctamente.

**Solución**:
1. Verifica que las políticas estén creadas
2. Asegúrate de que el usuario esté autenticado
3. Verifica que las políticas permitan INSERT

### Error: "invalid input syntax for type uuid: undefined"

**Causa**: El chat_id no se está obteniendo correctamente.

**Solución**:
1. Verifica que las tablas existan
2. Verifica que las políticas permitan SELECT
3. Limpia el cache del navegador

### Error: "Mensajes no aparecen en tiempo real"

**Causa**: Realtime no está habilitado.

**Solución**:
1. Habilita Realtime para `private_messages`
2. Verifica la conexión de WebSocket
3. Revisa la consola del navegador

## 📋 Checklist de Configuración

- [ ] Tablas `private_chats` y `private_messages` creadas
- [ ] Índices creados para optimización
- [ ] RLS habilitado en ambas tablas
- [ ] Políticas de seguridad creadas
- [ ] Realtime habilitado para `private_messages`
- [ ] Trigger para `updated_at` creado
- [ ] Variables de entorno configuradas

## 🔧 Variables de Entorno Requeridas

Asegúrate de tener estas variables en tu archivo `.env`:

```env
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-clave-anonima
```

## 🎯 Prueba de Funcionamiento

Después de completar la configuración:

1. **Registra dos usuarios** diferentes
2. **Navega al perfil** de un usuario desde el otro
3. **Haz clic en "Chat privado"**
4. **Envía un mensaje** y verifica que aparezca
5. **Abre otra pestaña** con el otro usuario y verifica tiempo real

## 📞 Soporte

Si tienes problemas después de seguir estos pasos:

1. Revisa la **consola del navegador** para errores
2. Verifica los **logs de Supabase** en el dashboard
3. Asegúrate de que **todas las políticas** estén creadas
4. Verifica que **Realtime** esté habilitado

¡El chat privado debería funcionar perfectamente después de completar estos pasos! 🚀 