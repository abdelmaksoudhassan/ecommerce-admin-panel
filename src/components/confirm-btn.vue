<template>
  <el-popconfirm
    confirm-button-text="Yes"
    cancel-button-text="No"
    icon-color="#626AEF"
    :title="title"
    @confirm="$emit('confirmEvent')"
    @cancel="$emit('cancelEvent')"
  >
    <template #reference>
      <el-button type="danger" size="small">Delete</el-button>
    </template>
  </el-popconfirm>
</template>

<script setup>
defineProps({
  title:{
    type: String,
    default: 'Are you sure to delete this ?'
  }
})
defineEmits(['confirmEvent','cancelEvent'])
</script>
