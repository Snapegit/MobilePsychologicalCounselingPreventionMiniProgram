<template>
	<div>
		<div class="exam_top">
			<div class="examTopLeft">
				{{examDetail.name}} (共{{questionList.length}}题)
			</div>
			<div class="examTopCenter">
				剩余时间：{{times}}
			</div>
			<div class="examTopRight">
				<el-button type="danger" @click="leaveExam">退出考试</el-button>
			</div>
		</div>
		<div class="exam_top_kong"></div>
		<el-card v-if="endType" class="score_view">
			<div class="score_item">
				考试成绩：<span class="score_num">{{scoreChange()}}</span>
			</div>
			<div class="btn_view">
				<el-button v-if="!analysisType" type="primary" @click="viewAnalysis">查看解析</el-button>
				<el-button type="danger" @click="endExam">结束考试</el-button>
			</div>
		</el-card>
		<el-card class="question_list" v-if="(!submitType&&!analysisType)||(submitType&&analysisType)">
			<div class="question" v-for="(item,index) in questionList" :key="index">
				<div class="questionTitle">
					{{index + 1}}、{{item.questionname}}
				</div>
				<div class="optionList">
					<div class="option" v-for="(items,indexs) in item.optionList" :key="index">
						{{codeChange(indexs)}}：{{items.text}}
					</div>
				</div>
				<div class="answer" v-if="!submitType">
					<el-select v-model="item.myanswer"
						placeholder="输入答案">
						<el-option v-if="item.type==0" v-for="(items,indexs) in item.optionList"
							:label="codeChange(indexs)" :value="codeChange(indexs)"></el-option>
					</el-select>
				</div>
				<div class="answer" v-if="submitType">
					<div>我的答案：{{item.myanswer}}</div>
					<div>得分：{{item.myscore}}</div>
				</div>
				<el-collapse v-if="submitType" model-value="1" class="analysis_view">
					<el-collapse-item title="查看解析" name="1">
						<div class="analysis">解析：{{item.analysis}}</div>
					</el-collapse-item>
				</el-collapse>
				<el-divider v-if="questionList.length - 1!=index" />
			</div>
			<div class="btn_view" v-if="!submitType">
				<el-button type="success" @click="save">立即交卷</el-button>
			</div>
		</el-card>
	</div>
</template>

<script setup>
	import {
		ref,
		nextTick,
		getCurrentInstance,
		computed
	} from 'vue';
	import {
		useRoute,
		useRouter
	} from 'vue-router'
	import {
		ElMessageBox
	} from 'element-plus'
	const route = useRoute()
	const context = getCurrentInstance()?.appContext.config.globalProperties;
	//初始化
	const id = ref(0)
	const init = () => {
		if (route.query.id) {
			id.value = route.query.id
			getSession()
			getExamination()
			getQuestionList()
		}
	}
	//获取用户信息
	const user = ref({})
	const getSession = () => {
		context?.$http({
			url: `${context?.$toolUtil.storageGet('sessionTable')}/session`,
			method: 'get'
		}).then(res => {
			user.value = res.data.data
		})
	}
	//获取试卷详情
	const examDetail = ref({})
	const examTime = ref(0)
	const timeInter = ref(null)
	const getExamination = () => {
		context?.$http({
			url: `exampaper/info/${id.value}`,
			method: 'get'
		}).then(res => {
			examDetail.value = res.data.data
			examTime.value = Number(res.data.data.time * 60)
			timeInter.value = setInterval(() => {
				examTime.value--
			}, 1000)
		})
	}
	const times = computed(() => {
		var time = examTime.value
		if (null != time && "" != time) {
			if (time > 60 && time < 60 * 60) {
				time =
					parseInt(time / 60.0) +
					"分钟" +
					parseInt((parseFloat(time / 60.0) - parseInt(time / 60.0)) * 60) +
					"秒";
			} else if (time >= 60 * 60 && time < 60 * 60 * 24) {
				time =
					parseInt(time / 3600.0) +
					"小时" +
					parseInt(
						(parseFloat(time / 3600.0) - parseInt(time / 3600.0)) * 60
					) +
					"分钟" +
					parseInt(
						(parseFloat(
								(parseFloat(time / 3600.0) - parseInt(time / 3600.0)) * 60
							) -
							parseInt(
								(parseFloat(time / 3600.0) - parseInt(time / 3600.0)) * 60
							)) *
						60
					) +
					"秒";
			} else if (time >= 60 * 60 * 24) {
				time =
					parseInt(time / 3600.0 / 24) +
					"天" +
					parseInt(
						(parseFloat(time / 3600.0 / 24) - parseInt(time / 3600.0 / 24)) *
						24
					) +
					"小时" +
					parseInt(
						(parseFloat(time / 3600.0) - parseInt(time / 3600.0)) * 60
					) +
					"分钟" +
					parseInt(
						(parseFloat(
								(parseFloat(time / 3600.0) - parseInt(time / 3600.0)) * 60
							) -
							parseInt(
								(parseFloat(time / 3600.0) - parseInt(time / 3600.0)) * 60
							)) *
						60
					) +
					"秒";
			} else {
				if (parseInt(time) <= 0) {
					time = "0秒";
				} else {
					time = parseInt(time) + "秒";
				}
			}
		}
		return time;
	})
	//交卷状态
	const submitType = ref(false)
	const endType = ref(false)
	//是否查看解析
	const analysisType = ref(false)
	//试题
	const questionList = ref([])
	const getQuestionList = () => {
		context?.$http({
			url: 'examquestion/page',
			method: 'get',
			params: {
				page: 1,
				limit: 1000,
				sort: 'sequence',
				paperid: id.value
			}
		}).then(res => {
			for (let x in res.data.data.list) {
				if (res.data.data.list[x].options) {
					res.data.data.list[x].optionList = JSON.parse(res.data.data.list[x].options)
				} else {
					res.data.data.list[x].optionList = []
				}
			}
			questionList.value = res.data.data.list
		})
	}
	//获取选项
	const codeChange = (type) => {
		let arr = ['A', 'B', 'C', 'D']
		return arr[type]
	}
	const codeChange1 = (type) => {
		let arr = ['对', '错']
		return arr[type]
	}
	//退出考试
	const leaveExam = () => {
		ElMessageBox.confirm(`是否退出考试？`, '提示', {
			confirmButtonText: '是',
			cancelButtonText: '否',
			type: 'warning',
		}).then(() => {
			history.back()
		})
	}
	//结束考试
	const endExam = () => {
		history.back()
	}
	//提交考试记录
	const saverecord = (row) => {
		let arr = {
			userid: user.value.id,
			username: user.value.yonghuzhanghao,
			paperid: examDetail.value.id,
			papername: examDetail.value.name,
			questionid: parseInt(row.id),
			questionname: row.questionname,
			options: row.options ? row.options : '[]',
			score: row.score,
			answer: row.answer,
			analysis: row.analysis,
			myanswer: row.myanswer,
			myscore:row.myscore,
		}
		context?.$http({
			url: 'examrecord/save',
			method: 'POST',
			data: arr
		}).then(res => {})
	}
	//查看解析
	const viewAnalysis = () => {
		analysisType.value = true
	}
	//交卷
	const save = () => {
		ElMessageBox.confirm(`是否完成考试？`, '提示', {
			confirmButtonText: '是',
			cancelButtonText: '否',
			type: 'warning',
		}).then(() => {
			for(let x in questionList.value){
				if(questionList.value[x].optionList.length){
					for(let i in questionList.value[x].optionList){
						questionList.value[x].myscore = parseFloat(questionList.value[x].optionList[encodeChange(questionList.value[x].myanswer)].score)
					}
				}
				saverecord(questionList.value[x])
			}
			clearInterval(timeInter.value)
			submitType.value = true
			endType.value = true
		})
	}
	const encodeChange = (index) => {
		let arr = ['A', 'B', 'C', 'D']
		for(let x in arr){
			if(arr[x] == index){
				return x
			}
		}
	}
	//分数统计
	const scoreChange = () => {
		let score = 0
		for (let x in questionList.value) {
			score += parseFloat(questionList.value[x].myscore)
		}
		return score
	}
	init()
</script>

<style lang="scss" scoped>
	.exam_top {
		padding: 16px 7% 0;
		top: 0;
		color: #fff;
		left: 0;
		background: linear-gradient(0deg, rgba(255,154,2,1) 0%, rgba(254,205,115,1) 75%, rgba(255,220,148,1) 75%, rgba(252,219,151,1) 100%);
		display: flex;
		width: 100%;
		justify-content: space-between;
		align-items: center;
		position: fixed;
		box-sizing: border-box;
		height: 60px;
		
		// 考试名称
		.examTopLeft {
			width: calc(100% / 3);
			font-size: 16px;
			text-align: left;
		}
		//时间
		.examTopCenter {
			width: calc(100% / 3);
			font-size: 16px;
			text-align: center;
		}
		// 退出考试盒子
		.examTopRight {
			width: calc(100% / 3);
			text-align: right;
			// 按钮
			:deep(.el-button--danger) {
				border: 0;
				cursor: pointer;
				border-radius: 4px;
				padding: 0 10px;
				margin: 0 10px 0 0;
				color: #fff;
				background: rgba(255,255,255,.3);
				width: auto;
				font-size: 14px;
				height: 32px;
			}
			// 按钮悬浮
			:deep(.el-button--danger:hover) {
			}
		}
	}

	// 答题区域
	.question_list {
		border: 0px solid #eee;
		border-radius: 0px;
		box-shadow: none;
		padding: 0;
		margin: 80px auto 20px;
		background: #fff;
		width: 86%;
		text-align: left;
		// 答题盒子
		.question {
			border-radius: 0px;
			padding: 20px;
			margin: 0 0 20px;
			background: #fff;
			width: 100%;
			border-color: #eee;
			border-width: 1px;
			border-style: solid;
			// 分割线
			:deep(.el-divider) {
				margin: 24px 0;
				display: block;
				width: 100%;
				height: 0px;
			}
			// 题目
			.questionTitle {
				width: 100%;
				// 单选题
				:deep(.el-tag--success) {
					background-color: #f0f9eb;
					color: #67c23a;
					border-color: #e1f3d8;
				}
				// 判断题
				:deep(.el-tag--danger) {
					background-color: #fef0f0;
					color: #f56c6c;
					border-color: #fde2e2;
				}
				// 填空题
				:deep(.el-tag--info) {
					background-color: #f4f4f5;
					color: #909399;
					border-color: #e9e9eb;
				}
				// 多选题
				:deep(.el-tag--warning) {
					background-color: #fdf6ec;
					color: #e6a23c;
					border-color: #faecd8;
				}
			}
			// 选项列表
			.optionList {
				padding: 10px 0;
				text-indent: 2rem;

				.option {
					padding: 0 0 10px;
				}
			}
			// 答案盒子
			.answer {
				padding: 10px 0;
				// 输入框
				:deep(.answer_inp) {
					border: 1px solid #eee;
					border-radius: 0px;
					padding: 0 10px;
					background: #fff;
					width: calc(100% - 120px);
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
				// 下拉框
				:deep(.el-select) {
					border: 1px solid #eee;
					border-radius: 0px;
					padding: 0 10px;
					background: #fff;
					width: calc(100% - 120px);
					line-height: 36px;
					box-sizing: border-box;
					//去掉默认样式
					.select-trigger {
						height: 100%;
						.el-input {
							height: 100%;
							.el-input__wrapper {
								border: none;
								box-shadow: none;
								background: none;
								border-radius: 0;
								height: 100%;
							}
							.is-focus {
								box-shadow: none !important;
							}
						}
					}
				}
				// 答案正确
				:deep(.el-tag--success) {
					background-color: #f0f9eb;
					color: #67c23a;
					border-color: #e1f3d8;
				}
				// 答案错误
				:deep(.el-tag--danger) {
					background-color: #fef0f0;
					color: #f56c6c;
					border-color: #fde2e2;
				}
			}
			// 解析盒子
			:deep(.analysis_view) {
				border: 1px solid #eee;
				border-radius: 0px;
				background: #fcfcfc;
				height: auto;
				// 标题
				.el-collapse-item__header {
					border: 0;
					padding: 0 10px;
					background: none;
					height: 40px;
					// 图标
					.el-icon {
						color: #999;
					}
				}
				.el-collapse-item__wrap {
					border-bottom: none;
				}
				// 内容区
				.el-collapse-item__content {
					padding: 0 0 10px;
					background: #fff;
					border-color: #eee;
					border-width: 0 0 1px;
					border-style: solid;
					// 正确答案
					.right_view {
						color: #000;
						text-indent: 2rem;
						font-size: 14px;
					}
					// 解析
					.analysis {
						color: #000;
						text-indent: 2rem;
						font-size: 14px;
					}
				}
			}
		}
		// 按钮盒子
		.btn_view{
			text-align: center;
			// 提交
			:deep(.el-button--success) {
				border: 0;
				cursor: pointer;
				border-radius: 2px;
				padding: 0 24px;
				margin: 0 10px 0 0;
				outline: none;
				color: #333;
				background: linear-gradient(180deg, rgba(255,154,2,1) 0%, rgba(254,205,115,1) 55%, rgba(255,220,148,1) 55%, rgba(252,219,151,1) 100%);
				width: auto;
				font-size: 14px;
				height: 36px;
			}
			// 提交-悬浮
			:deep(.el-button--success:hover) {
			}
			// 下一题
			:deep(.el-button--warning) {
				border: 0;
				cursor: pointer;
				border-radius: 2px;
				padding: 0 24px;
				margin: 0 10px 0 0;
				outline: none;
				color: #666;
				background: #d6e3b6;
				width: auto;
				font-size: 14px;
				height: 36px;
			}
			// 下一题-悬浮
			:deep(.el-button--warning:hover) {
			}
			// 查看解析
			:deep(.el-button--primary) {
				border: 0;
				cursor: pointer;
				border-radius: 2px;
				padding: 0 24px;
				margin: 0 10px 0 0;
				color: #333;
				background: linear-gradient(180deg, rgba(255,154,2,1) 0%, rgba(254,205,115,1) 55%, rgba(255,220,148,1) 55%, rgba(252,219,151,1) 100%);
				width: auto;
				font-size: 14px;
				height: 36px;
			}
			// 查看解析-悬浮
			:deep(.el-button--primary:hover) {
			}
			// 结束考试
			:deep(.el-button--danger) {
				border: 0;
				cursor: pointer;
				border-radius: 2px;
				padding: 0 24px;
				margin: 0 10px 0 0;
				outline: none;
				color: #666;
				background: #fae5e2;
				width: auto;
				font-size: 14px;
				height: 36px;
			}
			// 结束考试-悬浮
			:deep(.el-button--danger:hover) {
			}
		}
	}
	// 成绩盒子
	.score_view {
		border: 1px solid #eee;
		border-radius: 0;
		box-shadow: none;
		margin: 80px auto 30px;
		background: #fcfcfc;
		width: 86%;
		.score_item {
			padding: 0px 0;
			color: #f9a205;
			font-size: 22px;
			text-align: center;
		}
		.score_num {
			color: #f00;
			font-size: 22px;
		}
	}
</style>