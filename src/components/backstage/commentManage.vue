<template>
	<el-empty description="暂时没有任何评论  ≧ ﹏ ≦" v-show="commentList ==''"/>
	<div class="comment_text">
		<ul>
			<li v-for="(item,index) in commentList" :key="index">

				<el-avatar id="head_img" fit="cover" :src="item.headerUrl" />
				<div class="text">
					<p>
						<span>{{ item.username }}</span>
						&nbsp;&nbsp;
						<span v-text="timeFormat(item.createTime)"></span>
						&nbsp;
						<span>评论了文章</span>
						&nbsp;
						<span @click="articlePage(item.blogId)">{{ item.blogTitle }}</span>
						&nbsp;
						<el-badge value="new" class="item" v-if="item.states == 0">
						 </el-badge>
						<el-button type="danger" :icon="Delete" circle @click="deleteComment(item.id,index)"/>
					</p>
					<p>{{ item.content }}</p>
				</div>
			</li>
			
		</ul>
		<!-- 分页 -->
		<el-pagination small background layout="prev, pager, next" v-if="commentList !='' "
		:total="totalData"
		:current-page="currentpage"
		@current-change="handleCurrentPage"
		:page-size="5" class="mt-4"/>
	</div>
</template>

<script setup lang="ts">
	import { ref,onMounted } from "vue"
	import axios from "axios"
	import {useRouter,useRoute} from "vue-router"//useRoute用来获取路由中传递的参数
	import { Delete } from '@element-plus/icons-vue'
	
	
	const router = new useRouter()
	const commentList = ref()
	const totalData = ref()
	const currentpage = ref(1)
	
	
	const handleCurrentPage = (newPage)=>{
		axios.get("/blogHandle/getComments",{params:{currentPage:newPage}})
		.then((res)=>{
			currentpage.value = newPage;
			commentList.value = res.data;
		})
		.catch(()=>{
			
		})
	}
	
	
	//删除comment
	const deleteComment = (id:Number,index:Number)=>{
		axios.get("/blogHandle/deleteComment",{params:{id:id}})
		.then((res)=>{
			if(res.data){
				commentList.value.splice(index,1);
			}
		})
		.catch(()=>{
			
		})
	}
	
	
	//跳转文章详情页
	const articlePage = (blogId)=> {
		router.push("/blogshow/"+blogId);
	}
	onMounted(()=>{
		
		handleCurrentPage(1)
		
		axios.get("/blogHandle/getCountComments")
		.then((res)=>{
			totalData.value = res.data
		})
		.catch(()=>{
			
		})
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
	.comment_text ul{
		list-style: none;
		margin-top: 1%;
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
		border-bottom: 1px dotted #b4b4b4;
		padding-bottom: 15px;
		margin-left: 3%;
	}
	.text{
		width: 92%;
		height: auto;
		word-wrap:break-word;/*全是英文无法自动换行*/
		line-height: 27px;
	}
	.text p:nth-child(1) span:nth-child(2),.text p:nth-child(1) span:nth-child(3){
		color: #b4b4b4;
		font-size: 14px;
	}
	.text p:nth-child(1) span:nth-child(4){
		color: #349edf;
		font-size: 14px;
		cursor: pointer;
	}
	.text p:nth-child(2){
		margin-top: 7px;
	}
	#head_img{
		width: 25px;
		height: 25px;
		margin-right: 1%;
	}
	.el-button{
		float: right;
		display: none;
	}
	.comment_text li:hover .el-button{
		display: block;
	}
</style>
