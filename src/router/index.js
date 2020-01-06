import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
	routes: [
		{
			path:'*',
			redirect:'/index'
		},
		{
			path: '/index',
			name: '首页',
			meta: { keepAlive: true },
			component: (resolve) => require(['@/view/home/index.vue'], resolve),
		},
		{
			path: '/login',
			name: '登录',
			meta: { keepAlive: true },
			component: (resolve) => require(['@/view/login/login.vue'], resolve),
		},
		{
			// 用户服务协议
			path: '/user-protocol',
			name: '用户服务协议',
			component: (resolve) => require(['@/view/login/user-protocol.vue'], resolve),
		},
		{
			path: '/my-data',
			name: '个人信息',
			meta: { keepAlive: true },
			component: (resolve) => require(['@/view/my/my-data.vue'], resolve),
		},
		{
			// 编辑器
			path: '/write',
			name: 'Write',
			meta: { keepAlive: true },
			component: (resolve) => require(['@/components/write/write.vue'], resolve),
		},
		{
			path: '/my-phr',
			name: '健康档案',
			component: (resolve) => require(['@/view/my/phr.vue'], resolve),
		},
		{
			path: '/evaluate',
			name: '评价',
			component: (resolve) => require(['@/view/my/evaluate.vue'], resolve),
		},
		{
			// 订单填写
			path: '/plan-order',
			name: '下订单',
			meta: { keepAlive: true },
			component: (resolve) => require(['@/view/order/plan-order.vue'], resolve),
		},
		{
			// 指定护士
			path: '/desi-nurse',
			name: '指定护士',
			component: (resolve) => require(['@/view/order/desi-nurse.vue'], resolve),
		},
		{
			// 护士详情
			path: '/nurse-detail',
			name: '护士详情',
			component: (resolve) => require(['@/view/order/nurse-detail.vue'], resolve),
		},
		{
			// 支付
			path: '/pay',
			name: '支付',
			component: (resolve) => require(['@/view/order/pay.vue'], resolve),
		},
		{
			// 支付成功
			path: '/pay-success',
			name: '支付成功',
			component: (resolve) => require(['@/view/order/pay-success.vue'], resolve),
		},
		{
			// 订单详情
			path: '/order-details',
			name: '订单详情',
			component: (resolve) => require(['@/view/order/order-details.vue'], resolve),
		},
		{
			// 普通消息列表
			path: '/message',
			name: '消息通知',
			component: (resolve) => require(['@/view/message/message.vue'], resolve),
		},
		{
			// 健康宣教消息列表
			path: '/msg-health',
			name: '健康宣教消息',
			component: (resolve) => require(['@/view/message/msg-health.vue'], resolve),
		},
		{
			// 消息详情
			path: '/msg-detail',
			name: '消息详情',
			component: (resolve) => require(['@/view/message/msg-detail.vue'], resolve),
		},
		{
			// 健康消息详情
			path: '/msghealth-detail',
			name: '健康宣教详情',
			component: (resolve) => require(['@/view/message/msghealth-detail.vue'], resolve),
		},
		{
			// 用户对此护士评价列表
			path: '/eval-list',
			name: '护士评价列表',
			component: (resolve) => require(['@/view/order/eval-list.vue'], resolve),
		},
		{
			// 搜索
			path: '/search',
			name: '搜索',
			meta: { keepAlive: true },
			component: (resolve) => require(['@/view/home/search.vue'], resolve),
		},
	]
})
