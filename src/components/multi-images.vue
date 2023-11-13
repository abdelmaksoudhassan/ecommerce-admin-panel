<template>
  <el-upload
    v-model:file-list="fileList"
    action="#"
    multiple
    list-type="picture-card"
    :auto-upload="false"
    :on-preview="handlePictureCardPreview"
    :on-remove="handleRemove"
    :on-change="handleChange"
  >
    <el-icon><Plus /></el-icon>
  </el-upload>

  <el-dialog v-model="dialogVisible">
    <img class="review" :src="dialogImageUrl" alt="Preview Image" />
  </el-dialog>
</template>
  
<script lang="ts" setup>
import { ref, watch } from 'vue'
import { Plus } from '@element-plus/icons-vue'

import type { UploadProps, UploadUserFile } from 'element-plus'

const fileList = ref<UploadUserFile[]>([])
const dialogImageUrl = ref('')
const dialogVisible = ref(false)
const emit = defineEmits(['onChange','onRemove'])

const props = defineProps({
  freeImages:{
    type: Boolean,
    default: true
  }
})

watch(()=>props.freeImages,(val)=>{
  if(val == true){
    fileList.value = []
  }
})
const handlePictureCardPreview: UploadProps['onPreview'] = (uploadFile) => {
  dialogImageUrl.value = uploadFile.url!
  dialogVisible.value = true
}

const handleChange=(file, fileList)=>{
  emit('onChange',file)
}
const handleRemove: UploadProps['onRemove'] = (uploadFile, uploadFiles) => {
  emit('onRemove',uploadFile)
}
</script>
<style scoped>
.review{
  max-width: 100%;
  max-height: 100%;
}
</style>

  