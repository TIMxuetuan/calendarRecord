<template>
	<view>
		<u-navbar height="50" :is-back="false" :border-bottom="false" is-fixed :background="background">
			<view class="container-title">
				<view class="leftIcon">
					<view>
						<u-icon @click="openSetModel" name="list" color="#ffffff" size="36"></u-icon>
					</view>
					<view class="timeValue">
						{{timeListTime}}
					</view>
				</view>
				<view class="rightIcon">
					<u-icon @click="openCalendarModel" name="calendar" color="#ffffff" size="36"></u-icon>
				</view>
			</view>
		</u-navbar>
	</view>
</template>

<script>
	export default {
		props:{
			timeListTime:{
				type: [Array,String],
				default: ""
			}
		},
		data() {
			return {
				background: {
					backgroundColor: '#2196F3',
				}
			};
		},
		methods:{
			openSetModel(){
				this.$emit("openSetModel")
			},
			openCalendarModel(){
				this.$emit("openCalendarModel")
			}
		}
	}
</script>

<style lang="scss" scoped>
	.container-title {
		width: 100%;
		height: 50px;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0 30rpx;
	}
	
	.leftIcon{
		display: flex;
		height: 50px;
		align-items: center;
		font-weight: bold;
	}

	.timeValue {
		margin-left: 30rpx;
		color: #fff;
		font-size: 34rpx;
	}

	.rightIcon {
	}
</style>
