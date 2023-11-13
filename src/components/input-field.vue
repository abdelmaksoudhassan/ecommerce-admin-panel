<template>
    <el-form-item :label="label">
        <el-input @focus="$emit('inFocus')" :type="type" :model-value="text" @input="$emit('updateField',$event)" />
    </el-form-item>
</template>
<script>
export default{
    props:{
        emits:['updateField','inFocus'],
        text:{
            required:true,
            type: String
        },
        type:{
            required:true,
            type: String,
            validator(value) {
                return ['text', 'password'].includes(value)
            }
        },
        label:{
            required:true,
            type: String
        }
    }
}
</script>