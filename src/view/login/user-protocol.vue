<template>
	<div class="main">
		<head-bar title="用户协议"></head-bar>
		<h2>互联网+护理服务协议</h2>
		<div class="txt">
			上门护理服务具有一定的危险性，为确保安全，如病情迫切需要在家中治疗护理，请签订互联网＋护理服务协议书，以确保双方权益。由于因违反此协议而造成的后果，由各自承担相应的责任。<br>
			<h3>第一条    甲方基本权利和义务</h3>
			1.甲方有权依据乙方选择的服务需求进行评估并核准其服务内容，在服务内容范围内进行有效服务，乙方不能擅自增加与居家护理服务严重不符的劳务负担。<br>
			2.在服务过程中，因乙方思维故障、情绪不稳等原因，导致失去行为自控能力，出现攻击性或伤害性行为时，甲方服务人员有权停止服务。<br>
			3.在服务过程中，若出现乙方要求或变相要求甲方为乙方以外的其他人员服务时，甲方服务人员有权拒绝。<br>
			4.甲方有权拒绝乙方提出一切不合理、不合法的要求，维护自己的人格尊严和财产权利不受侵犯。<br>
			5.甲方依照本协议只向乙方提供相应的居家护理服务，不承担人身安全保障和监护义务。<br>
			<h3>第二条  乙方基本权利和义务</h3>
			1.在甲方上门服务过程中，乙方应尊重甲方，平等对待。乙方有义务详细交待与服务相关的内容，以便甲方人员能迅速、稳妥地开展工作，不得歧视及出现人身攻击等行为。
			甲方每次上门服务结束后，乙方应配合甲方在服务记录本上进行双签字认可。若乙方不满意甲方提供的服务，有权向甲方医院申诉。<br>
			2.甲方为乙方提供服务期间，正常所需治疗费用由乙方自行承担；乙方患病需要就医或是突发紧急情况，其产生的医疗、救护车转送、生活、住院陪护等费用由乙方自行承担。<br>
			3.乙方患有传染性疾病期间，甲方将暂时停止提供居家护理服务，待乙方痊愈后，甲方将继续安排服务。<br>
			4.乙方妥善保管好自己的财物，如乙方财物失窃，应及时向公安机关报案，通过法律途径解决。在任何情况下，乙方都不得对甲方采取搜身、扣押钱财以及殴打、威逼等侵权行为。<br>
			5. 乙方应积极配合甲方管理人员对服务情况进行满意度调查，乙方有权对甲方的服务质量和服务态度向上级管理人员提出反馈建议。<br>
			6、甲方在服务过程中会拍摄部分照片，但不涉及乙方隐私，乙方有义务积极配合。<br>
			<h3>第三条  安全条约</h3>
			1.在签订协议过程中，乙方应如实告知甲方身体状况，如高血压、心脏病、脑梗塞、过敏史等有危险性或易突发性疾病，并告知疾病相应的注意事项。<br>
			2.乙方遇突发疾病或意外需要甲方紧急救援服务时，甲方协助与相应机构进行联系（如110、120、119等）。<br>
			3.甲方服务人员在服务期间，突发急病或其他事故伤害时，乙方有义务及时拨打求救电话抢救工作人员。<br>
			4.甲方在服务过程中，乙方因心脑血管疾病、生理机能衰退或行为不慎发生意外等引起的伤残、猝死、因老死亡等事件，甲方概不承担责任。<br>
			5.在协议期间，乙方在家发生的各种意外伤害（例如水灾、火灾、漏电触电等），或心理问题、家庭矛盾、情绪波动等原因导致老人出现轻生举动、坠楼、割脉、自缢等意外死亡甲方概不承担责任。<br>
			6.在服务过程中，乙方因思维故障、情绪不稳等原因，导致失去行为自控能力，出现攻击性或伤害性行为，造成自伤。如：误食，误伤、软组织损伤、骨折、死亡等，甲方概不承担责任。<br>
			<h3>第四条  乙方需调整服务项目，须重新提出申请，甲方在接到乙方提出的服务调整申请后，需重新签订服务合同，在信息平台进行登记后安排服务人员按新的服务需求进行提供即可。</h3>
			<h3>第五条  本协议一式两份，甲、乙双方各执一份，双方签订之日起生效，本协议未尽事宜双方协商解决。</h3>
		</div>
		<div class="btn" :style="style" v-if="show" @click="agreeBtn">我已阅读悉知并同意此用户协议</div>
	</div>
</template>

<script>
	import headBar from '@/components/header/head-bar'
	// import {getOrderList} from "@/lib/API/order";

	export default {
		components:{
			headBar,
		},
		data(){
			return{
				style: {},
				opacity: 0,
				show:false,

			}
		},
		created(){
			if(this.$route.query&&this.$route.query.from==='login'){
				this.show =true
			}
		},
		mounted(){
			window.addEventListener('scroll', this.handleScroll)
		},
		methods: {
			handleScroll () {
				let scrollTop = document.documentElement.scrollTop||document.body.scrollTop;
				//变量windowHeight是可视区的高度
				let windowHeight = document.documentElement.clientHeight || document.body.clientHeight;
				//变量scrollHeight是滚动条的总高度
				let scrollHeight = document.documentElement.scrollHeight||document.body.scrollHeight;
				if(scrollTop<50){
					this.opacity = 0
				}else {
					this.opacity = 1-(Math.abs(Math.round(scrollHeight-scrollTop-windowHeight)))*0.001;
				}
				this.style = {opacity:`${this.opacity}`}
			},
			agreeBtn(){
				if(this.$route.query&&this.opacity>0.92){
					this.$route.query&&this.$route.query.callback({isRead:true})
					this.$router.back()
				}
			}
		}
	}
</script>

<style lang="less" scoped>
	.main{
		padding: 90px 0;
		min-height: 100%;
		width: 100%;
		position: relative;
		h2{
			height:42px;
			font-size:30px;
			font-family:PingFangSC;
			font-weight:500;
			color:rgba(72,72,72,1);
			line-height:42px;
			text-align: left;
			margin: 30px 0 40px;
			border-bottom: solid 1px #CFCFCF;
			padding: 0 40px;
			padding-bottom: 60px;
		}
		.txt{
			text-align: left;
			font-size:24px;
			font-family:PingFangSC;
			font-weight:400;
			color:rgba(72,72,72,1);
			line-height:34px;
			padding: 0 40px;
			h3{
				margin: 24px 0 20px;
			}
		}
		.btn{
			position: fixed;
			bottom: 0;
			height: 80px;
			line-height: 80px;
			text-align: center;
			width: 100%;
			color: #ffffff;
			opacity:0;
			background-color: #47BDC3;
		}
	}
</style>

