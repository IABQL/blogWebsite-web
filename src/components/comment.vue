<template>
	<div id="comment">
		<h3>评论</h3>
		<div class="comment_input">
			<el-avatar id="head_img" fit="cover" :src="headerUrl" />
			<div class="comment_textarea">
				<textarea @focus="getFocus" @blur="blur" v-model="content"></textarea>
				<div class="comment_controller">
					<img id="emotionIcon" src="../assets/img/commentEmotionIcon.png" style="width: 22px;height: 22px;"/>
					<el-button type="primary" size="small" @click="uploadComment(blogId,blogTitle)">发表评论</el-button>
				</div>
			</div>
		</div>
		
		<div class="no_comment" v-show="show"><h3>暂时没有评论！赶快来占领榜首</h3></div>
		<div class="comment_text" v-show="!show">
			<ul>
				<li v-for="(item,index) in contentList" :key="index">
					<el-avatar id="head_img" fit="cover" :src="item.headerUrl" />
					<div class="text">
						<p>
							<span>{{ item.username }}</span>
							&nbsp;&nbsp;
							<span v-text="timeFormat(item.createTime)"></span>
							&nbsp;
							<el-tag type="danger" class="mx-1" effect="dark" size="small" v-if="item.username == author">博主</el-tag>
						</p>
						<p>{{ item.content }}</p>
					</div>
				</li>
				
			</ul>
		</div>
	</div>
</template>

<script setup lang="ts">
	import { ref,onMounted } from "vue"
	import { Storage } from '../localStore/localStore.js'
	import $ from 'jquery' //引入jquery使用
	import axios from "axios"
	import {useRoute} from "vue-router"
	
	const route = new useRoute();
	const storage = new Storage();
	const headerUrl = ref()
	const content = ref()
	const contentList = ref<Array>()
	const show = ref(true)
	
	
	defineProps<{
		blogId:Number,
		blogTitle:string,
		author:string
	}>()
		
	class Comment{
		blogId:Number;
		content:string;
		username:string;
		headerUrl:string;
		createTime:data;
		title:string;
		constructor(blogId:Number,content:string,username:string,headerUrl:string,createTime:data,title:string){
			this.blogId = blogId;
			this.content = content;
			this.username = username;
			this.headerUrl = headerUrl;
			this.createTime = createTime;
			this.title = title;
		}
	}
	
	
	//上传comment
	const uploadComment = (blogId:Number,title:string)=>{
		
		let username = storage.getItem("user").userName;
		let header = storage.getItem("user").headerUrl;
		
		if(username == undefined){
			username = localStorage.getItem("default_username");
			headerUrl.value = header = localStorage.getItem("default_header")
		}
		
		const comment = new Comment(blogId,content.value,username,header,new Date(),title)

		axios.post("/FrontBlogHandle/addComment",comment)
		.then((res)=>{
			contentList.value.push(res.data)
			content.value = ''
			
		})
		.catch((error)=>{
			
		})
	}
	
	
	//获取comment
	const getComments = (blogId)=>{
		axios.get("/FrontBlogHandle/getComments",{params:{blogId:blogId}})
		.then((res)=>{
			if(res.data.length != 0){
				contentList.value = res.data;
				show.value = false;
			}
			
		})
	}
	
	
	
	onMounted(()=>{
		
		if(storage.getItem("user") != false){
			//获取头像
			headerUrl.value = storage.getItem("user").headerUrl;//从本地存储中获取
		}else{
			headerUrl.value = localStorage.getItem("default_header")
		}
		
		//获取comment
		getComments(route.params.blogId)
	})
	
	
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
	
	const getFocus = ()=>{
		$(".comment_textarea").css("display","block")
		$(".comment_controller").css("float","right")
		$(".comment_controller").css("border-radius","4px")
		$(".comment_controller").css("background-color","#242429")
		$("#emotionIcon").css("position","relative")
		$("#emotionIcon").css("top","-90%")
		$("#emotionIcon").css("left","75%")
	}
	const blur = ()=>{
		$(".comment_textarea").css("display","flex")
		$(".comment_controller").css("border-radius","0 4px 4px 0")
		$(".comment_controller").css("background","rgba(248, 248, 248,0.1)")
		$("#emotionIcon").css("position","relative")
		$("#emotionIcon").css("top","0")
		$("#emotionIcon").css("left","0")
	}
		

</script>

<style scoped>
	#comment{
		/* background-color: #242429; */
		background: rgba(248, 248, 248,0.1);
	}
	h3{
		color: white;
	}
	.comment_input{
		margin-top: 3%;
		display: flex;
		justify-content: center;
		width: 100%;
		height: auto;
	}
	#head_img{
		width: 27px;
		height: 27px;
		margin-right: 2%;
	}
	.comment_textarea{
		display: flex;
		justify-content: center;
		align-items: center;
		width: 90%;
		height: auto;
	}
	.comment_textarea:focus{
		height: 60px;
	}
	textarea{
		width: 80%;
		height: 30px;
		resize: none;
		transition: all 0.7s;
		border-radius: 4px 0 0 4px;
		border: none;
		margin-top: 0px;
		padding: 5px;
		font-size: 16px;
		background: rgba(248, 248, 248,0.1);
		color: white;
	}
	textarea:focus{
		width: 98.5%;
		height: 80px;
	}
	.comment_controller{
		width: 20%;
		height: 40px;
		background: rgba(248, 248, 248,0.1);
		border-radius: 0 4px 4px 0;
		display: flex;
		align-items: center;
	}
	#emotionIcon{
		transition: all 0.3s;
	}
	#emotionIcon:hover{
		cursor: pointer;
	}
	.comment_controller>.el-button{
		margin-left: 10%;
		width: 50%;
		height: 60%;
		
	}
	.el-button>span{
		font-size: 14px;
		color: #000000;
	}
	.no_comment{
		width: 100%;
		height: 50px;
		background: rgba(248, 248, 248,0.1);
		border-radius: 7px;
		text-align: center;
		line-height: 50px;
		margin-top: 3%;
		
	}
	.no_comment h3{
		color: #b4b4b4;
	}

	.comment_text ul{
		list-style: none;
		margin-top: 3%;
		background: rgba(248, 248, 248,0.1);
		border-radius: 7px;
		padding: 10px 0;
	}
	.comment_text li{
		width: 94%;
		height: auto;
		display: flex;
		justify-content: center;
		margin-bottom: 20px;
		border-bottom: 1px solid #b4b4b4;
		padding-bottom: 15px;
		margin-left: 3%;
	}
	.text{
		width: 92%;
		height: auto;
		word-wrap:break-word;/*全是英文无法自动换行*/
		line-height: 27px;
	}
	.text p:nth-child(1){
		color: #b4b4b4;
		font-size: 14px;
	}
	.text p:nth-child(2){
		margin-top: 7px;
		color: white;
	}
</style>
