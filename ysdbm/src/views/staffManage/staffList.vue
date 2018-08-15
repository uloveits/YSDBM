
<template>
  <div class="layout">
    <layout-common></layout-common>
    <div class="layout-content">
      <Content :style="{padding: '8px', minHeight: '280px', background: '#fff',height:'100%'}">
        <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
          <Row>
            <Col span="6">
              <FormItem label="姓名：" prop="name">
                <Input v-model="formValidate.name" placeholder="通过姓名检索"></Input>
              </FormItem>
            </Col>
            <Col span="6" v-show="isShowCompany">
              <FormItem label="派遣公司：" prop="toCompany">
                <Input v-model="formValidate.toCompany" placeholder="通过派遣公司检索"></Input>
              </FormItem>
            </Col>
            <Col span="6">
              <FormItem label="招聘专员：" prop="updateUser">
                <Input v-model="formValidate.updateUser" placeholder="通过招聘专员检索"></Input>
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="4">
              <FormItem label="入职日期：" prop="startTime">
                <DatePicker type="date" placeholder="选择日期" v-model="formValidate.startTime" style="float: left;white-space: nowrap"></DatePicker>
              </FormItem>
            </Col>
            <Col span="1" style="text-align: center">~</Col>
            <Col span="3">
              <DatePicker type="date" placeholder="选择日期" v-model="formValidate.endTime" style="float: left;white-space: nowrap"></DatePicker>
            </Col>
            <Col span="4">
              <FormItem label="人员状态：" prop="isWork">
                <CheckboxGroup v-model="formValidate.isWork" style="float: left;white-space: nowrap">
                  <Checkbox label="在职"></Checkbox>
                  <Checkbox label="离职"></Checkbox>
                </CheckboxGroup>
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="12">
              <div style="float: left">
                <Button type="primary" @click="handleSubmit('formValidate')">检索</Button>
                <Button @click="handleReset('formValidate')" style="margin-left: 8px">重置</Button>
              </div>
            </Col>
            <Col span="12">
              <div style="float: right"><Button type="primary" shape="circle" icon="social-html5" @click="exportExcel">导出Excel</Button></div>
            </Col>
          </Row>
        </Form>
        <Row>
          <Col span="24" style="margin-top:10px;">
            <Table  ref="table" border :columns="staffListColumns" :data="staffListData"  :height="tableHeight" size="small"></Table>
          </Col>
          <Col span="24" style="margin-top:10px;">
            <Page ref="pager" :total="pageTotal" :page-size="pageSize" :page-size-opts="pageSizeOpts" @on-change="pageChange" size="small"
                  @on-page-size-change="pageSizeChange" show-elevator show-total show-sizer></Page>
          </Col>
        </Row>
        <!--隐藏的编辑模态框-->
        <Modal
          v-model="editModal"
          title="编辑员工信息"
          @on-ok="editOkBtn">
          <p>
            <Form ref="formEditStaff" :model="formEditStaff" :label-width="60">
              <FormItem label="姓名" prop="editName">
                <Input v-model="formEditStaff.editStaffId" v-show="false"></Input>
                <Input v-model="formEditStaff.editName" disabled></Input>
              </FormItem>
              <FormItem label="姓别" prop="editSex">
                <RadioGroup v-model="formEditStaff.editSex" style="float: left;white-space: nowrap">
                  <Radio label="男" disabled>男</Radio>
                  <Radio label="女" disabled>女</Radio>
                </RadioGroup>
              </FormItem>
              <FormItem label="年龄" prop="editAge">
                <Input v-model="formEditStaff.editAge" disabled></Input>
              </FormItem>
              <FormItem label="电话" prop="editPhone">
                <Input v-model="formEditStaff.editPhone" disabled></Input>
              </FormItem>

              <FormItem label="出生地址" prop="editAddress">
                <Input v-model="formEditStaff.editAddress" disabled></Input>
              </FormItem>

              <FormItem label="派遣公司" prop="editToCompany">
                <Input v-model="formEditStaff.editToCompany" disabled></Input>
              </FormItem>
              <Row>
                <Col span="11">
                  <FormItem label="开始日期" prop="editStartTime">
                    <DatePicker type="date" v-model="formEditStaff.editStartTime" style="float: left;white-space: nowrap" disabled></DatePicker>
                  </FormItem>
                </Col>

                <Col span="11"  offset="2">
                  <FormItem label="结束日期" prop="editEndTime">
                    <DatePicker type="date" v-model="formEditStaff.editEndTime" style="float: left;white-space: nowrap" readonly></DatePicker>
                  </FormItem>
                </Col>
              </Row>
              <FormItem label="备注" prop="editNote">
                <Input v-model="formEditStaff.editNote" type="textarea" :autosize="{minRows: 3,maxRows: 5}"></Input>
              </FormItem>
            </Form>
          </p>
        </Modal>
      </Content>
    </div>
    <div class="layout-foot">@一根网线丶 2018-2019 </div>
  </div>
</template>

<script>
  import layoutCommon from "@/components/common";
  var M_STAFFLISTDATA = [];
  export default {
    components: {
      layoutCommon,
    },
    created() {
      this.initStaffListColumns();
      //根据权限是否能通过公司检索
      if(this.$store.state.user.role != 0){
        this.isShowCompany = false;
      }
    },
    mounted() {
      // 设置表格高度
      this.scrollBarResize();
    },
    data() {
      return {
        formValidate: {
          name: '',
          updateUser:'',
          toCompany: '',
          startTime: '',
          endTime: '',
          isWork: ['在职','离职'],
        },
        ruleValidate: {},
        staffListColumns:[],
        staffListData:[],
        tableHeight:'',
        isShowCompany:true,
        editModal: false,
        pageTotal:0,
        pageSize:20,
        pageSizeOpts:[20,50,100],

        formEditStaff: {
          editStaffId:"",
          editName:'',
          editSex:'',
          editAge:'',
          editPhone:'',
          editAddress:'',
          editToCompany:'',
          editStartTime:'',
          editEndTime:'',
          editNote:'',
        },
      };
    },
    methods: {
      scrollBarResize() {
        this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop - 310
      },
      initStaffListColumns() {
        let self = this;
        this.staffListColumns = [
          {
            title: '序号',
            width: 60,
            key:'no',
            align: 'center'
          },
          {
            title: '招聘专员',
            key: 'updateUser',
            render: (h, params) => {
              return h('div', {style:{color:'red'}}, self.staffListData[params.index].updateUser)
            }
          },
          {
            title: '姓名',
            key: 'name',
          },
          {
            title: '性别',
            key: 'sex',
          },
          {
            title: '年龄',
            key: 'age',
          },
          {
            title: '电话号码',
            key: 'phone',
          },
          {
            title: '地址',
            key: 'address',
          },
          {
            title: '派遣公司',
            key: 'companyName',
          },
          {
            title: '开始时间',
            key: 'startTime',
            render: function (h, params) {
              return h('div',
                self.staffListData[params.index].startTime == null ? "未开始" : self.dateFormat("yyyy-MM-dd", new Date(self.staffListData[params.index].startTime))
              );
            }
          },

          {
            title: '结束时间',
            key: 'endTime',
            render: function (h, params) {
              return h('div',
                self.staffListData[params.index].endTime == null ? "在职中" : self.dateFormat("yyyy-MM-dd", new Date(self.staffListData[params.index].endTime))
              );
            }
          },
          {
            title: '备注',
            key: 'note',
          },

          {
            title: '功能',
            width: 150,
            align: 'center',
            render: (h, params) => {
            return h('div', [
              h('Button', {
                props: {
                  type: 'error',
                  size: 'small'
                },
                on: {
                  click: () => {
                      if(self.staffListData[params.index].endTime  != null){
                        this.$Message.error('这个人都已经离职了！！！');
                      }else {
                        this.editStaffUser(self.staffListData[params.index].id);
                      }
                    }
                  }
                }, '编辑')
              ]);
            }
          }
        ]
      },
      handleSubmit (name) {
        this.$refs[name].validate((valid) => {
          console.log(valid);
          if (valid) {
            let toCompany = this.formValidate.toCompany;
            let startTime = this.formValidate.startTime == "" ? "2010-08-04" :this.dateFormat("yyyy-MM-dd", new Date(this.formValidate.startTime));
            let endTime = this.formValidate.endTime == "" ? "2039-08-04" :this.dateFormat("yyyy-MM-dd", new Date(this.formValidate.endTime));
            let isWork = this.formValidate.isWork;
            let workFlag = 1;

            if(isWork.length > 1) {
              workFlag = "";
            }else if(isWork.length == 0){
              this.$Message.error('在职还是离职人员？最起码选择一个吧！');
              return;
            }else if(isWork[0] == "在职") {
              workFlag = 0;
            }

            //分权限，role为0;
            let role = this.$store.state.user.role;
            if(role != 0) {
              toCompany = this.$store.state.user.companyName;
            }
            this.$http.post('/api/staff/getStaffBySearch', {
              name: "%"+ this.formValidate.name + "%",
              updateUser: "%"+ this.formValidate.updateUser +"%",
              toCompany: "%" + toCompany + "%",
              startTime: startTime  ,
              endTime: endTime ,
              isWork:"%"+ workFlag  +"%",
            },{}).then((response) => {
              console.log(response.body);
              let retData = response.body;
              for(let i= 0;i< retData.length;i++) {
                retData[i].no = i+1;
                retData[i].startTime = retData[i].startTime == null ? null : this.dateFormat("yyyy-MM-dd", new Date(retData[i].startTime));
                retData[i].endTime = retData[i].endTime == null ? null : this.dateFormat("yyyy-MM-dd", new Date(retData[i].endTime));
              }
              M_STAFFLISTDATA = retData;
              this.pageTotal = response.body.length;

              let staffList = [];
              var start = this.$refs.pager.currentPage * this.pageSize - this.pageSize;
              var end =(this.$refs.pager.currentPage * this.pageSize > this.pageTotal) ? this.pageTotal :this.$refs.pager.currentPage * this.pageSize;
              for( let i= start; i< end; i++) {
                staffList.push(retData[i]);
              }
              this.staffListData = staffList;
            })
          }
       })
      },
      pageChange(newPage) {
        let staffList = [];
        this.pageTotal = M_STAFFLISTDATA.length;

        var start = newPage * this.pageSize - this.pageSize;
        var end = (newPage * this.pageSize > this.pageTotal) ? this.pageTotal :newPage * this.pageSize;
        for( let i= start; i< end; i++) {
          staffList.push(M_STAFFLISTDATA[i]);
        }
        this.staffListData = staffList;
      },
      pageSizeChange(pageSize) {
        this.pageSize = pageSize;
        this.pageChange(this.$refs.pager.currentPage );
      },
      handleReset (name) {
        this.$refs[name].resetFields();
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
      //编辑按钮点击事件
      editStaffUser(staffId){
        this.editModal = true;
        this.formEditStaff.editStaffId = staffId;
        //通过id获取员工信息
        this.getStaffInfoById(staffId);
      },
      getStaffInfoById(staffId){
        this.$http.post('/api/staff/getStaffById', {
          id:staffId,
        },{}).then((response) => {
          console.log(response.body);
          this.formEditStaff.editName = response.body[0].name;
          this.formEditStaff.editSex = response.body[0].sex;
          this.formEditStaff.editAge = response.body[0].age;
          this.formEditStaff.editPhone = response.body[0].phone;
          this.formEditStaff.editAddress = response.body[0].address;
          this.formEditStaff.editToCompany = response.body[0].companyName;
          this.formEditStaff.editStartTime = response.body[0].startTime;
          this.formEditStaff.editEndTime = this.dateFormat("yyyy-MM-dd", new Date());
          this.formEditStaff.editNote = response.body[0].note;

        })
      },
      editOkBtn(){
        let editEndTime = this.dateFormat("yyyy-MM-dd", new Date(this.formEditStaff.editEndTime));

        this.$http.post('/api/staff/updateStaffById', {
          endTime:editEndTime,
          note:this.formEditStaff.editNote,
          id:this.formEditStaff.editStaffId,
        },{}).then((response) => {
          this.handleSubmit('formValidate');
        })
      },
      formatJson(filterVal, jsonData) {
        return jsonData.map(v => filterVal.map(j => v[j]))
      },
      //导出excel
      exportExcel(){
        const self = this;
        if(self.staffListData.length == 0){
          this.$Message.error('没有数据可以导出');
          return;
        }
        require.ensure([], () => {
          const { export_json_to_excel } = require('@/vendor/Export2Excel');
          const tHeader = [ '姓名', '性别','年龄','电话号码','地址','派遣公司','开始时间', '结束时间','备注','招聘专员'];
          const filterVal = [ 'name', 'sex', 'age', 'phone', 'address', 'companyName', 'startTime', 'endTime', 'note', 'updateUser'];
          const list = M_STAFFLISTDATA;
          const data = self.formatJson(filterVal, list);
          export_json_to_excel(tHeader, data, '员工列表_' + this.dateFormat("yyyy-MM-dd", new Date()));
        })
      },


    },
    watch: {},
    dispatch () {

    }

  };
</script>
<style scoped>
  .ivu-form-item {
   margin-bottom: 10px;
  }
  .ivu-col-span-1 {
    width: 18px;
  }
</style>
