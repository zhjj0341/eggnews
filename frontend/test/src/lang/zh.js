import enLocale from 'element-ui/lib/locale/lang/zh-CN'
export default {
  message: 'hello',
  question: {
    type: {
      '1': '单选，(每个题目有自己的选项)', // 单选，(每个题目有自己的选项)
      '2': '单选，所有题目共用选项（不能重复选？）', // 单选，所有题目共用选项（不能重复选？）
      '3': '填空', // 填空，（答案有可能不唯一的,用数组验证？）
      '4': '多选'// 多选 (怎么验证答案？数组全等？)
    },
    content_type: {
      1: '文字',
      2: '图片'
    }
  },
  ...enLocale
}
