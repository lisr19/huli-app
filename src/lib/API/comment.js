import { fetch, post, patch, del } from '../http'

// 添加评价
export function postNewCommen (params) {
    return post('evaluation/add', params)
}

// 评价列表
export function getCommentList (params) {
    return fetch('evaluation/list', params)
}

// 删除评价
export function delComment (params) {
    return del('evaluation/del', params)
}

// 修改评价
export function updataComment (params) {
    return patch('evaluation/update', params)
}


// 健康档案列表
export function getHealthList (params) {
	return fetch('userHealthRecord/list', params)
}

// 系统消息列表
export function getMsgList (params) {
	return fetch('pushMessage/listMessage', params)
}

// 健康宣教消息列表
export function getMsgHealList (params) {
	return fetch('pushMessage/listEducation', params)
}

// 设为已读消息
export function updateFlag (params) {
	return patch('pushMessage/updateFlag1Many', params)
}
// 是否存在新消息
export function checkNew (params) {
	return fetch('pushMessage/checkNew', params)
}


// 添加健康档案
export function addHealthRecord (params) {
	return post('userHealthRecord/add', params)
}

// 获取民族
export function getNation (params) {
	return fetch('nationalityList/list', params)
}
// 获取隶属区域
export function getDistrict (params) {
	return fetch('subordinateAreaList/list', params)
}
// 获取籍贯
export function getProvince (params) {
	return fetch('province/list', params)
}
// 获取转介来源
export function getSourceList (params) {
	return fetch('sourceOfReferralList/list', params)
}
// 医疗付款方式
export function getPayList (params) {
	return fetch('medicalPaymentMethodList/list', params)
}
// 现居住地
export function getResidenceList (params) {
	return fetch('residenceList/list', params)
}

// 用户健康档案列表
export function getHealthRecordList (params) {
	return fetch('userHealthRecord/list', params)
}

// 修改用户健康档案列表
export function editHealthRecord (params) {
	return patch('userHealthRecord/update', params)
}

// 健康宣教详情
export function getEducDetail (params) {
	return fetch('pushMessage/getEducationDetail', params)
}







