<script setup lang="ts">
	localStorage.setItem("default_username","游客")
	localStorage.setItem("default_header","http://blogs-community.oss-cn-beijing.aliyuncs.com/user-header/b2b46797349a4466887783030f0d8392.png?Expires=1651502755&OSSAccessKeyId=LTAI5tLJDTEmVekc3Rq7UXzJ&Signature=733gAXL932RhwZZgWvPyGYrdjPY%3D")
</script>

<template>
  <router-view></router-view>
</template>

<style >
#md-editor-v3{
	/* 富文本高度 */
	height:565px;
}
.el-avatar>img {
	width: 100%;
	height: 100%;
}

</style>
