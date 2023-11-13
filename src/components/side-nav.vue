<template>
  <el-menu id="menu" :collapse="!expand" :router="true" :default-active="$route.name" :class="{overflow: expand}">
    <div class="user-data">
      <el-avatar icon="UserFilled" :src="imageUrl"></el-avatar>
      <strong v-show="expand" style="margin-left:5px">{{name}}</strong>
    </div>
    <el-divider>
      <el-icon><ShoppingTrolley /></el-icon>
    </el-divider>
    <div class="expand">
      <el-button type="primary" circle plain @click="toggleExpand">
        <el-icon v-if="!expand"><Right /></el-icon>
        <el-icon v-else><Back /></el-icon>
      </el-button>
    </div>
    <el-menu-item index="home-panel" :route="{name:'home-panel'}" @click="expand=false">
      <el-icon class="icon"><HomeFilled /></el-icon>
      <template #title>Home</template>
    </el-menu-item>
    <el-sub-menu index="Panel">
      <template #title>
        <el-icon class="icon"><Setting /></el-icon>
        <span>Mangement</span>
      </template>
      <el-menu-item-group title="Admin Group">
        <el-menu-item :route="{name:'add-admin'}" index="add-admin" @click="expand=false">Add admin</el-menu-item>
        <el-menu-item :route="{name:'list-admin'}" index="lis-admin" @click="expand=false">List admin</el-menu-item>
      </el-menu-item-group>
      <el-menu-item-group title="Category Group">
        <el-menu-item :route="{name:'add-category'}" index="add-category" @click="expand=false">Add category</el-menu-item>
        <el-menu-item :route="{name:'list-category'}" index="list-category" @click="expand=false">List category</el-menu-item>
      </el-menu-item-group>
      <el-menu-item-group title="Product Group">
        <el-menu-item :route="{name:'add-product'}" index="add-product" @click="expand=false">Add product</el-menu-item>
        <el-menu-item :route="{name:'list-product'}" index="list-product" @click="expand=false">List product</el-menu-item>
      </el-menu-item-group>
    </el-sub-menu>
  <el-menu-item index="orders" :route="{name:'orders'}" @click="expand=false">
    <el-icon class="icon"><Finished /></el-icon>
    <template #title>Orders</template>
  </el-menu-item>
  <el-menu-item index="profile" :route="{name:'profile'}" @click="expand=false">
    <el-icon><User /></el-icon>
    <template #title>Profile</template>
  </el-menu-item>
  <el-menu-item index="Home" :route="{name:'auth'}" @click="logout">
    <el-icon><DArrowLeft /></el-icon>
    <template #title>Logout</template>
  </el-menu-item>
</el-menu>
</template>
<script>
import {ref} from 'vue'
import { useAdminStore } from '../stores/use-admin-store'
import { mapState } from 'pinia'
import { clearToken, err_Msg } from '../helpers/functions'
import { io } from '../helpers/socket'
export default {
  setup(){
    const expand = ref(false)
    const adminStore = useAdminStore()
    return{ expand, adminStore }
  },
    computed:{
    ...mapState(useAdminStore,['imageUrl','name'])
  },
  methods: {
    toggleExpand(){
      this.expand = !this.expand
    },
    logout(){
      this.$axios.authInstance().post('admin/logout').then(()=>{
        this.adminStore.$reset()
        clearToken()
        io.disconnect()
      }).catch(err=>{
        this.$notify({ title: 'Error', type:'error', message: err_Msg() })
        console.log(err)
      })
    }
  }
}
</script>
<style scoped>
.menu-btn{
  font-size: x-large;
  cursor: pointer;
  display: flex;
  flex-direction: row;
  margin-top: 10px;
  position: fixed;
  right: 10px;
}
.icon{
  margin-bottom: 5px;
}
.el-menu{
  position: fixed;
  top: 0px;
  left: 0px;
  padding: 15px 0px;
  z-index: 100;
  height: 100%;
}
.overflow{
  overflow-y:scroll;
}
.user-data{
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}
.top{
  height: 50px;
  background-color:#FFFFFF;
  border-bottom: #EBEEF5 1px solid;
  position: fixed;
  top: 0px;
  width: 100%;
  z-index: 100;
}
.expand{
  display: flex;
  justify-content: center;
}
</style>