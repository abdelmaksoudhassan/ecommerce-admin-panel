import { defineStore } from 'pinia'

export const useProductStore = defineStore('product',{
    state:()=>{
        return{
            products: []
        }
    },
    getters:{
        arrCount:(state)=> state.products.length
    },
    actions:{
        pushToProducts(data){
            this.products.unshift(data)
        },
        setProducts(data){
            this.products = data
        },
        deleteProduct(id){
            this.products = this.products.filter(product=>product._id != id)
        },
        popProduct(){
            this.products.pop()
        },
        editProduct(id,product){
            const index = this.products.findIndex(x=>x._id==id)
            if(index != -1){
                this.products[index] = product
            }
        }
        // getProduct(id){
        //     const arr = this.products.filter(x=> x._id == id)
        //     return arr.length == 0 ? null : arr[0]
        // }
    }
})
