<template>
	<div class="msg">
		<head-bar :title="msg.title"></head-bar>
		<div class="content">
			<!--<p class="title">《{{msg.title}}》</p>-->
			<!--<p class="time">{{msg.addTime}}</p>-->
			<div v-html="message" class="desc"></div>
		</div>
	</div>
</template>


<script>
	import headBar from '@/components/header/head-bar'
	import {getEducDetail} from "@/lib/API/comment"
	export default {
		components:{
			headBar,
		},
		data() {
			return {
				message:null
			}
		},
		created() {
			this.msg=this.$route.params.msg
			this.educationId=this.$route.query.educationId
			this.getEducDetail({educationId:this.educationId})
		},
		mounted(){

		},
		methods: {
			async getEducDetail(params){
				let res = await getEducDetail(params)
				if(res.code===200){
					this.message = res.data
				}else {
					this.message = res.message
				}
			}
		},
	}
</script>

<style scoped>
	.desc>>>a{
		display: none;
	}
</style>
<style lang="less" scoped>
	.msg{
		background-color: #ffffff;
		padding-top: 90px;
		min-height: 100%;
		.content{
			width: 100%;
			background:rgba(255,255,255,1);
			padding: 46px 40px;
			margin: 0 auto;
			text-align: left;
			.title{
				font-size:32px;
				font-family:PingFangSC-Medium,PingFangSC;
				font-weight:500;
				color:rgba(51,51,51,1);
				line-height:44px;
			}
			.time{
				font-size:22px;
				font-family:PingFangSC-Regular,PingFangSC;
				font-weight:400;
				color:rgba(153,153,153,1);
				line-height:32px;
				margin: 16px 0 32px;
			}
			.desc{
				font-size:28px;
				font-family:PingFangSC-Regular,PingFangSC;
				font-weight:400;
				color:rgba(102,102,102,1);
				line-height:40px;
				word-break: break-all;
			}
		}
	}
</style>
