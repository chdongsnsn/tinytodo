<template>
  <el-row class="content">
    <el-col :xs="24" :sm="{span: 6,offset: 9}">
      <span class="title">
       欢迎登录
      </span>
      <el-row>
        <el-input
          v-model="account"
          placeholder="用户名/手机/邮箱"
          type="text">
        </el-input>
        <el-input
          v-model="password"
          placeholder="密码"
          type="password"
          @keyup.enter.native="loginTodo">
        </el-input>
        <div class="remember">
          <el-switch
            class="remember-btn"
            v-model="remember"
            on-color="#1D8CE0"
            off-color="#E5E9F2">
          </el-switch>
          <span>下次直接登录</span>
        </div>
        <el-button @click="loginTodo">登录</el-button>
      </el-row>
    </el-col>
  </el-row>
</template>

<script>
  import bus from '@/assets/eventBus';

  export default {
    created() {
      bus.$emit('pageChange', this.$route.path);
    },
    data() {
      return {
        account: '',
        password: '',
        remember: true,
      };
    },
    methods: {
      loginTodo() {
        const obj = {
          account: this.account,
          password: this.password,
        };
        this.$http.post('api/user/login', obj)
          .then((res) => {
            if (res.data.success) {
              this.$message({
                type: 'success',
                message: '登录成功！',
              });
              if (this.remember) {
                localStorage.setItem('USERINFO', JSON.stringify(res.data.userInfo));
              } else {
                sessionStorage.setItem('USERINFO', JSON.stringify(res.data.userInfo));
              }
              this.$router.push('/todolist');
            } else {
              this.$message.error(res.data.msg);
            }
          }, (err) => {
            this.$message.error('网络似乎出问题了...');
            console.log(err);
          });
      },
    },
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  @import "Login.Scss";
</style>
