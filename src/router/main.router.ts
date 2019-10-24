import {ProRouteConfig} from '@/model/project/route/route.model'
import Main from '@/modules/main/Main.vue'
import MainHome from '@/modules/main/MainHome.vue'
import demoRouter from '@/demo/router/router'

export const mainRoute: ProRouteConfig = {
  path: '/main',
  name: 'main',
  redirect: {name: 'home'},
  component: Main,
  children: [
    {
      path: '',
      name: 'home',
      component: MainHome,
      meta: {
        title: 'Home',
        hideBread: true,
      },
    },
    demoRouter,
  ],
  meta: {
    title: 'main',
  },
}
