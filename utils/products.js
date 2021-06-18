let products = {
	randomNum() {
		var arr = []; //首先利用字面量生成一个空数组
		//利用Math.random乘100000来生成五位数（Number）
		var random_num = parseInt(Math.random() * 100000);
		//打印出来看一看
		console.log(random_num);
		//设置一个名为count的记录变量
		var count = 0;
		//for循环来为arr空数组来赋值
		for (var i = 0; i < 5; i++) {
			//给这个五位数（Number）求模，第一次循环的时候是个位，第二次循环时十位...
			var res = random_num % 10;
			//如果求模等于0，证明这次生成的数为0，退出本次循环
			if (random_num === 0) {
				continue;
			}
			//每一次循环都/10，然后求整，为了下一次循环求模创造条件
			random_num = parseInt(random_num / 10);
			//把每一次求模得到的数添加到数组
			arr += res;
			//count记录变量记录添加的次数
			count++;
		}
		console.log(count);
		return arr
	},

	//分析页面的时间转换，例如：四月14 - 下午2:25
	timeSwitch(dayRecord, dateTime) {
		let {
			currentMonth,
			date
		} = dayRecord

		let {
			hours,
			minutes
		} = dateTime

		let explainDate = currentMonth + "月" + " " + date * 1
		let explainTime = ""
		if (hours < 12) {
			explainTime = "上午" + hours + ":" + (minutes < 10 ? '0' + minutes : minutes)
		} else {
			hours = hours - 12
			explainTime = "下午" + hours + ":" + (minutes < 10 ? '0' + minutes : minutes)
		}
		let newDateTime = explainDate + " - " + explainTime
		return newDateTime
	},

	//金额数字后面补 .00
	filterNumber(value) {
		let num = ""
			num = value / 100
		if (num.toString().split(".").length == 1) {
			return num + ".00"
		} else {
			if (num.toString().split(".")[1].toString().length == 1) {
				return num + "0"
			} else {
				return num + ""
			}
		}
	},
	
	//判断一个数组里是否包含这个对象值
	isIndexOf(item,list){
		let isTrueFalse = false;
		list.forEach(value=>{
			if(value.rq == item){
				isTrueFalse = true;
			}
		})
		return isTrueFalse
	},
	
	//传入年月日值，获取时间戳
	getrc_sj(dayRecord){
		let nowDate = new Date();
		let year = dayRecord.currentYear
		let month = dayRecord.currentMonth
		let date = dayRecord.date
		let hours = nowDate.getHours()
		let minutes = nowDate.getMinutes()
		let second = nowDate.getSeconds()
		minutes = minutes < 10 ? '0' + minutes : minutes
		let explainDateTime = year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + second;
		return explainDateTime;
	},
	
	//将 2021-04-24 16:51:50截取为 2021-04-24
	cutOutTime(value){
		let newValue = value.split(" ")
		return newValue[0]
	},
	
	//将 2021-4-26转为 2021年4月26日
	formatSwitchTime(value){
		let newItem = value.split("-")
		let timeNew = newItem[0] + "年" + newItem[1] + "月" + newItem[2] + "日"
		return timeNew
	},
	
	//判断值是否为数字
	isNumber(val){
	   if (parseFloat(val).toString() == "NaN") {
	   　　　　return false;
	   　　} else {
	   　　　　return true;
	   　　}
	},
	
	//给时间 如2021-04-28 添加时分秒 ，开始时间添加 00:00:00， 结束时间加 23:59:59
	startEndTime(value,type){
		if(type == "start"){
			value = value + " " + "00:00:00"
		}else if(type == "end"){
			value = value + " " + "23:59:59"
		}
		return value
	},
	
	//两个日期相差天数
	getTimeDiff(start,end){
		let startNew = new Date(start);
		let endNew = new Date(end);
		startNew = startNew.valueOf();
		endNew = endNew.valueOf();
		let differNum = Math.abs(Math.round((startNew - endNew) / 1000 / 60 / 60 /24));
		return differNum
		console.log("时间戳",startNew,endNew,differNum)
	},
	
	//截取字符串第一个字符
	cutOutString(value){
		let item = value.slice(0,1)
		return item
	},
	
	/*账单卡片用的方法*/
	
	//计算进度， 用剩余额度 除与 总额度
	calculateSum(item){
		let kyed = item.kyed * 1;
		let ed = item.ed * 1;
		let resultNum = ((ed - kyed) / ed).toFixed(2) * 100;
		return resultNum
	},
	
	//计算还款日距今天还有多少天
	calculateHkDay(item){
		let nowDate = new Date();
		let currentYear = nowDate.getFullYear()
		let currentMonth = nowDate.getMonth() + 1
		let currentDate = nowDate.getDate();
		let hkr = item.hkr;
		
		let newDay = "";
		if(currentDate <= hkr){
			newDay = Math.abs(currentDate - hkr);
		}else{
			let data = currentYear + "-" + currentMonth + "-" + currentDate;
			
			let hkrYear = currentYear;
			let hkrMonth = currentMonth + 1;
			if(hkrMonth > 12){
				hkrMonth = hkrMonth - 12;
				hkrYear = hkrYear + 1;
			}
			
			let hkrDate = hkrYear + "-" + hkrMonth + "-" + hkr;
			newDay = this.getTimeDiff(data,hkrDate)
		}
		
		return newDay
	},
	
}

export default products
