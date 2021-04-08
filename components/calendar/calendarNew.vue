<template>
	<view style="height:100%">
		<view class="calendar">
			<!-- <view class='tit'>
				<view class='pre leftRight' @click='gotoPreMonth'>《</view>
				<view class='current'>{{currentYear}} / {{ currentMonth < 10 ? '0' + currentMonth : currentMonth }}</view>
				<view class='next leftRight' @click='gotoNextMonth'>》</view>
			</view> -->
			<view class='content'>
				<view>日</view>
				<view>一</view>
				<view>二</view>
				<view>三</view>
				<view>四</view>
				<view>五</view>
				<view>六</view>
			</view>
			<view style="height:100%" @touchstart="start" @touchend="end">
				<view class='daysItem'>
					<view @click="daysAdd(items)" v-for="(items,index) in timeList.allArr" :key="index"
						class="daysItem-li"
						:class="items.month != 'current' ? 'noCurrent' : (items.isOpen == true ? 'nowZiDate' :'') ">
						<view class="item-date" :class="items.isOpen == true ? 'nowZiDate-text' :''">
							{{items.date}}
						</view>
						<view class="lastAll">
							<view class="lastAll-item" v-for="(last,index) in items.lastAllItem" :key="index">
								<view class="lastItem-icon">
									<u-icon :name="last.explainIconValue.icon.name"
										:color="last.explainIconValue.icon.color" size="30"></u-icon>
								</view>
								<view class="lastItem-text">{{last.explainIconValue.value}}</view>
							</view>
						</view>
					</view>
				</view>
			</view>
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
				questionList: [], //所有的月份数据
				threeTime: [], //页面展示的三个月份数据
				timeList: {}, //当前的临时数据
				preYearMonth: {},
				nextYearMonth: {},
				startData: {}
			};
		},
		created() {

		},
		mounted() {
			console.log("signLists", this.signLists)
			this.currentYear = this.currentYear2
			this.currentMonth = this.currentMonth2
			this.getAllArr(this.currentYear, this.currentMonth);

		},
		methods: {

			//点击日期获得数据
			daysAdd(items) {
				console.log("items", items)
				if (items.isOpen) {
					console.log("已经选择了")
					this.$emit("openDayAllRecord",items)
				} else {
					let allLists = this.timeList;
					items.isOpen = true
					for (let item of allLists.allArr) {
						if (item.ziDate == items.ziDate) {
							item.isOpen = true
							localStorage.setItem("dayRecord", JSON.stringify(items))
						} else {
							item.isOpen = false;
						}
					}
					this.timeList = allLists;
					this.$forceUpdate()
					console.log("this.timeList", this.timeList)
				}
			},

			//监听滑动开始
			start(e) {
				this.startData.clientX = e.changedTouches[0].clientX;
				this.startData.clientY = e.changedTouches[0].clientY;
			},

			//监听滑动结束
			end(e) {
				// console.log(e)
				const subX = e.changedTouches[0].clientX - this.startData.clientX;
				const subY = e.changedTouches[0].clientY - this.startData.clientY;
				if (subY > 50 || subY < -50) {
					// console.log('上下滑')
				} else {
					if (subX > 50) {
						console.log('右滑看上一个月')
						this.gotoPreMonth()
					} else if (subX < -50) {
						console.log('左滑看下一个月')
						this.gotoNextMonth()
					} else {
						// console.log('无效')
					}
				}
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
							currentYear: currentYear,
							currentMonth: currentMonth,
							date: newi,
							ziDate: currentYear + "-" + currentMonth + "-" + newi,

						})
					}
				}
				this.currentMonthDateLen = currentMonthDateLen
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
							currentYear: year,
							currentMonth: month,
							date: date,
							ziDate: year + "-" + month + "-" + date,
						})
						date--
					}
				}
				this.preMonthDateLen = preMonthDateLen
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
							currentYear: year,
							currentMonth: month,
							date: newi,
							ziDate: year + "-" + month + "-" + newi,
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
				if (currentMonth > 0) {
					for (let i = 1; i <= currentMonth; i++) {
						if (i < 10) {
							var newi = "0" + i
						} else {
							var newi = i
						}
					}
				}
				let newAllArr = [];
				for (let item of allArr) {
					if (item.ziDate == this.nowTime) {
						item.isOpen = true
						newAllArr.push(item)
						localStorage.setItem("dayRecord", JSON.stringify(item))
					} else {
						item.isOpen = false;
						newAllArr.push(item)
					}
				}
				allArr = newAllArr;
				let sendObj = {
					currentYear: currentYear,
					currentMonth: currentMonth,
					yearAndMonth: newi + "-" + currentYear,
					allArr: this.isTimeAll(allArr)
				}
				this.timeList = sendObj;
				console.log("newAllArr", newAllArr)
				console.log("当前月份", newi, currentMonth, this.timeList)
			},

			//获取本地数据，与当月数据进行对比，如果有记录则将缓存数据添加整合
			isTimeAll(allArr) {
				let lastAllLists = localStorage.getItem("lastAllLists");
				if (lastAllLists != null && lastAllLists != "") {
					lastAllLists = JSON.parse(lastAllLists);
				} else {
					lastAllLists = [];
				}

				if (lastAllLists != '') {
					for (var i = 0; i < lastAllLists.length; i++) {
						for (var j = 0; j < allArr.length; j++) {
							let lastAllItem = []
							if (lastAllLists[i].idTime == allArr[j].ziDate) {
								lastAllItem.push(lastAllLists[i])
								allArr[j].lastAllItem != undefined ? allArr[j].lastAllItem = allArr[j].lastAllItem.concat(
									lastAllItem) : allArr[j].lastAllItem = lastAllItem
							} else {
								// allArr[j].lastAllItem = []
							}
						}
					}
				}
				console.log("lastAllLists", lastAllLists, allArr)
				return allArr

			},
			
			shuaLists(){
				console.log("执行了")
				this.getAllArr(this.currentYear, this.currentMonth)
			},

			// 点击 上月
			gotoPreMonth() {
				let {
					year,
					month
				} = this.preMonth(this.currentYear, this.currentMonth)
				this.currentYear = year
				this.currentMonth = month
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
				this.getAllArr(this.currentYear, this.currentMonth)
				this.$emit("gotoNextMonth")
			},



			//滑动事件
			swiperChange(event) {
				console.log("swiper", event.detail)
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
		height: 30px;
		line-height: 30px;
		text-align: center;
		flex-shrink: 0;
		font-size: 24rpx;
		color: #B3B3B3;
	}

	.daysItem {
		height: 100%;
		display: flex;
		flex-wrap: wrap;
		box-sizing: border-box;

		.daysItem-li {
			margin: 0 !important;
			width: 14.28%;
			min-width: 14.28%; // 加入这两个后每个item的宽度就生效了
			max-width: 14.28%; // 加入这两个后每个item的宽度就生效了
			height: calc(100% / 6);
			font-size: 26rpx;
			color: #333333;
			border-bottom: 2rpx solid #F5F5F5;
			font-weight: bold;
			display: flex;
			flex-direction: column;
			align-items: flex-start;
			padding: 10rpx 0 0 10rpx;
			box-sizing: border-box;
			overflow: hidden;
		}

		.item-date {
			height: fit-content;
			padding: 8rpx;
			border-radius: 50%;
			box-sizing: border-box;
			font-size: 24rpx;
		}


	}

	.noCurrent {
		background-color: #F2F2F2;
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

	.nowZiDate {
		background-color: #BBDEFB;
	}

	.nowZiDate-text {
		background-color: #2196F3;
		color: #fff;
	}

	.lastAll {
		width: 100%;
		display: flex;
		flex-direction: column;
	}

	.lastAll-item {
		width: 100%;
		display: flex;
		align-items: center;
	}

	.lastItem-icon {
		display: inline-block;
		width: 30rpx !important;
		height: 30rpx;
		box-sizing: border-box;
	}

	.lastItem-text {
		flex: 1;
		width: 100%;
		margin-left: 4rpx;
		overflow: hidden;
		/*超出部分隐藏*/
		white-space: nowrap;
		/*不换行*/
		text-overflow: ellipsis;
		/*超出部分文字以...显示*/
	}
</style>
