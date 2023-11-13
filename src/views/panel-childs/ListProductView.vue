<template>
  <h1 class="center">Products List</h1>
  <el-input v-model="search" placeholder="Search Product.."/>
  <el-table :data="_products" v-loading="loading" style="width: 100%">
    <el-table-column label="Date" width="180">
      <template #default="scope">
        <div style="display: flex; align-items: center">
          <el-icon><Clock /></el-icon>
          <span style="margin-left: 10px">{{ $filters.fromNow(scope.row.createdAt) }}</span>
        </div>
      </template>
    </el-table-column>
    <el-table-column label="Title" width="180">
      <template #default="scope">
        <div style="display: flex; align-items: center">
          <el-icon><StarFilled /></el-icon>
          <span style="margin-left: 10px">{{ scope.row.title }}</span>
        </div>
      </template>
    </el-table-column>
    <el-table-column label="category" width="180">
      <template #default="scope">
        <div style="display: flex; align-items: center">
          <el-icon><Star /></el-icon>
          <span style="margin-left: 10px">{{ scope.row.categoryId.title }}</span>
        </div>
      </template>
    </el-table-column>
    <el-table-column fixed="right" align="right">
      <template #default="scope">
          <el-button type="primary" size="small" @click="$router.push({name:'edit-product',params:{_id:scope.row._id}})" class="btn">Edit</el-button>
          <DeleteBtn url="/product" :id="scope.row._id" @deleted="deleteProduct($event)"></DeleteBtn>
        </template>
    </el-table-column>
  </el-table>
  <!--  -->
  <div class="splitter"></div>
  <div class="flex-center">
    <el-pagination
      class="paginator"
      background
      layout="prev, pager, next"
      :total="total"
      :page-size="pageSize"
      v-model:current-page="currentPage"
      @current-change="currentChange()">
    </el-pagination>
  </div>
</template>
<script>
import {useProductStore} from '../../stores/use-product-store'
import {ref} from 'vue'
import {mapState,mapActions} from 'pinia'
import DeleteBtn from '../../components/delete-btn.vue'

export default {
  components:{DeleteBtn},
  computed:{
    ...mapState(useProductStore,['products']),
    _products(){
      return this.products.filter(data => !this.search || data.title.toLowerCase().includes(this.search.toLowerCase()))
    }
  },
  setup(){
    const search=ref('')
    const total=ref(0)
    const pageSize=ref(3)
    const currentPage=ref(1)
    const loading=ref(false)
    const productStore = useProductStore() 
    return { search,total,pageSize,currentPage,loading,productStore }
  },
  created(){
    const q = this.$route.query.page
    q ? this.currentPage = parseInt(q) : this.currentPage = 1
    this.fetchData(this.currentPage,this.pageSize)
  },
  methods:{
    ...mapActions(useProductStore,['setProducts','deleteProduct']),
    fetchData(currentPage,pageSize){
      this.loading=true
      this.$axios.authInstance().get(`admin-products?page=${currentPage}&count=${pageSize}`).then(res=>{
      this.total = res.data.total
      this.setProducts(res.data.products)
      this.loading = false
    }).catch(err=>{
      console.log(err)
      this.loading = false
    })
    },
    currentChange(){
      this.$router.push({query:{page:this.currentPage}})
      this.fetchData(this.currentPage,this.pageSize)
  }
  }
}
</script>
