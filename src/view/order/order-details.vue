<template>
	<div class="details">
		<div class="head-title">
			<p class="back">
				<Icon  type="ios-arrow-back" @click="goBack"/>
				订单详情
			</p>
			<p class="status" v-if="order.orderStatus===-2||order.orderStatus===-1">订单已取消</p>
			<p class="status" v-else-if="order.orderStatus===0" style="margin-top: -15px">
				等待付款<br>
				<span>请尽快付款，30分钟后自动取消</span>
			</p>
			<p class="status"  v-else-if="order.orderStatus===1">
				订单支付完成，等待系统审核
			</p>
			<p class="status"  v-else-if="order.orderStatus===2">
				订单审核通过，等待护士接单
			</p>
			<p class="status" style="margin-top: -15px" v-else-if="order.orderStatus===3">
				待服务<br>
				<span>护理人员已接单，将在指定时间到达。</span>
			</p>
			<p class="status" v-else-if="order.orderStatus===4">
				订单处理中
			</p>
			<p class="status" style="margin-top: -15px" v-else-if="order.orderStatus===5||order.orderStatus===6">
				护理已完成<br>
				<span>待评价</span>
			</p>
			<p class="status" style="margin-top: -15px" v-else-if="order.orderStatus===7">
				转院<br>
				<span>待评价</span>
			</p>
			<p class="status" style="margin-top: -15px" v-else-if="order.orderStatus===8">
				护理已完成<br>
				<span>已评价</span>
			</p>
			<img src="@/assets/icon/daifuwu.png" alt="" v-if="order.orderStatus===1 || order.orderStatus===3|| order.orderStatus===4">
			<img src="@/assets/icon/shenhe.png" alt="" v-if="order.orderStatus===2">
			<img src="@/assets/icon/daifukuan.png" alt=""  v-else-if="order.orderStatus===0">
			<img src="@/assets/icon/quxiao.png" alt=""  v-else-if="order.orderStatus===-2||order.orderStatus===-1">
			<img v-else src="@/assets/icon/hlicon2.png" alt="">
		</div>
		<div class="nurse-info">
			<img :src="order.servicePicUrl" alt="">
			<div class="nurse-content">
				<div class="type">护理项目：{{order.serviceName}} <template v-if="order.hospital">({{order.hospital.name}})</template><span v-for="item in childList">【{{item.name}}】</span></div>
				<!--<div>护理内容：{{order.serviceContent}}</div>-->
				<p>护理时间：{{order.serviceTime}}</p>
				<p v-if="nurseName">指定护士：{{nurseName}}<span v-if="nursePhone">（{{nursePhone}}）</span></p>
				<p class="price"><span>￥{{order.amount}}</span>元/次</p>
			</div>
		</div>
		<!-- 订单评分 -->
		<p class="score"  v-if="order.orderStatus===5||order.orderStatus===6||order.orderStatus===7" @click="showEval=true">
			<van-rate disabled  v-model="rateValue1"  :size="30"/>
			<span>去评价</span>
		</p>
		<p class="score" v-if="order.orderStatus===8">
			<van-rate readonly   v-model="userScore"  :size="30" color="#FDA500"/>
			<span style="color:rgba(253,165,0,1)">{{userScore}}分</span>
		</p>
		<div class="btn" v-if="order.orderStatus===0" @click.stop="goPay">去付款</div>
		<div class="btn" v-if="order.orderStatus===5 ||order.orderStatus===6||order.orderStatus===7||order.orderStatus===8" @click="againReserve">再次预定</div>
		<!-- 用户订单信息 -->
		<div class="card refund"  v-if="order.orderStatus===-2">
			<h2><i></i>退款信息 <span class="tip">审核中</span></h2>
			<ul>
				<li><span>支付金额：</span>￥{{order.amount}}</li>
				<li><span>退款金额：</span>￥{{order.amount}}</li>
				<!--<li><span>取消原因：</span></li>-->
			</ul>
		</div>
		<div class="card">
			<h2><i></i>订单信息</h2>
			<ul>
				<li><span>预约人</span>{{order.contact}}</li>
				<li><span>手机号</span>{{order.contactPhone}}</li>
				<li v-if="orderId"><span>订单号</span>NS{{orderId.toString().padStart(11, '0')}}</li>
				<li><span>上门时间</span>{{order.serviceTime}}</li>
				<li><span>下单时间</span>{{order.addTime}}</li>
				<li><span>服务地址</span>【{{order.subordinateArea}}】{{order.serviceAddress}}</li>
				<li v-if="order.comment"><span>订单备注</span>{{order.comment}}</li>
				<li v-if="order.userEvaluation"><span>护理评语</span>{{order.userEvaluation}}</li>
			</ul>
		</div>
		<!-- 取消订单按钮 -->
		<div class="btn"  v-if="order.orderStatus===-1||order.orderStatus===-2" @click="againReserve">重新预订</div>
		<div class="btn" style="border: none;color:rgba(153,153,153,1);font-weight:400;margin-top: 1rem"
		     v-if="order.orderStatus===0||order.orderStatus===1 || order.orderStatus===2|| order.orderStatus===3|| order.orderStatus===4" @click="quitOrder">取消订单</div>
		<div class="mark-box" v-if="showEval">
			<div class="head">
				<Icon  type="ios-arrow-back" @click="showEval=false"/>
				评论
			</div>
			<div class="e-card">
				<p>您对护士服务满意吗？</p>
				<van-rate  v-model="score"  :size="32" color="#FDA500"/>
				<textarea class="input-tex" v-model="evaluation" placeholder="请输入评语" />
				<span class="num">{{evaluation.length}}/250</span>
				<div class="terms" @click="cyyShow=true">
					<img src="@/assets/img/cyy.png" alt="">选择常用语
				</div>
			</div>
			<div class="btn2" @click="goEvaluate()">发表评论</div>
			<van-action-sheet v-model="cyyShow" :actions="actions" @select="onSelect" />
		</div>
	</div>
</template>

<script>
	// 0-订单提交 -1订单拒绝 -2-订单取消 1-订单支付完成 2-订单审核通过 3-订单已接单 4-订单处理中 5-订单完成，待评价 6-再次预约，待评价 7-转院，待评价 8-评价完成
	// import {postNewCommen,getCommentList} from "@/lib/API/comment";
	import {getOrderDetail,cancleOrder,goEvaluate} from "@/lib/API/order";
	import headBar from '@/components/header/head-bar'
	import { MessageBox  } from 'mint-ui';
	export default {
		name:'order-details',
		components:{
			headBar,
		},
		data(){
			return{
				showEval:false, //评论
				cyyShow:false, //常用语
				actions: [
					{ name: '服务专业、细心，推荐给大家。'},
					{ name: '服务周到，无微不至，耐心细致。'},
					{ name: '主动热情,表情亲切,说话温和。'},
					{ name: '态度和蔼、服务热情、很有责任心。'},
					{ name: '任劳任怨，尽心尽职，工作耐心细致。',}
				],
				userScore:0,
				rateValue1:0,
				orderId:'',    // 订单ID
				orderType:0,  // 订单类型
				orderStatus:0,// 订单状态
				detailsBox:{},// 会议室费用详情
				markBox:{},   // 订单评分输入框
				score:0,       // 用户提交的分数
				evaluation:'',  // 用户提交的评语
				userId:'',
				order:{},
				childList:[],//子服务列表
				nurseName:'',
				nursePhone:''
			}
		},
		created(){
			this.userId = localStorage.getItem('userId')
			this.orderId =this.$route.query.orderId
			this.getOrderDetail({id:this.orderId})
		},
		methods:{
			// 获取订单详情
			async getOrderDetail(params){
				let res = await getOrderDetail(params)
				if(res.code===200){
					this.order = res.data
					this.childList = res.data.nursingServiceDetailList
					this.nurseName =res.data.nurseList&&res.data.nurseList.length!==0? res.data.nurseList[0].name:''
					this.nursePhone =res.data.nurseList&&res.data.nurseList.length!==0? res.data.nurseList[0].username:''
					this.userScore = res.data.userScore
				}
			},
			// 取消订单
			async cancleOrder(){
				let res = await cancleOrder({orderId:this.orderId})
				if(res.code===200){
					this.$toast('取消订单成功')
					this.$route.params.callback && this.$route.params.callback()
					setTimeout(()=>{
						this.$router.back()
					},300)
				}else {
					this.$toast(res.message)
				}
			},
			quitOrder(){
				MessageBox.confirm('您确定取消该订单吗?').then(action => {
					if(action==='confirm'){
						this.cancleOrder()
					}
				}).catch(() => {
					console.log('取消');
				})
			},
			// 去付款
			goPay(){
				this.$router.push({name:'支付',query:{
						totalPrice:this.order.amount,
						serviceId:this.order.serviceId,
						selectName:this.order.serviceName,
						selectImg:this.order.servicePicUrl,
						showTime:this.order.serviceTime,
						orderId:this.orderId,
						selectContent:this.order.serviceContent,
					}})
			},
			goBack(){
				this.$router.back();//返回上一层
			},
			// 去评论
			async goEvaluate(){
				this.showEval = true
				if(this.evaluation==='' || this.evaluation===null) {
					this.$toast('请输入评语')
					return
				}else if(this.evaluation.length>250){
					this.$toast('你输入内容超出范围（250字内），请删减内容')
					return
				}
				let res = await goEvaluate({
					userId :this.userId ,
					orderId:this.orderId,
					evaluation :this.evaluation,
					score :this.score,
				})
				if(res.code===200){
					this.evaluation='';
					this.score=0;
					this.$toast('评论成功')
					this.showEval = false
					this.getOrderDetail({id:this.orderId})
				}else {
					this.$toast(res.message)
				}
			},
			onSelect(item) {
				this.evaluation = item.name
				this.cyyShow = false;
			},
			//再次预订
			againReserve(){
				this.$router.push({name:'下订单',query:{
						totalPrice:this.order.amount,
						serviceId:this.order.serviceId,
						selectName:this.order.serviceName,
						selectImg:this.order.servicePicUrl,
						selectContent:this.order.serviceContent,
						from:'订单列表'
					},params:{
						selectImg:this.order.servicePicUrl,
						orderMsg:this.order
					}
				})
			}
		},
	}
</script>

<style lang="less" scoped>
	.details{
		min-height: 100%;
		background: rgba(247,247,247,1);
		padding-bottom: 20px;
		.head-title{
			height:230px;
			background:linear-gradient(135deg,rgba(71,189,195,1) 0%,rgba(0,153,160,1) 100%);
			text-align: left;
			padding-left: 20px;
			padding-top: 50px;
			position: relative;
			.back{
				height:40px;
				font-size:28px;
				font-family:PingFangSC;
				font-weight:500;
				color:rgba(255,255,255,1);
				margin-bottom: 50px;
				display: flex;
				align-items: center;
			}
			.status{
				height:44px;
				font-size:32px;
				font-family:PingFangSC;
				font-weight:400;
				color:rgba(255,255,255,1);
				padding-left: 55px;
				span{
					font-size:24px;
					font-family:PingFangSC;
					font-weight:400;
					color:rgba(255,255,255,1);
					line-height:34px;
				}
			}
			img{
				position: absolute;
				width: 140px;
				right: 60px;
				bottom: 24px;
			}
		}
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
				font-size:28px;
				font-family:PingFangSC-Regular;
				font-weight:400;
				color:rgba(72,72,72,1);
				line-height:40px;
				text-align: left;
				margin-left: 32px;
				.type{
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
		.btn{
			/*width:670px;*/
			width: 90%;
			height:90px;
			background:rgba(255,255,255,1);
			border-radius:6px;
			border:2px solid rgba(71,189,195,1);
			font-size:32px;
			font-family:PingFangSC;
			font-weight:600;
			color:rgba(71,189,195,1);
			line-height:90px;
			margin: 40px auto;
		}
		.cancel-btn{
			width:670px;
			height:90px;
			line-height: 90px;
			background:rgba(255,255,255,1);
			border-radius:6px;
			margin: 150px auto 0 ;
			font-size:32px;
			font-family:PingFangSC;
			font-weight:400;
			color:rgba(153,153,153,1);
		}
		.refund{
			margin-bottom: 20px;
			position: relative;
			.tip{
				position: absolute;
				right: 20px;
				height:50px;
				line-height: 45px;
				border-radius:25px;
				border:2px solid rgba(0,123,255,1);
				font-size:24px;
				font-family:PingFangSC;
				font-weight:400;
				color:rgba(0,123,255,1);
				padding: 0 20px;
			}
		}
		.card{
			background:rgba(255,255,255,1);
			padding: 0px 40px 30px;
			font-size: 24px;
			h2{
				text-align: left;
				display: flex;
				align-items: center;
				font-size:36px;
				font-family:PingFangSC;
				font-weight:400;
				color:rgba(51,51,51,1);
				line-height:90px;
				height: 90px;
				border-bottom: solid 2px #D4D4D4;
				i{
					width:4px;
					height:36px;
					background:rgba(71,189,195,1);
					display: inline-block;
					margin-right: 20px;
				}
			}
			ul{
				li{
					text-align: left;
					display: flex;
					align-items: center;
					margin-top: 20px;
					word-break:break-all;
					span{
						font-size:28px;
						font-family:PingFangSC;
						font-weight:400;
						color:rgba(102,102,102,1);
						min-width: 180px;
					}
				}
			}
		}
		.score{
			height:92px;
			background:rgba(255,255,255,1);
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: 0 44px;
			span{
				font-size:32px;
				font-family:PingFangSC;
				font-weight:600;
				color:rgba(153,153,153,1);
				line-height:44px;
			}
		}
		.mark-box{
			position: fixed;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			background:rgba(248,248,248,1);
			.head{
				width: 100%;
				height:90px;
				line-height:90px;
				background:rgba(245,245,245,1);
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
				color:rgba(72,72,72,1);
				z-index: 50;
				.ivu-icon{
					font-size: 58px;
					position: absolute;
					left: 20px;
				}
			}
			.e-card{
				height:614px;
				background:rgba(255,255,255,1);
				border-radius:10px;
				width: 95%;
				margin: 114px auto 0;
				padding: 30px 40px;
				position: relative;
				.num{
					position: absolute;
					right:40px;
					bottom: 60px;
					font-size: 16px;
					color: #8e8e93;
				}
				p{
					font-size:28px;
					font-family:PingFangSC-Medium,PingFang SC;
					font-weight:500;
					color:rgba(51,51,51,1);
					line-height:40px;
					margin-bottom: 26px;
				}
				.input-tex{
					height:304px;
					background:rgba(249,249,249,1);
					border-radius:10px;
					border:1px solid rgba(235,235,235,1);
					padding: 24px;
					font-size:24px;
					font-family:PingFangSC-Regular,PingFang SC;
					font-weight:400;
					line-height:34px;
					margin: 40px 0 20px;
					width: 100%;
				}
				.terms{
					text-align: left;
					display: flex;
					align-items: center;
					font-size:28px;
					font-family:PingFangSC-Regular,PingFang SC;
					font-weight:400;
					color:rgba(51,51,51,1);
					img{
						width: 38px;
						margin-right: 20px;
					}
				}

			}
			.btn2{
				width: 90%;
				height:80px;
				line-height: 80px;
				background:rgba(71,189,195,1);
				border-radius:40px;
				font-size:32px;
				font-family:PingFangSC-Medium,PingFang SC;
				font-weight:500;
				color:rgba(255,255,255,1);
				margin: 300px auto 0;
			}
			.van-action-sheet__item{
				height: 130px;
			}
		}
	}
</style>
<style scoped>
	.ivu-rate >>> .ivu-rate-star{
		font-size: 46px;
		line-height: 92px;
	}
	.ivu-rate >>> .score2 .ivu-rate-star-full:before{
		color:rgba(153,153,153,1);
	}
	.ivu-input-wrapper >>> .ivu-input{
		width: 97%;
		height: 100%;
		border: 0;
		outline-style: none;
	}
	.head-title >>> .ivu-icon{
		font-size: 48px;
		margin-right: 10px;
	}
</style>
