<template>
	<div id="steps">
		<el-steps :active="active" finish-status="success" align-center>
			<el-step title="邮箱验证" />
			<el-step title="密码修改" />
			<el-step title="完成" />
	    </el-steps>
		<!-- show_step1 -->
		<div id="step1" v-show="show_step1">
			<div class="email">
				<el-input v-model="email" placeholder="输入你绑定的邮箱" type="email" style="width: 25%;"/>
				<el-button type="primary" v-show="!show_count_down" @click="getCode">获取验证码</el-button>
				<el-button type="primary" disabled v-show="show_count_down">{{ count_down_time }}s</el-button>
				<i class="fa fa-times-circle" aria-hidden="true" v-show="email_msg != null"
					style="color: red;margin-left: 1%;font-size: 14px;">
					{{email_msg}}
				</i>
			</div>
			<div class="code">
				<el-input v-model="code" placeholder="输入验证码"  style="width: 25%;"/>
				<i class="fa fa-times-circle" aria-hidden="true" v-show="code_msg != null"
					style="color: red;margin-left: 1%;font-size: 14px;">
					{{code_msg}}
				</i>
			</div>
			<el-button type="primary" class="checking" v-show="!show_check" @click="checked">验证</el-button>
			<el-button type="primary" loading class="checking" v-show="show_check">验证中...</el-button>
		</div>
		
		<!-- show_step2 -->
		<div id="step2" v-show="show_step2">
			<div class="password">
				<el-input v-model="password" placeholder="新密码" type="password" style="width: 25%;"/>
			</div>
			<div class="password">
				<el-input v-model="password2" placeholder="再次输入" type="password"  style="width: 25%;"/>
				<i class="fa fa-times-circle" aria-hidden="true" v-show="password_msg != null"
					style="color: red;margin-left: 1%;font-size: 14px;">
					{{password_msg}}
				</i>
			</div>
			<el-button type="primary" class="updataing" v-show="!show_updata" @click="updata_password">修改</el-button>
			<el-button type="primary" loading class="updataing" v-show="show_updata">修改中...</el-button>
		</div>
		
		<!-- show_step3 -->
		<div id="step3" v-show="show_step3">
			<div class="update_success">
				<img src="../../assets/img/密码修改成功.png" />
				<h2>修改成功！</h2>
			</div>
		</div>
	</div>
	  
</template>

<script setup lang="ts">
	import { ref } from "vue"
	import { ElMessage } from 'element-plus'
	import axios from "axios"
	import $ from "jquery"
	
	const active = ref(0)//步骤
	const email = ref()
	const code = ref()
	const count_down_time = ref(60)//倒计时
	const show_count_down = ref(false)
	const show_check = ref(false)
	const email_msg = ref()
	const code_msg = ref()
	const password = ref()
	const password2 = ref()
	const password_msg =ref()
	const show_updata = ref(false)
	const show_step1 = ref(true)
	const show_step2 = ref(false)
	const show_step3 = ref(false)
	
	
	
	const getCode = ()=> {
		//检查邮箱格式
		var reMail =/^(?:[a-zA-Z0-9]+[_\-\+\.]?)*[a-zA-Z0-9]+@(?:([a-zA-Z0-9]+[_\-]?)*[a-zA-Z0-9]+\.)+([a-zA-Z]{2,})+$/;
		var s=new RegExp(reMail);
		
		if(s.test(email.value)){
			
			axios.get("/UserController/getCode",{params:{email:email.value}})
			.then((res)=>{
				
				if(res.data.states == true){
					show_count_down.value = true;
					//倒计时
					count_down();
					email_msg.value = null;
					success(res.data.msg)
				}else{
					email_msg.value = res.data.msg;
				}
			})
			.catch(()=>{
				error("网络请求超时！")
			})
		}else{
			warning("请填写正确的邮箱！")
		}
		
	}
	

	//倒计时
	function count_down(){
		const time = setInterval(function(){
			if(count_down_time.value>0){
				count_down_time.value = count_down_time.value-1;
			}
			if(count_down_time.value<=0){
				clearInterval(time)
				count_down_time.value = 60;
				show_count_down.value = false;
			}
		},1000)
	}
	
	
	//验证code
	const checked = ()=> {
		if(code.value != null){
			show_check.value = true;
			axios.get("/UserController/checkCode",{params:{code:code.value}})
			.then((res)=>{
				if(res.data.states == true){
					success(res.data.msg)
					setTimeout(function(){
						show_check.value = false;
						show_step1.value = false;
						show_step2.value = true;
						step1.css("opacity","0")
						step2.css("opacity",1);
						active.value = 1;
					},500)
				}else{
					code_msg.value = res.data.msg;
					setTimeout(function(){
						show_check.value = false;
					},500)
					
				}
			})
			.catch(()=>{
				error("网络请求超时！")
				setTimeout(function(){
					show_check.value = false;
				},500)
			})
			
		}else{
			warning("请输入验证码！")
		}
		
	}
	
	
	//修改密码
	const updata_password = ()=>{
		if(password.value != password2.value){
			password_msg.value = "两次输入密码不一致！"
		}else{
			password_msg.value = null;
			
			axios.post("/UserController/updatePassword",password.value)
			.then((res)=>{
				if(res.data.states == true){
					success(res.data.msg)
					active.value = 2;
					show_step2.value = false;
					show_step3.value = true;
				}else{
					error(res.data.msg)
				}
			})
			.catch(()=>{
				error("网络请求超时！")
			})
		}
		
	}
	
	const success = (msg:String) => {
	  ElMessage({
	    message: msg,
	    type: 'success',
	  })
	}
	
	const warning = (msg:String) => {
	  ElMessage({
	    message: msg,
	    type: 'warning',
	  })
	}
	
	const error = (msg:String) => {
	  ElMessage.error(msg)
	}
</script>

<style scoped>
	#steps{
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	.el-steps{
		width: 100%;
	}
	#step1{
		width: 70%;
		display: flex;
		flex-direction: column;
		margin-top: 3%;
	}
	.el-button{
		margin-left: 1%;
	}
	.code{
		margin-top: 3%;
	}
	.checking{
		margin-top: 3%;
		width: 25%;
	}
	#step2{
		position: relative;
		left: 38%;
		width: 100%;
		display: flex;
		flex-direction: column;
		margin-top: 3%;
	}
	.updataing{
		margin-top: 3%;
		width: 25%;
	}
	.password{
		margin-top: 3%;
	}
	.update_success{
		display: flex;
		flex-direction: column;
		align-items: center;
	}
</style>
