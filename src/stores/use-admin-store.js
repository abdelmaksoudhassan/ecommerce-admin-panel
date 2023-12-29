import { defineStore } from 'pinia'

export const useAdminStore = defineStore('admin',{
    state:()=>{
        return{
            data: {},
            authenticated: false
        }
    },
    getters:{
        name(state){
            if(state.authenticated){
                return (!!state.data.firstName && !!state.data.lastName) ?
                    `${state.data.firstName} ${state.data.lastName}` : 
                    state.data.email.substr(0,state.data.email.indexOf('@'))
            }else{
                return 'Admin'
            }
        },
        imageUrl(state){
            return (state.authenticated&&state.data.image) ?
             `https://node-js-ecommerce.vercel.app/${state.data.image}` :
             "https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png"
        }
    },
    actions:{
        setAdminData(data){
            this.data = data
            this.authenticated = true
        },
        changeImage(url){
            this.data.image = url
        },
        changeName(firstName,lastName){
            this.data.firstName = firstName
            this.data.lastName = lastName
        }
    }
})
