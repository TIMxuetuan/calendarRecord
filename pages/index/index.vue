<template>
	<view class="allContent">
		<button v-if="!isGet" class="all" @click="getUserXin"></button>
		<!--头部导航栏-->
		<view class="left-jian">
			<headNav :timeListTime="timeListTime" @openCalendarModel="openCalendarModel">
			</headNav>
		</view>


		<!--日历内容 开始-->
		<view class="calendarModel">
			<calendar ref="calendar" @gotoPreMonth="gotoPreMonth" @gotoNextMonth="gotoNextMonth" :signLists="signLists"
				:nowTime2="nowTime" :currentYear2='currentYear' :currentMonth2="currentMonth"
				@openDayAllRecord="openDayAllRecord" @editNowTime="editNowTime" :lastAllLists="lastAllLists">
			</calendar>
		</view>
		<!--日历内容 结束-->

		<!--页面右下角查看类别列表-->
		<view class="rightLists" @click="openSetModel">
			<u-icon name="order" color="#ffffff" size="32"></u-icon>
		</view>

		<!--页面右下角加号-->
		<view class="rightAdd" @click="openRightModel">
			<u-icon name="plus" color="#000000" size="32"></u-icon>
		</view>

		<!--各种事件弹窗-->
		<u-popup v-model="activityShow" z-index="10085" mode="bottom" height="50%">
			<view class="activity-centent">
				<view class="activity-head" @click="addActivity">
					<u-icon name="plus" color="#2196F3" size="50"></u-icon>
					<view class="activity-head-text">新增事件</view>
				</view>
				<!-- <view class="activityMore"> -->
				<scroll-view scroll-y="true" class="activityMore" :enable-flex="true">
					<view class="more-item" v-for="(item,index) in activityLists" :key="index"
						@click="addDayRecord(item)">
						<view class="more-item-icon">
							<u-icon :name="item.tra_icons" :color="item.tra_color" size="50"></u-icon>
						</view>
						<view class="activity-head-text">{{item.bt}}</view>
					</view>
				</scroll-view>
				<!-- </view> -->
			</view>
		</u-popup>

		<!--添加 各种类型的事件 弹窗（点击新增事件弹出）-->
		<u-popup v-model="addActivityShow" z-index="10085" mode="bottom" height="100%">
			<u-navbar height="50" :is-back="false" :border-bottom="false" is-fixed :background="background">
				<!-- <view class="addMode-head">
					<view @click="addActivityClose">退出</view>
					<view @click="configActivity">保存</view>
				</view> -->
			</u-navbar>

			<view class="addMode-body">
				<view class="addModeBody-top">
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
								:clearable="false" :custom-style="rightTextCustom" placeholder=" " maxlength="10" />
						</view>
					</view>
				</view>
				<view class="addMode-center">
					<u-button @click="configActivity" :custom-style="buttonStyle" shape="circle">保存</u-button>
				</view>
			</view>
			
			<!--页面右下角加号-->
			<view class="rightLists" @click="addActivityClose">
				<u-icon name="arrow-left" color="#ffffff" size="32"></u-icon>
			</view>
		</u-popup>

		<!--为事件添加值和说明弹窗-->
		<u-popup v-model="explainShow" z-index="10095" mode="center" width="80%" border-radius="10">
			<view class="explain-centent">
				<view class="explain-head">
					<view class="explainHead-icon" v-if="explainIconValue.tra_icons != 'undefined'">
						<u-icon :name="explainIconValue.tra_icons"
							:color="explainIconValue.tra_color" size="50"></u-icon>
					</view>
					<view class="explainHead-text">{{explainIconValue.bt}}</view>
				</view>
				<view class="explain-body">
					<view class="explainBody-item">
						<view class="explainBody-title">数值:</view>
						<view class="explainBody-input">
							<!-- <u-input v-model="explainValue" type="text" :border="false" :clearable="false"
								:custom-style="explainCustom" placeholder=" " /> -->
							 <input v-model="explainValue" type="digit" class="uni-input" :focus="true" placeholder=" " />
						</view>
					</view>
					<view class="explainBody-item">
						<view class="explainBody-title">备注:</view>
						<view class="explainBody-input">
							<u-input v-model="explainNote" type="text" :border="false" :clearable="false"
								:custom-style="explainCustom" placeholder=" " />
						</view>
					</view>
				</view>
				<view class="explain-time">
					<view class="">创建时间:</view>
					<view class="explainTime-year">{{explainDate}}</view>
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
					<scroll-view scroll-y="true" class="scroll-Y-tu" :enable-flex="true">
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
							<!-- <u-icon @click="offAllRecord" name="arrow-left" color="#ffffff" size="40"></u-icon> -->
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
										<u-icon :name="item.tra_icons" :color="item.tra_color" size="40"></u-icon>
										<view class="recordHead-left-text">
											{{item.bt}}
										</view>
									</view>
									<view class="" @click.stop>
										<u-icon v-if="!item.isOpen" @click="openRecordHide(item,true)" name="arrow-down"
											color="#000" size="40"></u-icon>
										<u-icon v-else name="arrow-up" @click="openRecordHide(item,false)" color="#000"
											size="40"></u-icon>
									</view>
								</view>
								<view class="recordTop-value">{{item.jl_num}}</view>
								<view class="">{{item.remarks}}</view>
							</view>
							<view class="recordLi-hide" v-if="item.isOpen">
								<view class="recordHide-top">
									<view class="">创建时间:</view>
									<view class="recordHide-time">
										{{item.rc_sj}}

										<!-- <view class="">
											{{item.explainDateTime.year}}年{{item.explainDateTime.month}}月{{item.explainDateTime.date}}日
										</view>
										<view class="">
											{{item.explainDateTime.hours < 12 ? '上午' + item.explainDateTime.hours : '下午' + (item.explainDateTime.hours - 12)}}:{{item.explainDateTime.minutes < 10 ? '0' + item.explainDateTime.minutes : item.explainDateTime.minutes }}
										</view> -->
									</view>
								</view>
								<view class="recordHide-btn">
									<view class="" @click.stop>
										<u-icon @click="recordDelete(item)" name="trash-fill" color="#727272" size="60">
										</u-icon>
									</view>
									<view class="" @click.stop>
										<u-icon @click="recordEdit(item)" name="edit-pen-fill" color="#727272"
											size="60"></u-icon>
									</view>
								</view>
							</view>
						</view>
					</view>
				</view>
				<view class="rightAdd" @click="openRightModel">
					<u-icon name="plus" color="#000000" size="32"></u-icon>
				</view>

				<!--页面右下角查看类别列表-->
				<view class="rightLists" @click="offAllRecord">
					<u-icon name="arrow-left" color="#ffffff" size="32"></u-icon>
				</view>
			</view>
		</u-popup>

		<!--首页日历弹窗-->
		<u-calendar v-model="calendarModel" z-index="10085" max-date="9999-01-01" :safe-area-inset-bottom="true"
			mode="date" @change="changeTimeModel"></u-calendar>

		<!--删除记录确认弹窗-->
		<u-modal z-index="10095" v-model="deleteShow" show-cancel-button content="确定删除这条记录吗？" confirm-color="red"
			@confirm="confirmRecord"></u-modal>

		<!--点击某一天中的某条记录，查看此条记录的所有数据分析弹窗-->
		<u-popup class="echartsModel" z-index="10085" v-model="echartsModel" mode="bottom" width="100%" height="100%">
			<view class="echartsModel-body">
				<view class="">
					<u-navbar height="50" :is-back="false" :border-bottom="false" :is-fixed="true"
						:background="background">
						<view class="echartsModel-top">
							<view class="allRecord-left">
								<!-- <u-icon @click="offEchartsModel" name="arrow-left" color="#ffffff" size="40">
								</u-icon> -->
								<view class="explain-head echartsModel-head" v-if="echartsNowItem">
									<view v-if="echartsNowItem.tra_icons" class="explainHead-icon echartsModel-icon">
										<u-icon :name="echartsNowItem.tra_icons" :color="echartsNowItem.tra_color"
											size="50"></u-icon>
									</view>
									<view class="explainHead-text echartsModel-text">
										{{echartsNowItem.bt}}
									</view>
								</view>
							</view>
							<!-- <view class="allRecord-right">
								<u-icon @click="yearCalendar" name="list" color="#ffffff" size="50"></u-icon>
							</view> -->
						</view>
					</u-navbar>
				</view>
				<view class="lineAndText">
					<scroll-view scroll-y="true" class="scroll-Y" :enable-flex="true">
						<view class="echartsLine-one">
							<view class="lineOne">

								<!-- #ifdef MP-WEIXIN -->
								<!-- <qiun-data-charts type="line" canvasId="scrolllineid" :opts="ringOpts" :chartData="chartDataOne"
								:animation="false" :ontouch="true" :canvas2d="true" :echartsH5="true" :echartsApp="true"
								:inScrollView="true" /> -->

								<qiun-data-charts type="line" canvasId="scrolllineid2" :opts="ringOpts"
									:chartData="chartDataOne" :animation="false" :inScrollView="true" :echartsH5="true"
									:echartsApp="true" :ontouch="true" :canvas2d="true" />
								<!-- #endif -->

								<!-- #ifdef H5 || APP-PLUS -->
								<qiun-data-charts type="line" canvasId="scrolllineid" :eopts="ringOpts"
									:chartData="chartDataOne" :animation="false" :ontouch="true" :canvas2d="true"
									:echartsH5="true" :echartsApp="true" :inScrollView="true" />
								<!-- #endif -->

							</view>
						</view>
						<view class="echartsModel-statistics">
							<view class="echartsStatistics">
								<view class="ecStatistics-start">
									<view class="dataStart" @click="yearCalendar">
										查看年历
									</view>
									<view class="dataStart-right" @click="selectTimeModel">
										{{timeDian}}
									</view>
								</view>
								<view class="ecStatistics-analyse">
									<view class="analyse-item">
										<view class="analyseItem-title">
											最近
										</view>
										<view class="analyseItem-value">
											{{recentlyDay}}
										</view>
									</view>
									<view class="analyse-item">
										<view class="analyseItem-title">
											{{analyseList.countName}}
										</view>
										<view class="analyseItem-value">
											{{yearListsData.count}}
										</view>
									</view>
									<view class="analyse-item">
										<view class="analyseItem-title">
											{{analyseList.sumName}}
										</view>
										<view class="analyseItem-value">
											{{yearListsData.sum}}
										</view>
									</view>
									<view class="analyse-item">
										<view class="analyseItem-title">
											{{analyseList.avgName}}
										</view>
										<view class="analyseItem-value">
											{{yearListsData.avg}}
										</view>
									</view>
									<view class="analyse-item">
										<view class="analyseItem-title">
											{{analyseList.peakName}}
										</view>
										<view class="analyseItem-value">
											{{yearListsData.peak}}
										</view>
									</view>
									<view class="analyse-item">
										<view class="analyseItem-title">
											{{analyseList.minName}}
										</view>
										<view class="analyseItem-value">
											{{yearListsData.min}}
										</view>
									</view>
								</view>
							</view>
						</view>
						<view class="echartsModel-bottom">
							<view class="echartsBottom">
								<view class="ecbottomItem" v-for="(item,index) in yearLists" :key="index">
									<!-- <view class="ecbottomItem"> -->
									<view class="ecbottomItem-head">
										{{item.yearItem}}
									</view>
									<view class="ecbottomItem-body">
										<view class="ecbottomItem-body-item" v-for="(items,indexs) in item.dataItem"
											:key="indexs" @click="ecbClick(items)">
											<view class="ecbottomBody-top">
												<view class="ecbottomBody-top-year">
													<!-- {{timeSwitch(items.dayRecord,items.explainDateTime)}} -->
													{{items.rc_sj}} 
													<text v-if="items.chaTime != '开始时间'">(距上次{{items.chaTime}}天)</text>
													<text v-else>({{items.chaTime}})</text>
												</view>
												<view class="">
													{{items.jl_num}}
												</view>
											</view>
											<view class="ecbottomBody-remark">
												<view v-if="items.remarks" class="ecbottomBody-long"></view>
												{{items.remarks}}
											</view>
										</view>
									</view>
								</view>
							</view>
						</view>
						<!-- <view v-if="yearLists == ''" class="noData">
							<image class="noData-img" src="../../static/noData.jpg" mode=""></image>
						</view> -->
					</scroll-view>
				</view>
				<!--页面右下角查看类别列表-->
				<view class="rightLists" @click="offEchartsModel">
					<u-icon name="arrow-left" color="#ffffff" size="32"></u-icon>
				</view>
			</view>
		</u-popup>
		
		<!--点击某条记录时弹出的操作弹窗-->
		<u-popup z-index="10085" v-model="ecbClickModel" mode="center" width="80%" border-radius="14">
			<view class="ecbmodel">
				<view @click="ecbEdit(ecbClickItem)" class="">编辑</view>
				<view @click="ecbDelect(ecbClickItem)" class="ecbmodel-del">删除</view>
			</view>
		</u-popup>

		<!--选择全部时间或者时间段内的数据-->
		<u-popup z-index="10085" v-model="timeDataSelect" mode="center" width="80%" border-radius="14">
			<view class="timeSelect">
				<view class="timeSelect-title">数据来源</view>
				<view class="timeSelect-time">
					<u-radio-group v-model="timeValue" @change="radioGroupChange" wrap :label-disabled="false">
						<u-radio name="所有" :label-disabled="true">所有</u-radio>
						<u-radio name="时间段" :label-disabled="true">
							<view class="timeQuantum">
								<view class="">
									时间段
								</view>
								<view :class="timeValue == '时间段' ? 'timeColor' : 'disabledColor'">
									<view class="" @click="timeStartClick">{{timeStart}}</view>
									<view class="" @click="timeEndClick">{{timeEnd}}</view>
								</view>
							</view>
						</u-radio>
					</u-radio-group>
				</view>
				<view class="affirmBtn" @click="affirmBtnClick">确认</view>
			</view>
		</u-popup>

		<!--开始时间选择日期弹窗-->
		<u-calendar v-model="startModel" z-index="10085" max-date="9999-01-01" :safe-area-inset-bottom="true"
			mode="date" @change="startChange"></u-calendar>

		<!--结束时间选择日期弹窗-->
		<u-calendar v-model="endModel" z-index="10085" max-date="9999-01-01" :safe-area-inset-bottom="true" mode="date"
			@change="endChange"></u-calendar>

		<!--左侧设置弹窗-->
		<u-popup z-index="10085" v-model="settingModel" mode="bottom" width="100%" height="50%">
			<view class="settingModel">
				<!-- <u-navbar height="50" :is-back="false" :border-bottom="false" is-fixed :background="background">
				</u-navbar> -->
				<view class="settingModel-icon">
					<scroll-view scroll-y="true" class="scroll-Y" :enable-flex="true">
						<view class="settingIcon">
							<u-swipe-action :show="item.show" :index="index" v-for="(item,index) in setModelIcon"
								:key="index" @content-click="dianContent" @click="clickSettingIcon"
								@open="openSettingIcon" :options="setOptions">
								<view class="settingIcon-item">
									<view class="setIconItem-left">
										<u-icon :name="item.tra_icons" :color="item.tra_color" size="100"></u-icon>
									</view>
									<view class="setIconItem-right">{{item.bt}}</view>
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

		<!--提示登录弹窗-->
		<u-popup z-index="10085" v-model="hintLogin" mode="center" width="80%" height="30%" border-radius="14"
			:mask-close-able="false">
			<view class="hintLogin">
				<view class="hintLogin-title">
					请登录授权使用此程序
				</view>
			</view>
		</u-popup>

		<!--保存时，提示-->
		<u-toast ref="uToast" />
	</view>
</template>

<script>
	import allApi from '../../utils/api_methods.js'
	import headNav from '../../components/headNav/index.vue'; //头部导航组件
	import calendar from '../../components/calendar/calendarNew.vue'; //日历组件--自己写的
	// import calendar from '../../components/lx-calendar/lx-calendar.vue'; //日历组件--=可以使用，但是没有注释，很不好理解
	import tColorPicker from '@/components/t-color-picker/t-color-picker.vue' //颜色选择
	import iconAll from "./iconList.json"
	import products from "../../utils/products.js"
	export default {
		data() {
			return {
				buttonStyle:{
					width:"200px",
					color: '#fff',
					backgroundColor:'#2196F3',
				},
				hintLogin: false,
				isGet: false, //是否授权个人信息
				user_info: '', //用户信息
				lastAllLists: [], //获得的记录数据
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
				leftIconNow: "", //点击编辑时，将类别数据存在这里
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
				isAddEdit: "", //用于区别类别是添加还是编辑（添加就是：addNew; 编辑就是editNew）

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
					text: '编辑',
					style: {
						backgroundColor: '#007aff'
					}
				}, {
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
					sumName: "总和",
					sumValue: 0,
					avgName: "平均",
					avgValue: 0,
					peakName: "最大",
					peakValue: 0,
					minName: "最小",
					minValue: 0,
				},
				yearListsData: {},
				timeDataSelect: false, //控制选择时间段的弹窗
				timeStart: "", //开始时间
				timeEnd: "", //结束时间
				startModel: false, //控制选择开始日期
				endModel: false, //控制选择结束日期
				timeValue: "所有",
				timeSelectList: [{
						name: '所有',
						disabled: false
					},
					{
						name: '时间段',
						disabled: false
					},
				],
				timeDian: "所有",
				lineItemValue: "",
				lineItemType: "",
				recentlyDay:0, //最近 为今天和最后一条的时间天数差
				recentlyTime:"", //当天时间，用于和最近的记录对比
				ecbClickItem:"", //点击某条记录时，保存的值
				ecbClickModel:false, //控制某条记录的操作弹窗
				ecbIsEdit:false, //开关，当编辑成功时，并且它为true时，再成功回调里 再次请求数据
				ecbIsDelect:false, //遇上逻辑同理
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
			this.user_info = uni.getStorageSync('user_info');
			this.isGet = uni.getStorageSync("isGet");
			console.log("this.isGet", this.isGet)
			if (this.isGet) {
				this.getListtrarecord(this.currentYear, this.currentMonth, this.currentDate = "");
			}
			this.getNowDate();
		},
		methods: {
			...products,
			//储微信用户信息
			getUserXin() {
				uni.getUserProfile({
					desc: '用于完善资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
					success: (res) => {
						let resProfile = res;
						this.user_info = uni.getStorageSync('user_info');
						console.log("新的", this.user_info, res)
						if (res.errMsg === "getUserProfile:ok") {
							let userInfo = res.userInfo;
							allApi.userxx({
								"info[wechat_id]": this.user_info.id,
								"info[nickName]": userInfo.nickName,
								"info[avatarUrl]": userInfo.avatarUrl,
								"info[gender]": userInfo.gender,
								"info[city]": userInfo.city,
								"info[province]": userInfo.province,
								"info[country]": userInfo.country,
							}).then(res => {
								if (res.event == 100) {
									console.log("储存成功", res)
									this.isGet = true
									uni.setStorageSync("isGet", this.isGet);
									this.getListtrarecord(this.currentYear, this.currentMonth, this
										.currentDate = "");
									// this.getPhone(resProfile)
								}
							})
						}
					}
				})

			},

			//获取手机号，将encryptedData，iv等传给后台
			getPhone(resProfile) {
				console.log("手机号", resProfile)
				allApi.number({
					encryptedData: resProfile.encryptedData,
					iv: resProfile.iv,
					wechat_id: this.user_info.id
				}).then(res => {
					if (res.event == 100) {
						console.log("获取手机号", res)
					}
				})
			},

			//获取当月的记录数据信息
			async getListtrarecord(year, month, date) {
				console.log("现在的年月日", year, month, date)
				month = month < 10 ? "0" + month : month
				let listtrarecord = await allApi.listtrarecord({
					wechat_id: this.user_info.id,
					year: year,
					month: month,
					day: date,
				})
				if (listtrarecord.event == 100) {
					console.log("获取四月记录数据", listtrarecord)
					this.lastAllLists = listtrarecord.list;
				}
			},

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
				let nowTime = this.currentYear + "-" + (this.currentMonth < 10 ? "0" + this.currentMonth : this
					.currentMonth) + "-" + this.currentDate
				this.recentlyTime = nowTime;
				this.timeListTime = this.currentMonth + "月" + "-" + this.currentYear;
				this.nowTime = nowTime;
				uni.setStorageSync("nowTime", nowTime)
				console.log("滴滴滴", this.timeListTime, this.currentYear, this.currentMonth, this.nowTime)
			},

			//点击上一月
			gotoPreMonth() {
				this.timeListTime = this.$refs.calendar.timeList.currentMonth + "月" + "-" + this.$refs.calendar.timeList
					.currentYear;
				this.currentYear = this.$refs.calendar.currentYear
				this.currentMonth = this.$refs.calendar.currentMonth
				this.getListtrarecord(this.currentYear, this.currentMonth, this
					.currentDate = "");
			},

			//下一月
			gotoNextMonth() {
				this.timeListTime = this.$refs.calendar.timeList.currentMonth + "月" + "-" + this.$refs.calendar.timeList
					.currentYear;
				this.currentYear = this.$refs.calendar.currentYear;
				this.currentMonth = this.$refs.calendar.currentMonth;
				this.getListtrarecord(this.currentYear, this.currentMonth, this
					.currentDate = "");
			},

			//点击右下角，打开事件弹窗
			openRightModel() {
				this.activityShow = true;
				this.getRightLists();
			},

			//获取事件
			getRightLists() {
				allApi.listtralb({
					wechat_id: this.user_info.id,
				}).then(res => {
					if (res.event == 100) {
						console.log("获取类别列表", res)
						this.activityLists = res.list;
						this.$forceUpdate()
					}
				})
			},

			//打开添加事件弹窗--并给icon
			addActivity() {
				this.isAddEdit = "addNew"
				this.addActivityShow = true;
			},

			//关闭添加事件弹窗--并清空值
			addActivityClose() {
				this.newActivityItem = "";
				this.rightInput = "";
				this.addActivityShow = false;
			},

			//保存--新增类别和编辑类别
			configActivity() {
				// console.log("this.rightInput", this.leftIconNow, this.newActivityItem, this.rightInput, this.isAddEdit)
				if (this.rightInput == "") {
					this.$refs.uToast.show({
						title: '请填写内容',
						type: 'error',
						icon: false
					})
					return
				}

				if (this.isAddEdit == "addNew") {
					allApi.addtralb({
						wechat_id: this.user_info.id,
						tra_icons: this.newActivityItem.name,
						tra_color: this.newActivityItem.color,
						bt: this.rightInput,
					}).then(res => {
						if (res.event == 100) {
							// uni.showToast({
							// 	title: res.msg,
							// 	icon: "none",
							// 	duration: 2000
							// });
							console.log("添加成功", res)
						} else {
							uni.showToast({
								title: res.msg,
								icon: "none",
								duration: 2000
							});
						}
					})
					setTimeout(() => {
						this.getRightLists();
					}, 500)
					this.addActivityClose();
				} else if (this.isAddEdit == "editNew") {
					console.log("这里是编辑", this.leftIconNow, this.newActivityItem, this.rightInput, this.isAddEdit)
					allApi.edittralb({
						id: this.leftIconNow.id,
						tra_icons: this.newActivityItem.name,
						tra_color: this.newActivityItem.color,
						bt: this.rightInput,
					}).then(res => {
						if (res.event == 100) {
							// uni.showToast({
							// 	title: res.msg,
							// 	icon: "none",
							// 	duration: 2000
							// });
						} else {
							uni.showToast({
								title: res.msg,
								icon: "none",
								duration: 2000
							});
						}
					})
					// setTimeout(() => {
					// 	this.getSetLists();
					// }, 500)
					this.getListtrarecord(this.currentYear, this.currentMonth, this
						.currentDate = "");
					this.addActivityClose();
				}

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
				//console.log('颜色选择器返回值：', event)
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
				let dayRecord = uni.getStorageSync('dayRecord');
				console.log("点击某一个类别", item, dayRecord)
				this.explainShow = true;
				this.activityShow = false;
				this.explainIconValue = item;
				this.explainValue = "";
				this.explainNote = "";
				let nowDate = new Date();
				// let year = nowDate.getFullYear()
				// let month = nowDate.getMonth() + 1
				// let date = nowDate.getDate()

				let year = dayRecord.currentYear;
				let month = dayRecord.currentMonth;
				let date = dayRecord.date;
				let hours = nowDate.getHours()
				let minutes = nowDate.getMinutes()
				this.explainDateTime = {
					year,
					month,
					date,
					hours,
					minutes,
				}
				// if (hours < 12) {
				// 	this.explainTime = "上午" + hours + ":" + (minutes < 10 ? '0' + minutes : minutes)
				// } else {
				// 	hours = hours - 12
				// 	this.explainTime = "下午" + hours + ":" + (minutes < 10 ? '0' + minutes : minutes)
				// }

				this.explainTime = hours + ":" + (minutes < 10 ? '0' + minutes : minutes)

				this.explainDate = year + "年" + month + "月" + date + "日" + " " + this.explainTime
			},


			//添加活动事件弹窗,最终添加按钮事件
			explainComfig() {
				if (this.explainValue == "") {
					uni.showToast({
						title: "数值不能为空",
						icon: "none",
						duration: 2000
					});
					return
				}
				if (!products.isNumber(this.explainValue)) {
					uni.showToast({
						title: "请输入数字",
						icon: "none",
						duration: 2000
					});
					return
				}
				if (this.editLinShi == "") {
					//新增
					let dayRecord = uni.getStorageSync("dayRecord")
					let rcSj = products.getrc_sj(dayRecord);
					var str2 = Date.parse(new Date(rcSj));
					console.log("新增", this.explainIconValue)
					allApi.addtrarecord({
						wechat_id: this.user_info.id,
						lb_id: this.explainIconValue.id,
						jl_num: this.explainValue,
						remarks: this.explainNote,
						rc_sj: str2
					}).then(res => {
						if (res.event == 100) {
							// uni.showToast({
							// 	title: res.msg,
							// 	icon: "none",
							// 	duration: 2000
							// });
							return this.getListtrarecord(this.currentYear, this.currentMonth, this.currentDate =
								"");

						} else {
							uni.showToast({
								title: res.msg,
								icon: "none",
								duration: 2000
							});
						}
					}).then(res => {
						this.chuDayRecord()
						this.explainShow = false;
					})

				} else {
					//编辑
					var str2 = Date.parse(new Date(this.editLinShi.rc_sj));
					console.log("点击编辑", this.editLinShi, str2)
					let item = this.editLinShi;
					allApi.edittrarecord({
						id: item.id,
						lb_id: item.lb_id,
						jl_num: this.explainValue,
						remarks: this.explainNote,
						rc_sj: str2
					}).then(res => {
						if (res.event == 100) {
							// uni.showToast({
							// 	title: res.msg,
							// 	icon: "none",
							// 	duration: 2000
							// });
							return this.getListtrarecord(this.currentYear, this.currentMonth, this.currentDate =
								"");
						} else {
							uni.showToast({
								title: res.msg,
								icon: "none",
								duration: 2000
							});
						}
					}).then(res => {
						this.chuDayRecord()
						this.explainShow = false;
						if(this.ecbIsEdit == true){
							let lb_id = this.ecbClickItem.lb_id;
							this.disposeLineItem(lb_id)
						}
					})
					this.editLinShi = "";
				}
				this.explainShow = false;
			},

			//打开某一天所有记录 弹窗，并获得所有记录
			openDayAllRecord(list) {
				console.log("list", list)
				this.dayAllRecord = true;
				this.dayAllRecordList = list;
			},

			//处理某一天记录值数据，包括，新增、删除、编辑
			chuDayRecord() {
				let that = this;
				console.log("处理成功", that.dayAllRecordList, that.$refs.calendar
					.timeList)
				let allLists = that.$refs.calendar.timeList.allArr;
				allLists.forEach(item => {
					if (item.ziDate == that.dayAllRecordList.ziDate) {
						that.dayAllRecordList = item;
					}
				})
				console.log("最终当天记录数据", that.dayAllRecordList)
			},

			//关闭某一天所有记录 弹窗，并获得所有记录
			offAllRecord() {
				// this.dayAllRecordList = []
				this.dayAllRecord = false;
			},

			//切换记录隐藏内容的显示
			openRecordHide(value, type) {
				value.isOpen = type;
				this.$forceUpdate()
			},

			//点击修改 获取当条记录的数值和备注，并渲染弹窗， 最后点击确认时，执行explainComfig事件，但是需要传入判断（新增和编辑）
			recordEdit(item) {
				let dayRecord = uni.getStorageSync('dayRecord');
				console.log("编辑", item, dayRecord)
				this.explainShow = true;
				this.explainIconValue = item;
				this.editLinShi = item;
				this.explainValue = item.jl_num;
				this.explainNote = item.remarks;
				
				this.ecbClickModel = false;
				this.ecbIsEdit = false;
				
				this.explainDate = item.rc_sj;

				// let nowDate = new Date();
				// let year = dayRecord.currentYear;
				// let month = dayRecord.currentMonth;
				// let date = dayRecord.date;
				// let hours = nowDate.getHours()
				// let minutes = nowDate.getMinutes()

				// if (hours < 12) {
				// 	this.explainTime = "上午" + hours + ":" + (minutes < 10 ? '0' + minutes : minutes)
				// } else {
				// 	let hours = hours - 12
				// 	this.explainTime = "下午" + hours + ":" + (minutes < 10 ? '0' + minutes : minutes)
				// }


			},

			//点击删除图标，获得值并打开弹窗
			recordDelete(item) {
				console.log("item", item)
				this.deleteRecordItem = item;
				this.deleteShow = true;
				this.ecbIsDelect = false;
			},

			//点击删除弹窗确认按钮
			confirmRecord() {
				var that = this;
				console.log("确定", this.deleteRecordItem)
				allApi.deltrarecord({
					id: this.deleteRecordItem.id
				}).then(res => {
					if (res.event == 100) {
						uni.showToast({
							title: res.msg,
							icon: "none",
							duration: 2000
						});
						return this.getListtrarecord(this.currentYear, this.currentMonth, this.currentDate = "");
					} else {
						uni.showToast({
							title: res.msg,
							icon: "none",
							duration: 2000
						});
					}
				}).then(() => {
					this.chuDayRecord()
					if(this.ecbIsDelect == true){
						let lb_id = this.ecbClickItem.lb_id;
						this.disposeLineItem(lb_id)
					}
				})

			},

			//打开选择时间端弹窗
			selectTimeModel() {
				this.timeDataSelect = true;
				let date = new Date()
				let year = date.getFullYear()
				let month = date.getMonth() + 1
				let day = date.getDate()
				let timeSum = year + "-" + (month < 10 ? "0" + month : month) + "-" + day
				this.timeStart = this.timeStart == "" ? timeSum : this.timeStart;
				this.timeEnd = this.timeEnd == "" ? timeSum : this.timeEnd;
			},

			//切换两个时间选项
			radioGroupChange(e) {
				this.timeValue = e
			},

			//点击开始时间事件
			timeStartClick() {
				if (this.timeValue == "所有") {
					return
				}
				this.startModel = true;
			},

			//开始时间弹窗 点击事件
			startChange(e) {
				this.timeStart = e.year + "-" + (e.month < 10 ? "0" + e.month : e.month) + "-" + e.day;
			},

			//点击结束时间事件
			timeEndClick() {
				if (this.timeValue == "所有") {
					return
				}
				this.endModel = true;
			},

			//结束时间弹窗 点击事件
			endChange(e) {
				this.timeEnd = e.year + "-" + (e.month < 10 ? "0" + e.month : e.month) + "-" + e.day;
			},

			//选择所有或者时间段 点击确认事件，
			affirmBtnClick() {
				console.log("最后确认", this.timeValue, this.timeStart, this.timeEnd)
				if (this.timeValue == "所有") {
					// this.timeStart = "";
					// this.timeEnd = "";
					this.timeDian = "所有";
				} else {
					this.timeStart = this.timeStart;
					this.timeEnd = this.timeEnd;
					this.timeDian = this.timeStart + "至" + this.timeEnd;
				}
				this.timeDataSelect = false;

				let value = this.lineItemValue;
				let type = this.lineItemType;
				let lb_id = "";
				if (type == "allRecord") {
					lb_id = value.lb_id
				} else if (type == "dianContent") {
					lb_id = value.id
				}
				this.disposeLineItem(lb_id)
			},

			//点击记录中的某一条，获得数据，并打开数据分析弹窗
			lineItem(value, type) {
				console.log("底", value, type)

				//下面四条是为 时间段筛选 初始化
				this.timeDian = "所有";
				this.timeValue = "所有"
				this.timeStart = "";
				this.timeEnd = "";

				this.lineItemValue = value;
				this.lineItemType = type;
				this.echartsModel = true;
				let item = value
				let lb_id = "";
				if (type == "allRecord") {
					lb_id = value.lb_id
				} else if (type == "dianContent") {
					lb_id = value.id
				}
				this.echartsNowItem = value;
				uni.setStorageSync("echartsNowItem", this.echartsNowItem)
				this.disposeLineItem(lb_id)
			},

			//上面的调用记录详情接口并处理数据
			disposeLineItem(lb_id) {
				let timeJointAll = [] //折线图使用的x轴值
				let seriesData = []; //折线图使用的数据值
				let timeAll = [];
				let resLists = {}

				let start = "";
				let end = "";

				if (this.timeValue == "所有") {
					start = "";
					end = "";
				} else {
					start = this.timeStart;
					end = this.timeEnd;
					if (start != "") {
						let date = products.startEndTime(start, "start")
						let dateNew = new Date(date);
						start = dateNew.valueOf()
					}
					if (end != "") {
						let date = products.startEndTime(end, "end")
						let dateNew = new Date(date);
						end = dateNew.valueOf()
					}
				}


				allApi.tjttrarecord({
					wechat_id: this.user_info.id,
					lb_id: lb_id,
					start: start,
					end: end,
				}).then(res => {
					if (res.event == 100) {
						console.log("res", res)
						this.yearListsData = res.data
						timeAll = res.list;
						uni.setStorageSync("lastAllLists", res.list)
						
						this.recentlyDay = products.getTimeDiff(timeAll[0].rq, this.recentlyTime)

						let splitYear = "";
						for (var i = 0; i < timeAll.length; i++) {
							
							if (i < timeAll.length - 1) {
								let chaTime = products.getTimeDiff(timeAll[i].rq, timeAll[i + 1].rq)
								timeAll[i].chaTime = chaTime
							}else{
								timeAll[i].chaTime = "开始时间"
								console.log("空",i)
							}
							
							let item = timeAll[i];
							console.log("item", item)
							seriesData.push(item.jl_num);
							timeJointAll.push(item.rq);

							/*以下是将数据按照年份 分组*/
							splitYear = item.rq.split("-")[0]
							resLists[splitYear] = resLists[splitYear] || [];
							resLists[splitYear].push(item); //将所有的item列放入到对应的className中

							
						}

						console.log("年份对象", resLists)

						let newRes = []
						for (let items in resLists) {
							let newItem = {
								yearItem: items,
								dataItem: resLists[items]
							}
							newRes.push(newItem)
						}
						//进行排序
						newRes.sort(function(a, b) {
							return b.yearItem - a.yearItem;
						})
						this.yearLists = newRes
						console.log("最终年份数组", this.yearLists)
						// products.getTimeDiff("2021-04-27","2021-05-01")
					} else {
						this.recentlyDay = 0;
						this.yearLists = "";
						uni.setStorageSync("lastAllLists", [])
						this.yearListsData = {
							min: 0,
							count: 0,
							peak: 0,
							sum: 0,
							avg: 0,
						}
						uni.showToast({
							title: res.msg,
							icon: "none",
							duration: 2000
						});
					}
				})

				//在h5和app里用这个
				//#ifdef H5 || APP-PLUS 
				let linearareadata = {
					// categories: ["1","2","3","4","5","6","7","8","9","10"],
					categories: timeJointAll,
					series: [{
						data: seriesData,
						type: 'line',
						symbolSize: 10,
						smooth: true,
					}],
				}
				let ringOpts = {
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
				//#endif

				//在微信小程序里用这个
				//#ifdef MP-WEIXIN 
				let linearareadata = {
					categories: timeJointAll,
					series: [{
						name: "",
						smooth: true,
						data: seriesData
					}]
				}

				let ringOpts = {
					padding: [
						15,
						10,
						0,
						0
					],
					legend: {
						show: false,
					},
					yAxis: {
						data: [{
							min: 0
						}]
					},
					extra: {
						line: {
							type: 'curve'
						}
					},
					enableScroll: true,
					xAxis: {
						disabled: true,
						scrollShow: false,
						itemCount: 5,
						disableGrid: true
					}
				}
				//#endif
				this.ringOpts = ringOpts
				this.chartDataOne = linearareadata;
				this.$forceUpdate();
			},

			//关闭数据分析弹窗
			offEchartsModel() {
				this.echartsModel = false;
			},
			
			//点击某条记录，打开操作 编辑和删除弹窗
			ecbClick(item){
				console.log("item",item)
				this.ecbClickItem = item;
				this.ecbClickModel = true;
			},
			
			//点击编辑事件
			ecbEdit(item){
				let dayRecord = uni.getStorageSync('dayRecord');
				console.log("编辑", item, dayRecord)
				this.explainShow = true;
				this.explainIconValue = item;
				this.editLinShi = item;
				this.explainValue = item.jl_num;
				this.explainNote = item.remarks;
				this.ecbClickModel = false;
				this.explainDate = item.rc_sj;
				
				this.ecbIsEdit = true;
			},
			
			//点击删除
			ecbDelect(item){
				console.log("item", item)
				this.deleteRecordItem = item;
				this.ecbClickModel = false;
				this.deleteShow = true;
				this.ecbIsDelect = true;
			},

			//打开日历弹窗
			openCalendarModel() {
				this.calendarModel = true;
			},

			//点击确定获得某一天的信息
			changeTimeModel(value) {
				let oneTime = this.currentYear + "-" + this.currentMonth;
				let twoTime = value.year + "-" + value.month;
				// console.log("value", oneTime, twoTime, value)
				this.currentYear = value.year
				this.currentMonth = value.month
				let currentDate = value.day
				if (currentDate < 10) {
					this.currentDate = "0" + currentDate
				} else {
					this.currentDate = currentDate
				}
				this.nowTime = this.currentYear + "-" + (this.currentMonth < 10 ? "0" + this.currentMonth : this
					.currentMonth) + "-" + this.currentDate
				this.timeListTime = this.currentMonth + "月" + "-" + this.currentYear;
				console.log("点击确定", this.timeListTime, this.currentYear, this.currentMonth, this.nowTime)
				this.getListtrarecord(this.currentYear, this.currentMonth, this.currentDate = "")
				if (oneTime == twoTime) {
					console.log("还在这一月")
				}
			},

			//点击某一天后修改 nowTime2 的值
			editNowTime(value) {
				//console.log("value", value)
				this.nowTime = value.ziDate;
			},

			//打开左侧的设置弹窗
			openSetModel() {
				this.settingModel = true;
				this.getSetLists();
			},

			//获取类别列表
			getSetLists() {
				allApi.listtralb({
					wechat_id: this.user_info.id,
				}).then(res => {
					if (res.event == 100) {
						let list = res.list
						list.forEach(item => {
							item.show = false
						})
						this.setModelIcon = list;
					}
				})
			},

			//左侧的设置弹窗--点击内容事件（与下面的不同）
			dianContent(index) {
				console.log("index", index, this.setModelIcon[index], this.setModelIcon)
				this.lineItem(this.setModelIcon[index], "dianContent")
				this.settingModel = false;
			},

			//左侧的设置弹窗--点击 删除或者收藏等操作事件
			clickSettingIcon(index, index1) {
				if (index1 == 1) {
					this.setIconIndex = index
					this.deleteSetIcon = true;
				} else {
					this.settingModel = false;
					this.isAddEdit = "editNew"
					this.rightInput = this.setModelIcon[index].bt;

					let linLists = this.setModelIcon[index];
					for (let s in linLists) {
						linLists.name = linLists.tra_icons
						linLists.color = linLists.tra_color
					}

					this.newActivityItem = linLists;
					this.leftIconNow = linLists;

					this.addActivityShow = true;
					console.log("赋值", this.newActivityItem, this.leftIconNow)
				}

			},

			//设置列表里删除 某一事件
			confirmSetIcon() {
				console.log("删除", this.setIconIndex, this.setModelIcon, this.setModelIcon[this.setIconIndex])
				allApi.deltralb({
					id: this.setModelIcon[this.setIconIndex].id,
				}).then(res => {
					if (res.event == 100) {
						this.getSetLists();
						console.log("删除成功", res)
						uni.showToast({
							title: res.msg,
							icon: "none",
							duration: 2000
						});
					}
				})
			},

			// 如果打开一个的时候，不需要关闭其他，则无需实现本方法
			openSettingIcon(index) {
				// 先将正在被操作的swipeAction标记为打开状态，否则由于props的特性限制，
				// 原本为'false'，再次设置为'false'会无效
				// console.log("划开", index, this.setModelIcon)
				let lsList = this.setModelIcon
				lsList[index].show = true;
				lsList.map((val, idx) => {
					if (val.id != lsList[index].id) val.show = false;
				})
				this.setModelIcon = lsList;
			},

			//点击跳转到年历页面
			yearCalendar() {
				//console.log("跳转")
				uni.navigateTo({
					url: '/pages/yearCalendar/yearCalendar'
				});
			}

		}
	}
</script>

<style lang="scss" scoped>
	@import "./index.scss";
</style>
