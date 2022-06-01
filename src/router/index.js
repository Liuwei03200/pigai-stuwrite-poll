import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/write',
    name: 'Write',
    component:()=>import('../views/write')
  },{
    path: '/config',
    name: 'Config',
    component:()=>import('../views/config/index')
  },{
    path: '/config/write',
    name: 'ConfigWrite',
    component:()=>import('../views/config/write')
  },{
    path: '/task',
    name: 'Task',
    component:()=>import('../views/task/Index')
  },{
    path: '/task/publish',
    name: 'TaskPublish',
    component:()=>import('../views/task/Publish')
  },
  {
    path: '/taswrite',
    name: 'WriteTask',
    component:()=>import('../views/write/Task')
  },
]

const router = new VueRouter({
  routes
})

export default router
