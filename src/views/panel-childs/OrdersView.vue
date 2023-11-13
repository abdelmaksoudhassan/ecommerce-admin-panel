<template>
    <h1 class="center">Orders Table</h1>
    <el-table v-loading="loading" :data="orders" >
        <el-table-column label="Date" prop="createdAt" style="width: 100%">
            <template #default="createdAt">
                <div style="display: flex; align-items: center">
                    <el-icon><Clock /></el-icon>
                    <span style="margin-left: 10px">{{$filters.fromNow(createdAt.row.createdAt)}}</span>
                </div>
            </template>
        </el-table-column>
        <el-table-column label="Email" width="180">
            <template #default="scope">
                <div style="display: flex; align-items: center">
                    <el-icon><Message /></el-icon>
                    <span style="margin-left: 5px;">{{ scope.row.userId.email }}</span>
                </div>
            </template>
        </el-table-column>
        <el-table-column>
            <template #default="scope">
                <div>
                <DialogBtn title="Order Details">
                    <template #btn-txt>Details</template>
                    <template #dialog-content>
                        <el-table :data="scope.row.products">
                            <el-table-column property="productId.title" label="title"></el-table-column>
                            <el-table-column property="productId.price" label="price"></el-table-column>
                            <el-table-column property="quantity" label="quantity"></el-table-column>
                            <el-table-column  label="total">
                                <template #default="scope">
                                    {{$filters.dollarSign(scope.row.productId.price * scope.row.quantity)}}
                                </template>
                            </el-table-column>
                        </el-table>
                        <div style="margin-top: 20px;">Total: {{$filters.dollarSign(getTotal(scope.row))}}</div>
                    </template>
                </DialogBtn>
                <DeleteBtn :id="scope.row._id" url="/order" @deleted="handleDelete($event)"></DeleteBtn>
            </div>
            </template>
        </el-table-column>
    </el-table>
    <div class="splitter"></div>
    <DeleteBtn url="/all-orders" @deleted="handleDeleteAll" text="Delete All Products" v-if="orders.length > 0"></DeleteBtn>
    <div class="splitter"></div>
    <div class="flex-center">
        <el-pagination class="paginator"
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
import {ref} from 'vue'
import DialogBtn from '@/components/dialogBtn.vue'
import DeleteBtn from '@/components/delete-btn.vue'
import { err_Msg } from '@/helpers/functions'
import {io} from '@/helpers/socket'
export default {
    components:{ DialogBtn,DeleteBtn },
    setup(){
        const loading = ref(false)
        const total=ref(0)
        const pageSize=ref(3)
        const currentPage = ref(1)
        const orders = ref([])
        return{ loading,total,pageSize,currentPage,orders }
    },
    created(){
        const q = this.$route.query.page
        q ? this.currentPage = parseInt(q) : this.currentPage = 1
        this.fetchOrders(this.currentPage,this.pageSize)
    },
    mounted(){
        io.on('newOrder',(order)=>{
            const {email} = order.userId
            this.$message({message: `new order from ${email}`, type: 'success', showClose: true })
            if(this.currentPage == 1){
                this.orders.pop()
                this.orders.unshift(order)
            }
        }),
        io.on('removeOrder',(_id)=>{
            this.orders = this.orders.filter(order=> order._id != _id)
            this.$message({message: `one order deleted`, type: 'error', showClose: true })
        }),
        io.on('removeAllOrders',()=>{
            this.orders = []
            this.total=0
            this.currentPage =1
            this.$message({message: `all orders removed`, type: 'error', showClose: true })
        })
    },
    methods:{
        handleDelete(id){
            this.orders = this.orders.filter(order=>order._id != id)
        },
        handleDeleteAll(){
            this.total = 0
            this.currentPage = 1
            this.orders = []
        },
        getTotal(row){
            let total = 0
            row.products.forEach(order => {
                total += order.productId.price * order.quantity
            });
            return total
        },
        fetchOrders(currentPage,pageSize){
            this.loading=true
            this.$axios.instance().get(`all-orders?page=${currentPage}&count=${pageSize}`).then(res=>{
                this.total = res.data.total
                this.orders = res.data.orders
                this.loading=false
            }).catch(err=>{
                this.$notify({ type: 'error',message: err_Msg(), title:'Error' })
                console.log(err)
                this.loading=false
            })
        },
        currentChange(){
            this.$router.push({query:{page:this.currentPage}})
            this.fetchOrders(this.currentPage,this.pageSize)
        }
    }
}
</script>
