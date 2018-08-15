
<template>
  <div class="layout">
    <layout-common></layout-common>
    <div class="layout-content">
      <Content :style="{padding: '8px', minHeight: '280px',height:'100%'}">
        <Row>
          <Col span="8">
            <div style="padding: 10px;min-width: 380px;">
              <Card :bordered="false">
                <p slot="title">添加员工</p>
                <p><Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">

                    <FormItem label="姓名" prop="name">
                      <Input v-model="formValidate.name" placeholder="请输入姓名"></Input>
                    </FormItem>

                    <FormItem label="性别" prop="sex">
                      <RadioGroup v-model="formValidate.sex" style="float: left;white-space: nowrap">
                        <Radio label="男">男</Radio>
                        <Radio label="女">女</Radio>
                      </RadioGroup>
                    </FormItem>

                    <FormItem label="年龄" prop="age">
                      <Input v-model="formValidate.age" placeholder="请输入年龄"></Input>
                    </FormItem>

                    <FormItem label="电话" prop="phone">
                      <Input v-model="formValidate.phone" placeholder="请输入电话号码"></Input>
                    </FormItem>

                    <FormItem label="出生地址" prop="address">
                      <Input v-model="formValidate.address" placeholder="请输入出生地址"></Input>
                    </FormItem>

                    <FormItem label="派遣公司" prop="toCompany">
                      <Select v-model="formValidate.companyId"  placeholder="选择使用该账号的公司">
                        <Option v-for="item in companyList" :value="item.id" :key="item.name">{{ item.name }}</Option>
                      </Select>
                    </FormItem>
                    <Row>
                      <Col span="12">
                        <FormItem label="开始日期" prop="startTime">
                          <DatePicker type="date" placeholder="选择日期" v-model="formValidate.startTime" style="float: left;white-space: nowrap"></DatePicker>
                        </FormItem>
                      </Col>
                      <Col span="12">
                        <FormItem label="结束日期" prop="endTime">
                          <DatePicker type="date" placeholder="选择日期" v-model="formValidate.endTime" style="float: left;white-space: nowrap"></DatePicker>
                        </FormItem>
                      </Col>
                    </Row>
                    <FormItem label="备注" prop="note">
                      <Input v-model="formValidate.note" type="textarea" :autosize="{minRows: 3,maxRows: 5}" placeholder="请输入备注信息"></Input>
                    </FormItem>
              </Form></p>
                <p>
                  <Button type="primary" @click="handleSubmit('formValidate')">提交</Button>
                  <Button @click="handleReset('formValidate')" style="margin-left: 8px">重置</Button>
              </p>
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
    data () {
      return {
        companyList:[],
        formValidate: {
          name: '',
          sex: '男',
          age: '',
          phone: '',
          address: '',
          companyId: '',
          startTime: '',
          endTime: '',
          note: ''
        },
        ruleValidate: {
          name: [
            { required: true, message: '姓名为必填项', trigger: 'blur' }
          ],
          age: [
            { required: true, message: '年龄为必填项', trigger: 'blur' },

          ],
          phone: [
            { required: true, message: '电话号码为必填项', trigger: 'blur' },

          ],
          address: [
            { required: true, message: '出生地址为必填项', trigger: 'blur' }
          ],
        }
      }
    },
    methods: {
      handleSubmit (name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            if(this.$store.state.user.role != 0){
              this.$Message.error('您没有权限添加员工!');
              return;
            }
            let startTime = this.formValidate.startTime == "" ? null :this.dateFormat("yyyy-MM-dd hh:mm:ss", new Date(this.formValidate.startTime));
            let endTime = this.formValidate.endTime == "" ? null :this.dateFormat("yyyy-MM-dd hh:mm:ss", new Date(this.formValidate.endTime));

            this.$http.post('/api/staff/addStaff', {
              name:  this.formValidate.name,
              sex: this.formValidate.sex,
              age: this.formValidate.age,
              phone: this.formValidate.phone,
              address: this.formValidate.address,
              toCompany: this.formValidate.companyId,
              startTime:startTime ,
              endTime: endTime,
              note: this.formValidate.note,
              currUser:this.$store.state.user.userName,
            },{}).then((response) => {
                if(response.ok) {
                  this.$Message.success('用户信息录入成功!');
                  this.$refs['formValidate'].resetFields();
              }
            })
          }
      })
      },
      handleReset (name) {
        this.$refs[name].resetFields();
      },
      initSelectData() {
        this.$http.post('/api/user/getCompany', {},{}).then((response) => {
          if(response.ok) {
            console.log(response.body);
            this.companyList = response.body;
          }
        })
      },
      dateFormat(fmt,date) {
        var o = {
          "M+" : date.getMonth()+1,                 //月份
          "d+" : date.getDate(),                    //日
          "h+" : date.getHours(),                   //小时
          "m+" : date.getMinutes(),                 //分
          "s+" : date.getSeconds(),                 //秒
          "q+" : Math.floor((date.getMonth()+3)/3), //季度
          "S"  : date.getMilliseconds()             //毫秒
        };
        if(/(y+)/.test(fmt))
          fmt=fmt.replace(RegExp.$1, (date.getFullYear()+"").substr(4 - RegExp.$1.length));
        for(var k in o)
          if(new RegExp("("+ k +")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
        return fmt;
      },
    },
    watch: {},
    created() {
      this.initSelectData();
    }
  };
</script>

<style scoped>
  .ivu-form-item {
    margin-bottom: 20px;
  }
</style>
