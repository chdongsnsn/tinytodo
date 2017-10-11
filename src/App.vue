<template>
  <div id="app">
    <div class="links">
      <span v-if="page == '/signup'" @click="backLogin()">返回登录</span>
      <span v-if="page == '/'" @click="goSignup()">用户注册</span>
      <span v-if="page == '/todolist'" @click="quit()">安全退出</span>
    </div>
    <img class="logo-main" src="./assets/logo.png">
    <img class="logo-sub" src="./assets/logo.png">
    <router-view></router-view>
  </div>
</template>

<script>
  import bus from '@/assets/eventBus';

  export default {
    name: 'app',
    created() {
      bus.$on('pageChange', (page) => {
        this.page = page;
        switch (page) {
          case '/':
            document.title = '欢迎登录TinyTodo';
            break;
          case '/signup':
            document.title = '用户注册';
            break;
          case '/todolist':
            document.title = '我的待办';
            break;
          default:
            document.title = '登录TinyTodo';
            break;
        }
      });
    },
    data() {
      return {
        page: '',
      };
    },
    methods: {
      backLogin() {
        this.$router.push('/');
      },
      goSignup() {
        this.$router.push('/signup');
      },
      quit() {
        localStorage.removeItem('USERINFO');
        sessionStorage.removeItem('USERINFO');
        this.$router.push('/');
      },
    },
  };
</script>

<style>
  #app{
    font-family:'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing:antialiased;
    -moz-osx-font-smoothing:grayscale;
    text-align:center;
    color:#2c3e50;
    margin-top:60px;
  }
  .logo-main{
    width:180px;
  }
  .logo-sub{
    display:none;
    width:50px;
    margin:0 auto 20px;
  }
  .links{
    float:left;
    margin:-50px 0 0 20px;
    cursor: pointer;
    font-size:14px;
    color:#58B7FF;
  }
  @media all and (max-width:767px) {
    .logo-sub{
      display:block;
    }
    .logo-main{
      display:none;
    }
    .links{
      margin-left:10px;
    }
  }
</style>
