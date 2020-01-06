<template>
	<div class="main">
		<div class="banner">
			<img class="icon" src="@/assets/img/banner.png" alt="">
			<p>
		       <span @click="openMy">
		          <img class="head-img" v-if="avatar" :src="avatar" alt=" ">
			       <img class="head-img" v-else  src="@/assets/img/headimg.jpg" alt="">
		          <strong class="name">{{username}}</strong>
		       </span>
				<!--<span>-->
		          <!--&lt;!&ndash;<img class="icon" src="@/assets/icon/set.png" alt="" @click="setting">&ndash;&gt;-->
		          <!--<img class="icon" src="@/assets/icon/service.png" alt="">-->
		        <!--</span>-->
			</p>
		</div>
		<div class="card">
			<ul class="items">
				<li class="item" v-for="item in typeList" @click="openCategory(item.name)">
					<div style="height: 40px;display: flex;align-items: center;justify-content: center">
						<img :src="item.iconUrl" alt="">
					</div>
					<span class="name">{{item.name}}</span>
				</li>
			</ul>
		</div>
		<div class="about-hotel">
			<div class="item" v-for="item in tipList" @click="openDetail(item)">
				{{item.title}}
				<!--<Icon type="ios-arrow-forward" />-->
			</div>
			<div class="item" @click="clickUpdatad">
		        <span>关于用户端</span>
				<span class="edition">{{editionTxt}} {{versionCode}}</span>
			</div>
		</div>
		<button class="btn" @click="quitUser">退出账号</button>
		<div class="updated-version" v-if="updatedVersionLock">
            <div class="updated">
                <img src="@/assets/img/newEdition.png" alt="">
	            <span class="now-version">新版本：{{versionCode}} / 当前版本：{{edition}}</span>
                <div class="btn" @click="download">立即更新</div>
                <div class="btn" @click="updatedVersionLock=false">以后再说</div>
            </div>
        </div>
		<van-popup v-model="showPassword">
			<div class="change-box">
				<input v-model="newPassword" placeholder='新密码' type="password" oninput="if(value.length>16)value=value.slice(0,16)">
				<input v-model="repetPassword" placeholder='重复密码' type="password" oninput="if(value.length>16)value=value.slice(0,16)">
				<div class="btn2" @click="cancle" style="background-color: #969696">取消</div>
				<div class="btn2" @click="updatePass">修改密码</div>
			</div>
		</van-popup>
	</div>
</template>

<script>
	import { MessageBox,Indicator  } from 'mint-ui';
	import {getUserDate,userUptate} from "@/lib/API/login-enroll";
	import Config from '@/Config'
	import {getEdition} from "@/lib/API/edition";
	export default {
		computed:{
			edition(){
				return Config.edition
			}
		},
		props : ['crrentVal'],
		watch:{
			crrentVal:{
				handler(newValue) {
					if(newValue==='我的'){
						this.getUserDate({userId:this.userId})
						this.getEdition()
					}
				},
				deep:true
			}
		},
		data() {
			return {
				showPassword:false, //修改密码弹窗
				newPassword:null,
				repetPassword:null,
				versionCode:'', //版本号
				avatar: require('@/assets/img/headimg.jpg'),//头像
				username: null,
				isApply: false,
				updatedVersionLock:false,
				updateVersion:false, //是否更新版本
				downloadUrl:'', //下载地址
				typeList: [
					{
						name: '健康档案',
						iconUrl: require('@/assets/icon/coupon.png'),
					},
					{
						name: '评价',
						iconUrl: require('@/assets/icon/evaluate.png'),
					},
					{
						name: '收藏',
						iconUrl: require('@/assets/icon/collect.png'),

					},
				],
				editionTxt:'已是最新版本',
				tipList: [
					{
						title: '修改密码'
					},
					{
						title: '意见反馈'
					},
				]
			}
		},
		created() {
			this.userId = localStorage.getItem('userId')
			this.getUserDate({userId:this.userId})
			this.getEdition()
		},
		methods: {
			//获取个人信息
			async getUserDate(params) {
				let res = await getUserDate(params)
				if (res.code === 200) {
					this.myData = res.data
					this.username = this.myData.username
					if(this.myData.avatar){
						this.avatar = this.myData.avatar
					}
				}else if(res.message==='请先登录') {
					console.log('请先登录');
					// localStorage.clear()
					// this.$router.push({name:'登录'})
				}
			},
			openMy() {
				this.$router.push({name: '个人信息',params:{callback:this.callback}})
			},
			callback() {
				this.getUserDate({userId: this.userId})
			},
			openCategory(params) {
				if (params === '健康档案') {
					this.$router.push({name:'健康档案'})
				} else if (params === '评价') {
					this.$router.push({path: '/evaluate'})
				} else {
					this.$toast('功能尚未开通，敬请期待')
				}
			},
			openDetail(item){
				console.log(item.title);
				if(item.title==='修改密码'){
					this.newPassword = null
					this.repetPassword = null
					this.showPassword = true
				}else {
					this.$toast('功能尚未开通，敬请期待')
				}
			},
			cancle(){
				this.showPassword = false
			},
			async updatePass(){
				if(this.newPassword===null||this.newPassword===''){
					this.$toast('请输入新密码')
					return
				}else if(this.repetPassword===null||this.repetPassword===''){
					this.$toast('请重复输入新密码')
					return
				}else if(this.newPassword!==this.repetPassword){
					this.$toast('两次密码不一致')
					return
				} else if(!(/^(\w){6,16}$/.test(this.newPassword))){
					this.$toast('密码只能为字母、数字、或下划线组成的6-20位数')
					return
				}
				Indicator.open('修改密码中')
				let res = await userUptate({
					id:this.userId,
					password:this.newPassword
				})
				if(res.code === 200){
					Indicator.close()
					this.showPassword = false
					this.$toast('修改密码成功')
				}else {
					Indicator.close()
					this.$toast('修改密码失败')
				}
			},
			quitUser(){
				MessageBox.confirm('您确定退出账户吗?').then(action => {
					if(action==='confirm'){
						localStorage.clear()
						// this.socketApi.closeWebSocket()
						this.$toast('退出成功')
						this.$router.push({name:'登录'})
					}
				}).catch(() => {
					console.log('取消');
				})
			},
			// 点击关于用户端
			clickUpdatad(){
				if(this.editionTxt == '发现新版本'){
					this.updatedVersionLock = true
				}else{
					this.$toast('已是最新版本了')
				}
			},
			// 获取最新版本
			async getEdition(){
				let res = await getEdition({appType : 1})
				if(res.code == 200){
					let data = res.data
					this.downloadUrl = res.data.downloadUrl
					let newEdition = data.majorVersionNumber+'.'+data.minorVersionNumber+'.'+data.revisionNumber
					this.versionCode = newEdition
					this.compareEdition(newEdition,this.edition)
					if(this.updateVersion === true){
						this.editionTxt = '发现新版本'
					}
				}
			},
			//比较版本号
			compareEdition(ver1,ver2){
				let version1pre = parseFloat(ver1);
				let version2pre = parseFloat(ver2);
				let version1next =  ver1.replace(version1pre + ".","");
				let version2next =  ver2.replace(version2pre + ".","");
				if(version1pre > version2pre){
					this.updateVersion = true
					console.log('更新1');
				}else if(version1pre < version2pre){
					console.log('不更新1');
					this.updateVersion = false
				}else{
					if(version1next > version2next){
						console.log('更新22');
						this.updateVersion = true
					}else{
						console.log('不更新22');
						this.updateVersion = false
					}
				}
			},
			// 点击下载
			download(){
				var wgtWaiting = plus.nativeUI.showWaiting("开始下载");
				var url = this.downloadUrl; // 下载文件地址
				var dtask = plus.downloader.createDownload(url, {}, (d, status)=> {
					if(status == 200) { // 下载成功
						wgtWaiting.setTitle("开始安装");
						var path = d.filename;
						plus.runtime.install(path);
						setTimeout(()=>{
							plus.nativeUI.closeWaiting();
							this.updatedVersionLock = false
						},500)
					} else { //下载失败
						alert("Download failed: " + status);
					}
				});
				dtask.addEventListener("statechanged", (download, status)=> {
					switch(download.state) {
						case 2:
						wgtWaiting.setTitle("已连接到服务器");
						break;
						case 3:
						var percent = download.downloadedSize / download.totalSize * 100;
						wgtWaiting.setTitle("下载中" + parseInt(percent) + "%...");
						break;
						case 4:
						wgtWaiting.setTitle("下载完成");
						break;
					}
				});
				dtask.start();
			}
		}
	}
</script>

<style scoped>
	.main>>>.van-popup--center{
		border-radius: 10px;
		overflow: hidden;
	}
</style>
<style lang="less" scoped>
	.main {
		background-color: #f8f9fb;
		height: 100%;
		position: relative;
		.banner {
			height: 340px;
			position: relative;
			overflow: hidden;
			background:linear-gradient(132deg,rgba(48,206,211,1) 0%,rgba(71,189,195,1) 100%);
			> img {
				display: block;
				position: absolute;
				width: 100%;
				height: 100%;
				z-index: 1;
			}
			p {
				display: flex;
				align-items: center;
				justify-content: space-between;
				padding: 50px 40px;
				z-index: 2;
				span {
					display: flex;
					align-items: center;
				}
				.head-img {
					border-radius: 50%;
					margin-right: 24px;
					width: 108px;
					height: 108px;
					z-index: 2;
					background-color: #f1f1f1;
					overflow: hidden;
				}
				.name {
					height: 44px;
					font-size: 32px;
					font-family: PingFangSC-Medium;
					font-weight: 500;
					color: rgba(255, 255, 255, 1);
					line-height: 44px;
					text-shadow: 0px 4px 8px rgba(0, 0, 0, 0.27);
					z-index: 2;
				}
				.icon {
					display: block;
					height: 34px;
					width: 36px;
					margin-left: 28px;
					z-index: 2;
				}
			}
		}
		.card {
			/*width: 670px;*/
			width: 90%;
			height: 218px;
			background: rgba(255, 255, 255, 1);
			box-shadow: 0px 10px 16px 0px rgba(0, 0, 0, 0.04);
			border-radius: 20px;
			margin: 0 auto;
			position: absolute;
			left: 5%;
			top: 256px;
			z-index: 2;
			ul {
				display: flex;
				align-items: center;
				justify-content: space-between;
				padding: 0 32px;
				height: 100%;
				li {
					display: flex;
					align-items: center;
					justify-content: center;
					flex-direction: column;
					img {
						max-width: 60px;
					}
					.name {
						height: 36px;
						font-size: 26px;
						font-family: PingFangSC-Regular;
						font-weight: 400;
						color: rgba(51, 51, 51, 1);
						line-height: 36px;
						margin-top: 20px;
					}
				}
			}
		}
		.about-hotel {
			/*width: 670px;*/
			width: 90%;
			padding: 40px 0;
			background: rgba(255, 255, 255, 1);
			box-shadow: 0px 10px 16px 0px rgba(0, 0, 0, 0.04);
			border-radius: 20px;
			margin: 180px auto 0;
			display: flex;
			flex-direction: column;
			justify-content: center;
			.item {
				height: 78px;
				line-height: 78px;
				font-size: 26px;
				font-weight: 400;
				color: rgba(51, 51, 51, 1);
				text-align: left;
				padding: 0 32px;
				display: flex;
				justify-content: space-between;
				align-items: center;
				.edition {
					height: 36px;
					font-size: 20px;
					font-family: PingFangSC-Regular;
					font-weight: 400;
					color: rgba(102, 102, 102, 1);
					line-height: 36px;
					display: flex;
					align-items: center;
				}
			}
		}
		.btn{
			/*width:670px;*/
			width: 90%;
			height:90px;
			line-height: 90px;
			margin-top: 50px;
			background:rgba(255,255,255,1);
			border-radius:20px;
			border: none;
			font-size:26px;
			font-family:PingFangSC-Regular;
			font-weight:400;
			color:#47BDC3;
		}
		.layout {
			background: rgba(0, 0, 0, 0.26);
			width: 100%;
			height: 100%;
			position: absolute;
			top: 0;
			bottom: 0;
			left: 0;
			right: 0;
			z-index: 9;
			display: flex;
			justify-content: center;
			align-items: center;
			.content {
				width: 558px;
				height: 714px;
				background: rgba(255, 255, 255, 1);
				border-radius: 30px;
				overflow: hidden;
				text-align: center;
				.bg {
					width: 558px;
					height: 322px;
					img {
						width: 100%;
					}
				}
				h1 {
					height: 44px;
					font-size: 32px;
					font-family: PingFangSC-Semibold;
					font-weight: 600;
					color: rgba(72, 72, 72, 1);
					line-height: 44px;
					padding-left: 52px;
					margin: 18px 0 34px;
					text-align: left;
				}
				ul {
					padding-left: 52px;
					text-align: left;
					li {
						height: 36px;
						font-size: 26px;
						font-family: PingFangSC-Regular;
						font-weight: 400;
						color: rgba(102, 102, 102, 1);
						line-height: 36px;
						margin-bottom: 16px;
						position: relative;
						.spot {
							width: 10px;
							height: 10px;
							background: rgba(0, 194, 254, 1);
							position: absolute;
							left: -24px;
							top: 14px;
							border-radius: 50%;
						}
					}
				}
				.apply-now {
					width: 458px;
					height: 76px;
					background: linear-gradient(180deg, rgba(0, 199, 254, 1) 0%, rgba(98, 140, 253, 1) 100%);
					border-radius: 42px;
					font-size: 32px;
					font-family: PingFangSC-Regular;
					font-weight: 400;
					color: rgba(255, 255, 255, 1);
					line-height: 44px;
					border: none;
					margin: 34px auto 0;
				}
			}
		}
		.updated-version{
			position: fixed;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			background-color: rgba(51,51,51,0.4);
			z-index: 100;
			.updated{
				width:670px;
				height:656px;
				background:rgba(255,255,255,1);
				border-radius:16px;
				position: absolute;
				top: 270px;
				left: 50%;
				margin-left: -335px;
				overflow: hidden;
				.now-version{
					position: absolute;
					right: 15px;
					bottom: 90px;
					z-index: 99;
					color: #c7c7c7;
					font-size: 16px;
				}
				img{
					width: 100%;
					height: auto;
				}
				.btn{
					width: 335px;
					height: 88px;
					border: 1px solid #DFDFDF;
					font-size:32px;
					font-family:PingFangSC;
					font-weight:400;
					color:rgba(153,153,153,1);
					line-height:88px;
					position: absolute;
					bottom: 0;
					right: 0;
					border-radius: 0;
				}
				>.btn:nth-of-type(1){
					right: 50%;
					font-weight:600;
					color:rgba(71,189,195,1);
				}
			}
		}
		.change-box{
			width: 650px;
			height: 516px;
			padding: 20px 0 40px;
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			align-items: center;
			input{
				width: 80%;
				height: 58px;
				outline: none;
				display: block;
				border: 0;
				border-bottom: 2px solid #C7C7C7;
				background: #fff;
				font-size: 24px;
				font-family: PingFangSC-Regular;
				font-weight: 400;
				line-height: 58px;
				margin-top: 26px;
			}
			.btn2{
				width: 80%;
				height:72px;
				line-height: 72px;
				margin-top: 50px;
				background:#47BDC3;
				border-radius:10px;
				border: none;
				font-size:26px;
				font-family:PingFangSC-Regular;
				font-weight:400;
				color:#ffffff;
			}
		}
	}
</style>
