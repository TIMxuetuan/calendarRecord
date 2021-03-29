<template>
	<view>
		<u-navbar :is-back="false" :border-bottom="false" is-fixed :background="background">
			<view class="container-title">
				<view class="leftIcon">
					<view>
						<u-icon name="list" color="#ffffff" size="36"></u-icon>
					</view>
					<view class="timeValue">
						二月
					</view>
				</view>
				<view class="rightIcon">
					<u-icon name="calendar" color="#ffffff" size="34"></u-icon>
				</view>
			</view>
		</u-navbar>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				background: {
					backgroundColor: '#2196F3',
				}
			};
		}
	}
</script>

<style lang="scss" scoped>
	.container-title {
		width: 100%;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0 30rpx;
	}
	
	.leftIcon{
		display: flex;
	}

	.timeValue {
		margin-left: 30rpx;
		color: #fff;
		font-size: 30rpx;
	}

	.rightIcon {
	}
</style>
