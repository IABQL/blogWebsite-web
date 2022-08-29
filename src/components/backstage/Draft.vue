<template>
	<!-- 加载骨架 -->
	<el-skeleton :rows="5" animated v-if="show" />
	
	<el-empty description="报告客官,这里很干净!" v-if="blogData.length == 0 && !show"/>
	
  <el-scrollbar height="600px" v-if="blogData.length != 0">
	  <ul>
	  	<li class="scrollbar-demo-item" v-for="(item,index) in blogData" :key="item.id">
			<div class="left">
				<div class="title">
					{{ item.title }}
				</div>
				<div class="exception">
					<el-tag class="ml-2" type="info" size="small">草稿</el-tag>
				</div>
			</div>
			<div class="right">
				<p class="time">{{timeFormat(item.createTime)}}</p>
				<div class="operation">
					<el-button type="primary" :icon="Edit" size="small" @click="editBlog(item.id)"/>
					<el-button type="danger" :icon="Delete" size="small" @click="delDraft(item.id,index)"/>
				</div>
				
			</div>
		</li>
	  </ul>
    </el-scrollbar>
</template>

<script setup lang="ts">
	import { ref,onMounted } from "vue"
	import 'md-editor-v3/lib/style.css';
	import { userStore } from "../../store"
	import axios from "axios"
	import { ElMessage,ElMessageBox } from 'element-plus'
	import {Check,Delete,Edit,Message,Search,Star,} from '@element-plus/icons-vue'
	import {useRouter} from "vue-router"
	
	const router = useRouter();
	const store = userStore();
	const show = ref(true)
	const blogData = ref([])//blog数据

	
	
	
	
	/*
	编辑博客
	*/
	const editBlog = (blogId)=> {
		//跳转到创建博客页面，加上参数blogId
		router.push({name:"makeblog", params:{blogId:blogId}})
	}
	
	
	
	
	//删除blog
	const delDraft = (blogId:Number,index:Number)=> {
		waringTips(blogId,index);
	}
	
	/*
		删除blog信息弹窗即删除操作
	*/
	function waringTips(blogId,index) {
		 ElMessageBox.confirm(
		'您确定要删除我？创作不易，让我再陪陪你吧，有些人一旦错过就不在！',
		 '三思而行',
		 {
			confirmButtonText: '确认',
			cancelButtonText: '取消',
			 type: 'warning',
			}
		)
		.then(() => {

			axios.get(
			"/blogHandle/deleteBlog",
			{ params: { blogId:blogId } })
			.then( (res) => {
				if(res.data == false){
					openError("服务器罢工了....，修改失败！")
				}else{
					blogData.value.splice(index,1);
					//删除成功提示
					ElMessage({
					type: 'success',
					message: '删除成功',
					   })
					}
				})
			.catch( (error) => {
				console.log(index)
				openError("网络出小差了....，修改失败！")
			   })
					
			})
			.catch(() => {
					
			    ElMessage({
			    type: 'info',
			    message: '已取消删除',
			    })
				  
			})
				
	}
	
	
	onMounted(()=>{
		axios.get("/blogHandle/getDraftBlog",{params:{userId:store.userId}})
		.then((res)=>{
			blogData.value = res.data;
			
			show.value = false;
		})
		.catch((error)=>{
			openError("网络出小差了.....")
			show.value = false;
		})
	})
	
	
	function timeFormat(data) {
	  var date = new Date(data)
	  var Y = date.getFullYear() + '-'
	  var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
	  var D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' '
	  var h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':'
	  var m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':'
	  var s = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds())
	  return Y + M + D + h + m + s
	}
	
	const openError = (msg:string)=> {
	  ElMessage({
	    showClose: true,
	    message: msg,
	    type: 'error',
	  })
	}
</script>


<style scoped>
.scrollbar-demo-item {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100px;
  margin: 10px;
  border-radius: 4px;
  background: var(--el-color-primary-light-9);
  color: var(--el-color-primary);
}
.left{
	width: 80%;
	height: 100%;
	padding-left: 20px;
	padding-top: 10px;
}
.right{
	width: 20%;
	height: 100%;
	padding-top: 10px;
}
.time{
	width: 70%;
	position: relative;
	left: 20%;
	color: #999999;
}
.operation{
	margin-top: 17%;
}

.operation{
	position: relative;
	width: 60%;
	left: 40%;
} 

.exception{
	height: 55%;
}
.title{
	overflow: hidden;
	height: 45%;
	color: #000000;
}

</style>
