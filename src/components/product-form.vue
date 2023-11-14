<template>
    <el-form>
        <InputField @updateField="product.title=$event; v$.title.$touch();" :text="product.title" label="Title" type="text">
        </InputField>
        <Alert :show="v$.title.minLength.$invalid&&v$.title.$dirty">
            {{v$.title.minLength.$message}}
        </Alert>
        <Alert :show="v$.title.maxLength.$invalid && v$.title.$dirty">
            {{v$.title.maxLength.$message}}
        </Alert>
        <Alert :show="v$.title.letNumSpcUndrscr.$invalid && v$.title.$dirty">
            title required and support letters, numbers, spaces or underscore
        </Alert>

        <el-form-item label="Price">
            <el-input-number style="width:100%" @input="v$.price.$touch()" v-model="product.price" :min="1" :step="1"></el-input-number>
        </el-form-item>
        <Alert :show="v$.price.$dirty&&v$.price.required.$invalid">
            Product price is required
        </Alert>

        <el-form-item label="Quantity">
            <el-input-number style="width:100%" @input="v$.quantity.$touch()" v-model="product.quantity" :min="1" :step="1"></el-input-number>
        </el-form-item>
        <Alert :show="!v$.quantity.$model&&v$.quantity.$dirty">
            Product quantity is required
        </Alert>
                
        <div class="space-between">
            <div style="display: flex; flex-direction: column;">
                <el-form-item label="Category">
                    <el-select v-model="product.categoryId" @change="v$.categoryId.$touch()" clearable>
                        <el-option
                        v-for="item in categories"
                        :key="item._id"
                        :label="item.title"
                        :value="item._id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <Alert :show="v$.categoryId.required.$invalid&&v$.categoryId.$dirty" style="margin: unset;">
                    Product category is required
                </Alert>
            </div>

            <el-button @click="onAddDescription" type="danger" class="descr-btn">Add Description</el-button>
        </div>
        <Alert type="warning" :show="v$.description.minLen.$invalid">
            please add at least 2 items in description
        </Alert>
        <div>
            <div v-for="(point, index) in product.description" :key="point.id">
                <div class="flex-row" style="margin-top: 5px;">
                    <el-input :id="point.id" v-model="point.value" placeholder="write point"></el-input>
                    <el-button @click="onDeleteDescription(point.id)" type="danger" plain>X</el-button>
                </div>
            </div>
            <Alert :show="v$.description.$each.$invalid">
                this field is required and at least 5 characters
            </Alert>
        </div>
        <Images v-if="mode == 'edit'" :images="oldImages"></Images>
        <div style="margin: 20px 0px;">
            <MultiImages :freeImages="freeImages" @onChange="handleChange($event); v$.images.$touch()" @onRemove="handleRemove"></MultiImages>
            <span style="margin-left: 20px;">Upload images</span>
        </div>
        <Alert :show="v$.images.required.$invalid&&v$.images.$dirty">
            upload at least one image
        </Alert>
        <el-form-item>
            <el-button class="btn" :disabled="v$.$invalid" type="primary" @click="addProduct" v-if="mode == 'add'" :loading="loading">Add Product</el-button>
            <el-button class="btn" :disabled="v$.$invalid" type="primary" @click="updateProduct" v-else :loading="loading">Update Product</el-button>
            <el-button class="btn" type="danger" @click="resetForm" v-if="mode == 'add'">Reset</el-button>
        </el-form-item>
    </el-form>
</template>
<script>
import InputField from './input-field.vue'
import Alert from './alert.vue'
import MultiImages from './multi-images.vue'
import Images from './images.vue'
import {useProductStore} from '../stores/use-product-store'
import {useCategoryStore} from '../stores/use-category-store'
import {reactive,ref} from 'vue'
import { useVuelidate } from '@vuelidate/core'
import { required,minLength,maxLength,helpers } from '@vuelidate/validators'
import {mapState,mapActions} from 'pinia'
import { err_Msg } from '../helpers/functions'

export default{
components:{ Alert, InputField, MultiImages,Images},
setup(){
    const product = reactive({
        title:'',
        price:0,
        quantity:0,
        categoryId:'',
        description:[],
        images:[],
    })
    const rules = {
        title:{
            minLength:minLength(3),
            maxLength:maxLength(10),
            letNumSpcUndrscr(value){
                return /^[A-Za-z0-9 _]*[A-Za-z0-9][A-Za-z0-9 _]*$/.test(value)
            }
        },
        price:{ required },
        quantity:{ required },
        categoryId:{ required },
        description: {
            required,
            minLen: minLength(2),
            $each: helpers.forEach({
                value: { required, minLength: minLength(5) }
            })
        },
        images:{ required }
    }
    const oldImages = ref([])
    const loading = ref(false)
    const freeImages = ref(true)
    const categoryStore = useCategoryStore()
    const productStore = useProductStore()
    const v$ = useVuelidate(rules, product)
    
    return { product, loading, categoryStore, productStore, v$, oldImages, freeImages }
},
props:{
    mode:{
        required: true,
        validator(value) {
        return ['add', 'edit'].includes(value)
        }
    }
},
computed:{
    ...mapState(useCategoryStore,['categories']),
    id(){
        return this.$route.params._id || null
    }
},
created(){
    if(this.mode == 'edit'){
        this.$axios.instance().get(`product/${this.id}`).then(response=>{
            const {title,price,quantity,categoryId,description,images} = response.data
            this.product.title =title
            this.product.price =price
            this.product.quantity =quantity
            this.product.categoryId =categoryId._id
            description.forEach(element => {
                const item = {
                    id: (Math.random() * Math.random() * 1000).toString(),
                    value: element
                }
                this.product.description.push(item)
            });
            this.oldImages =images
        }).catch(err=>{
            this.$notify({ type: 'error', title: 'Error', message: err_Msg()})
            console.log(err)
        })
    }
},
mounted(){
    this.$axios.instance().get('/categories').then(res=>{
        const categories = res.data
        this.setCategories(categories)
    }).catch(err=>{
        this.$notify({ title: 'Error', message: err_Msg(), type: 'error' });
        console.log(err)
    })
},
methods:{
    ...mapActions(useCategoryStore,['setCategories']),
    ...mapActions(useProductStore,['pushToProducts','editProduct','popProduct']),
    resetForm(){
        this.product.description = []
        this.product.title = ''
        this.product.price = 0
        this.product.quantity = 0
        this.product.categoryId = ''
        this.freeImages = true
        this.v$.$reset()
    },
    onAddDescription(){
        const newDescription = {
            id: (Math.random() * Math.random() * 1000).toString(),
            value: ''
        }
        this.product.description.push(newDescription)
    },
    onDeleteDescription(id){
        const index = this.product.description.findIndex(e=>e.id==id)
        this.product.description = this.product.description.filter(description => description.id !== id)
    },
    handleChange(file, fileList){
        this.product.images.push(file.raw)
        this.freeImages = false
    },
    handleRemove(file, uploadFiles){
        const index = this.product.images.findIndex(el=>el.name == file.name)
        this.product.images.splice(index,1)
    },
    prepareFormData(){
        const payload  = new FormData();
        payload.append('title',this.product.title)
        payload.append('price',this.product.price)
        payload.append('quantity',this.product.quantity)
        payload.append('categoryId',this.product.categoryId)
        this.product.description.forEach(item=>{
            payload.append('description',item.value)  
        })
        if(this.product.images.length > 0){
            for (const i of Object.keys(this.product.images)) {
                payload.append('images', this.product.images[i])
            }
        }
        return payload
    },
    addProduct(){
        const payload = this.prepareFormData()
        this.loading = true
        this.$axios.authInstance().post('product', payload).then(res=>{
            this.$notify({ type: 'success', title: 'success', message: 'product added' })
            this.loading = false
            this.pushToProducts(res.data)
            this.popProduct()
            this.resetForm()
        }).catch(err=>{
            this.loading = false
            this.$notify({ type: 'error', title: 'Error', message: err_Msg() })
            console.log(err)
        })
    },
    updateProduct(){
        const payload = this.prepareFormData()
        this.loading = true
        this.$axios.authInstance().patch(`product/${this.id}`, payload).then(res=>{
            this.$notify({ type: 'success', title: 'success', message: 'Product updated' })
            this.loading = false
            this.editProduct(this.id,this.product)
            this.$router.back()
        }).catch(err=>{
            this.loading = false
            this.$notify({ type: 'error', title: 'Error', message: err_Msg()})
            console.log(err)
        })
    }
    }
}
</script>
<style scoped>
.space-between{
    display: flex;
    flex-direction: row;
    justify-content: space-between;
}
.descr-btn{
    width: 50%;
}
@media(max-width: 700px){
    .space-between{
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }
    .descr-btn{
        width: 100%;
    }
}
</style>
