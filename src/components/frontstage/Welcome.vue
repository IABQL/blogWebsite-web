<template>
		<main>
			<!-- 背景 -->
			<div class="bg">
				<div id="stars"></div>
			<div id="stars2"></div>
			<div id="stars3"></div>
			</div>
	        <div id="ui-example-container" class="ui-example-container">
	
	            <div class="ui-example-container__example">
	                <span>Hello!</span>
					&nbsp;
					<span>Welcome</span>
					&nbsp;
					<span>To</span>
					&nbsp;
					<span>UglyDuck</span>
					&nbsp;
					<span>Blog！</span>
					<span>👋</span>
	            </div>
				<div id="into">
					<router-link to="/home">
						<el-button type="primary" round size="large">进入主页</el-button>
					</router-link>
					
				</div>
				
	        </div>
	    </main>
</template>

<script setup lang="ts">
	import { ref,onMounted } from "vue"
	import $ from "jquery"
	
	onMounted(()=>{
		setTimeout(function(){
			$(".ui-example-container__example span:nth-child(1)").css("opacity","1")
		},600)
		setTimeout(function(){
			$(".ui-example-container__example span:nth-child(2)").css("opacity","1")
		},1200)
		setTimeout(function(){
			$(".ui-example-container__example span:nth-child(3)").css("opacity","1")
		},1800)
		setTimeout(function(){
			$(".ui-example-container__example span:nth-child(4)").css("opacity","1")
		},2400)
		setTimeout(function(){
			$(".ui-example-container__example span:nth-child(5)").css("opacity","1")
		},3000)
		setTimeout(function(){
			$(".ui-example-container__example span:nth-child(6)").css("opacity","1")
		},3600)
	})
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
	#into{
		position: fixed;
		top: 67%;
		width: 100%;
	}
	#into a{
		text-decoration: none;
	}
	.el-button{
		position: relative;
		left: 50%;
		width: 10%;
		transform: translateX(-50%);
		font-weight: 600;
	}
	#ui-example-container{
		width: 100%;
		height: 100vh;
	}
	.ui-example-container__example{
		color: #E8E8E8;
		font-size: 30px;
		font-family: 'Josefin Sans', Helvetica, Arial, sans-serif;
		text-align: center;
		line-height: 100vh;
	}
	.ui-example-container__example span{
		opacity: 0;
	}
	.ui-example-container__example span:nth-child(1){
		position: relative;
		animation:myfirst 0.6s;
	}
	.ui-example-container__example span:nth-child(2){
		position: relative;
		animation:myfirst 0.6s 0.6s;
	}
	.ui-example-container__example span:nth-child(3){
		position: relative;
		animation:myfirst 0.6s 1.2s;
	}
	.ui-example-container__example span:nth-child(4){
		position: relative;
		animation:myfirst 0.6s 1.8s;
	}
	.ui-example-container__example span:nth-child(5){
		position: relative;
		animation:myfirst 0.6s 2.4s;
	}
	.ui-example-container__example span:nth-child(6){
		position: relative;
		animation:myfirst 0.6s 3s;
	}
	@keyframes myfirst
	{
	    0%   { top:-40px;opacity: 0;}
	    100% { top:0px;opacity: 1;}
	}
</style>
