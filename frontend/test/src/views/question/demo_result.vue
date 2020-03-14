<template>
  <div>
  </div>
</template>

<script>
import { getResult } from '@/api/result'
export default {
  name: 'ExamResult',
  data () {
    return {
      tableData: [
        {
          name: 'tom',
          age: 1
        },
        {
          name: 'anne',
          age: 2
        }
      ]
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
