user<template>
	<div style="margin-bottom: 30px;">
		<h2>基本信息</h2>
	</div>
	
	<!-- 加载骨架 -->
	<el-skeleton :rows="5" animated v-if="show" />
	
	<div id="" v-if="!show">
		<!-- 头像 -->
		<el-avatar class="header" shape="square" :size="100" fit="cover" :src="headerUrl" /> 
		
		<!-- 头像修改 -->
		<el-upload
		    class="avatar-uploader"
		    action="http://39.108.250.51:8080/blogWebsite/UserController/upLoadUserHeaderImg"
			with-credentials="true"
		    :show-file-list="false"
		    :on-success="handleAvatarSuccess"
		    :before-upload="beforeAvatarUpload"
		  >
		    <img v-if="imageUrl" :src="imageUrl" class="avatar" />
		    <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
		</el-upload>
		  
		
		  
		<el-table :data="tableData" stripe style="width: 100%">
		   <el-table-column prop="name" label="" width="180" />
		   <el-table-column prop="msg" label="" />
		</el-table>
	</div>
	
</template>

<script setup lang="ts">
	import { Storage } from '../../localStore/localStore.js'
	import {ref,onMounted} from "vue"
	import { Plus } from '@element-plus/icons-vue'
	import type { UploadProps } from 'element-plus'
	import axios from "axios"
	
	
	const storage = new Storage();
	const headerUrl = ref('');//头像路径
	const show = ref(true)
	
	const imageUrl = ref('')
	

	//修改头像
	const handleAvatarSuccess: UploadProps['onSuccess'] = (
	  response,
	  uploadFile
	) => {
	  
	  const user = JSON.parse(localStorage.getItem("user"));
	  storage.setItem({name:"user", value:{"headerUrl":response,"userName":storage.getItem("user").userName}, 
							expires:user.expires, startTime:user.startTime})
							
	  headerUrl.value = response;
	}
	
	
	const beforeAvatarUpload = ()=>{}
	
	onMounted(()=>{
		
		if(storage.getItem("user") != false){
			//获取头像
			headerUrl.value = storage.getItem("user").headerUrl;//从本地存储中获取
		}
		
		setTimeout(function(){show.value = false;},2000)
		
	})
	
	
	const tableData = [
	  {
	    name: '昵称',
	    msg: storage.getItem("user").userName,
	  },
	  {
	    name: '性别',
	    msg: '男',
	  },
	  {
	    name: '个人简介',
	    msg: 'No. 189, Grove St, Los Angeles',
	  },
	  {
	    name: '教育背景',
	    msg: '北京大学',
	  },
	]
</script>


<style scoped>
.avatar-uploader .avatar {
  width: 100px;
  height: 100px;
  display: block;
}
.avatar-uploader{
	position: absolute;
	top: 142px;
	left: 218px;
	display: none;
}

.header:hover+ .avatar-uploader{
	display: block;
}
</style>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 100px;
  height: 100px;
  text-align: center;
}
</style>