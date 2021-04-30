<template>
	<view class="bill-container">

		<!--页面右下角加号-->
		<view class="rightAdd" @click="rightAddClick">
			<u-icon name="plus" color="#ffffff" size="32"></u-icon>
		</view>

		<!--页面右下角查看类别列表-->
		<view class="rightLists" @click="rightListsClick">
			<u-icon name="order" color="#ffffff" size="32"></u-icon>
		</view>

		<view>
			<u-tabs-swiper ref="uTabs" :list="list" name="bs" :current="current" @change="tabsChange" :is-scroll="false"
				swiperWidth="750" active-color="#3EB34D" bar-width="80"></u-tabs-swiper>
		</view>
		<view class="container">
			<swiper :current="swiperCurrent" @transition="transition" @animationfinish="animationfinish"
				style="height: 100%;width: 100%;">
				<swiper-item class="swiper-item" v-for="(item, index) in tabs" :key="index">
					<scroll-view scroll-y style="height: 100%;width: 100%;" @scrolltolower="onreachBottom">
						<view class="">
							<u-gap height="40" bg-color="#F1F1F1"></u-gap>
						</view>
						<view class="swiperItem-all">
							<view class="swiperAll-top">
								<view class="allTop-item" v-for="(fourItem,fourIndex) in fourLists" :key="fourIndex">
									<view class="">
										{{fourItem.value}}
									</view>
									<view class="">
										{{fourItem.name}}
									</view>
								</view>
							</view>
							<view class="swiperAll-content">
								<view class="allContent-item" v-for="(billItem,billIndex) in billLists" :key="billIndex"
									@click="billItemClick(billItem)">
									<view class="itemLeft">
										<view class="itemLeft-img">
											{{cutOutString(billItem.bs)}}
										</view>
										<view class="itemLeft-text">
											<view class="">
												{{billItem.bs}}
											</view>
											<view class="iLeftText-deputy">
												{{billItem.sj}}{{billItem.bz}}
											</view>
										</view>
									</view>
									<view class="itemRight">
										<view class="">
											{{billItem.lx}}
										</view>
										<view class="itemRight-price"
											:class=" billItem.je > 0 ? 'positiveNum' : 'minusNum' ">
											{{billItem.je}}
										</view>
									</view>
								</view>
							</view>
						</view>
					</scroll-view>
				</swiper-item>
			</swiper>
		</view>

		<!--添加账单详情内容弹窗-->
		<u-popup v-model="billModelShow" z-index="10085" mode="bottom" width="100%" border-radius="10"
			:safe-area-inset-bottom="true" negative-top>
			<view class="billModel">
				<u-form :model="form" ref="uForm">
					<u-form-item :label="switchVal == false ? '刷出' : '还入'">
						<u-switch slot="right" v-model="switchVal"></u-switch>
					</u-form-item>
					<u-form-item label="所属账户" label-width="150">
						<view class="their" slot="right" @click="selectAccount">
							<view class="">
								{{theirItem.bs}}
							</view>
							<view class="their-icon">
								<u-icon name="arrow-right" color="#8899A3" size="32"></u-icon>
							</view>
						</view>
					</u-form-item>
					<u-form-item label="金额" label-width="120" prop="money">
						<u-input v-model="form.money" placeholder="金额" type="digit" />
					</u-form-item>
					<u-form-item label="手续费" label-width="120" prop="service">
						<u-input v-model="form.service" placeholder="手续费" type="digit" />
					</u-form-item>
					<u-form-item label="商户" label-width="120" prop="merchant">
						<u-input v-model="form.merchant" placeholder="商户" />
					</u-form-item>
				</u-form>
				<view class="twoBtn">
					<u-button :custom-style="buttonStyle">重置</u-button>
					<u-button :custom-style="buttonStyle" type="primary" @click="submitClick">提交</u-button>
				</view>
			</view>
		</u-popup>

		<!--所属商户弹窗-->
		<u-popup v-model="merchantShow" z-index="10095" mode="center" width="80%" height="50%" border-radius="10"
			:safe-area-inset-bottom="true" negative-top>
			<view class="merchant-show">
				<u-checkbox-group :wrap="true" :disabled="disabledGroup">
					<u-checkbox @change="checkboxChange" v-model="item.checked" v-for="(item, index) in theirList"
						:key="index" :name="item.name">{{item.name}}</u-checkbox>
				</u-checkbox-group>
				<view class="merchant-btn">
					<u-button type="primary" @click="checkOk">确定</u-button>
				</view>
			</view>
		</u-popup>

		<!--点击某条记录时弹出的操作弹窗-->
		<u-popup z-index="10085" v-model="ecbClickModel" mode="center" width="80%" border-radius="14">
			<view class="ecbmodel">
				<view @click="ecbEdit()" class="">编辑</view>
				<view @click="ecbDelect()" class="ecbmodel-del">删除</view>
			</view>
		</u-popup>

		<!--删除记录确认弹窗-->
		<u-modal v-model="deleteSetIcon" z-index="10085" show-cancel-button content="确定删除吗？" confirm-color="red"
			@confirm="confirmSetIcon"></u-modal>
	</view>
</template>

<script>
	import products from "../../utils/products.js";
	import allApi from "../../utils/api_methods.js";
	export default {
		data() {
			return {
				user_info: "",
				list: [], // 因为内部的滑动机制限制，请将tabs组件和swiper组件的current用不同变量赋值
				tabs: [],

				theirList: [], //添加记录弹窗里面，所属用的列表
				billModelShow: false, //账单详情弹窗
				theirItem: {}, //所属商户临时的数据
				current: 0, // tabs组件的current值，表示当前活动的tab选项
				swiperCurrent: 0, // swiper组件的current值，表示当前那个swiper-item是活动的
				fourLists: [{
						name: "还入",
						value: 0
					},
					{
						name: "刷出",
						value: 0
					},
					{
						name: "手续费",
						value: 0
					},
					{
						name: "负债",
						value: 0
					},
				],
				billLists: [], //账单信息列表
				form: {
					money: "",
					service: "",
					merchant: "",
				},
				rules: {
					money: [{
						required: true,
						message: '请输入金额',
						trigger: ['change', 'blur'],
					}],
					service: [{
						required: true,
						message: '请输入手续费',
						trigger: ['change', 'blur'],
					}],
					merchant: [{
						required: true,
						message: '请输入商户',
						trigger: ['change', 'blur'],
					}],
				},
				switchVal: false,
				buttonStyle: {
					width: "200rpx"
				},
				merchantShow: false, //控制所属商户弹窗
				pitchLists: {},

				kid: "",
				page: 0,
				ecbClickModel: false, //记录操作弹窗
				ecbItem: "",
				deleteSetIcon: false,
				isAddEdit: "", //是否新增还是编辑 ，当为 addNew时新增， editNew为编辑
				disabledGroup: false,
				oldlists:[], //老记录数据，为分页用
				total:0,
			};
		},
		onReady() {
			this.$refs.uForm.setRules(this.rules);
		},
		onLoad() {

		},
		onShow() {
			console.log("show")
			this.user_info = uni.getStorageSync('user_info');
			console.log("this.user_info", this.user_info);
			this.getKname(); //获得卡片名称
			this.getJl_list();
		},
		onPullDownRefresh: function() {
			//监听下拉刷新动作的执行方法，每次手动下拉刷新都会执行一次
			setTimeout(function() {
				uni.stopPullDownRefresh(); //停止下拉刷新动画
				console.log("结束")
			}, 2000);
		},
		methods: {
			...products,

			// tabs通知swiper切换
			tabsChange(index) {
				this.swiperCurrent = index;
				console.log("this.swiperCurrent", this.swiperCurrent)
			},
			// swiper-item左右移动，通知tabs的滑块跟随移动
			transition(e) {
				let dx = e.detail.dx;
				this.$refs.uTabs.setDx(dx);
			},
			// 由于swiper的内部机制问题，快速切换swiper不会触发dx的连续变化，需要在结束时重置状态
			// swiper滑动结束，分别设置tabs和swiper的状态
			animationfinish(e) {
				let current = e.detail.current;
				this.page = 0;
				this.oldlists = [];
				this.$refs.uTabs.setFinishCurrent(current);
				this.swiperCurrent = current;
				this.current = current;
				let listNew = this.list;
				if (listNew[current].bs == "全部") {
					this.kid = "";
				} else {
					this.kid = listNew[current].id
				}
				this.getJl_list();
				console.log("animationfinish", this.swiperCurrent, this.current, listNew, this.kid)
			},

			// scroll-view到底部加载更多
			onreachBottom() {
				console.log("组件到底了")
				if (this.billLists.length < this.total) {
					var page = this.page;
					page++;
					this.oldlists = this.billLists
					this.page = page
					this.getJl_list();
				} else {
					uni.showToast({
						title: '到底了',
						icon: 'none',
						duration: 2000
					});
				}
			},

			//获得卡片名称
			getKname() {
				this.theirList = [];
				allApi.get_kname({
					wechat_id: this.user_info.id
				}).then(res => {
					if (res.event == 100) {
						this.theirList = this.theirList.concat(res.list); //所属用的列表
						let list = res.list;
						list.unshift({
							bs: "全部"
						})
						this.list = list;
						this.tabs = list;
						console.log("this.list", this.list)
					} else {
						uni.showToast({
							title: res.msg,
							icon: "none",
							duration: 2000
						});
					}
				})
			},

			//获得卡片记录列表信息
			getJl_list() {
				allApi.jl_list({
					wechat_id: this.user_info.id,
					kid: this.kid,
					page: this.page
				}).then(res => {
					if (res.event == 100) {
						//将四个统计赋值
						let fourLists = this.fourLists;
						fourLists.forEach(item => {
							if (item.name == "还入") {
								item.value = res.data.hk;
							} else if (item.name == "刷出") {
								item.value = res.data.zc;
							} else if (item.name == "手续费") {
								item.value = res.data.sxf;
							} else if (item.name == "负债") {
								item.value = res.data.fz;
							}
						})
						this.fourLists = fourLists;
						this.total = res.total;
						
						//获取上次加载的数据
						var oldlists = this.oldlists; //console.log(oldlists)
						var newlists = oldlists.concat(res.list); //合并数据 res.data 你的数组数据
						this.billLists = newlists;
						console.log("获得", this.billLists, this.fourLists)

					} else {
						this.fourLists = [{
								name: "还入",
								value: 0
							},
							{
								name: "刷出",
								value: 0
							},
							{
								name: "手续费",
								value: 0
							},
							{
								name: "负债",
								value: 0
							},
						];
						this.billLists = "";
						uni.showToast({
							title: res.msg,
							icon: "none",
							duration: 2000
						});
					}
				})
			},

			//打开添加账单详情弹窗
			rightAddClick() {
				this.billModelShow = true;
				let theirList = this.theirList;
				this.theirItem = this.theirList[0];
				this.form = {
					money: "",
					service: "",
					merchant: "",
				}
				this.isAddEdit = "addNew";
				this.disabledGroup = false;
			},

			//打开选择账户弹窗
			selectAccount() {
				this.merchantShow = true;

				let theirList = this.theirList;
				let theirItemId = this.theirItem.id.split(",");
				console.log("theirItemId", theirItemId)
				theirList.forEach(item => {
					item.checked = false;
					item.name = item.bs;

					for (var i = 0; i < theirItemId.length; i++) {
						if (item.id == theirItemId[i]) {
							item.checked = true;
						}
					}

				})

				this.theirList = theirList;
				console.log("this.theirList", this.theirItem, this.theirList)

			},

			checkboxChange(e) {
				this.$forceUpdate()
			},

			//点击确定事件
			checkOk() {
				let newList = this.theirList;
				let pitchName = [];
				let pitchId = [];
				newList.forEach(item => {
					if (item.checked) {
						pitchName.push(item.name);
						pitchId.push(item.id);
					}
				})
				this.theirItem = {
					bs: pitchName.join(","),
					id: pitchId.join(",")
				}
				this.merchantShow = false;
				console.log("detail", this.theirItem)
			},

			//添加记录事假
			submitClick() {
				this.$refs.uForm.validate(valid => {
					if (valid) {
						let myDate = new Date();
						let timestamp = myDate.valueOf();;
						console.log("switchVal", this.switchVal, this.theirItem, this.form, timestamp);
						if (this.isAddEdit == "addNew") {
							console.log("新增")
							allApi.add_jl({
								"info[wechat_id]": this.user_info.id,
								"info[kid]": this.theirItem.id,
								"info[lx]": this.switchVal,
								"info[je]": this.form.money,
								"info[sxf]": this.form.service,
								"info[bz]": this.form.merchant,
								"info[sj]": timestamp,
							}).then(res => {
								if (res.event == 100) {
									console.log(res)
									this.billModelShow = false;
									this.getJl_list();
								} else {
									uni.showToast({
										title: res.msg,
										icon: "none",
										duration: 2000
									});
								}
							})
						} else if (this.isAddEdit == "editNew") {
							console.log("编辑", this.ecbItem)
							allApi.editjl({
								"info[id]": this.ecbItem.id,
								"info[wechat_id]": this.user_info.id,
								"info[kid]": this.theirItem.id,
								"info[lx]": this.switchVal,
								"info[je]": this.form.money,
								"info[sxf]": this.form.service,
								"info[bz]": this.form.merchant,
								"info[sj]": timestamp,
							}).then(res => {
								if (res.event == 100) {
									console.log(res)
									this.billModelShow = false;
									this.getJl_list();
								} else {
									uni.showToast({
										title: res.msg,
										icon: "none",
										duration: 2000
									});
								}
							})
						}

					} else {
						console.log('验证失败');
					}
				});
			},

			//点击某一条数据，弹出操作弹窗
			billItemClick(item) {
				console.log("item", item)
				this.ecbClickModel = true;
				this.ecbItem = item;
			},

			//点击编辑，弹出新增编辑弹窗，并初始化赋值
			ecbEdit() {
				let ecbItem = this.ecbItem
				console.log("ecbItem", ecbItem)
				this.billModelShow = true;
				this.ecbClickModel = false;

				this.switchVal = ecbItem.je > 0 ? true : false
				this.theirItem = {
					bs: ecbItem.bs,
					id: ecbItem.kid,
				}
				this.form = {
					money: ecbItem.je,
					service: ecbItem.lx,
					merchant: ecbItem.bz,
				}
				this.isAddEdit = "editNew";
				this.disabledGroup = true;
			},

			//点击删除，弹出删除弹窗
			ecbDelect() {
				this.ecbClickModel = false;
				this.deleteSetIcon = true;
			},

			//删除确认弹窗
			confirmSetIcon() {
				console.log("当前item", this.ecbItem)
				allApi.deljl({
					id: this.ecbItem.id
				}).then(res => {
					if (res.event == 100) {
						console.log(res)
						this.deleteSetIcon = false;
						this.getJl_list();
					} else {
						uni.showToast({
							title: res.msg,
							icon: "none",
							duration: 2000
						});
					}
				})
			},

			//跳转账单类别页面
			rightListsClick() {
				console.log("ddd")
				uni.navigateTo({
					url: '/pages/billCategory/billCategory'
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	@import './index.scss'
</style>
