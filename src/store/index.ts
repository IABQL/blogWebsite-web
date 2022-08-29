import { defineStore } from "pinia"

//"userStore"类似于给该store唯一id
export const userStore = defineStore("userStore",{
	state:()=>{
		return{
			userId:''
		}
	},
	//类似于computed
	getters:{
		
	},
	//类似于methods
	actions:{
		
	}
})