<template>
  <div class="m-question-edit" v-loading.body="loading">
    <el-form ref="form" :model="form" label-width="100px">
      <el-form-item label="题目详情" prop="desc">{{form.desc}}</el-form-item>
      <el-form-item label="难易度" prop="difficulty">{{utils.generateTitle(form.difficulty, 'question.difficulty')}}</el-form-item>
      <el-form-item label="题目类型" prop="type">{{utils.generateTitle(form.type, 'question.type')}}</el-form-item>
      <el-form-item label="题目">
        <el-table :data="form.question" style="width: 100%" border stripe>
          <el-table-column type="index" width="50"></el-table-column>
          <el-table-column label="问题" width="250">
            <template slot-scope="scope">
              <el-input v-model="scope.row.content" placeholder="请输入内容" autosize></el-input>
            </template>
          </el-table-column>
          <el-table-column label="答案">
            <template slot-scope="{row}">
              <el-radio-group
                v-if="QUESTION_TYPE['RADIO']===form['type']"
                v-model="answer[row['num']]"
              >
                <el-radio-button
                  v-for="(item,index) in getCandidate(row)"
                  :key="index"
                  :label="item.num"
                >{{item.content}}</el-radio-button>
              </el-radio-group>
              <el-checkbox-group
                v-else-if="QUESTION_TYPE['CHECKBOX']===form['type']"
                v-model="answer[row['num']]"
              >
                <el-checkbox
                  v-for="(item,index) in getCandidate(row)"
                  :key="index"
                  :label="item.num"
                >{{item.content}}</el-checkbox>
              </el-checkbox-group>
              <el-input
                v-else-if="QUESTION_TYPE['INPUT']===form['type']"
                v-model.trim="answer[row['num']]"
              ></el-input>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button
          @click="submitForm"
          type="primary"
          class="wrap-width"
          v-loading="loading"
        >{{$t('submit')}}</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { testQuestion, showQuestion } from '@/api/question'
import { QUESTION_TYPE, QUESTION_LEVEL, CONTENT_TYPE, CANDIDATE_TYPE } from '@/views/question/config'
export default {
  name: 'editQuestion',
  data () {
    return {
      QUESTION_TYPE,
      CONTENT_TYPE,
      QUESTION_LEVEL,
      CANDIDATE_TYPE,
      loading: false,
      form: {
        difficulty: QUESTION_LEVEL['LOW'],
        type: QUESTION_TYPE['RADIO'],
        candidate_type: CANDIDATE_TYPE['SPLIT'],
        desc: '',
        question: [],
        candidate: {},
        candidate_group: []
      },
      answer: {}
    }
  },
  created () {
    if (this.$route.query['id']) {
      this.loading = true
      showQuestion(this.$route.query['id']).then(({ res, err }) => {
        this.loading = false
        if (!err) {
          this.$set(this, 'form', Object.assign(this.form, res))
          let _answer_type = this.getAnswerType()
          for (let q of this.form['question']) {
            this.$set(this.answer, q['num'], _answer_type)
          }
        }
      })
    } else {
      this.$router.go(-1)
    }
  },
  computed: {
    isSplitCandidate () {
      return Number(this.form.candidate_type) === Number(CANDIDATE_TYPE['SPLIT'])
    },
    preview () {
      return JSON.stringify(this.form, null, 6)
    }
  },
  methods: {
    getCandidate (question) { // 根据不同的选项类型，去展示答案列表
      if (this.form['type'] === QUESTION_TYPE['INPUT']) {
        return []
      } else if (this.isSplitCandidate) {
        return this.form.candidate[question['num']] || []
      } else {
        return this.form.candidate_group
      }
    },
    getAnswerType () { // 获取答案的类型，因为不同类型的题目答案类型不一样
      switch (this.form['type']) {
        case QUESTION_TYPE['RADIO']:
          return ''
        case QUESTION_TYPE['CHECKBOX']:
          return []
        case QUESTION_TYPE['INPUT']:
          return ''
        default:
          return ''
      }
    },
    submitForm () {
      this.$refs['form'].validate((valid) => {
        if (!valid) return false
        this.loading = true
        testQuestion(this.answer).then(({ res, err }) => {
          this.loading = false
          if (!err) {
            this.utils.successMsg()
          }
        })
      })
    }
  }
}
</script>

<style lang="less">
.m-question-edit {
  .el-table {
    .cell {
      display: flex;
      flex-wrap: wrap;
      & > * {
        margin-bottom: 5px;
      }
    }
    .candidate-col {
      .cell {
        flex-direction: column;
        align-items: baseline;
      }
    }
  }
  .el-form .el-form-item {
    .el-radio-button--mini .el-radio-button__inner {
      padding: 5px;
    }
    .split-pane,
    .split-pane2 {
      background: #fdf6ec;
      margin-bottom: 5px;
      padding: 5px;
      .el-select {
        .el-input {
          width: 100px;
        }
      }
    }
    .split-pane2 {
      padding: 0 5px;
    }
  }
}
</style>
