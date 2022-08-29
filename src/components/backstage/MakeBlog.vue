<template>
	
	
	<!-- 侧边文章信息设置栏 -->
	<el-drawer v-model="drawer" title="I am the title" :with-header="false" >
	    <span>文章设置</span>
		<el-divider />
		
		<!-- 文章标签 -->
		  <div style="display: inline-block;margin-top:40px">
		    <p>选择标签<span style="color:red">*</span>:</p>
		    <el-select v-model="tag" multiple placeholder="分类 (最多选择3个)" multiple-limit="3" style="width: 300px">
		      <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"/>
		    </el-select>
		  </div>
		  
		  <!-- 博客介绍-->
		  <div id="explain" style="margin-top:40px">
			<p>博客介绍<span style="color:red">*</span>:</p>
		  	<el-input
		      v-model="blogExplain"
		      :rows="5"
		      type="textarea"
		      placeholder="摘要（选填）：会在推荐、列表等场景外露，帮助读者快速了解内容，如不填写则默认抓取正文前256字符"
		    />
		  </div>

		  <!-- 封面上传 -->
		  <div id="cover" style="margin-top:40px">
			<p>博客封面上传:</p>
		  	<el-upload action="http://39.108.250.51:8080/blogWebsite/upLoadCoverImg" list-type="picture-card"
			 name="cover" 
			:auto-upload="true"
			:on-success="upLoadSucces" 
			:on-remove="handleRemove"
			:on-error="upLoadError"
			:on-preview="preview">
		      <el-icon><Plus /></el-icon>
		    </el-upload>
		  </div>
		    
		  <div id="oKButton">
		  	<el-button type="success" @click="release">发布</el-button>
			<el-button @click="drawer = false">取消</el-button>
		  </div>
	</el-drawer>
	
	<div>
		<el-input v-model="title" maxlength="50" placeholder="标题" show-word-limit type="text" style="width: 63%;margin-right: 3%;"/>
		<el-button type="primary" @click="getHtmlContent">发布博客</el-button>
		<el-button type="warning" @click="saveDraft">保存草稿</el-button>
	</div>
	
	<br>
	
	<!--富文本编辑 :theme:设置主题颜色 -->
	<md-editor v-model="text" :theme="theme" @onUploadImg="onUploadImg"/>
	
	<span id="blogId" v-text="$route.params.blogId" v-show="false"/>
</template>

<script setup lang="ts">
	import { ref,onMounted } from "vue"
	import { ElLoading } from 'element-plus'
	import $ from 'jquery' //引入jquery使用
	import axios from "axios"
	import { ElMessage } from 'element-plus'//引用消息提示
	//富文本导包
	import MdEditor from 'md-editor-v3';
	import 'md-editor-v3/lib/style.css';
	//导入store全局仓库
	import { userStore } from "../../store"

	const action = ()=>{
		return "http://localhost:8080/blogWebsite/upLoadCoverImg"
	}
	
	
	/**
	 * 变量、类型定义
	 */
	/* 1--------------------------------------------------------------------------------------- */
	const blogId = ref<Number>(0);//保存为草稿或发布后由服务端返回
	const store = userStore()//创建全局仓库实例，页面中可以这样使用获取数据{{store.userId}}
	
	const text = ref<string>('')//富文本双向绑定
	const theme = ref<string>('white')//富文本主题颜色
	const drawer = ref(false)//侧边栏显示
	const title = ref<string>('')//文章主题
	const tag = ref([])//文章标签
	const blogExplain = ref<string>('')//博客介绍
	let defaultBlogExplain = ''//默认博客介绍,当没有手动设置时，这将会截取博客内容p标签内的文本作为博客介绍
	let htmlContent = ''//文章html内容
	let imgUrl = ''//博客封面访问路径（上传成功后由后台返回得到）
	let imgFilePath = '';//博客封面上传路径
	
	//博客类
	class Blog{
		id:Number;
		title:string;//文章主题
		tag:string[];//文章标签
		blogExplain:string;//博客介绍
		htmlContent:string;//文章html内容
		content:string;//富文本内容
		blogCover:String;//图片上传成功后的路径
		userId:string;//作者id
		states:Number;//1:草稿
		
		constructor(id:Number, title:string, tag:string[], blogExplain:string, htmlContent:string, 
						content:string, imgUrl:String, userId:string, states:Number){
			this.id = id;
			this.title = title;
			this.tag = tag;
			this.blogExplain = blogExplain;
			this.htmlContent = htmlContent;
			this.content = content;
			this.blogCover = imgUrl;
			this.userId = userId;
			this.states = states;
		}
	}
	

	
	//文章标签选项
	const options = [
	  {
	    value: 'Java',
	    label: 'Java',
	  },
	  {
	    value: 'Html',
	    label: 'Html',
	  },
	  {
	    value: 'Python',
	    label: 'Python',
	  },
	  {
	    value: '计算机网络',
	    label: '计算机网络',
	  },
	  {
	    value: 'Linux',
	    label: 'Linux',
	  },
	  {
	    value: 'Springboot',
	    label: 'Springboot',
	  },
	  {
	    value: 'Redis',
	    label: 'Redis',
	  },
	  {
	    value: 'Mysql',
	    label: 'Mysql',
	  },
	  {
	    value: 'Kafka',
	    label: 'Kafka',
	  },
	  {
	    value: 'zookeeper',
	    label: 'zookeeper',
	  },
	  {
	    value: 'nginx',
	    label: 'nginx',
	  },
	  {
	    value: 'docker',
	    label: 'docker',
	  },
	  {
	    value: 'spring',
	    label: 'spring',
	  },
	  {
	    value: 'springcloud',
	    label: 'springcloud',
	  },
	  {
	    value: '多线程',
	    label: '多线程',
	  },
	  {
	    value: '其它',
	    label: '其它',
	  },
	]
	
	/* 1--------------------------------------------------------------------------------------- */
	
	
	
	//获取文本编辑的html文本
	const getHtmlContent = ()=>{
		htmlContent = $("#md-editor-v3-preview-wrapper").html();
		
		//设置博客默认介绍
		defaultBlogExplain = $("#md-editor-v3-preview-wrapper p").text();
		
		//如果字符串长度大于256，截取
		if(defaultBlogExplain.length > 256){
			defaultBlogExplain = defaultBlogExplain.substr(0,256);
		}
		
		
		if(text.value == '' || title.value == ''){
			
			open3('标题或博客内容不能为空');//调用警告消息提示
			
		}else{
			
			drawer.value = true;//显示侧边栏
		}
	}
	
	
	//保存为草稿
	const saveDraft = ()=> {
		
		
		//保存草稿应该保存富文本编辑的文本内容，以便下一次做修改
		
		if(text.value == '' || title.value == ''){
			
			open3('标题或博客内容不能为空');//调用警告消息提示
			
		}else{
			//开启加载动画
			openFullScreen("正在保存！", true)
			
			//封装博客草稿实例对象
			const blog = new Blog(blogId.value, title.value, tag.value, blogExplain.value,
										htmlContent,text.value, imgUrl,store.userId, 1);
			//上传
			axios.post("/upLoadBlog",blog).then((res) => {
				if(res.data != ''){
					if(res.data.states == true){
						blogId.value = res.data.blogId;
						openFullScreen("", false)//关闭加载动画
						open2(res.data.msg)
					}else{
						openFullScreen("", false)
						open4(res.data.msg)//关闭加载动画
					}
					
				}else{
					openFullScreen("", false)
					open4("抱歉！保存失败")//关闭加载动画
				}
				
			})
			.catch((Error) => {
				openFullScreen("", false)//关闭加载动画
				open3('网络请求超时！');
			})
		}
	}
	
	
	
	//发布博客
	const release = ()=> {
		
		//判断是否选择标签
		if(tag.value != '' && (blogExplain.value != '' || defaultBlogExplain.length > 0) ) {
			
			//开启加载动画
			openFullScreen("正在发布！", true)
			
			//当博客介绍为空时，截取博客内容p标签内的文本作为博客介绍
			if(blogExplain.value == ''){
				blogExplain.value = defaultBlogExplain;
			}
			
			//封装blog对象，以便上传数据
			const blog = new Blog(blogId.value, title.value, tag.value, blogExplain.value, 
										htmlContent,text.value, imgUrl,store.userId, 0);
			
			
			//axios请求默认为json，后台接收时可以用@RequestBody，将json中的数据解析到java类中
			axios.post("/upLoadBlog",blog).then((res) => {
				if(res.data != null){
					if(res.data.states == true){
						blogId.value = res.data.blogId;
						openFullScreen("", false)//关闭加载动画
						drawer.value = false;//关闭侧边栏
						open2(res.data.msg)
					}else{
						openFullScreen("", false)//关闭加载动画
						open4(res.data.msg)
					}
					
				}else{
					openFullScreen("", false)//关闭加载动画
					open4("发布失败！请重试")
				}
				
			})
			.catch((Error) => {
				openFullScreen("", false)//关闭加载动画
				open3('网络请求超时！');
			})
			
		}else if(tag.value == ''){
			open3("请至少选择一个标签")
		}else if(defaultBlogExplain.length <= 0){
			open3("请填写博客介绍")
		}
		
	}
	
	
	/**
	 * el-upload
	 */
	/* 2--------------------------------------------------------------------------------------- */
	//点击文件列表中已上传的文件时的钩子
	const preview = (uploadFile: UploadFile) => {
		window.open(imgUrl)//新窗口打开显示图片，imgUrl为上传成功后的路径
	}
	
	//删除图片回调方法
   const handleRemove = (file: UploadFile) => {
	   //axios.post("/deleteUpLoadImg", {imgUrl:imgFilePath}).then((res) => {})
	   axios.get("/deleteUpLoadImg", {params:{imgUrl:imgFilePath}}).then((res) => {})
   }
   
   
   //上传成功时回调
   const upLoadSucces = (response: any, uploadFile: UploadFile, uploadFiles: UploadFiles) => {
	   //后台返回访问路径，图片上传路径
	   imgUrl = response.uploadUrl;
	   imgFilePath = response.filePath;
   }
   
   //文件上传失败时的钩子
   const upLoadError = (error: Error, uploadFile: UploadFile, uploadFiles: UploadFiles) => {
	   open4('上传图片失败');//上传失败
   }
   /* 2--------------------------------------------------------------------------------------- */
   
   
   
   /* 3--------------------------------------------------------------------------------------- */
   //警告消息提示
   const open3 = (msg:string) => {
     ElMessage({
       showClose: true,
       message: msg,
       type: 'warning',
     })
   }
   
   //成功消息提示
   const open2 = (msg:string) => {
     ElMessage({
       showClose: true,
       message: msg,
       type: 'success',
     })
   }

	//错误消息提示
	const open4 = (msg:string) => {
	  ElMessage({
	    showClose: true,
	    message: msg,
	    type: 'error',
	  })
	}
/* 3--------------------------------------------------------------------------------------- */



	/**
	 * 加载动画
	 */
	/* 4--------------------------------------------------------------------------------------- */
	const fullscreenLoading = ref(false)
	
	const openFullScreen = (msg:string, show:boolean) => {
	  const loading = ElLoading.service({
	    lock: true,
	    text: msg,
	    background: 'rgba(0, 0, 0, 0.7)',
	  })
	  if(show == false){
		  loading.close()
	  }
	}
	/* 4--------------------------------------------------------------------------------------- */
	
	
/* 5--------------------------------------------------------------------------------------- */

	/*
		初始化
	*/
	onMounted(() => {
		
			//如果路由中携带参blogId，说明这不是新建一个博客，而是修改博客，向服务端请求数据
			blogId.value = $("#blogId").text();
			if(blogId.value != ''){
				axios.get("/blogHandle/getBlogAllInformation",{ params:{ blogId: blogId.value } })
				.then( (res) => {
					if(res.data.title != null){
						title.value = res.data.title;
					}
					if(res.data.blogExplain != null){
						blogExplain.value = res.data.blogExplain;
					}
					if(res.data.tags != null){
						tag.value = res.data.tags;
					}
					if(res.data.content != null){
						text.value = res.data.content;
					}
					
				})
				.catch( (error) => {
					open3("加载失败！")
				})
			}
		
	})
/* 5--------------------------------------------------------------------------------------- */
</script>


<script lang="ts">
	
	export default{

		mounted(){

			
		},
		methods:{
			//富文本图片上传
			async onUploadImg(files: FileList, callback: (urls: string[]) => void) {
			  const res = await Promise.all(
			    Array.from(files).map((file) => {
			      return new Promise((rev, rej) => {
			        const form = new FormData();
			        form.append('file', file);
			
			        axios.post('/upLoadBlogContentImg', form, {
			            headers: {
			              'Content-Type': 'multipart/form-data'
			            }
			          })
			          .then((res) => rev(res))
			          .catch((error) => rej(error));
			      });
			    })
			  );
			
				//item.data包含了上传的图片路径
			  callback(res.map((item: any) => item.data));
			}
		},
		
		//路由离开前
		beforeRouteLeave(to, from,next){
			if(confirm('确定要离开吗？编写的内容将丢失')){
				next();
			}else{
				next(false);
			}
		}
		
	}
</script>



<style scoped>
	#oKButton{
		margin-top:100px
	}

</style>