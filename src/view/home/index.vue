<template>
	<div class="page">
		<mt-tabbar v-model="selected">
			<mt-tab-item :class="{'huli':selected=== '护理'}" id="护理">
				<img slot="icon" src="@/assets/icon/hlicon2.png"  v-if="selected=== '护理'">
				<img slot="icon" style="width: 105%" src="@/assets/icon/hlicon1.png" v-else>
				<template v-if="selected!== '护理'">护理</template>
			</mt-tab-item>
			<mt-tab-item id="订单">
				<img slot="icon" src="@/assets/icon/order2.png"  v-if="selected=== '订单'">
				<img slot="icon" src="@/assets/icon/order1.png" v-else>
				订单
			</mt-tab-item>
			<mt-tab-item id="消息" class="msg">
				<img slot="icon" src="@/assets/icon/news2.png"  v-if="selected=== '消息'">
				<img slot="icon" src="@/assets/icon/news1.png" v-else>
				<em class="num" v-if="msgNum>0&&msgNum<100">{{msgNum}}</em>
				<em class="num" v-else-if="msgNum>99" style="width:auto;padding:0 2px;border-radius:30px">99+</em>
				消息
			</mt-tab-item>
			<mt-tab-item id="我的">
				<img slot="icon" src="@/assets/icon/my2.png"  v-if="selected=== '我的'">
				<img slot="icon" src="@/assets/icon/my1.png" v-else>
				我的
			</mt-tab-item>
		</mt-tabbar>
		<mt-tab-container v-model="selected">
			<mt-tab-container-item id="护理">
				<nursing :crrentVal="crrentVal"></nursing>
			</mt-tab-container-item>
			<mt-tab-container-item id="订单">
				<order :crrentVal="crrentVal"></order>
			</mt-tab-container-item>
			<mt-tab-container-item id="消息">
				<msg-index :msgN="msgN" :msgE="msgE"></msg-index>
			</mt-tab-container-item>
			<mt-tab-container-item id="我的">
				<my-index :crrentVal="crrentVal"></my-index>
			</mt-tab-container-item>
		</mt-tab-container>
		<div class="updated-version" v-if="updatedVersionLock">
            <div class="updated">
                <img src="@/assets/img/newEdition.png" alt="">
                <!--<div class="btn" @click="download">立即更新</div>-->
                <!--<div class="btn" @click="updatedVersionLock=false">以后再说</div>-->
	            <div class="btn2" @click="download">{{downTxt}}</div>
	            <span class="now-version">新版本：{{versionCode}} / 当前版本：{{edition}}</span>
            </div>
        </div>
	</div>
</template>

<script>
	import { Checklist,Popup,Tabbar,TabItem,Indicator } from 'mint-ui';
	import {getHealthList,checkNew} from "@/lib/API/comment";
	import {getEdition} from "@/lib/API/edition";
	import myIndex from '@/view/my/index'
	import order from '@/view/order/order'
	import msgIndex from '@/view/message/msg-index'
	import nursing from '@/view/home/nursing'
	import Config from '@/Config'
	export default {
		name: "App",
		computed:{
			edition(){
				return Config.edition
			}
		},
		watch: {
			selected(val) {
				this.crrentVal = val
				this.checkNew({userId:this.userId})
			}
		},
		components: {
			nursing,
			myIndex,
			order,
			msgIndex
		},
		data() {
			return {
				msgN:null,
				msgE:null,
				msgNum:null,
				crrentVal:null,
				selected:'护理',
				updatedVersionLock:false,
				downloadUrl:'', //下载地址
				versionCode:'', //版本号
				updateVersion:false, //是否更新版本
				userId:null,
				downTxt:'正在下载最新版本，请勿退出'
			}
		},
		beforeRouteEnter(to, from, next) {
			next(vm => {
				if (from.name === '登录') {
					to.meta.keepAlive=false
					vm.$router.go(0)
				}
				if(from.name === '消息通知'||from.name === '健康宣教消息'){
					vm.checkNew({userId:vm.userId})
				}
			})
		},
		created(){
			this.userId = localStorage.getItem('userId')
			if(!this.userId){
				this.$router.push({name:'登录'})
			}
			this.getHealthList()
			this.getEdition()
			this.checkNew({userId:this.userId})
		},
		methods: {
			//获取健康档案信息
			async getHealthList(params){
				let res = await getHealthList(params)
				if(res.code === 200){
					console.log('获取个人信息成功')
					if(res.data.list.length>0){
						console.log('有个人健康档案')
					}else {
						console.log('无个人健康档案')
						MessageBox.confirm('您尚未完善健康档案，现在去完善吗？').then(action => {
							if(action==='confirm'){
								this.$router.push({name:'健康档案'})
							}
						}).catch(() => {
							console.log('取消');
						})
					}
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
					// console.log(newEdition,this.edition)
					// console.log(this.downloadUrl)
					this.compareEdition(newEdition,this.edition)
				}else {
					console.log('获取新版本失败');
				}
			},
			// 点击下载
			download(){
				// Indicator.open('正在下载最新版本...')
				let wgtWaiting = plus.nativeUI.showWaiting("开始下载");
				let url = this.downloadUrl; // 下载文件地址
				let dtask = plus.downloader.createDownload(url, {}, (d, status) =>{
					if(status == 200) { // 下载成功
						wgtWaiting.setTitle("开始安装");
						let path = d.filename;
						plus.runtime.install(path);
						setTimeout(()=>{
							plus.nativeUI.closeWaiting();
							// this.updatedVersionLock = false
						},500)
					} else { //下载失败
						alert("Download failed: " + status);
						Indicator.close()
						this.downTxt = '下载失败，请重新下载（点击重新下载）'
					}
				});
				dtask.addEventListener("statechanged", (download, status) =>{
					switch(download.state) {
						case 2:
						wgtWaiting.setTitle("已连接到服务器");
						break;
						case 3:
						let percent = download.downloadedSize / download.totalSize * 100
							wgtWaiting.setTitle("下载中" + parseInt(percent) + "%...")
						break;
						case 4:
						wgtWaiting.setTitle("下载完成");
						this.downTxt = '下载完成，请完成安装（点击重新下载）'
						break;
					}
				});
				dtask.start();
			},
			//比较版本号
			compareEdition(ver1,ver2){
				let version1pre = parseFloat(ver1);
				let version2pre = parseFloat(ver2);
				let version1next =  ver1.replace(version1pre + ".","");
				let version2next =  ver2.replace(version2pre + ".","");
				if(version1pre > version2pre){
					this.updatedVersionLock = true
					this.updateVersion = true
					console.log('更新1');
					setTimeout(()=>{
						this.download()
					},1500)
				}else if(version1pre < version2pre){
					console.log('不更新1');
					this.updateVersion = false
					this.updatedVersionLock = false
				}else{
					if(version1next > version2next){
						console.log('更新22');
						this.updatedVersionLock = true
						this.updateVersion = true
						setTimeout(()=>{
							this.download()
						},1500)
					}else{
						console.log('不更新22');
						this.updateVersion = false
						this.updatedVersionLock = false
					}
				}
			},
			// 查询是否存在新消息
			async checkNew(params){
				let res = await checkNew(params)
				if(res.code===200){
					this.msgN = res.data.message?res.data.message:0
					this.msgE = res.data.education?res.data.education:0
					this.msgNum =this.msgN + this.msgE
				}else {
				}
			},
		}
	}
</script>


<style scoped>
	.page>>>.mint-tab-item{
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		padding: 6px 0;
	}
	.page>>> .huli .mint-tab-item-icon{
		height: 100%;
		width: 70px;
		margin: 5px auto;
	}
	.page>>> .mint-tab-item-icon{
		width: 42px;
		height: auto;
	}
</style>
<style lang="less" scoped>
	.page{
		min-height: 100%;
	}
	.updated-version{
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(51,51,51,0.4);
        z-index: 99;
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
            >img{
                width: 100%;
                height: auto;
            }
            >.btn{
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
            }
            >.btn:nth-of-type(1){
                right: 50%;
                font-weight:600;
                color:rgba(71,189,195,1);
            }
	        .btn2{
		        position: absolute;
		        width: 100%;
		        bottom: 25px;
	        }
        }
    }
	.msg{
		position: relative;
		.num{
			position: absolute;
			top: 2px;
			right: 40px;
			width:30px;
			height:30px;
			line-height: 30px;
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

</style>

<style scoped>
	.page >>>.mint-tab-item{
		font-size:20px;
		font-family:PingFangSC;
		font-weight:500;
		color:rgba(142,142,147,1);
		line-height:28px;
	}
	.page >>>.mint-popup-bottom{
		width: 100%;
	}
	.page>>>a:hover{
		text-decoration: none;
	}
	.page>>>.mint-tabbar > .mint-tab-item.is-selected{
		background:rgba(250,250,250,0.9);
		color: #47BDC3;
	}
	.page>>>.mint-tabbar{
		position: fixed;
		bottom: 0;
		z-index: 99;
	}
</style>

