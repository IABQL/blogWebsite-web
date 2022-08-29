<template>
	<Head @tramit="getData"></Head>
	
	<div id="bg"></div>
	
	<div id="container">
		<!-- 无搜索结果 -->
		<div id="nothing" v-show="total == 0">
			<img src="../../assets/img/nothing.png"/>
			<h2>抱歉！没有搜索到任何数据，试试搜索其它内容吧</h2>
		</div>
		
		<!-- 搜索结果显示 -->
		<div class="all_blogs" v-show="total != 0">
			<p>搜索到以下结果</p>
			<div class="slide_line"></div>
			 <el-divider />
			 
			 <div class="list-container">
				 <div class="list-item" v-for="(item,index) in blog" :key="item.id" @click="articlePage(item.id)">
					 <div class="title">
						 <h3 v-html="item.title"></h3>
						 <el-tag type="danger" class="mx-1" effect="dark" size="small" v-if="item.type==1">置顶</el-tag>
					 </div>
					 
					 <div class="item-text">
						 <div class="item-left" :style="(item.blogCover != null && item.blogCover != '') ? 'width: 82%;' : 'width: 100%;'">
							 <div class="row" v-html="item.blogExplain">
								
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
						<div class="item-right" v-show="item.blogCover != null && item.blogCover != ''">
							<img :src="item.blogCover" alt="" style="width: 160px;height: 100px;">
						</div>
					 </div>
					  <el-divider />
				 </div>
			 </div>
			 
			<!-- 分页 -->
			<el-pagination small background layout="prev, pager, next"
			:total="total"
			:current-page="currentpage"
			@current-change="handleCurrentPage"
			:page-size="7" class="mt-4"/>
		</div>
	</div>
</template>

<script setup lang="ts">
	import { ref,onMounted } from "vue"
	import Head from "../Head.vue"
	import {useRouter,useRoute} from "vue-router"//useRoute用来获取路由中传递的参数
	import axios from "axios"
	
	const router = useRouter();
	const route = useRoute();
	const currentpage =ref(1)
	const searchKey = ref()
	const blog = ref<Array>()
	const total = ref()
	
	
	
	//接收子组件传递的值
	const getData = (data:String) => {
		searchKey.value = data.value;
		getBlogByKey(data.value,1)
	}
	
	//根据关键搜索数据
	const getBlogByKey = (key:String,page:Number)=>{
		axios.get("/FrontBlogHandle/getBlogByKey",{params:{key:key,currentPage:page}})
		.then((res)=>{
			total.value = res.data.total;
			blog.value = res.data.blogList;
		})
	}
	
	
	const handleCurrentPage = (newPage)=> {
		
		currentpage.value = newPage;

		getBlogByKey(searchKey.value,newPage);
	}
	
	
	//跳转文章详情页
	const articlePage = (blogId)=> {
		router.push("/blogshow/"+blogId);
	}
	
	onMounted(()=>{
		getBlogByKey(route.params.key,1)
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
</script>

<style scoped>
	#container{
		display: flex;
		justify-content: center;
		align-items: center;
	}
	#bg{
		width: 100%;
		height: 100vh;
		position: fixed;
		background-color: #f2f2f2;
		z-index: -1;
	}
	.all_blogs{
		margin-top: 2%;
		width: 70%;
		height: auto;
		background-color: white;
		padding: 15px 15px;
		box-shadow: 0 1px 3px rgb(26 26 26 / 20%);
	}
	em{
		color: red;
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
	.title{
		display: flex;
		align-items: center;
	}
	.title .el-tag{
		margin-left: 1%;
	}
	#nothing{
		width: 60%;
		height: auto;
		display: flex;
		flex-direction: column;
		align-items: center;
		color: black;
		font-family: "仿宋";
		font-size: 15px;
	}
	#nothing>img{
		width: 50%;
		height: 50%;
	}
</style>
