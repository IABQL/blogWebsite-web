<template>
	<!-- 加载骨架 -->
	<el-skeleton :rows="5" animated v-show="show" />

<el-scrollbar height="620px" v-show="!show">
  <el-timeline>
	  
	<el-timeline-item :timestamp="timeFormat(item.createTime)" placement="top" v-for="(item,index) in log">
	    <el-card>
	      <h4>{{ item.content }}</h4>
	      <p>{{ item.username }} {{ timeFormat(item.createTime) }}</p>
	    </el-card>
	</el-timeline-item>
	
  </el-timeline>

</el-scrollbar>
</template>

<script setup lang="ts">
	import { ref,onMounted } from "vue"
	import axios from "axios"
	import { ElMessage,ElMessageBox } from 'element-plus'
	
	const show = ref<Boolean>(true)
	const log = ref();
	
	onMounted(()=>{
		axios.get("/UserController/getUserLog")
		.then((res)=>{
			log.value = res.data;
			show.value = false;
		})
		.catch(()=>{
			show.value = false;
			openError("出错啦")
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
	
	const openError = (msg:string)=> {
	  ElMessage({
	    showClose: true,
	    message: msg,
	    type: 'error',
	  })
	}
</script>


<style scoped>
	/*滚动条*/
	.scrollbar-demo-item {
	  display: flex;
	  align-items: center;
	  justify-content: center;
	  height: 50px;
	  margin: 10px;
	  text-align: center;
	  border-radius: 4px;
	  background: var(--el-color-primary-light-9);
	  color: var(--el-color-primary);
	}
	.el-card h4{
		margin-bottom: 10px;
	}
</style>
