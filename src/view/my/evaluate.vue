<template>
    <div class="comment-body">
        <headBar title="评价"></headBar>
		<ul class="nav">
			<li v-for="(item,index) in typeList" :class="{active:index === currentType}" @click="tabType(index)">{{item.name}}</li>
		</ul>
        <ul class="comment-box">
            <li v-for="(item,index) in commentList" :key="index">
                <p class="tip"  v-if="currentType===1">
	                <span style="display: flex;align-items: center"> 打分：
		                <van-rate readonly  v-model="item.userScore" :size="18"  color="#FDA500"/>
	                </span>
	                <span>{{item.addTime}}</span>
                </p>
                <div class="comment" v-if="currentType===1">{{item.userEvaluation}}</div>
	            <div class="comment" v-else>订单号：NS{{item.id.toString().padStart(11, '0')}}</div>
                <div class="card">
                    <img :src="item.servicePicUrl" alt="">
	                <div class="content">
		                <div class="name">
			                <p>护理项目：{{item.serviceName}}</p>
			                <p>服务时间：{{item.serviceTime}}</p>
			                <p>总价：¥{{item.amount}}</p>
		                </div>
		                <p>{{item.nursingServiceDetailList}}</p>
	                </div>
                </div>
                <div class="more-but" v-if="currentType===0" @click="showEvalBox(item)">
	                <van-rate disabled  v-model="item.userScore" :size="18" />
	                <span>去评价</span>
                </div>
            </li>
        </ul>
	    <img v-if="!commentList.length" src="@/assets/icon/no-el.png" alt="" style="width: 50%;margin-top: 2rem">
	    <div class="mark-box" v-if="showEval">
		    <headBar title="评论">
			    <Icon slot="left"  type="ios-arrow-back" @click="showEval=false"/>
		    </headBar>
		    <div class="e-card">
			    <p>您对护士服务满意吗？</p>
			    <van-rate  v-model="score"  :size="32" color="#FDA500"/>
			    <textarea class="input-tex" v-model="evaluation" placeholder="请输入评语" />
			    <span class="num">{{evaluation.length}}/250</span>
			    <div class="terms" @click="cyyShow=true">
				    <img src="@/assets/img/cyy.png" alt="">选择常用语
			    </div>
		    </div>
		    <div class="btn2" @click="goEvaluate()">发表评论</div>
		    <van-action-sheet v-model="cyyShow" :actions="actions" @select="onSelect" />
	    </div>
    </div>
</template>

<script>
	import {getOrderList1,goEvaluate} from "@/lib/API/order";
import headBar from '@/components/header/head-bar'
export default {
    components:{
        headBar,
    },
    data(){
        return{
        	currentType:0,
	        typeList:[
		        {
		        	name:'待评价'
		        },
		        {
			        name:'已评价'
		        }
	        ],
            userId:'',
            commentList:[], //评论列表
            clickCommentID: '',
            clickOrderId:'',
            userUpdataCommentList:[],
            moreBox:[],
            upDataBox:[],
            score:0,
            evaluation:'',
	        size:100,
	        showEval:false, //评论
	        cyyShow:false, //常用语
	        actions: [
		        { name: '服务专业、细心，推荐给大家。'},
		        { name: '服务周到，无微不至，耐心细致。'},
		        { name: '主动热情,表情亲切,说话温和。'},
		        { name: '态度和蔼、服务热情、很有责任心。'},
		        { name: '任劳任怨，尽心尽职，工作耐心细致。',}
	        ],
        }
    },
	created(){
		this.userId = localStorage.getItem('userId')
		this.getOrderList1({userId:Number(this.userId),orderStatus:'5,6,7',size:this.size})
	},
    methods:{
	    // 获取订单列表
	    async getOrderList1(params){
		    let res = await getOrderList1(params)
		    if(res.code===200){
			    this.commentList= res.data.list
		    }
	    },
	    showEvalBox(item){
		    this.showEval=true
		    this.evaluation = ''
		    this.orderId = item.id
	    },
	    // 去评论
	    async goEvaluate(){
		    console.log(this.evaluation.length);
		    if(this.evaluation==='' || this.evaluation===null) {
	    		this.$toast('请输入评语')
			    return
		    }else if(this.evaluation.length>250){
		        this.$toast('你输入内容超出范围（250字内），请删减内容')
		        return
	        }
		    let res = await goEvaluate({
			    userId :this.userId ,
			    orderId:this.orderId,
			    evaluation :this.evaluation,
			    score :this.score,
		    })
		    if(res.code===200){
			    this.showEval=false
			    this.evaluation=''
			    this.score=0
			    this.$toast('评论成功')
			    this.getOrderList1({userId:Number(this.userId),orderStatus:'5,6,7',size:this.size})
		    }else {
			    this.$toast(res.message)
		    }
	    },
	    onSelect(item) {
		    this.evaluation = item.name
		    this.cyyShow = false
	    },
	    //切换分类
	    tabType(index){
		    if(this.currentType!=index){
			    this.currentType = index
			    if(this.currentType===0){
				    this.getOrderList1({userId:Number(this.userId),orderStatus:'5,6,7',size:this.size})
			    }else if(this.currentType===1){
				    this.getOrderList1({userId:Number(this.userId),orderStatus:8,size:this.size})
			    }
		    }
	    },
    },
}
</script>

<style lang="less" scoped>
.comment-body{
	background:#FAFAFC;
    min-height: 100% ;
	padding-top: 150px;
	.nav{
		text-align: left;
		padding: 0 40px;
		li{
			width:128px;
			height:56px;
			line-height: 54px;
			display: inline-block;
			border-radius:10px;
			border:2px solid rgba(153,153,153,1);
			font-size:28px;
			font-family:PingFangSC;
			font-weight:400;
			color:rgba(153,153,153,1);
			text-align: center;
			margin-right: 44px;
		}
		.active{
			border:2px solid rgba(71,189,195,1);
			color:rgba(71,189,195,1);
			font-weight:500;
		}
	}
    .comment-box{
        width: 100%;
        background:#FAFAFC;
	    margin-top: 20px;
	    padding: 28px 20px 26px;
	    li{
		    background:rgba(255,255,255,1);
		    border-radius:20px;
		    padding:20px;
		    text-align: left;
		    margin-bottom: 30px;
		    .tip{
			    display: flex;
			    justify-content: space-between;
			    align-items: center;
			    font-size:24px;
			    font-family:PingFangSC;
			    font-weight:500;
			    color:rgba(51,51,51,1);
			    border-bottom: solid 2px #E8E8E8;
			    padding-bottom: 6px;
			    span:last-child{
				    font-size:22px;
				    font-family:PingFangSC;
				    font-weight:400;
				    color:rgba(153,153,153,1);
			    }
		    }
		    .comment{
			    font-size:24px;
			    font-family:PingFangSC;
			    font-weight:400;
			    color:rgba(51,51,51,1);
			    line-height:34px;
			    margin: 16px 0 40px;
			    word-break: break-all;
		    }
		    .card{
			    /*width:676px;*/
			    width: 100%;
			    background:rgba(244,244,244,1);
			    border-radius:4px;
			    color:rgba(153,153,153,1);
			    display: flex;
			    padding: 10px;
			    img{
				    width:100px;
				    height:100px;
				    display: inline-block;
				    background:rgba(216,216,216,1);
				    border-radius:10px;
				    margin-right: 10px;
			    }
			    .content{
				    display:flex;
				    justify-content: center;
				    flex-direction: column;
				    font-size: 24px;
				    word-break: break-all;
			    }
		    }

	    }
    }
	.more-but{
		display: flex;
		justify-content: space-between;
		font-size:28px;
		font-family:PingFangSC;
		font-weight:400;
		color:rgba(153,153,153,1);
		line-height:40px;
		margin: 25px 0 5px;
	}
	.mark-box{
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background:rgba(248,248,248,1);
		z-index: 99;
		.head{
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
			.ivu-icon{
				font-size: 58px;
				position: absolute;
				left: 20px;
			}
		}
		.e-card{
			height:614px;
			background:rgba(255,255,255,1);
			border-radius:10px;
			width: 95%;
			margin: 114px auto 0;
			padding: 30px 40px;
			position: relative;
			.num{
				position: absolute;
				right:40px;
				bottom: 60px;
				font-size: 16px;
				color: #8e8e93;
			}
			p{
				font-size:28px;
				font-family:PingFangSC-Medium,PingFang SC;
				font-weight:500;
				color:rgba(51,51,51,1);
				line-height:40px;
				margin-bottom: 26px;
			}
			.input-tex{
				height:304px;
				background:rgba(249,249,249,1);
				border-radius:10px;
				border:1px solid rgba(235,235,235,1);
				padding: 24px;
				font-size:24px;
				font-family:PingFangSC-Regular,PingFang SC;
				font-weight:400;
				line-height:34px;
				margin: 40px 0 20px;
				width: 100%;
			}
			.terms{
				text-align: left;
				display: flex;
				align-items: center;
				font-size:28px;
				font-family:PingFangSC-Regular,PingFang SC;
				font-weight:400;
				color:rgba(51,51,51,1);
				img{
					width: 38px;
					margin-right: 20px;
				}
			}

		}
		.btn2{
			width: 90%;
			height:80px;
			line-height: 80px;
			background:rgba(71,189,195,1);
			border-radius:40px;
			font-size:32px;
			font-family:PingFangSC-Medium,PingFang SC;
			font-weight:500;
			color:rgba(255,255,255,1);
			margin: 300px auto 0;
		}
		.van-action-sheet__item{
			height: 130px;
		}
	}
}
</style>
