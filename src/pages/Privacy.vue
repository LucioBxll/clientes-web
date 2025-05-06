<template>
  <div class="min-h-screen bg-blue-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
    <div class="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 transition-colors duration-200">
      <h1 class="text-3xl font-bold text-center mb-8 text-primary-600 dark:text-primary-400">POLÍTICA DE PRIVACIDAD</h1>
      
      <p class="text-gray-600 dark:text-gray-400 mb-8">Fecha de última actualización: [Fecha]</p>

      <div class="prose dark:prose-invert max-w-none">
        <p class="mb-6 text-gray-700 dark:text-gray-300">
          En [Nombre de la App], tu privacidad es muy importante para nosotros. Esta Política de Privacidad explica cómo recopilamos, usamos, compartimos y protegemos tu información personal cuando usás nuestra aplicación.
        </p>

        <h2 class="text-xl font-semibold mt-6 mb-4 text-primary-600 dark:text-primary-400">1. Información que recopilamos</h2>
        <p class="mb-4 text-gray-700 dark:text-gray-300">Podemos recopilar los siguientes datos cuando usás [Nombre de la App]:</p>
        <ul class="list-disc pl-6 mb-6 text-gray-700 dark:text-gray-300">
          <li>Información personal: nombre, correo electrónico, número de teléfono, fecha de nacimiento, género, ubicación.</li>
          <li>Información del perfil: fotos, biografía, intereses, publicaciones y otra información que voluntariamente compartas.</li>
          <li>Datos técnicos: dirección IP, tipo de dispositivo, sistema operativo, versión de la app, idioma, cookies y datos de uso.</li>
          <li>Ubicación: si lo autorizás, podemos recopilar datos de geolocalización.</li>
        </ul>

        <h2 class="text-xl font-semibold mt-6 mb-4 text-primary-600 dark:text-primary-400">2. Cómo usamos tu información</h2>
        <p class="mb-4 text-gray-700 dark:text-gray-300">Usamos tus datos para:</p>
        <ul class="list-disc pl-6 mb-6 text-gray-700 dark:text-gray-300">
          <li>Crear y administrar tu cuenta.</li>
          <li>Ofrecer funciones sociales y personalizadas.</li>
          <li>Mejorar el rendimiento y la seguridad de la app.</li>
          <li>Enviarte notificaciones relevantes.</li>
          <li>Cumplir con obligaciones legales.</li>
        </ul>

        <h2 class="text-xl font-semibold mt-6 mb-4 text-primary-600 dark:text-primary-400">3. Compartir tu información</h2>
        <p class="mb-6 text-gray-700 dark:text-gray-300">
          No vendemos ni alquilamos tu información personal. Podemos compartirla solo en estos casos:
        </p>
        <ul class="list-disc pl-6 mb-6 text-gray-700 dark:text-gray-300">
          <li>Con proveedores de servicios que nos ayudan a operar la plataforma.</li>
          <li>Si es requerido por ley o autoridad competente.</li>
          <li>Para proteger nuestros derechos, seguridad o propiedad.</li>
        </ul>

        <h2 class="text-xl font-semibold mt-6 mb-4 text-primary-600 dark:text-primary-400">4. Seguridad de la información</h2>
        <p class="mb-6 text-gray-700 dark:text-gray-300">
          Aplicamos medidas de seguridad técnicas y organizativas para proteger tu información. Sin embargo, ningún sistema es 100% seguro, por lo que no podemos garantizar la seguridad absoluta.
        </p>

        <h2 class="text-xl font-semibold mt-6 mb-4 text-primary-600 dark:text-primary-400">5. Tus derechos</h2>
        <p class="mb-6 text-gray-700 dark:text-gray-300">
          Podés acceder, actualizar, corregir o eliminar tu información personal desde tu perfil o escribiéndonos a [correo@ejemplo.com].
        </p>
        <p class="mb-4 text-gray-700 dark:text-gray-300">También podés solicitar:</p>
        <ul class="list-disc pl-6 mb-6 text-gray-700 dark:text-gray-300">
          <li>Retiro de tu consentimiento para el tratamiento de tus datos.</li>
          <li>Exportación de tus datos en un formato accesible.</li>
        </ul>

        <h2 class="text-xl font-semibold mt-6 mb-4 text-primary-600 dark:text-primary-400">6. Retención de datos</h2>
        <p class="mb-6 text-gray-700 dark:text-gray-300">
          Conservamos tus datos mientras tengas una cuenta activa o mientras sea necesario para cumplir con obligaciones legales o resolver disputas.
        </p>

        <h2 class="text-xl font-semibold mt-6 mb-4 text-primary-600 dark:text-primary-400">7. Servicios de terceros</h2>
        <p class="mb-6 text-gray-700 dark:text-gray-300">
          Podemos incluir enlaces o servicios de terceros (como redes publicitarias o integraciones externas). No somos responsables de sus prácticas de privacidad.
        </p>

        <h2 class="text-xl font-semibold mt-6 mb-4 text-primary-600 dark:text-primary-400">8. Cambios a esta política</h2>
        <p class="mb-6 text-gray-700 dark:text-gray-300">
          Podemos actualizar esta Política de Privacidad ocasionalmente. Te notificaremos sobre cambios importantes. El uso continuado de la app implica tu aceptación de las actualizaciones.
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Privacidad',
  metaInfo: {
    title: 'Política de Privacidad'
  }
}
</script>

<style scoped>
.prose {
  color: #374151;
  line-height: 1.75;
}

.prose h2 {
  color: #2563eb;
  font-weight: 600;
}

.prose ul {
  margin-top: 1.25em;
  margin-bottom: 1.25em;
}

.prose li {
  margin-top: 0.5em;
  margin-bottom: 0.5em;
}

.dark .prose {
  color: #d1d5db;
}

.dark .prose h2 {
  color: #60a5fa;
}
</style> 