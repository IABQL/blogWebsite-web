<template>
	<!-- 加载骨架 -->
	<el-skeleton :rows="5" animated v-if="show" />
	
	<el-empty description="暂时没有任何通知  ≧ ﹏ ≦" v-if="data == '' && !show"/>
	<div style="width: 100%;height: auto;" v-if="data != '' && !show">
		<i class="fa fa-trash-o" aria-hidden="true" @click="clear">
			<span style="font-size: 13px;">清空</span>
		</i>
		
		  <ul v-infinite-scroll="load" class="infinite-list" style="overflow: auto">
		    <li v-for="(item,index) in data" :key="index" class="infinite-list-item">
				<div class="notice_type">
					<img src="../../assets/img/系统通知.png" />
					 
					<h3>{{ item.type }}</h3>
					 <el-badge is-dot class="item" v-if="item.states == 0">
					 </el-badge>
				</div>
				<div class="notice_content">
					<span>未知用户</span>{{ item.content }}
				</div>
				
			</li>
		  </ul>
	</div>
</template>

<script setup lang="ts">
	import { ref,onMounted } from "vue"
	import axios from "axios"
	
	const show = ref(true)
	const data = ref()
	
	const load = () => {
	  
	}
	
	const clear = ()=>{
		axios.get("/event/clearEvent")
		.then((res)=>{
			data.value = '';
		})
	}
	
	onMounted(()=>{
		axios.get("/event/getEvent")
		.then((res)=>{
			data.value = res.data;
			show.value = false;
		})
		
	})
</script>


<style scoped>
	.infinite-list {
	  height: 500px;
	  padding: 0;
	  margin: 0;
	  list-style: none;
	}
	.infinite-list {
	  width: 100%;
	  height: 600px;
	  margin: 10px;
	  color: var(--el-color-primary);
	}
	.infinite-list .infinite-list-item + .list-item {
	  margin-top: 10px;
	}
	 .infinite-list-item{
		 width:80%;
		 height: auto;
		 padding: 20px 20px;
		 border-radius: 10px;
		 margin-top: 10px;
		 background: var(--el-color-primary-light-9);
	 }
	 .notice_type{
		 width: 100%;
		 height: auto;
		 display: flex;
		 align-items: center;
		 color: #000000;
	 }
	 .notice_type>img{
		 margin-right: 20px;
	 }
	 .notice_content{
		 width: 90%;
		 height: auto;
		 margin-top: 10px;
		 margin-left: 7%;
		 color: #000000;
	 }
	 .notice_content>span{
		 color: blue;
	 }
	 .a-trash-o{
		 font-size: 17px;
	 }
	 .fa-trash-o:hover{
		 color: red;
		 cursor: pointer;
	 }
</style>
