<template>
	<view style="height: 100%;">
		<!--头部导航栏-->
		<view class="left-jian">
			<headNav :timeListTime="timeListTime"></headNav>
		</view>


		<!--日历内容 开始-->
		<view class="calendarModel">
			<calendar ref="calendar" @gotoPreMonth="gotoPreMonth" @gotoNextMonth="gotoNextMonth" :signLists="signLists"
				:nowTime="nowTime" :currentYear2='currentYear' :currentMonth2="currentMonth"></calendar>
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
					<view class="more-item" v-for="index in 50">
						<u-icon name="plus" color="#2196F3" size="50"></u-icon>
						<view class="activity-head-text">{{index}}</view>
					</view>
				</view>
			</view>
		</u-popup>

		<!--添加 各种类型的事件 弹窗（点击新增事件弹出）-->
		<u-popup v-model="addActivityShow" mode="bottom" height="100%">
			<view class="addMode-head">
				<view @click="addActivityShow = false">退出</view>
				<view>保存</view>
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
						<u-input focus auto-height v-model="rightInput" type="textarea" :border="false" :clearable="false" :custom-style="rightTextCustom" />
					</view>
				</view>
			</view>
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
					<view class="iconCentent-item" :class="item.isPitchOn == true ? 'bgSelect' :''" v-for="(item,index) in iconLists" :key="index" @click="selectIcon(item)">
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
				<t-color-picker ref="colorPicker" :color="color" @closeColor="closeColor" @confirm="confirm"></t-color-picker>
			</view>
		</u-popup>
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
				nowTime: "", //当天年月日  "2020-11-28"
				currentYear: "",
				currentMonth: "",
				signLists: [],
				list: [],
				timeListTime: "",
				activityShow: false, //控制活动事件弹窗显示
				tColorPickerIs: false,
				color: {
					r: 0,
					g: 0,
					b: 0,
					a: 1
				},
				newColor:"#000000",
				addActivityShow: false, //控制添加各种类型的事件弹窗
				rightInput:"",
				rightTextCustom:{
					borderBottom:"1px solid #2196F3",
					fontSize:"80rpx"
				},
				iconShow:false, //控制 icon弹窗显示
				iconLists:[], //icon图标集合数据
				nowIconListsItem:"", //当前点击选中的icon图标
				colorShow:false, //控制颜色选择器弹窗显示
				newActivityItem: "", //确定添加图标后，将图标内容存进这里
					
			}
		},
		components: {
			headNav,
			calendar,
			tColorPicker
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
				this.timeListTime = this.currentMonth + "月" + "-" + this.currentYear;
				console.log("滴滴滴", this.timeListTime, this.currentYear, this.currentMonth, this.nowTime)
			},

			//点击上一月
			gotoPreMonth() {
				console.log("上一月", this.$refs.calendar.currentYear, this.$refs.calendar.currentMonth, this.$refs.calendar
					.timeList)
				this.timeListTime = this.$refs.calendar.timeList.currentMonth + "月" + "-" + this.$refs.calendar.timeList
					.currentYear;
				this.currentYear = this.$refs.calendar.currentYear
				this.currentMonth = this.$refs.calendar.currentMonth
			},

			//下一月
			gotoNextMonth() {
				console.log("下一月", this.$refs.calendar.currentYear, this.$refs.calendar.currentMonth, this.$refs.calendar
					.timeList)
				this.timeListTime = this.$refs.calendar.timeList.currentMonth + "月" + "-" + this.$refs.calendar.timeList
					.currentYear;
				this.currentYear = this.$refs.calendar.currentYear;
				this.currentMonth = this.$refs.calendar.currentMonth;
			},

			//点击右下角，打开事件弹窗
			openRightModel() {
				this.activityShow = true;
			},

			//打开添加事件弹窗--并给icon
			addActivity() {
				this.addActivityShow = true; 
			},
			
			//打开icon图标弹窗
			openIconModel(){
				this.iconShow = true;
				this.disposeIcon(this.newColor);
			},
			
			//处理icon数组的数据结构，以及添加 isPitchOn--是否选中 
			disposeIcon(color){
				let newList = [];
				let all = iconAll;
				for (var i = 0; i < all.length; i++) {
					if(all[i].isPitchOn == true){
					}else{
						all[i].isPitchOn = false;
					}
					all[i].color = color;
					newList.push(all[i])
				}
				this.iconLists = newList;
			},
			
			//打开颜色选择器弹窗
			openColorModel(){
				this.colorShow = true;
				this.tColorPickerIs = true
				this.$nextTick(() => {
					this.$refs.colorPicker.open();
				});
			},
			
			//关闭颜色选择器
			closeColor(){
				this.colorShow = false;
			},
			
			//颜色选择器 选中的颜色
			confirm(event) {
				this.colorShow = false;
				console.log('颜色选择器返回值：',event)
				this.color = event.rgba;
				this.newColor = event.hex;
				this.disposeIcon(event.hex);
			},
			
			//选择icon图标
			selectIcon(item){
				let array = this.iconLists;
				let newArray = [];
				for (var i = 0; i < array.length; i++) {
					item.name == array[i].name ? array[i].isPitchOn = true : array[i].isPitchOn = false;
					newArray.push(array[i])
				}
				this.iconLists = newArray;
				this.nowIconListsItem = item;
				console.log("iconLists",item,this.iconLists)
			},
			
			//关闭选择icon图标弹窗
			closeIconModel(){
				this.iconShow = false;
			},
			
			//确定使用选中的图标
			confirmIcon(){
				this.newActivityItem = this.nowIconListsItem;
				localStorage.setItem("nowIconListsItem",JSON.stringify(this.nowIconListsItem))
				this.closeIconModel();
			},
			
			//不使用图标--将清除现在使用的图标
			noDoneIcon(){
				this.newActivityItem = "";
				localStorage.setItem("nowIconListsItem","");
				this.closeIconModel();
			},
			
		}
	}
</script>

<style lang="scss" scoped>
	@import "./index.css";
</style>
