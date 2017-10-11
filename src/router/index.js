import Vue from 'vue';
import Router from 'vue-router';
import Login from '@/components/login/Login';
import TodoList from '@/components/todo-list/TodoList';
import Signup from '@/components/signup/Signup';

Vue.use(Router);

export default new Router({
  mode: 'history',
  base: __dirname,
  routes: [
    {
      path: '/',
      component: Login,
    }, {
      path: '/todolist',
      component: TodoList,
    }, {
      path: '/signup',
      component: Signup,
    }, {
      path: '*',
      redirect: '/',
    },
  ],
});
