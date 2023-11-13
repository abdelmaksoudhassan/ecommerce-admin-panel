<template>
    <el-collapse v-model="activeNames" :accordion="true">
      <el-collapse-item v-for="(item,index) in items" id="index" :title="item.title" :name="index">
        <div v-for="(feature,idx) in item.features">
            <el-icon><StarFilled /></el-icon>
            <strong style="margin-left: 5px;">{{feature.name}} : </strong>{{ feature.descreption }}
        </div>
      </el-collapse-item>
    </el-collapse>
</template>
<script setup>
import {ref} from 'vue'
    const activeNames = ref(['1'])
    defineProps({
        items:{
            type: Array,
            default: [
                {
                    title:'',
                    features:[
                        {
                        name:'',
                        descreption:''
                        }
                    ]
                }
            ]
        }
    })
</script>