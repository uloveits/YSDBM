<style scoped>
  .layout-common{
    border: 1px solid #d7dde4;
    background: #f5f7f9;
    position: relative;
    border-radius: 4px;
    overflow: hidden;
    height: 100%;
  }
  .layout-logo{
    width: 32px;
    height: 32px;
    background: url('../assets/ys_logo.png')no-repeat;
    border-radius: 3px;
    float: left;
    position: relative;
    top: 16px;
    left: 20px;
  }
  .layout-nav{
    width: 420px;
    margin: 0 auto;
    margin-right: 20px;
  }
</style>
<template>
  <div class="layout-common">
    <Layout style="height: 100%">
      <Header>
        <Menu mode="horizontal" theme="dark" active-name="1">
          <div class="layout-logo"></div>
          <div style="color: #FFF;float: left;padding-top: 2px;margin-left: 38px;font-size: 23px;">雅森人力管理平台</div>
          <div class="layout-nav">
            <div class="user-dropdown-menu-con">
              <Row type="flex" justify="end" align="middle" class="user-dropdown-innercon">
                <Dropdown transfer trigger="click" @on-click="handleClickUserDropdown">
                  <a href="javascript:void(0)" style="color: #ffffff">
                    <span class="main-user-name">{{ userName }}</span>
                    <Icon type="arrow-down-b"></Icon>
                  </a>
                  <DropdownMenu slot="list">
                    <DropdownItem name="editPswd">修改密码</DropdownItem>
                    <DropdownItem name="loginOut" divided>退出登录</DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </Row>
            </div>
          </div>
        </Menu>
      </Header>
      <Layout>
        <Sider hide-trigger :style="{background: '#fff'}">
          <Menu :active-name="activeName" theme="primary" @on-select="turnUrl" width="auto" :open-names="openName">
            <Submenu name="1" v-show="showRole">
              <template slot="title">
                <Icon type="ios-navigate"></Icon>
                权限管理
              </template>
              <MenuItem name="1-1">新建用户</MenuItem>
              <MenuItem name="1-2">用户一览</MenuItem>
            </Submenu>
            <Submenu name="2">
              <template slot="title">
                <Icon type="ios-keypad"></Icon>
                员工管理
              </template>
              <MenuItem name="2-1">新建员工</MenuItem>
              <MenuItem name="2-2">员工一览</MenuItem>
            </Submenu>
          </Menu>
        </Sider>
      </Layout>
    </Layout>
    <Modal
      v-model="pswdModal"
      title="修改密码">
      <p>
        <Form ref="formEditPsd" :model="formEditPsd" :rules="rulePsd" :label-width="82">
          <FormItem label="原密码" prop="oldPsd">
            <Input v-model="formEditPsd.oldPsd" type="password"></Input>
          </FormItem>
          <FormItem label="新密码" prop="newPsd1">
            <Input v-model="formEditPsd.newPsd1" type="password"></Input>
          </FormItem>
          <FormItem label="确认新密码" prop="newPsd2">
            <Input v-model="formEditPsd.newPsd2" type="password"></Input>
          </FormItem>
        </Form>
      </p>
      <div slot="footer">
        <Button type="text" size="large" @click="modalCancel">取消</Button>
        <Button type="primary" size="large" @click="modalOk">确定</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  export default {
    created(){
      this.init();
    },
    data() {
      return {
        userName:'',
        activeName:'',
        openName:[],
        showRole:'',
        pswdModal:false,
        formEditPsd:{
          oldPsd:'',
          newPsd1:'',
          newPsd2:'',
        },
        rulePsd: {
          oldPsd: [
            { required: true, message: '请输入旧密码', trigger: 'blur' }
          ],
          newPsd1: [
            { required: true, message: '请输入新密码', trigger: 'blur' },

          ],
          newPsd2: [
            { required: true, message: '请再次输入新密码', trigger: 'blur' },

          ],
        }
      }
    },
    methods:{
      init() {
        //当前登陆的用户名
        this.userName = this.$store.state.user.userName;
        //根据权限是否显示权限管理
        this.showRole = this.$store.state.user.role == 0 ? true :false;

        //配置url和选中模块保持一致
        var url = window.location.href;
        console.log(url);
        if (url.endsWith("/addUser")) {
          if(this.$store.state.user.role != 0 ) {
            this.$router.push({path:'/403'});
          }
          this.openName = ['1'];
          this.activeName = "1-1";
        }
        if (url.endsWith("/userList")) {
          if(this.$store.state.user.role != 0 ) {
            this.$router.push({path:'/403'});
          }
          this.openName = ['1'];
          this.activeName = "1-2";
        }
        if (url.endsWith("/addStaff")) {
          this.openName = ['2'];
          this.activeName = "2-1";
        }
        if (url.endsWith("/staffList")) {
          this.openName = ['2'];
          this.activeName = "2-2";
        }
      },
      turnUrl(name) {
        switch (name) {
          case '1-1' :
            this.$router.push({path:'/addUser'});
            break;
          case '1-2' :
            this.$router.push({path:'/userList'});
            break;
          case '2-1' :
            this.$router.push({path:'/addStaff'});
            break;
          case '2-2' :
            this.$router.push({path:'/staffList'});
            break;
        }
      },
      handleClickUserDropdown(DropdownItem){
        switch (DropdownItem) {
          case "editPswd" :
              this.pswdModal = true;
            break;
          case "loginOut" :
            this.$Modal.confirm({
              title: '提示',
              content: `<div class="modal-bd modal-bd2">
                        <p>确定退出登陆？</p><br>
                     </div>`,
              onOk:() => {
                this.$store.commit('del_token');
                location.reload();
              }
            });
            break;
        }
      },
      modalCancel(){this.pswdModal = false;},
      modalOk(){
        this.$refs['formEditPsd'].validate((valid) => {
          if (valid) {
            //判断两次输入的新密码是否一致
            if(this.formEditPsd.newPsd1 != this.formEditPsd.newPsd2) {
              this.$Message.error('两次新密码输入不一致');
              return;
            }
            //判断原密码是否正确
            let userId =  this.$store.state.user.id;
            console.log(userId);
            this.$http.post('/api/user/getUserInfoById', {
              id: userId,
              password:this.formEditPsd.oldPsd,
            },{}).then((response) => {
              if(response.ok) {
              console.log(response.body);
              if(response.body.length > 0) {
                //更新密码
                this.updatePassword();
              }else{
                this.$Message.error('原密码不正确！！');
              }
            }
          })
        }
       })
      },
     updatePassword() {
      let userId =  this.$store.state.user.id;
      this.$http.post('/api/user/updatePassword', {
        id: userId,
        pswd:this.formEditPsd.newPsd1,
      },{}).then((response) => {
        if(response.ok) {
         this.$Message.success('密码修改成功！！');
         this.$router.push({path:'/login'});
        }
      })
     },
    }

  }
</script>
