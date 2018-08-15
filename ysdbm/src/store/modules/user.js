import Cookies from 'js-cookie';

const user = {
  state:{
    id:'',
    userName:'',
    companyName:'',
    role:'',
    token:''
  },
  mutations:{
    set_token(state, token) {
      state.token = token
      sessionStorage.token = token
    },
    del_token(state) {
      state.token = ''
      sessionStorage.removeItem('token')
    }
  }
};

export default user;
