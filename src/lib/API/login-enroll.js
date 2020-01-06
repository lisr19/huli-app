import { fetch, post, patch, del, put } from '../http'

// 注册
export function newUser (params) {
    return post('user/codeRegister', params)
}

// 登录
export function userLogin (params) {
    return post('user/login', params)
}

// 修改密码
export function newPass (params) {
  return fetch('user/resetPassword', params)
}

// // 用户修改信息
// export function userUptate (params) {
//     return patch('user/update', params)
// }

// 用户修改信息
export function userUptate (params) {
	return put('user/update', params)
}

// 用户列表
export function getUserDate (params) {
  return fetch('user/findById', params)
}

//发送短信
export function SMS (params) {
  return post('user/sendCode', params)
}
//验证码注册并登录
export function codeRegister (params) {
	return post('user/codeRegister', params)
}
//验证码改密码
export function codeUpdatePwd (params) {
	return post('user/codeUpdatePwd', params)
}


