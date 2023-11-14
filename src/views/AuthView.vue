<template>
    <div class="padding_v margin_h">
        <h1 class="center">Admin login</h1>
        <el-form>
            <InputField @updateField="user.email=$event" @inFocus="errMsg=null" :text="user.email" label="Email" type="text">
            </InputField>
            <InputField @updateField="user.password=$event" @inFocus="errMsg=null"  :text="user.password" label="Password" type="password">
            </InputField>
            <Alert :show="!!errMsg">{{ errMsg }}</Alert>
            <el-form-item>
                <el-button class="btn" type="primary" @click="submitForm" :loading="loading">Login</el-button>
                <el-button class="btn" type="danger" @click="resetForm" >Reset</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
import {reactive, ref} from 'vue'
import Alert from '../components/alert.vue'
import InputField from '../components/input-field.vue'
import { useAdminStore } from '../stores/use-admin-store'
import { mapActions } from 'pinia'
import {err_Msg, saveToken} from '../helpers/functions'
import { io } from '../helpers/socket'
export default{
    components:{ InputField, Alert },
    setup(){
        const adminStore = useAdminStore()
        const user = reactive({
            email:'admin@gmail.com',
            password:'123456'
        })
        const errMsg = ref(null)
        const loading = ref(false)
        return{ adminStore, user, errMsg, loading }
    },
    methods:{
        ...mapActions(useAdminStore,['setAdminData']),
        resetForm(){
            this.user.email=''
            this.user.password=''
        },
        submitForm(){
            this.loading=true
            this.user.email = this.user.email.toLowerCase()
            this.$axios.instance().post('/admin/login',{...this.user}).then(response=>{
                this.loading = false
                const {token,admin} = response.data
                this.setAdminData(admin)
                saveToken(token)
                this.resetForm()
                this.$router.push({name:'home-panel'})
                io.connect()  // connect socket
            }).catch(error=>{
                this.loading = false
                if(error.response.status == 401 || error.response.status == 404){
                    return this.errMsg = error.response.data.message
                }
                this.$notify({ title: 'Error',type:'error',message: err_Msg() })
                console.log(error)
            })
        }
    }
}
</script>
