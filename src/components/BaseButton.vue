<template>
  <button
    :type="type"
    :disabled="disabled"
    :class="buttonClass"
    @click="$emit('click', $event)"
  >
    <slot />
  </button>
</template>

<script>
export default {
  name: 'BaseButton',
  props: {
    type: {
      type: String,
      default: 'button'
    },
    disabled: {
      type: Boolean,
      default: false
    },
    buttonClass: {
      type: String,
      default: ''
    }
  }
}
</script> 