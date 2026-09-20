	import {
		createRouter,
		createWebHashHistory
	} from 'vue-router'
	import forum from '@/views/forum/list'
	import news from '@/views/news/list'
	import xinlijiaoshi from '@/views/xinlijiaoshi/list'
	import zixunxinxi from '@/views/zixunxinxi/list'
	import yonghu from '@/views/yonghu/list'
	import examquestion from '@/views/exam/examquestion/list'
	import yuyuejiaoshi from '@/views/yuyuejiaoshi/list'
	import zaixianjiaoliu from '@/views/zaixianjiaoliu/list'
	import exampaper from '@/views/exampaper/list'
	import storeup from '@/views/storeup/list'
	import config from '@/views/config/list'
	import exampaperlist from '@/views/exam/exampaperlist/list'
	import examination from '@/views/exam/exampaperlist/examination'
	import examrecord from '@/views/exam/examrecord/list'
	import examfailrecord from '@/views/exam/examfailrecord/list'
	import xinlijiaoshiCenter from '@/views/xinlijiaoshi/center'

export const routes = [{
		path: '/login',
		name: 'login',
		component: () => import('../views/login.vue')
	},{
		path: '/',
		name: '首页',
		component: () => import('../views/index'),
		children: [{
			path: '/',
			name: '首页Home',
			component: () => import('../views/HomeView.vue'),
			meta: {
				affix: true
			}
		}, {
			path: '/updatepassword',
			name: '修改密码',
			component: () => import('../views/updatepassword.vue')
		}
		
		,{
			path: '/xinlijiaoshiCenter',
			name: '心理教师个人中心',
			component: xinlijiaoshiCenter
		}
		,{
			path: '/forum',
			name: '我的发布',
			component: forum
		}
		,{
			path: '/news',
			name: '心理知识',
			component: news
		}
		,{
			path: '/xinlijiaoshi',
			name: '心理教师',
			component: xinlijiaoshi
		}
		,{
			path: '/zixunxinxi',
			name: '咨询信息',
			component: zixunxinxi
		}
		,{
			path: '/yonghu',
			name: '用户',
			component: yonghu
		}
		,{
			path: '/examquestion',
			name: '试题管理',
			component: examquestion
		}
		,{
			path: '/yuyuejiaoshi',
			name: '预约教师',
			component: yuyuejiaoshi
		}
		,{
			path: '/zaixianjiaoliu',
			name: '在线交流',
			component: zaixianjiaoliu
		}
		,{
			path: '/exampaper',
			name: '心理测试',
			component: exampaper
		}
		,{
			path: '/storeup',
			name: '我的收藏',
			component: storeup
		}
		,{
			path: '/config',
			name: '轮播图',
			component: config
		}
		, {
			path: '/exampaperlist',
			name: '考试列表',
			component: exampaperlist
		}, {
			path: '/examrecord',
			name: '考试记录',
			component: examrecord
		}, {
			path: '/examfailrecord',
			name: '错题本',
			component: examfailrecord
		}
		]
	},
	{
		path: '/examination',
		name: '考试',
		component: examination
	},
]

const router = createRouter({
	history: createWebHashHistory(process.env.BASE_URL),
	routes
})

export default router
