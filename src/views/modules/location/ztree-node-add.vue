<template>
  <el-dialog
    :title="!dataForm.id ? '设置算法优化参数' : '设置算法优化参数'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="100px">
      <el-form-item label="节点Id" prop="nodeId">
        <el-input v-model="dataForm.nodeId" placeholder="输入节点Id"></el-input>
      </el-form-item>
      <el-form-item label="x" prop="x">
        <el-input v-model="dataForm.x" placeholder="输入x"></el-input>
      </el-form-item>
      <el-form-item label="y" prop="y">
        <el-input v-model="dataForm.y" placeholder="输入节点Idq"></el-input>
      </el-form-item>
      <el-form-item label="节点类型" prop="nodeType">
        <el-input v-model="dataForm.nodeType" placeholder="输入节点类型"></el-input>
      </el-form-item>
      <el-form-item label="进入车道" prop="incLanes">
        <el-input v-model="dataForm.incLanes" placeholder="输入进入车道"></el-input>
      </el-form-item>
      <el-form-item label="出车道" prop="intLanes">
        <el-input v-model="dataForm.intLanes" placeholder="输入出车道"></el-input>
      </el-form-item>
      <el-form-item label="交通灯id" prop="tlId">
        <el-input v-model="dataForm.tlId" placeholder="输入交通灯id"></el-input>
      </el-form-item>
      <el-form-item label="节点名称" prop="nodeName">
        <el-input v-model="dataForm.nodeName" placeholder="输入节点名称"></el-input>
      </el-form-item>
      <el-form-item label="所属区域id" prop="location_id">
        <el-input v-model="dataForm.location_id" placeholder="输入所属区域id"></el-input>
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
        //不知道dataForm作用
        dataForm: {
          id: 0,
          addTime: '',
        },
        dataRule: {
          nodeId: [
            { required: true, message: '节点id不能为空', trigger: 'blur' }
          ],
        },
      }
    },
    methods: {
      init () {
        this.visible = true
      },
      // 新增的表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.executorParam = "节点Id=" + this.dataForm.nodeId + ",x=" + this.dataForm.x + ",y=" + this.dataForm.y+"etc"
            console.log(this.executorParam)
            this.$http({
              url: this.$http.adornUrl(`/location/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'id': this.dataForm.nodeId || undefined,
                'executorParam': this.executorParam
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
