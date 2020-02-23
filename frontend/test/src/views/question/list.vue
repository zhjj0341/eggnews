<template>
  <div class="m-question-list" v-loading.body="loading">
            <el-button
            @click="getList"
            type="primary"
            v-loading="loading"
            >刷新</el-button>
          <el-table
              :data="tableData"
              style="width: 100%"
              border
              stripe
              >
              <el-table-column type="index" width="50"></el-table-column>
              <el-table-column prop="desc" label="题目详情"></el-table-column>
              <el-table-column label="难易度">
                  <template slot-scope="{row}">
                        {{utils.generateTitle(row['level'], 'question.level')}}
                    </template>
              </el-table-column>
              <el-table-column label="题目类型">
                  <template slot-scope="{row}">
                        {{utils.generateTitle(row['type'], 'question.type')}}
                    </template>
              </el-table-column>
              <el-table-column label="题目">
                  <div slot-scope="{row}" v-html="getQuestion(row)">
                  </div>
              </el-table-column>

              <el-table-column label="操作" fixed="right" width="60px">
                    <template slot-scope="scope">
                        <el-button type="primary" @click.prevent="editQuestion(scope.row)">编辑</el-button>
                        <el-button type="danger" @click.prevent="deleteQuestion(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
          </el-table>
  </div>
</template>

<script>
import { getQuestion, deleteQuestion } from '@/api/question'
import { CONTENT_TYPE } from './config'
export default {
  name: 'qestionList',
  data () {
    return {
      loading: false,
      tableData: []
    }
  },
  created () {
    this.getList()
  },
  methods: {
    getList () {
      this.loading = true
      getQuestion().then(({ res, err }) => {
        this.loading = false
        if (!err) {
          this.tableData = res
        }
      })
    },
    editQuestion (question) {
      this.$router.push({
        name: 'AddQuestion',
        params: question
      })
    },
    deleteQuestion (item) {
      this.loading = true
      deleteQuestion(item._id).then(({ res, err }) => {
        this.loading = false
        if (!err) {
          this.utils.successMsg()
          this.getList()
        }
      })
    },
    getQuestion (question) {
      let result = ''
      try {
        for (let item of question['question']) {
          if (item['type'] === CONTENT_TYPE['TEXT']) {
            result += item['content'] + '<br>'
          }
        }
      } catch (e) {}
      return result
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
        .el-input-group,.el-input,.el-input-number{
            width: 150px;
        }
        .el-button--mini, .el-button--mini.is-round{
            padding:5px;
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
