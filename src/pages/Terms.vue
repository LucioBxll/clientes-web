<template>
  <div class="min-h-screen bg-blue-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
    <div class="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 transition-colors duration-200">
      <h1 class="text-3xl font-bold text-center mb-8 text-primary-600 dark:text-primary-400">TÉRMINOS Y CONDICIONES DE USO</h1>
      
      <p class="text-gray-600 dark:text-gray-400 mb-8">Fecha de última actualización: [Fecha]</p>

      <div class="prose dark:prose-invert max-w-none">
        <p class="mb-6 text-gray-700 dark:text-gray-300">
          Bienvenido/a a [Nombre de la App]. Al acceder y utilizar esta aplicación, aceptas cumplir con los siguientes términos y condiciones. Si no estás de acuerdo con ellos, por favor no utilices nuestros servicios.
        </p>

        <h2 class="text-xl font-semibold mt-6 mb-4 text-primary-600 dark:text-primary-400">1. Aceptación de los términos</h2>
        <p class="mb-6 text-gray-700 dark:text-gray-300">
          Al registrarte o utilizar [Nombre de la App], declaras que has leído, comprendido y aceptado estos Términos y Condiciones, así como nuestra Política de Privacidad.
        </p>

        <h2 class="text-xl font-semibold mt-6 mb-4 text-primary-600 dark:text-primary-400">2. Descripción del servicio</h2>
        <p class="mb-6 text-gray-700 dark:text-gray-300">
          [Nombre de la App] es una red social que permite a los usuarios crear un perfil, compartir contenido, interactuar con otros usuarios y participar en comunidades virtuales.
        </p>

        <h2 class="text-xl font-semibold mt-6 mb-4 text-primary-600 dark:text-primary-400">3. Registro de usuario</h2>
        <p class="mb-6 text-gray-700 dark:text-gray-300">
          Para acceder a ciertas funciones, debes crear una cuenta proporcionando información veraz, actual y completa. Eres responsable de mantener la confidencialidad de tu contraseña y de todas las actividades que ocurran en tu cuenta.
        </p>

        <h2 class="text-xl font-semibold mt-6 mb-4 text-primary-600 dark:text-primary-400">4. Contenido del usuario</h2>
        <p class="mb-6 text-gray-700 dark:text-gray-300">
          Eres el único responsable del contenido que publiques. No debes subir contenido que sea ilegal, ofensivo, amenazante, difamatorio, o que infrinja derechos de terceros.
        </p>
        <p class="mb-6 text-gray-700 dark:text-gray-300">
          Nos reservamos el derecho de eliminar cualquier contenido que viole estas condiciones o que consideremos inapropiado.
        </p>

        <h2 class="text-xl font-semibold mt-6 mb-4 text-primary-600 dark:text-primary-400">5. Normas de uso</h2>
        <p class="mb-4 text-gray-700 dark:text-gray-300">Al utilizar la app, te comprometes a:</p>
        <ul class="list-disc pl-6 mb-6 text-gray-700 dark:text-gray-300">
          <li>No suplantar a otras personas o entidades.</li>
          <li>No acosar, amenazar ni intimidar a otros usuarios.</li>
          <li>No utilizar la app con fines comerciales sin autorización.</li>
          <li>No subir virus o código malicioso.</li>
        </ul>

        <h2 class="text-xl font-semibold mt-6 mb-4 text-primary-600 dark:text-primary-400">6. Propiedad intelectual</h2>
        <p class="mb-6 text-gray-700 dark:text-gray-300">
          Todo el contenido proporcionado por [Nombre de la App], como logos, diseño, software y textos, está protegido por derechos de autor. No puedes reproducirlo, modificarlo o distribuirlo sin autorización expresa.
        </p>

        <h2 class="text-xl font-semibold mt-6 mb-4 text-primary-600 dark:text-primary-400">7. Terminación de cuentas</h2>
        <p class="mb-6 text-gray-700 dark:text-gray-300">
          Podemos suspender o eliminar tu cuenta si violas estos Términos o si consideramos que tu comportamiento perjudica a otros usuarios o a la plataforma.
        </p>

        <h2 class="text-xl font-semibold mt-6 mb-4 text-primary-600 dark:text-primary-400">8. Limitación de responsabilidad</h2>
        <p class="mb-6 text-gray-700 dark:text-gray-300">
          [Nombre de la App] no será responsable por daños directos, indirectos o incidentales derivados del uso o imposibilidad de uso del servicio.
        </p>

        <h2 class="text-xl font-semibold mt-6 mb-4 text-primary-600 dark:text-primary-400">9. Cambios en los términos</h2>
        <p class="mb-6 text-gray-700 dark:text-gray-300">
          Podemos actualizar estos Términos en cualquier momento. Te notificaremos los cambios relevantes, y el uso continuo del servicio después de dichas actualizaciones constituye tu aceptación de los nuevos términos.
        </p>

        <h2 class="text-xl font-semibold mt-6 mb-4 text-primary-600 dark:text-primary-400">10. Ley aplicable</h2>
        <p class="mb-6 text-gray-700 dark:text-gray-300">
          Estos Términos se regirán por las leyes de [País o Jurisdicción], sin perjuicio de cualquier conflicto con otras legislaciones.
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Terms',
  metaInfo: {
    title: 'Términos y Condiciones'
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