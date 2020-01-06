<template>
	<div class="search-page">
		<div class="head">
			<Icon  type="ios-arrow-back" color="#fff" size="26" @click="goBack"/>
			<div class="search-box">
				<Icon type="ios-search-outline" class="icon" ></Icon>
				<input v-focus autofocus type="text" v-model="serviceName" placeholder="输入护理项目名称">
			</div>
			<div class="btn" @click="getServiceByName">搜索</div>
		</div>
		<div class="content" >
			<p>
				<span v-if="totalNum!==null">搜索结果：共{{totalNum}}项</span>
				<span v-else>请输入名称搜索</span>
			</p>
			<ul class="items" v-if="serviceList.length">
				<li class="item" v-for="(item,index) in serviceList" :key="index" @click="openChoice(item)">
					<img :src="item.picUrl" alt=" ">
					<div class="txt">
						<div class="name">{{item.name}}</div>
						<div class="desc">{{item.content}}</div>
						<div class="price">￥<span>{{item.price}}</span> </div>
					</div>
				</li>
			</ul>
			<div class="no-list" v-else>
				<img  class="null-img" src="@/assets/icon/search-null.png" alt="">
				<p v-if="totalNum!==null">暂无搜索结果</p>
			</div>
		</div>
		<div class="choice-box" >
			<mt-popup v-model="popupVisible" position="bottom">
				<div class="classify">
					<img :src="selectImg" alt="">
					<div class="txt">
						<p class="name">{{selectName}}</p>
						<div class="desc">{{selectContent}}</div>
						<p class="price">￥{{totalPrice}}/ <span>次</span> </p>
					</div>
				</div>
				<ul class="model-items">
					<li class="item" :title="item.value"  v-for="(item,index) in modelList" @click="choiceItem(item)"   :key="index"  :class="{checked:item.checked}">
						<span class="name">{{item.name}}</span>
						<span class="price">￥{{item.price}}</span>
					</li>
				</ul>
				<div class="btn" @click="confirm">确定</div>
			</mt-popup>
		</div>
	</div>
</template>

<script>
	import {getServiceByName} from '@/lib/API/order'
	import {getHealthList} from "@/lib/API/comment";
	import { Loadmore,Indicator,MessageBox } from 'mint-ui'
	export default {
		name: "search",
		beforeRouteLeave (to, from, next) {
			if (to.name === '下订单') {
				from.meta.keepAlive=true
			}else {
				from.meta.keepAlive=false
			}
			next()
		},
		data() {
			return {
				hasHealth:false, //健康档案ID
				popupVisible:false,
				page:1,
				size:50,
				serviceName:null,
				serviceList:[],//护理项目
				modelList:[],//护理项目
				selectName:null,
				selectImg:null,
				selectContent:null,
				totalPrice:0,
				totalNum:null,
			}
		},
		created() {
			this.userId = localStorage.getItem('userId')
			this.getHealthList({userId:this.userId}) //健康档案
		},
		mounted(){
		},
		methods: {
			goBack(){
				this.$router.back()
			},
			openChoice(selectType){
				if(selectType.flag===0){
					this.$toast('此项服务暂不提供外派服务')
					return
				}
				if(this.hasHealth===false){
					MessageBox.confirm('您尚未完善健康档案，现在去完善吗？').then(action => {
						if(action==='confirm'){
							this.$router.push({name:'健康档案'})
						}
					}).catch(() => {
						console.log('取消');
					})
					return
				}
				this.popupVisible=true
				this.modelList= []
				if(selectType.hasChild!=0){
					console.log('有子类目');
					this.hasChild = true
					this.getNurseChildList({id:selectType.id})
				}
				this.selectName= selectType.name
				this.selectContent= selectType.content
				this.selectImg= selectType.picUrl
				this.serviceId =selectType.id
				this.totalPrice =selectType.price // 二级护理价格（没选择子类目时）
			},
			choiceItem(item) {
				this.serviceId = item.serviceId
				this.selItemList = []
				if (typeof item.checked == 'undefined') {
					this.$set(item, 'checked', true)
				} else {
					item.checked = !item.checked
				}
				for (let i = 0; i < this.modelList.length; i++) {
					if (this.modelList[i].checked) {
						this.selItemList.push(this.modelList[i])
					}
				}
				let totalPrice = 0
				let selectChild =''
				let detailServiceIds =''
				this.selItemList.forEach((item)=>{
					totalPrice+=item.price*1
					selectChild += item.name+','
					detailServiceIds += item.id+','
				})
				this.selectChild = selectChild
				this.detailServiceIds = detailServiceIds.substr(0, detailServiceIds.length - 1)
				this.totalPrice =totalPrice
				// console.log(this.detailServiceIds);
			},
			confirm(){
				this.popupVisible=false
				this.$router.push({name:'下订单',query:{
						totalPrice:this.totalPrice,
						serviceId:this.serviceId,
						selectName:this.selectName,
						detailServiceIds:this.detailServiceIds,
						selectContent:this.selectContent,
						selectImg:this.selectImg,
						from:'选项目'
					},params:{
						// selectImg:this.selectImg,
						// selectContent:this.selectContent,
						// selectChild:this.selectChild,
					}
				})
			},
			// 获取消息列表
			async getServiceByName(){
				if(!this.serviceName) {
					return this.$toast('请输入搜索内容')
				}
				Indicator.open('加载中...')
				let res = await getServiceByName({name:this.serviceName,size:this.size})
				if(res.code===200){
					this.serviceList = res.data.list
					this.totalNum =res.data.total
				}else {
				}
				setTimeout(()=>{
					Indicator.close()
				},500)
			},
			//获取健康档案信息
			async getHealthList(params){
				let res = await getHealthList(params)
				if(res.code === 200){
					// console.log('获取个人信息成功');
					if(res.data.list.length>0){
						// console.log('有个人健康档案');
						this.hasHealth = true
						// this.healthId = this.res.data.list[0].id
					}else {
						this.hasHealth = false
					}
				}else {
					console.log('获取个人信息失败');
				}
			},
		},
	}
</script>

<style  scoped>
	.choice-box>>>.mint-popup-bottom{
		border-radius:20px 20px 0px 0px;
		width: 100%;
	}
	input::-webkit-input-placeholder {
		color:#D7D7D7;
	}
</style>
<style lang="less" scoped>
	.search-page{
		min-height: 100%;
		background-color: #F8F9FB;
		.head{
			height:120px;
			background:linear-gradient(134deg,rgba(108,205,208,1) 0%,rgba(71,189,195,1) 100%);
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: 0 30px;
			position: fixed;
			top: 0;
			width: 100%;
			input{
				width:446px;
				height:60px;
				background:rgba(255,255,255,1);
				border-radius:40px;
				border: none;
				padding-left: 86px;
				font-size:28px;
				font-family:PingFangSC-Regular,PingFang SC;
				font-weight:400;
				color:rgba(215,215,215,1);
			}
			.search-box{
				position: relative;
				.icon{
					position: absolute;
					left: 22px;
					top: 10px;
					color:#CDCDCD;
					font-size: 40px;
				}
			}
			.btn{
				width:120px;
				height:60px;
				background:rgba(255,255,255,1);
				border-radius:30px;
				font-size:28px;
				font-family:PingFangSC-Regular,PingFang SC;
				font-weight:400;
				color:rgba(38,60,82,1);
				line-height:60px;
			}
		}
		.content{
			text-align: left;
			padding: 40px 30px;
			margin-top: 100px;
			.items{
				border-radius:10px;
				.item{
					display: flex;
					width:690px;
					background:rgba(255,255,255,1);
					border-radius:10px;
					margin-top: 20px;
					padding:15px 20px;
					align-items: center;
					img{
						width:152px;
						height:152px;
						margin-right: 20px;
						border-radius: 8px;
						background-color: #555555;
					}
					.txt{
						text-align: left;
						align-items: center;
						flex: 1;
						overflow: hidden;
					}
					.name{
						font-size:32px;
						font-family:PingFangSC-Regular,PingFang SC;
						font-weight:400;
						color:rgba(68,68,68,1);
						line-height:44px;
						width: 500px;
						overflow: hidden;
						white-space: nowrap;
						text-overflow: ellipsis;
					}
					.desc{
						font-size:24px;
						font-family:PingFangSC-Regular,PingFang SC;
						font-weight:400;
						color:rgba(136,136,136,1);
						line-height:34px;
						margin: 6px 0 15px;
						overflow: hidden;
						text-overflow: ellipsis;
						display: -webkit-box;
						-webkit-line-clamp: 2;
						line-clamp: 2;
						-webkit-box-orient: vertical;
					}
					.price{
						font-size:24px;
						font-family:PingFangSC-Regular,PingFang SC;
						font-weight:400;
						color:rgba(243,63,50,1);
						line-height:28px;
						span{
							font-size: 35px;
						}
					}
				}
			}
			.no-list{
				text-align: center;
				img{
					width:316px;
					margin: 284px 0 34px;
				}
				p{
					font-size:32px;
					font-family:PingFangSC-Regular,PingFang SC;
					font-weight:400;
					color:rgba(196,196,196,1);
					line-height:40px;
				}
			}
		}
		.choice-box{
			width: 100%;
			.classify{
				width: 100%;
				display: flex;
				padding:50px 30px 40px;
				img{
					width:162px;
					height:162px;
					margin-right: 20px;
					border-radius: 8px;
				}
				.txt{
					text-align: left;
					align-items: center;
					flex: 1;
					overflow: hidden;
				}
				.name{
					height:40px;
					font-size:32px;
					font-family:PingFangSC;
					font-weight:500;
					color:rgba(51,51,51,1);
					line-height:40px;
					width: 500px;
					overflow: hidden;
					white-space: nowrap;
					text-overflow: ellipsis;
				}
				.desc{
					font-size:24px;
					font-family:PingFangSC-Regular;
					font-weight:400;
					color:rgba(102,102,102,1);
					margin: 8px 0 20px;
				}
				.price{
					height:56px;
					font-size:40px;
					font-family:PingFangSC-Medium;
					font-weight:500;
					color:rgba(71,189,195,1);
					line-height:56px;
					span{
						font-size: 24px;
					}
				}
			}
			.model-items{
				display: flex;
				padding: 0 30px 100px;
				flex-wrap: wrap;
				max-height:560px;
				overflow: auto;
				li{
					height:80px;
					width:210px;
					background:rgba(246,247,249,1);
					border-radius:10px;
					border:2px solid rgba(236,236,236,1);
					display: flex;
					align-items: center;
					justify-content: center;
					margin: 0 20px 20px 0;
					font-size:28px;
					font-family:PingFangSC-Medium;
					font-weight:500;
					color:rgba(102,102,102,1);
					/*display: -webkit-box;*/
					/*-webkit-line-clamp:2;*/
					/*overflow: hidden;*/
					/*text-overflow: ellipsis;*/
					/*-webkit-box-orient: vertical;*/
					.name{
						width:114px;
						overflow: hidden;
						white-space: nowrap;
						text-overflow: ellipsis;
					}
					.price{
						color:rgba(153,153,153,1);
					}
				}
				.checked{
					border:solid 4px #47BDC3;
				}
			}
			.btn{
				height:80px;
				line-height: 80px;
				background:rgba(71,189,195,1);
				font-size:28px;
				font-family:PingFangSC-Medium;
				font-weight:500;
				color:rgba(255,255,255,1);
				position: absolute;
				bottom: 0;
				width: 100%;
			}
		}
	}
</style>
