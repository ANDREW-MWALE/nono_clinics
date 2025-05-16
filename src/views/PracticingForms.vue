<template>
    <div>
       <form @submit.prevent="handleSubmit">
        <div class="form-group">
            <label for="name"></label>
            <input
             type="text" 
            id="name"
            v-model="FormData.name" 
            placeholder="Enter patients name"
            required
            >
        </div>
        
       </form>
    </div>
</template>
<script>


export default {
    data(){
        return{
            name: ""
        }
    },
    methods: {
        handleSubmit(){
            this.$emit("submit-patient", {...this.FormData})
        }
    }
}
</script>