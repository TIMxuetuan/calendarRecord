import request from './request.js'
// const baseUrl = 'https://api.kehub.cn/txb.php' //这是日历记录里面的接口ip
// const kpUrl = 'https://api.kehub.cn/txb.php/kp' //这个是账单记录里 卡片类别的接口

function userlogin (data){ //跟踪小程序登录接口,判断用户信息是否获取接口,  --获取微信用户信息
	return request({
		url:'/tra/userlogin',
		method:'POST',
		type:true,
		data
	})
}

function userxx (data){ // 储存微信用户信息
	return request({
		url:'/tra/userxx',
		method:'POST',
		type:true,
		data
	})
}

function number (data){ // 获取手机号
	return request({
		url:'/tra/number',
		method:'POST',
		type:true,
		data
	})
}

function addtralb (data){ // 小程序添加类别
	return request({
		url:'/tra/addtralb',
		method:'POST',
		type:true,
		data
	})
}

function listtralb (data){ // 小程序获取类别列表接口
	return request({
		url:'/tra/listtralb',
		method:'POST',
		type:true,
		data
	})
}

function edittralb (data){ // 小程序类别编辑接口
	return request({
		url:'/tra/edittralb',
		method:'POST',
		type:true,
		data
	})
}

function deltralb (data){ // 小程序类别删除接口
	return request({
		url:'/tra/deltralb',
		method:'POST',
		type:true,
		data
	})
}

function addtrarecord (data){ // 小程序记录信息添加
	return request({
		url:'/tra/addtrarecord',
		method:'POST',
		type:true,
		data
	})
}

function listtrarecord (data){ // 小程序记录信息列表接口
	return request({
		url:'/tra/listtrarecord',
		method:'POST',
		type:true,
		data
	})
}

function edittrarecord (data){ // 小程序记录信息编辑接口
	return request({
		url:'/tra/edittrarecord',
		method:'POST',
		type:true,
		data
	})
}

function deltrarecord (data){ // 小程序记录信息删除接口
	return request({
		url:'/tra/deltrarecord',
		method:'POST',
		type:true,
		data
	})
}

function tjttrarecord (data){ // 小程序记录信息单类别统计信息接口
	return request({
		url:'/tra/tjttrarecord',
		method:'POST',
		type:true,
		data
	})
}

/*账单卡片页面 billCategory的接口 开始*/

function add_kp (data){ // 小程序添加 卡片类别接口
	return request({
		url:'/kp/add_kp',
		method:'POST',
		type:true,
		data
	})
}

function listkp (data){ // 卡片列表接口
	return request({
		url:'/kp/listkp',
		method:'POST',
		type:true,
		data
	})
}

function editkp (data){ // 卡片编辑接口
	return request({
		url:'/kp/editkp',
		method:'POST',
		type:true,
		data
	})
}

function delkp (data){ // 卡片删除接口
	return request({
		url:'/kp/delkp',
		method:'POST',
		type:true,
		data
	})
}

function get_kname (data){ // 卡片名称接口
	return request({
		url:'/kp/get_kname',
		method:'POST',
		type:true,
		data
	})
}

/*账单卡片页面 billCategory的接口 结束*/


/*账单记录页面bill的接口 开始*/
function add_jl (data){ // 新增卡片记录接口
	return request({
		url:'/kp/add_jl',
		method:'POST',
		type:true,
		data
	})
}

function jl_list (data){ // 卡片记录列表接口
	return request({
		url:'/kp/jl_list',
		method:'POST',
		type:true,
		data
	})
}

function editjl (data){ // 卡片记录编辑接口
	return request({
		url:'/kp/editjl',
		method:'POST',
		type:true,
		data
	})
}

function deljl (data){ // 卡片记录删除接口
	return request({
		url:'/kp/deljl',
		method:'POST',
		type:true,
		data
	})
}

function get_tj (data){ // 卡片记录按月统计接口
	return request({
		url:'/kp/get_tj',
		method:'POST',
		type:true,
		data
	})
}

/*账单记录页面bill 结束*/


export default {
	userlogin,
	userxx,
	number,
	addtralb,
	listtralb,
	edittralb,
	deltralb, 
	addtrarecord,
	listtrarecord,
	edittrarecord, 
	deltrarecord,
	tjttrarecord,
	
	add_kp,
	listkp,
	editkp,
	delkp,
	get_kname,
	
	add_jl,
	jl_list,
	editjl,
	deljl,
	get_tj,
	
}