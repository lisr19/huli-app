<template>
    <div class="main">
        <headBar title="全部评价"></headBar>
	    <div class="items">
		    <div class="item" v-for="item in evaluateList">
			    <img :src="item.avatar" alt=" ">
			    <div style="flex: 1">
				    <p class="name">{{item.name}}</p>
				    <p class="eva-desc">
					    {{item.userEvaluation}}
				    </p>
			    </div>
		    </div>
	    </div>
    </div>
</template>

<script>

import headBar from '@/components/header/head-bar'
export default {
    components:{
        headBar,
    },
    data(){
        return{
	        evaluateList:[], //评论列表
        }
    },
	created(){
    	this.evaluateList = this.$route.params.evaluateList
	},
    methods:{

    },
}
</script>

<style lang="less" scoped>
	.main{
		padding-top: 100px;
		background-color: #fff;
		min-height: 100%;
		.items{
			text-align: left;
			padding: 20px 38px;
			line-height:40px;
			.item{
				display: flex;
				margin-bottom: 40px;
				img{
					width:58px;
					height:58px;
					margin-right: 20px;
					border-radius: 50%;
					background-color: #555;
					overflow: hidden;
				}
				.name{
					font-size:24px;
					font-family:PingFangSC-Regular,PingFang SC;
					font-weight:400;
					color:rgba(153,153,153,1);
				}
				.eva-desc{
					font-size:28px;
					font-family:PingFangSC-Light,PingFang SC;
					font-weight:300;
					color:rgba(51,51,51,1);
				}
			}
		}
	}
</style>
