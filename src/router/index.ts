import { createRouter, createWebHashHistory, NavigationGuardNext, RouteLocationNormalized, RouteRecordRaw } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import JokesView from '../views/JokesView.vue'
import ProjectsView from '../views/ProjectsView.vue'
import GalleryView from '../views/GalleryView.vue'
import BlogView from '../views/BlogView.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Paul',
    component: HomeView
  },
  {
    path: '/jokes',
    name: 'Jokes',
    component: JokesView
  },
  {
    path: '/projects',
    name: 'Projects',
    component: ProjectsView
  },
  {
    path: '/gallery',
    name: 'Gallery',
    component: GalleryView
  },
  {
    path: '/blog',
    name: 'Blog',
    component: BlogView
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

const DEFAULT_TITLE = 'Paul'
router.beforeEach((to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
  document.title = to.name?.toString() || DEFAULT_TITLE
  next()
})

export default router
