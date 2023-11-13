<template>
      <h1 class="center">Features</h1>
      <Collapse :items="features"></Collapse>
</template>
<script setup>
import { reactive } from 'vue';
import Collapse from '../../components/collapse.vue';
const features = reactive([
    { title:'Admin managment',
      features:[
        { name:'Add admin', descreption:'Add another member as admin to your admin group' },
        { name:'Delete admin', descreption:'Remove admin member from your admin group' }
      ]
    },
    { title:'Category managment',
      features:[
        { name:'Edit category', descreption:'Edit specific category properties' },
        { name:'Delete category', descreption:'Remove category from your categories group' },
        { name:'Add category', descreption:'Add another category to your categories group' }
      ]
    },
    { title:'Product managment',
      features:[
        { name:'Edit product', descreption:'Edit specific product properties' },
        { name:'Delete product', descreption:'Remove product from your products group' },
        { name:'Add product', descreption:'Add another product to your products group' }
      ]
    },
    { title:'Manage orders',
      features:[
        { name:'Details', descreption:'Review all comming orders in details such as all ordered products details, wanted quantity, total price and customer data & delete specific orders' }
      ]
    },
    { title:'Manage profile',
      features:[
        { name:'Setting', descreption:'Manage profile data such as change profile picture,change name properties or change password' }
      ]
    }
])
</script>