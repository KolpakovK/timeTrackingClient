<template>
    <div class=" flex-1 flex justify-center items-center">
        <div class=" p-4 rounded-md bg-white flex flex-col gap-6 min-w-[450px]">
            <h1 class="font-bold text-2xl text-gray-900">Login form</h1>

            <form class="flex flex-col gap-4" @submit.prevent="login">
                <vueField name="username" labelText="User name"></vueField>
                <vueField name="password" type="password" labelText="Password"></vueField>

                <vueButton><template #button-content>Login</template></vueButton>
            </form>
        </div>
    </div>
</template>

<script>
import router from "../router"
import axios from 'axios';

export default{
    methods:{
        login(e){
            let data = {
                username:e.target.username.value,
                password:e.target.password.value,
            };

            axios.post('/api/auth/login', data, { 
                headers: {
                    'Access-Control-Allow-Origin': '*',
                }
            })
            .then(response => {
                localStorage.setItem('token', response.data.token);
                router.push('/projects')
            })
            .catch(error => { 
                // Handle login errors
            });
        }
    }
}

</script>
