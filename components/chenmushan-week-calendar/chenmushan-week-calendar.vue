<template>
	<view class="cal">
		<view class="cal-top">
			<text>{{baseData.selectedDate.m && baseData.selectedDate.m.format('YYYY年 MM月DD日')}}</text>
		</view>

		<view class="cal-content">
			<view class="cal-ul cal-weeks">
				<view class="cal-li" v-for="(item,i) of baseData.weekTitles" :key="i">
					<text>{{item}}</text>
				</view>
			</view>

			<swiper ref="calSwiper" class="cal-swiper" :duration="200" circular @animationfinish="swiperFisnish">
				<swiper-item v-for="(days,i) of weeks" :key="i">
					<view class="cal-ul cal-days">
						<view class="cal-li" v-for="(item,i) of days" :key="i" @click="changeSelected(item)">
							<view class="cal-day-li" :class="{'cal-day-li-selected':item.timeSpan == baseData.selectedDate.timeSpan}" :style="{color:item.ym == baseData.selectedDate.ym ? '#333' : '#999'}">
								<text>{{item.d}}</text>
							</view>
						</view>
					</view>
				</swiper-item>
			</swiper>
		</view>
	</view>
</template>

<script>
	import momentJs from './moment.js';

	/**
	 * weekCalendar 周日历选择组件
	 * @description 日历选择某一天的组件
	 * @bug 因是使用swiper组件开发快速滑动多屏 无法触发 @animationfinish 导致展示异常
	 * @property {Date} defaultDate 默认时间
	 * @event {Function} changeDate 当前选中日期发生改变
	 * @example <chenmushan-week-calendar @changeDate="changeDate"></chenmushan-week-calendar>
	 */
	export default {
		props: {
			defaultDate: {
				type: Date,
				default: () => new Date()
			}
		},
		data() {
			return {
				weeks: [],
				baseData: {
					weekTitles: ['日', '一', '二', '三', '四', '五', '六'],
					current: 0,
					selectedDate: {
						d: 0, // 在当前月份中的天
						ym: '', // 年月拼接
						timeSpan: 0, // 时间戳
						m: null // moment时间对象
					}
				}
			};
		},
		mounted() {
			this.initData();
		},
		methods: {
			initData() {
				let lastSat = momentJs(this.defaultDate);

				this.$set(this.baseData, 'selectedDate', {
					d: lastSat.date(),
					ym: `${lastSat.year()}${lastSat.month()}`,
					timeSpan: lastSat.valueOf(),
					m: momentJs(this.defaultDate)
				});

				// 寻找到距离当前日期最近的周六
				while (lastSat.weekday() != 6) lastSat.add(1, 'd');

				this.$set(this.weeks, 0, this.getWeekDaysByLastSat(lastSat));
				this.$set(this.weeks, 1, this.getWeekDaysByWeeks(this.weeks[0], true));
				this.$set(this.weeks, 2, this.getWeekDaysByWeeks(this.weeks[0], false));

				this.$refs.calSwiper.current = 0;
			},
			swiperFisnish(e) {
				let current = e.detail.current;
				this.changeWeeks(current > this.baseData.current, current);
				this.$set(this.baseData, 'upCurrIndex', current);
			},
			changeWeeks(direction, current) {
				let nextIndex = current + 1 > 2 ? 0 : current + 1;
				let prevIndex = current - 1 < 0 ? 2 : current - 1;
				this.$set(this.weeks, nextIndex, this.getWeekDaysByWeeks(this.weeks[current], true));
				this.$set(this.weeks, prevIndex, this.getWeekDaysByWeeks(this.weeks[current], false));
			},
			// 通过周六数据获取一周的数据
			getWeekDaysByLastSat(lastSat) {

				lastSat = momentJs(lastSat);
				let reuslt = [];

				for (var i = 0; i < 7; i++) {
					reuslt.push({
						d: lastSat.date(),
						ym: `${lastSat.year()}${lastSat.month()}`,
						timeSpan: lastSat.valueOf(),
					});

					lastSat.add(-1, 'd');
				}

				return reuslt.reverse();
			},
			// 通过一周的数据获取本周的上周或下周
			getWeekDaysByWeeks(weeks, direction) {
				// 下周
				if (direction) {
					let nextLastSat = momentJs(weeks[weeks.length - 1].timeSpan).add(7, 'd');
					return this.getWeekDaysByLastSat(nextLastSat)
				}
				// 上周
				else {
					let prevLstSat = momentJs(weeks[0].timeSpan).add(-1, 'd');
					return this.getWeekDaysByLastSat(prevLstSat)
				}
			},
			// 修改当前选中
			changeSelected(item) {
				if (this.baseData.selectedDate.timeSpan != item.timeSpan) {
					this.$set(this.baseData, 'selectedDate', {
						...item,
						m: momentJs(item.timeSpan)
					});

					this.$emit('changeDate', this.baseData.selectedDate);
				}
			}
		},
		watch: {
			defaultDate() {
				this.initData();
			}
		},
	}
</script>

<style lang="scss" scoped>
	.cal {
		width: 690rpx;
		height: 254rpx;
		background: #fff;
		margin: 0 auto;
		border-radius: 30rpx;
		overflow: hidden;
	}

	.cal-top {
		width: 690rpx;
		height: 91rpx;
		background: #3ea3ff;
		border-radius: 30rpx 30rpx 0rpx 0rpx;
		line-height: 91rpx;
		text-align: center;

		text {
			font-size: 34rpx;
			font-family: PingFang SC, PingFang SC-Bold;
			font-weight: 700;
			color: #ffffff;
		}
	}

	.cal-content {
		padding: 15rpx 0 40rpx;
	}

	.cal-swiper {
		margin-top: 20rpx;
	}

	.cal-ul {
		position: relative;
		display: flex;
		justify-content: space-between;

		.cal-li {
			width: calc(100% / 7);
			text-align: center;
		}
	}

	.cal-weeks {
		font-size: 28rpx;
		font-weight: 700;
		color: #3ea3ff;
	}

	.cal-days {
		font-size: 30rpx;
		color: #333;
	}

	.cal-day-li {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 63rpx;
		height: 63rpx;
		margin: 0 auto;
	}

	.cal-day-li-selected {
		background-color: #3ea3ff;
		border-radius: 50%;
		color: #fff !important;
	}
</style>
