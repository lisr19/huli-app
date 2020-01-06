import { fetch, post, patch, del } from '../http'

// 获取民族
export function getNation (params) {
    return fetch('nationalityList/list', params)
}

// 获取区
export function getDistrict (params) {
    return fetch('subordinateAreaList/list', params)
}

// 获取籍贯
export function getProvince (params) {
    return fetch('province/list', params)
}
