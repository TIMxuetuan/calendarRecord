<template>
	<view style="height: 100%;">
		<!--头部导航栏-->
		<view class="left-jian">
			<headNav :timeListTime="timeListTime"></headNav>
		</view>


		<!--日历内容 开始-->
		<view class="calendarModel">
			<calendar ref="calendar" @gotoPreMonth="gotoPreMonth" @gotoNextMonth="gotoNextMonth" :signLists="signLists"
				:nowTime="nowTime" :currentYear2='currentYear' :currentMonth2="currentMonth" @daysAdd="daysAdd"></calendar>
		</view>
		<!--日历内容 结束-->

		<!--页面右下角加号-->
		<view class="rightAdd" @click="openRightModel">
			<u-icon name="plus" color="#000000" size="36"></u-icon>
		</view>

		<!--各种事件弹窗-->
		<u-popup v-model="activityShow" mode="bottom" height="50%">
			<view class="activity-centent">
				<view class="activity-head" @click="addActivity">
					<u-icon name="plus" color="#2196F3" size="50"></u-icon>
					<view class="activity-head-text">新增事件</view>
				</view>
				<view class="activityMore">
					<view class="more-item" v-for="(item,index) in activityLists" :key="index" @click="addDayRecord(item)">
						<view class="more-item-icon">
							<u-icon :name="item.icon.name" :color="item.icon.color" size="50"></u-icon>
						</view>
						<view class="activity-head-text">{{item.value}}</view>
					</view>
				</view>
			</view>
		</u-popup>

		<!--添加 各种类型的事件 弹窗（点击新增事件弹出）-->
		<u-popup v-model="addActivityShow" mode="bottom" height="100%">
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
		<u-popup v-model="explainShow" mode="center" width="80%" height="50%" border-radius="10">
			
		</u-popup>

		<!--各种图标 弹窗-->
		<u-popup v-model="iconShow" mode="center" width="80%" height="80%" border-radius="10">
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
		<u-popup v-model="colorShow" mode="center">
			<view class="aaa" v-if="tColorPickerIs">
				<t-color-picker ref="colorPicker" :color="color" @closeColor="closeColor" @confirm="confirm">
				</t-color-picker>
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
				explainShow:false, //

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

				let activityLists = [];
				let activityItem = {
					icon: this.newActivityItem,
					value: this.rightInput
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
			
			//为某一天添加活动时间--例如，为2021-4-02添加 跑步事件
			addDayRecord(item){
				console.log("item",item)
				this.explainShow = true;
			}

		}
	}
</script>

<style lang="scss" scoped>
	@import "./index.css";
</style>
