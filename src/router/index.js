/*
 * @Author: xujiajia xujiajia@piesat.cn
 * @Date: 2025-05-15 13:16:13
 * @LastEditors: ZX Li
 * @LastEditTime: 2025-10-17 12:25:25
 * @FilePath: \sjzWeb\src\router\index.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import {
  createRouter,
  createWebHistory,
  createWebHashHistory
} from 'vue-router'
import { useStore } from 'vuex'

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/home',
    name: 'home',
    component: () =>
      import(/* webpackChunkName: "home-chunk" */ '../views/HomeView.vue'),
    children: [
      // 任务推演想定列表
      {
        path: 'taskInfer',
        name: 'taskInfer',
        component: () =>
          import('../views/seatManagement/adminuser/sceneManagement/index.vue')
      },
      // 导条控制和复盘回放任务列表
      {
        path: 'taskList',
        name: 'taskList',
        component: () =>
          import('../views/seatManagement/adminuser/taskManagement/index.vue')
      },
      {
        //实验列表
        path: 'combatSimulation',
        name: 'combatSimulation',
        component: () =>
          import('../views/combatSimulation/combatSimulation.vue')
      },
      {
        //通过url获取实验并推演的路由
        path: 'ty',
        name: 'homeTy',
        component: () =>
          import('../views/combatSimulation/combatSimulation2.vue')
      },
      {
        path: 'dt',
        name: 'dt',
        // component: () =>
        //   import(
        //     '../views/seatManagement/situationUser/adminSituationSeat/index.vue'
        //   )
        component: () => import('../views/bianzudaotiao/index.vue')
      }
    ]
  },
  {
    //想定详情
    path: '/review',
    name: 'review',
    component: () =>
      import(/* webpackChunkName: "home-chunk" */ '../views/FP/FP.vue')
  },

  {
    //想定详情
    path: '/ThinkAboutDetails',
    name: 'ThinkAboutDetails',
    component: () =>
      import(
        '../views/combatSimulation/ThinkAboutDetails/ThinkAboutDetails.vue'
      )
  },
  {
    path: '/architecturePlatform',
    name: 'architecturePlatform',
    component: () =>
      import('@/components/architecturePlatform/architecturePlatform.vue'),
    children: []
  },
  {
    path: '/login',
    // component: () => import('../views/login/Login.vue')
    component: () => import('../views/login/index.vue')
  },
  {
    path: '/sceneConstruction',
    name: 'sceneConstruction',
    component: () =>
      import('../views/experimentalPreparation/sceneConstruction/index.vue')
  },
  {
    path: '/conceptDevelopment',
    name: 'conceptDevelopment',
    component: () =>
      import('../views/experimentalPreparation/conceptDevelopment/index.vue')
  },
  {
    path: '/dataConfig',
    name: 'dataConfig',
    component: () =>
      import('../views/experimentalPreparation/dataConfig/index.vue')
  },
  {
    path: '/infomationStatistics',
    name: 'infomationStatistics',
    component: () => import('../views/infomationStatistics/index.vue')
  },
  {
    path: '/multiLink',
    name: 'multiLink',
    component: () => import('../views/MultiLink/index.vue')
  },
  {
    path: '/sselogo',
    name: 'sselogo',
    component: () => import('../views/SSELogo/index.vue')
  },
  {
    path: '/liveBroadcast',
    name: 'liveBroadcast',
    component: () => import('@/components/liveBroadcast/index.vue')
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  },
  {
    path: '/:pathMatch(.*)', // "/:pathMatch(.*)*" 返回数组
    component: () => import('../components/content/NotFound.vue')
  },
  {
    path: '/taskReadiness',
    component: () =>
      import('../views/seatManagement/adminuser/taskReadiness/index.vue')
  }
]

const router = createRouter({
  // history: createWebHistory(process.env.BASE_URL),
  // history: createWebHistory(),
  history: createWebHashHistory(),
  routes
})

// 添加动态路由
// const route1 = {
//   path: "/xx",
//   component: () => import("xx.vue"),
// };
// router.addRoute(route1);

// router.addRoute("home", {
//   path: "xx",
//   component: () => import("xx.vue"),
// });

// 导航首位验证登录
// router.beforeEach((to, from) => {
//   if (to.path !== '/login') {
//     if (to.query) {
//       // window.localStorage.setItem('account', to.query)
//     }
//     const token = window.localStorage.getItem('account')
//     if (!token) {
//       return '/login'
//     }
//   }
// })

export default router
