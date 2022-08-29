import { createRouter, createWebHistory } from "vue-router"
import { Storage } from './localStore/localStore.js'


import notFunnd from "./components/404.vue"
import admin from "./components/backstage/Admin.vue"
import usermsg from "./components/backstage/UserMsg.vue"
import makeblog from "./components/backstage/MakeBlog.vue"
import fansData from "./components/backstage/FansData.vue"
import personMsg from "./components/backstage/PersonMsg.vue"
import myBlogs from "./components/backstage/MyBlogs.vue"
import collection from "./components/backstage/Collection.vue"
import draft from "./components/backstage/Draft.vue"
import leaveMessage from "./components/backstage/LeaveMessage.vue"
import  loginRegist from "./components/loginAndRegist/LoginAndRegist.vue"
import home from "./components/frontstage/Home.vue"
import blogshow from "./components/frontstage/BlogShow.vue"
import commentManage from "./components/backstage/commentManage.vue"
import welcome from "./components/frontstage/Welcome.vue"
import writeMsg from "./components/frontstage/WriteMsg.vue"
import searchResult from "./components/frontstage/SearchResult.vue"
import changePassword from "./components/backstage/ChangePassword.vue"


const storage = new Storage();
//注册路由
const router = createRouter({
	history:createWebHistory(),
	routes:[
		{
			//404页面
			path:"/:path(.*)",
			component:notFunnd
		},
		{
			path:"/",
			redirect:"/welcome"//访问根路径，重定向到主页
		},
		{
			path:"/welcome",
			component:welcome
		},
		{
			path:"/writeMsg",
			component:writeMsg
		},
		{
			name:"home",
			path:"/home",
			component:home
		},
		{
			path:"/blogshow/:blogId?",
			component:blogshow
		},
		{
			path:"/searchResult/:key?",
			component:searchResult
		},
		{
			path:"/loginRegist",
			component:loginRegist
		},
		{
			//管理员页面
			path:"/admin",
			component:admin,
			beforeEnter:(to,from,next)=>{
				if(localStorage.getItem("user") == null || storage.getItem("user")==false){
					next({path:"/loginRegist"});
				}else{
					next();
				}
			},
			redirect:"/admin/userMsg",
			children:[
				{
					path:"usermsg",
					component:usermsg
				},
				{
					name:"makeblog",
					path:"makeblog/:blogId?",//blogId可选参数，无参则是创建新博客
					component:makeblog
				},
				{
					path:"fansData",
					component:fansData
				},
				{
					path:"personMsg",
					component:personMsg
				},
				{
					path:"myBlogs",
					component:myBlogs
				},
				{
					path:"collection",
					component:collection
				},
				{
					path:"draft",
					component:draft
				},
				{
					path:"leaveMessage",
					component:leaveMessage
				},
				{
					path:"commentManage",
					component:commentManage
				},
				{
					path:"changePassword",
					component:changePassword
				}
			]
		}
	]
});



export default router;