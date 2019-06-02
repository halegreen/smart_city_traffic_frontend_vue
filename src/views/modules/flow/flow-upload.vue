<template>
  <el-dialog
    :title="上传车流文件"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="form">
    <el-form-item label="上传车流文件" :label-width="formLabelWidth">
      <el-upload
        ref="upload"
        action="https://jsonplaceholder.typicode.com/posts/"
        multiple
        :auto-upload="false"
        :limit=limitNum
        accept=".xml"
        :before-upload="beforeUploadFile"
        :on-change="fileChange"
        :on-exceed="exceedFile"
        :on-success="handleSuccess"
        :on-error="handleError"
        :file-list="fileList">
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div class="el-upload__tip" slot="tip">暂时只支持execl格式的车流文件上传</div>
      </el-upload>
    </el-form-item>
    <el-form-item>
      <el-button  type="primary" @click="uploadFile">确定</el-button>
      <el-button @click="visible = false">取消</el-button>
    </el-form-item>
  </el-form>
  </el-dialog>
</template>

<script>
import axios from 'axios'
import Vue from 'vue'
export default {
    data () {
      return {
        visible: false,
        handlerType: '',
        limitNum: 2,
        formLabelWidth: '200px',
        form: {
            file: ''
        },
        fileList: [],
        allFile: [],
      }
    },
    methods: {
      init (id) {
        this.visible = true
      },
      headers() {
            return {
                // 设置Content-Type类型为multipart/form-data
                'ContentType': 'multipart/form-data',
            }
       },
       // 设置上传地址
       uploadActionUrl () {
          return this.$http.adornUrl(`/flow/upload`)
       },
      //上传文件
      uploadFile() {
        // this.$refs.upload.submit()
        let fd = new FormData()
        console.log(this.allFile)
        fd.append('flowFile', this.allFile[0])
        this.$httpMultipart({
              url: this.$httpMultipart.adornUrl(`/flow/upload`),
              method: 'post',
              data: fd
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.allFile.splice(0,1)
                this.allFile.splice(0,1)
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
      },
      // 文件超出个数限制时的钩子
        exceedFile(files, fileList) {
            this.$notify.warning({
                title: '警告',
                message: `只能选择 ${this.limitNum} 个文件，当前共选择了 ${files.length + fileList.length} 个`
            });
        },
        // 文件状态改变时的钩子
        fileChange(file, fileList) {
            console.log('change')
            this.form.file = file.raw
            console.log(this.form.file)
            this.allFile.push(this.form.file)
            console.log(this.allFile)
        },
      beforeUploadFile(file) {
        let extension = file.name.substring(file.name.lastIndexOf('.')+1)
        let size = file.size / 1024 / 1024
        if(extension !== 'xml') {
            this.$notify.warning({
            title: '警告',
            message: `只能上传xml的文件`
            });
        }
        if(size > 10) {
            this.$notify.warning({
            title: '警告',
            message: `文件大小不得超过10M`
            });
        }
        console.log('======== before upload')
        console.log(file)
    },
    // 文件上传成功时的钩子
    handleSuccess(res, file, fileList) {
      this.$notify.success({
        title: '成功',
        message: `文件上传成功`
      });
    },
    // 文件上传失败时的钩子
    handleError(err, file, fileList) {
      this.$notify.error({
        title: '错误',
        message: `文件上传失败`
      });
    },
    }
  }
</script>
