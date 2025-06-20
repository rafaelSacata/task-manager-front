import { createRouter, createWebHistory } from 'vue-router';
import LoginForm from '@/components/auth/LoginForm.vue';
import TaskList from '@/components/tasks/TaskList.vue';
import SignOn from '@/components/auth/SignOn.vue';

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/register', component: SignOn },
  { path: '/login', component: LoginForm },
  { path: '/tasks', component: TaskList, meta: { requiresAuth: true } },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token');
  if (to.matched.some(record => record.meta.requiresAuth) && !token) {
    next('/login');
  } else {
    next();
  }
});

export default router;