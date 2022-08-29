<template>
	<!-- 加载动画 -->
	<div v-show="lodingShow">
		<article-loding></article-loding>
	</div>
	
	
	<div id="container" v-show="!lodingShow">
		<!-- 回到顶部 -->
		<el-backtop :right="100" :bottom="100" />
		<!-- 阅读进度 -->
		<div class="scrollBar2"><span></span></div>
		
		<!-- 背景 -->
		<div class="bg">
			<div id="stars"></div>
		<div id="stars2"></div>
		<div id="stars3"></div>
		</div>

			
		<Head></Head>
		
		<div id="main" v-show="show">
			
			<div id="content">
				
				<div class="article-title-box">
					<h1 class="title-article" id="articleContentId">{{ title }}</h1>
				</div>
				
				<div class="article-info-box">
					<div class="article-bar-top">
						<a href="#" id="autor">{{ author }}</a>
						<span class="time">于&nbsp;
						<el-icon><pie-chart /></el-icon>&nbsp;<span v-text="timeFormat(createTime)"></span>&nbsp;发布
						</span>
						&nbsp;
						<i class="fa fa-eye" aria-hidden="true"></i>{{ view }}
						&nbsp;
						<i class="fa fa-thumbs-o-up" aria-hidden="true" :style="isThumbs ? 'color:red' : 'color:#B4B4B4'" @click="setThumbs"></i>{{ thumbs }}
						&nbsp;
						<i class="fa fa-share-alt-square" aria-hidden="true" @click="shareLink" title="复制链接"></i>
						<br>
						
						<ul>
							<li>标签：</li>
							<li><el-tag size="small" type="danger" v-for="(item,index) in tags" :key="index">{{ item }}</el-tag></li>
						</ul>
					</div>
							   
				 </div>
				
				<!-- content -->
				<html-panel id="content_main" :content="content"></html-panel>
				
			</div>
			<comment class="comment" :blogId="route.params.blogId" :blogTitle="title" :author="author"></comment>
		</div>
		
		<div id="error_404" v-show="show404">
			<img src="../../assets/img/404.png"/>
			<h2>抱歉！您访问的资源可能已被删除</h2>
		</div>
		<div id="error_500" v-show="show500">
			<img src="../../assets/img/500.png"/>
			<h2>抱歉！服务器出错啦</h2>
		</div>
	</div>
	
	
	<md-editor class="md" :theme="theme" style="display: none;"/>
</template>

<script setup lang="ts">
	import { ref,onMounted } from "vue"
	import Head from "../Head.vue"
	import 'md-editor-v3/lib/style.css';
	import MdEditor from 'md-editor-v3';
	import articleLoding from "../ArticleLoding.vue"
	import {useRoute} from "vue-router"//useRoute用来获取路由中传递的参数
	import axios from "axios"
	import htmlPanel from "../htmlPanel.vue"
	import comment from "../comment.vue"
	import { ElMessage } from 'element-plus'
	
	
	const route = new useRoute();
	const show500 = ref(false)
	const show404 = ref(false)
	const show = ref(true)
	const lodingShow = ref(true)
	const title = ref();
	const author = ref();
	const createTime = ref();
	const tags = ref();
	const content = ref();
	const thumbs = ref()
	const view = ref()
	const isThumbs = ref(false)
	
	
	
	//点赞
	const setThumbs = ()=> {
		
		axios.get("/FrontBlogHandle/setThumbs",{params:{ blogId:route.params.blogId, isThumbs:!isThumbs.value, title:title.value }})
		.then((res)=>{
			isThumbs.value = !isThumbs.value;
			if(isThumbs.value){
				thumbs.value = thumbs.value+1;
			}else{
				thumbs.value = thumbs.value-1;
			}
			
		})
	}
	//分享链接
	const shareLink = ()=>{
		copyUrl(window.location.href)
		succesTips("复制成功！")
	}
	
	function copyUrl(id) {
	    $(".md").after("<input id='copyVal'></input>");
	    var text = id;
	    var input = document.getElementById("copyVal");
	    input.value = text;
	    input.select();
	    input.setSelectionRange(0, input.value.length);   
	    document.execCommand("copy");
	   $("#copyVal").remove();
	}
	

	onMounted(()=>{
		axios.get("/FrontBlogHandle/getArticle",{params:{ blogId:route.params.blogId }})
		.then((res)=>{
			if(res.data.success == true){
				title.value = res.data.title;
				author.value = res.data.author;
				createTime.value = res.data.createTime;
				tags.value = res.data.tags;
				content.value = res.data.htmlContent;
				thumbs.value = res.data.thumbs;
				view.value = res.data.view;
			}else{
				show.value = false;
				show404.value = true;
			}
			setTimeout(function(){
				lodingShow.value = false;
			},500)
		})
		.catch(()=>{
			lodingShow.value = false;
			show500.value = true;
			show.value = false;
		})
	})
	
	
	const succesTips = (msg:string) => {
	  ElMessage({
	    message: msg,
	    type: 'success',
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
</script>

<script lang="ts">
	import $ from 'jquery'
	
	
	$(document).scroll(function (e) {
	  var scrollAmount = $(window).scrollTop();
	  var documentHeight = $(document).height();
	  var windowHeight = $(window).height();
	  var scrollPercent = (scrollAmount / (documentHeight - windowHeight)) * 100;
	  var roundScroll = Math.round(scrollPercent);
	  
	  // For scrollbar 1
	  $(".scrollBar1").css("width", scrollPercent + "%");
	  $(".scrollBar1 span").text(roundScroll);
	  
	  // For scrollbar 2
	  $(".scrollBar2").css("height", scrollPercent + "%");
	  $(".scrollBar2 span").text(roundScroll);
	});
</script>

<style scoped>
	@import "../../assets/css/starsky.css";
	.bg{
		position: fixed;
		height: 100vh;
		width: 100%;
		background-color: #0C0C0C;
		z-index: -1;
	}
	
	#main{
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
		width: 100%;
		height: 100%;
		background-size:100% 100%;
		background-repeat: no-repeat;
	}
	.article-bar-top ul li .el-tag{
		margin-left: 4px;
	}
	#error_404,#error_500{
		width: 100%;
		height: auto;
		display: flex;
		flex-direction: column;
		align-items: center;
		color: white;
		font-family: "仿宋";
		font-size: 40px;
	}
	#error_404>img,#error_500>img{
		width: 30%;
		height: 30%;
	}
	#content{
		width: 60%;
		height: auto;
		background-color: #242429;
		margin-top: 3%;
		padding: 1% 3%;
		margin-bottom: 10px;
		border-radius: 10px;
	}
	#content_main{
		color: #b4b4b4 ;
	}
	.fa-thumbs-o-up:hover,.fa-share-alt-square:hover{
		cursor: pointer;
		color: red;
	}
	.fa{
		margin-right: 3px;
	}
	.article-info-box {
		position: relative;
		background: rgba(248, 248, 248,0.1);
		border-radius: 4px;
		margin-top: 2%;
		font-size: 15px;
		color: #b4b4b4;
		padding: 5px 5px;
	}
	.article-info-box a{
		color: #b4b4b4;
	}
	.article-title-box{
		color: white;
	}
	ul{
		list-style: none;
		margin-top: 5px;
		display: flex;
	}
	#autor{
		color: white;
	}
	.comment{
		width: 60%;
		height: auto;
		padding: 1% 3%;
		border-radius: 7px;
	}
</style>


<style scoped>
	:root {
	  --timing: ease;
	}
	
	.scrollBar1 {
	  position: fixed;
	  top: 95vh;
	  height: 2px;
	  width: 0%;
	  background: goldenrod;
	  -webkit-transition: width 200ms var(--timing);
	  transition: width 200ms var(--timing);
	  text-align: right;
	  color: #fff;
	}
	.scrollBar1 span {
	  position: absolute;
	  top: -23px;
	  right: 15px;
	  font-size: 0.7em;
	  font-weight: 500;
	  display: block;
	  text-align: center;
	}
	.scrollBar1 span::after {
	  content: "%";
	  font-size: 0.8em;
	  position: absolute;
	  right: -15px;
	  bottom: 4px;
	  font-weight: 700;
	  opacity: 0.4;
	}
	
	.scrollBar2 {
	  position: fixed;
	  top: 0;
	  right: 2vw;
	  height: 0%;
	  width: 10px;
	  background: #49e;
	  -webkit-transition: height 200ms var(--timing);
	  transition: height 200ms var(--timing);
	  text-align: right;
	  color: #fff;
	  display: -webkit-box;
	  display: flex;
	  -webkit-box-align: center;
	          align-items: center;
	  border-radius: 1em;
	}
	.scrollBar2 span {
	  position: absolute;
	  bottom: 3px;
	  left: 2px;
	  font-size: 0.7em;
	  font-weight: 500;
	  display: inline-block;
	  text-align: left;
	  -webkit-transform: rotate(-90deg);
	  transform: rotate(-90deg);
	  -webkit-transform-origin: bottom right;
	  transform-origin: bottom left;
	}
	.scrollBar2 span::after {
	  content: "%";
	  font-size: 0.8em;
	  position: absolute;
	  right: -15px;
	  bottom: 4px;
	  font-weight: 700;
	  opacity: 0.4;
	}
	
	body {
	  position: relative;
	  overflow-x: hidden;
	  height: 200vh;
	  width: 100%;
	  display: -webkit-box;
	  display: flex;
	  -webkit-box-align: center;
	          align-items: center;
	  text-align: center;
	  color: #ccc;
	}
	body > div {
	  position: absolute;
	  top: 35vh;
	  font-size: 2em;
	  display: block;
	  text-align: center;
	  width: 100vw;
	}
	
	.st0 {
	  fill: #ffffff;
	}
	
	h1,
	h2,
	h3 {
	  margin: 0 0 1em;
	}
	
	h1 {
	  font-size: 1.2em;
	}
	
	h2 {
	  color: #666;
	  font-size: 0.8em;
	}
	
	h3 {
	  color: #777;
	  font-size: 0.6em;
	}
</style>
