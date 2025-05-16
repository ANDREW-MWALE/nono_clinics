<!--THIS PAGE IS GOING TO BE USED TO CREATE SUPPLERS-->
<template>
    <div class="form-container">
        <form @submit-prevent="addSuppler">
         <div class="form-group">
         <input type="text" name="supplier_name" v-model="supplier_name">
         </div>
         <div class="form-group">
         <input type="text" name="supplier_name" v-model="supplier_name">
         </div>
        </form>

    </div>
</template>
<script>
export default{
    data(){
        return{
        //THIS IS GOING TO HAND THE SUBMISSION OF THE FORM
            supplier_name: '',

        };
    },
    methods:{
        addSuppler(){
             this.suppler.push({
       

        })
        //HERE WILL HAVE THE METHOD TO CLEAR THE FORM AFTER SUBMISION
    }
    }
}
</script>