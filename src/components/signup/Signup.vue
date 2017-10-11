<template>
  <el-row class="content">
    <el-col :xs="24" :sm="{span: 6,offset: 9}">
      <span class="title">
       欢迎注册
      </span>
      <el-row>
        <el-input
          v-model.trim="username"
          placeholder="用户名"
          type="text"
          @blur="checkUsername()">
        </el-input>
        <el-input
          v-model.trim="password"
          placeholder="密码"
          type="password"
          @blur="checkPassword()">
        </el-input>
        <el-input
          v-model.trim="repassword"
          placeholder="确认密码"
          type="password"
          @blur="checkRepassword()">
        </el-input>
        <el-input
          v-model.trim="email"
          placeholder="电子邮箱"
          type="email"
          @blur="checkEmail()">
        </el-input>
        <el-input
          v-model.trim="tel"
          placeholder="手机号"
          max-length="11"
          min-length="11"
          type="number"
          @blur="checkTel()">
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
        <el-button @click="signup()">注册</el-button>
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
        username: '',
        password: '',
        repassword: '',
        email: '',
        tel: '',
        remember: true,
      };
    },
    methods: {
      async checkUsername() {
        const username = this.username;
        if (username.length < 2 || username.length > 20) {
          this.$message.error('请输入长度为2-20的用户名');
          return false;
        }
        const onlyNumReg = /^[0-9]*$/;
        if (onlyNumReg.test(username)) {
          this.$message.error('用户名不能为纯数字');
          return false;
        }
        const usernameReg = /^[\u4E00-\u9FA5A-Za-z0-9_]+$/;
        if (!(usernameReg.test(username))) {
          this.$message.error('用户名只能包含汉字、英文、数字、下划线');
          return false;
        }
        try {
          const res = await this.$http.get(`/api/user/check/username/${username}`);
          if (res.data.isUsed) {
            this.$message.error(res.data.msg);
            return false;
          }
          return true;
        } catch (err) {
          this.$message.error('网络似乎有些问题...');
          return false;
        }
      },
      async checkPassword() {
        const password = this.password;
        const repassword = this.repassword;
        if (password.length < 6 || password.length > 20) {
          this.$message.error('请输入长度为6-20位的密码');
          return false;
        }
        const passwordReg = /^[!#$%&*+,\-./?@_`|~A-Za-z0-9]{6,20}$/;
        if (!passwordReg.test(password)) {
          this.$message.error('密码仅能包含英文、数字以及 !#$%&*+,-./?@_`|~ 字符');
          return false;
        }
        if (repassword !== '') {
          const isSame = await this.checkRepassword();
          return isSame;
        }
        return true;
      },
      async checkRepassword() {
        const password = this.password;
        const repassword = this.repassword;
        if (password === '') {
          this.$message.error('请先输入密码');
          return false;
        }
        if (repassword !== password) {
          this.$message.error('密码不一致');
          return false;
        }
        return true;
      },
      async checkEmail() {
        const email = this.email;
        const emailReg = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
        if (!emailReg.test(email)) {
          this.$message.error('请输入正确的Email地址');
          return false;
        }
        try {
          const res = await this.$http.get(`/api/user/check/email/${email}`);
          if (res.data.isUsed) {
            this.$message.error(res.data.msg);
            return false;
          }
          return true;
        } catch (err) {
          this.$message.error('网络似乎有些问题...');
          return false;
        }
      },
      async checkTel() {
        const tel = this.tel;
        const telReg = /^1[3|4|5|7|8][0-9]{9}$/;
        if (!telReg.test(tel)) {
          this.$message.error('请输入正确的手机号');
          return false;
        }
        try {
          const res = await this.$http.get(`/api/user/check/tel/${tel}`);
          if (res.data.isUsed) {
            this.$message.error(res.data.msg);
            return false;
          }
          return true;
        } catch (err) {
          this.$message.error('网络似乎有些问题...');
          return false;
        }
      },
      async signup() {
        const isUserValid = await this.checkUsername();
        const isPasswordValid = await this.checkPassword();
        const isRepasswordValid = await this.checkRepassword();
        const isEmailValid = await this.checkEmail();
        const isTelValid = await this.checkTel();
        const checkArr = [isUserValid, isPasswordValid, isRepasswordValid, isEmailValid, isTelValid];
        Promise.all(checkArr)
          .then((res) => {
            console.log(res);
            if (res.indexOf(false) === -1) {
              const userInfo = {
                username: this.username,
                password: this.password,
                email: this.email,
                tel: this.tel,
              };
              return this.$http.post('/api/user/signup', userInfo);
            }
            return false;
          }, (err) => {
            console.log(err);
            return false;
          })
          .then((res) => {
            console.log(res);
            if (res.data.success) {
              this.$message({
                type: 'success',
                message: '注册成功！',
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
            console.log(err);
            return false;
          });
      },
    },
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  @import "Signup.Scss";
</style>
