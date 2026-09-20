<template>
	<div>
		<div class="register_view">
			<el-form :model="registerForm" class="register_form">
				<div class="title_view">{{projectName}}注册</div>
				<div class="list_item">
					<div class="list_label">教师工号：</div>
					<el-input class="list_inp"
						 v-model="registerForm.jiaoshigonghao" 
						 placeholder="请输入教师工号"
						 type="text"
						/>
				</div>
				<div class="list_item">
					<div class="list_label">密码：</div>
					<el-input class="list_inp"
						 v-model="registerForm.mima" 
						 placeholder="请输入密码"
						 type="password"
						 />
				</div>
				<div class="list_item">
					<div class="list_label">确认密码：</div>
					<el-input class="list_inp" v-model="registerForm.mima2" type="password" placeholder="请输入确认密码" />
				</div>
				<div class="list_item">
					<div class="list_label">教师姓名：</div>
					<el-input class="list_inp"
						 v-model="registerForm.jiaoshixingming" 
						 placeholder="请输入教师姓名"
						 type="text"
						/>
				</div>
				<div class="list_item">
					<div class="list_label">照片：</div>
					<div :style='{"width":"100%","margin":"0 0 0 10px","flex":"1"}' class="list_file_list">
						<uploads
							action="file/upload" 
							tip="请上传照片" 
							:limit="3"
							:fileUrls="registerForm.zhaopian?registerForm.zhaopian:''" 
							@change="zhaopianUploadSuccess">
						</uploads>
					</div>
				</div>
				<div class="list_item">
					<div class="list_label">性别：</div>
					<el-select 
						class="list_sel"
						v-model="registerForm.xingbie" 
						placeholder="请选择性别"
						>
						<el-option v-for="item in xinlijiaoshixingbieLists" :label="item" :value="item"></el-option>
					</el-select>
				</div>

				<div class="list_item">
					<div class="list_label">联系电话：</div>
					<el-input class="list_inp"
						 v-model="registerForm.lianxidianhua" 
						 placeholder="请输入联系电话"
						 type="text"
						/>
				</div>
				<div class="list_item">
					<div class="list_label">专业资质：</div>
					<el-input class="list_inp"
						 v-model="registerForm.zhuanyezizhi" 
						 placeholder="请输入专业资质"
						 type="text"
						/>
				</div>
				<div class="list_item">
					<div class="list_label">可约时间：</div>
					<el-input class="list_inp"
						 v-model="registerForm.keyueshijian" 
						 placeholder="请输入可约时间"
						 type="text"
						/>
				</div>
				<div class="list_item">
					<div class="list_label">经验：</div>
					<el-input class="list_inp"
						 v-model="registerForm.jingyan" 
						 placeholder="请输入经验"
						 type="text"
						/>
				</div>
				<div class="list_item">
					<div class="list_label">收藏数量：</div>
					<el-input class="list_inp"
						 v-model="registerForm.storeupnum" 
						 placeholder="请输入收藏数量"
						 type="text"
						/>
				</div>
				<div class="list_btn">
					<el-button class="register" type="success" @click="handleRegister">注册</el-button>
					<div class="r-login" @click="close">已有账号，直接登录</div>
				</div>
			</el-form>
		</div>
	</div>
</template>
<script setup>
	import {
		ref,
		getCurrentInstance,
		nextTick,
	} from 'vue';
	const context = getCurrentInstance()?.appContext.config.globalProperties;
	const projectName = context?.$project.projectName
	//获取注册类型
	import { useRoute } from 'vue-router';
	const route = useRoute()
	const tableName = ref('xinlijiaoshi')
	
	//公共方法
	const getUUID=()=> {
		return new Date().getTime();
	}
	const registerForm = ref({
        xingbie: '',
         storeupnum: '0',
	})
	const xinlijiaoshixingbieLists = ref([])
	const init=()=>{
		xinlijiaoshixingbieLists.value = "男,女".split(',')
	}
    const zhaopianUploadSuccess=(fileUrls)=> {
        registerForm.value.zhaopian = fileUrls;
    }
	// 多级联动参数
	//注册按钮
	const handleRegister = () => {
		let url = tableName.value +"/register";
		if((!registerForm.value.jiaoshigonghao)){
			context?.$toolUtil.message(`教师工号不能为空`,'error')
			return false
		}
		if((!registerForm.value.mima)){
			context?.$toolUtil.message(`密码不能为空`,'error')
			return false
		}
		if(registerForm.value.mima!=registerForm.value.mima2){
			context?.$toolUtil.message('两次密码输入不一致','error')
			return false
		}
		if((!registerForm.value.jiaoshixingming)){
			context?.$toolUtil.message(`教师姓名不能为空`,'error')
			return false
		}
		if(registerForm.value.zhaopian!=null){
			registerForm.value.zhaopian = registerForm.value.zhaopian.replace(new RegExp(context?.$config.url,"g"),"");
		}
		if(registerForm.value.lianxidianhua&&(!context?.$toolUtil.isMobile(registerForm.value.lianxidianhua))){
			context?.$toolUtil.message(`联系电话应输入手机格式`,'error')
			return false
		}
		if(registerForm.value.storeupnum&&(!context?.$toolUtil.isIntNumer(registerForm.value.storeupnum))){
			context?.$toolUtil.message(`收藏数量应输入整数`,'error')
			return false
		}
		
		context?.$http({
			url:url,
			method:'post',
			data:registerForm.value
		}).then(res=>{
			context?.$toolUtil.message('注册成功','success', obj=>{
				context?.$router.push({
					path: "/login"
				});
			})
		})
	}
	//返回登录
	const close = () => {
		context?.$router.push({
			path: "/login"
		});
	}
	init()
</script>
<style lang="scss" scoped>
	
	.register_view {
		background-repeat: no-repeat;
		flex-direction: column;
		background-size: 100% 100%;
		background: url(http://clfile.zggen.cn/20240102/48186f26b21249008315772675ac409b.jpg) no-repeat center center / cover;
		display: flex;
		min-height: 100vh;
		justify-content: center;
		align-items: flex-end;
		position: relative;
		background-position: center center;
		// 表单盒子
		.register_form {
			border-radius: 4px;
			padding: 30px 20px;
			box-shadow: 1px 2px 4px #ccc;
			margin: 0 12% 0 0;
			background: #fff;
			display: flex;
			width: 30vw;
			justify-content: flex-start;
			flex-wrap: wrap;
		}
		// 标题样式
		.title_view {
			padding: 0px;
			margin: 0 auto 20px;
			color: #f98a05;
			font-weight: 500;
			width: 80%;
			font-size: 23px;
			text-align: center;
		}
		// item盒子
		.list_item {
			margin: 10px auto;
			display: flex;
			width: 80%;
			justify-content: flex-start;
			align-items: center;
			// label
			.list_label {
				color: #666;
				background: #fff;
				width: 130px;
				font-size: 14px;
				line-height: 36px;
				box-sizing: border-box;
				text-align: right;
			}
			// 输入框
			:deep(.list_inp) {
				border: 1px solid #eee;
				border-radius: 0px;
				padding: 0 10px;
				color: #666;
				background: #fff;
				flex: 1;
				width: 100%;
				line-height: 36px;
				box-sizing: border-box;
				height: 36px;
				//去掉默认样式
				.el-input__wrapper{
					border: none;
					box-shadow: none;
					background: none;
					border-radius: 0;
					height: 100%;
					padding: 0;
				}
				.is-focus {
					box-shadow: none !important;
				}
			}
		}
		//下拉框样式
		:deep(.list_sel) {
			border: 1px solid #eee;
			border-radius: 0px;
			padding: 0 10px;
			color: #666;
			background: #fff;
			flex: 1;
			width: 100%;
			line-height: 36px;
			box-sizing: border-box;
			//去掉默认样式
			.select-trigger{
				height: 100%;
				.el-input{
					height: 100%;
					.el-input__wrapper{
						border: none;
						box-shadow: none;
						background: none;
						border-radius: 0;
						height: 100%;
						padding: 0;
					}
					.is-focus {
						box-shadow: none !important;
					}
				}
			}
		}
		//按钮盒子
		.list_btn {
			margin: 10px auto;
			display: flex;
			width: 80%;
			align-items: center;
			flex-wrap: wrap;
			//注册按钮
			.register {
					border: 1px solid #ff9900;
					border-radius: 2px;
					padding: 0 24px;
					margin: 0 auto;
					color: #990033;
					background: linear-gradient(180deg, rgba(255,255,255,1) 0%, rgba(251,192,102,1) 100%);
					width: auto;
					font-size: 16px;
					height: 40px;
			}
			//注册按钮悬浮样式
			.register:hover {
				border: 1px solid #ff9900;
				border-radius: 0;
				padding: 0 24px;
				margin: 0 auto;
				color: #990033;
				background: linear-gradient(0deg, rgba(255,255,255,1) 0%, rgba(251,192,102,1) 100%);
				width: auto;
				font-size: 16px;
				height: 40px;
			}
			//已有账号
			.r-login {
				cursor: pointer;
				padding: 10px 0 0;
				color: #999;
				width: 100%;
				font-size: 14px;
				text-align: right;
			}
		}
		//图片上传样式
		.list_file_list  {
			//提示语
			:deep(.el-upload__tip){
				margin: 7px 0 0;
				color: #999;
				display: flex;
				font-size: 14px;
				justify-content: flex-start;
				align-items: center;
			}
			//外部盒子
			:deep(.el-upload--picture-card){
				border: 1px solid #eee;
				cursor: pointer;
				background-color: #fff;
				border-radius: 0px;
				width: 160px;
				line-height: 70px;
				text-align: center;
				height: 60px;
				//图标
				.el-icon{
					color: #ff9900;
					font-size: 26px;
				}
			}
			:deep(.el-upload-list__item) {
				border: 1px solid #eee;
				cursor: pointer;
				background-color: #fff;
				border-radius: 0px;
				width: 160px;
				line-height: 70px;
				text-align: center;
				height: 60px;
			}
		}
	}
</style>