<script>
	import allApi from './utils/api_methods.js'
	export default {
		onLaunch: function() {
			console.log('App Launch')
			uni.login({
				success: res => {
					console.log('user_code', res)
					// uni.setStorageSync('user_code', res.code);
					allApi.userlogin({
						code: res.code,
					}).then(res => {
						if (res.event == 100) {
							console.log(res.data, '用户信息')
							uni.setStorageSync('user_info', res.data);
						}
					})
				}
			});

		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style lang="scss">
	/*每个页面公共css */
	@import "uview-ui/index.scss";
</style>
