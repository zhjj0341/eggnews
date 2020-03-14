<template>
  <div>
    <el-table :data="all_results" style="width: 100%" height="250">
      <el-table-column fixed prop="user_id" label="用户ID" width="150"></el-table-column>
      <el-table-column label="答题总分" width="120">
        <template slot-scope="{row}">{{lodash.sum(calculateMarks(row.exam_result))}}</template>
      </el-table-column>
      <el-table-column label="实际答题情况" width="120">
        <template slot-scope="{row}">{{translateTrueFalse(row.exam_result)}}</template>
      </el-table-column>
      <el-table-column label="实际答题得分" width="120">
        <template slot-scope="{row}">{{calculateMarks(row.exam_result)}}</template>
      </el-table-column>
      <el-table-column label="题目难度" width="120">
        <template slot-scope="{row}">{{revertDifficulty(row.exam_result)}}</template>
      </el-table-column>
      <el-table-column label="测验知识点" width="120">
        <template slot-scope="{row}">{{lodash.uniq(row.exam_result.adminitered_knowledpoints)}}</template>
      </el-table-column>
      <el-table-column label="知识点分布情况" width="120">
        <template slot-scope="{row}">{{aggregateKnowledgePoint(row.exam_result)}}</template>
      </el-table-column>
      <el-table-column label="知识点得分情况" width="120">
        <template slot-scope="{row}">{{aggregateMarksByKnowledgePoint(row.exam_result)}}</template>
      </el-table-column>
      <el-table-column label="用户估计特质" width="120">
        <template slot-scope="{row}">{{row.exam_result.est_theta}}</template>
      </el-table-column>

      <el-table-column prop="time" label="测验时间" width="120"></el-table-column>
    </el-table>

    <!-- <p>{{exam_result}}</p>
    <p>答题总分 {{lodash.sum(exam_result.question_marks)}}<br></p>
    <p>实际答题情况（对错）{{translateTrueFalse()}} [错 错]<br></p>
    <p>实际答题得分 question_marks {{calculateMarks()}}<br></p>
    <p>题目难度 question_difficulties {{revertDifficulty()}} <br></p>
    <p>测验知识点 {{lodash.uniq(exam_result.adminitered_knowledpoints)}}<br></p>
    <p>知识点得分情况 {{aggregateMarksByKnowledgePoint()}}<br></p>
    <p>用户估计特质 {{exam_result.est_theta}}<br></p>
    <p>用户名<br></p>-->
    <!-- <p :class=exam_result.user_responses></p> -->
  </div>
</template>

<script>
import { getResult } from '@/api/result'
import lodash from 'lodash'
export default {
  name: 'ExamResult',
  data () {
    return {
      // exam_result: {
      //   'user_responses': [false, false],
      //   'adminitered_knowledpoints': ['标点符号', '认读生字'],
      //   'question_ids': ['5e57426293ba5f045e4cfd28', '5e57133793ba5f045e4cfd12'],
      //   'est_theta': 0.02054491453239442,
      //   'question_difficulties': [0.04149230237348922, 0.18812488928906523],
      //   'question_marks': [0.12447690712046766, 0.5643746678671957],
      //   'user_scores': [0, 0]
      // },
      lodash: lodash,
      exam_result: this.$route.params.exam_result,
      all_results: null
    }
  },
  created () {
    if (!this.exam_result) {
      getResult().then(({ res, err }) => {
        if (!err) {
          // console.log(res)
          this.all_results = res
        }
      })
    } else {
      this.all_results = this.exam_result
    }
  },
  methods: {
    translateTrueFalse (row) {
      console.log(row)
      return row.user_responses.map(item => {
        return item === false ? '错' : '对'
      })
    },
    revertDifficulty (row) {
      return row.question_difficulties.map(element => {
        return Math.ceil(element * 3)
      })
    },
    calculateMarks (row) {
      var questionMarks = []
      row.question_difficulties.forEach((item, index) => {
        var user_response = row.user_responses[index] === false ? 0 : 1
        questionMarks.push(Math.ceil(item * 3) * user_response)
      })
      return questionMarks
    },
    aggregateKnowledgePoint (row) {
      var knowledgePoints = {}
      row.adminitered_knowledpoints.forEach((item, index) => {
        var mark = Math.ceil(row.question_difficulties[index] * 3)
        if (item in knowledgePoints) {
          knowledgePoints[item] += mark
        } else {
          knowledgePoints[item] = mark
        }
      })
      return knowledgePoints
    },
    aggregateMarksByKnowledgePoint (row) {
      var knowledgePoints = {}
      var user_marks = this.calculateMarks(row)
      row.adminitered_knowledpoints.forEach((item, index) => {
        if (item in knowledgePoints) {
          knowledgePoints[item] += user_marks[index]
        } else {
          knowledgePoints[item] = user_marks[index]
        }
      })
      return knowledgePoints
    }
  }
}
</script>

<style lang="less">
</style>
