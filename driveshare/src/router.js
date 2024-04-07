import { createRouter, createWebHistory } from "vue-router";
import Homepage from "@/components/Homepage.vue";




const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: "/",
            name: "HomePage",
            component: Homepage,
        }
    ]
})

export default router;