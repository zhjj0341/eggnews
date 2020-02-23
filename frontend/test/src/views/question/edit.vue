<template>
  <div class="m-question-edit" v-loading.body="loading">
    <el-form ref="form" :model="form" label-width="100px">
        <el-form-item label="题目详情" prop="desc">
            <el-input v-model="form.desc"></el-input>
        </el-form-item>
        <el-form-item label="难易度" prop="level">
            <el-radio-group v-model="form.level">
                <el-radio-button  v-for="(item, key) in QUESTION_LEVEL"
                    :key="item+key"
                    :label="item">
                    {{utils.generateTitle(item, 'question.level')}}
                </el-radio-button>
            </el-radio-group>
        </el-form-item>
        <el-form-item label="题目类型" prop="type">
            <el-radio-group v-model="form.type" @change="handleTypeChange">
                <el-radio-button  v-for="(item, key) in QUESTION_TYPE"
                    :key="item+key"
                    :label="item">
                    {{utils.generateTitle(item, 'question.type')}}
                </el-radio-button>
            </el-radio-group>
        </el-form-item>
        <el-form-item v-if="QUESTION_TYPE['INPUT']!==form['type']" label="选项类型" prop="candidate_type">
            <el-radio-group v-model="form.candidate_type" @change="handleCandidateTypeChange">
                <el-radio-button  v-for="(item, key) in CANDIDATE_TYPE"
                    :key="item+key"
                    :label="item">
                    {{utils.generateTitle(item, 'question.candidate_type')}}
                </el-radio-button>
            </el-radio-group>
            <el-form-item v-if="!isSplitCandidate">
                <div v-for="(candidate, index) in form['candidate_group']" :key="index">
                    选项{{index+1}}
                    <el-radio-group v-model="candidate['type']" size="mini">
                        <el-radio-button v-for="(item, key) in CONTENT_TYPE"
                            :key="item+key"
                            :label="item">
                            {{utils.generateTitle(item, 'question.content_type')}}
                        </el-radio-button>
                    </el-radio-group>
                    <el-input v-model="candidate['content']" placeholder="请输入内容" autosize></el-input>
                    <el-button type="warning" @click.prevent="removeContent(candidate, form['candidate_group'])">删除</el-button>
                </div>
                <el-button type="success" @click="addContent(form['candidate_group'])">新增选项</el-button>
            </el-form-item>
        </el-form-item>
        <el-form-item label="题目">
            <el-table
                :data="form.question"
                style="width: 100%"
                border
                stripe
                >
                <el-table-column type="index" width="50"></el-table-column>
                <el-table-column label="问题" width="250">
                    <template slot-scope="scope">
                        <el-radio-group slot="prepend"  v-model="scope.row.type" size="mini">
                            <el-radio-button v-for="(item, key) in CONTENT_TYPE"
                                :key="item+key"
                                :label="item">
                                {{utils.generateTitle(item, 'question.content_type')}}
                            </el-radio-button>
                        </el-radio-group>
                        <el-input v-model="scope.row.content" placeholder="请输入内容" autosize>
                        </el-input>
                    </template>
                </el-table-column>
                <template v-if="QUESTION_TYPE['INPUT']!==form['type'] && isSplitCandidate">
                    <el-table-column label="选项列表" class-name="candidate-col">
                        <template slot-scope="{row}">
                            <div v-for="(candidate, index) in form['candidate'][row['num']]" :key="index">
                                选项{{index+1}}
                                <el-radio-group v-model="candidate['type']" size="mini">
                                    <el-radio-button v-for="(item, key) in CONTENT_TYPE"
                                        :key="item+key"
                                        :label="item">
                                        {{utils.generateTitle(item, 'question.content_type')}}
                                    </el-radio-button>
                                </el-radio-group>
                                <el-input v-model="candidate['content']" placeholder="请输入内容" autosize></el-input>
                                <el-button type="warning" @click.prevent="removeContent(candidate, form['candidate'][row['num']])">删除</el-button>
                            </div>
                            <el-button type="success" @click="addContent(form['candidate'][row['num']])">新增选项</el-button>
                        </template>
                    </el-table-column>
                </template>
                <el-table-column label="答案">
                    <template slot-scope="{row}">
                        <!-- 单选多选都使用这个 -->
                        <el-select
                            v-model="form['answer'][row['num']]"
                            :multiple="[QUESTION_TYPE['INPUT'],QUESTION_TYPE['CHECKBOX']].includes(form['type'])"
                            :allow-create="QUESTION_TYPE['INPUT']===form['type']"
                            placeholder="请选择"
                            default-first-option
                            filterable>
                            <template v-for="(item,index) in getCandidate(row)">
                                <el-option v-if="item.content" :key="index" :label="item.content" :value="item.num"></el-option>
                            </template>
                        </el-select>
                    </template>
                </el-table-column>
                <el-table-column label="操作" fixed="right" width="60px">
                    <template slot-scope="scope">
                        <el-button type="danger" @click.prevent="removeQuestion(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-button type="success" @click="addQuestion()">新增题目</el-button>
        </el-form-item>
        <el-form-item>
            <el-button
            @click="submitForm"
            type="primary"
            class="wrap-width"
            v-loading="loading"
            >{{$t('submit')}}</el-button>
        </el-form-item>
        <pre v-html="preview"></pre>
    </el-form>
  </div>
</template>

<script>
import { addQuestion, editQuestion } from '@/api/question'
import { QUESTION_TYPE, QUESTION_LEVEL, CONTENT_TYPE, CANDIDATE_TYPE } from '@/views/question/config'
export default {
  name: 'editQuestion',
  data () {
    return {
      QUESTION_TYPE,
      CONTENT_TYPE,
      QUESTION_LEVEL,
      CANDIDATE_TYPE,
      isEdit: this.$route.params && this.$route.params['_id'],
      loading: false,
      //       {
      //       "id": "",
      //       "level": 2,
      //       "type": 1,
      //       "candidate_type": 1,
      //       "desc": "完成短句。",
      //       "question": [
      //             {
      //                   "num": 1582462673939,
      //                   "type": 1,
      //                   "content": "门（___）大。 "
      //             },
      //             {
      //                   "num": 1582462785556,
      //                   "type": 1,
      //                   "content": "他有三个儿（___）"
      //             }
      //       ],
      //       "candidate": {
      //             "1582462673939": [
      //                   {
      //                         "num": 1582462675759,
      //                         "type": 1,
      //                         "content": "太"
      //                   },
      //                   {
      //                         "num": 1582462757366,
      //                         "type": 1,
      //                         "content": "大"
      //                   }
      //             ],
      //             "1582462785556": [
      //                   {
      //                         "num": 1582462821564,
      //                         "type": 1,
      //                         "content": "子"
      //                   },
      //                   {
      //                         "num": 1582462829731,
      //                         "type": 1,
      //                         "content": "了"
      //                   }
      //             ]
      //       },
      //       "candidate_group": [],
      //       "answer": {
      //             "1582462673939": 1582462675759,
      //             "1582462785556": 1582462821564
      //       }
      // }
      form: {
        level: QUESTION_LEVEL['LOW'],
        type: QUESTION_TYPE['RADIO'],
        candidate_type: CANDIDATE_TYPE['SPLIT'],
        desc: '',
        question: [],
        candidate: {},
        candidate_group: [],
        answer: {}
      }
    }
  },
  created () {
    this.$set(this, 'form', Object.assign(this.form, this.$route.params))
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
    handleTypeChange (value) { // 当题目类型变化的时候，答案清空
      console.log(value, this.form.type)
      let _answer = {}
      let _answer_type = this.getAnswerType()
      for (let q of this.form['question']) {
        _answer[q['num']] = this.form['answer'][q['num']] || _answer_type
        this.$set(this.form, 'answer', _answer)
      }
    },
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
          return []
        default:
          return ''
      }
    },
    handleCandidateTypeChange (value) {
      if (value === CANDIDATE_TYPE['SPLIT']) {
        let _candidate = {}
        let _answer = {}
        let _answer_type = this.getAnswerType()
        for (let q of this.form['question']) {
          _candidate[q['num']] = this.form['candidate'][q['num']] || []
          _answer[q['num']] = this.form['answer'][q['num']] || _answer_type
          this.$set(this.form, 'candidate', _candidate)
          this.$set(this.form, 'answer', _answer)
        }
      } else if (value === CANDIDATE_TYPE['GROUP']) {

      }
    },
    removeContent (item, parentArray) { // 删除内容
      var index = parentArray.indexOf(item)
      if (index !== -1) {
        parentArray.splice(index, 1)
      }
    },
    addContent (parentArray) { // 添加内容
      let _num = Date.now() + parseInt(Math.random() * 100)
      parentArray.push({
        num: _num,
        type: CONTENT_TYPE['TEXT'],
        content: ''
      })
    },
    removeQuestion (item) {
      var index = this.form.question.indexOf(item)
      if (index !== -1) {
        this.form.question.splice(index, 1)
      }
      //   删除候选项跟答案
      if (this.isSplitCandidate) {
        delete this.form['candidate'][item['num']]
      }
      delete this.form['answer'][item['num']]
    },
    addQuestion (parentArray) { // 添加内容
      let _num = Date.now() + parseInt(Math.random() * 100)
      this.form.question.push({
        num: _num,
        type: CONTENT_TYPE['TEXT'],
        content: ''
      })
      if (this.isSplitCandidate) {
        this.$set(this.form['candidate'], _num, [])
      }
      this.$set(this.form['answer'], _num, this.getAnswerType())
    },
    submitForm () {
      this.$refs['form'].validate((valid) => {
        if (!valid) return false
        this.loading = true
        let action = this.isEdit ? editQuestion : addQuestion
        action(this.form).then(({ res, err }) => {
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
.m-question-edit{
    .el-table{
        .cell{
            display: flex;
            flex-wrap: wrap;
            &>*{
                margin-bottom: 5px;
            }
        }
        .candidate-col{
            .cell{
                flex-direction: column;
                align-items: baseline;
            }
        }
    }
    .el-form .el-form-item{
        .el-radio-button--mini .el-radio-button__inner{
            padding:5px;
        }
        .split-pane,.split-pane2{
            background:#fdf6ec;
            margin-bottom:5px;
            padding: 5px;
            .el-select {
                .el-input{
                    width:100px;
                }
            }
        }
        .split-pane2{
            padding: 0 5px;
        }
    }
}
</style>
