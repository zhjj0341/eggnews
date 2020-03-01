import enLocale from 'element-ui/lib/locale/lang/zh-CN'
export default {
  message: 'hello',
  submit: '提交',
  submitSuc: '操作成功',
  module: {
    'Home': '首页',
    'QuestionList': '题目列表',
    'AddQuestion': '添加题目',
    'TestQuestion': '测试题目'
  },
  question: {
    type: {
      '1': '单选', // 单选，
      '2': '多选', // 多选
      '3': '填空' // 填空
    },
    level: {
      '1': '易',
      '2': '中',
      '3': '难'
    },
    discrimination: {
      '1': '易',
      '2': '中',
      '3': '难'
    },
    content_type: {
      1: '文字',
      2: '图片'
    },
    candidate_type: {
      '1': '独立选项',
      '2': '公共选项'
    }
  },
  ...enLocale
}
