import Main from '@/views/main.vue';

// 不作为Main组件的子页面展示的页面单独写，如下
export const loginRouter = {
  path: '/login',
  name: 'login',
  meta: {
    title: 'Login - 登录'
  },
  component: () => import('@/views/login.vue')
};
export const page404 = {
  path: '/404',
  name: 'error-404',
  meta: {
    title: '404-页面不存在'
  },
  component: () => import('@/views/error-page/404.vue')
};

export const page403 = {
  path: '/403',
  meta: {
    title: '403-权限不足'
  },
  name: 'error-403',
  component: () => import('@/views/error-page/403.vue')
};

export const page500 = {
  path: '/500',
  meta: {
    title: '500-服务端错误'
  },
  name: 'error-500',
  component: () => import('@/views/error-page/500.vue')
};

export const otherRouter = [
  {
    path: '/addUser',
    name: 'addUser',
    component: () => import('@/views/roleManage/addUser.vue')
  },
  {
    path: '/userList',
    name: 'userList',
    component: () => import('@/views/roleManage/userList.vue')
  },
  {
    path: '/addStaff',
    name: 'addStaff',
    component: () => import('@/views/staffManage/addStaff.vue')
  },
  {
    path: '/staffList',
    name: 'staffList',
    component: () => import('@/views/staffManage/staffList.vue')
  },

]




// 所有上面定义的路由都要写在下面的routers里
export const routers = [
  loginRouter,
  ...otherRouter,
  page404,
  page403,
  page500
];
