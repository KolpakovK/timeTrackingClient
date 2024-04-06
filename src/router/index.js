import { createRouter, createWebHistory} from "vue-router"

import Projects from "../screens/Projects.vue"
import Tasks from "../screens/Tasks.vue"
import Tracking from "../screens/Tracking.vue"
import Login from "../screens/Login.vue"
import ReportScreen from "../screens/ReportScreen.vue"


const router = createRouter({
    history: createWebHistory(),
    routes:[
        {
            path: "/projects",
            component: Projects
        },
        {
            path: "/tasks",
            component: Tasks
        },
        {
            path: "/",
            component: Tracking
        },
        {
            path: "/reports",
            component: ReportScreen
        },
        {
            path: "/login",
            component: Login
        },
    ]
})

export default router