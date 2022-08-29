<template>
	
<div class="home">
		
	<!-- 留言 -->
	<div id="leaveMsg" @click="writeMsg">
		<img src="../../assets/img/leaveMsg.apng" >
	</div>
	
	
	<Head></Head>
	
	<div id="main">
		<div class="left">
			<!-- 置顶推荐 -->
			<div class="top_recommend">
				<p>置顶推荐</p>
				<div class="slide_line"></div>
				 <el-divider />
				 <div id="top_recommend_box">
					 

					 <div class="top_recommend_text" @click="articlePage(item.id)" v-for="(item,index) in toppingText" :key="item.id">
					 	<img :src="item.blogCover" >
						<div class="top_recommend_title">
							{{ item.title }}
						</div>
						
						<div class="top_recommend_text_data">
							<ul>
								<li><i class="fa fa-eye" aria-hidden="true"></i>&nbsp;<span>{{ item.view }}</span></li>
								<li>
									<i class="fa fa-thumbs-o-up" aria-hidden="true"></i>
									{{ item.thumbs }}
								</li>
								<li v-text="timeFormat(item.createTime)"></li>
							</ul>
							
						</div>
					 </div>
					 
					 
				 </div>
			</div>
			<div class="all_blogs">
				<p>全部文章</p>
				<div class="slide_line"></div>
				 <el-divider />
				 
				 <div class="list-container">
					 <div class="list-item" v-for="(item,index) in allText" :key="item.id" @click="articlePage(item.id)">
						 <div class="title">
							 <h3>{{ item.title }}</h3>
						     <el-tag type="danger" class="mx-1" effect="dark" size="small" v-if="item.type==1">置顶</el-tag>
						 </div>
						 
						 <div class="item-text">
							 <div class="item-left" :style="(item.blogCover != null && item.blogCover != '') ? 'width: 82%;' : 'width: 100%;'">
								 <div class="row">
									 {{ item.blogExplain }}
								</div>
								<div class="row2">
									<span>
										<i class="fa fa-eye" aria-hidden="true"></i>
										{{ item.view }}
									</span>
									<span style="margin-left: 3%;">
										<i class="fa fa-thumbs-o-up" aria-hidden="true"></i>
										{{ item.thumbs }}
									</span>
									<span class="time" v-text="timeFormat(item.createTime)"></span>
								</div>
							</div>
							<div class="item-right" v-if="item.blogCover != null && item.blogCover != ''">
								<img :src="item.blogCover" alt="" style="width: 160px;height: 100px;">
							</div>
						 </div>
						 
						 <br>
						  <el-divider />
					 </div>
				 </div>
				 
				<!-- 分页 -->
				<el-pagination small background layout="prev, pager, next"
				:total="totalData"
				:current-page="currentpage"
				@current-change="handleCurrentPage"
				:page-size="4" class="mt-4"/>
			</div>
			
		</div>
		
		<div class="right">
			<!-- 网站介绍 -->
			<div class="introduce">
				<img src="../../assets/img/introduce.webp" alt="">
				<div id="header">
					<img src="../../assets/img/homeimg2.png" >
				</div>
				<h3 style="text-align: center;position: relative;top: -20px;">IABQL</h3>
				<div class="introduce_text">
					<span>个人博客网站，是一个记录自己生活点滴、互联网技术的个人博客网，摘录了优质的文案内容，以及收藏的一些职业技能等资料分享。</span>
				</div>
				<ul class="ul clearfix">
				    <li class="li fl" style="margin-right: 10%;"><span class="num">{{ viewCount }}</span><p>阅读数</p></li>
				    <el-divider direction="vertical" />
				    <li class="li fl" style="margin-left: 10%;"><span class="num">{{ totalData }}</span><p>文章数</p></li>
				 </ul>
			</div>
			 <el-divider />
			<el-button :type="item.type" round size="small" v-for="(item,index) in tags">{{item.lable}}</el-button>
		</div>
	</div>
	<Footer></Footer>
</div>
</template>

<script setup lang="ts">
	import { ref,onMounted } from "vue"
	import {useRouter,useRoute} from "vue-router"//useRoute用来获取路由中传递的参数
	import { userStore } from "../../store"
	import axios from "axios"
	import { ElMessage,ElMessageBox } from 'element-plus'
	import type { Action } from 'element-plus'
	import { Search } from '@element-plus/icons-vue'
	import { Storage } from '../../localStore/localStore.js'
	import Head from "../Head.vue"
	import Footer from "../Footer.vue"
	
	
	const store = userStore();
	const router = useRouter();
	const route = useRoute();
	const storage = new Storage();
	const headerUrl = ref('')
	const searchKey = ref('')
	const totalData = ref(0)//blog总条数
	const viewCount = ref(0)//阅读总数
	const currentpage = ref(1)
	const toppingText = ref<Array>()//置顶文章推荐
	const allText = ref<Array>()//all_blog
	
	
	type item = {
		type:string;
		lable:string;
	}
	
	const tags = ref<Array<item>>([
		{type:"success",lable:"spring"},
		{type:"info",lable:"springboot"},
		{type:"danger",lable:"redis"},
		{type:"success",lable:"计算机网络"},
		{type:"info",lable:"kafka"},
		{type:"danger",lable:"mysql"},
		{type:"warning",lable:"java"},
		{type:"warning",lable:"html"},
		{type:"danger",lable:"linux"},
		{type:"success",lable:"mybatis"},
		{type:"danger",lable:"多线程"},
		{type:"danger",lable:"docker"},
		{type:"info",lable:"zookeeper"},
		{type:"success",lable:"nginx"},
		{type:"warning",lable:"springcloud"},
		{type:"warning",lable:"其它"},
		])


	
	//监听当前页数变化，向后台请求数据
	//监听当前页的变化
	const handleCurrentPage = (newPage)=> {
		
		currentpage.value = newPage;
		//无关键词的分页查询
		if(searchKey.value == ''){
			getAllBlog(newPage)
		}
		//有关键词的分页查询
		else if(searchKey.value != ''){
			
			searchByKey(newPage);
		}	
	}
	
	
	
	//跳转文章详情页
	const articlePage = (blogId)=> {
		router.push("/blogshow/"+blogId);
	}
	
	
	//跳转留言页面
	const writeMsg = ()=>{
		router.push("/writeMsg")
	}
	
	//请求所有blog数据
	const getAllBlog = (currentPage)=> {
		
		axios.get("/FrontBlogHandle/getAllBlog",{params:{currentPage: currentPage}})
		.then((res)=>{
			allText.value = res.data.listBlog;
			totalData.value = res.data.countBlog;
		})
		.catch((error)=>{
			openError("获取数据失败！")
		})
	}
	
	
	//初始化
	onMounted(()=>{
		if(storage.getItem("user") != false){
			
			//获取头像
			headerUrl.value = storage.getItem("user").headerUrl;//从本地存储中获取
		}
		
		//请求置顶推荐数据
		axios.get("/FrontBlogHandle/getToppingBlog")
		.then((res)=>{
			toppingText.value = res.data;
				
		})
		.catch((error)=>{
			openError("获取数据失败！")
		})
		
		//请求网站阅读数
		axios.get("/FrontBlogHandle/getViewCount")
		.then((res)=>{
			viewCount.value = res.data;
				
		})
		.catch((error)=>{

		})
		
		
		//请求所有blog数据
		getAllBlog(1);
		
		if(IsPc() == false){
			tips()
		}
	})
	
	
	const tips = () => {
	  ElMessageBox.alert('使用PC端打开体验效果更好哦！', '温馨提示', {
	    confirmButtonText: 'OK',
	    callback: (action: Action) => {
	      
	    },
	  })
	}
	
	const openError = (msg:string)=> {
	  ElMessage({
	    showClose: true,
	    message: msg,
	    type: 'error',
	  })
	}
	
	const timeFormat = (data)=> {
			  var date = new Date(data)
			  var Y = date.getFullYear() + '-'
			  var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
			  var D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' '
			  var h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':'
			  var m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':'
			  var s = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds())
			  return Y + M + D + h + m + s
	}
	
	
	//判断是否是PC设备，true是，false不是
	const IsPc = ()=> {
	
		let userAgentInfo = navigator.userAgent;
		
		let Agents = ['Android','iPhone','SymbianOS','Windows Phone','iPod'];
		
		let flag = true;
		
		for(let i = 0;i < Agents.length;i++){
		
			if(userAgentInfo.indexOf(Agents[i])>0){
		
				flag = false;
		
				break;
		
			}
		
		}
		
		if(window.screen.width>=768){
		
			flag = true;
		
		}
		
		return flag;
	}
</script>

<style scoped>

.home{
	width: 100%;
	height: auto;
	background-color: #f2f2f2;
}

#main{
	display: flex;
	flex-direction: row;
	justify-content: center;
	align-items: center;
	width: 100%;
	height: auto;
	margin-top: 2%;
	margin-bottom: 100px;
}
#leaveMsg{
	width: 60px;
	height: 60px;
	position: fixed;
	top: 20%;
	left: 95%;
}
#leaveMsg>img{
	width: 60px;
	height: 60px;
}
#leaveMsg>img:hover{
	cursor: pointer;
}

.title{
	display: flex;
	align-items: center;
}
.title .el-tag{
	margin-left: 1%;
}
.left{
	width: 65%;
	height: 1000px;
}
.top_recommend{
	width: 97%;
	height: 30%;
	background-color: white;
	box-shadow: 0 1px 3px rgb(26 26 26 / 20%);
	padding: 15px 15px;
}
.top_recommend_text img{
	transition: 0.5s;
}
.top_recommend_text:hover img{
	transform: scale(0.9);
}
.top_recommend_text:hover{
	color: red;
}
.top_recommend p,.all_blogs p{
	font-size: 18px;
}
.all_blogs:hover .slide_line{
	width: 10%;
}
.top_recommend:hover .slide_line{
	width: 10%;
}
#top_recommend_box{
	width: 100%;
	height: 90%;
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding-top: 0.5%;
}
.top_recommend_title{
	height: 50px;
	width: 100%;

	overflow: hidden;
	text-overflow: ellipsis;
}
.top_recommend_text{
	width: 32%;
	height: 93%;
}
.top_recommend_text img{
	width: 100%;
	height: 160px;
	margin-bottom: 10px;
}
.top_recommend_text p{
	font-size: 17px;
	margin-bottom: 20px;
}
.top_recommend_text_data ul{
	list-style: none;
	display: flex;
	font-size: 14px;
	color: #999AAA;
}
.top_recommend_text_data ul li:nth-child(2){
	margin-left: 25px;
}
.top_recommend_text_data ul li:nth-child(3){
	margin-left: 60px;
}
.top_recommend_text:hover{
	cursor: pointer;
}
.all_blogs{
	margin-top: 2%;
	width: 97%;
	height: auto;
	background-color: white;
	padding: 15px 15px;
	box-shadow: 0 1px 3px rgb(26 26 26 / 20%);
}
.right{
	width: 20%;
	height: 1000px;
	padding: 10px 10px;
	background-color: white;
	border-radius: 10px 10px 10px 10px;
	margin-left: 1%;
	box-shadow: 0 1px 3px rgb(26 26 26 / 20%);
}
.el-button{
	margin-top: 15px;	
	position: relative;
	animation:myfirst 1.7s;
}
.el-button:nth-child(1){
	animation:myfirst 1s;
}
.el-button:nth-child(2){
	animation:myfirst 1.2s;
}
.el-button:nth-child(3){
	animation:myfirst 1.4s;
}
.el-button:nth-child(4){
	animation:myfirst 1.6s;
}
.el-button:nth-child(5){
	animation:myfirst 1.8s;
}
.el-button:nth-child(6){
	animation:myfirst 2s;
}
.el-button:nth-child(7){
	animation:myfirst 2.2s;
}
.el-button:nth-child(8){
	animation:myfirst 2.4s;
}
.el-button:nth-child(9){
	animation:myfirst 2.6s;
}
.el-button:nth-child(10){
	animation:myfirst 2.9s;
}
.el-button:nth-child(11){
	animation:myfirst 3s;
}
.el-button:nth-child(12){
	animation:myfirst 2.8s;
}
.el-button:nth-child(13){
	animation:myfirst 2.8s;
}
.el-button:nth-child(14){
	animation:myfirst 3s;
}
.el-button:nth-child(15){
	animation:myfirst 3.1s;
}
.el-button:nth-child(16){
	animation:myfirst 3.1s;
}

@keyframes myfirst
{
    0%   { top:700px;}
    100% { top:0px;}
}

.el-pagination{
	margin-top: 3%;
}

.introduce>img{
	width: 100%;
	height: 150px;
}
.el-divider--horizontal {
	margin: 0;
}
#header{
	width: 50px;
	height: 50px;
	background-color: white;
	border-radius: 50%;
	padding: 5px;
	position: relative;
	top: -35px;
	left: 50%;
	transform: translateX(-50%);
}
#header>img{
	width: 100%;
	height: 100%;
	border-radius: 50%;
}
.introduce_text>span{
	font-size: 14px;
	color: #666;
	line-height: 26px;
}
.slide_line{
	margin-top: 15px;
	width: 5%;
	height: 3px;
	background-color: blue;
	transition: width 1s;
}
.clearfix{
	width: 100%;
	height: 70px;
	list-style: none;
	display: flex;
	justify-content: center;
	align-items: center;
}
.clearfix p{
	font-size: 13px;
	color: #999;
}
.clearfix span{
	font-size: 20px;
}
.list-container{
	width: 100%;
	height: auto;
}
.list-item{
	margin-top: 2%;
}
.list-item:hover{
	cursor: pointer;
	background: rgba(248, 248, 248,0.6);
}
.list-item:hover h3{
	color: red;
}
.item-text{
	display: flex;
	justify-content: space-between;
	align-items: center;
}
.item-left{
	color: #999AAA;
}
.item-left>.row{
	height: 50px;
	line-height: 24px;
	overflow: hidden;
	text-overflow: ellipsis;
	font-size: 15px;
	color: #999AAA;
}
.item-left>.row2{
	margin-top: 1%;
}
.item-left>.row2>.time{
	float: right;
}
.item-right{
	margin-left: 1%;
}
</style>
