<template>
	<div class="main">
		<head-bar title="编辑个人资料"></head-bar>
		<div class="content">
			<ul class="items">
				<li class="item h-img">更换头像
					<div class="head-box">
						<Upload
								ref="upload"
								:show-upload-list="false"
								:on-success="handleSuccess"
								:format="['jpg','jpeg','png']"
								:max-size="20480"
								:on-format-error="handleFormatError"
								:on-exceeded-size="handleMaxSize"
								type="drag"
								name="imgFile"
								:headers="myHeader"
								:action="imgBaseUrl"
								style="display: inline-block;">
							<img class="img-head" v-if="avatar" :src="avatar" alt=" ">
							<img class="img-head" v-else  src="@/assets/img/headimg.jpg" alt="">
						</Upload>
						<Icon type="ios-arrow-forward"/>
					</div>
				</li>
				<li class="item" @click="writeInfor('姓名',name)">姓名
					<span>{{name ? name:'添加'}}<Icon type="ios-arrow-forward"/></span>

				</li>
				<li class="item" @click="showSex">性别
					<span v-if="gender">{{gender}}<Icon type="ios-arrow-forward"/></span>
				</li>
			</ul>
			<ul class="items card">
				<li class="item" @click="writeInfor('电话',username)">联系电话
					<span>{{username ? username:'添加'}}<Icon type="ios-arrow-forward"/></span>
				</li>
				<!--<li class="item" @click = "showPopFn">出生日期-->
					<!--<span v-if="birthYear">{{birthYear}}年{{birthMonth}}月{{birthDay}}日</span>-->
					<!--<span v-else>请选择出生日期<Icon type="ios-arrow-forward"/></span>-->
				<!--</li>-->
				<!--<li class="item" @click="writeInfor('住址',emergencyContact)">住址-->
					<!--<span>{{emergencyContact ? emergencyContact:'添加'}}<Icon type="ios-arrow-forward"/></span>-->
				<!--</li>-->
				<li class="item" @click="writeInfor('电子邮件',email)">邮件
					<span>{{email ? email:'添加'}}<Icon type="ios-arrow-forward"/></span>
				</li>
			</ul>
			<ul class="items card">
				<li class="item" @click="writeInfor('身份证',idNumber)">身份证号
					<span>{{idNumber ? idNumber:'提供'}}<Icon type="ios-arrow-forward"/></span>
				</li>
			</ul>
			<div class="btn" @click="save">保存</div>
		</div>
		<!--选择性别弹窗-->
		<van-popup v-model="showSexBox">
			<div class="box-wrap" >
				<p>性别</p>
				<RadioGroup class="radio-class" v-model="gender" vertical @on-change="showSexBox =false">
					<Radio label="男"></Radio>
					<Radio label="女"></Radio>
				</RadioGroup>
			</div>
		</van-popup>
		<van-popup v-model="show" position="bottom" :style="{ height: '40%' }">
			<van-datetime-picker
					v-model="currentDate"
					type="date"
					:min-date="minDate"
					:max-date="maxDate"
					:formatter="formatter"
					@confirm="confirmFn()"
					@cancel="cancelFn()"
			/>
		</van-popup>
	</div>
</template>

<script>
	import headBar from '@/components/header/head-bar'
	import write from '@/components/write/write'
	import {userUptate,getUserDate} from "@/lib/API/login-enroll";
	import Config from '@/Config'
	import {Indicator } from 'mint-ui';

	export default {
		components:{
			headBar,
			write,
		},
		computed:{
			imgBaseUrl(){
				return Config.imgBaseUrl
			}
		},
		data() {
			return {
				minDate: new Date(1900,0,1),
				maxDate: new Date(),
				currentDate: new Date(1950,0,1),
				show:false,
				myHeader: { authorization: localStorage.getItem('token') },
				reg:null,
				myData:{},//我的个人信息
				imgUrl:{},
				avatar:'',
				username:null, //用户名
				name:null, //姓名
				birthYear:null,
				birthMonth:null,
				birthDay:null,
				phone:null, //电话
				email:null,//邮件
				idNumber:null,//身份证
				isEdit:false,
				showSexBox:false,//性别选择弹窗
				emeContact:null,
				imgName: '',
				visible: false,
				uploadList: [],
				gender:1, //性别Value
			}
		},
		watch:{

		},
		created() {
			this.userId = localStorage.getItem('userId')
			this.getUserDate({userId:this.userId})
		},
		mounted () {
			this.uploadList = this.$refs.upload.fileList;
		},
		methods: {
			//性别选择弹窗
			showSex(){
				this.showSexBox = true
			},
			showPopFn() {
				this.show = true;
				this.currentDate = this.birthYear?new Date(this.birthYear+'-'+this.birthMonth+'-'+this.birthDay):new Date(1950,0,1)
			},
			confirmFn() { // 确定按钮
				setTimeout(()=>{
					console.log(this.formatDate(this.currentDate))
					this.show = false
				},100)
			},
			cancelFn(){
				this.show = false;
			},
			//格式化时间
			formatter(type, value) {
				if (type === 'year') {
					return `${value}年`;
				} else if (type === 'month') {
					return `${value}月`
				}else if (type === 'day') {
					return `${value}日`
				}else if (type === 'hour') {
					return `${value}时`
				}else if (type === 'minute') {
					return `${value}分`
				}
				return value;
			},
			// 格式化获取的时间
			formatDate(date) {
				const y = date.getFullYear()
				let M = date.getMonth() + 1
				M = M < 10 ? '0' + M : M
				let d = date.getDate()
				d = d < 10 ? ('0' + d) : d
				let h = date.getHours()
				h = h < 10 ? ('0' + h) : h
				let m = date.getMinutes()
				m = m < 10 ? ('0' + m) : m
				this.birthYear = y
				this.birthMonth = M
				this.birthDay = d
				return y + '-' + M + '-' + d
			},
			//编辑器
			writeInfor(item,type) {
				this.$router.push({name:`Write`,params: {pageTitle: item,
						oldText:type,
						callback: (content) => {
							if(item==='姓名'){
								this.name = content.text
								console.log(this.name);
							}
							if(item==='电子邮件'){
								this.email = content.text
							}
							if(item==='电话'){
								this.username = content.text
							}
							if(item==='身份证'){
								this.idNumber = content.text
							}
						}
					}})
			},
			//获取个人信息
			async getUserDate(params){
				let res = await getUserDate(params)
				if(res.code === 200){
					this.myData = res.data
					this.name = this.myData.name
					this.username = this.myData.username?this.myData.username:'u'+this.myData.phone
					this.email = this.myData.email
					this.phone = this.myData.phone
					this.idNumber = this.myData.idNumber
					this.birthYear = this.myData.birthYear
					this.birthMonth=this.myData.birthMonth
					this.birthDay=this.myData.birthDay
					this.avatar = this.myData.avatar
					if(this.myData.gender===1){
						this.gender = '男'
					}else {
						this.gender = '女'
					}
				}
			},
			//编辑个人信息
			async userUptate(params){
				Indicator.open('加载中...')
				let res = await userUptate(params)
				if(res.code === 200){
					Indicator.close()
					this.$toast('修改成功')
					this.$route.params.callback && this.$route.params.callback()
					setTimeout(()=>{
						this.$router.back()
					},300)
				}else {
					Indicator.close()
					this.$toast('修改失败')
				}
			},
			//信息提交保存
			save(){
				let params ={
					id:this.userId,
					gender:this.gender==='男'?1:2,
					name:this.name,
					// birthYear:this.birthYear,
					// birthMonth:this.birthMonth,
					// birthDay:this.birthDay,
					avatar:this.avatar

				}
				if(this.username){
					this.reg =/^[A-Za-z][a-zA-Z0-9_-]{4,16}$/
					params.username = this.username
				}
				if(this.email){
					params.email = this.email
				}
				if(this.idNumber){
					params.idNumber = this.idNumber
				}
				if(this.emergencyContact){
					params.emergencyContact = this.emergencyContact
				}
				if(this.emergencyContactPhone){
					params.emergencyContactPhone = this.emergencyContactPhone
				}
				if(this.name===undefined){
					this.$toast('请填写姓名')
					return
				}
				// if(this.birthYear===undefined){
				// 	this.$toast('请选择出生年月')
				// 	return
				// }
				console.log(params);
				this.userUptate(params)
			},
			handleSuccess (res, file) {
				file.url = res.data.url
				file.name = '头像'
				this.avatar = res.data.url
			},
			handleFormatError (file) {
				this.$toast('上传的图片格式不对，只支持jpg,jpeg,png')
			},
			handleMaxSize (file) {
				this.$toast('上传的图片最大不能超过2MB')
			},
		}
	}
</script>

<style scoped>
	.head-box >>> .ivu-upload-drag{
		background-color: #f1f1f1;
		border: none;
		border-radius: 50%;
	}
	.van-popup--center{
		border-radius: 10px;
	}
	.content >>> .ivu-icon{
		margin-left: 10px;
		font-size: 36px
	}
	.box-wrap >>> .ivu-radio-group{
		padding: 15px 0 40px;
	}
	.box-wrap >>> .ivu-radio-wrapper{
		/*font-size: 28px;*/
	}
	.box-wrap >>> .ivu-radio{

	}
	.radio-class{
		zoom: 150%;
	}
</style>
<style lang="less" scoped>
	.main {
		background:rgba(241,241,241,1);
		padding:90px 0 54px;
		min-height: 100%;
		.head-box{
			display: flex;
			align-items: center;
			color: #999999;
			img{
				width:84px;
				height:84px;
				border-radius: 50%;
				display: block;
			}
			.name{
				height:50px;
				font-size:36px;
				font-family:PingFangSC-Medium;
				font-weight:500;
				color:rgba(72,72,72,1);
				line-height:50px;
				margin: 30px 0 12px;
				text-align: center;
				border: none;
				background-color: #F1F1F1FF;
			}
			.edit-name{
				height:40px;
				font-size:28px;
				font-family:PingFangSC-Regular;
				font-weight:400;
				color:rgba(98,140,253,1);
				line-height:40px;
			}
		}
		.content{
			.title{
				height:42px;
				font-size:30px;
				font-family:PingFangSC-Regular;
				font-weight:400;
				color:rgba(72,72,72,1);
				line-height:42px;

			}
			.items.card{
				margin: 20px 0;
			}
			.items{
				background:rgba(255,255,255,1);
				font-family:PingFangSC-Regular;
				font-weight:400;
				color:rgba(51,51,51,1);
				margin: 0 auto;
				padding: 0 32px;
				.item{
					font-size:28px;
					height: 96px;
					line-height:96px;
					border-bottom: solid #D4D4D4 1px;
					text-align: left;
					display: flex;
					justify-content: space-between;
					align-items: center;
					span{
						display: flex;
						align-items: center;
					}
					span:last-child{
						font-size:28px;
						font-family:PingFangSC-Regular;
						font-weight:400;
						color:rgba(153,153,153,1);
						line-height:36px;
					}
				}
				.item.h-img{
					height: 134px;
					line-height: 134px;
				}
				.item:last-child{
					border-bottom:none;
				}
			}
			.business{
				width:670px;
				background:rgba(255,255,255,1);
				box-shadow:0px 10px 16px 0px rgba(0,0,0,0.04);
				border-radius:20px;
				margin: 0 auto;
				p:first-child{
					font-size:28px;
					font-family:PingFangSC-Regular;
					font-weight:400;
					color:rgba(51,51,51,1);
					line-height:84px;
					height: 84px;
					border-bottom: solid #D4D4D4FF 1px;
					display: flex;
					justify-content: space-between;
					align-items: center;
					padding: 0 32px;
					span:last-child{
						font-weight:400;
						color:rgba(153,153,153,1);
					}
				}
				p:last-child{
					font-size:24px;
					font-family:PingFangSC-Regular;
					font-weight:400;
					color:rgba(153,153,153,1);
					line-height:80px;
					height: 80px;
					text-align: left;
					padding: 0 32px;
				}
			}
			.btn{
				width: 100%;
				height:82px;
				line-height: 80px;
				background:rgba(255,255,255,1);
				font-size:32px;
				font-family:PingFangSC;
				font-weight:500;
				color:rgba(71,189,195,1);
				border: none;
				margin-top: 250px;
			}
		}
		.box-wrap{
			width:668px;
			background:rgba(255,255,255,1);
			border-radius:10px;
			overflow: hidden;
			text-align: center;
			p{
				height: 80px;
				line-height: 80px;
				font-size: 30px;
				font-weight: 600;
			}
			.btns{
				margin: 20px 0;
				display: flex;
				justify-content: space-between;
				button{
					margin: 0 30px;
				}
			}
		}
		.img-head{
			width:248px;
			height:248px;
			border-radius: 50%;
			display: block;
		}
	}
</style>
