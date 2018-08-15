<style lang="less">
  @import './login.less';
</style>

<template>
  <div class="login" @keydown.enter="handleSubmit">
    <div class="login-con">
      <Card :bordered="false">
        <p slot="title">
          <Icon type="log-in"></Icon>
          欢迎登录
        </p>
        <div class="form-con">
          <Form ref="loginForm" :model="form" :rules="rules">
            <FormItem prop="userName">
              <Input v-model="form.userName" placeholder="请输入用户名">
                <span slot="prepend">
                    <Icon :size="16" type="person"></Icon>
                </span>
              </Input>
            </FormItem>
            <FormItem prop="password">
              <Input type="password" v-model="form.password" placeholder="请输入密码">
                <span slot="prepend">
                    <Icon :size="14" type="locked"></Icon>
                </span>
              </Input>
            </FormItem>
            <FormItem>
              <Button @click="handleSubmit" type="primary" long>登录</Button>
            </FormItem>
          </Form>
          <p v-show="showFlag" style="color: red">您输入的用户名或者密码不正确</p>
        </div>
      </Card>
    </div>
  </div>
</template>

<script>
  import Cookies from 'js-cookie';
  export default {
    data () {
      return {
        showFlag:false,
        form: {
          userName: '',
          password: ''
        },
        rules: {
          userName: [
            { required: true, message: '账号不能为空', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '密码不能为空', trigger: 'blur' }
          ]
        }
      };
    },
    methods: {
      handleSubmit () {
        this.$refs.loginForm.validate((valid) => {
          console.log(valid);
          if (valid) {
  /*          Cookies.set('user', this.form.userName);
            Cookies.set('password', this.form.password);*/

       /*     if (this.form.userName === 'iview_admin') {
              Cookies.set('access', 0);
            } else {
              Cookies.set('access', 1);
            }*/
            this.$http.post('/api/user/getUserInfoByLogin', {
              loginName: this.form.userName,
              password:this.form.password,
            },{}).then((response) => {
              console.log(response.data);
              if(response.data.token) {
                this.$store.commit('set_token',response.data.token );
                this.$router.push('/staffList');
              }else {
                this.showFlag = true;
              }
           })
          }
        });
      }
    }
  };
</script>
