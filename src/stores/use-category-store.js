import { defineStore } from 'pinia'

export const useCategoryStore = defineStore('category',{
    state:()=>{
        return{
            categories: []
        }
    },
    actions:{
        pushToCategories(data){
            this.categories.push(data)
        },
        setCategories(data){
            this.categories = data
        },
        deleteCetegory(id){
            this.categories = this.categories.filter(category=>category._id != id)
        },
        editCategory(id,title){
            const index = this.categories.findIndex(x=>x._id==id)
            this.categories[index].title = title
        },
        getCategory(id){
            const arr = this.categories.filter(x=> x._id == id)
            return arr[0]
        }
    }
})