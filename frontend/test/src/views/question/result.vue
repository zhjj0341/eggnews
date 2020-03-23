<template>
  <div>
    <el-table :data="all_results" style="width: 100%">
      <el-table-column fixed prop="user_id" label="用户名" width="120"></el-table-column>
      <el-table-column label="答题总分" width="120">
        <template slot-scope="{row}">{{row.totalMark}}</template>
      </el-table-column>
      <el-table-column label="答题详情" width="120">
        <template slot-scope="{row}">
          <el-button type="text" @click="handleClick (row)">查看答题详情</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="lastEstTheta" label="最后估计特质" width="120"></el-table-column>
      <el-table-column prop="time" label="测验时间" width="120"></el-table-column>
    </el-table>

    <!-- <hamburger class="hamburger-container" :toggleClick="toggleSideBar" :isActive="sidebar.opened"></hamburger> -->

    <el-dialog
      id="eModal"
      title="作答详情"
      :visible.sync="dialog.visible"
      :before-close="handleClose"
      width="90%"
    >
      <template v-if="dialog['step'] === 2">
        <el-button type="info" plainsize="mini" round @click="dialog['step'] = 1">goback</el-button>
        <testQuestion :detailId="dialog['question_id']" :userResponse="dialog['user_response']"></testQuestion>
      </template>
      <!-- <span id="modal-body">{{selectedRow}}</span> -->
      <el-steps
        v-else
        direction="vertical"
        :active="dialog.data?dialog.data.length:0"
        process-status="process"
        finish-status="process"
      >
        <el-step
          v-for="(item,index) in dialog.data"
          :key="index"
          :icon="item['answer']?'el-icon-circle-check':'el-icon-circle-close'"
        >
          <!-- <p slot="title">{{'题号: ' + (index + 1) }}</p> -->
          <template slot="title">
            <span style="margin-right: 10px">{{'题号: ' + (index + 1) }}</span>
            <el-button type="info" plainsize="mini" round @click="handleClickDetail (item)">题目详情</el-button>
          </template>
          <div slot="description">
            <p>估计特质: {{item['this_theta']}}</p>
            <p>题目难度: {{item['displayedDifficulty']}}</p>
            <p>单题得分: {{item['mark']}}</p>
            <p>用户答案: {{item['usrRspn']}}</p>
            <p>知识点: {{item['administeredKnowledgePoint']}}</p>
          </div>
        </el-step>
      </el-steps>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialog.visible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getResult } from '@/api/result'
import testQuestion from '@/views/question/test.vue'
import lodash from 'lodash'
export default {
  name: 'ExamResult',
  data () {
    return {
      // {"status":200,"data":[{"_id":"5e771eac0a194623a94cdb77","time":"2020-03-22T08:15:40.169Z","user_id":{"name":"Carolyn"},"exam_result":[{"answer":0,"difficulty":0.030375525809274162,"knowledge_point":"认词+常识","question_id":"5e57329993ba5f045e4cfd21","raw_response":{"1582772757758":1582772671965,"1582772782153":1582772671965,"1582772798813":1582772671965,"1582772805824":1582772671965,"1582772814738":1582772671965},"this_theta":0.030375525809274162},{"answer":0,"difficulty":0.07451457066853069,"knowledge_point":"认读拼音","question_id":"5e57451e93ba5f045e4cfd2b","raw_response":{"1582777502366":1582777371549,"1582777527763":1582777371549,"1582777537826":1582777371549},"this_theta":0.024070116719716986}],"__v":0}],"message":"success"}
      lodash: lodash,
      exam_result: this.$route.params.exam_result,
      all_results: null,
      count: 0,
      /**
       * 弹窗现在有两种内容
       * 1.答题的详情分析，通过el-steps显示的
       * 2.某一条题目用户的答题情况，通过components testQuestion（views/question/test.vue）显示的
       */
      dialog: {
        visible: false, // 控制dialog显示的
        data: null, // 点击某一行“查看答题详情”时，保存着那条row的exan_result原数据,
        question_id: null, // 点击“题目详情”时，保存对应的question_id，绑定在testQuestion组件，用于获取相应题目
        user_response: null, // 点击“题目详情”时，保存对应的user_response，绑定在testQuestion组件，用于答案的显示
        step: 1// 控制el-steps跟testQuestion的显示，因为同时只显示一个用v-if控制
      }
      // dialog.visible: false,
      // selectedRow: null
    }
  },
  components: {
    testQuestion
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

    this.all_results = this.all_results.map(item => { return this.processAllResult(item) })
    console.log(this.all_results)
    // console.log(this.all_results.map(item => { return this.processAllResult(item) }))
  },
  methods: {
    handleClickDetail (item) {
      this.dialog['step'] = 2
      this.dialog['question_id'] = item['question_id']
      this.dialog['user_response'] = item['raw_response']
    },
    processAllResult ({ exam_result: _, time, user_id }) {
      var _lastEstTheta = _[_.length - 1]['this_theta']
      // var _displayedMsg = []
      var totalMark = 0

      var result = _.map((item, index) => {
        var displayedDifficulty = Math.ceil(item['difficulty'] * 3)
        var usrRspn = item['answer'] === 0 ? '错' : '对'
        var mark = displayedDifficulty * item['answer']
        var administeredKnowledgePoint = item['knowledge_point']
        totalMark += mark
        return Object.assign(item, {
          mark,
          displayedDifficulty,
          usrRspn,
          administeredKnowledgePoint
        })
      })

      return {
        lastEstTheta: _lastEstTheta,
        user_id: user_id ? user_id.name : 'Anonymous',
        time: time,
        // detail: _displayedMsg,
        totalMark: totalMark,
        exam_result: result
      }
    },
    showDict (dictObject) {
      var dictToStr = ''
      for (let key in dictObject) {
        dictToStr += (key + ':' + dictObject[key] + '<br>')
      }
      return dictToStr
    },
    handleClose (done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
        })
        .catch(_ => { })
    },
    handleClick (row) {
      this.dialog.visible = true
      this.dialog.data = row.exam_result
      // this.selectedRow = row.detail
      // console.log(typeof (this.selectedRow))
      // console.log(this.selectedRow, this.dialog.data)
    }
  }
}
</script>

<style lang="less">
</style>
