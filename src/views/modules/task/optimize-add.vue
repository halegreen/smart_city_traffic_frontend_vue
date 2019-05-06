<template>
  <el-dialog
    :title="!dataForm.id ? '设置算法优化参数' : '设置算法优化参数'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="100px">
      <el-form-item label="路口ID" prop="junctionId">
        <el-input v-model="dataForm.junctionId" placeholder="输入需要优化的路口id"></el-input>
      </el-form-item>
      <el-form-item label="时间段" prop="timeRange">
        <el-input v-model="dataForm.timeRange" placeholder="输入需要优化的该路口的时间段"></el-input>
      </el-form-item>
      <el-form-item label="算法模型" prop="modelType">
        <el-input v-model="dataForm.executorFailRetryCount" placeholder="输入算法模型类型名称qlearning/spsa"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  export default {
    data () {
      return {
        visible: false,
        handlerType: '',
        dataForm: {
          id: 0,
          addTime: '',
          updateTime : '',
          handlerName: '',
          executorParam: '',
          executorTimeout: '',
          executorFailRetryCount: '',
          taskStatus: "0"
        },
        dataRule: {
          junctionId: [
            { required: true, message: '优化路口不能为空', trigger: 'blur' }
          ],
          timeRange: [
            { required: true, message: '优化时间段不能为空', triggger: 'blur' }
          ]
        },
      }
    },
    methods: {
      init (id, handlerType) {
        this.handlerType = handlerType
        console.log(handlerType)
        this.dataForm.id = id || 0
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (this.dataForm.id) {
            this.$http({
              url: this.$http.adornUrl(`/task/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.addTime = data.task.addTime
                this.dataForm.updateTime = data.task.updateTime
                this.dataForm.handlerName = data.task.handlerName
                this.dataForm.executorParam = data.task.executorParam
                this.dataForm.executorTimeout = data.task.executorTimeout
                this.dataForm.executorFailRetryCount = data.task.executorFailRetryCount
                this.dataForm.taskStatus = data.task.taskStatus
              }
            })
          }
        })
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.executorParam = "junctionId=" + this.dataForm.junctionId + ",timeRange=" + this.dataForm.timeRange + ",modelType=" + this.dataForm.modelType
            console.log(this.executorParam)
            this.$http({
              url: this.$http.adornUrl(`/task/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'id': this.dataForm.id || undefined,
                'handlerName': this.handlerType,
                'executorParam': this.executorParam,
                'executorTimeout': 0,
                'executorFailRetryCount': 3,
              })
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.$message({
                  message: '操作成功',
                  type: 'success',
                  duration: 1500,
                  onClose: () => {
                    this.visible = false
                    this.$emit('refreshDataList')
                  }
                })
              } else {
                this.$message.error(data.msg)
              }
            })
          }
        })
      }
    }
  }
</script>
