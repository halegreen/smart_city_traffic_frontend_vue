<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="100px">
      <el-form-item label="处理器名称" prop="handlerName">
        <el-input v-model="dataForm.handlerName" placeholder="处理器名称,如Simulation / Optimize"></el-input>
      </el-form-item>
      <el-form-item label="任务执行参数" prop="executorParam">
        <el-input  type="textarea"  :rows="2"  v-model="dataForm.executorParam" placeholder="仿真参数:configFilePath={仿真配置文件路径},simulateTimePeriod={仿真时长(秒)} 
       算法优化参数：junctionId={优化路口id},timeRange={时间段0,1,2...},modelType={qlearning/spsa}"></el-input>
      </el-form-item>

      <el-form-item label="执行器超时时间" prop="executorTimeout">
        <el-input v-model="dataForm.executorTimeout" placeholder="执行器超时时间"></el-input>
      </el-form-item>
      <el-form-item label="执行器失败重试次数" prop="executorFailRetryCount">
        <el-input v-model="dataForm.executorFailRetryCount" placeholder="执行器失败重试次数"></el-input>
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
          trafficLightId: '',
          junctionId : '',
          timePeriod: '',
          linkIdList: '',
          phaseIdList: '',
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
              url: this.$http.adornUrl(`/plan/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.trafficLightId = data.task.trafficLightId
                this.dataForm.junctionId = data.task.junctionId
                this.dataForm.timePeriod = data.task.timePeriod
                this.dataForm.linkIdList = data.task.linkIdList
                this.dataForm.phaseIdList = data.task.phaseIdList
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
              url: this.$http.adornUrl(`/plan/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'id': this.dataForm.id || undefined,
                'handlerName': this.dataForm.trafficLightId,
                'executorParam': this.dataForm.junctionId,
                'executorTimeout': this.dataForm.timePeriod,
                'cronExpression': this.dataForm.linkIdList,
                'executorFailRetryCount': this.dataForm.phaseIdList,
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
