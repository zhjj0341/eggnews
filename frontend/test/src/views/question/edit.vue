<template>
  <div v-loading.body="loading">
    <el-form ref="gameForm" :model="form" label-width="100px">
        <el-form-item label="题目详情" prop="desc">
            <el-input v-model="form.desc"></el-input>
        </el-form-item>
        <el-form-item label="题目类型" prop="type">
            <el-select v-model="form.type">
                <el-option
                    v-for="(item, key) in QUESTION_TYPE"
                    :key="item+key"
                    :label="utils.generateTitle(item, 'question.type')"
                    :value="item"
                ></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="题目">
            <el-form-item label="题目类型" label-width="80px">
                <el-select v-model="form.question.type">
                    <el-option
                        v-for="(item, key) in CONTENT_TYPE"
                        :key="item+key"
                        :label="utils.generateTitle(item, 'question.content_type')"
                        :value="item"
                    ></el-option>
                </el-select>
            </el-form-item>
            <el-form-item
                v-for="(question, index) in form.question.list"
                class="split-pane"
                :label="'问题' + (index + 1)"
                :key="index"
                 label-width="50px"
            >
                <el-input v-model="form.question.list[index].content" placeholder="请输入内容" autosize></el-input>
                 <!-- <br/>
                <el-form-item label="选项" label-width="50px">
                    <el-form-item
                        v-for="(candidate, index) in question['candidate']"
                        class="split-pane2"
                        :label="'选项' + (index + 1)"
                        :key="index"
                        label-width="50px"
                    >
                        <el-select v-model="candidate.type">
                            <el-option
                                v-for="(item, key) in CONTENT_TYPE"
                                :key="item"
                                :label="utils.generateTitle(item, 'question.content_type')"
                                :value="item"
                            ></el-option>
                        </el-select>
                        <el-input v-model="candidate.content" placeholder="请输入内容" autosize></el-input>
                        <el-button type="warning" @click.prevent="removeItems(candidate, question['candidate'])">删除</el-button>
                    </el-form-item>
                    <el-button type="success" @click="addContent(question['candidate'])">新增选项</el-button>
                </el-form-item> -->
                <el-button type="warning" @click.prevent="removeItems(question, form.question.list)">删除</el-button>
            </el-form-item>
            <el-button type="success" @click="addContent(form.question.list)">新增题目</el-button>
        </el-form-item>

        <el-form-item label="选项">
            <el-form-item label="选项类型" label-width="80px">
                <el-select v-model="form.candidate.type">
                    <el-option
                        v-for="(item, key) in CONTENT_TYPE"
                        :key="item+key"
                        :label="utils.generateTitle(item, 'question.content_type')"
                        :value="item"
                    ></el-option>
                </el-select>
            </el-form-item>
            <el-form-item
                v-for="(candidate, index) in form.candidate.list"
                class="split-pane"
                :label="'选项' + (index + 1)"
                :key="index"
                 label-width="50px"
            >
                <el-input v-model="form.candidate.list[index].content" placeholder="请输入内容" autosize></el-input>
                <el-button type="warning" @click.prevent="removeItems(candidate, form.candidate.list)">删除</el-button>
            </el-form-item>
            <el-button type="success" @click="addContent(form.candidate.list)">新增选项</el-button>
        </el-form-item>
        <pre v-html="preview"></pre>
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
import { QUESTION_TYPE, CONTENT_TYPE } from '@/views/question/config'
export default {
  name: 'editQuestion',
  data () {
    return {
      QUESTION_TYPE,
      CONTENT_TYPE,
      loading: false,
      form: {
        id: '',
        type: QUESTION_TYPE['RADIO1'],
        desc: '',
        question: {
          type: CONTENT_TYPE['TEXT'],
          list: []
        },
        candidate: {
          type: CONTENT_TYPE['TEXT'],
          list: []
        },
        answer: []
      }
    }
  },
  computed: {
    preview () {
      return JSON.stringify(this.form, null, 6)
    }
  },
  methods: {
    removeItems (item, parentArray) {
      var index = parentArray.indexOf(item)
      if (index !== -1) {
        parentArray.splice(index, 1)
      }
    },
    addContent (parentArray) { // 添加内容
      parentArray.push({
        num: Date.now() + parseInt(Math.random() * 100),
        content: ''
      })
    },
    submitForm () {
      this.$refs['gameForm'].validate((valid) => {
        if (!valid) return false
      })
    }
  }
}
</script>

<style lang="less">
.el-form .el-form-item{
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
</style>
