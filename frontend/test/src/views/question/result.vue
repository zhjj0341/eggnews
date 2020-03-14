<template>
  <div>
    <el-table :data="all_results" style="width: 100%" height="250">
      <el-table-column fixed prop="user_id" label="用户ID" width="150"></el-table-column>
      <el-table-column label="答题总分" width="120">
        <template slot-scope="{row}">{{lodash.sum(processAllResult(row)['question_marks'])}}</template>
      </el-table-column>
      <el-table-column label="实际答题情况" width="120">
        <template slot-scope="{row}">{{processAllResult(row)['user_responses']}}</template>
      </el-table-column>
      <el-table-column label="实际答题得分" width="120">
        <template slot-scope="{row}">{{processAllResult(row)['question_marks']}}</template>
      </el-table-column>
      <el-table-column label="题目难度" width="120">
        <template slot-scope="{row}">{{processAllResult(row)['displayed_question_difficulties']}}</template>
      </el-table-column>
      <el-table-column label="测验知识点" width="120">
        <template slot-scope="{row}">{{lodash.uniq(row.exam_result.adminitered_knowledpoints)}}</template>
      </el-table-column>
      <el-table-column label="知识点分布情况" width="120">
        <template slot-scope="{row}">{{processAllResult(row)['knowledgePoints']}}</template>
      </el-table-column>
      <el-table-column label="知识点得分情况" width="120">
        <template slot-scope="{row}">{{processAllResult(row)['knowledgePointsMarks']}}</template>
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
  async created () {
    if (!this.exam_result) {
      await getResult().then(({ res, err }) => {
        if (!err) {
          this.all_results = res
        }
      })
    } else {
      this.all_results = this.exam_result
    }
    // console.log(this.all_results.map(item => { return this.processAllResult(item) }))
  },
  methods: {
    processAllResult ({ exam_result: _ }) {
      var _usrRspn = []
      var _disQuesDiff = []
      var _quesMrk = []
      var _kP = {}
      var _kPM = {}
      // console.log(row)
      _.adminitered_knowledpoints.forEach((item, index) => {
        if (_.user_responses[index] === false) {
          _usrRspn[index] = '错'
          _quesMrk[index] = 0
        } else {
          _usrRspn[index] = '对'
          _quesMrk[index] = Math.ceil(_.question_difficulties[index] * 3)
        }

        if (item in _kP) {
          _kP[item] += 1
          _kPM[item] += _quesMrk[index] * _quesMrk[index]
        } else {
          _kP[item] = 1
          _kPM[item] = _quesMrk[index] * _quesMrk[index]
        }
        // _usrRspn[index] = _.user_responses[index] === false ? '错' : '对'
        _disQuesDiff[index] = Math.ceil(_.question_difficulties[index] * 3)
      })
      return {
        user_responses: _usrRspn,
        displayed_question_difficulties: _disQuesDiff,
        question_marks: _quesMrk,
        knowledgePoints: _kP,
        knowledgePointsMarks: _kPM
      }
    }
  }
}
</script>

<style lang="less">
</style>
