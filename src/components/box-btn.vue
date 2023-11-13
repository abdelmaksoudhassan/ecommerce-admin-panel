<template>
  <el-button size="small" @click="open" type="primary">Edit</el-button>
</template>
<script setup>
import { ElMessageBox } from 'element-plus'
const props = defineProps({
  title:{
      required: true,
      type: String
  }
})
const emit = defineEmits(['confirmBox','cancelBox'])
const open = () => {
  ElMessageBox.confirm(
    'title must be valid and unique',
    'Edit title',
    {
      confirmButtonText: 'Save',
      cancelButtonText: 'Discard',
      type: 'warning',
      draggable: true,
      showInput: true,
      inputValue: props.title
    }).then(instance => {
      const {value} = instance
      emit('confirmBox',value)
  }).catch(() => {
      emit('cancelBox')
  })
}
</script>
