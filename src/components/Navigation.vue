<template>
    <!-- Navigation -->
    <div class=" p-3 flex gap-8 items-center justify-between">
        <!-- Logo -->
        <div class=" flex items-center gap-2">
            <img src="../assets/Logo.svg" alt="Logo" class=" w-7 h-7">
            <p class=" font-bold text-gray-900">Time Tracking</p>
        </div>
        
        <!-- Navs -->
        <div class="flex gap-8 items-center" >
            
            <vueButton variant="link" icon="ri-time-line" @click="this.$router.push('/');">
                <template #button-content>
                    Tracking
                </template>
            </vueButton>
            
            <vueButton variant="link" icon="ri-task-line" @click="this.$router.push('/tasks');">
                <template #button-content>
                    Tasks
                </template>
            </vueButton>
            
            <vueButton variant="link" icon="ri-folder-2-line" @click="this.$router.push('/projects');">
                <template #button-content>
                    Projects
                </template>
            </vueButton>
            
            <vueButton variant="link" icon="ri-file-chart-line" @click="this.$router.push('/reports');">
                <template #button-content>
                    Reports
                </template>
            </vueButton>
            
        </div>
        
        <!-- Navs -->
        <div class="flex gap-8 items-center">
            
            <vueButton variant="link" icon="ri-group-line">
                <template #button-content>
                    Team
                </template>
            </vueButton>
            
            <vueButton variant="neutral" icon="ri-logout-box-line" @clicked="logoutFromUI()">
                <template #button-content>
                    Log out
                </template>
            </vueButton>
            
        </div>
        
    </div>
</template>

<script>
import { logOut } from '../auth/auth';


export default {
    methods: {
        logoutFromUI(){
            logOut();
        }
    }
}
</script>