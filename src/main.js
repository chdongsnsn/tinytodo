// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import { Row, Col, Message, MessageBox, Button, Switch, Input, Icon, Tabs, TabPane } from 'element-ui';
import Axios from 'axios';
import 'element-ui/lib/theme-default/index.css';

import App from './App';
import router from './router';

Vue.config.productionTip = false;
Vue.use(Row);
Vue.use(Col);
Vue.use(Button);
Vue.use(Switch);
Vue.use(Input);
Vue.use(Icon);
Vue.use(Tabs);
Vue.use(TabPane);

Vue.prototype.$message = Message;
Vue.prototype.$confirm = MessageBox.confirm;
Vue.prototype.$http = Axios;

router.beforeEach((to, from, next) => {
  let token = null;
  if (sessionStorage.getItem('USERINFO')) {
    ({ token } = JSON.parse(sessionStorage.getItem('USERINFO')));
  } else if (localStorage.getItem('USERINFO')) {
    ({ token } = JSON.parse(localStorage.getItem('USERINFO')));
  }
  if (to.path === '/') { // 跳转至登陆页
    if (token && token !== 'null' && token !== null) {
      next('/todolist'); // 如果有token就转向todolist不返回登录页
    }
    next();
  } else if (to.path === '/signup') {
    sessionStorage.clear();
    localStorage.clear();
    next();
  } else {
    /* eslint-disable */
    if (token && token !== 'null' && token !== null) {
      Vue.prototype.$http.defaults.headers.common['Authorization'] = `Bearer ${token}`;// 全局设定 token
      next(); // 如果有 token 就执行跳转
    } else {
      next('/'); // 如果没有 token 就返回登录页
    }
  }
});

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App },
});
