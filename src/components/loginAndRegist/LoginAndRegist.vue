<template>
	<div id="bg">
		
	</div>
	<main>
	      <div class="box">
	        <div class="inner-box">
	          <div class="forms-wrap">
	            <form autocomplete="off" class="sign-in-form">
	              <div class="logo">
	                <img src="../../assets/loginImg/透明底logo.png" alt="easyclass" style="width: 250px;height: 200px;"/>
	                <!-- <h4> UglyDuck</h4> -->
	              </div>
	
	              <div class="heading">
	                <h2>欢迎回来</h2>
	                <h6>还没有账号?</h6>
	                <a href="#" class="toggle">立即注册</a>
	              </div>
	
	              <div class="actual-form">
					  
					  <span class="error_msg">{{ accountError }}</span>
					  
	                <div class="input-wrap">
	                  <input
	                    type="text"
	                    minlength="4"
	                    class="input-field"
	                    autocomplete="off"
	                    required
						v-model="account"
						autofocus
	                  />
	                  <label>Account</label>
	                </div>
					
					<span class="error_msg">{{ passwordError }}</span>
					
	                <div class="input-wrap">
	                  <input
	                    type="password"
	                    minlength="4"
	                    class="input-field"
	                    autocomplete="off"
	                    required
						v-model="password"
						@keyup.enter="login"
	                  />
	                  <label>Password</label>
	                </div>
					
					<div class="input-wrap">
						<input type="checkbox" id="rember_me" v-model="rememberMe"/>
						<span style="font-size: 13px;">10天免密登入</span>
					</div>
					
	                <input type="button" value="Sign In" class="sign-btn" @click="login"/>
	
	                <p class="text">
	                  忘记密码?
	                  <a href="#">获取帮助</a>
	                </p>
	              </div>
	            </form>
	
	            <form autocomplete="off" class="sign-up-form">
	              <div class="logo">
	                <img src="../../assets/loginImg/透明底logo.png" alt="easyclass" style="width: 250px;height: 200px;"/>
	              </div>
	
	              <div class="heading">
	                <h2>欢迎加入</h2>
	                <h6>已有账号?</h6>
	                <a href="#" class="toggle">立即登入</a>
	              </div>
	
	              <div class="actual-form">
	                
	
	                <div class="input-wrap">
	                  <input
	                    type="email"
	                    class="input-field"
	                    autocomplete="off"
	                    required
						v-model="email"
	                  />
	                  <label>Email</label>
	                </div>
	
	                <div class="input-wrap">
	                  <input
	                    type="password"
	                    minlength="4"
	                    class="input-field"
	                    autocomplete="off"
	                    required
						v-model="register_password"
	                  />
	                  <label>Password</label>
	                </div>
					
					<div class="input-wrap">
					  <input
					    type="text"
					    minlength="4"
					    class="input-field"
					    autocomplete="off"
					    required
						v-model="code"
					  />
					  <label>Code</label>
					</div>
	
	                <input type="button" value="注册暂未开放" class="sign-btn" @click="regist" disabled="disabled"/>
	
	                <p class="text">
	                  通过注册，我同意
	                  <a href="#">服务条款</a> 和
	                  <a href="#">隐私政策</a>
	                </p>
	              </div>
	            </form>
	          </div>
	
	          <div class="carousel">
	            <div class="images-wrapper">
	              <img src="../../assets/loginImg/image2.png" class="image img-1 show" alt="" style="height: 421px;"/>
	              <img src="../../assets/loginImg/image1.png" class="image img-2" alt=""  style="height: 421px;"/>
	              <img src="../../assets/loginImg/image3.png" class="image img-3" alt="" />
	            </div>
	
	            <div class="text-slider">
	              <div class="text-wrap">
	                <div class="text-group">
	                  <h2>生活如跨栏，跨过障碍是规则</h2>
					  <h2>即使身处逆境，也终将实现理想</h2>
	                  <h2>丑小鸭</h2>
	                </div>
	              </div>
	
	              <div class="bullets">
	                <span class="active" data-value="1"></span>
	                <span data-value="2"></span>
	                <span data-value="3"></span>
	              </div>
	            </div>
	          </div>
	        </div>
	      </div>
	    </main>
</template>



<script setup lang="ts">
	import {ref,onMounted} from "vue"
	import axios from "axios"
	import {useRouter} from "vue-router"//useRouter用来路由跳转，useRoute用来获取路由中传递的参数
	import { userStore } from "../../store"
	import { ElMessage,ElMessageBox } from 'element-plus'
	import { Storage } from '../../localStore/localStore.js'
	
	
	const storage = new Storage();
	const store = userStore();
	const router = useRouter();
	const account = ref('')
	const password = ref('')
	const accountError = ref('')//登入出现账号错误信息
	const passwordError = ref('')//登入出现密码错误信息
	const rememberMe = ref<Boolean>(false)//记住我
	
	
	const register_password = ref()
	const email = ref()
	const code = ref()
	
	//登入参数类
	class LoginParams{
		account:string;
		password:string;
		rememberMe:Boolean;
		
		constructor(account:string, password:string, rememberMe:Boolean){
			this.account = account;
			this.password = password;
			this.rememberMe = rememberMe;
		}
	}
	
	//注册参数类
	class RegisterParams{
		email:string;
		password:string;
		code:String;
		
		constructor(email:string, password:string, code:String){
			this.email = email;
			this.password = password;
			this.code = code;
		}
	}
	
	const login = ()=> {
		
		const loginParams = new LoginParams(account.value, password.value, rememberMe.value);
		
		axios.post("/loginController/login",loginParams)
		.then((res)=>{
			
			if(res.data.success == true){
				//登入成功，将头像路径放入localStorage，storage进行了重写，可以设置过期时间
				storage.setItem({name:"user",value:{"headerUrl":res.data.headerUrl,"userName":res.data.username},expires:res.data.expires})
				storage.setItem("account",account.value)
				localStorage.setItem("token",res.data.ticket);
				router.push("/home")
			}else{
				
				accountError.value = res.data.usernameMsg;
				passwordError.value = res.data.passwordMsg;
				
			}
			
		})
		.catch((error)=>{
			openError("网络连接超时！")
		})
	}
	
	//注册
	const regist = ()=> {
		const user = new RegisterParams(email.value, register_password.value, code.value);
		axios.post("/register/newUser",user)
		.then((res)=>{
			if(res.data.states == true){
				openSucces(res.data.msg);
			}else{
				openError(res.data.msg);
			}
		})
		.catch((error)=>{
			openError("网络连接超时！")
		})
	}
	
	onMounted(()=>{
		account.value = localStorage.getItem("account");
	})
	
	const openError = (msg:string)=> {
	  ElMessage({
	    showClose: true,
	    message: msg,
	    type: 'error',
	  })
	}
	
	const openSucces = (msg:string) => {
	  ElMessage({
	    message: msg,
	    type: 'success',
	  })
	}
</script>


<script lang="ts">
	export default{
		mounted(){
			//等页面元素渲染完成才能获取到，否则无效
			const inputs = document.querySelectorAll(".input-field");
			const toggle_btn = document.querySelectorAll(".toggle");
			const main = document.querySelector("main");
			const bullets = document.querySelectorAll(".bullets span");
			const images = document.querySelectorAll(".image");
			
			inputs.forEach((inp) => {
			  inp.addEventListener("focus", () => {
			    inp.classList.add("active");
			  });
			  inp.addEventListener("blur", () => {
			    if (inp.value != "") return;
			    inp.classList.remove("active");
			  });
			});
			
			toggle_btn.forEach((btn) => {
			  btn.addEventListener("click", () => {
			    main.classList.toggle("sign-up-mode");
			  });
			});
			
			function moveSlider() {
				console.log(this.dataset)
			  let index = this.dataset.value;
			
			  let currentImage = document.querySelector(`.img-${index}`);
			  console.log(currentImage)
			  images.forEach((img) => img.classList.remove("show"));
			  currentImage.classList.add("show");
			
			  const textSlider = document.querySelector(".text-group");
			  textSlider.style.transform = `translateY(${-(index - 1) * 2.2}rem)`;
			
			  bullets.forEach((bull) => bull.classList.remove("active"));
			  this.classList.add("active");
			}
			
			bullets.forEach((bullet) => {
			  bullet.addEventListener("click", moveSlider);
			});
		}
	}
</script>



<style scoped>
	@import "../../assets/css/style.css"

</style>
