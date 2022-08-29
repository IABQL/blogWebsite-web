<template>
  <div class="common-layout">
	  
	  <!-- 侧边帮助栏 -->
	  <el-drawer v-model="drawer" title="I am the title" :with-header="false">
	      <span>帮助!</span>
	  </el-drawer>
	  
	  <!-- 退出登入提示 -->
	  <div>
	  	  <el-dialog v-model="centerDialogVisible" title="提示" width="30%" center>
	  	    <span>您正在执行退出操作！</span>
	  	    <template #footer>
	  	      <span class="dialog-footer">
	  	        <el-button @click="centerDialogVisible = false">取消</el-button>
	  	        <el-button type="primary" @click="login_out">确定</el-button>
	  	      </span>
	  	    </template>
	  	  </el-dialog>
	  </div>
	  
	  
    <el-container>
		
	   <!-- 顶部 -->
      <el-header id="head" style="text-align: right; font-size: 16px">
		 
		  <h2 style="float:left;">
			  <router-link to="/home">UglyDuck </router-link>
		  </h2>
		  <el-avatar id="head_img" :src="headerUrl"/>
		  <a href="#" @click="centerDialogVisible = true">退出登入 | </a>
		  <a href="#" @click="drawer = true"><el-icon><question-filled /></el-icon>帮助</a>
	  </el-header>
	  
      <el-container>
		<!-- 侧边导航 -->
        <el-aside width="200px" style="background-color: rgb(238, 241, 246)">
			 <el-scrollbar height="660px">
			        <el-menu>
					  <router-link to="/admin/usermsg">
						  <el-menu-item index="1">
							  <el-icon><partly-cloudy /></el-icon><strong>账号历史</strong>
						  </el-menu-item>
					  </router-link>
						<!-- el-sub-menu：子菜单，文章 -->
			          <el-sub-menu index="2">
			            <template #title>
			              <el-icon><histogram /></el-icon><strong>内容管理</strong>
			            </template>
			            <!-- el-menu-item：菜单元素 -->
						<router-link to="/admin/myBlogs">
			            <el-menu-item index="2-1"><el-icon><document /></el-icon>我的博客</el-menu-item>
						</router-link>
						
						<router-link to="/admin/makeblog">
							<el-menu-item index="2-2"><el-icon><edit /></el-icon>发表博客</el-menu-item>
						</router-link>
						
						<router-link to="/admin/collection">
						<el-menu-item index="2-3"><el-icon><collection /></el-icon>我的收藏</el-menu-item>
						</router-link>
						
						<router-link to="/admin/draft">
						<el-menu-item index="2-4"><el-icon><delete /></el-icon>草稿箱</el-menu-item>
						</router-link>
						
						<router-link to="">
						<el-menu-item index="2-5"><el-icon><timer /></el-icon>文章审核</el-menu-item>
						</router-link>
						
						<router-link to="/admin/commentManage">
						<el-menu-item index="2-6" @click="clearUreadComment">
							<el-icon><comment /></el-icon>
							评论管理
							<el-badge :value="unreadComment" class="item" :max="99" v-show="unreadComment != 0"></el-badge>
						</el-menu-item>
						</router-link>
						
						<router-link to="/admin/leaveMessage">
			            <el-menu-item index="2-7" @click="clearUreadNotice">
							<el-icon><bell-filled /></el-icon>
							系统通知
							<el-badge :value="unreadNotice" class="item" :max="99" v-show="unreadNotice != 0"></el-badge>
						</el-menu-item>
						</router-link>
			          </el-sub-menu>
					  
					  <!-- 数据 -->
					  <el-sub-menu index="3">
					    <template #title>
					      <el-icon><trend-charts /></el-icon><strong>数据</strong>
					    </template>
					    <el-menu-item index="3-1"><el-icon><document /></el-icon>作品数据</el-menu-item>
						
						<router-link to="/admin/fansData">
					  	<el-menu-item index="3-2"><el-icon><star-filled /></el-icon>粉丝数据</el-menu-item>
						</router-link>
					  </el-sub-menu>

						<!-- 设置 -->
					  <el-sub-menu index="4">
					    <template #title>
					      <el-icon><tools /></el-icon><strong>账号设置</strong>
					    </template>
						
						<router-link to="/admin/personMsg">
						<el-menu-item index="4-1"><el-icon><user-filled /></el-icon>个人信息</el-menu-item>
						</router-link>
						
						<router-link to="/admin/changePassword">
					    <el-menu-item index="4-2"><el-icon><scissor /></el-icon>修改密码</el-menu-item>
						</router-link>
						
					  	<el-menu-item index="4-3"><el-icon><edit /></el-icon>绑定第三方账号</el-menu-item>
					  </el-sub-menu>
					  
			        </el-menu>
			      </el-scrollbar>
		</el-aside>
		
		<!-- 主体内容 -->
        <el-main>
			<router-view></router-view>
		</el-main>
		
      </el-container>
	  
    </el-container>
  </div>
</template>

<script lang="ts" setup>
	import { ref,onMounted } from 'vue'
	import { Storage } from '../../localStore/localStore.js'
	import axios from "axios"
	import {useRouter} from "vue-router"
	import { ElMessage,ElMessageBox } from 'element-plus'
	

	const storage = new Storage();
	const router = useRouter();

	const drawer = ref(false)//侧边帮助栏显示
	
	const centerDialogVisible = ref(false)//退出登入提示显示
	
	const headerUrl = ref('');//头像路径
	
	const unreadNotice = ref(0);
	const unreadComment = ref(0)
	
	
	//清除未读通知
	const clearUreadNotice = ()=>{
		unreadNotice.value = 0;
	}
	
	//清除未读评论
	const clearUreadComment = ()=>{
		unreadComment.value = 0;
	}
	
	//退出登入
	const login_out = ()=>{
		
		axios.get("/loginController/loginOut")
		.then((res)=>{
			if(res.data == true){
				centerDialogVisible.value = false;
				//清理localStore中的数据
				storage.removeItem("user");
				headerUrl.value = null;
				router.push("/home")
			}
		})
		.catch((error)=>{
			console.log(error)
			openError("网络请求超时！")
		})
	}
	
	onMounted(()=>{
		
		if(storage.getItem("user") != false){
			//获取头像
			headerUrl.value = storage.getItem("user").headerUrl;//从本地存储中获取
			
			axios.get("/event/getCountUnread")
			.then((res)=>{
				unreadNotice.value = res.data.unreadEvent;
				unreadComment.value = res.data.unreadComment;
			})
		}
	})
	
	
	const openError = (msg:string)=> {
	  ElMessage({
	    showClose: true,
	    message: msg,
	    type: 'error',
	  })
	}
</script>

<style scoped>
.dialog-footer button:first-child {
	margin-right: 10px;
}
a{
	text-decoration:none
}
#head{
	width:100%;
	height:60px;
	background-color:rgba(0,0,0,0.9);
	line-height:60px;
	color:white
}
#head_img{
	position:relative;
	top:10px;
	left:-15%
}
#head a{
	position:relative;
	left:-10%;
	 text-decoration :none;
	 color:white
}
#head a:hover{
	font-weight:600
}
.el-badge{
	position: relative;
	top: -15px;
	left: 4px;
}


</style>
