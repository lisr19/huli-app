import { fetch, post, patch, del } from '../http'

// 最近护理列表
export function getRecentList (params) {
	return fetch('nursingService/recentlyPurchasedList', params)
}

// 护理列表
export function getNurseList (params) {
    return fetch('nursingService/list', params)
}
// 护理子服务列表
export function getNurseChildList (params) {
	return fetch('nursingServiceDetail/list', params)
}

// 订单列表
export function getOrderList (params) {
	return fetch('orderList/list', params)
}
// 订单列表1（评论用）
export function getOrderList1 (params) {
	return fetch('orderList/list1', params)
}

// 评论
export function goEvaluate (params) {
	return post('orderList/evaluate', params)
}

// 订单详情
export function getOrderDetail (params) {
    return fetch('orderList/detail', params)
}

// 下订单
export function addOrder (params) {
	return post('orderList/add', params)
}
// 订单支付
export function surePay (params) {
	return post('orderList/pay', params)
}
// 取消订单
export function cancleOrder (params) {
	return patch('orderList/cancel', params)
}


// 隶属区域列表
export function getAreaList (params) {
	return fetch('subordinateAreaList/list', params)
}

// 隶属区域列表
export function getPayType (params) {
	return fetch('medicalPaymentMethodList/list', params)
}

// 护士列表
export function getNurList (params) {
	return fetch('nurse/list', params)
}
// 护士详情
export function getNurDetail (params) {
	return fetch('/orderList/nurseevaluate', params)
}

// 医院列表
export function getHospital (params) {
	return fetch('hospital/list', params)
}

// 护理列表
export function getServiceByName (params) {
	return fetch('nursingService/getServiceByName', params)
}








