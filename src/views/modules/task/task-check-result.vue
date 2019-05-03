<template>
  <el-dialog
    :title="!dataForm.id ? '执行结果' : '执行结果'"
    :close-on-click-modal="false"
    :visible.sync="visible">

    <el-form :inline="true" label-width="150px"  ref="dataForm" :model="dataForm">
      <el-form-item label="处理器名称">
        <el-input v-model="dataForm.handlerName" readonly="readonly"></el-input>
      </el-form-item>
      <el-form-item label="任务执行参数" prop="executorParam">
          <el-input v-model="dataForm.executorParam" type="textarea" :rows="2" readonly="readonly"></el-input>
      </el-form-item>
      <el-form-item label="执行器执行结果" prop="taskExecuteResult">
        <el-input v-model="dataForm.taskExecuteResult" type="textarea"  readonly="readonly"></el-input>
      </el-form-item>
    </el-form>
    

  </el-dialog>
</template>

<script>
  export default {
    data () {
      return {
        visible: false,
        dataForm: {
          id: 0,
          addTime: '',
          updateTime : '',
          handlerName: '',
          executorParam: '',
          executorTimeout: '',
          executorFailRetryCount: '',
          taskStatus: "0",
          taskExecuteResult: '',
        },
      }
    },
    methods: {
      init (dataForm) {
        this.dataForm = dataForm
        this.visible = true
      },
      // 表单提交
      
    }
  }
</script>
