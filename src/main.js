/*
 * @Author: caoyazhen caoyazhen@piesat.cn
 * @Date: 2024-04-24 10:17:44
 * @LastEditors: caoyazhen caoyazhen@piesat.cn
 * @LastEditTime: 2024-04-24 11:23:10
 * @FilePath: \MSIMEarthSysN\src\main.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import * as echarts from 'echarts'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import 'amfe-flexible'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import '@/assets/css/common.less'
import '@/assets/css/main.less'
import animated from 'animate.css'
import '@/assets/iconfont/iconfont.css'
// 右上角消息提示
import '@/components/content/messagePrompt/css/beautyToast.css'
import '@/components/content/messagePrompt/hooks/beautyToast'

//文档
import 'tinymce' //引用tinymce的核心
//样式
import 'tinymce/skins/content/default/content.min.css'
import 'tinymce/skins/ui/oxide/skin.min.css'
import 'tinymce/skins/ui/oxide/content.min.css'
// import './assets/sass/all.css'
//主题.
import 'tinymce/themes/silver'

//插件
import 'tinymce/plugins/link' //链接插件
import 'tinymce/plugins/image' //图片插件
import 'tinymce/plugins/media' //媒体插件
import 'tinymce/plugins/table' //表格插件
import 'tinymce/plugins/lists' //列表插件
import 'tinymce/plugins/quickbars' //快速栏插件
import 'tinymce/plugins/fullscreen' //全屏插件

import TinymceVue from '@tinymce/tinymce-vue' //引用Vue组件
// loading 注入全局方法
import { showLoading, hideLoading } from '@/utils/loading'
const app = createApp(App)
app.config.globalProperties.$showLoading = showLoading
app.config.globalProperties.$hideLoading = hideLoading

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
app.use(ElementPlus, {
  locale: zhCn
})
app.config.globalProperties.$echarts = echarts
app.component('TinymceVue', TinymceVue)
app.use(store)
app.use(router)
app.use(animated)
app.mount('#app')
store.commit('initSystemConfig')
store.commit('initSceneConfig')
