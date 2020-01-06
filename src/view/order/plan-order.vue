<template>
	<div class="main">
		<div class="head-bar"><Icon  type="ios-arrow-back" @click="goBack"/>填写订单</div>
		<div class="user-info">
			<p class="line"></p>
			<div class="card">
				<div class="item">
					<span>联系人：</span>
					<input type="text" placeholder="添加" v-model.trim="contact">
				</div>
				<div class="item">
					<span>联系电话：</span>
					<input  type="tel" placeholder="添加" v-model.trim="phone" oninput="if(value.length>13)value=value.slice(0,13)">
				</div>
				<div class="item">
					<span>隶属区域：</span>
					<Select v-model="subordinateArea" placeholder="请选择隶属区域" @on-change="changeSubord">
						<Option :value="item.itemName" :key="item.id"  v-for="item in areaList">{{item.itemName}}
						</Option>
					</Select>
				</div>
				<div class="item">
					<span>服务地址：</span>
					<Input class="address" type="textarea" :rows="2" v-model.trim="address" placeholder="添加服务地址"  />
				</div>
			</div>
		</div>
		<div class="card-info">
			<div class="nurse-info">
				<!--<img src="@/assets/icon/hl1.png" alt="">-->
				<img :src="selectImg" alt="">
				<div class="nurse-content">
					<p class="type">{{selectName}}</p>
					<p v-if="selectChild">{{selectChild}}</p>
					<p v-else>{{selectContent}}</p>
					<p class="price"><span>￥{{totalPrice}}</span>元/次</p>
				</div>
			</div>
			<div class="card">
				<div class="item" @click="showPopFn">
					<span>服务时间</span>
					<span v-if="date">{{showTime}}</span>
					<span v-else style="color:rgba(153,153,153,1);display: flex;align-items: center">请选择服务时间
						<Icon type="ios-arrow-forward" style="margin-left: 10px;font-size: 20px"/>
					</span>
				</div>
				<div class="item hospital">
					<span>选择医院</span>
					<Select v-model="hospital" placeholder="请选择医院" clearable  @on-change="changeHospital">
						<Option :value="item.id" :key="item.id"  v-for="item in hospList">{{item.name}}
						</Option>
					</Select>
				</div>
				<div class="item" @click="selectNurse">
					<span>指定护士</span>
					<span v-if="nurseName">{{nurseName}}</span>
					<span v-else style="color:rgba(153,153,153,1);display: flex;align-items: center">自动匹配
						<Icon type="ios-arrow-forward" style="margin-left: 10px;font-size: 20px"/>
					</span>
				</div>
			</div>
		</div>
		<div class="other">
			<p>备注：</p>
			<textarea v-model="comment"></textarea>
		</div>
		<div class="footer" v-show="hideshow">
		    <span class="price">
		       合计： <em >￥{{totalPrice}}</em>
		    </span>
			<Button class="btn" type="primary" :loading="loading" @click="openPay">{{loading?'提交中':'提交订单'}}</Button>
		</div>
		<van-popup v-model="show" position="bottom" :style="{ height: '40%' }">
			<van-datetime-picker
					v-model="currentDate"
					type="datetime"
					:min-date="minDate"
					:max-date="maxDate"
					:formatter="formatter"
					:filter="filter"
					@confirm="confirmFn()"
					@cancel="cancelFn()"
			/>
		</van-popup>
	</div>
</template>

<script>
	import {MessageBox,Indicator} from "mint-ui";
	import {getUserDate} from "@/lib/API/login-enroll";
	import {addOrder,getAreaList,getNurList,getHospital } from "@/lib/API/order";
	import {getHealthList} from "@/lib/API/comment";

	export default {
		data(){
			return{
				loading: false,
				minDate: new Date(),
				maxDate: new Date(2019, 10, 1),
				currentDate: new Date(),
				hospital:null,
				hospitalId:null, //医院ID
				hospList:[], //医院列表
				healthId:null,
				maData:{}, //健康档案信息
				selectImg:'',
				selectName:'',
				selectContent:'',
				selectChild:'',
				serviceId:null, //服务ID
				subordinateArea:null, //隶属区域
				totalPrice:0,
				nurseName:null,
				areaList:[], //隶属区域列表
				hideshow:true,  //显示或者隐藏footer
				contact:null, //联系人
				phone:null, //联系电话
				idCard:null,//身份证
				address:null,//地址
				isSelect:true,
				date:null,
				showTime:null,
				comment:null, //备注
				noNurse:false,
				show:false,
			}
		},
		beforeRouteEnter(to, from, next) {
			next(vm => {
				if(from.name == '首页') {
		            vm.date = null
		            vm.nurseName = null
		        }
				if(from.name == '护士详情') {
					vm.nurseName = localStorage.getItem('nurseName')
					vm.nurseId = localStorage.getItem('nurseId')
				}
		    })
		},
		created(){
			this.userId = localStorage.getItem('userId')
			this.phone = localStorage.getItem('username')
			this.getAreaList()
			this.getHospital()
			this.tomorrow = this.getDay(1,'-')  //获取当前日期后一天
			this.nextWeek = this.getDay(7,'-')  //获取当前日期一周时间
		},
		mounted(){
			this.minDate = new Date(this.tomorrow)
			this.maxDate =new Date(new Date(this.nextWeek).getTime() +10*3600*1000)
			this.currentDate = new Date(this.tomorrow)
			if(this.$route.query&&this.$route.query.from==='选项目'){
				this.getHealthList({userId:this.userId})
			}
		},
		activated(){
			if(this.$route.query&&this.$route.query.from==='订单列表'){
				let rp = this.$route.params
				console.log(rp);
				this.contact = rp.orderMsg.contact
				this.address = rp.orderMsg.serviceAddress
				this.phone =  rp.orderMsg.contactPhone
				this.subordinateArea =  rp.orderMsg.subordinateArea
				this.hospital =  rp.orderMsg.hospitalId
				this.nurseName = rp.orderMsg.nurseList?rp.orderMsg.nurseList[0].name:null
				this.nurseId = rp.orderMsg.nurseList?rp.orderMsg.nurseList[0].id:null
			}
			if(this.selectName!=this.$route.query.selectName){
				this.selectName = this.$route.query.selectName
			}
			if(this.totalPrice!=this.$route.query.totalPrice){
				this.totalPrice = this.$route.query.totalPrice
			}
			if(this.serviceId!=this.$route.query.serviceId){
				this.serviceId = this.$route.query.serviceId
			}
			if(this.detailServiceIds!=this.$route.query.detailServiceIds){
				this.detailServiceIds = this.$route.query.detailServiceIds
			}
			if(this.selectImg!=this.$route.query.selectImg){
				this.selectImg = this.$route.query.selectImg
			}
			if(this.selectContent!=this.$route.query.selectContent){
				this.selectContent = this.$route.query.selectContent
			}
			if(this.selectChild!=this.$route.query.selectChild){
				this.selectChild = this.$route.query.selectChild
			}
			// console.log(this.detailServiceIds);
		},
		methods: {
			//格式化时间
			formatter(type, value) {
				if (type === 'year') {
					return `${value}年`;
				} else if (type === 'month') {
					return `${value}月`
				}else if (type === 'day') {
					return `${value}日`
				}else if (type === 'hour') {
					return `${value}时`
				}else if (type === 'minute') {
					return `${value}分`
				}
				return value;
			},
			//过滤时间
			filter(type, options) {
				if (type === 'hour') {
					return options.filter(option => (option >= 8 && option < 20 && option != 12&&option != 13))
				}
				return options;
			},
			showPopFn() {
				this.show = true;
			},
			confirmFn() { // 确定按钮
				setTimeout(()=>{
					console.log(this.formatDate(this.currentDate))
					this.date = this.formatDate(this.currentDate)
					this.nurseName = null
					this.show = false;
				},100)
			},
			cancelFn(){
				this.show = false;
			},
			changeHospital(){
				this.nurseName = null
				this.nurseId = null
			},
			changeSubord(){
				// this.hospital = null
				this.nurseName = null
				this.nurseId = null
			},
			//医院列表
			async 	getHospital(params){
				let res = await getHospital(params)
				if(res.code === 200){
					this.hospList = res.data.list
				}
			},
			//护士列表
			// async getNurList(params){
			// 	let res = await getNurList(params)
			// 	if(res.code === 200){
			// 		if(res.data.list.length===0){
			// 			this.noNurse = true
			// 			this.$toast('该时间段暂无可匹配护士')
			// 		}else {
			// 			this.noNurse = false
			// 			this.$router.push({name:'指定护士',params:{
			// 					callback:this.callback},query:{
			// 					serviceTime:this.date,
			// 					subordinateArea:this.subordinateArea,
			// 					serviceId:this.serviceId,
			// 					hospitalId:this.hospital
			// 				}})
			// 		}
			// 	}
			// },

			//指定护士
			selectNurse(){
				if(this.subordinateArea===''|| this.subordinateArea===null ||this.subordinateArea===undefined){
					this.$toast('请选择隶属区域')
				}else if(this.date===''|| this.date===null ||this.date===undefined){
					this.$toast('请选择护理时间')
				}else {
					this.$router.push({name:'指定护士',params:{
							callback:this.callback},query:{
							serviceTime:this.date,
							subordinateArea:this.subordinateArea,
							serviceId:this.serviceId,
							hospitalId:this.hospital?this.hospital:null
						}})
				}
			},
			//指定护士回调
			callback(params){
				console.log(params);
				this.nurseName = params.nurseName
				this.nurseId = params.nurseId
				this.hospital = params.hospitalId
			},
			//获取当前时间
			getDay(num, str) {
				let today = new Date();
				let nowTime = today.getTime();
				let ms = 24*3600*1000*num;
				today.setTime(parseInt(nowTime + ms))
				let oYear = today.getFullYear()
				let oMoth = (today.getMonth() + 1).toString();
				if (oMoth.length <= 1) oMoth = '0' + oMoth;
				let oDay = today.getDate().toString();
				if (oDay.length <= 1) oDay = '0' + oDay;
				// this.currDate = oYear + str + oMoth + str + oDay
				return oYear + str + oMoth + str + oDay;
			},
			// 格式化获取的时间
			formatDate(date) {
				const y = date.getFullYear()
				let M = date.getMonth() + 1
				M = M < 10 ? '0' + M : M
				let d = date.getDate()
				d = d < 10 ? ('0' + d) : d
				let h = date.getHours()
				h = h < 10 ? ('0' + h) : h
				let m = date.getMinutes()
				m = m < 10 ? ('0' + m) : m
				this.showTime = M + '月' + d + '日  ' + h + ':' + m
				return y + '-' + M + '-' + d + ' ' + h + ':' + m + ':'+'00'
			},
			//获取健康档案信息
			async getHealthList(params){
				let res = await getHealthList(params)
				if(res.code === 200){
					// console.log('获取个人信息成功');
					if(res.data.list.length>0){
						console.log('有个人健康档案');
						this.maData = res.data.list[0]
						this.contact = this.maData.name
						this.address = this.maData.residenceAddress
						if(this.maData.residenceContactPhone==='null'||!this.maData.residenceContactPhone){
							this.getUserDate({userId:this.userId})
						}else {
							this.phone =  this.maData.residenceContactPhone
						}
						this.subordinateArea =  this.maData.subordinateArea
						this.healthId = this.maData.id
					}else {
						// MessageBox.confirm('您尚未完善健康档案，现在去完善吗？').then(action => {
						// 	if(action==='confirm'){
						// 		this.$router.push({name:'健康档案'})
						// 	}
						// }).catch(() => {
						// 	console.log('取消');
						// })
					}
				}
			},
			//获取个人信息
			async getUserDate(params) {
				let res = await getUserDate(params)
				if (res.code === 200) {
					this.phone = res.data.username //默认电话
				}
			},
			//下订单
			async addOrder(params){
				this.loading=true
				let res = await addOrder(params)
				if(res.code === 200){
					this.loading=false
					this.orderId = res.data
					this.$router.push({name:'支付',query:{
							totalPrice:this.totalPrice,
							serviceId:this.serviceId,
							selectName:this.selectName,
							selectImg:this.selectImg,
							selectContent:this.selectContent,
							selectChild:this.selectChild,
							showTime:this.showTime,
							orderId:this.orderId,
							from:'下订单'
						}})
				}else {
					this.loading=false
					this.$toast(res.message)
				}
			},
			//隶属区域列表
			async getAreaList(params){
				let res = await getAreaList(params)
				if(res.code === 200){
					this.areaList =res.data.list
				}
			},
			openPay(){
				if(this.contact===''||this.contact===null||this.contact===undefined){
					this.$toast('请填写联系人')
					return
				}else if(this.phone===''|| this.phone===null ||this.phone===undefined){
					this.$toast('请填写联系电话')
					return
				} else if(this.subordinateArea===''|| this.subordinateArea===null ||this.subordinateArea===undefined){
					this.$toast('请选择隶属区域')
					return
				}else if(this.address===''||this.address===null ||this.address===undefined){
					this.$toast('请填写服务地址')
					return
				} else if(this.date===''|| this.date===null ||this.date===undefined){
					this.$toast('请选择护理时间')
					return
				} else if(!this.isSelect){
					this.$toast('未同意预订须知')
					return
				}
				if(!(/^1[3-9]\d{9}$/.test(this.phone))&&!(/^0(\d{2,3}|\d{2,3}-|)?\d{7,8}$/.test(this.phone))){
					this.$toast('电话号码格式错误')
					return
				}
				let params = {
					userId:this.userId,
					contact:this.contact,
					contactPhone:this.phone,
					amount:this.totalPrice,
					serviceAddress:this.address,
					serviceTime:this.date,
					subordinateArea:this.subordinateArea,
					serviceId:this.serviceId,
				}
				if(this.hospital){
					params.hospitalId=this.hospital
				}
				if(this.detailServiceIds){
					params.detailServiceIds=this.detailServiceIds
				}
				if(this.nurseId){
					params.nurses = this.nurseId
				}
				if(this.comment){
					params.comment = this.comment
				}
				console.log(params);
				this.addOrder(params)
			},
			goBack(){
				MessageBox.confirm('您的订单尚未完成，确定返回吗？').then(action => {
					if(action==='confirm'){
						this.$router.back()//返回上一层
					}
				}).catch(() => {
					console.log('取消');
				})
			},
		}
	}
</script>

<style scoped>
	.head-bar >>> .ivu-icon{
		font-size: 58px;
		position: absolute;
		left: 20px;
	}
	.main>>>.picker-item{
		padding:0 0 0 20px;
	}
	.main>>>.ivu-select{
		width: 35%;
		background:rgba(248,248,248,1);
		border-radius:22px;
	}
	.main >>> .ivu-input-wrapper{
		text-align: right;
	}
	.address>>> .ivu-input{
		/*width: 500px;*/
		width: 90%;
		/*color: #47BDC3;*/
	}
	.hospital>>>.ivu-select{
		width: 50%;
	}
</style>

<style lang="less" scoped>
	.main{
		padding: 90px 0 120px;
		min-height: 100%;
		background-color: #F8F9FB;
		.user-info{
			width:100%;
			height:252px;
			background:linear-gradient(180deg,rgba(71,189,195,1) 0%,rgba(71,189,195,1) 51%,rgba(248,248,248,1) 100%);
			position: relative;
			.line{
				height: 0;
				padding-bottom: 28px;
			}
			.card{
				/*width:702px;*/
				width:94%;
				height:410px;
				background:rgba(255,255,255,1);
				border-radius:10px;
				margin: 0 auto;
				padding: 5px 16px 16px ;
				.item{
					/*width:670px;*/
					width:100%;
					border-bottom:solid #D4D4D4FF 1px; /*no*/
					display: flex;
					align-items: center;
					justify-content: space-between;
					font-size:28px;
					font-family:PingFangSC;
					font-weight:400;
					color:rgba(72,72,72,1);
					padding: 18px 0;

					span{
						width: 180px;
						text-align: left;
					}
					span:last-child{
						color:rgba(71,189,195,1);
					}
				}
				.item:last-child{
					border-bottom: none;
				}
			}
		}
		.card-info{
			/*width:702px;*/
			width:94%;
			min-height:424px;
			background:rgba(255,255,255,1);
			border-radius:10px;
			margin: 205px auto 0;
			padding-bottom: 30px;
			.nurse-info{
				display: flex;
				padding: 18px 16px 25px;
				img{
					width:144px;
					height:144px;
					background:rgba(216,216,216,1);
					border-radius:10px;
				}
				.nurse-content{
					font-size:24px;
					font-family:PingFangSC-Regular;
					font-weight:400;
					color:rgba(72,72,72,1);
					line-height:40px;
					text-align: left;
					margin-left: 32px;
					flex: 1;
					.type{
						height:40px;
						font-size:28px;
						font-family:PingFangSC;
						font-weight:500;
						color:rgba(51,51,51,1);
						line-height:40px;
					}
					.price{
						margin: 10px 0 8px;
						height:44px;
						font-size:24px;
						font-family:PingFangSC;
						font-weight:400;
						color:rgba(217,47,47,1);
						line-height:44px;
						span{
							color: #d92f2f;
							font-size:30px;
						}
					}
					.manager{
						display: flex;
						align-items: center;
						img{
							height: 36px;
							width: auto;
							margin-left: 18px;
						}
					}
				}
			}
			.card{
				display: flex;
				flex-direction: column;
				align-items: center;
				.item{
					/*width:670px;*/
					width:95%;
					display: flex;
					align-items: center;
					border-bottom:solid #D4D4D4FF 1px; /*no*/
					justify-content: space-between;
					font-size:28px;
					font-family:PingFangSC;
					font-weight:400;
					color:rgba(72,72,72,1);
					padding: 22px 16px;
					span:last-child{
						color:rgba(71,189,195,1);
					}
				}
				.item:first-child{
					border-top:solid #D4D4D4FF 1px; /*no*/
				}
			}
			.notice{
				border-bottom:solid #D4D4D4FF 1px; /*no*/
				font-family:PingFangSC-Regular;
				font-size:36px;
				font-weight:400;
				color:rgba(51,51,51,1);
				line-height:50px;
				text-align: left;
				padding: 25px 40px 25px 0;
				>p:last-child{
					font-size:32px;
					color:rgba(51,51,51,1);
					line-height:44px;
					margin-top: 24px;
				}
				div{
					margin-top: 10px;
					padding-bottom: 50px;
					h1{
						font-size: 32px;
						>p{
							font-weight: 500;
							margin-top: 0;
						}
					}
				}
				.icon{
					width:46px;
					height:46px;
					border-radius: 50%;
					border: solid #d6d6d6 1px;
					display: block;
				}
				.icon-select{
					width:48px;
					height:48px;
					color: #47BDC3;
					display: block;
				}
			}
		}
		.other{
			/*width:702px;*/
			width:94%;
			height:244px;
			background:rgba(255,255,255,1);
			border-radius:10px;
			margin: 30px auto 24px;
			text-align: left;
			padding: 14px 20px;
			p{
				height:40px;
				font-size:28px;
				font-family:PingFangSC;
				font-weight:400;
				color:rgba(72,72,72,1);
				line-height:40px;
			}
			textarea{
				/*width:670px;*/
				width:100%;
				height:154px;
				background:rgba(247,247,247,1);
				border-radius:4px;
				margin-top: 12px;
				padding: 8px 15px;
				font-size:24px;
				font-family:PingFangSC;
				font-weight:400;
				color:rgba(72,72,72,1);
				line-height:34px;
				border: none;
			}
		}
		.footer{
			height:104px;
			background:rgba(255,255,255,1);
			border-radius:6px;
			position: fixed;
			bottom: 0;
			width: 100%;
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 0 40px;
			.price{
				font-size:28px;
				font-family:PingFangSC;
				font-weight:600;
				color:rgba(51,51,51,1);
				em{
					font-size:40px;
					font-weight:500;
					color:rgba(217,47,47,1);
				}
			}
			.btn{
				width:208px;
				height:72px;
				background:rgba(71,189,195,1);
				border-radius:8px;
				border: none;
				font-size:32px;
				font-family:PingFangSC;
				font-weight:600;
				color:rgba(255,255,255,1);
				line-height:44px;
			}
		}
		input{
			border: none;
			text-align: right;
			color: #47BDC3;
		}
		input:focus { outline: none; }
		.sure-btn{
			font-size: 28px;
			background: #47BDC3;
		}
	}
	.head-bar{
		background:rgba(71,189,195,1);
		color:rgba(255,255,255,1);
		width: 100%;
		height:90px;
		line-height:90px;
		box-shadow:0px 4px 8px 0px rgba(0,0,0,0.05);
		position: fixed;
		font-family:PingFangSC;
		font-weight:500;
		top: 0;
		left: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size:28px;
		z-index: 50;
	}
</style>

