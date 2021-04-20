<template>
	<view class="allContent">
		<!--头部导航栏-->
		<view class="left-jian">
			<headNav :timeListTime="timeListTime" @openSetModel="openSetModel" @openCalendarModel="openCalendarModel">
			</headNav>
		</view>


		<!--日历内容 开始-->
		<view class="calendarModel">
			<calendar ref="calendar" @gotoPreMonth="gotoPreMonth" @gotoNextMonth="gotoNextMonth" :signLists="signLists"
				:nowTime2="nowTime" :currentYear2='currentYear' :currentMonth2="currentMonth"
				@openDayAllRecord="openDayAllRecord" @editNowTime="editNowTime">
			</calendar>
		</view>
		<!--日历内容 结束-->

		<!--页面右下角加号-->
		<view class="rightAdd" @click="openRightModel">
			<u-icon name="plus" color="#000000" size="36"></u-icon>
		</view>

		<!--各种事件弹窗-->
		<u-popup v-model="activityShow" z-index="10085" mode="bottom" height="50%">
			<view class="activity-centent">
				<view class="activity-head" @click="addActivity">
					<u-icon name="plus" color="#2196F3" size="50"></u-icon>
					<view class="activity-head-text">新增事件</view>
				</view>
				<view class="activityMore">
					<view class="more-item" v-for="(item,index) in activityLists" :key="index"
						@click="addDayRecord(item)">
						<view class="more-item-icon">
							<u-icon :name="item.icon.name" :color="item.icon.color" size="50"></u-icon>
						</view>
						<view class="activity-head-text">{{item.value}}</view>
					</view>
				</view>
			</view>
		</u-popup>

		<!--添加 各种类型的事件 弹窗（点击新增事件弹出）-->
		<u-popup v-model="addActivityShow" z-index="10085" mode="bottom" height="100%">
			<u-navbar height="50" :is-back="false" :border-bottom="false" is-fixed :background="background">
				<view class="addMode-head">
					<view @click="addActivityClose">退出</view>
					<view @click="configActivity">保存</view>
				</view>
			</u-navbar>

			<view class="addMode-body">
				<view class="leftIcon">
					<view v-if="newActivityItem == ''" @click="openIconModel" class="selectIcon">选择</br>图标</view>
					<view v-else @click="openIconModel" class="selectIcon">
						<u-icon :name="newActivityItem.name" :color="newActivityItem.color" size="100"></u-icon>
					</view>
				</view>
				<view class="rightText">
					<view class="rightText-titile">事件名称</view>
					<view class="rightText-input">
						<u-input :focus="false" auto-height v-model="rightInput" type="textarea" :border="false"
							:clearable="false" :custom-style="rightTextCustom" />
					</view>
				</view>
			</view>
		</u-popup>

		<!--为事件添加值和说明弹窗-->
		<u-popup v-model="explainShow" z-index="10085" mode="center" width="80%" border-radius="10">
			<view class="explain-centent">
				<view class="explain-head">
					<view class="explainHead-icon">
						<u-icon v-if="explainIconValue" :name="explainIconValue.icon.name"
							:color="explainIconValue.icon.color" size="80"></u-icon>
					</view>
					<view class="explainHead-text">{{explainIconValue.value}}</view>
				</view>
				<view class="explain-body">
					<view class="explainBody-item">
						<view class="explainBody-title">数值:</view>
						<view class="explainBody-input">
							<u-input v-model="explainValue" type="number" :border="false" :clearable="false"
								:custom-style="explainCustom" placeholder="" />
						</view>
					</view>
					<view class="explainBody-item">
						<view class="explainBody-title">备注:</view>
						<view class="explainBody-input">
							<u-input v-model="explainNote" type="text" :border="false" :clearable="false"
								:custom-style="explainCustom" placeholder="" />
						</view>
					</view>
				</view>
				<view class="explain-time">
					<view class="">创建时间:</view>
					<view class="explainTime-year">{{explainDate}} {{explainTime}}</view>
				</view>

				<view class="explain-affirm" @click="explainComfig">确认</view>
			</view>
		</u-popup>

		<!--各种图标 弹窗-->
		<u-popup v-model="iconShow" z-index="10085" mode="center" width="80%" height="80%" border-radius="10">
			<view class="icon-content">
				<view class="iconTop">
					<view>图标:</view>
					<view class="iconTop-right">
						<view class="">颜色</view>
						<view @click="openColorModel" class="iconTop-color" :style="{backgroundColor:newColor}"></view>
					</view>
				</view>
				<view class="iconCentent">
					<scroll-view scroll-y="true" class="scroll-Y" :enable-flex="true">
						<view class="iconCentent-item" :class="item.isPitchOn == true ? 'bgSelect' :''"
							v-for="(item,index) in iconLists" :key="index" @click="selectIcon(item)">
							<u-icon :name="item.name" :color="item.color" size="100"></u-icon>
						</view>
					</scroll-view>
				</view>
				<view class="iconBottom">
					<view @click="noDoneIcon">不使用</view>
					<view class="iconBottom-two">
						<view class="iconBottom-no" @click="closeIconModel">取消</view>
						<view @click="confirmIcon">确定</view>
					</view>
				</view>
			</view>
		</u-popup>

		<!--各种图标 弹窗-->
		<u-popup v-model="colorShow" z-index="10085" mode="center">
			<view class="aaa" v-if="tColorPickerIs">
				<t-color-picker ref="colorPicker" :color="color" @closeColor="closeColor" @confirm="confirm">
				</t-color-picker>
			</view>
		</u-popup>

		<!--某一天里所有记录的 弹窗-->
		<u-popup class="allRecord" z-index="10065" v-model="dayAllRecord" mode="center" width="100%" height="100%">
			<view class="allRecord-body">
				<u-navbar height="50" :is-back="false" :border-bottom="false" is-fixed :background="background">
					<view class="allRecord-head">
						<view class="allRecord-left">
							<u-icon @click="offAllRecord" name="arrow-leftward" color="#ffffff" size="40"></u-icon>
							<view class="allRecord-text">
								{{dayAllRecordList.currentYear}}年{{dayAllRecordList.currentMonth}}月{{dayAllRecordList.date}}日
							</view>
						</view>
						<view class="allRecord-right">
							<!-- <u-icon name="calendar" color="#ffffff" size="40"></u-icon> -->
						</view>
					</view>
				</u-navbar>
				<view class="allRecord-con">
					<view class="allRecordCon-ul">
						<view class="allRecordCon-li" v-for="(item,index) in dayAllRecordList.lastAllItem" :key="index"
							@click="lineItem(item,'allRecord')">
							<view class="recordLi-top">
								<view class="recordTop-head">
									<view class="recordHead-left">
										<u-icon :name="item.explainIconValue.icon.name"
											:color="item.explainIconValue.icon.color" size="40"></u-icon>
										<view class="recordHead-left-text">
											{{item.explainIconValue.value}}
										</view>
									</view>
									<view class="" @click.stop>
										<u-icon v-if="!item.isOpen" @click="openRecordHide(item,true)" name="arrow-down"
											color="#000" size="40"></u-icon>
										<u-icon v-else name="arrow-up" @click="openRecordHide(item,false)" color="#000"
											size="40"></u-icon>
									</view>
								</view>
								<view class="recordTop-value">{{item.explainValue}}</view>
								<view class="">{{item.explainNote}}</view>
							</view>
							<view class="recordLi-hide" v-if="item.isOpen">
								<view class="recordHide-top">
									<view class="">创建时间:</view>
									<view class="recordHide-time">
										<view class="">
											{{item.explainDateTime.year}}年{{item.explainDateTime.month}}月{{item.explainDateTime.date}}日
										</view>
										<view class="">
											{{item.explainDateTime.hours < 12 ? '上午' + item.explainDateTime.hours : '下午' + (item.explainDateTime.hours - 12)}}:{{item.explainDateTime.minutes < 10 ? '0' + item.explainDateTime.minutes : item.explainDateTime.minutes }}
										</view>
									</view>
								</view>
								<view class="recordHide-btn">
									<view class="" @click.stop>
										<u-icon @click="recordDelete(item)" name="trash-fill" color="#727272" size="40">
										</u-icon>
									</view>
									<view class="" @click.stop>
										<u-icon @click="recordEdit(item)" name="edit-pen-fill" color="#727272"
											size="40"></u-icon>
									</view>
								</view>
							</view>
						</view>
					</view>
				</view>
				<view class="rightAdd" @click="openRightModel">
					<u-icon name="plus" color="#000000" size="36"></u-icon>
				</view>
			</view>
		</u-popup>

		<!--删除记录确认弹窗-->
		<u-modal v-model="deleteShow" show-cancel-button content="确定删除这条记录吗？" confirm-color="red"
			@confirm="confirmRecord"></u-modal>

		<!--点击某一天中的某条记录，查看此条记录的所有数据分析弹窗-->
		<u-popup class="echartsModel" z-index="10085" v-model="echartsModel" mode="center" width="100%" height="100%">
			<view class="echartsModel-body">
				<u-navbar height="50" :is-back="false" :border-bottom="false" is-fixed :background="background">
					<view class="echartsModel-top">
						<view class="allRecord-left">
							<u-icon @click="offEchartsModel" name="arrow-leftward" color="#ffffff" size="40"></u-icon>
							<view class="explain-head echartsModel-head" v-if="echartsNowItem">
								<view v-if="echartsNowItem.icon" class="explainHead-icon echartsModel-icon">
									<u-icon :name="echartsNowItem.icon.name" :color="echartsNowItem.icon.color"
										size="60"></u-icon>
								</view>
								<view class="explainHead-text echartsModel-text">
									{{echartsNowItem.value}}
								</view>
							</view>
						</view>
						<view class="allRecord-right">
							<u-icon @click="yearCalendar" name="list" color="#ffffff" size="50"></u-icon>
						</view>
					</view>
				</u-navbar>
				<view class="echarts-line" v-if="yearLists != ''">
					<view class="charts-box">
						<view class="charts-box">
							<qiun-data-charts type="line" canvasId="scrolllineid" :eopts="ringOpts"
								:chartData="chartDataOne" :animation="false" :ontouch="true" :canvas2d="true"
								:echartsH5="true" :echartsApp="true" />
						</view>
					</view>
				</view>
				<view class="echartsModel-statistics" v-if="yearLists != ''">
					<view class="echartsStatistics">
						<view class="ecStatistics-start">
							<view class="dataStart">
								起止时间
							</view>
							<view class="dataStart-right">
								所有时间
							</view>
						</view>
						<view class="ecStatistics-analyse">
							<view class="analyse-item">
								<view class="analyseItem-title">
									{{analyseList.countName}}
								</view>
								<view class="analyseItem-value">
									{{analyseList.countValue}}
								</view>
							</view>
							<view class="analyse-item">
								<view class="analyseItem-title">
									{{analyseList.sumName}}
								</view>
								<view class="analyseItem-value">
									{{analyseList.sumValue}}
								</view>
							</view>
							<view class="analyse-item">
								<view class="analyseItem-title">
									{{analyseList.avgName}}
								</view>
								<view class="analyseItem-value">
									{{analyseList.avgValue}}
								</view>
							</view>
							<view class="analyse-item">
								<view class="analyseItem-title">
									{{analyseList.peakName}}
								</view>
								<view class="analyseItem-value">
									{{analyseList.peakValue}}
								</view>
							</view>
							<view class="analyse-item">
								<view class="analyseItem-title">
									{{analyseList.minName}}
								</view>
								<view class="analyseItem-value">
									{{analyseList.minValue}}
								</view>
							</view>
						</view>
					</view>
				</view>
				<view class="echartsModel-bottom" v-if="yearLists != ''">
					<view class="echartsBottom">
						<view class="ecbottomItem" v-for="(item,index) in yearLists" :key="index">
							<!-- <view class="ecbottomItem"> -->
							<view class="ecbottomItem-head">
								{{item.yearItem}}
							</view>
							<view class="ecbottomItem-body">
								<view class="ecbottomItem-body-item" v-for="(items,index) in item.dataItem"
									:key="index">
									<view class="ecbottomBody-top">
										<view class="ecbottomBody-top-year">
											{{timeSwitch(items.dayRecord,items.explainDateTime)}}
										</view>
										<view class="">
											{{items.explainValue}}.00
										</view>
									</view>
									<view class="ecbottomBody-remark">
										{{items.explainNote}}
									</view>
								</view>
							</view>
						</view>
					</view>
				</view>
				<view v-if="yearLists == ''" class="noData">
					<image class="noData-img" src="../../static/noData.jpg" mode=""></image>
				</view>
			</view>

		</u-popup>

		<!--日历弹窗-->
		<u-calendar v-model="calendarModel" z-index="10085" max-date="9999-01-01" :safe-area-inset-bottom="true"
			mode="date" @change="changeTimeModel"></u-calendar>

		<!--左侧设置弹窗-->
		<u-popup z-index="10085" v-model="settingModel" mode="left" width="80%" height="100%">
			<view class="settingModel">
				<u-navbar height="50" :is-back="false" :border-bottom="false" is-fixed :background="background">
				</u-navbar>
				<view class="settingModel-icon">
					<scroll-view scroll-y="true" class="scroll-Y" :enable-flex="true">
						<view class="settingIcon">
							<u-swipe-action :show="item.show" :index="index" v-for="(item,index) in setModelIcon"
								:key="index" @content-click="dianContent" @click="clickSettingIcon"
								@open="openSettingIcon" :options="setOptions">
								<view class="settingIcon-item">
									<view class="setIconItem-left">
										<u-icon :name="item.icon.name" :color="item.icon.color" size="100"></u-icon>
									</view>
									<view class="setIconItem-right">{{item.value}}</view>
								</view>
							</u-swipe-action>
							<!-- <view class="settingIcon-item" v-for="(item,index) in setModelIcon" :key="index">
								<view class="setIconItem-left">
									<u-icon :name="item.icon.name" :color="item.icon.color" size="100"></u-icon>
								</view>
								<view class="setIconItem-right">{{item.value}}</view>
							</view> -->
						</view>
					</scroll-view>
				</view>
				<view class="">

				</view>
			</view>
		</u-popup>

		<!--删除记录确认弹窗-->
		<u-modal v-model="deleteSetIcon" z-index="10085" show-cancel-button content="确定删除这条记录吗？" confirm-color="red"
			@confirm="confirmSetIcon"></u-modal>

		<!--保存时，提示-->
		<u-toast ref="uToast" />
	</view>
</template>

<script>
	// import uCharts from '@/components/u-charts.js';
	import headNav from '../../components/headNav/index.vue'; //头部导航组件
	import calendar from '../../components/calendar/calendarNew.vue'; //日历组件--自己写的
	// import calendar from '../../components/lx-calendar/lx-calendar.vue'; //日历组件--=可以使用，但是没有注释，很不好理解
	import tColorPicker from '@/components/t-color-picker/t-color-picker.vue' //颜色选择
	import iconAll from "./iconList.json"
	import products from "../../utils/products.js"
	export default {
		data() {
			return {
				background: {
					backgroundColor: '#2196F3',
				},
				iconAllNew: [], //icon数据
				nowTime: "", //当天年月日  "2020-11-28"
				currentYear: "",
				currentMonth: "",
				signLists: [],
				list: [],
				timeListTime: "",
				activityShow: false, //控制活动事件弹窗显示
				activityLists: [], //存放预选活动事件集合
				tColorPickerIs: false,
				color: {
					r: 0,
					g: 0,
					b: 0,
					a: 1
				},
				newColor: "#000000",
				addActivityShow: false, //控制添加各种类型的事件弹窗
				rightInput: "",
				rightTextCustom: {
					borderBottom: "1px solid #2196F3",
					fontSize: "80rpx"
				},
				iconShow: false, //控制 icon弹窗显示
				iconLists: [], //icon图标集合数据
				nowIconListsItem: "", //当前点击选中的icon图标
				colorShow: false, //控制颜色选择器弹窗显示
				newActivityItem: "", //确定添加图标后，将图标内容存进这里
				timeListNow: "", //给子组件更新用的监听中间值
				explainShow: false, //是否显示事件的值、备注弹窗
				explainIconValue: "", //选择的事件图标和名字
				explainValue: "", //填写的数值
				explainNote: "", //备注
				explainCustom: {
					borderBottom: "2px solid #2196F3",
					fontSize: "40rpx"
				},
				explainDateTime: "",
				explainDate: "",
				explainTime: "",

				dayAllRecord: false, //控制某一天里所有记录的弹窗显示
				dayAllRecordList: [], //某天的所有记录数据
				editLinShi: "", //点击编辑时，存进临时数据里
				deleteShow: false,
				deleteRecordItem: "", //点击删除图标时，将数据暂时存入
				echartsModel: false, //控制echarts分析弹窗
				echartsNowItem: "", //当前选定的单条记录
				chartDataOne: "",
				ringOpts: null,
				yearLists: [], //年份合集
				calendarModel: false, //控制日历弹窗
				settingModel: false, //控制左侧设置弹窗
				setModelIcon: [], //左侧设置弹窗Icon事件合集
				setOptions: [{
					text: '删除',
					style: {
						backgroundColor: '#dd524d'
					}
				}],
				deleteSetIcon: false,
				setIconIndex: "", //点击删除时，获得的下标
				analyseList: { //统计的值
					countName: "数量",
					countValue: 0,
					sumName: "总数",
					sumValue: 0,
					avgName: "平均值",
					avgValue: 0,
					peakName: "最高值",
					peakValue: 0,
					minName: "最低值",
					minValue: 0,
				}
			}
		},
		components: {
			headNav,
			calendar,
			tColorPicker
		},
		onLoad() {
			this.cWidth = uni.upx2px(750);
			this.cHeight = uni.upx2px(500);
			this.iconLists = this.shencopy(iconAll);
			this.getNowDate();
		},
		methods: {
			...products,
			//为图标数组深拷贝出来一份
			shencopy(obj) {
				if (typeof obj !== 'object') {
					return obj
				}
				var res = Array.isArray(obj) ? [] : {};
				for (let i in obj) {
					res[i] = this.shencopy(obj[i]);
				}
				return res
			},

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
				this.timeListTime = this.currentMonth + "月" + "-" + this.currentYear;
				console.log("滴滴滴", this.timeListTime, this.currentYear, this.currentMonth, this.nowTime)
			},

			//点击上一月
			gotoPreMonth() {
				this.timeListTime = this.$refs.calendar.timeList.currentMonth + "月" + "-" + this.$refs.calendar.timeList
					.currentYear;
				this.currentYear = this.$refs.calendar.currentYear
				this.currentMonth = this.$refs.calendar.currentMonth
			},

			//下一月
			gotoNextMonth() {
				this.timeListTime = this.$refs.calendar.timeList.currentMonth + "月" + "-" + this.$refs.calendar.timeList
					.currentYear;
				this.currentYear = this.$refs.calendar.currentYear;
				this.currentMonth = this.$refs.calendar.currentMonth;
			},

			//点击右下角，打开事件弹窗
			openRightModel() {
				this.activityShow = true;
				let activityLists = [];
				let getLoca = uni.getStorageSync("activityLists");
				console.log("getLoca", getLoca)
				if (getLoca != null && getLoca != "") {
					activityLists = getLoca;
				} else {
					activityLists = [];
				}
				this.activityLists = activityLists;
			},

			//打开添加事件弹窗--并给icon
			addActivity() {
				this.addActivityShow = true;
			},

			//关闭添加事件弹窗--并清空值
			addActivityClose() {
				this.newActivityItem = "";
				this.rightInput = "";
				this.addActivityShow = false;
			},

			//保存-- 将选择好的图标和内容，保存进一个数组，并保存本地缓存
			configActivity() {
				if (this.rightInput == "") {
					this.$refs.uToast.show({
						title: '请填写内容',
						type: 'error',
						icon: false
					})
					return
				}

				let linLists = [];
				let timestamp = (new Date()).getTime();
				let iconSoleId = timestamp + products.randomNum();
				let activityLists = [];
				let activityItem = {
					icon: this.newActivityItem,
					value: this.rightInput,
					iconSoleId: iconSoleId,
					show: false
				}
				activityLists.push(activityItem);
				linLists = this.activityLists.concat(activityLists);
				uni.setStorageSync("activityLists", linLists);
				this.$nextTick(() => {
					this.activityLists = linLists;
				});
				this.addActivityClose();
			},

			//打开icon图标弹窗
			openIconModel() {
				this.iconShow = true;
				this.disposeIcon(this.newColor);
			},

			//打开颜色选择器弹窗
			openColorModel() {
				this.colorShow = true;
				this.tColorPickerIs = true
				this.$nextTick(() => {
					this.$refs.colorPicker.open();
				});
			},

			//颜色选择器 选中的颜色
			confirm(event) {
				this.colorShow = false;
				console.log('颜色选择器返回值：', event)
				this.color = event.rgba;
				this.newColor = event.hex;
				this.disposeIcon(event.hex);
			},

			//处理icon数组的数据结构，以及添加 isPitchOn--是否选中
			disposeIcon(color) {
				let item = this.nowIconListsItem;
				let newList = [];
				let all = this.iconLists;
				for (var i = 0; i < all.length; i++) {
					if (all[i].isPitchOn == true) {
						this.nowIconListsItem = all[i];
					} else {
						all[i].isPitchOn = false;
					}
					all[i].color = color;
					newList.push(all[i])
				}
				this.iconLists = this.shencopy(newList);
			},

			//关闭颜色选择器
			closeColor() {
				this.colorShow = false;
			},

			//选择icon图标
			selectIcon(item) {
				let array = this.iconLists;
				let newArray = [];
				for (var i = 0; i < array.length; i++) {
					item.name == array[i].name ? array[i].isPitchOn = true : array[i].isPitchOn = false;
					newArray.push(array[i])
				}
				this.iconLists = newArray;
				this.nowIconListsItem = item;
			},

			//关闭选择icon图标弹窗
			closeIconModel() {
				this.iconShow = false;
			},

			//确定使用选中的图标
			confirmIcon() {
				this.newActivityItem = this.nowIconListsItem;
				uni.setStorageSync("nowIconListsItem", this.nowIconListsItem)
				this.closeIconModel();
			},

			//不使用图标--将清除现在使用的图标
			noDoneIcon() {
				this.newActivityItem = "";
				uni.setStorageSync("nowIconListsItem", "");
				this.closeIconModel();
			},

			//为某一天添加活动事件 ，打开弹窗，并初始化--例如，为2021-4-02添加 跑步事件
			addDayRecord(item) {
				this.explainShow = true;
				this.activityShow = false;
				this.explainIconValue = item;
				this.explainValue = "";
				this.explainNote = "";
				let nowDate = new Date();
				let year = nowDate.getFullYear()
				let month = nowDate.getMonth() + 1
				let date = nowDate.getDate()
				let hours = nowDate.getHours()
				let minutes = nowDate.getMinutes()
				this.explainDateTime = {
					year,
					month,
					date,
					hours,
					minutes,
				}
				this.explainDate = year + "年" + month + "月" + date + "日"
				if (hours < 12) {
					this.explainTime = "上午" + hours + ":" + (minutes < 10 ? '0' + minutes : minutes)
				} else {
					hours = hours - 12
					this.explainTime = "下午" + hours + ":" + (minutes < 10 ? '0' + minutes : minutes)
				}

				console.log("item", this.explainDateTime)
			},

			//添加活动事件弹窗,最终添加按钮事件
			explainComfig() {
				if (this.editLinShi == "") {
					//新增
					let timestamp = (new Date()).getTime();
					let idTime = timestamp + products.randomNum();
					console.log("idTime", idTime)
					let lastAllLists = uni.getStorageSync("lastAllLists");
					if (lastAllLists != null && lastAllLists != "") {
						lastAllLists = lastAllLists;
					} else {
						lastAllLists = [];
					}

					let dayRecord = uni.getStorageSync("dayRecord")
					let linLists = []
					let lastAllItem = {
						idTime: dayRecord.ziDate,
						dayRecord,
						explainValue: this.explainValue,
						explainNote: this.explainNote,
						explainDateTime: this.explainDateTime,
						explainIconValue: this.explainIconValue,
						isOpen: false,
						soleId: idTime,
						presentYear: dayRecord.currentYear
					}
					linLists.push(lastAllItem)
					lastAllLists = lastAllLists.concat(linLists);
					uni.setStorageSync("lastAllLists", lastAllLists)
					if (this.dayAllRecordList.lastAllItem != undefined) {
						this.dayAllRecordList.lastAllItem = this.dayAllRecordList.lastAllItem.concat(linLists);
						console.log("对了", this.dayAllRecordList.lastAllItem)
					}
					this.explainShow = false;
					this.$refs.calendar.shuaLists()
					console.log("最终添加", lastAllLists)

				} else {
					//编辑
					let lastAllLists = uni.getStorageSync("lastAllLists");
					if (lastAllLists != null && lastAllLists != "") {
						lastAllLists = lastAllLists;
					} else {
						lastAllLists = [];
					}
					console.log("编辑", this.editLinShi, lastAllLists)
					//更新事件集合内容，并重新存入缓存
					lastAllLists.forEach(item => {
						if (this.editLinShi.soleId == item.soleId) {
							item.explainValue = this.explainValue;
							item.explainNote = this.explainNote;
						}
					})
					uni.setStorageSync("lastAllLists", lastAllLists)

					//修改当前日子里面的记录事件数组，用于页面更新渲染
					let lastAllItem = this.dayAllRecordList.lastAllItem;
					lastAllItem.forEach(item => {
						if (this.editLinShi.soleId == item.soleId) {
							console.log("这一条", item)
							item.explainValue = this.explainValue;
							item.explainNote = this.explainNote;
						}
					})
					this.editLinShi = "";
					this.explainShow = false;
					this.$refs.calendar.shuaLists()
				}
			},

			//打开某一天所有记录 弹窗，并获得所有记录
			openDayAllRecord(list) {
				console.log("list", list)
				this.dayAllRecord = true;
				this.dayAllRecordList = list;
			},

			//关闭某一天所有记录 弹窗，并获得所有记录
			offAllRecord() {
				this.dayAllRecord = false;
				this.dayAllRecordList = []
			},

			//切换记录隐藏内容的显示
			openRecordHide(value, type) {
				value.isOpen = type;
				this.$forceUpdate()
			},

			//点击修改 获取当条记录的数值和备注，并渲染弹窗， 最后点击确认时，执行explainComfig事件，但是需要传入判断（新增和编辑）
			recordEdit(item) {
				this.editLinShi = item;
				this.explainShow = true;
				this.explainIconValue = item.explainIconValue;
				this.explainValue = item.explainValue;
				this.explainNote = item.explainNote;
				let time = item.explainDateTime;
				this.explainDate = time.year + "年" + time.month + "月" + time.date + "日"
				if (time.hours < 12) {
					this.explainTime = "上午" + time.hours + ":" + (time.minutes < 10 ? '0' + time.minutes : time.minutes)
				} else {
					let hours = time.hours - 12
					this.explainTime = "下午" + hours + ":" + (time.minutes < 10 ? '0' + time.minutes : time.minutes)
				}
			},

			//点击删除图标，获得值并打开弹窗
			recordDelete(item) {
				console.log("删除", item)
				this.deleteRecordItem = item;
				this.deleteShow = true;
			},

			//点击删除弹窗确认按钮
			confirmRecord() {
				console.log("确定", this.deleteRecordItem)
				let lastAllLists = uni.getStorageSync("lastAllLists");
				if (lastAllLists != null && lastAllLists != "") {
					lastAllLists = lastAllLists;
				} else {
					lastAllLists = [];
				}
				console.log("lastAllLists", lastAllLists)
				//删除,更新事件集合内容，并重新存入缓存
				lastAllLists.forEach(item => {
					if (this.deleteRecordItem.soleId == item.soleId) {
						console.log("sss", item, lastAllLists.indexOf(item))
						lastAllLists.splice(lastAllLists.indexOf(item), 1)
					}
				})
				console.log("删除", lastAllLists)
				uni.setStorageSync("lastAllLists", lastAllLists)

				//删除当前日子里面的记录事件数组，用于页面更新渲染
				let lastAllItem = this.dayAllRecordList.lastAllItem;
				console.log("this.dayAllRecordList.lastAllItem", this.dayAllRecordList.lastAllItem)
				lastAllItem.forEach(item => {
					if (this.deleteRecordItem.soleId == item.soleId) {
						console.log("这一条", item, lastAllItem.indexOf(item))
						lastAllItem.splice(lastAllItem.indexOf(item), 1)
					}
				})
				this.dayAllRecordList.lastAllItem = lastAllItem;
				this.$refs.calendar.shuaLists()
			},

			//点击记录中的某一条，获得数据，并打开数据分析弹窗
			lineItem(value, type) {
				console.log("底", value, type)
				let lastAllLists = uni.getStorageSync("lastAllLists");
				if (lastAllLists != null && lastAllLists != "") {
					lastAllLists = lastAllLists;
				} else {
					lastAllLists = [];
				}
				this.echartsModel = true;

				let item = value
				let itemIconSoleId = "";
				if (type == "allRecord") {
					itemIconSoleId = value.explainIconValue.iconSoleId
					this.echartsNowItem = value.explainIconValue;
					uni.setStorageSync("explainIconValue", value.explainIconValue)
				} else if (type == "dianContent") {
					itemIconSoleId = value.iconSoleId
					this.echartsNowItem = value;
					uni.setStorageSync("explainIconValue", value)
				}

				let listsAll = [];
				let seriesData = []; //折线图使用的数据值
				let timeJointAll = []
				let res = {}
				lastAllLists.sort(function(a, b) {
					return b.presentYear - a.presentYear;
				})
				console.log("lastAllLists", item, lastAllLists)

				let peakMinList = [];
				let sumValue = 0;
				let avgValue = 0;

				for (var i = 0; i < lastAllLists.length; i++) {
					if (lastAllLists[i].explainIconValue.iconSoleId == itemIconSoleId) {
						//选择的日期（dayRecord）
						let exTime = lastAllLists[i].dayRecord
						let cjTime = lastAllLists[i].explainDateTime
						let explainDate = exTime.currentYear + "年" + exTime.currentMonth + "月" + exTime.date
						let explainTime = "";
						if (cjTime.hours < 12) {
							explainTime = "上午" + cjTime.hours + ":" + (cjTime.minutes < 10 ? '0' + cjTime.minutes :
								cjTime.minutes)
						} else {
							let hours = cjTime.hours - 12
							explainTime = "下午" + hours + ":" + (cjTime.minutes < 10 ? '0' + cjTime.minutes : cjTime
								.minutes)
						}
						let timeJoint = explainDate + " " + explainTime
						listsAll.push(lastAllLists[i])
						seriesData.push(lastAllLists[i].explainValue)
						timeJointAll.push(timeJoint)
						res[lastAllLists[i].presentYear] = res[lastAllLists[i].presentYear] || [];
						res[lastAllLists[i].presentYear].push(lastAllLists[i]); //将所有的item列放入到对应的className中

						let explainValue = Number(lastAllLists[i].explainValue * 1)
						sumValue += explainValue //求和
						peakMinList.push(lastAllLists[i].explainValue * 1)
						avgValue = sumValue / peakMinList.length; //求平均值
						peakMinList.sort(function(a, b) {
							return b - a;
						})
					}
				}
				console.log("sumValue", sumValue, avgValue, peakMinList)
				this.analyseList = {
						countName: "数量",
						countValue: peakMinList.length,
						sumName: "总数",
						sumValue: sumValue,
						avgName: "平均值",
						avgValue: avgValue.toFixed(2),
						peakName: "最高值",
						peakValue: peakMinList[0],
						minName: "最低值",
						minValue: peakMinList[peakMinList.length - 1],
				}

				//将对象转为数组
				let newRes = []
				for (let items in res) {
					let newItem = {
						yearItem: items,
						dataItem: res[items]
					}
					newRes.push(newItem)
				}
				newRes.sort(function(a, b) {
					return b.yearItem - a.yearItem;
				})
				console.log("newRes", newRes)
				this.yearLists = newRes
				console.log("this.yearLists", this.yearLists)


				//渐变色区域图
				let linearareadata = {
					// categories: ["1","2","3","4","5","6","7","8","9","10"],
					categories: timeJointAll,
					series: [{
						data: seriesData,
						type: 'line',
						symbolSize: 10
					}],
				}
				let ringOpts = {
					// 缩放平移组件
					tooltip: {
						trigger: 'item'
					},
					xAxis: {
						type: 'category',
						show: false
					},
					yAxis: {
						type: 'value',
						axisTick: {
							inside: true
						},
						scale: true,
						axisLabel: {
							show: true,
							margin: 8,
						},
					},
					grid: {
						left: 60
					},
					dataZoom: [{
						type: 'inside',
						show: true,
						start: 0,
						end: 60,
						handleSize: 8
					}],
				}
				this.ringOpts = ringOpts
				this.chartDataOne = linearareadata;
				this.$forceUpdate();

			},

			//关闭数据分析弹窗
			offEchartsModel() {
				this.echartsModel = false;
			},

			//打开日历弹窗
			openCalendarModel() {
				this.calendarModel = true;
			},

			//点击确定获得某一天的信息
			changeTimeModel(value) {
				let oneTime = this.currentYear + "-" + this.currentMonth;
				let twoTime = value.year + "-" + value.month;
				console.log("value", oneTime, twoTime, value)
				this.currentYear = value.year
				this.currentMonth = value.month
				let currentDate = value.day
				if (currentDate < 10) {
					this.currentDate = "0" + currentDate
				} else {
					this.currentDate = currentDate
				}
				this.nowTime = this.currentYear + "-" + this.currentMonth + "-" + this.currentDate
				this.timeListTime = this.currentMonth + "月" + "-" + this.currentYear;
				console.log("点击确定", this.timeListTime, this.currentYear, this.currentMonth, this.nowTime)
				if (oneTime == twoTime) {
					console.log("还在这一月")
				}
			},

			//点击某一天后修改 nowTime2 的值
			editNowTime(value) {
				console.log("value", value)
				this.nowTime = value.ziDate;
			},

			//打开左侧的设置弹窗
			openSetModel() {
				this.settingModel = true;
				let activityLists = [];
				let getLoca = uni.getStorageSync("activityLists");
				if (getLoca != null && getLoca != "") {
					activityLists = getLoca;
				} else {
					activityLists = [];
				}
				this.setModelIcon = activityLists;
				console.log("this.setModelIcon", this.setModelIcon)
			},

			//左侧的设置弹窗--点击内容事件（与下面的不同）
			dianContent(index) {
				console.log("index", index, this.setModelIcon[index])
				this.lineItem(this.setModelIcon[index], "dianContent")
				this.settingModel = false;
			},

			//左侧的设置弹窗--点击 删除或者收藏等操作事件
			clickSettingIcon(index, index1) {
				this.setIconIndex = index
				this.deleteSetIcon = true;
			},

			//设置列表里删除 某一事件
			confirmSetIcon() {
				this.setModelIcon.splice(this.setIconIndex, 1);
				uni.setStorageSync("activityLists", this.setModelIcon);
			},

			// 如果打开一个的时候，不需要关闭其他，则无需实现本方法
			openSettingIcon(index) {
				// 先将正在被操作的swipeAction标记为打开状态，否则由于props的特性限制，
				// 原本为'false'，再次设置为'false'会无效
				console.log("划开", index, this.setModelIcon)
				let lsList = this.setModelIcon
				lsList[index].show = true;
				lsList.map((val, idx) => {
					if (val.iconSoleId != lsList[index].iconSoleId) val.show = false;
				})
				this.setModelIcon = lsList;
			},
			
			//点击跳转到年历页面
			yearCalendar(){
				console.log("跳转")
				uni.navigateTo({
				    url: '/pages/yearCalendar/yearCalendar'
				});
			}

		}
	}
</script>

<style lang="scss" scoped>
	@import "./index.css";
</style>
