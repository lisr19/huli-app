<template>
	<div class="head-bar">
		<div class="left">
			<slot name="left">
				<Icon  type="ios-arrow-back" @click="goBack"/>
			</slot>
		</div>
		{{title}}
		<div class="right">
			<slot name="right">
			</slot>
		</div>

	</div>
</template>

<script>
	export default {
		name: "head-bar",
		props: {
			title: String, // 标题
		},
		data() {
			return {
				isBack:false
			}
		},
		methods:{
			goBack(){
				if(this.title=='订单详情'){
					this.$router.push({name:'首页'})
				}else{
					this.$router.back()//返回上一层
				}
			},
		}
	}
</script>
<style scoped>
	.head-bar >>> .ivu-icon{
		font-size: 58px;
	}
</style>
<style lang="less" scoped>
	.head-bar{
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
		.left{
			position: absolute;
			left: 20px;
			top: 0;
		}
		.right{
			position: absolute;
			right: 20px;
			font-size:28px;
			font-family:PingFangSC-Regular,PingFang SC;
			font-weight:400;
			color:rgba(1,122,255,1);
			line-height:40px;
		}
	}
</style>
