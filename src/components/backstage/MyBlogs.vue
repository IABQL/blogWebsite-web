<template>
	
	<!-- 头部 -->
	<div id="select">
	
		<!-- 标签选择分类 -->
		<el-select v-model="tagValue" class="m-2 tag" placeholder="全部" size="small" style="width: 90px;">
		    <el-option
		      v-for="item in tagOptions"
		      :key="item.value"
		      :label="item.label"
		      :value="item.value"
			  @click="searchByTag(item.value,1)"
		    />
		</el-select>
		
		<!-- 时间选择分类——年 -->
		<el-select v-model="timeYearValue" class="m-2 year" placeholder="年" size="small">
		    <el-option
		      v-for="item in yearOptions"
		      :key="item.value"
		      :label="item.label"
		      :value="item.value"
			  @click="searchByTime(1)"
		    />
		</el-select>
		
		<!-- 时间选择分类——月 -->
		<el-select v-model="timeMonthValue" class="m-2 month" placeholder="月" size="small">
		    <el-option
		      v-for="item in monthOptions"
		      :key="item.value"
		      :label="item.label"
		      :value="item.value"
			  @click="searchByTime(1)"
		    />
		</el-select>
		
		<!-- 搜索框 -->
		<el-input
		    v-model="searchKey"
		    class="w-50 m-2 search"
		    placeholder="请输入关键词"
		    :suffix-icon="Search"
			@keyup.enter="searchByKey(1)"
		/>
		
	</div>
	<el-divider />
	
	<!-- 加载动画 -->
	<el-skeleton :rows="5" animated v-if="show" />
	
	<!-- 数据为空时显示 -->
	<el-empty description="这人很懒,什么也没留下!" v-if="blogDatas.length==0  && !show"/>
	
	<!-- 数据展示 -->
	<div id="showData" v-if="blogDatas.length!=0  && !show">
		
		<!-- 数据 -->

		<div id="data">
			  <table border="0" width="100%" height="auto" cellspacing="0"
					style="text-align: center; white-space: nowrap;">
				  <thead>
					<td style="font-size: 14px;"><input type="checkbox" :checked="isAllCheck" @click="selectAll"/>全选</td>
				  	<td><strong>标题</strong></td>
				  	<td><strong>创建时间</strong></td>
				  	<td><strong>分类</strong></td>
				  	<td><strong>置顶</strong></td>
				  	<td><strong>操作</strong></td>
				  </thead>
				  
				  <tr style="height: 50px;" v-for="(item,index) in blogDatas" :key="this.blogDatas[index].id">
					<td style="width: 3%;"><input type="checkbox" :checked="item.isCheck"/></td>
				  	<td style="width: 37%;">{{ item.title.substr(0,30) }}</td>
				  	<td style="width: 20%;" v-text="timeFormat(item.createTime)"></td>
				  	<td style="width: 20%;">
						<el-button type="success" round size="small" v-for="tag in item.tags">{{ tag }}</el-button>
					</td>
				  	<td style="width: 5%;">
						<el-switch v-model="blogType[index]" @click="changeType(index)"/>
					</td>
				  	<td style="width: 15%;">
						<el-button type="primary" size="small" @click="editBlog(index)">编辑</el-button>
						<el-button type="danger" size="small" class="del" @click="deleteBlog(index)">删除</el-button>
					</td>
				  </tr>
				  
			  </table>
		</div>

			<!-- 分页 -->
		  <el-pagination
		    small
		    background
		    layout="prev, pager, next"
		    :total="totalData"
			:current-page="currentpage"
			@current-change="handleCurrentPage"
			page-size="9"
		    class="mt-4"
		  />
	</div>
	
</template>

<!-- <script setup lang="ts">
	import { ref } from "vue"
	import { Search } from '@element-plus/icons-vue'
	import { Timer } from '@element-plus/icons-vue'
	import {onMounted} from 'vue'
	
	
	//标签选项
	const tagOptions = [
      {
		value: '全部',
		label: '全部',
	  },
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
	]

	//年份选项
	const yearOptions = [
		{
			value: '2021',
			label: '2021',
		},
		{
			value: '2022',
			label: '2022',
		},
	]
	
	//月份选项
	const monthOptions = [
		{
			value: '1',
			label: '1',
		},
		{
			value: '2',
			label: '2',
		},
		{
			value: '3',
			label: '3',
		},
		{
			value: '4',
			label: '4',
		},
		{
			value: '5',
			label: '5',
		},
		{
			value: '6',
			label: '6',
		},
		{
			value: '7',
			label: '7',
		},
		{
			value: '8',
			label: '8',
		},
		{
			value: '9',
			label: '9',
		},
		{
			value: '10',
			label: '10',
		},
		{
			value: '11',
			label: '11',
		},
		{
			value: '12',
			label: '12',
		},
	]


</script> -->


<script>
	import { userStore } from "../../store"
	import axios from "axios"
	import { ElMessage,ElMessageBox } from 'element-plus'//引用消息提示
	import { Search } from '@element-plus/icons-vue'
	import { Timer } from '@element-plus/icons-vue'
	
	export default {
		data(){
			return {
				show:true,
				blogDatas:[],
				blogType:[],
				isAllCheck:false,
				totalData: 0,//blog总数目
				currentpage:1,
				tagValue:'',//标签
				timeYearValue:'',//年
				timeMonthValue:'',//月
				searchKey:'',//搜索关键字
				monthOptions:[
								{
									value: '1',
									label: '1',
								},
								{
									value: '2',
									label: '2',
								},
								{
									value: '3',
									label: '3',
								},
								{
									value: '4',
									label: '4',
								},
								{
									value: '5',
									label: '5',
								},
								{
									value: '6',
									label: '6',
								},
								{
									value: '7',
									label: '7',
								},
								{
									value: '8',
									label: '8',
								},
								{
									value: '9',
									label: '9',
								},
								{
									value: '10',
									label: '10',
								},
								{
									value: '11',
									label: '11',
								},
								{
									value: '12',
									label: '12',
								},
							],
				yearOptions:[
								{
									value: '2021',
									label: '2021',
								},
								{
									value: '2022',
									label: '2022',
								},
							],
				tagOptions:[
							  {
								value: '全部',
								label: '全部',
							  },
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
							    value: '多线程',
							    label: '多线程',
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
								value: '其它',
								label: '其它',
							  },
							],
							
			}
		},
		mounted() {
			
			this.searchAllBlog();
			
		},
		methods:{
			
			//根据关键字搜索
			searchByKey(currentPage){
				this.currentpage = currentPage;
				const that = this;
				const store = userStore()
				axios.get("/blogHandle/searchBlogByKey",{params:{userId:store.userId, page: currentPage,key:this.searchKey}})
				.then((res)=>{
					that.tagValue = '';
					that.timeYearValue = '';
					that.timeMonthValue = '';
					that.blogDatas = res.data;
					for(let i=0; i<that.blogDatas.length; i++){
						
						//添加置顶按钮状态
						if(that.blogDatas[i].type == "1"){
							that.blogType.push(true);
						}else{
							that.blogType.push(false);
						}
					}
				})
				.catch((error)=>{
					that.openError("网络出小差了.....")
				})
				
				//获取该用户已发表blog条目总数
				axios.get("/blogHandle/getBlogTotalDataByKey",{params:{userId:store.userId, key:this.searchKey}})
				.then((res)=>{
					that.totalData = res.data;
				})
				.catch( (error) => {
					
				})
			},
			
			
			//搜索全部
			searchAllBlog(newPage){
				this.searchKey = '';
				const store = userStore()
				const that = this;
				//加载数据
				if(newPage == 0){
					newPage = 1;
				}
				axios.get("/blogHandle/getMyBlog",{params:{userId:store.userId, states:0, page: newPage}})
				.then((res)=>{
					
					that.blogDatas = res.data;
					that.blogType = [];
					for(let i=0; i<that.blogDatas.length; i++){
						
						//添加置顶按钮状态
						if(that.blogDatas[i].type == "1"){
							that.blogType.push(true);
						}else{
							that.blogType.push(false);
						}
					}
					that.show = false;
					
				})
				.catch( (error) => {
					that.openError("网络出小差了.....")
					that.show = false;
				})
				
				//获取该用户已发表blog条目总数
				axios.get("/blogHandle/getBlogTotalData",{params:{userId:store.userId, states:0}})
				.then((res)=>{
					that.totalData = res.data;
				})
				.catch( (error) => {
					
				})
			},
			
			
			//监听当前页数变化，向后台请求数据
			handleCurrentPage(newPage) {
				
				this.currentpage = newPage;
				const store = userStore()
				const that = this;
				if(this.searchKey == ''){
					if(this.timeYearValue =='' && this.timeMonthValue ==''){
						if(this.tagValue == "全部" || this.tagValue == ''){
							this.searchAllBlog(newPage);
						}else{
							this.searchByTag(this.tagValue,newPage);
						}
					}else if(this.timeYearValue >0 && this.timeMonthValue >0){
						this.searchByTime(newPage);
					}
				}
				else if(this.searchKey != ''){
					this.searchByKey(newPage);
				}	
			},
			
			
			//根据时间搜索
			searchByTime(currentPage){
				this.searchKey = '';
				if(this.timeYearValue >0 && this.timeMonthValue >0 && (this.tagValue == "全部" || this.tagValue == '')){
					
					const store = userStore()
					const that = this;
					//加载数据
					if(currentPage == 0){
						currentPage = 1;
					}
					axios.get("/blogHandle/getMyBlog",
					{params:{userId:store.userId, states:0, page: currentPage,year:this.timeYearValue,month:this.timeMonthValue}})
					.then((res)=>{
						
						that.blogDatas = res.data;
						for(let i=0; i<that.blogDatas.length; i++){
							
							//添加置顶按钮状态
							if(that.blogDatas[i].type == "1"){
								that.blogType.push(true);
							}else{
								that.blogType.push(false);
							}
						}
						that.show = false;
						
					})
					.catch( (error) => {
						that.openError("网络出小差了.....")
						that.show = false;
					})
					
					//获取该用户已发表blog条目总数
					axios.get("/blogHandle/getBlogTotalData",{params:{userId:store.userId, states:0}})
					.then((res)=>{
						that.totalData = res.data;
					})
					.catch( (error) => {
						
					})
					this.currentpage = currentPage;
					
				}else if(this.timeYearValue >0 && this.timeMonthValue >0 && (this.tagValue != "全部" || this.tagValue != '')){
					this.currentpage = currentPage;
					const store = userStore()
					const that = this;
					axios.get("/blogHandle/getBlogByUserIdTag",
					{params:{userId:store.userId, states:0, currentPage: currentPage, tagName:this.tagValue, year:this.timeYearValue, month:this.timeMonthValue}}
					)
					.then((res)=>{
							that.blogDatas = res.data;
							for(let i=0; i<that.blogDatas.length; i++){
								
								//添加置顶按钮状态
								if(that.blogDatas[i].type == "1"){
									that.blogType.push(true);
								}else{
									that.blogType.push(false);
								}
							}
							
					})
					.catch( (error) => {
						that.openError("网络出小差了.....")
						that.show = false;
					})
					
					
					//获取该用户已发表blog条目总数
					axios.get("/blogHandle/getBlogTotalDataByTag",{params:{userId:store.userId, tagName:this.tagValue}})
					.then((res)=>{
						that.totalData = res.data;
					})
					.catch( (error) => {
						
					})
				}
			},

			/*
			改变blog置顶
			*/
			changeType(index){
				const that = this;
				axios.get(
				"/blogHandle/changeType",
				{ params: { type:this.blogType[index], blogId:this.blogDatas[index].id } })
				.then( (res) => {
					if(res.data == false){
						that.blogType[index] = !that.blogType[index]
						that.openError("服务器罢工了....，修改失败！")
					}
				})
				.catch( (error) => {
					that.blogType[index] = !that.blogType[index]
					that.openError("网络出小差了....，修改失败！")
				})
			},
			
			/*
			删除blog
			*/
			deleteBlog(index){
				this.waringTips(index);
			},
			
			
			/*
			编辑博客
			*/
			editBlog(index) {
				//跳转到创建博客页面，加上参数blogId
				this.$router.push({name:"makeblog", params:{blogId:this.blogDatas[index].id}})
			},
			
			
			/*
			删除blog信息弹窗即删除操作
			*/
			waringTips(index) {
			  ElMessageBox.confirm(
			    '您确定要删除我？创作不易，让我再陪陪你吧，有些人一旦错过就不在！',
			    '三思而行',
			    {
			      confirmButtonText: '确认',
			      cancelButtonText: '取消',
			      type: 'warning',
			    }
			  )
			    .then(() => {
					
					const that = this;
					axios.get(
					"/blogHandle/deleteBlog",
					{ params: { blogId:this.blogDatas[index].id } })
					.then( (res) => {
						if(res.data == false){
							that.openError("服务器罢工了....，修改失败！")
						}else{
							that.blogDatas.splice(index,1);
							//删除成功提示
							ElMessage({
							  type: 'success',
							  message: '删除成功',
							})
						}
					})
					.catch( (error) => {
						that.openError("网络出小差了....，修改失败！")
					})
					
			    })
			    .catch(() => {
					
			      ElMessage({
			        type: 'info',
			        message: '已取消删除',
			      })
				  
			    })
				
			},
			
			//按标签搜索
			searchByTag(tag,curPage){
				this.searchKey = '';
				if(this.timeYearValue =='' && this.timeMonthValue ==''){
					if(tag == "全部"){
						this.searchAllBlog();
						this.currentpage = curPage;
					}else{
						this.currentpage = curPage;
						const store = userStore()
						const that = this;
						axios.get("/blogHandle/getBlogByUserIdTag",
						{params:{userId:store.userId, states:0, currentPage: curPage, tagName:tag}}
						)
						.then((res)=>{
								that.blogDatas = res.data;
								for(let i=0; i<that.blogDatas.length; i++){
									
									//添加置顶按钮状态
									if(that.blogDatas[i].type == "1"){
										that.blogType.push(true);
									}else{
										that.blogType.push(false);
									}
								}
								
						})
						.catch( (error) => {
							that.openError("网络出小差了.....")
							that.show = false;
						})
						
						
						//获取该用户已发表blog条目总数
						axios.get("/blogHandle/getBlogTotalDataByTag",{params:{userId:store.userId, tagName:tag}})
						.then((res)=>{
							that.totalData = res.data;
						})
						.catch( (error) => {
							
						})
						
					}
				}else if(this.timeYearValue >0 && this.timeMonthValue >0){
					this.searchByTime(1);
				}
				
				
			},
			
			
			
			//全选，全不选
			selectAll(){
				for(let i=0; i<this.blogDatas.length; i++){
					this.blogDatas[i].isCheck = !this.isAllCheck;
				}
				this.isAllCheck = !this.isAllCheck;
			},
			
			
			/*
			错误消息提示
			*/
			openError(msg) {
			  ElMessage({
			    showClose: true,
			    message: msg,
			    type: 'error',
			  })
			},
			
			timeFormat(data) {
			  var date = new Date(data)
			  var Y = date.getFullYear() + '-'
			  var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
			  var D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' '
			  var h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':'
			  var m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':'
			  var s = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds())
			  return Y + M + D + h + m + s
			},
		}
	}
</script>

<style scoped>
	.search{
		width: 30%;
		margin-left: 40%;
	}
	.year,.month,.tag{
		width: 5%;
	}
	.tag{
		margin-left: 4%;
	}
	.year{
		margin-left: 4%;
	}
	.month{
		margin-left: 0.5%;
	}
	tr:hover{
		cursor: pointer;
		background-color: #F2F2F2;
	}
	tr{
		border-bottom: 1px solid #F2F2F2;
	}

</style>
