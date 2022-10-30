import Vue from 'vue'
import Router from 'vue-router'
//普通加载
import Login from '@/pages/login/login'

Vue.use(Router)

export default new Router({
   routes: [
      {
         path: '/',
        //   路由规则中出了可以指定路径对应的组件，还可以指定重定向
         redirect: '/login'
      },
      {
         path: '/login',
         name: 'login',
         component: Login
      },
      //路由懒加载1
      {
         path: '/provide/par',
         name: 'providepar',
         component: resolve => require(['@/pages/provide/par'],resolve)
      },
   ]
})