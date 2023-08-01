export default {
	notice: {
		title: "我须留意",
		path: "#Notice",
		children: [
			{
				title: "✉️查看消息",
				path: "xsxxviewAction.do",
			},
			{
				title: "📂常用文件下载",
				path: "ileUploadDownloadAction.do?actionType=4",
			},
		],
	},
	course: {
		title: "选课管理",
		path: "#Course",
		children: [
			{
				title: "📗本学期课表",
				path: "xkAction.do?actionType=6",
			},
			{
				title: "📚历年课表",
				path: "lnkbcxAction.do",
			},
			{
				title: "选课公告",
				path: "ggglAction.do?actionType=4",
			},
			{
				title: "网上选课",
				path: "xkAction.do",
			},
			{
				title: "退课",
				path: "xkAction.do?actionType=7",
			},
		],
	},
	personal: {
		title: "个人管理",
		path: "#Personal",
		children: [
			{
				title: "🖨️学籍信息",
				path: "xjInfoAction.do?oper=xjxx",
			},
			{
				title: "学籍异动",
				path: "xjInfoAction.do?oper=ydxx",
			},
			{
				title: "🏆奖惩信息",
				path: "xjInfoAction.do?oper=jcxx",
			},
			{
				title: "辅修方案注册",
				path: "xsFabgsqAction.do?oper=faxdsq1",
			},
		],
	},
	exam: {
		title: "考务管理",
		path: "#Exam",
		children: [
			{
				title: "✍️考试安排",
				path: "ksApCxAction.do?oper=getKsapXx",
			},
			{
				title: "考试报名",
				path: "kwBmAction.do?oper=getKsList",
			},
			{
				title: "考试成绩",
				path: "cjSearchAction.do?oper=getKscjList",
			},
		],
	},
	resource: {
		title: "教学资源",
		path: "#Resource",
		children: [
			{
				title: "🏫教室课表",
				path: "jskbcxAction.do?oper=jskb_lb",
			},
			{
				title: "教师课表",
				path: "lskbcxAction.do?oper=lskb_lb",
			},
			{
				title: "班级课表",
				path: "jkbcxAction.do?oper=bjkb_lb",
			},
			{
				title: "课程课表",
				path: "kckbcxAction.do?oper=kckb_lb",
			},
			{
				title: "自习教室查询",
				path: "xszxcxAction.do?oper=xszxcx_lb",
			},
			{
				title: "教室使用查询",
				path: "jxlCxAction.do?oper=ori",
			},
		],
	},
	review: {
		title: "教学评估",
		path: "#Review",
		children: [
			{
				title: "📤评估公告",
				path: "ggglAction.do?actionType=5",
			},
			{
				title: "教学评估",
				path: "jxpgXsAction.do?oper=listWj",
			},
			{
				title: "毕业生评估",
				path: "byspgXsAction.do?oper=listWj",
			},
			{
				title: "教材评估",
				path: "studentAction.do?oper=stu",
			},
		],
	},
	query: {
		title: "综合查询",
		path: "#Query",
		children: [
			{
				title: "🪴全部及格成绩",
				path: "gradeLnAllAction.do?type=ln&oper=qbinfo&lnxndm=2022-2023%D1%A7%C4%EA%C7%EF(%C1%BD%D1%A7%C6%DA)",
			},
			{
				title: "课程属性成绩",
				path: "gradeLnAllAction.do?type=ln&oper=sx",
			},
			{
				title: "方案成绩",
				path: "gradeLnAllAction.do?type=ln&oper=fa",
			},
			{
				title: "不及格成绩",
				path: "gradeLnAllAction.do?type=ln&oper=bjg",
			},
			// {
			// 	title: "本学期成绩",
			// 	path: "bxqcjcxAction.do",
			// },
			{
				title: "方案完成情况",
				path: "gradeLnAllAction.do?type=ln&oper=lnfaqk&flag=zx",
			},
			{
				title: "指导性教学计划",
				path: "gradeLnAllAction.do?type=ln&oper=lnFajhKcCjInfo&lnxndm=2022-2023%D1%A7%C4%EA%C7%EF(%C1%BD%D1%A7%C6%DA)",
			},
			// {
			// 	title: "本学期课程安排",
			// 	path: "courseSearchAction.do?temp=1",
			// },
			{
				title: "课程基本信息",
				path: "kclbAction.do",
			},
			{
				title: "收费标准查询",
				path: "sfCxAction.do?oper=current",
			},
			{
				title: "审查体系",
				path: "scTxQueryAction.do?oper=CurrentScTxQuery",
			},
			{
				title: "审查结论",
				path: "scJlQueryAction.do?oper=CurrentScJlQuery",
			},
		],
	},
};
