<template>
  <RouterView />
</template>
<script>
import { RouterView } from 'vue-router'
import { useAdminStore } from './stores/use-admin-store'
import { mapActions } from 'pinia'
import { io } from './helpers/socket'

export default{
  async created(){
    try{
      const admin = (await this.$axios.authInstance().post('/admin/auto-login')).data
      this.setAdminData(admin)
      io.connect()  // connect socket
    }catch(err){
      return
    }
  },
  mounted(){
    io.on('newAdminJoined',()=>{
      this.$message({ message: 'New admin logged in', type: 'success', showClose: true })
    })
  },
  methods:{
    ...mapActions(useAdminStore,['setAdminData'])
  }
}
</script>