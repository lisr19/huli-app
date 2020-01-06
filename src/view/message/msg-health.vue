<template>
	<div class="msg">
		<head-bar title="健康宣教"></head-bar>
		<div class="msg-content" >
			<Scroll :on-reach-bottom="handleReachBottom" :height="boxHeight">
				<mt-loadmore :top-method="loadTop"  ref="loadmore" style="min-height: 580px">
					<ul class="items" v-if="msgList.length">
						<li class="item" v-for="item in msgList" @click="openDetail(item)">
							<p class="title"><span >{{item.title}} </span><img src="@/assets/icon/hlicon2.png" alt=""></p>
							<div class="content">
								<div class="txt" v-text="item.message"></div>
								<p class="time"><span>{{item.addTime}}</span><Icon type="ios-arrow-forward"/><em class="num" v-if="item.flag===0">1</em></p>
							</div>
						</li>
					</ul>
					<div  v-if="msgList.length===0" class="msg-null">
						<img  src="@/assets/icon/null-news.png" alt="">
					</div>
				</mt-loadmore>
			</Scroll>
		</div>
	</div>
</template>

<script>
	import {getMsgHealList,updateFlag} from '@/lib/API/comment'
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
				size:20,
				total:0,
				clientHeight:'',
				boxHeight:'',
			}
		},
		created() {
			this.userId = localStorage.getItem('userId')
			this.getMsgHealList({userId :this.userId,size:this.size,page:1})
		},
		mounted(){
			// 获取浏览器可视区域高度
			this.clientHeight = `${document.documentElement.clientHeight}`
			window.onresize = function temp() {
				this.clientHeight = `${document.documentElement.clientHeight}`
			}
			this.boxHeight = this.clientHeight -50
			setInterval(()=>{ //5分钟更新一次数据
				this.msgList=[]
				this.getMsgHealList({userId :this.userId,size:this.size,page:1})
			},1000*60*5)
		},
		methods: {
			// 消息设为已读
			async updateFlag(params){
				let res = await updateFlag(params)
				if(res.code===200){
					console.log('设为已读成功');
				}else {

				}
			},
			loadTop(){
				this.msgList= []
				Indicator.open('加载中...')
				this.getMsgHealList({userId :this.userId,size:this.size,page:1})
				this.$refs.loadmore.onTopLoaded()
				setTimeout(()=>{
					Indicator.close()
				},1500)
			},
			handleReachBottom () {
				if(this.total/this.size<this.page){
					this.$toast('没有更多了')
					return
				}
				return new Promise(resolve => {
					setTimeout(() => {
						this.page ++
						this.getMsgHealList({userId :this.userId,size:this.size,page:this.page})
						resolve()
					}, 1000)
				})
			},
			// 获取消息列表
			async getMsgHealList(params){
				let res = await getMsgHealList(params)
				if(res.code===200){
					Indicator.close()
					this.total = res.data.total
					if(this.page===1){
						this.msgList=res.data.list
					}else {
						this.msgList= this.msgList.concat(res.data.list)
					}
				}
			},
			openDetail(item){
				this.updateFlag({ids:item.id})
				this.$router.push({name:'健康宣教详情',params:{msg:item},query:{educationId:item.educationId}})
			}
		},
	}
</script>

<style lang="less" scoped>
	.msg{
		.msg-content{
			padding: 90px 0 0;
			text-align: left;
			ul{
				display: flex;
				justify-content: center;
				text-align: left;
				flex-direction: column;
				li{
					height:258px;
					background:rgba(255,255,255,1);
					border-radius:10px;
					width: 94%;
					margin: 40px auto 0;
					.title{
						display: flex;
						justify-content: space-between;
						align-items: center;
						padding: 0 36px 0 16px;
						font-size:32px;
						font-family:PingFangSC-Medium,PingFangSC;
						font-weight:500;
						color:rgba(51,51,51,1);
						height:74px;
						background:rgba(44,225,161,0.1);
						border-radius:10px 10px 0px 0px;
						span{
							flex: 1;
							overflow: hidden;
							text-overflow:ellipsis;
							white-space: nowrap;
						}
						img{
							width:42px;
							height:44px;
						}
					}
					.content{
						padding: 32px 18px;
						overflow: hidden;
						.txt{
							overflow: hidden;
							text-overflow: ellipsis;
							display: -webkit-box;
							-webkit-line-clamp: 2;
							line-clamp: 2;
							-webkit-box-orient: vertical;
							font-size:26px!important;
							font-family:PingFangSC-Regular,PingFangSC;
							font-weight:400;
							color:rgba(102,102,102,1);
							line-height:34px;
						}
						.time{
							margin-top: 24px;
							font-size:24px;
							font-family:PingFangSC-Regular,PingFangSC;
							font-weight:400;
							color:rgba(153,153,153,1);
							line-height:32px;
							display: flex;
							justify-content: space-between;
							align-items: center;
							position: relative;
							.num{
								position: absolute;
								bottom: 0px;
								right: 50px;
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
							.ivu-icon-ios-arrow-forward{
								font-size: 38px;
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
