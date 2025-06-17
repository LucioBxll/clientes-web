<template>
  <div>
    <input
      :type="type"
      :placeholder="placeholder"
      :disabled="disabled"
      :class="inputClass"
      v-bind="$attrs"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
    />
  </div>
</template>

<script>
export default {
  name: 'BaseInput',
  props: {
    modelValue: [String, Number],
    type: {
      type: String,
      default: 'text'
    },
    placeholder: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    },
    inputClass: {
      type: String,
      default: ''
    }
  }
}
</script> 