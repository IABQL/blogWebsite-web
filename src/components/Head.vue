<template>
	<a href="https://github.com/IABQL/blogWebsite" target="_blank" class="github-corner" aria-label="View source on GitHub">
	    <svg width="60" height="60" viewBox="0 0 250 250"
	         style="fill:#151513; color:#fff; position: absolute; top: 0; border: 0; right: 0;" aria-hidden="true">
	        <path d="M0,0 L115,115 L130,115 L142,142 L250,250 L250,0 Z"></path>
	        <path d="M128.3,109.0 C113.8,99.7 119.0,89.6 119.0,89.6 C122.0,82.7 120.5,78.6 120.5,78.6 C119.2,72.0 123.4,76.3 123.4,76.3 C127.3,80.9 125.5,87.3 125.5,87.3 C122.9,97.6 130.6,101.9 134.4,103.2"
	              fill="currentColor" style="transform-origin: 130px 106px;" class="octo-arm"></path>
	        <path d="M115.0,115.0 C114.9,115.1 118.7,116.5 119.8,115.4 L133.7,101.6 C136.9,99.2 139.9,98.4 142.2,98.6 C133.8,88.0 127.5,74.4 143.8,58.0 C148.5,53.4 154.0,51.2 159.7,51.0 C160.3,49.4 163.2,43.6 171.4,40.1 C171.4,40.1 176.1,42.5 178.8,56.2 C183.1,58.6 187.2,61.8 190.9,65.4 C194.5,69.0 197.7,73.2 200.1,77.6 C213.8,80.2 216.3,84.9 216.3,84.9 C212.7,93.1 206.9,96.0 205.4,96.6 C205.1,102.4 203.0,107.8 198.3,112.5 C181.9,128.9 168.3,122.5 157.7,114.1 C157.9,116.9 156.7,120.9 152.7,124.9 L141.0,136.5 C139.8,137.7 141.6,141.9 141.8,141.8 Z"
	              fill="currentColor" class="octo-body"></path>
	    </svg>
	</a>
	<!-- 头部组件 -->
	<div class="common-layout">
	    <el-container id="head">
	      <el-header>
			  <router-link to="/home">
				  <div id="logo">
					 UglyDuck
				  </div>
			  </router-link>
			  
			  <el-input v-model="search" class="w-50 m-2 search" placeholder="你有什么想搜索的吗" 
			  :suffix-icon="Search"
			  @keyup.enter="searchByKey(1)"
			  />
			  
			  <span v-if="headerUrl != ''" id="person">
				
				  <router-link to="/admin">
					  <el-avatar id="head_img" fit="cover" :src="headerUrl" />
				  </router-link>
				  
				  <el-badge :value="unreadCount" class="item" :max="99" v-show="unreadCount>0"></el-badge>
				  
				  <el-dropdown id="login_out">
				      <span class="el-dropdown-link">
				        {{ username }}
				        <el-icon class="el-icon--right">
				          <arrow-down />
				        </el-icon>
				      </span>
				      <template #dropdown>
				        <el-dropdown-menu>
				          <el-dropdown-item @click="login_out">退出登入</el-dropdown-item>
				        </el-dropdown-menu>
				      </template>
				  </el-dropdown>
					
			  </span>
			  <span id="login" v-if="headerUrl == ''">
				  <router-link to="/loginRegist" style="text-decoration: none;">登入</router-link>
			  </span>
		  </el-header>
	    </el-container>
	  </div>
</template>

<script setup lang="ts">
	import { ref,onMounted } from "vue"
	import {useRouter,useRoute} from "vue-router"//useRoute用来获取路由中传递的参数
	import { userStore } from "../store"
	import axios from "axios"
	import { ElMessage,ElMessageBox } from 'element-plus'
	import { ArrowDown } from '@element-plus/icons-vue'
	import { Search } from '@element-plus/icons-vue'
	import { Storage } from '../localStore/localStore.js'
	
	const store = userStore();
	const router = useRouter();
	const route = useRoute();
	const headerUrl = ref('');//头像路径
	const username = ref();
	const search = ref('')//搜索内容
	const storage = new Storage();
	const unreadCount = ref(0)//未读消息数
	const show_unreadCount = ref(false)
	
	//向父组件传递值
	//自定义事件tramit
	const emit = defineEmits(['tramit'])
	
	const keyToTop = ()=> {
		//在父组件当中调用自定义事件tramit，传递数据nums
		emit('tramit',search);
	}
	
	
	
	//搜索
	const searchByKey = (page)=>{
		keyToTop();//向父组件传值
		router.push("/searchResult/"+search.value)
	}
	
	//退出登入
	const login_out = ()=>{
		
		axios.get("/loginController/loginOut")
		.then((res)=>{
			if(res.data == true){
				//清理localStore中的数据
				storage.removeItem("user");
				headerUrl.value = '';
			}
		})
		.catch((error)=>{
			
			openError("网络请求超时！")
		})
	}
	
	
	//初始化
	onMounted(()=>{

		if(storage.getItem("user") != false){
			
			//获取头像
			headerUrl.value = storage.getItem("user").headerUrl;//从本地存储中获取
			//获取username
			username.value = storage.getItem("user").userName;
			
			axios.get("/event/getCountUnread")
			.then((res)=>{
				unreadCount.value = res.data.unreadEvent+res.data.unreadComment;
				
				if(unreadCount.value > 0){
					show_unreadCount.value = true;
				}else{
					show_unreadCount.value = false;
				}
				
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
	#head{
		width:100%;
		height:60px;
		background-color:#242429;
		line-height:60px;
		color:white
	}
	#head_img{
		position:relative;
		top:10px;
		left:55%
	}
	
	.search{
		width: 20%;
		position:relative;
		left:45%;
		top:-5px;
	}
	
	.el-badge{
		position: relative;
		left: 54%;
		top: -30%;
	}
	
	#login{
		
		font-weight: 600;
		position:relative;
		left:55%;
	}
	#login a{
		color: white;
	}
	#login:hover{
		cursor: pointer;
	}

	#person:hover .el-dropdown{
		cursor: pointer;
	}
	#logo{
		float:left;
		width: 10%;
		height: 60px;
		color: white;
		font-size: 20px;
		font-weight: 800px;
	}
	
	.example-showcase .el-dropdown-link {
	  cursor: pointer;
	  color: var(--el-color-primary);
	  display: flex;
	  align-items: center;
	}
	
	.el-dropdown{
		position: absolute;
		left: 87.5%;
		top: 1.5%;
		text-align: center;
		line-height: 40px;
		list-style: none;
		border-radius:5px 5px 0 0 ;
		text-decoration: none;
		color: white;
	}
	
	/*gitHub样式*/
	body .github-corner>svg{
		color: green;
	}
	.github-corner:hover .octo-arm {
		animation: octocat-wave 560ms ease-in-out
	}
				
	@keyframes octocat-wave {
		0%, 100% {
		transform: rotate(0)
		}
		20%, 60% {
		transform: rotate(-25deg)
		}
		40%, 80% {
			ransform: rotate(10deg)
			}
		}
				
	@media (max-width: 500px) {
			.github-corner:hover .octo-arm {
				 animation: none
			}
				
			.github-corner .octo-arm {
				animation: octocat-wave 560ms ease-in-out
				}
	}
</style>
