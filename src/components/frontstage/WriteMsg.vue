<template>
	<!-- 背景 -->
	<div class="bg">
		<div id="stars"></div>
		<div id="stars2"></div>
		<div id="stars3"></div>
	</div>
	
	
	<div class="msg">
		<h2>嗨！终于等到你，留下你的足迹吧</h2>
		  <el-input
		    v-model="textarea"
		    maxlength="400"
		    placeholder="本站制作些许潦草(可能存在多处bug，新人报道)，请留下你的宝贵意见!"
		    show-word-limit
		    type="textarea"
			resize="none"
			rows="13"
			style="width: 50%;"
		  />
		  <el-button type="primary" plain @click="submit" style="margin-top: 3%;">提交</el-button>
	</div>
</template>

<script setup lang="ts">
	import { ref } from "vue"
	import axios from "axios"
	import { ElMessage } from 'element-plus'
	
	const textarea = ref()
	
	class Msg {
		msg:String;
		constructor(msg:string){
			this.msg = msg;
		}
	}
	
	const submit =()=>{
		const msg = new Msg(textarea.value)
		axios.post("/leaveMsg/submitMsg",msg)
		.then((res)=>{
			
			if(res.data.states == true){
				succes(res.data.msg);
			}
		})
		.catch(()=>{
			
		})
	}
	
	
	const succes = (msg:string) => {
	  ElMessage({
	    message: msg,
	    type: 'success',
	  })
	}
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
	h2{
		color: white;
		margin-bottom: 5%;
	}
	.msg{
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: auto;
		position: absolute;
		top: 10%;
	}

</style>

