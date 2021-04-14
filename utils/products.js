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
	}
}

export default products
