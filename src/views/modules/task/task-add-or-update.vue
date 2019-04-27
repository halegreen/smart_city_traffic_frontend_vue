<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="100px">
      <el-form-item label="task ID" prop="id">
        <el-input v-model="dataForm.id" placeholder="task id"></el-input>
      </el-form-item>
      <el-form-item label="新建时间" prop="addTime">
        <el-input v-model="dataForm.addTime" placeholder="新建时间"></el-input>
      </el-form-item>
      <el-form-item label="更新时间" prop="updateTime">
        <el-input v-model="dataForm.updateTime" placeholder="更新时间"></el-input>
      </el-form-item>
      <el-form-item label="处理器名称" prop="handlerName">
        <el-input v-model="dataForm.handlerName" placeholder="处理器名称,如Simulation / Optimize"></el-input>
      </el-form-item>
      <el-form-item label="执行参数" prop="executorParam">
        <el-input v-model="dataForm.executorParam" placeholder="执行参数"></el-input>
      </el-form-item>
      <el-form-item label="执行器超时时间" prop="executorTimeout">
        <el-input v-model="dataForm.executorTimeout" placeholder="执行器超时时间"></el-input>
      </el-form-item>
      <el-form-item label="执行器失败重试次数" prop="executorFailRetryCount">
        <el-input v-model="dataForm.executorFailRetryCount" placeholder="执行器失败重试次数"></el-input>
      </el-form-item>
      <el-form-item label="任务状态" prop="taskStatus">
        <el-input v-model="dataForm.taskStatus" placeholder="任务状态"></el-input>
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
        dataForm: {
          id: 0,
          addTime,
          updateTime,
          handlerName,
          executorParam: '',
          executorTimeout: '',
          executorFailRetryCount: '',
          taskStatus: ''
        },
        dataRule: {
          handlerName: [
            { required: true, message: '执行器名称不能为空', trigger: 'blur' }
          ],
          executorParam: [
            { required: true, message: '执行器参数不能为空', triggger: 'blur' }
          ]
        }
      }
    },
    methods: {
      init (id) {
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
                this.dataForm.addTime = data.schedule.addTime
                this.dataForm.updateTime = data.schedule.updateTime
                this.dataForm.handlerName = data.schedule.handlerName
                this.dataForm.executorParam = data.schedule.executorParam
                this.dataForm.executorTimeout = data.schedule.executorTimeout
                this.dataForm.executorFailRetryCount = data.schedule.executorFailRetryCount
                this.dataForm.taskStatus = data.schedule.taskStatus
              }
            })
          }
        })
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(`/task/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'id': this.dataForm.id || undefined,
                'handlerName': this.dataForm.handlerName,
                'executorParam': this.dataForm.executorParam,
                'executorTimeout': this.dataForm.executorTimeout,
                'cronExpression': this.dataForm.cronExpression,
                'executorFailRetryCount': this.dataForm.executorFailRetryCount,
                'status': !this.dataForm.id ? undefined : this.dataForm.taskStatus
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
