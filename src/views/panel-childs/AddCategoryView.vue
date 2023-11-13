<template>
    <h1 class="center">Add Category</h1>
    <el-form ref="title" class="demo-ruleForm center-body">
        <InputField @updateField="category.title=$event; v$.title.$touch();" :text="category.title" label="Title" type="text">
        </InputField>
        <Alert :show="v$.title.$dirty && !v$.title.$model">
            category title is Required
        </Alert>
        <Alert :show="v$.title.minLength.$invalid && v$.$dirty">
            {{v$.title.minLength.$message}}
        </Alert>
        <Alert :show="v$.title.maxLength.$invalid && v$.title.$dirty">
            {{v$.title.maxLength.$message}}
        </Alert>
        <Alert :show="v$.title.lettersSpacesUnderscores.$invalid && v$.title.$dirty">
            category title support letters, numbers, spaces or underscore
        </Alert>
        <el-form-item>
            <el-button class="btn" :disabled="v$.title.$invalid" type="primary" @click="submitForm" :loading="loading">Save</el-button>
            <el-button class="btn" @click="resetForm" type="danger">Reset</el-button>
        </el-form-item>
    </el-form>
</template>
<script>
import { required,minLength,maxLength } from '@vuelidate/validators'
import InputField from '@/components/input-field.vue'
import Alert from '@/components/alert.vue'
import {ref,reactive} from 'vue'
import { useVuelidate } from '@vuelidate/core'
import {useCategoryStore} from '@/stores/use-category-store'
import { mapActions } from 'pinia'
import { err_Msg } from '@/helpers/functions'

export default{
    components:{Alert,InputField},
    setup(){
        const category = reactive({title:''})
        const loading = ref(false)
        const categoryStore = useCategoryStore()
        const rules = {
            title:{
                required,
                minLength:minLength(3),
                maxLength:maxLength(10),
                lettersSpacesUnderscores(value){
                    return /^[A-Za-z0-9 _]*[A-Za-z0-9][A-Za-z0-9 _]*$/.test(value)
                }
            }
        }
        const v$ = useVuelidate(rules, category)
        return {category, loading, categoryStore, v$ }
    },
    methods:{
        ...mapActions(useCategoryStore,['pushToCategories']),
        resetForm(){
            this.category.title=''
            this.v$.$reset()
        },
        async submitForm(){
            this.loading = true
            try {
                await this.$axios.authInstance().post('category',{...this.category})
                this.resetForm()
                this.loading = false
            } catch (err) {
                this.loading = false
                this.$notify({ title: 'Error', message: err_Msg(), type: 'error' });
                console.log(err)
            }
        }
    }
}
</script>