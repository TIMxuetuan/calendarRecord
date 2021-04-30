<template>
	<view class="billCategory">
		<view class="">
			<!--页面右下角加号-->
			<view class="rightAdd" @click="rightAddClick">
				<u-icon name="plus" color="#ffffff" size="32"></u-icon>
			</view>

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
			<view class="">
				<u-gap height="20" bg-color="#F1F1F1"></u-gap>
			</view>
			<scroll-view scroll-y="true" class="scroll-Y" lower-threshold="10">
				<view class="category-list">
					<u-swipe-action class="category-swipe" :show="item.show" :index="index"
						v-for="(item,index) in kpLists" :key="index" @content-click="dianContent"
						@click="clickSettingIcon" @open="openSettingIcon" :options="setOptions">
						<view class="category-item">
							<view class="category-left">
								<view class="category-img">
									{{cutOutString(item.bs)}}
								</view>
								<view class="category-centent">
									<view class="centent-top">
										<text class="cententTop-title">{{item.bs}}</text>
										<text>到期还款日：{{item.hkr}}</text>
									</view>
									<view class="centent-line">
										<u-line-progress class="line-progress" :round="false" height="10"
											:show-percent="false" active-color="#80007F" :percent="calculateSum(item)"></u-line-progress>
									</view>
									<view class="centent-text">
										<text class="cleared-style" v-if="item.syhk == 0">
											本期还款已结清，
										</text>
										<text class="also-style" v-else>
											本期还款还有{{calculateHkDay(item)}}天，
										</text>
										<text class="">
											待还款：{{item.syhk}}
										</text>
									</view>
								</view>
							</view>
							<view class="category-right">
								<view class="">
									{{item.kyed}}
								</view>
								<view class="">
									{{item.ed}}
								</view>
							</view>
						</view>
					</u-swipe-action>
				</view>
			</scroll-view>
		</view>

		<u-popup v-model="addModelShow" z-index="10095" mode="center" width="90%" border-radius="10"
			:safe-area-inset-bottom="true" negative-top>
			<view class="billModel">
				<u-form :model="form" ref="uForm">
					<u-form-item label="标识" label-width="150" prop="bs">
						<u-input v-model="form.bs" placeholder="标识" />
					</u-form-item>
					<u-form-item label="额度" label-width="150" prop="ed">
						<u-input v-model="form.ed" placeholder="额度" type="digit" />
					</u-form-item>
					<u-form-item label="账单日" label-width="150" prop="zdr">
						<u-input v-model="form.zdr" placeholder="账单日" type="digit" />
					</u-form-item>
					<u-form-item label="还款日" label-width="150" prop="hkr">
						<u-input v-model="form.hkr" placeholder="还款日" type="digit" />
					</u-form-item>
					<u-form-item label="剩余还款" label-width="150" prop="syhk">
						<u-input v-model="form.syhk" placeholder="剩余还款" type="digit" />
					</u-form-item>
					<u-form-item label="可用额度" label-width="150" prop="kyed">
						<u-input v-model="form.kyed" placeholder="可用额度" type="digit" />
					</u-form-item>
				</u-form>
				<view class="twoBtn">
					<u-button :custom-style="buttonStyle" type="primary" @click="submitClick">提交</u-button>
				</view>
			</view>
		</u-popup>
		
		<!--删除记录确认弹窗-->
		<u-modal v-model="deleteSetIcon" z-index="10085" show-cancel-button content="确定删除吗？" confirm-color="red"
			@confirm="confirmSetIcon"></u-modal>
	</view>
</template>

<script>
	import products from "../../utils/products.js"
	import allApi from "../../utils/api_methods.js"
	export default {
		data() {
			return {
				user_info:"",
				kpLists:[], //卡片数组集合
				addModelShow: false,
				buttonStyle: {
					width: "300rpx"
				},
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

				form: {
					bs: "",
					ed: "",
					zdr: "",
					hkr: "",
					syhk: "",
					kyed: "",
				},
				rules: {
					bs: [{
						required: true,
						message: '请输入标识',
						trigger: ['change', 'blur'],
					}],
					ed: [{
						required: true,
						message: '请输入额度',
						trigger: ['change', 'blur'],
					}],
					zdr: [{
						required: true,
						message: '请输入账单日',
						trigger: ['change', 'blur'],
					}],
					hkr: [{
						required: true,
						message: '请输入还款日',
						trigger: ['change', 'blur'],
					}],
					syhk: [{
						required: true,
						message: '请输入剩余还款',
						trigger: ['change', 'blur'],
					}],
					kyed: [{
						required: true,
						message: '请输入可用额度',
						trigger: ['change', 'blur'],
					}],
				},
				setKpIndex:"", //卡片滑块点击的index
				deleteSetIcon:false, //控制删除弹窗
				isAddEdit:"", //是否新增还是编辑 ，当为 addNew时新增， editNew为编辑
				formItem:{},
			};
		},
		onLoad() {
			this.user_info = uni.getStorageSync('user_info');
			console.log("this.user_info",this.user_info);
			this.getKpLists(); //获得卡片数组
		},
		onReady() {
			this.$refs.uForm.setRules(this.rules);
		},
		onReachBottom: function() {
			console.log("api到底")
		},
		onPullDownRefresh: function() {
			//监听下拉刷新动作的执行方法，每次手动下拉刷新都会执行一次
			this.getKpLists(); //获得卡片数组
			setTimeout(function() {
				uni.stopPullDownRefresh(); //停止下拉刷新动画
				console.log("结束")
			}, 2000);
		},
		methods: {
			...products,
			
			// 如果打开一个的时候，不需要关闭其他，则无需实现本方法
			openSettingIcon(index) {
				// 先将正在被操作的swipeAction标记为打开状态，否则由于props的特性限制，
				// 原本为'false'，再次设置为'false'会无效
				
				let lsList = this.kpLists;
				console.log("滑动",lsList)
				lsList[index].show = true;
				lsList.map((val, idx) => {
					if (val.id != lsList[index].id) val.show = false;
				})
				this.kpLists = lsList;
			},

			//打开添加类别弹窗
			rightAddClick() {
				let that = this;
				this.addModelShow = true;
				this.isAddEdit = "addNew"
				console.log("aaa",this.$refs.uForm)
				this.$refs.uForm.resetFields();
				this.form = {
					bs:"",
					ed:"",
					zdr:"",
					hkr:"",
					syhk:"",
					kyed:"",
				}
			},
			
			//获取卡片数组
			getKpLists(){
				allApi.listkp({
					wechat_id:this.user_info.id
				}).then(res=>{
					if(res.event == 100){
						
						//将四个统计赋值
						let fourLists = this.fourLists;
						fourLists.forEach(item=>{
							if(item.name == "还入"){
								item.value = res.list.hk;
							}else if(item.name == "刷出"){
								item.value = res.list.zc;
							}else if(item.name == "手续费"){
								item.value = res.list.sxf;
							}else if(item.name == "负债"){
								item.value = res.list.fz;
							}
						})
						this.fourLists = fourLists;
						console.log("fourLists",this.fourLists)
						
						//将数组里的值加入 show = false
						res.list.list.forEach(item=>{
							item.show = false
						})
						this.kpLists = res.list.list;
						console.log("获得卡片数组",res,this.kpLists)
					}else{
						uni.showToast({
							title: res.msg,
							icon: "none",
							duration: 2000
						});
					}
				})
			},

			//点击提交卡片类别按钮
			submitClick() {
				this.$refs.uForm.validate(valid => {
					if (valid) {
						console.log('验证通过',this.form);
						if(this.isAddEdit == "addNew"){
							//新增
							allApi.add_kp({
								"info[wechat_id]":this.user_info.id,
								"info[bs]":this.form.bs,
								"info[ed]":this.form.ed,
								"info[zdr]":this.form.zdr,
								"info[hkr]":this.form.hkr,
								"info[syhk]":this.form.syhk,
								"info[kyed]":this.form.kyed,
							}).then(res=>{
								if(res.event == 100){
									console.log("res",res)
									this.addModelShow = false;
									this.getKpLists(); //获得卡片数组
								}else{
									uni.showToast({
										title: res.msg,
										icon: "none",
										duration: 2000
									});
								}
							})
						}else if(this.isAddEdit == "editNew"){
							console.log("编辑",this.form)
							allApi.editkp({
								"info[id]":this.formItem.id,
								"info[wechat_id]":this.user_info.id,
								"info[bs]":this.form.bs,
								"info[ed]":this.form.ed,
								"info[zdr]":this.form.zdr,
								"info[hkr]":this.form.hkr,
								"info[syhk]":this.form.syhk,
								"info[kyed]":this.form.kyed,
							}).then(res=>{
								if(res.event == 100){
									console.log("res",res)
									this.addModelShow = false;
									this.getKpLists(); //获得卡片数组
								}else{
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
			
			//编辑和删除功能点击
			clickSettingIcon(index, index1) {
				if (index1 == 1) {
					this.setKpIndex = index
					this.deleteSetIcon = true;
					console.log("删除",this.setKpIndex)
				} else {
					this.isAddEdit = "editNew"
					let item = this.kpLists[index]
					console.log("编辑",item)
					this.addModelShow = true;
					this.formItem = item;
					this.form = {
						bs:item.bs,
						ed:item.ed,
						zdr:item.zdr,
						hkr:item.hkr,
						syhk:item.syhk,
						kyed:item.kyed,
					}
				}
			},
			
			//卡片列表里删除 某一卡片
			confirmSetIcon() {
				// console.log("删除", this.setKpIndex, this.kpLists, this.kpLists[this.setKpIndex])
				let id = this.kpLists[this.setKpIndex].id
				allApi.delkp({
					id: id,
				}).then(res => {
					if (res.event == 100) {
						this.getKpLists();
						uni.showToast({
							title: res.msg,
							icon: "none",
							duration: 2000
						});
					}else{
						uni.showToast({
							title: res.msg,
							icon: "none",
							duration: 2000
						});
					}
				})
			},

		}
	}
</script>

<style lang="scss" scoped>
	@import "./index.scss"
</style>
