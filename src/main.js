import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import 'element-plus/dist/index.css'
import App from './App.vue'
import router from './router'
import 'animate.css'
import vuelidate from '@vuelidate/core'
import moment from 'moment'
import axios from 'axios'
import { getToken } from './helpers/functions'
import './assets/main.css'

// to use element icons
const app = createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}
// to define filters
app.config.globalProperties.$filters = {
    fromNow(value) {
        return moment(new Date(value), "YYYYMMDD").fromNow();
    },
    dollarSign(value){
        return value+' $'
    }
}
// to define axios instances
app.config.globalProperties.$axios = {
    instance(){
        return axios.create({
            baseURL:'https://nodejs-ecommerce-o2e5.onrender.com/',
            withCredentials: true
        })
    },
    authInstance(){
        const instance = this.instance()
        instance.interceptors.request.use(config=>{
            config.headers['Token'] = getToken()
            return config
        })
        return instance
    }
}

app.use(createPinia())
app.use(router)
app.use(ElementPlus)
app.use(vuelidate)
app.mount('#app')
