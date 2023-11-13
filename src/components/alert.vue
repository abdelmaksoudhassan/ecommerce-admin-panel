<template>
    <el-alert v-show="show" :type="type">
        <slot></slot>
    </el-alert>
</template>
<script setup>
defineProps({
    show:{
        type:Boolean,
        default:false
    },
    type:{
        type:String,
        default:"error"
    }
})
</script>
<style scoped>
.el-alert{
    margin: 15px 0px;
}
</style>