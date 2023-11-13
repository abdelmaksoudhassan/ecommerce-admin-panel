<template>
    <h1 class="center">Profile Setting</h1>
    <!-- change avatar -->
    <div class="center">
        <UploadImage
            :url=url
            :headers="headers"
            @imageChanged="changeImage"
        >
        </UploadImage>
        </div>
        <!-- change name -->
        <div class="splitter"></div>
        <el-form>
            <InputField @updateField="name.first=$event; v$_name.first.$touch();" :text="name.first" label="Fisrt Name" type="text">
            </InputField>
            <Alert :show="v$_name.first.$dirty&&!v$_name.first.$model">
                First Name Is Required
            </Alert>
            <Alert :show="v$_name.first.minLength.$invalid && v$_name.first.$dirty">
                {{ v$_name.first.minLength.$message }}
            </Alert>
            <Alert :show="v$_name.first.maxLength.$invalid && v$_name.first.$dirty">
                {{ v$_name.first.maxLength.$message }}
            </Alert>
            <Alert :show="v$_name.first.alpha.$invalid &&v$_name.first.$dirty">
                First Name Must Be Only Letters
            </Alert>

            <InputField @updateField="name.last=$event; v$_name.last.$touch();" :text="name.last" label="Last Name" type="text">
            </InputField>
            <Alert :show="v$_name.last.$dirty&&!v$_name.last.$model">
                Last Name Is Required
            </Alert>
            <Alert :show="v$_name.last.minLength.$invalid && v$_name.last.$dirty">
                {{ v$_name.last.minLength.$message }}
            </Alert>
            <Alert :show="v$_name.last.maxLength.$invalid && v$_name.last.$dirty">
                {{ v$_name.last.maxLength.$message }}
            </Alert>
            <Alert :show="v$_name.last.alpha.$invalid &&v$_name.last.$dirty">
                Last Name Must Be Only Letters
            </Alert>
            <el-form-item>
                <el-button class="btn" :loading="loading" :disabled="v$_name.$invalid" type="success" @click="submitForm">Save</el-button>
                <el-button class="btn" @click="resetNameForm" type="warning">Reset</el-button>
            </el-form-item>
            </el-form>

        <!-- change password -->
        <div class="splitter"></div>
        <el-form>
            <InputField @updateField="password.old=$event" @inFocus="errMsg=''" :text="password.old" label="Old Password" type="password">
            </InputField>
            <Alert :show="!!errMsg">{{ errMsg }}</Alert>

            <InputField @updateField="password.new=$event; v$_password.new.$touch();" :text="password.new" label="New Password" type="password">
            </InputField>
            <Alert :show="v$_password.new.$dirty && !v$_password.new.$model">
                Confirm Password Is Required
            </Alert>
            <Alert :show="v$_password.new.minLength.$invalid && v$_password.new.$dirty">
                {{ v$_password.new.minLength.$message }}
            </Alert>

            <el-form-item>
                <el-button class="btn" :loading="ploading"  :disabled="v$_password.$invalid" type="success" @click="submitPassword">save</el-button>
                <el-button class="btn" @click="resetPassword"  type="warning">Reset</el-button>
            </el-form-item>
        </el-form>
</template>
<script>
import UploadImage from '@/components/upload-image.vue'
import InputField from '@/components/input-field.vue'
import Alert from '@/components/alert.vue'
import {ref,reactive} from 'vue'
import { getToken,err_Msg,clearToken } from '@/helpers/functions'
import { useAdminStore } from '@/stores/use-admin-store'
import { useVuelidate } from '@vuelidate/core'
import { required,minLength,maxLength,alpha } from '@vuelidate/validators'
import { mapActions } from 'pinia'
export default {
    components:{ UploadImage,InputField,Alert },
    setup(){
        const url = ref("https://nodejs-ecommerce-o2e5.onrender.com/admin/change-photo")
        const headers = reactive({ 'Token': getToken() })
        const name= reactive({ first:'', last:'' })
        const password= reactive({ old:'', new:'' })
        const loading=ref(false)
        const ploading=ref(false)
        const errMsg = ref('')
        const adminStore=useAdminStore()
        const nameRules = {
            first:{
                required,
                minLength:minLength(3),
                maxLength:maxLength(10),
                alpha
            },
            last:{
                required,
                minLength:minLength(3),
                maxLength:maxLength(10),
                alpha
            }
        }
        const passwordRules= {
            new:{
                required,
                minLength:minLength(6)
            }
        }
        const v$_name = useVuelidate(nameRules,name)
        const v$_password = useVuelidate(passwordRules, password)
        return{ 
            url, headers, adminStore, name, password, loading, ploading, v$_name, v$_password, errMsg
        }
    },    
    methods:{
        ...mapActions(useAdminStore,['changeName']),
        changeImage(event){
            this.adminStore.changeImage(event)
        },
        submitForm(){
            this.loading = true
            this.$axios.authInstance().patch('admin/change-name',{
                firstName:this.name.first,
                lastName:this.name.last
            }).then(response=>{
                this.loading = false
                const {firstName,lastName} = response.data
                this.changeName(firstName,lastName)
                this.$notify({ title: 'Success', message: 'User Name Updated', type:'success' });
                this.resetNameForm()
            }).catch(err=>{
                this.$notify({ title: 'Error', message: err_Msg(), type:'error' });
                console.log(err)
                this.loading = false
            })
        },
        resetNameForm(){
            this.name.first=''
            this.name.last=''
            this.v$_name.$reset()
        },
        submitPassword(){
            this.ploading = true
            this.$axios.authInstance().patch('admin/change-password',{
                oldPassword:this.password.old,
                newPassword:this.password.new
            }).then(()=>{
                this.ploading = false
                this.resetPassword()
                this.$notify({ title: 'Success',message: 'Password Updated',type:'success' });
            }).catch(err=>{
                this.ploading = false
                if(err.response.status == 401){
                    const message = err.response.data.message
                    this.errMsg = message
                    return
                }
                this.$notify({ title: 'Error', message: err_Msg(), type:'error' });
                console.log(err)
            })
        },
        resetPassword(){
            this.password.old=''
            this.password.new=''
            this.v$_password.$reset()
        },  
    }
}
</script>
