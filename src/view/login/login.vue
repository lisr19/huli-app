<template>
	<div class="page">
		<img class="logo" src="@/assets/icon/logo.png" alt="">
		<div class="login-box" id="login-box">
			<input  v-model="userPhoneNum" type="number" placeholder='请输入手机号码' oninput="if(value.length>11)value=value.slice(0,11)">
			<input  v-model="userPassWord" v-if="showPass" type="text" placeholder='请输入密码' name="" oninput="if(value.length>16)value=value.slice(0,16)">
			<input  v-model="userPassWord" v-else type="password" placeholder='请输入密码' name="" oninput="if(value.length>16)value=value.slice(0,16)">
			<div class="show-pass" @click="onClickPassShow">
				<img v-if="showPass" src="@/assets/icon/hide-pass.png" alt="">
				<img v-else style="margin: 20% 0;" src="@/assets/icon/show-pass.png" alt="">
			</div>
			<button class="login-but" @click="userLogin()">登录</button>
			<div class="btn-box">
				<span class="forget-pass" @click="openForget()">忘记密码？</span>
				<span class="new-enroll" @click="onClickEnrollBox()">注册账号</span>
			</div>
		</div>
		<div class="enroll-box">
			<div class="go-login" @click="onClickLoginBox">
				<i></i>
			</div>
			<input  v-model="newUserPhoneNum" placeholder='请输入手机号码' type="number" oninput="if(value.length>11)value=value.slice(0,11)">
			<input  v-model="code" type="number" placeholder='输入验证码' oninput="if(value.length>6)value=value.slice(0,6)">
			<input  v-model="newUserPassWord" placeholder='请设置您的密码' type="password" oninput="if(value.length>16)value=value.slice(0,16)">
			<input  v-model="newUserPassWord2" placeholder='请重复您的密码' type="password" oninput="if(value.length>16)value=value.slice(0,16)">
			<h5 class="get-note" @click="SMS(1)">{{noteButtonText}}</h5>
			<button class="enroll-but" @click="newUser()">注册，并立即登录</button>
			<div class="tip">
				<em class="icon" v-if="!isRead" @click="$toast('请先阅读《用户服务协议》并同意')"></em>
				<img class="icon-select" v-else src="@/assets/icon/yes.png" alt="">
				我已阅读且同意<span @click="openUserProt">《用户服务协议》</span></div>
		</div>
		<div class="forget-box">
			<div class="go-login" @click="offForget">
				<i></i>
			</div>
			<input  v-model="userPhone" placeholder='请输入手机号码' type="number" oninput="if(value.length>11)value=value.slice(0,11)">
			<input  v-model="code" type="number" placeholder='输入验证码' oninput="if(value.length>6)value=value.slice(0,6)">
			<input  v-model="userNewPass" placeholder='输入您的新密码' type="password" oninput="if(value.length>16)value=value.slice(0,16)">
			<input  v-model="userNewPass2" placeholder='重复您的新密码' type="password" oninput="if(value.length>16)value=value.slice(0,16)">
			<h5 class="get-note" @click="SMS(2)">{{noteButtonText}}</h5>
			<button class="forget-but" @click="newPass()">修改密码，并立即登录</button>
		</div>
	</div>
</template>
<script>
	import {newUser,userLogin,SMS,newPass,codeRegister,codeUpdatePwd} from "@/lib/API/login-enroll";
	import {Indicator} from 'mint-ui';
	export default {
		// watch:{
		// 	screenHeight(val,oldval){ //监听屏幕高度变化
		// 		let oIframe = document.getElementById('login-box')
		// 		if(val<oldval){
		// 			oIframe.style.top = 35 + '%';
		// 		}else {
		// 			oIframe.style.top = 24 + '%';
		// 		}
		// 	}
		// },
		data(){
			return{
				isRead:false, //是否阅读用户协议
				showPass: false,
				//登录的 账号 密码
				userPhoneNum: '',
				userPassWord: '',
				//新账号的 账号 验证码 密码
				newUserPhoneNum:'',
				newUserverification:'',
				newUserPassWord:'',
				newUserPassWord2:'',
				noteButtonText:'获取验证码',
				note60SLock:true,
				//忘记密码的 账号 验证码 新密码
				userPhone:'',
				userVerification:'',
				userNewPass:'',
				userNewPass2:'',
				loginButton:[],
				enrollButton:[],
				forgetButton:[],
				loginBox:[],
				enrollBox:[],
				forgetBox:[],
				isLogin:true,
				code:'', // 验证码
				reg:null,
				getCode1:false,
				screenHeight: document.documentElement.clientHeight,//屏幕高度
			}
		},
		beforeRouteEnter(to, from, next) {
			next(vm => {
				if (from.name === '首页') {
					to.meta.keepAlive=false
					vm.$router.go(0)
				}
			})
		},
		mounted(){
			window.onresize = ()=>{ // 定义窗口大小变更通知事件
				this.screenHeight = document.documentElement.clientHeight; //窗口高度
			}
			this.loginButton = document.getElementsByClassName('login-but')[0]
			this.loginBox = document.getElementsByClassName('login-box')[0]
			this.enrollButton = document.getElementsByClassName('enroll-but')[0]
			this.enrollBox = document.getElementsByClassName('enroll-box')[0]
			this.forgetButton = document.getElementsByClassName('forget-but')[0]
			this.forgetBox = document.getElementsByClassName('forget-box')[0]
		},
		updated(){
			this.forgetButtonDecide()
			this.enrollButtonDecide()
			this.loginButtonDecide()
		},
		methods:{
			//获取当前时间
			time(time = +new Date()) {
				var date = new Date(time + 8 * 3600 * 1000); // 增加8小时
				return date.toJSON().substr(0, 19).replace('T', ' ');
			},
			openUserProt(){
				this.$router.push({name:'用户服务协议',query:{from:'login',callback:this.callback}})
			},
			callback(parmas){
				this.isRead = parmas.isRead
				console.log(this.isRead);
			},
			// 登录注册窗口切换
			onClickEnrollBox(){
				this.loginBox.style.left='-55%';
				this.enrollBox.style.left='50%';
			},
			onClickLoginBox(){
				this.loginBox.style.left='';
				this.enrollBox.style.left='';
			},
			// 打开、关闭忘记密码窗口
			openForget(){
				if(this.userPhoneNum){
					this.userPhone = this.userPhoneNum
				}else {
					this.userPhone=''
				}
				this.loginBox.style.left='-55%';
				this.forgetBox.style.left='50%'
			},
			offForget(){
				this.loginBox.style.left='';
				this.forgetBox.style.left=''
			},
			// 登录密码显示隐藏
			onClickPassShow(){
				if(this.showPass){
					this.showPass = false;
				}else{
					this.showPass = true;
				}
			},
			//登录按钮颜色
			loginButtonDecide(){
				if(this.userPhoneNum&&this.userPassWord){
					this.loginButton.style.background='#47BDC3';
				}else{
					this.loginButton.style.background='#969696';
				}
			},
			//注册按钮颜色
			enrollButtonDecide(){
				if(this.newUserPhoneNum&&this.newUserPassWord&&this.newUserPassWord2&&this.code){
					this.enrollButton.style.background='#47BDC3';
				}else{
					this.enrollButton.style.background='#969696';
				}
			},
			//修改密码按钮变色
			forgetButtonDecide(){
				if(this.userPhone&&this.code&&this.userNewPass&&this.userNewPass2){
					this.forgetButton.style.background='#47BDC3';
				}else{
					this.forgetButton.style.background='#969696';
				}
			},
			// 获取注册验证码
			onClickGetNote(){
				//倒计时
				if(this.note60SLock){
					this.note60SLock = false;
					let second = 60;
					let countDown = setInterval(()=>{
						this.noteButtonText = second+'S';
						second--;
						if(second == 0){
							clearInterval(countDown);
							this.note60SLock = true;
							this.noteButtonText = '重新发送';
						}
					},1000)
				}
			},
			// 用户登录
			async userLogin(){
				if(!this.userPhoneNum){
					this.$toast('请输入手机号')
					return
				}
				if(!this.userPassWord){
					this.$toast('请输入密码')
					return
				}
				if(!(/^1[3-9]\d{9}$/.test(this.userPhoneNum))){
					this.$toast('电话号码格式错误')
					return
				}
				Indicator.open('加载中...')
				let res = await userLogin({
					username:this.userPhoneNum,
					password :this.userPassWord,
				})
				if(res.code===200){
					Indicator.close()
					this.$toast('登录成功')
					let userId = res.data.userInfo.id
					let token = res.data.token
					let username = res.data.userInfo.username
					localStorage.setItem('token',token);
					localStorage.setItem('userId',userId);
					localStorage.setItem('username',username)
					this.$router.push({name:'首页',params:{isLogin:true}})
				}else if(res.message==='帐户被禁用，请与管理员联系！'){
					Indicator.close()
					this.$toast('帐户被禁用，请与管理员联系！')
				} else if(res.message==='密码错误'){
					Indicator.close()
					this.$toast('密码错误')
				} else if(res.message==='此用户不存在'){
					Indicator.close()
					this.$toast('此用户不存在')
				} else {
					Indicator.close()
					this.$toast('输入的账号或密码有误，请重新输入')
				}
			},
			// 新用户注册
			async newUser(){
				if(!this.newUserPhoneNum){
					this.$toast('请输入手机号')
					return
				}
				if(!this.code){
					this.$toast('请输入验证码')
					return
				}
				if(!this.newUserPassWord){
					this.$toast('请输入密码')
					return
				}
				if(!(/^1[3-9]\d{9}$/.test(this.newUserPhoneNum))){
					this.$toast('电话号码格式错误')
					return
				}
				if(this.newUserPassWord!==this.newUserPassWord2){
					this.$toast('两次密码不一致')
					return
				}
				if(!(/^(\w){6,16}$/.test(this.newUserPassWord))){
					this.$toast('密码只能输入6-20个字母、数字、下划线')
					return
				}
				if(!this.getCode1){
					this.$toast('请获取验证码')
					return
				}
				if(!this.isRead){
					this.$toast('您尚未阅读并同意用户协议')
					return
				}
				const params = {
					username:this.newUserPhoneNum,
					password:this.newUserPassWord,
					code:this.code
				}
				Indicator.open('加载中...')
				let res = await newUser(params)
				if(res.code===200){
					Indicator.close()
					let userId = res.data.userInfo.id
					let token = res.data.token
					localStorage.setItem('token',token)
					localStorage.setItem('userId',userId)
					this.$toast('注册成功')
					this.$router.push({name:'首页',params:{isLogin:false}})
				}else {
					Indicator.close()
					this.$toast(res.message)
				}
			},
			// 修改密码
			async newPass(){
				if(!this.userPhone){
					this.$toast('请输入手机号')
					return
				}
				if(!this.code){
					this.$toast('请输入验证码')
					return
				}
				if(!this.userNewPass){
					this.$toast('请输入密码')
					return
				}
				if(!(/^1[3-9]\d{9}$/.test(this.userPhone))){
					this.$toast('电话号码格式错误')
					return
				}
				if(!(/^(\w){6,16}$/.test(this.userNewPass))){
					this.$toast('密码只能输入6-20个字母、数字、下划线')
					return
				}
				if(this.userNewPass!==this.userNewPass2){
					this.$toast('两次密码不一致')
					return
				}
				if(!this.getCode1){
					this.$toast('请获取验证码')
					return
				}
				let res = await codeUpdatePwd({
					username:this.userPhone,
					password:this.userNewPass,
					code:this.code
				})
				if(res.code===200){

					this.userPhoneNum=this.userPhone,
					this.userPassWord =this.userNewPass
					this.$toast('密码修改成功')
					this.userLogin()
				}else{
					this.$toast('验证码不正确')
				}
			},
			// 发送信息
			async SMS(index){
				let res
				if(this.note60SLock){
					if(index===1){
						console.log('注册');
						if(!this.newUserPhoneNum){
							this.$toast('请输入手机号')
							return
						}
						if(!(/^1[3-9]\d{9}$/.test(this.newUserPhoneNum))){
							this.$toast('电话号码格式错误')
							return
						}
						this.getCode1 = true
						res = await SMS({phone:this.newUserPhoneNum})
					}else if(index===2){
						console.log('忘记密码');
						if(!this.userPhone){
							this.$toast('请输入手机号')
							return
						}
						if(!(/^1[3-9]\d{9}$/.test(this.userPhone))){
							this.$toast('电话号码格式错误')
							return
						}
						this.getCode1 = true
						res = await SMS({phone:this.userPhone})
					}
					if(res.code===200){
						this.$toast('验证已发送')
						this.onClickGetNote()
						setTimeout(()=>{
							this.getCode1 = false
						},1000*60)
					}else {
						this.$toast('发送失败')
					}
				} else{
					this.$toast('请勿多次点击')
				}
			}
		},
	}
</script>
<style lang="less" scoped>
	.page{
		width: 100%;
		.logo{
			width: 142px;
			height: 142px;
			margin: 80px auto 0;
		}
		button{
			transition: all .5s;
		}
		>div{
			position: fixed;
			top:24%;
			margin-left: -289px;
			background: #fff;
			border-radius:10px;
			transition: all .5s;
			>input{
				width: 512px;
				height: 62px;
				outline: none;
				display: block;
				border: 0;
				border-bottom: 2px solid #C7C7C7;
				background: #fff ;
				margin: 38px auto 0;
				font-size:24px;
				font-family:PingFangSC-Regular;
				font-weight:400;
				line-height:62px;
			}
			>input:nth-of-type(1){
				margin-top: 68px;
			}
			>button{
				border: 0;
				width:512px;
				height:72px;
				background:rgba(150,150,150,1);
				box-shadow:0px 4px 8px 4px rgba(80,113,203,0.12);
				border-radius:10px;
				outline: none;
				font-size:28px;
				font-family:PingFangSC-Medium;
				font-weight:500;
				color:rgba(255,255,255,1);
				line-height:72px;
				margin-top: 64px;
			}
			>h1{
				position: absolute;
				height:34px;
				font-size:24px;
				font-family:PingFangSC-Regular;
				font-weight:400;
				color:rgba(153,153,153,1);
				line-height:34px;
			}
			>p{
				width: 100%;
				height: 34px;
				position: absolute;
				top: 20px;
				left: 0;
				font-size:24px;
				font-family:PingFangSC-Regular;
				font-weight:400;
				line-height:34px;
				background: rgba(253,98,98,1);
				color:#fff;
				transition: all 1s;
			}
		}
		.login-box{
			width:670px;
			height:512px;
			background:rgba(255,255,255,1);
			border-radius:10px;
			left: 44%;
			input{
				padding-left: 15px;
			}
			.show-pass{
				width: 40px;
				height: 40px;
				position: absolute;
				right: 88px;
				top: 180px;
				>img{
					display: block;
					width: 100%;
				}
			}
			.btn-box{
				margin-top: 64px;
				text-align: right;
				height:34px;
				font-size:24px;
				font-family:PingFangSC-Regular;
				font-weight:400;
				color:rgba(153,153,153,1);
				line-height:34px;
				padding-right: 60px;
				span{
					margin-right: 24px;
				}
			}
		}
		.enroll-box{
			width:670px;
			height: 616px;
			margin-left: -335px;
			left: 150%;
			.enroll-but{
				margin-top: 50px;
			}
			>.go-login{
				width: 50px;
				height: 50px;
				position: absolute;
				top: 10px;
				left: 10px;
				z-index: 10;
				>i{
					display: block;
					position: absolute;
				}
				>i:nth-of-type(1){
					width: 20px;
					height: 20px;
					border: 2px solid rgba(150,150,150,1);
					border-top: 0;
					border-right: 0;
					transform: rotate(45deg);
					top: 50%;
					margin-top: -10px;
					margin-left: 11px;
				}
			}
			>.get-note{
				position: absolute;
				top: 160px;
				right: 95px;
				padding: 0 10px;
				width: auto;
				min-width: 140px;
				height: 52px;
				font-size:24px;
				line-height: 50px;
				border-radius: 10px;
				color: rgba(150,150,150,1);
				border: 2px solid rgba(150,150,150,1);
			}
			.tip{
				width: 100%;
				bottom: 10px;
				left: 0;
				height: auto;
				font-size: 20px;
				margin-top: 14px;
				color: #999;
				display: flex;
				align-items: center;
				justify-content: center;
				span{
					color: #47BDC3;
				}
				.icon{
					width:26px;
					height:26px;
					border-radius: 50%;
					border: solid #d6d6d6 1px;
					display: inline-block;
					margin-right: 8px;
				}
				.icon-select{
					width:26px;
					height:26px;
					color: #628CFD;
					display: inline-block;
					margin-right: 8px;
				}
			}
		}
		.forget-box{
			width: 670px;
			height: 616px;
			margin-left: -335px;
			left: 150%;
			z-index: 10;
			>.go-login{
				width: 50px;
				height: 50px;
				position: absolute;
				top: 10px;
				left: 10px;
				z-index: 10;
				>i{
					display: block;
					position: absolute;
				}
				>i:nth-of-type(1){
					width: 20px;
					height: 20px;
					border: 2px solid rgba(150,150,150,1);
					border-top: 0;
					border-right: 0;
					transform: rotate(45deg);
					top: 50%;
					margin-top: -10px;
					margin-left: 11px;
				}
			}
			>.get-note{
				position: absolute;
				top: 160px;
				right: 95px;
				padding: 0 10px;
				width: auto;
				min-width: 140px;
				height: 52px;
				font-size:24px;
				line-height: 50px;
				border-radius: 10px;
				color: rgba(150,150,150,1);
				border: 2px solid rgba(150,150,150,1);
			}
		}
	}

</style>
