// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import './common/less/reset.less'
import 'swiper/dist/css/swiper.css'
import 'lib-flexible/flexible.js'
import 'mint-ui/lib/style.css'
import iView from 'iview'
import 'iview/dist/styles/iview.css'
import VueAwesomeSwiper from 'vue-awesome-swiper'
import store from './store'
// import * as socketApi from '../src/lib/socket'
import 'babel-polyfill'
import Es6Promise from 'es6-promise'
import exit from "./exit";//监听返回
import flexible from "./flexible";
import Toast from './components/toast/toast'
import Mint from 'mint-ui';
import Vant from 'vant';
import 'vant/lib/index.css';
// import mui from 'vue-awesome-mui'
// Vue.use(mui)


Vue.use(Vant);
Vue.use(Mint);
Vue.use(iView)
Vue.use(exit)
Vue.use(VueAwesomeSwiper)
Vue.use(Toast);
Vue.config.productionTip = false
require('es6-promise').polyfill()
Es6Promise.polyfill()
// Vue.prototype.socketApi = socketApi

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})


router.beforeEach((to, from, next) => {
	const token = localStorage.getItem('token')
	if (to.path === '/user-protocol') {
		next()
	}else if (!token && to.path !== '/login') {
		next({
			path: '/login' // 跳转到登录页
		})
	} else if (!token && to.path === '/login') {
		// 未登陆且要跳转的页面是登录页
		next() // 跳转
	} else if (token && to.path === '/login') {
		// 已登录且要跳转的页面是登录页
		next({
			path: '/index' // 跳转到订单列表页
		})
	} else {
		next() // 跳转
	}
})
export default router



// 获取input焦点
Vue.directive('focus', {
	inserted: (el)=> {
		el.focus()
	}
})
// Vue.filter('addZero',function(value){
// 	return value.toFixed(2)
// })