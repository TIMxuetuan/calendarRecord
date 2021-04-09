<template>
	<view style="height: 100%;">
		<!--头部导航栏-->
		<view class="left-jian">
			<headNav :timeListTime="timeListTime"></headNav>
		</view>


		<!--日历内容 开始-->
		<view class="calendarModel">
			<calendar ref="calendar" @gotoPreMonth="gotoPreMonth" @gotoNextMonth="gotoNextMonth" :signLists="signLists"
				:nowTime="nowTime" :currentYear2='currentYear' :currentMonth2="currentMonth" @daysAdd="daysAdd"
				@openDayAllRecord="openDayAllRecord">
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
			<view class="addMode-head">
				<view @click="addActivityClose">退出</view>
				<view @click="configActivity">保存</view>
			</view>
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
						<u-input focus auto-height v-model="rightInput" type="textarea" :border="false"
							:clearable="false" :custom-style="rightTextCustom" />
					</view>
				</view>
			</view>
		</u-popup>

		<!--为事件添加值和说明弹窗-->
		<u-popup v-model="explainShow" z-index="10085" mode="center" width="80%" height="50%" border-radius="10">
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
					<view class="iconCentent-item" :class="item.isPitchOn == true ? 'bgSelect' :''"
						v-for="(item,index) in iconLists" :key="index" @click="selectIcon(item)">
						<u-icon :name="item.name" :color="item.color" size="100"></u-icon>
					</view>
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
				<view class="allRecord-head">
					<view class="allRecord-left">
						<u-icon @click="offAllRecord" name="arrow-leftward" color="#ffffff" size="40"></u-icon>
						<view class="allRecord-text">
							{{dayAllRecordList.currentYear}}年{{dayAllRecordList.currentMonth}}月{{dayAllRecordList.date}}日
						</view>
					</view>
					<view class="allRecord-right">
						<u-icon name="calendar" color="#ffffff" size="40"></u-icon>
					</view>
				</view>
				<view class="allRecord-con">
					<view class="allRecordCon-ul">
						<view class="allRecordCon-li" v-for="(item,index) in dayAllRecordList.lastAllItem" :key="index"
							@click="lineItem(item)">
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
				<view class="echartsModel-top">
					<view class="allRecord-left">
						<u-icon @click="offEchartsModel" name="arrow-leftward" color="#ffffff" size="40"></u-icon>
						<view class="explain-head echartsModel-head" v-if="echartsNowItem">
							<view v-if="echartsNowItem.explainIconValue.icon"
								class="explainHead-icon echartsModel-icon">
								<u-icon :name="echartsNowItem.explainIconValue.icon.name"
									:color="echartsNowItem.explainIconValue.icon.color" size="60"></u-icon>
							</view>
							<view class="explainHead-text echartsModel-text">{{echartsNowItem.explainIconValue.value}}
							</view>
						</view>
					</view>
				</view>
				<view class="echarts-line">
					<view class="charts-box">
						<qiun-data-charts type="line" :echartsH5="true" :echartsApp="true"
							:opts="{enableScroll:true,xAxis:{scrollShow:true,itemCount:4,disableGrid:true}}"
							:chartData="chartData" :ontouch="true" :canvas2d="true" />
					</view>
				</view>
				<view class="echartsModel-bottom">
					<view class="echartsBottom">
						222
					</view>
				</view>
			</view>
		</u-popup>

		<!--保存时，提示-->
		<u-toast ref="uToast" />
	</view>
</template>

<script>
	import headNav from '../../components/headNav/index.vue'; //头部导航组件
	import calendar from '../../components/calendar/calendarNew.vue'; //日历组件--自己写的
	// import calendar from '../../components/lx-calendar/lx-calendar.vue'; //日历组件--=可以使用，但是没有注释，很不好理解
	import tColorPicker from '@/components/t-color-picker/t-color-picker.vue' //颜色选择
	import iconAll from "./iconList.json"
	import products from "../../utils/products.js"
	export default {
		data() {
			return {
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
				chartData: "",
			}
		},
		components: {
			headNav,
			calendar,
			tColorPicker
		},
		onLoad() {
			this.iconLists = this.shencopy(iconAll);
			this.getNowDate();
		},
		methods: {
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
				let getLoca = localStorage.getItem("activityLists");
				if (getLoca != null && getLoca != "") {
					activityLists = JSON.parse(getLoca);
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
					iconSoleId: iconSoleId
				}
				activityLists.push(activityItem);
				linLists = this.activityLists.concat(activityLists);
				localStorage.setItem("activityLists", JSON.stringify(linLists));
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
				localStorage.setItem("nowIconListsItem", JSON.stringify(this.nowIconListsItem))
				this.closeIconModel();
			},

			//不使用图标--将清除现在使用的图标
			noDoneIcon() {
				this.newActivityItem = "";
				localStorage.setItem("nowIconListsItem", "");
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
					let lastAllLists = localStorage.getItem("lastAllLists");
					if (lastAllLists != null && lastAllLists != "") {
						lastAllLists = JSON.parse(lastAllLists);
					} else {
						lastAllLists = [];
					}

					let dayRecord = JSON.parse(localStorage.getItem("dayRecord"))
					let linLists = []
					let lastAllItem = {
						idTime: dayRecord.ziDate,
						dayRecord,
						explainValue: this.explainValue,
						explainNote: this.explainNote,
						explainDateTime: this.explainDateTime,
						explainIconValue: this.explainIconValue,
						isOpen: false,
						soleId: idTime
					}
					linLists.push(lastAllItem)
					lastAllLists = lastAllLists.concat(linLists);
					localStorage.setItem("lastAllLists", JSON.stringify(lastAllLists))
					if (this.dayAllRecordList.lastAllItem != undefined) {
						this.dayAllRecordList.lastAllItem = this.dayAllRecordList.lastAllItem.concat(linLists);
						console.log("对了", this.dayAllRecordList.lastAllItem)
					}
					this.explainShow = false;
					this.$refs.calendar.shuaLists()
					console.log("最终添加", lastAllLists)

				} else {
					//编辑
					let lastAllLists = localStorage.getItem("lastAllLists");
					if (lastAllLists != null && lastAllLists != "") {
						lastAllLists = JSON.parse(lastAllLists);
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
					localStorage.setItem("lastAllLists", JSON.stringify(lastAllLists))

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
				let lastAllLists = localStorage.getItem("lastAllLists");
				if (lastAllLists != null && lastAllLists != "") {
					lastAllLists = JSON.parse(lastAllLists);
				} else {
					lastAllLists = [];
				}
				//删除,更新事件集合内容，并重新存入缓存
				lastAllLists.forEach(item => {
					if (this.deleteRecordItem.soleId == item.soleId) {
						console.log("sss", item, lastAllLists.indexOf(item))
						lastAllLists.splice(lastAllLists.indexOf(item), 1)
					}
				})
				console.log("删除", lastAllLists)
				localStorage.setItem("lastAllLists", JSON.stringify(lastAllLists))

				//删除当前日子里面的记录事件数组，用于页面更新渲染
				let lastAllItem = this.dayAllRecordList.lastAllItem;
				lastAllItem.forEach(item => {
					if (this.deleteRecordItem.soleId == item.soleId) {
						console.log("这一条", item)
						lastAllItem.splice(lastAllLists.indexOf(item), 1)
					}
				})
				this.$refs.calendar.shuaLists()
			},

			//点击记录中的某一条，获得数据，并打开数据分析弹窗
			lineItem(item) {
				let lastAllLists = localStorage.getItem("lastAllLists");
				if (lastAllLists != null && lastAllLists != "") {
					lastAllLists = JSON.parse(lastAllLists);
				} else {
					lastAllLists = [];
				}
				this.echartsModel = true;
				this.echartsNowItem = item;
				console.log("点击某一条", item, lastAllLists)
				let listsAll = [];
				let seriesData = []; //折线图使用的数据值
				lastAllLists.forEach(lists => {
					if (lists.explainIconValue.iconSoleId == item.explainIconValue.iconSoleId) {
						console.log("lists",lists)
						listsAll.push(lists)
						seriesData.push(lists.explainValue)
					}
				})
				console.log("lists总数据", listsAll)
				
				let chartData = {
					// categories: ['2016', '2017', '2018', '2019', '2020', '2021'],
					series: [{
						data: seriesData
						// data: [100, 252, 874, 74, 32, 32, 252, 252, 874, 74, 32, 32, 252, 874, 32, 252, 874,
						// 	32, 252,
						// ]
					}]
				}

				this.chartData = chartData;


			},

			//关闭数据分析弹窗
			offEchartsModel() {
				this.echartsModel = false;
			},



		}
	}
</script>

<style lang="scss" scoped>
	@import "./index.css";
</style>
