<template>
	<view style="height: 100%;">
		<!--头部导航栏-->
		<view class="left-jian">
			<headNav></headNav>
		</view>

		<!--日历内容 开始-->
		<view class="calendarModel">
			<calendar ref="calendar" @gotoPreMonth="gotoPreMonth" @gotoNextMonth="gotoNextMonth" :signLists="signLists" :nowTime="nowTime"
			 :currentYear2='currentYear' :currentMonth2="currentMonth"></calendar>
		</view>
		<!--日历内容 结束-->
	</view>
</template>

<script>
	import headNav from '../../components/headNav/index.vue'; //头部导航组件
	import calendar from '../../components/calendar/calendar.vue'; //日历组件
	export default {
		data() {
			return {
				nowTime: "", //当天年月日  "2020-11-28"
				currentYear: "",
				currentMonth: "",
				signLists: [],
			}
		},
		components: {
			headNav,
			calendar
		},
		onLoad() {
			this.getNowDate();
		},
		methods: {
			//获得当天日期
			getNowDate() {
				let nowDate = new Date();
				this.currentYear = nowDate.getFullYear()
				this.currentMonth = nowDate.getMonth() + 1
				let currentDate = nowDate.getDate()

				if (currentDate < 10) {
					this.currentDate = "0" + currentDate
				} else {
					this.currentDate = currentDate
				}
				this.nowTime = this.currentYear + "-" + this.currentMonth + "-" + this.currentDate
				console.log("滴滴滴", this.currentYear, this.currentMonth, this.nowTime)
			},

			//点击上一月
			gotoPreMonth() {
				console.log("上一月", this.$refs.calendar.currentYear, this.$refs.calendar.currentMonth)
				this.currentYear = this.$refs.calendar.currentYear
				this.currentMonth = this.$refs.calendar.currentMonth
			},

			//下一月
			gotoNextMonth() {
				console.log("下一月", this.$refs.calendar.currentYear, this.$refs.calendar.currentMonth)
				this.currentYear = this.$refs.calendar.currentYear
				this.currentMonth = this.$refs.calendar.currentMonth
			},
		}
	}
</script>

<style lang="scss" scoped>
	@import "./index.css";
</style>
