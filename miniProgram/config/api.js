// 以下是业务服务器API地址
// 本机开发时使用
var WxApiRoot = 'https://admin.lyzxy.com.cn/';
var WxApiImg = 'https://qiniu.lyzxy.com.cn/' //图片存储地址
// 局域网测试使用
// var WxApiRoot = 'http://192.168.3.24/';
// var WxApiImg = 'http://192.168.3.24/uploads/' //图片存储地址
module.exports = {
  AuthLoginByWeixin: WxApiRoot + 'api/v1/login', //微信登录
  IndexHome: WxApiRoot + 'api/v1/home', //首页数据
  CoursesLists: WxApiRoot + 'api/v1/courses/lists', //课程列表
  CoursesDetail: WxApiRoot + 'api/v1/courses/detail', //课程详情
  CoursesWatchClasses: WxApiRoot + 'api/v1/courses/watch_classes', //课时试看
  CoursesWatchEnd: WxApiRoot + 'api/v1/courses/watch_end', //观看结束
  CoursesComment: WxApiRoot + 'api/v1/courses/comment', //课程评论
  ClassesQuestions: WxApiRoot + 'api/v1/classes/questions', //课后作业
  ClassesquestionsSubmit: WxApiRoot + 'api/v1/classes/questions_submit', //作业提交
  EventsLists: WxApiRoot + 'api/v1/events/lists', //活动列表
  EventsDetail: WxApiRoot + 'api/v1/events/detail', //活动详情
  EventsComment: WxApiRoot + 'api/v1/events/comment', //活动评论
  EventsSubmit: WxApiRoot + 'api/v1/events/submit', //活动提交
  EventsUserEvents: WxApiRoot + 'api/v1/events/user_events', //用户提交活动列表
  EventsDelete: WxApiRoot + 'api/v1/events/delete', //活动删除
  PostsLists: WxApiRoot + 'api/v1/posts/lists', //企业职位
  PostsDetail: WxApiRoot + 'api/v1/posts/detail', //职位详情
  CompanyDetail: WxApiRoot + 'api/v1/company/detail', //公司详情
  PostsIsCompany: WxApiRoot + 'api/v1/posts/is_company', //判断用户公司
  PostsSubmit: WxApiRoot + 'api/v1/posts/submit', //职位提交
  PostsCollect: WxApiRoot + 'api/v1/posts/collect', //职位收藏/取消收藏
  DutyLists: WxApiRoot + 'api/v1/duty/lists', //职务列表
  ResumeSubmit: WxApiRoot + 'api/v1/resume/submit', //简历提交
  ResumeLists: WxApiRoot + 'api/v1/resume/lists', //简历列表
  ResumeDetail: WxApiRoot + 'api/v1/resume/detail', //简历详情
  ResumeCollect: WxApiRoot + 'api/v1/resume/collect', //简历收藏/取消收藏
  ResumeApply: WxApiRoot + 'api/v1/resume/apply', //申请查看完成简历
  ResumeUserInfo: WxApiRoot + 'api/v1/resume/user_info', //简历用户信息提交
  CommonProvince: WxApiRoot + 'api/v1/common/province', //省列表
  CommonCity: WxApiRoot + 'api/v1/common/city', //城市列表
  CommonEducation: WxApiRoot + 'api/v1/common/education', //学历选择列表
  TradeLists: WxApiRoot + 'api/v1/trade/lists', //行业选择列表
  CommonExperience: WxApiRoot + 'api/v1/common/experience', //工作年限列表
  CommonWorkStatus: WxApiRoot + 'api/v1/common/work_status', //求职状态选择列表
  UserSubmitCard: WxApiRoot + 'api/v1/user/submit_card', //入学申请学籍卡提交
  UserCard: WxApiRoot + 'api/v1/user/card', //用户学籍卡
  CommonTeacher: WxApiRoot + 'api/v1/common/teacher', //讲师团
  CoursesApply: WxApiRoot + 'api/v1/courses/apply', //课程报名
  CoursesPay: WxApiRoot + 'api/v1/courses/pay', //课程订单支付
  EventsPay: WxApiRoot + 'api/v1/events/pay', //活动支付
  EventsApply: WxApiRoot + 'api/v1/events/apply', //活动报名
  EventsSponsor: WxApiRoot + 'api/v1/events/sponsor', //活动发起者
  SearchRecord: WxApiRoot + 'api/v1/search/record', //搜索记录
  SearchSubmit: WxApiRoot + 'api/v1/search/submit', //保存搜索建议记录
  SearchDelete: WxApiRoot + 'api/v1/search/delete', //清除搜索记录
  UserEvents: WxApiRoot + 'api/v1/user/events', //我的活动
  UserPosts: WxApiRoot + 'api/v1/user/posts', //我的招聘
  UserResume: WxApiRoot + 'api/v1/user/resume', //我的简历
  UserCollect: WxApiRoot + 'api/v1/user/collect', //我的收藏
  UserResumeDetail: WxApiRoot + 'api/v1/user/resume_detail', //简历编辑详情
  UserResumeUserinfo: WxApiRoot + 'api/v1/user/resume_userinfo', //简历个人信息
  UserUserinfo: WxApiRoot + 'api/v1/resume/user_info', //简历用户信息提交
  UserResumeDelete: WxApiRoot + 'api/v1/user/resume_delete', //简历删除
  UserResumeUpdate: WxApiRoot + 'api/v1/user/resume_update', //简历编辑提交
  UserPostsDelete: WxApiRoot + '/api/v1/user/posts_delete', //职位删除
  UserPostsDetail: WxApiRoot + 'api/v1/user/posts_detail', //招聘编辑详情
  UserPostsUpdate: WxApiRoot + 'api/v1/user/posts_update', //招聘编辑提交
  PostsSend: WxApiRoot + 'api/v1/posts/send', //简历投递
  ResumeIsShow: WxApiRoot + 'api/v1/resume/is_show', // 简历隐藏
  UserCourses: WxApiRoot + 'api/v1/user/courses', // 我的课程
  CoursesWatchGoon: WxApiRoot + 'api/v1/courses/watch_goon', // 继续学习
  CoursesWatchPass: WxApiRoot + 'api/v1/courses/watch_pass', // 观看暂停
  UserMessage: WxApiRoot + 'api/v1/user/message', // 我的消息
  UserMessageDelete: WxApiRoot + 'api/v1/user/message_delete', // 我的消息删除
  UserResumeApply: WxApiRoot + 'api/v1/user/resume_apply', // 审核查看完整简历
  UserUserInfo: WxApiRoot + 'api/v1/user-info', //获取用户信息
  UserMyTeam: WxApiRoot + 'api/v1/my-team', //我的粉丝
  UserWithdraw: WxApiRoot + 'api/v1/withdraw', //提现申请
  AccountList: WxApiRoot + 'api/v1/account-chang-list', //帐变明细表
  WithdrawList: WxApiRoot + 'api/v1/withdraw-list', //提现明细
  
  Uploads: WxApiRoot + 'api/v1/uploads', //图片上传
};