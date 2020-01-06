<template>
	<div class="order">
		<div class="top-box">
			<h1 class="title">订单</h1>
			<ul class="tabs">
				<li v-for="(item,index) in tabs" :class="{active:index===currIndex}" @click="tabType(index)">
					{{item.name}}
					<span :class="{line:index===currIndex}"></span>
					<em class="num" v-if="payTotal">{{payTotal}}</em>
				</li>
			</ul>
		</div>
		<div class="content">
			<van-pull-refresh v-model="isDownLoading" @refresh="onRefresh">
				<van-list v-model="isUpLoading" :finished="finished" @load="onLoad" :immediate-check="false">
					<ul class="order-items">
						<li class="item" v-for="item in orderList" @click="openOrderDetail(item.id)">
							<p class="pro">
								<span>护理项目：{{item.serviceName}}</span>
								<span class="status" v-if="item.orderStatus===-2||item.orderStatus===-1">已取消</span>
								<span class="status orange" v-else-if="item.orderStatus===0"> <em></em>等待付款</span>
								<span class="status green" v-else-if="item.orderStatus===1 || item.orderStatus===2|| item.orderStatus===3|| item.orderStatus===4"> <em></em>待服务</span>
								<span class="status" v-else-if="item.orderStatus===5||item.orderStatus===6||item.orderStatus===7"> <em></em>待评价</span>
								<span class="status" v-else-if="item.orderStatus===8">已完成</span>
							</p>
							<div style="display: flex;align-items: center">
								<img :src="item.servicePicUrl" alt="">
								<div>
									<p class="num">订单编号：NS{{item.id.toString().padStart(11, '0')}}</p>
									<p class="time">上门时间：{{item.serviceTime}}</p>
									<p class="address">服务地址：【{{item.subordinateArea}}】{{item.serviceAddress}}</p>
									<p class="price">总价格：￥{{item.amount}}</p>
								</div>
							</div>
							<div class="btn-box">
								<span class="btn orange" v-if="item.orderStatus===0" @click.stop="goPay(item)">去付款</span>
								<!--<span class="btn" v-if="item.orderStatus===5||item.orderStatus===6 ">去评价</span>-->
								<span class="btn" v-if="item.orderStatus===5 ||item.orderStatus===6 ||item.orderStatus===7||item.orderStatus===8" @click.stop="againReserve(item)">再次预约</span>
								<span class="btn" v-if="item.orderStatus===-2||item.orderStatus===-1" @click.stop="againReserve(item)">重新预订</span>
								<span class="btn" v-if="item.orderStatus===0 ||item.orderStatus===1 || item.orderStatus===2|| item.orderStatus===3|| item.orderStatus===4" @click.stop="quitOrder(item)">取消</span>
							</div>
						</li>
					</ul>
					<img style="width: 50%;margin-left: 30px;margin-top: 50px" src="@/assets/icon/null-icon.png" alt="" v-if="orderList.length===0&&!isUpLoading&&!isDownLoading&&!loading">
				</van-list>
			</van-pull-refresh>
		</div>
	</div>
</template>
<script>
	// 0-订单提交 -1订单拒绝 -2-订单取消 1-订单支付完成 2-订单审核通过 3-订单已接单 4-订单处理中 5-订单完成，待评价 6-再次预约，待评价 7-转院，待评价 8-评价完成
	import {getOrderList,cancleOrder} from "@/lib/API/order";
	import {MessageBox, Loadmore,Indicator } from 'mint-ui';
	export default {
		name: "order",
		props : ['crrentVal'],
		watch:{
			crrentVal:{
				handler(newValue) {
					if(newValue==='订单'){
						this.getOrderList({userId:Number(this.userId),size:this.size,page:1})
						this.getDfkList({userId:Number(this.userId),orderStatus:0})
					}
				},
				deep:true
			}
		},
		data(){
			return{
				totalPage: 0, //总页数
				isDownLoading:false,//下拉刷新
				isUpLoading:false,//上拉加载
				loading:false,//接口数据加载中
				finished: false,//控制在页面往下移动到底部时是否调用接口获取数据
				payTotal:null,
				currIndex:0,
				orderList:[],//订单列表
				orderStatus:0,//订单状态
				tabs:[
					{
						name:'所有'
					},
					{
						name:'待付款'
					},
					{
						name:'待服务'
					},
					{
						name:'已取消'
					},
					{
						name:'已完成'
					},
				],
				size:20,
				page:1,
				total:0,
				clientHeight:'',
				boxHeight:'',
			}
		},
		created(){
			this.userId = localStorage.getItem('userId')
			this.getOrderList({userId:Number(this.userId),size:this.size,page:1})
			this.getDfkList({userId:Number(this.userId),orderStatus:0})
		},
		mounted(){
			// 获取浏览器可视区域高度
			// this.clientHeight = `${document.documentElement.clientHeight}`
			// window.onresize = function temp() {
			// 	this.clientHeight = `${document.documentElement.clientHeight}`
			// }
			// this.boxHeight = this.clientHeight -160
		},
		activated(){
			// this.orderList=[]
			// setTimeout(()=>{
			// 	this.getOrderList({userId:Number(this.userId),size:this.size,page:1})
			// },300)
		},
		methods:{
			onRefresh() {
				console.log(this.isDownLoading);
				setTimeout(() => {
					this.page=1
					this.orderList= []
					this.finished = false
					this.getOrderList({userId:Number(this.userId),size:this.size,page:1})
				}, 500);
			},
			//页面初始化之后会触发一次，在页面往下加载的过程中会多次调用【上拉加载】
			onLoad() {
				if(!this.isDownLoading){
					console.log('触发加载');
					setTimeout(()=>{
						this.getOrderList({userId:Number(this.userId),size:this.size,page:this.page})
					},500)
				}
			},
			tabType(index){
				if(this.currIndex!==index){
					this.currIndex=index
					this.page=1
					this.orderList=[]
					this.finished = false
					this.isDownLoading = true
					this.isUpLoading = false
					this.getOrderList({userId:Number(this.userId),size:this.size,page:1})
				}
			},
			// 去付款
			goPay(item){
				console.log(item);
				this.$router.push({name:'支付',query:{
						totalPrice:item.amount,
						// serviceId:item.serviceId,
						selectName:item.serviceName,
						selectImg:item.servicePicUrl,
						selectContent:item.serviceContent,
						// selectChild:item.selectChild,
						showTime:item.serviceTime,
						orderId:item.id
					}
				})
			},
			// 获取订单列表
			async getOrderList(params){
				console.log(this.page);
				if(this.currIndex===1){//待付款
					params.orderStatus = 0
				}else if(this.currIndex===2){ //待服务
					params.orderStatus = '1,2,3,4'
				}else if(this.currIndex===3){ //已取消
					params.orderStatus = '-1,-2'
				}else if(this.currIndex===4){ //已完成
					params.orderStatus = '5,6,7,8'
				}
				// if(this.page===1){
				// 	Indicator.open('加载中...')
				// 	this.loading = true
				// }
				Indicator.open('加载中...')
				this.loading = true
				let res = await getOrderList(params)
				if(res.code===200){
					Indicator.close()
					this.loading = false
					this.isDownLoading = false
					this.total = res.data.total
					this.totalPage = Math.ceil(this.total/this.size)
					if(this.totalPage===0||this.totalPage===1){
						this.finished = true
					}else if(this.totalPage>this.page){
						this.page++
					}else {
						this.finished = true
					}
					this.isUpLoading =false
					this.loading = false
					if(this.currIndex===1){
						this.payTotal = res.data.total
					}else {
						this.payTotal = null
					}
					if(this.page===1){
						this.orderList=res.data.list
					}else {
						this.orderList= this.orderList.concat(res.data.list)
					}
				}else if(res.message==='请先登录'||res.code===401) {
					Indicator.close()
					this.loading = false
					MessageBox.alert('您的账号信息已过期，请重新登录').then(() => {
						localStorage.clear()
						this.$router.push({name:'登录'})
					})
				}else {
					Indicator.close()
					this.loading = false
				}
			},
			// 获取待付款订单列表
			async getDfkList(params){
				let res = await getOrderList(params)
				if(res.code===200){
					this.payTotal = res.data.total
				}
			},
			// 打开订单详情
			openOrderDetail(orderId){
				this.$router.push({ name:'订单详情',query:{orderId:orderId},params:{callback:this.callback}})
			},
			//取消订单回调
			callback() {
				if(this.currIndex===1){  //待付款
					this.getOrderList({userId:Number(this.userId),orderStatus:0})
				}else if(this.currIndex===2){  //待服务
					this.getOrderList({userId:Number(this.userId),orderStatus:'1,2,3,4'})
				}else if(this.currIndex===3){  //已取消
					this.getOrderList({userId:Number(this.userId),orderStatus:'-1,-2'})
				}else if(this.currIndex===4){  //已完成
					this.getOrderList({userId:Number(this.userId),orderStatus:'5,6,7,8'})
				}else {
					this.getOrderList({userId:Number(this.userId)})
				}
			},
			// 取消订单
			async cancleOrder(item){
				let res = await cancleOrder({orderId:item.id})
				if(res.code===200){
					this.$toast('取消订单成功')
					this.orderList=[]
					if(this.currIndex===1){  //待付款
						this.getOrderList({userId:Number(this.userId),orderStatus:0})
					}else if(this.currIndex===2){  //待服务
						this.getOrderList({userId:Number(this.userId),orderStatus:'1,2,3,4'})
					}else if(this.currIndex===3){  //已取消
						this.getOrderList({userId:Number(this.userId),orderStatus:'-1,-2'})
					}else if(this.currIndex===4){  //已完成
						this.getOrderList({userId:Number(this.userId),orderStatus:'5,6,7,8'})
					}else {
						this.getOrderList({userId:Number(this.userId)})
					}
				}else {
					this.$toast(res.message)
				}
			},
			quitOrder(item){
				MessageBox.confirm('您确定取消该订单吗?').then(action => {
					if(action==='confirm'){
						this.cancleOrder(item)
					}
				}).catch(() => {
					console.log('取消');
				})
			},
			againReserve(item){
				// console.log(item);
				this.$router.push({name:'下订单',
					query:{
						totalPrice:item.amount,
						serviceId:item.serviceId,
						selectName:item.serviceName,
						selectImg:item.servicePicUrl,
						selectContent:item.serviceContent,
						hospitalId:item.hospitalId,
						from:'订单列表'
					},
					params:{
						// selectImg:item.servicePicUrl,
						orderMsg:item
					}
				})
			}
		}

	}
</script>

<style lang="less" scoped>
	.order{
		.top-box{
			position: fixed;
			top: 0;
			width: 100%;
			background:rgba(247,247,247,1);
			padding: 48px 40px 0;
			z-index: 9;
			.title{
				height: 66px;
				font-size:48px;
				font-weight:600;
				color:rgba(72,72,72,1);
				line-height:66px;
				text-align: left;
			}
			.tabs{
				display: flex;
				justify-content: space-around;
				font-family:PingFangSC-Regular;
				font-weight:400;
				color:rgba(142,142,147,1);
				line-height:56px;
				padding: 26px 0;
				font-size:28px;
				li:nth-child(2){
					position: relative;
					.num{
						position: absolute;
						top: -5px;
						right: -25px;
						display: block;
						width: 30px;
						height: 30px;
						line-height: 28px;
						color: #ffffff;
						background-color: #FF5A60;
						border-radius: 50%;
						font-size: 18px;
					}
				}
				.num{
					display: none;
				}
				.active{
					color:rgba(71,189,195,1);
					font-size:30px;
					font-family:PingFangSC;
					font-weight:500;
				}
				.line{
					height: 3px;
					width: 100%;
					display: block;
					background-color:rgba(71,189,195,1);
				}
			}
		}
		.content{
			padding-top: 200px;
			background:rgba(247,247,247,1);
			.order-items{
				display: flex;
				justify-content: center;
				align-items: center;
				margin-top: 32px;
				flex-direction: column;
				padding-bottom: 100px;
				.item{
					/*width:698px;*/
					width:93%;
					background:rgba(255,255,255,1);
					border-radius:20px;
					margin-bottom: 30px;
					padding: 8px 20px 30px;
					img{
						width:125px;
						height:125px;
						border-radius: 8px;
						margin-right: 20px;
					}
					p{
						font-size:22px;
						font-family:PingFangSC-Regular;
						font-weight:400;
						color:rgba(102,102,102,1);
						text-align: left;
						margin: 8px 0;
						word-break:break-all;
					}
					.pro{
						font-size:28px;
						font-family:PingFangSC;
						font-weight:500;
						color:rgba(51,51,51,1);
						line-height:50px;
						height: 64px;
						position: relative;
						border-bottom: solid 2px #E8E8E8;
						span:first-child{
							width: 80%;
							overflow: hidden;
							white-space: nowrap;
							text-overflow: ellipsis;
							display: inline-block;
						}
						span:last-child{
							position: absolute;
							right: 6px;
							top:6px;
							height:34px;
							font-size:24px;
							font-family:PingFangSC;
							font-weight:500;
							color:rgba(153,153,153,1);
							line-height:34px;
						}
						.green{
							color:rgba(71,195,104,1);
							display: flex;
							align-items: center;
							em{
								width:24px;
								height:24px;
								background:rgba(71,195,104,1);
								border-radius: 50%;
								margin-right: 8px;
							}
						}
						.orange{
							color:yellow;
							display: flex;
							align-items: center;
							color:rgba(254,118,0,1);
							em{
								width:24px;
								height:24px;
								background:yellow;
								border-radius: 50%;
								margin-right: 8px;
								background:rgba(254,118,0,1);;
							}
						}
					}
					.num{
						margin: 20px 0 0px;
						font-size:24px;
						font-family:PingFangSC;
						font-weight:400;
						color:rgba(51,51,51,1);
					}
					.btn-box{
						text-align: right;
						margin-top: 10px;
						.btn{
							display: inline-block;
							width:144px;
							height:48px;
							line-height: 44px;
							background:rgba(255,255,255,1);
							border-radius:14px;
							border:2px solid rgba(216,216,216,1);
							text-align: center;
							margin-left: 16px;
							font-size: 24px;
						}
						.orange{
							border:2px solid rgba(254,118,0,1);
							color:rgba(254,118,0,1);
						}
					}
				}
			}
		}
	}
</style>

