<template>
    <h1 class="center">Categories List</h1>
    <el-input v-model="search" placeholder="Search category.."/>
    <el-table v-loading="loading" :data="_categories" style="width: 100%">
      <el-table-column label="Date" width="180">
      <template #default="scope">
        <div style="display: flex; align-items: center">
          <el-icon><timer /></el-icon>
          <span style="margin-left: 10px">{{ $filters.fromNow(scope.row.createdAt) }}</span>
        </div>
      </template>
    </el-table-column>
      <el-table-column label="Title" width="180">
      <template #default="scope">
        <div style="display: flex; align-items: center">
          <el-icon><Star /></el-icon>
          <span style="margin-left: 10px">{{ scope.row.title }}</span>
        </div>
      </template>
    </el-table-column>
      <el-table-column >
      <template #default="scope">
        <div>
          <BoxBtn :title="scope.row.title" @confirmBox="confirmEdit($event,scope.row._id)" @cancelBox="cancel"></BoxBtn>
          <ConfirmBtn title="category and its products will be deleted" @confirmEvent="confirmDelete(scope.row._id)" @cancelEvent="cancel"></ConfirmBtn>
        </div>
      </template>
    </el-table-column>
    </el-table>
</template>
<script>
import {ref} from 'vue'
import { mapState,mapActions } from 'pinia'
import {useCategoryStore} from '@/stores/use-category-store'
import Alert from '@/components/alert.vue'
import ConfirmBtn from '@/components/confirm-btn.vue'
import BoxBtn from '@/components/box-btn.vue'
import { err_Msg } from '@/helpers/functions'
import {io} from '@/helpers/socket'

export default {
  components:{ Alert,ConfirmBtn ,BoxBtn },
  setup(){
      const search = ref('')
      const loading= ref(false)
      return { search, loading }
  },
  computed:{
    ...mapState(useCategoryStore,['categories']),
    _categories(){
      return this.categories.filter(data => !this.search || data.title.toLowerCase().includes(this.search.toLowerCase()))
    }
  },
  created(){
    this.loading = true
    this.$axios.instance().get('/categories').then(res=>{
      const categories = res.data
      this.setCategories(categories)
      this.loading = false
    }).catch(err=>{
      this.$notify({ title: 'Error', message: err_Msg(), type: 'error' });
      console.log(err)
      this.loading = false
    }) 
  },
  mounted(){
    io.on('addCategory',(category)=>{
      this.$message({ message: `New category (${category.title}) added`, type: 'success', showClose: true })
      this.pushToCategories(category)
    })
    io.on('editCategory',(category)=>{
      const {_id,title} = category
      const old = this.getCategory(_id)
      this.$message({ message: `(${old.title}) category updated to (${title})`, type: 'warning', showClose: true })
      this.updateCategory(_id,title)
    })
    io.on('deleteCategory',(id)=>{
      const {title} = this.getCategory(id)
      this.deleteCetegory(id)
      this.$message({ message: `(${title}) category deleted`, type: 'error', showClose: true })
    })
  },
  methods:{
    ...mapActions(useCategoryStore,['getCategory','pushToCategories','deleteCetegory','updateCategory','setCategories']),
    async confirmEdit(title,id){
      try {
        await this.$axios.authInstance().patch(`/category/${id}`,{title})
      } catch (err) {
        const message = (err.response.data.code==11000) ? "Duplicated title" : err_Msg()
        this.$notify({ title: 'Error', message, type: 'error' });
        console.log(err)
      }
    },
    async confirmDelete(id){
      try {
        await this.$axios.authInstance().delete(`category/${id}`)
      } catch (err) {
        this.$notify({ title: 'Error', message: err_Msg(), type: 'error' });
        console.log(err)
      }
    },
    cancel(){
      return
    }
  }
}
</script>
