
<template>
  <div class="layout">
    <layout-common></layout-common>
    <div class="layout-content">
      <Content :style="{padding: '8px', minHeight: '280px',height:'100%'}">
        <Row>
          <Col span="8">
            <div style="padding: 10px;min-width: 380px;">
              <Card :bordered="false">
                <p slot="title">添加公司</p>
                <p><Form ref="formCompanyValidate" :model="formCompanyValidate" :rules="ruleValidate" :label-width="80" >
                    <FormItem label="派遣公司" prop="company">
                      <Input v-model="formCompanyValidate.company" placeholder="请输入要添加的公司"></Input>
                    </FormItem>
              </Form></p>
               <p><div>
                <Button type="primary" @click="handleCompanySubmit('formCompanyValidate')">提交</Button>
                <Button @click="handleReset('formCompanyValidate')" style="margin-left: 8px">重置</Button>
              </div></p>
              </Card>
            </div>
          </Col>
        </Row>
        <Row>
          <Col span="8">
            <div style="padding: 10px;min-width: 380px;">
              <Card :bordered="false">
                <p slot="title">添加用户</p>
                <p><Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80" >
                    <FormItem label="登陆名" prop="loginName">
                      <Input v-model="formValidate.loginName" placeholder="输入用户登陆的名字(只能输入字母)"></Input>
                    </FormItem>
                    <FormItem label="用户名" prop="userName">
                      <Input v-model="formValidate.userName" placeholder="输入用户显示的名字(可以是中文)"></Input>
                    </FormItem>
                    <FormItem label="密码" prop="password1">
                      <Input type="password" v-model="formValidate.password1" placeholder="输入用户登陆的密码"></Input>
                    </FormItem>
                    <FormItem label="确认密码" prop="password2">
                      <Input type="password" v-model="formValidate.password2" placeholder="再次输入用户登陆的密码"></Input>
                    </FormItem>
                    <FormItem label="公司选择" prop="companyId">
                      <Select v-model="formValidate.companyId"  placeholder="选择使用该账号的公司">
                        <Option v-for="item in companyList" :value="item.id" :key="item.name">{{ item.name }}</Option>
                      </Select>
                    </FormItem>
                    <FormItem label="权限" prop="role">
                      <RadioGroup v-model="formValidate.role" style="float: left;white-space: nowrap">
                        <Radio label="admin">管理员</Radio>
                        <Radio label="general">普通</Radio>
                      </RadioGroup>
                    </FormItem>
                </Form></p>
                <p><div>
                <Button type="primary" @click="handleSubmit('formValidate')">提交</Button>
                <Button @click="handleReset('formValidate')" style="margin-left: 8px">重置</Button>
              </div></p>
              </Card>
            </div>
          </Col>
        </Row>
      </Content>
    </div>
    <div class="layout-foot">@一根网线丶 2018-2019 </div>
  </div>
</template>

<script>
  import layoutCommon from "@/components/common";

  export default {
    components: {
      layoutCommon,
    },
    created() {
      this.initSelectData();
    },
    data () {
      return {
        split2:0.5,
        companyList:[],
        formCompanyValidate:{
          company:"",
        },
        formValidate: {
          loginName: '',
          userName: '',
          password1: '',
          password2: '',
          companyId: '',
          role: 'general',
        },
        ruleValidate: {
          loginName: [
            { required: true, message: '登陆名不能为空', trigger: 'blur' }
          ],
          userName: [
            { required: true, message: '用户名不能为空', trigger: 'blur' }
          ],
          password1: [
            { required: true, message: '密码不能为空', trigger: 'change' }
          ],
          password2: [
            { required: true, message: '密码不能为空', trigger: 'change' }
          ],
          company: [
            { required: true, message: '公司名不能为空', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      handleSubmit (name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            if(this.formValidate.password1 != this.formValidate.password2) {
              this.$Message.error('两次密码输入不一致');
              return;
            }
            this.$http.post('/api/user/addUser', {
              loginName: this.formValidate.loginName,
              userName: this.formValidate.userName,
              password: this.formValidate.password1,
              companyId:this.formValidate.companyId,
              role: this.formValidate.role,
            },{}).then((response) => {
              if(response.ok) {
                this.$Message.success('员工信息录入成功!');
                this.$refs['formValidate'].resetFields();
              }
            })
          }else {
            this.$Message.error('请输入必填项!');
          }
        })
      },
      handleCompanySubmit(name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            this.$http.post('/api/user/addCompany', {
              name: this.formCompanyValidate.company,
            },{}).then((response) => {
                if(response.ok) {
                this.$Message.success('公司信息录入成功!');
                this.initSelectData();
                this.$refs['formCompanyValidate'].resetFields();
              }
            })
          }else {
            this.$Message.error('请输入必填项!');
          }
        })
      },
      handleReset (name) {
        this.$refs[name].resetFields();
      },
      initSelectData() {
        this.$http.post('/api/user/getCompany', {},{}).then((response) => {
          if(response.ok) {
            this.companyList = response.body;
          }
        })
      }
    }
  }
</script>

