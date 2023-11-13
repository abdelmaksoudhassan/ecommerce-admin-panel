<template>
  <el-container>
    <el-aside width="55px"><SideNav></SideNav></el-aside>
    <el-main class="margin_h padding_v"><router-view></router-view></el-main>
  </el-container>
</template>
<script setup>
import SideNav from '../components/side-nav.vue'
</script>
