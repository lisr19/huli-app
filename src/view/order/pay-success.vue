<template>
	<div class="main">
		<head-bar title="支付成功"></head-bar>
		<img src="@/assets/icon/success.png" alt="">
		<p class="tip1">支付完成</p>
		<p class="tip2">您已成功预订，已加入您的订单</p>
		<button class="btn" @click="openOrder">查看订单</button>
		<button class="btn close" @click="close">关闭</button>
	</div>
</template>

<script>
	import headBar from '@/components/header/head-bar'
	// import {getOrderList} from "@/lib/API/order";

	export default {
		components:{
			headBar,
		},
		data(){
			return{
			}
		},
		created(){
			this.orderId = this.$route.query.orderId
		},
		activated(){
			if(this.orderId!=this.$route.query.orderId){
				this.orderId = this.$route.query.orderId
			}
		},
		methods: {
			openOrder(){
				this.$router.push({ name:'订单详情',query:{orderId:this.orderId}});
			},
			close(){
				this.$router.push({ name:'首页'});
			}
		}
	}
</script>

<style lang="less" scoped>
	.main{
		padding: 90px 40px;
		img{
			width:186px;
			height:186px;
			margin: 86px 0 56px;
		}
		.tip1{
			height:44px;
			font-size:32px;
			font-family:PingFangSC;
			font-weight:600;
			color:rgba(51,51,51,1);
			line-height:44px;
		}
		.tip2{
			font-size:24px;
			font-family:PingFangSC-Regular;
			font-weight:400;
			color:rgba(153,153,153,1);
			line-height:34px;
			margin: 20px 0 120px;
		}
		.btn{
			/*width:480px;*/
			width: 70%;
			height:80px;
			background:rgba(71,189,195,1);
			border-radius:10px;
			margin: 0 auto 50px;
			font-size:36px;
			font-family:PingFangSC-Semibold;
			font-weight:600;
			color:rgba(255,255,255,1);
			border: none;
			display: block;
		}
		.close{
			background:rgba(244,244,244,1);
			border:2px solid rgba(151,151,151,1);
			color:rgba(51,51,51,1);
		}
	}
</style>

