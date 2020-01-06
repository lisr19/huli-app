<template>
	<div class="nursing">
		<div class="search-box">
			<Icon type="ios-search-outline" class="icon"></Icon>
			<div class="search-input" @click="goSearch">搜索护理项目</div>
		</div>
		<h2>
			<img  src="@/assets/icon/icon1.png">
			常用护理项目
		</h2>
		<div class="banner">
			<swiper class="items" :options="swiperOption" ref="mySwiper">
				<!-- slides -->
				<swiper-slide class="item" v-for="item in imgList" :key="item.index" >
					<img :src="item.picUrl" alt="" @click.stop="openChoice(item)">
					<p>{{item.name}}</p>
				</swiper-slide>
				<div class="no-img" v-if="imgList.length===0">
					数据加载中…
				</div>
			</swiper>
		</div>
		<div class="main">
			<div class="tabs-wrap" :class="{fixed:isFixed===true}">
				<ul class="tabs" ref="navBar">
					<li v-for="(item,index) in tabs" :class="{active:index===currIndex}" @click="tabType(index)">
						{{item.name}}
						<span :class="{line:index===currIndex}"></span>
					</li>
				</ul>
			</div>
			<div class="content">
				<ul class="items" v-if="levelOne.length">
					<li class="item" v-for="(item,index) in levelOne" :key="index" @click="openChoice(item)">
						<img :src="item.picUrl" alt=" ">
						<div class="txt">
							<div class="name">{{item.name}}</div>
							<div class="desc">{{item.content}}</div>
							<div class="price">￥<span>{{item.price}}</span> </div>
						</div>
					</li>
				</ul>
				<!--<ul class="items">-->
					<!--<li class="item" :title="item.name" v-for="(item,index) in levelOne" :key="index" @click="openChoice(item)">{{item.name}}</li>-->
				<!--</ul>-->
				<img v-if="levelOne.length===0&&!loading" src="@/assets/icon/null-type.png" alt="" style="margin-top: 40px">
				<img v-if="loading" src="@/assets/img/loading.png" alt="" style="margin-top: 40px;margin-left: 20px">
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
	</div>
</template>

<script>
	import { Popup,MessageBox } from 'mint-ui';
	import {getNurseList,getNurseChildList,getCommonList,getRecentList} from "@/lib/API/order";
	import {getHealthList} from "@/lib/API/comment";

	export default {
		data() {
			return {
				isFixed:false,
				hasHealth:false, //健康档案ID
				selected:'护理',
				detailServiceIds:'', //选择的子类护理ID
				hasChild:false,
				serviceType:null, //护理项目类别
				selectChild:null,//选择的子类护理
				selectContent:'',
				totalPrice:0,
				selectType:'',
				curModel:[], // 当前选中护理项目
				selectName:'',
				selectImg:'',
				modelList:[],
				popupVisible:false,
				currIndex:0,
				imgList:[],
				tabs:[
					{
						name:'基础护理'
					},
					{
						name:'医疗护理'
					},
					{
						name:'中医护理'
					},
				],
				levelOne:[],
				swiperOption: {
					notNextTick: true,
					slidesPerView: 'auto',
					spaceBetween: 12,
				},
				loading:true
			}
		},
		props : ['crrentVal'],
		watch:{
			crrentVal:{
				handler(newValue) {
					if(newValue==='护理'){
						this.getRecentList({userId:this.userId,size:5})
					}
				},
				deep:true
			},
			popupVisible(oldV,newV){
				if(newV===false){
					this.selItemList = []
					this.modelList.forEach((item)=>{
						if (item.checked ===true) {
							this.$set(item, 'checked', false)
						}
					})
				}
			}
		},
		created(){
			this.userId = localStorage.getItem('userId')
			this.getRecentList({userId:this.userId,size:5})
			this.getNurseList({serviceType:1,size:50})
			this.getHealthList({userId:this.userId}) //健康档案
		},
		activated(){
			this.getHealthList({userId:this.userId}) //健康档案
		},
		mounted(){
			window.addEventListener('scroll', this.handleScroll);
			document.addEventListener('plusready',  ()=> {
				plus.key.addEventListener('backbutton',  ()=> {
					this.popupVisible = false
				})
			})
		},
		destroyed () {
			window.removeEventListener('scroll', this.handleScroll)
		},
		methods: {
			//搜索页
			goSearch(){
				this.$router.push({name:'搜索'})
			},
			handleScroll () {
				let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
				let offsetTop = this.$refs.navBar.offsetTop
				if(scrollTop>offsetTop &&scrollTop>200) {
					this.isFixed = true
				} else {
					this.isFixed = false
				}
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
			//获取最近护理项目列表
			async getRecentList(params){
				let res = await getRecentList(params)
				if(res.code === 200){
					if(res.data.list.length>0){
						console.log('有最近护理项目')
						this.imgList= res.data.list
					}else {
						console.log('无最近护理项目')
						setTimeout(()=>{
							this.getCommonList()
						},300)
					}
				}else if(res.message==='请先登录'||res.code===401) {
					MessageBox.alert('您的账号信息已过期，请重新登录').then(() => {
						localStorage.clear()
						this.$router.push({name:'登录'})
					})
				}
			},
			//获取常用护理项目列表
			async getCommonList(){
				let res = await getNurseList({
					common:1,
					size:5
				})
				if(res.code === 200){
					this.imgList= res.data.list
				}
			},
			//获取护理项目列表
			async getNurseList(params){
				let res = await getNurseList(params)
				if(res.code === 200){
					this.levelOne = res.data.list
					this.loading =false
				}else {
					this.loading =true
				}
			},
			//获取护理项目子服务列表
			async getNurseChildList(params){
				let res = await getNurseChildList(params)
				if(res.code === 200){
					this.modelList = res.data.list
				}
			},
			tabType(index){
				if(this.currIndex===index) return
				this.currIndex=index
				this.serviceType = index+1
				this.getNurseList({serviceType:this.serviceType,size:50})
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
			}
		}
	}
</script>


<style  scoped>
	.choice-box>>>.mint-popup-bottom{
		border-radius:20px 20px 0px 0px;
	}
</style>
<style lang="less" scoped>
	.nursing{
		background-color: #F8F9FB;
		min-height: 100%;
		.search-box{
			position: relative;
			height:120px;
			background:linear-gradient(134deg,rgba(108,205,208,1) 0%,rgba(71,189,195,1) 100%);
			display: flex;
			align-items: center;
			justify-content: center;
			.search-input{
				width:684px;
				height:60px;
				background:rgba(255,255,255,1);
				border-radius:40px;
				border: none;
				line-height: 60px;
				padding-left: 86px;
				color:rgba(215,215,215,1);
				text-align: left;
			}
			.icon{
				position: absolute;
				left: 58px;
				top: 40px;
				color:#CDCDCD;
				font-size: 42px;
			}
		}
		h2{
			margin: 32px 0 16px;
			font-size:32px;
			font-family:PingFangSC-Medium,PingFang SC;
			font-weight:500;
			color:rgba(51,51,51,1);
			line-height:44px;
			text-align: left;
			display: flex;
			align-items: center;
			padding: 0 30px;
			img{
				width: 42px;
				margin-right: 18px;
			}
		}
		.banner{
			/*width:690px;*/
			background:rgba(255,255,255,1);
			border-radius:20px;
			overflow: hidden;
			margin: 0 22px;
			.items{
				height:286px;
				padding: 10px 20px;
				.item{
					width:162px;
					font-size:28px;
					font-family:PingFangSC-Regular;
					font-weight:400;
					color:rgba(51,51,51,1);
					line-height:40px;
					text-align: left;
					img{
						width:162px;
						height:162px;
						margin: 10px 0;
						display: block;
						border-radius: 8px;
					}
					p{
						display: -webkit-box;
						-webkit-line-clamp:2;
						overflow: hidden;
						text-overflow: ellipsis;
						-webkit-box-orient: vertical;
					}
				}
			}
			.no-img{
				font-size: 36px;
				width: 100%;
				display: flex;
				align-items: center;
				justify-content: center;
			}
		}
		.main{
			border-radius:20px;
			margin: 48px 0;
			.fixed{
				top: 0;
				position: fixed;
				width:706px;
				margin: 0;
				padding-top: 25px;
				background:#f8f9fb;
				z-index: 99;
			}
			.tabs-wrap{
				margin: 0 22px;
				.tabs{
					display: flex;
					justify-content: space-around;
					font-size:32px;
					font-family:PingFangSC;
					font-weight:400;
					height:80px;
					align-items: center;
					color:rgba(142,142,147,1);
					background:rgba(246,246,246,1);
					border-radius:20px 20px 0px 0px;
					line-height: 80px;
					li{
						flex: 1;
					}
					.active{
						font-size:36px;
						height:94px;
						background:rgba(255,255,255,1);
						border-radius:20px 20px 0px 0px;
						font-family:PingFangSC-Medium,PingFangSC;
						font-weight:500;
						color:rgba(71,189,195,1);
					}
				}
			}
			.content{
				background:rgba(255,255,255,1);
				padding-top: 18px;
				margin: 0 22px 150px;
				overflow: hidden;
				border-radius:10px;
				.items{
					padding-bottom: 5px;
					.item{
						display: flex;
						height:198px;
						background:rgba(248,252,252,1);
						border-radius:10px;
						margin:20px;
						align-items: center;
						padding: 0 15px;
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
							height:40px;
							font-size:32px;
							font-family:PingFangSC-Regular,PingFang SC;
							font-weight: 400;
							color:rgba(68,68,68,1);
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
							color:rgba(136,136,136,1);
							margin: 6px 0 15px;
							overflow: hidden;
							text-overflow: ellipsis;
							display: -webkit-box;
							-webkit-line-clamp: 2;
							line-clamp: 2;
							-webkit-box-orient: vertical;
						}
						.price{
							font-size:28px;
							font-family:PingFangSC-Regular,PingFang SC;
							font-weight:400;
							color:rgba(243,63,50,1);
							line-height:26px;
							span{
								font-size: 36px;
							}
						}
					}
				}
			}
		}
		.choice-box{
			width: 100%;
			.classify{
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
					color:rgba(68,68,68,1);
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
					color:rgba(136,136,136,1);
					margin: 8px 0 20px;
					/*overflow: hidden;*/
					/*text-overflow: ellipsis;*/
					/*display: -webkit-box;*/
					/*-webkit-line-clamp: 2;*/
					/*line-clamp: 2;*/
					/*-webkit-box-orient: vertical;*/
					/*width: 500px;*/
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
</style>
