import { createApp } from 'vue'
import App from './App.vue'
import axios from 'axios'
import {createPinia} from 'pinia'

//安装cnpm install axios --save
//安装npm install vue-router@4
//安装npm install echarts --save
//安装npm install pinia -S


//elementpus安装指令"npm install element-plus --save"
//然后引用下面两句话
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

//elementpus ico引用，下载：npm install @element-plus/icons-vue
import * as ElIcons from '@element-plus/icons-vue'

import router from "./router.js"//路由配置引入



//axios请求统一路径，在发送请求时会自动调用加上该路径  服务器：http://39.108.250.51:8080/blogWebsite  本地：http://localhost:8080/blogWebsite
axios.defaults.baseURL = "http://localhost:8080/blogWebsite";
//axios全局设置网络超时,指的是服务端响应返回数据超时时间，而连接不到服务器的超时时间默认是5s
axios.defaults.timeout = 30 * 1000; // 30s
axios.defaults.withCredentials = true//解决跨域下无法存储cookie，允许携带cookie

axios.interceptors.request.use(config => {
    // 为请求头添加token字段为服务端返回的token
    config.headers['token'] = localStorage.getItem('token');
    // return config是固定用法 必须有返回值
    return config
})


const store = createPinia()

const app = createApp(App)

//导入ioc
for (const name in ElIcons){
	app.component(name,(ElIcons as any)[name])
}

app.use(store)

app.use(router)

app.use(ElementPlus)

app.mount('#app')
