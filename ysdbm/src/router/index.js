import Vue from 'vue'
import Router from 'vue-router'
import login from '@/views/login'
import {routers} from './routers'
import store from '../store'
import jwt from 'jsonwebtoken'

Vue.use(Router)

/*export default new Router({
  routes: [
    {
      path: '/',
      name: 'login',
      component: login
    }
  ]
})*/

// 页面刷新时，重新赋值token
console.log(sessionStorage.getItem('token'));
if (sessionStorage.getItem('token')) {
  store.commit('set_token', sessionStorage.getItem('token'))
}

// 路由配置
const RouterConfig = {
  mode: 'history',
  routes:routers
};

export const router = new Router(RouterConfig);
const whiteList = ['/login', '/404', '/401']; // 免登白名单

router.beforeEach((to, from, next) => {
  console.log("beforeEach")
  console.log(to.path);
  console.log(store.state.user.token);
if (store.state.user.token) {  // 存在token
  console.log("存在token");
  if (to.path === '/login') {
    next()
  } else {
    //解密token
    jwt.verify(store.state.user.token, 'user_pass_xxx', function (err, decoded) {
      if (!err){
        console.log(decoded); //会输出123，如果过了60秒，则有错误。
        store.state.user.id = decoded.id;
        store.state.user.userName = decoded.userName;
        store.state.user.companyName = decoded.companyName;
        store.state.user.role = decoded.role;


      }
      if(to.path === 'addUser' || to.path === 'userList'){
        if(store.state.user.role != 0) {
          next('/404');
        }
      }
      next();
    })
  }
} else { // 没有token
  console.log("没有token");
  if (whiteList.indexOf(to.path) !== -1) { // 在免登录白名单，直接进入
    next();
  } else {
    next('/login'); // 否则全部重定向到登录页
  }
}



/* //to即将进入的目标路由对象，from当前导航正要离开的路由， next  :  下一步执行的函数钩子
 if(to.path === '/login') {
   next();  // 如果即将进入登录路由，则直接放行
   console.log("beforeEach1");
 } else {     //进入的不是登录路由
   console.log("beforeEach2");
   if (to.meta.requiresAuth && !sessionStorage.getItem('accessToken')) {
     console.log("beforeEach3")
     next({path: '/login'})
   } else { //下一跳路由需要登录验证，并且还未登录，则路由定向到  登录路由
     next({path: '/login'});
     console.log("beforeEach4")
   }
 }  //如果不需要登录验证，或者已经登录成功，则直接放行*/

 /* if (whiteList.indexOf(to.path) !== -1) { // 在免登录白名单，直接进入
    next();
  } else {
    next('/login'); // 否则全部重定向到登录页
  }*/
});

export default router;

