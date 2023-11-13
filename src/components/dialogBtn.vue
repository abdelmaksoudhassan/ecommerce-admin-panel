<template>
    <el-button type="info" @click="dialogTableVisible = true" class="btn">
        <slot name="btn-txt"></slot>
  </el-button>
  <el-dialog :append-to-body="true" v-model="dialogTableVisible" :title="title">
    <slot name="dialog-content"></slot>
  </el-dialog>
  
</template>
<script setup>
import {ref} from "vue"
const dialogTableVisible = ref(false)
defineProps({
    title:{
        type: String,
        required: true
    }
})
</script>