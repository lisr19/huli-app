<template>
	<div class="msg">
		<head-bar title="消息通知"></head-bar>
		<div class="msg-content" >
			<Scroll :on-reach-bottom="handleReachBottom" :height="boxHeight">
				<mt-loadmore :top-method="loadTop"  ref="loadmore" style="min-height: 580px">
					<ul class="items" v-if="msgList.length">
						<li class="item" v-for="item in msgList" @click="openDetail(item)">
							<img src="@/assets/icon/hlicon2.png" alt="">
							<div class="info">
								<div class="header">
									<span class="name">{{item.name ? item.name:'消息通知'}}</span>
									<span>{{item.addTime}}</span>
								</div>
								<div class="content">
									<span>{{item.message}}</span>
									<span class="num" v-if="item.flag=== 0">1</span>
								</div>
							</div>
						</li>
					</ul>
					<div  v-if="msgList.length===0&&!loading" class="msg-null">
						<img  src="@/assets/icon/null-news.png" alt="">
					</div>
				</mt-loadmore>
			</Scroll>
		</div>
	</div>
</template>

<script>
	import {getMsgList,updateFlag} from '@/lib/API/comment'
	import { Loadmore,Indicator } from 'mint-ui';
	import headBar from '@/components/header/head-bar'
	export default {
		components:{
			headBar,
		},
		name: "message",
		data() {
			return {
				msgList:[],
				page:1,
				size:50,
				total:0,
				clientHeight:'',
				boxHeight:'',
				loading:false,
			}
		},
		created() {
			this.userId = localStorage.getItem('userId')
			this.getMsgList({userId :this.userId,size:this.size,page:1})
		},
		// activated(){
		// 	this.msgList= []
		// 	this.getMsgList({userId :this.userId,size:this.size,page:1})
		// },
		mounted(){
			// 获取浏览器可视区域高度
			this.clientHeight = `${document.documentElement.clientHeight}`
			window.onresize = function temp() {
				this.clientHeight = `${document.documentElement.clientHeight}`
			}
			this.boxHeight = this.clientHeight -50
			setInterval(()=>{ //5分钟更新一次数据
				this.msgList=[]
				this.getMsgList({userId :this.userId,size:this.size,page:1})
			},1000*60*5)
		},
		methods: {
			loadTop(){
				this.msgList= []
				this.loading = true
				Indicator.open('加载中...')
				this.getMsgList({userId :this.userId,size:this.size,page:1})
				this.$refs.loadmore.onTopLoaded()
			},
			handleReachBottom () {
				if(this.total/this.size<this.page){
					this.$toast('没有更多了')
					return
				}
				return new Promise(resolve => {
					setTimeout(() => {
						this.page ++
						this.getMsgList({userId :this.userId,size:this.size,page:this.page})
						resolve();
					}, 1000);
				});
			},
			// 获取消息列表
			async getMsgList(params){
				this.loading = true
				Indicator.open('加载中...')
				let res = await getMsgList(params)
				if(res.code===200){
					Indicator.close()
					this.loading = false
					this.total = res.data.total
					if(this.page===1){
						this.msgList=res.data.list
					}else {
						this.msgList= this.msgList.concat(res.data.list)
					}
				}else {
					Indicator.close()
				}
			},
			// 消息设为已读
			async updateFlag(params){
				let res = await updateFlag(params)
				if(res.code===200){
					console.log('设为已读成功');
				}else {

				}
			},
			openDetail(item){
				this.updateFlag({ids:item.id})
				this.$router.push({name:'消息详情',params:{msg:item},query:{id:item.id}})
			}
		},
	}
</script>


<style lang="less" scoped>
	.msg{
		background:#ffffff;
		.title{
			position: fixed;
			top: 0;
			width: 100%;
			background:rgba(247,247,247,1);
			padding: 48px 40px ;
			z-index: 9;
			font-size:48px;
			font-weight:600;
			color:rgba(72,72,72,1);
			line-height:66px;
			text-align: left;
		}
		.msg-content{
			padding: 100px 0 0;
			text-align: left;
			ul{
				li{
					display: flex;
					padding: 15px 40px;
					img{
						width:92px;
						height:92px;
						background:rgba(71,189,195,1);
						border-radius: 50%;
						overflow: hidden;
						margin-right: 28px;
					}
					.info{
						display: flex;
						justify-content: center;
						flex-direction: column;
						flex: 1;
						border-bottom: 2px solid #E9E9E9;
						.header{
							font-size:22px;
							font-family:PingFangSC;
							font-weight:400;
							color:rgba(153,153,153,1);
							display: flex;
							justify-content: space-between;
							.name{
								font-size:28px;
								font-family:PingFangSC;
								font-weight:400;
								color:rgba(51,51,51,1);
							}
						}
						.content{
							font-size:24px;
							font-family:PingFangSC;
							font-weight:400;
							color:rgba(102,102,102,1);
							position: relative;
							span{
								width: 480px;
								display: inline-block;
								overflow: hidden;
								white-space: nowrap;
								text-overflow: ellipsis;
								margin: 10px 0 15px;
							}
							.num{
								position: absolute;
								bottom: 5px;
								right: 0px;
								width:36px;
								height:36px;
								line-height: 36px;
								text-align: center;
								background:rgba(255,90,96,1);
								font-size:22px;
								font-family:PingFangSC-Regular,PingFangSC;
								font-weight:400;
								color:rgba(255,255,255,1);
								border-radius: 60%;
								overflow: hidden;
							}
						}
					}
				}
			}
		}
		.msg-null{
			display: flex;
			align-items: center;
			justify-content: center;
			img{
				width:262px;
				margin-top: 250px;
			}
		}
	}
</style>
