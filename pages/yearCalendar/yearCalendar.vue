<template>
	<view class="year-container">
		<view class="">
			<u-navbar height="50" :is-back="false" :border-bottom="false" is-fixed :background="background">
				<view class="container-title">
					<view class="leftIcon">
						<view>
							<u-icon @click="goBack" name="arrow-left" color="#ffffff" size="44"></u-icon>
						</view>
						<view class="timeValue">
							{{echartsNowItem.bt}}  年历
						</view>
					</view>
					<!-- <view class="rightIcon">
						<u-icon @click="openCalendarModel" name="calendar" color="#ffffff" size="36"></u-icon>
					</view> -->
				</view>
			</u-navbar>
		</view>
		<view class="year-model" @touchstart="start" @touchend="end">
			<view class="yearModel-title">
				{{year}}
			</view>
			<view class="yearModel-list">
				<view class="yearList-items" v-for="(item,index) in yearLists" :key="index">
					<view class="yearItems-title">{{item.currentMonth}}月</view>
					<view class="yearItems-body">
						<view class="body-item" v-for="(allItems,index) in item.allArr" :key="index"
							:class="allItems.month == 'current' ? ( allItems.isDayTrue == true ? 'isDay' : 'blockClass') : ''">
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>
<script>
	import products from "../../utils/products.js"
	export default {
		data() {
			return {
				startData: {},
				background: {
					backgroundColor: '#2196F3',
				},
				month_arr: [], //12个月
				currentYear: 2021,
				currentMonth: 4,
				yearLists: [], //一年所有的天数数据
				newLastAllLists: [], //这个记录的数据值--新的，将同一事件循环进一个数组里
				explainIconValue: {}, //当前查看的记录事件
				year:"",
				echartsNowItem:"",
			};
		},
		onLoad() {
			let nowDate = new Date();
			let currentYear = nowDate.getFullYear()
			this.year = currentYear;
			this.disposeLastAllLists(); //从lastAllLists中，将同一事件的数据记录循环遍历出，放在一起
			this.getYearMonth(); //获得一年12个月的数据
			this.echartsNowItem = uni.getStorageSync("echartsNowItem");
			console.log("this.echartsNowItem",this.echartsNowItem)
		},
		methods: {
			...products,

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
						this.year = this.year - 1;
						// console.log('右滑看上一个年',this.year)
						this.getYearMonth(); //获得一年12个月的数据
					} else if (subX < -50) {
						this.year = this.year + 1;
						// console.log('左滑看下一个年',this.year)
						this.getYearMonth(); //获得一年12个月的数据
					} else {
						// console.log('无效')
					}
				}
			},


			//从lastAllLists中，将同一事件的数据记录循环遍历出，放在一起
			disposeLastAllLists() {
				// let explainIconValue = uni.getStorageSync("explainIconValue");
				
				this.newLastAllLists = uni.getStorageSync("lastAllLists");
				console.log("this.newLastAllLists", this.newLastAllLists)
			},

			//返回上一页
			goBack() {
				// this.$router.go(-1)
				uni.navigateBack({
				    delta: 1
				});
			},

			//获得一年12个月
			getYearMonth() {
				var year = this.year,
					month_arr = [];
				for (let m = 1; m <= 12; m++) {
					m = m;
					let items = {
						year: year,
						month: m
					}
					month_arr.push(items)
				}
				this.month_arr = month_arr;
				// console.log("month_arr",month_arr);

				let yearLists = [];
				month_arr.forEach(item => {
					this.getAllArr(item.year, item.month);
					yearLists.push(this.timeList);
				})
				this.yearLists = yearLists;
				console.log("一年的十二月数据", yearLists)
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

				let sendObj = {
					currentYear: currentYear,
					currentMonth: currentMonth,
					yearAndMonth: newi + "-" + currentYear,
					allArr: allArr
				}
				this.timeList = sendObj;
				// console.log("年份",currentMonth,this.timeList)
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

						var conformity = currentYear + "-" + (currentMonth < 10 ? "0" + currentMonth : currentMonth) + "-" + newi;

						currentMonthDateArr.push({
							month: 'current', // 只是为了增加标识，区分上下月
							currentYear: currentYear,
							currentMonth: currentMonth,
							date: newi,
							ziDate: currentYear + "-" + currentMonth + "-" + newi,
							isDayTrue: products.isIndexOf(conformity, this.newLastAllLists)
						})
					}
				}
				this.currentMonthDateLen = currentMonthDateLen
				return currentMonthDateArr
			},
			// 获取当月中，上月多余数据，返回数组
			getPreArr(currentYear, currentMonth) {
				let preMonthDateLen = this.getFirstDateWeek(currentYear, currentMonth) - 1 // 当月1号是周几 == 上月残余天数）
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
		}
	}
</script>

<style lang="scss" scoped>
	@import "./index.css";
</style>
