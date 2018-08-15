
<template>
  <div class="layout">
    <layout-common></layout-common>
    <div class="layout-content">
      <Content :style="{padding: '8px', minHeight: '280px',height:'100%'}">
        <Row>
          <Col span="20" style="margin-top:10px;">
            <Table ref="table" border :columns="userListColumns" :data="userListData"  :height="tableHeight" size="small"></Table>
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
      this.initUserListColumns();
      this.initUserListData();
    },
    mounted() {
      // 设置表格高度
      this.scrollBarResize();


    },
    data() {
      return {
        userListData:[],
        tableHeight:'',
        userListColumns: [],
      };
    },
    methods: {
      initUserListData() {
        this.$http.post('/api/user/getUserInfo', {},{}).then((response) => {
          console.log(response.body);
          this.userListData = response.body;
        })
      },
      initUserListColumns() {
        let self = this;
        this.userListColumns = [
          {
            type: 'index',
            width: 60,
            align: 'center'
          },
          {
            title: '登录名',
            key: 'loginName',
          },
          {
            title: '用户名',
            key: 'userName',
          },
          {
            title: '权限',
            key: 'role',
            render: function (h, params) {
              return h('div',
                self.userListData[params.index].role == 0 ? {style:{color: 'red'}}:{style:{color: '#2c3e50'}},
                self.userListData[params.index].role == 0 ? '管理员' :'普通用户'
              );
            }
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
                      console.log(self.userListData[params.index].id);
                      self.deleteUser(self.userListData[params.index].id);
                    }
                  }
                }, '删除')
              ]);
            }
          }
        ]
      },
      scrollBarResize() {
        this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop - 160
      },
      deleteUser(id){
        this.$Modal.confirm({
          title: '提示',
          content: `<div class="modal-bd modal-bd2">
                        <p>确定删除该用户信息？</p><br>
                     </div>`,
          onOk:() => {
            this.$http.post('/api/user/deleteUser', {id:id},{}).then((response) => {
               this.initUserListData();
            })
          }
        });
      }
    },
    watch: {},
    dispatch () {

    }

  };
</script>
