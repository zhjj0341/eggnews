<template>
<div>
    <p>{{exam_result}}</p>
    <p>答题总分 {{lodash.sum(exam_result.question_marks)}}<br></p>
    <p>实际答题情况（对错）{{translateTrueFalse()}} [错 错]<br></p>
    <p>实际答题得分 question_marks {{calculateMarks()}}<br></p>
    <p>题目难度 question_difficulties {{revertDifficulty()}} <br></p>
    <p>测验知识点 {{lodash.uniq(exam_result.adminitered_knowledpoints)}}<br></p>
    <p>知识点得分情况 {{aggregateMarksByKnowledgePoint()}}<br></p>
    <p>用户估计特质 {{exam_result.est_theta}}<br></p>
    <p>用户名<br></p>
    <p>{{showResult()}}</p>
    <!-- <p :class=exam_result.user_responses></p> -->
</div>
</template>

<script>
// import { nextQuestion } from '@/api/question'
import lodash from 'lodash'
export default {
  name: 'ExamResult',
  data () {
    return {
      exam_result: {
        'user_responses': [false, false],
        'adminitered_knowledpoints': ['标点符号', '认读生字'],
        'question_ids': ['5e57426293ba5f045e4cfd28', '5e57133793ba5f045e4cfd12'],
        'est_theta': 0.02054491453239442,
        'question_difficulties': [0.04149230237348922, 0.18812488928906523],
        'question_marks': [0.12447690712046766, 0.5643746678671957],
        'user_scores': [0, 0]
      },
      lodash: lodash,
      result: this.$route.params
    }
  },
  created () {

  },
  methods: {
    translateTrueFalse () {
      return this.exam_result.user_responses.map((item) => {
        return item === false ? '错' : '对'
      })
    },
    revertDifficulty () {
      return this.exam_result.question_difficulties.map(element => {
        return Math.ceil(element * 3)
      })
    },
    calculateMarks () {
      var questionMarks = []
      this.exam_result.question_difficulties.forEach((item, index) => {
        var user_response = this.exam_result.user_responses[index] === false ? 0 : 1
        questionMarks.push(Math.ceil(item * 3) * user_response)
      })
      return questionMarks
    },
    aggregateMarksByKnowledgePoint () {
      var knowledgePoints = {}
      this.exam_result.adminitered_knowledpoints.forEach((item, index) => {
        var mark = Math.ceil(this.exam_result.question_difficulties[index] * 3)
        if (item in knowledgePoints) {
          knowledgePoints[item] += mark
        } else {
          knowledgePoints[item] = mark
        }
      })
      return knowledgePoints
    },
    showResult () {
      console.log(this.$route)
      alert(JSON.stringify(this.result))
    }
  }
}
</script>

<style lang="less">

</style>
