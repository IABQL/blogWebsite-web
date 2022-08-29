<template>
	<div v-html="content"></div>
</template>

<script setup lang="ts">
	import { ref } from "vue"
	
	//定义和父组件中同名的属性，接收参数
	defineProps<{
		content:string,
	}>()
</script>

<style scoped>
</style>
