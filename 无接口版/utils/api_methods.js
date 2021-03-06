import request from './request.js'

function userlogin (data){ //跟踪小程序登录接口,判断用户信息是否获取接口,  --获取微信用户信息
	return request({
		url:'/userlogin',
		method:'POST',
		type:true,
		data
	})
}

function userxx (data){ // 储存微信用户信息
	return request({
		url:'/userxx',
		method:'POST',
		type:true,
		data
	})
}

function number (data){ // 获取手机号
	return request({
		url:'/number',
		method:'POST',
		type:true,
		data
	})
}

function addtralb (data){ // 小程序添加类别
	return request({
		url:'/addtralb',
		method:'POST',
		type:true,
		data
	})
}

function listtralb (data){ // 小程序获取类别列表接口
	return request({
		url:'/listtralb',
		method:'POST',
		type:true,
		data
	})
}

function edittralb (data){ // 小程序类别编辑接口
	return request({
		url:'/edittralb',
		method:'POST',
		type:true,
		data
	})
}

function deltralb (data){ // 小程序类别删除接口
	return request({
		url:'/deltralb',
		method:'POST',
		type:true,
		data
	})
}

function addtrarecord (data){ // 小程序记录信息添加
	return request({
		url:'/addtrarecord',
		method:'POST',
		type:true,
		data
	})
}



export default {
	userlogin,
	userxx,
	number,
	addtralb,
	listtralb,
	edittralb, //暂时没对
	deltralb, //暂时没对
	addtrarecord,
}