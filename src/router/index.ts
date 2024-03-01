import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import JokesView from '../views/JokesView.vue'
import ProjectsView from '../views/ProjectsView.vue'
import GalleryView from '../views/GalleryView.vue'
import BlogView from '../views/BlogView.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/jokes',
    name: 'jokes',
    component: JokesView
  },
  {
    path: '/projects',
    name: 'projects',
    component: ProjectsView
  },
  {
    path: '/gallery',
    name: 'gallery',
    component: GalleryView
  },
  {
    path: '/blog',
    name: 'blog',
    component: BlogView
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
