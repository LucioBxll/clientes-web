<template>
  <div>
    <input
      :type="type"
      :placeholder="placeholder"
      :disabled="disabled"
      :class="inputClass"
      v-model="inputValue"
      @input="$emit('update:modelValue', inputValue)"
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
  },
  computed: {
    inputValue: {
      get() {
        return this.modelValue;
      },
      set(val) {
        this.$emit('update:modelValue', val);
      }
    }
  }
}
</script> 