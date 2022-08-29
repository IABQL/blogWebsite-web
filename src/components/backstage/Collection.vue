<template>
	<!-- 加载骨架 -->
	<el-skeleton :rows="5" animated v-if="show" />
	
	<el-empty description="空空如也!" v-if="!show"/>
</template>



<script>
	export default {
		data(){
			return {
				show:true
			}
		},
		mounted() {
			//加载数据，模拟
			const that = this
			setTimeout(function(){that.show = false;},2000)
		},
		methods:{
			
		}
	}
</script>

<style scoped>
</style>
