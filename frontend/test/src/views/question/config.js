export const QUESTION_TYPE = {
  'RADIO1': 1, // 单选，(每个题目有自己的选项)
  'RADIO2': 2, // 单选，所有题目共用选项（不能重复选？）
  'INPUT1': 3, // 填空，（答案有可能不唯一的,用数组验证？）
  'CHECKBOX1': 4// 多选 (怎么验证答案？数组全等？)
}

export const CONTENT_TYPE = {
  'TEXT': 1, // 文本，
  'IMG': 2// 图片
}
