<template>
  <div class="splitter"></div>
  <el-carousel height="150px">
    <el-carousel-item v-for="(image,index) in images" :key="index" style="display: flex; justify-content: center;">
      <el-image style="width: 100px; height: 100px;" :src="url+image"/>
    </el-carousel-item>
  </el-carousel>
</template>
<script setup>
import {ref} from 'vue'
defineProps({
  images:{
      type: Array,
      required: true
  }
})
const url = ref('https://node-js-ecommerce.vercel.app/')
</script>
<style scoped>
.demo-fit {
  display: flex;
  text-align: center;
}
.demo-fit .block {
  flex: 1;
  display: flex;
  flex-direction: column;
  flex-grow: 0;
  margin: 10px 10px 10px 0px;
}
</style>
