const baseUrl = 'https://api.kehub.cn/txb.php/tra'
//公共参数
let params = {

}
import Vue from 'vue';
const $this = Vue.prototype
//拦截器
// const decorator_resource_info = (data) => {
//   if (!ENV_SUFFIX) return '';

//   data['timestamp'] = Math.ceil(new Date() / 1000);
//   //sort key
//   const reverse_key = Object.keys(data).sort();
//   let resource_code = reverse_key.reduce((rst, v) => rst += `${v}=${ data[v]}&`, '').slice(0, -1) + ENV_SUFFIX;
//   data['sign'] =$this.$md5(resource_code);
// };
let request = function(kvs) {
	let promise = new Promise((resolve, reject) => {
		//加密写在这里...
		console.log("kvs.type",kvs)
		if (kvs.type != 'undefined' && kvs.type) {
			console.log("未加密")
			var newdata = kvs.data;
		} else {
			console.log("加密")
			var newdata = handleData(kvs.data);
		}
		// let newdata = kvs.data;
		uni.request({
			url: baseUrl + kvs.url,
			method: 'POST',
			header: {
				'content-type': 'application/x-www-form-urlencoded'
			},
			data: {
				...newdata,
				...params
			},
			success: function(res) {
				// resolve(res.data)
			},
			fail: function(reason) {
				// reject(reason)
			},
			complete: function(res) {
				resolve(res.data)
			}
		})
	})
	return promise
}

const ENV_SUFFIX = 'zhongjianedu';
//加密
function handleData(params) {
	if (!ENV_SUFFIX) return '';
	// let newdata = data;
	// 进行一些操作... 
	let data = JSON.parse(JSON.stringify(params, (k, v) => (v === undefined || v === null) ? '' : v));
	data['timestamp'] = Math.ceil(new Date() / 1000);
	//sort key
	const reverse_key = Object.keys(data).sort();
	let resource_code = reverse_key.reduce((rst, v) => rst += `${v}=${ data[v]}&`, '').slice(0, -1) + ENV_SUFFIX;
	data['sign'] = $this.$md5(resource_code);
	return data
}
export default request
