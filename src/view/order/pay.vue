<template>
	<div class="main">
		<head-bar title="付款"></head-bar>
		<div class="hotel-infor">
			<img v-if="selectImg" :src="selectImg" alt="">
			<!--<img v-else src="@/assets/icon/hl1.png" alt="">-->
			<div class="hotel-content">
				<p class="type">{{selectName}}</p>
				<p class="desc" v-if="selectChild">{{selectChild}}</p>
				<p class="desc" v-else>{{selectContent}}</p>
				<p class="date">{{showTime}}</p>
				<p class="price"><span>{{totalPrice}}元</span></p>
			</div>
		</div>
		<div class="pay-type">
			<div class="item">
				<div>
					<img src="@/assets/icon/zfb.png" alt="">
					<span>支付宝</span>
				</div>
				<!--<div>-->
					<!--<span>医疗付款方式：</span>-->
					<!--<Select v-model="payType" placeholder="请选择付款方式">-->
						<!--<Option :value="item.id" :key="item.id"  v-for="item in payList">{{item.itemName}}-->
						<!--</Option>-->
					<!--</Select>-->
				<!--</div>-->
				<Icon type="ios-arrow-forward" />
			</div>
		</div>
		<div class="pay-detail">
			<p class="total-price">
				<span>总价</span>
				<span>¥{{totalPrice}}</span>
			</p>
		</div>
		<div class="notice">
			我同意
			<a href="javascript:void(0)" @click="openPro">互联网+护理服务协议</a>,
			我也同意支付以下所示的总金额（含服务费）
			<span @click="isSelect=!isSelect">
	            <em class="icon" v-if="!isSelect"></em>
	            <img class="icon-select" v-else src="@/assets/icon/yes.png" alt="">
             </span>
		</div>
		<button class="btn" @click="surePay">预定确认·￥{{totalPrice}}</button>
	</div>
</template>

<script>
	import {getPayType,surePay} from "@/lib/API/order";
	import headBar from '@/components/header/head-bar'
	import {MessageBox} from "mint-ui";

	export default {
		components:{
			headBar,
		},
		data(){
			return{
				selectImg:'',
				selectName:'',
				selectContent:'',
				selectChild:'',
				showTime:'',
				totalPrice:0,
				orderData:{},
				isSelect:true,
				payList:[], //付款方式列表
				payType:''
			}
		},
		created(){
			console.log(this.$route.query);
			this.orderId = this.$route.query.orderId
			this.totalPrice = this.$route.query.totalPrice
			this.selectName = this.$route.query.selectName
			this.selectImg = this.$route.query.selectImg
			this.selectContent = this.$route.query.selectContent
			this.selectChild = this.$route.query.selectChild
			this.showTime = this.$route.query.showTime
			// this.getPayType()
		},
		// activated(){
		// 	if(this.selectName!=this.$route.query.selectName){
		// 		this.selectName = this.$route.query.selectName
		// 	}
		// 	if(this.selectImg!=this.$route.query.selectImg){
		// 		this.selectImg = this.$route.query.selectImg
		// 	}
		// 	if(this.selectContent!=this.$route.query.selectContent){
		// 		this.selectContent = this.$route.query.selectContent
		// 	}
		// 	if(this.selectChild!=this.$route.query.selectChild){
		// 		this.selectChild = this.$route.query.selectChild
		// 	}
		// 	if(this.totalPrice!=this.$route.query.totalPrice){
		// 		this.totalPrice = this.$route.query.totalPrice
		// 	}
		// 	if(this.serviceId!=this.$route.query.serviceId){
		// 		this.serviceId = this.$route.query.serviceId
		// 	}
		// },
		mounted(){
		},
		methods: {
			goBack(){
				MessageBox.confirm('您尚未完成付款，确定退出吗？').then(action => {
					if(action==='confirm'){
						if(this.$route.query&&this.$route.query.from==='下订单'){
							this.$router.go(-2)
							setTimeout(()=>{
								this.$router.push({ name:'订单详情',query:{orderId:this.orderId}});
							},10)
						}else {
							this.$router.back()//返回上一层
						}
					}
				}).catch(() => {
					console.log('取消');
				})
			},
			openPro(){
				this.$router.push({name:'用户服务协议'})
			},
			async surePay(){
				if(!this.isSelect){
					this.$toast('您未同意相关服务协议')
					return
				}
				let res = await surePay({orderId:this.orderId})
				if(res.code===200){
					this.$router.push({name:'支付成功',query:{orderId:this.orderId}})
				}else {
					this.$toast(res.message)
				}
			},
			async getPayType(){
				let res = await getPayType()
				if(res.code===200){
					this.payList = res.data.list
				}
			},
		}
	}
</script>

<style lang="less" scoped>
	.main{
		padding: 90px 40px;
		.hotel-infor{
			margin: 36px 0;
			display: flex;
			img{
				width:176px;
				height:176px;
				display: block;
			}
			.hotel-content{
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
				.desc{
					margin-top: 10px;
					font-size:24px;
					font-family:PingFangSC-Regular;
					font-weight:400;
					color:rgba(51,51,51,1);
					line-height:34px;
				}
				.price{
					font-size:32px;
					font-family:PingFangSC-Semibold;
					font-weight:600;
					color:rgba(217,47,47,1);
					line-height:44px;
					margin-top: 8px;
					span{
						font-weight:400;
						font-size:26px;
					}
					em{
						font-weight:400;
						font-size:26px;
						color: #555555;
					}
				}
			}
		}
		.pay-type{
			.item{
				/*width:670px;*/
				width: 100%;
				height: 88px;
				border-bottom:solid #D4D4D4FF 1px; /*no*/
				border-top:solid #D4D4D4FF 1px; /*no*/
				display: flex;
				justify-content: space-between;
				align-items: center;
				font-size:24px;
				font-family:PingFangSC-Regular;
				font-weight:400;
				color:rgba(51,51,51,1);
				line-height:34px;
				i{
					color: #999999FF;
					font-size: 45px;
				}
				>div{
					display: flex;
					align-items: center;
					img{
						width:48px;
						height:48px;
						margin-right: 52px;
					}
				}
			}
		}
		.pay-detail{
			font-size:28px;
			font-family:PingFangSC-Regular;
			font-weight:400;
			color:rgba(51,51,51,1);
			line-height:40px;
			padding: 36px 0 98px;
			>p{
				display: flex;
				justify-content: space-between;
				margin-bottom: 20px;
			}
			.total-price{
				font-size:32px;
				font-family:PingFangSC-Semibold;
				font-weight:600;
				color:rgba(51,51,51,1);
				line-height:44px;
			}
		}
		.notice{
			font-size:28px;
			font-family:PingFangSC-Regular;
			font-weight:400;
			color:rgba(51,51,51,1);
			line-height:40px;
			border-bottom:solid #D4D4D4FF 1px; /*no*/
			border-top:solid #D4D4D4FF 1px; /*no*/
			padding: 36px 0;
			text-align: left;
			position: relative;
			a{
				color:#626BFD;
			}
			.icon{
				width:34px;
				height:34px;
				border-radius: 50%;
				border: solid #d6d6d6 1px;
				display: block;
				position: absolute;
				bottom: 20px;
				right: 10px;
			}
			.icon-select{
				width:34px;
				height:34px;
				color: #628CFD;
				display: block;
				position: absolute;
				bottom: 20px;
				right: 10px;
			}
		}
		.btn{
			/*width:670px;*/
			width: 90%;
			height:90px;
			background:rgba(71,189,195,1);
			border-radius:6px;
			font-size:32px;
			font-family:PingFangSC-Semibold;
			font-weight:600;
			color:rgba(255,255,255,1);
			line-height:44px;
			border: none;
			margin-top: 250px;
		}
	}
</style>

