<template>
<div id="error">
	<div class="container">
		<h2>糟糕! 页面出逃了.</h2>
		<h1>404</h1>
		<p>We can't find the page you're looking for.</p>
		<router-link to="/home">返回主页</router-link>
	</div>
</div>

</template>

<script setup lang="ts">
	import { ref } from "vue"
</script>

<style scoped>
	#error{
	    margin: 0;
	    padding: 0;
	    font-family: "montserrat",sans-serif;
	    min-height: 100vh;
	    background-image: linear-gradient(125deg,#6a89cc,#b8e994);
	}
	.container{
	    width: 100%;
	    position: absolute;
	    top: 50%;
	    transform: translateY(-50%);
	    text-align: center;
	    color: #343434
	}
	.container h1{
	    font-size: 160px;
	    margin: 0;
	    font-weight: 900;
	    letter-spacing: 20px;
	    background: url(../assets/img/background_oeuhe7.jpg) center no-repeat;
	    -webkit-text-fill-color: transparent;
	    -webkit-background-clip: text;
	}
	.container a{
	    text-decoration: none;
	    background: #e55039aa;
	    color: #fff;
	    padding: 12px 24px;
	    display: inline-block;
	    border-radius: 25px;
	    font-size: 14px;
	    text-transform: uppercase;
	    transition: 0.4s;
		margin-top: 40px;
	}
	.container a:hover{
	    background: #e55039;
	}
</style>
