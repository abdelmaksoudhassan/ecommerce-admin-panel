<template>
  <h1 class="center">Admins List</h1>
  <el-table v-loading="loading" :data="admins" style="width: 100%">
    <el-table-column label="Date" width="180">
      <template #default="scope">
        <div style="display: flex; align-items: center">
          <el-icon><Clock /></el-icon>
          <span style="margin-left: 10px">{{ $filters.fromNow(scope.row.createdAt) }}</span></div>
      </template>
    </el-table-column>
    <el-table-column label="email" width="180">
      <template #default="scope">
        <div style="display: flex; align-items: center">
          <el-icon><Message /></el-icon>
          <span style="margin-left: 5px;">{{ scope.row.email }}</span>
        </div>
      </template>
    </el-table-column>
    <el-table-column fixed="right" align="right">
      <template #default="scope">
        <DeleteBtn :id="scope.row._id" :url="url" @deleted="filterAdmins($event)"></DeleteBtn>
      </template>
    </el-table-column>
  </el-table>
</template>
<script>
import {ref} from 'vue'
import { err_Msg } from '../../helpers/functions'
import DeleteBtn from '../../components/delete-btn.vue'
import {io} from '../../helpers/socket'

export default{
  components:{ DeleteBtn },
  setup(){
    const admins = ref([])
    const url = ref('/admin/delete-admin')
    const loading = ref(false)
    return { admins,url,loading }
  },
  created(){
    this.loading = true
    this.$axios.authInstance().get('/admin/get-admins').then(res=>{
      this.admins = res.data
      this.loading = false
    }).catch(err=>{
      this.$notify({ title: 'Error',type:'error', message: err_Msg() })
      console.log(err)
      this.loading = false
    })
  },
  mounted(){
    io.on('addAdmin',(admin)=>{
      const {email} = admin
      this.$message({ message: `New admin (${email}) added`, type: 'success', showClose: true })
      this.admins.push(admin)
    }),
    io.on('deleteAdmin',(id)=>{
      const admin = this.admins.find(admin => admin._id == id)
      const {email} = admin
      this.admins = this.admins.filter(admin => admin._id != id)
      this.$message({ message: `admin (${email}) deleted`, type: 'error', showClose: true })
    })
  },
  methods:{
    filterAdmins(event){
      this.admins = this.admins.filter(admin=>admin._id != event)
    }
  }
}
</script>
