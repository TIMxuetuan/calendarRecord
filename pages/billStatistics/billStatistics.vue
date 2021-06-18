<template>
	<view class="bill-statistics">
		<view class="bill-title">
			<view class="billTitle-item">
				手续费
			</view>
			<view class="billTitle-item">
				消费
			</view>
			<view class="billTitle-item">
				转账
			</view>
			<view class="billTitle-item">
				月份
			</view>
		</view>
		<view class="bill-bottom">
			<view class="bill-content" v-for="(item,index) in allLists" :key="index">
				<view class="billContent-item">
					{{item.lx}}
				</view>
				<view class="billContent-item">
					{{item.yxf}}
				</view>
				<view class="billContent-item">
					{{item.yzz}}
				</view>
				<view class="billContent-item">
					{{item.sheets}}
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import allApi from "../../utils/api_methods.js"
	export default {
		data() {
			return {
				user_info: {},
				allType: "",
				billItem: "",
				allLists: [],
			};
		},
		onLoad: function(option) { //option为object类型，会序列化上个页面传递的参数
			let item = JSON.parse(decodeURIComponent(option.item));
			let allType = JSON.parse(option.type);
			this.user_info = uni.getStorageSync('user_info');
			console.log("item", allType, item, this.user_info)
			this.billItem = item;
			this.allType = allType;
			this.getLists();
		},
		methods: {
			getLists() {
				let id = "";
				if(this.allType == 0){
					id = "";
				}else{
					id = this.billItem.id;
				}
				allApi.get_tj({
					wechat_id: this.user_info.id,
					kid:id
				}).then(res => {
					if (res.event == 100) {
						console.log("res", res)
						this.allLists = res.list;
					} else {
						uni.showToast({
							title: res.msg,
							icon: "none",
							duration: 2000
						});
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.bill-statistics {
		display: flex;
		width: 100vw;
		height: 100vh;
		min-height: 100vh;
		flex-direction: column;
		background-color: #F1F1F1;
	}

	.bill-title {
		width: 100%;
		height: 100rpx;
		background-color: #fff;
		display: flex;
		position: fixed;
		top: 0;
		left: 0;
		z-index: 10;
	}

	.billTitle-item {
		width: 25%;
		height: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		border-right: 1px solid #F0F0F0;
	}

	.billTitle-item:last-child {
		border: none;
	}

	.bill-bottom {
		margin-top: 100rpx;
		width: 100%;
		background-color: #F1F1F1;
	}

	.bill-content {
		width: 100%;
		display: flex;
		border-bottom: 1px solid #CCCCCC;
	}

	.bill-content:last-child {
		border: none;
	}

	.billContent-item {
		width: 25%;
		height: 100rpx;
		display: flex;
		justify-content: center;
		align-items: center;
	}
</style>
