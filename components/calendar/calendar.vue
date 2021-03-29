<template>
	<view style="height:100%">
		<view class="calendar">
			<view class='tit'>
				<view class='pre leftRight' @click='gotoPreMonth'>《</view>
				<view class='current'>{{currentYear}} / {{ currentMonth < 10 ? '0' + currentMonth : currentMonth }}</view>
				<view class='next leftRight' @click='gotoNextMonth'>》</view>
			</view>
			<view class='content'>
				<view>日</view>
				<view>一</view>
				<view>二</view>
				<view>三</view>
				<view>四</view>
				<view>五</view>
				<view>六</view>
			</view>
			<swiper @animationfinish="swiperChange" style="height:100%" easing-function="linear" :duration="swiperDuration"
			 :current="current" circular>
				<swiper-item v-for="(item,index) in threeTime" :key="index">
					<view class='daysItem'>
						<view v-for="(item,index) in allArr" :key="index">{{item.date}}</view>
					</view>
				</swiper-item>
			</swiper>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			currentYear2: { // 当前显示的年
				type: Number,
				// default: 0
				default: new Date().getFullYear()
			},
			currentMonth2: { // // 当前显示的月
				type: Number,
				// default: 0
				default: new Date().getMonth() + 1
			},
			nowTime: {
				type: [String, Number],
				default: ""
			},
			signLists: {
				type: Array,
				default: []
			}

		},
		data() {
			return {
				swiperHeight: "",
				swiperDuration: 100, // 值为0禁止切换动画
				current: 0, //初始显示页下标
				currentYear: "",
				currentMonth: "",
				currentMonthDateLen: 0, // 当月天数
				preMonthDateLen: 0, // 当月中，上月多余天数
				allArr: [], // 当月所有数据
				threeTime: [],
			};
		},
		created() {

		},
		mounted() {
			console.log("signLists", this.signLists)
			this.currentYear = this.currentYear2
			this.currentMonth = this.currentMonth2
			let preYearMonth = this.preMonth(this.currentYear, this.currentMonth) // 获取上月 年、月
			console.log("上",preYearMonth)
			this.getAllArr(this.currentYear, this.currentMonth);
			this.getAllArr(preYearMonth.year, preYearMonth.month);
		},
		methods: {
			//
			swiperChange(event) {
				console.log("ccccc", event.detail)
			},

			// 获取某年某月总共多少天
			getDateLen(year, month) {
				let actualMonth = month - 1;
				let timeDistance = +new Date(year, month) - +new Date(year, actualMonth);
				return timeDistance / (1000 * 60 * 60 * 24);
			},
			// 获取某月1号是周几
			getFirstDateWeek(year, month) {
				return new Date(year, month - 1, 1).getDay()
			},
			// 上月 年、月
			preMonth(year, month) {
				if (month == 1) {
					return {
						year: --year,
						month: 12
					}
				} else {
					return {
						year: year,
						month: --month
					}
				}
			},
			// 下月 年、月
			nextMonth(year, month) {
				if (month == 12) {
					return {
						year: ++year,
						month: 1
					}
				} else {
					return {
						year: year,
						month: ++month
					}
				}
			},
			// 获取当月数据，返回数组
			getCurrentArr(currentYear, currentMonth) {
				let currentMonthDateLen = this.getDateLen(currentYear, currentMonth) // 获取当月天数
				let currentMonthDateArr = [] // 定义空数组
				if (currentMonthDateLen > 0) {
					for (let i = 1; i <= currentMonthDateLen; i++) {
						if (i < 10) {
							var newi = "0" + i
						} else {
							var newi = i
						}
						currentMonthDateArr.push({
							month: 'current', // 只是为了增加标识，区分上下月
							date: newi,
							ziDate: currentYear + "-" + currentMonth + "-" + newi

						})
					}
				}
				this.currentMonthDateLen = currentMonthDateLen
				console.log(currentMonthDateLen)
				return currentMonthDateArr
			},
			// 获取当月中，上月多余数据，返回数组
			getPreArr(currentYear, currentMonth) {
				let preMonthDateLen = this.getFirstDateWeek(currentYear, currentMonth) // 当月1号是周几 == 上月残余天数）
				let preMonthDateArr = [] // 定义空数组
				if (preMonthDateLen > 0) {
					let {
						year,
						month
					} = this.preMonth(currentYear, currentMonth) // 获取上月 年、月
					let date = this.getDateLen(year, month) // 获取上月天数
					for (let i = 0; i < preMonthDateLen; i++) {
						preMonthDateArr.unshift({ // 尾部追加
							month: 'pre', // 只是为了增加标识，区分当、下月
							date: date,
							ziDate: year + "-" + month + "-" + date
						})
						date--
					}
				}
				this.preMonthDateLen = preMonthDateLen
				console.log("preMonthDateLen", preMonthDateLen)
				return preMonthDateArr
			},
			// 获取当月中，下月多余数据，返回数组
			getNextArr(currentYear, currentMonth) {
				let nextMonthDateLen = 42 - this.preMonthDateLen - this.currentMonthDateLen // 下月多余天数
				let nextMonthDateArr = [] // 定义空数组
				if (nextMonthDateLen > 0) {
					let {
						year,
						month
					} = this.nextMonth(currentYear, currentMonth) // 获取上月 年、月
					for (let i = 1; i <= nextMonthDateLen; i++) {
						if (i < 10) {
							var newi = "0" + i
						} else {
							var newi = i
						}
						nextMonthDateArr.push({
							month: 'next', // 只是为了增加标识，区分当、上月
							date: newi,
							ziDate: year + "-" + month + "-" + newi
						})
					}
				}
				return nextMonthDateArr
			},
			// 整合当月所有数据
			getAllArr(currentYear, currentMonth) {
				let preArr = this.getPreArr(currentYear, currentMonth)
				let currentArr = this.getCurrentArr(currentYear, currentMonth)
				let nextArr = this.getNextArr(currentYear, currentMonth)
				let allArr = [...preArr, ...currentArr, ...nextArr]
				this.allArr = allArr
				let sendObj = {
					currentYear: currentYear,
					currentMonth: currentMonth,
					yearAndMonth: currentYear + "-" + currentMonth,
					allArr: allArr
				}
				console.log("allArr", allArr)
				let shortList = [];
				let newThreeTime = this.threeTime
				if (newThreeTime != '') {
					let isInclude = newThreeTime.find(item => {
						return item.yearAndMonth == sendObj.yearAndMonth
					})
					if (isInclude == undefined) {
						shortList.push(sendObj)
					} else {
						shortList = []
					}
				} else {
					shortList.push(sendObj)
				}
				this.threeTime = this.threeTime.concat(shortList);
				// this.getThreeItemList(this.timeList)
				console.log("threeTime", this.threeTime)
			},
			// 点击 上月
			gotoPreMonth() {
				let {
					year,
					month
				} = this.preMonth(this.currentYear, this.currentMonth)
				this.currentYear = year
				this.currentMonth = month
				console.log("当月", this.currentYear, this.currentMonth)
				this.getAllArr(this.currentYear, this.currentMonth)
				this.$emit("gotoPreMonth")
			},
			// 点击 下月
			gotoNextMonth() {
				let {
					year,
					month
				} = this.nextMonth(this.currentYear, this.currentMonth)

				this.currentYear = year
				this.currentMonth = month
				console.log("当月", this.currentYear, this.currentMonth)
				this.getAllArr(this.currentYear, this.currentMonth)
				this.$emit("gotoNextMonth")
			},

			//总数据分为 封面加三个页面的数组
			getThreeItemList(newList) {
				var that = this
				var zongList = that.questionList
				var defaultIndex = ''

				for (let index = 0; index < zongList.length; index++) {
					if (zongList[index].id == newList.id) {
						defaultIndex = index
					}
				}

				let swiperList = []
				for (let i = 0; i < 3; i++) {
					swiperList.push({})
				}
				console.log("defaultIndex", defaultIndex)
				let current = defaultIndex % 3
				that.currentIndex = current
				let currentItem = zongList[defaultIndex]
				swiperList[current] = currentItem
				swiperList[that.getLastSwiperChangeIndex(current)] = that.getLastSwiperNeedItem(currentItem, zongList)
				swiperList[that.getNextSwiperChangeIndex(current)] = that.getNextSwiperNeedItem(currentItem, zongList)

				that.threeItemList = swiperList

				console.log("总数据", that.questionList)
				console.log("三个页面", that.threeItemList)
			},
		}
	}
</script>

<style lang="scss" scoped>
	.calendar {
		width: 100%;
		height: 100%;
	}

	.calendar .tit {
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 36rpx;
		color: #2A2A2A;
		padding: 20rpx 0 0;
	}

	.calendar .tit .current {
		font-size: 34rpx;
		font-weight: bold;
		color: #333333;
		margin: 0 40rpx;
	}

	.calendar .content {
		display: flex;
		flex-wrap: wrap;
		box-sizing: border-box;
	}

	.calendar .content view {
		width: 14%;
		height: 52rpx;
		line-height: 52rpx;
		text-align: center;
		flex-shrink: 0;
		font-size: 24rpx;
		color: #B3B3B3;
	}

	.daysItem {

		display: flex;
		flex-wrap: wrap;
		box-sizing: border-box;

		view {
			width: 14%;
			height: 16.5vh;
			font-size: 26rpx;
			color: #333333;
			font-weight: bold;
			text-align: center;
			flex-shrink: 0;
			border-radius: 50%;
			display: flex;
			justify-content: center;
			align-items: center;
		}


	}

	.leftRight {
		font-size: 34rpx;
		font-weight: bold;
		color: #333333;
	}

	.gray {
		color: #999 !important;
		font-weight: 100 !important;
	}
</style>
