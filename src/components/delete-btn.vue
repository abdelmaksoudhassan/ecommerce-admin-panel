<template>
    <el-button type="danger" @click="deleteAdmin()" :loading="loading" size="small" class="btn">
      {{text}}
    </el-button>
</template>
<script>
import {ref} from 'vue'
import {err_Msg} from '../helpers/functions'
export default{
  setup(){
      const loading = ref(false)
      return { loading }
  },
  props:{
    url:{
        required: true,
        type: String
    },
    id:{
        type: String,
        default: ''
    },
    text:{
      type: String,
      default: 'Delete'
    }
  },
  methods:{
    deleteAdmin(){
      this.loading = true
      const url = this.id  ? this.url + `/${this.id}` : this.url
      this.$axios.authInstance().delete(url).then(res=>{
        this.id ? this.$emit('deleted',this.id) : this.$emit('deleted')
        this.loading = false
      }).catch(err=>{
        this.$notify({ title: 'Error',type:'error', message: err_Msg() })
        console.log(err)
        this.loading = false
      })
    }
  }
}
</script>
