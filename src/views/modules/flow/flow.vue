<template>
  <div class="mod-flow">
    <el-form :inline="true" :model="searchData" @keyup.enter.native="getDataList()">
      <el-form-item label="路段id">
        <el-select v-model="searchData.linkId" placeholder="请选择路段id">
        <el-option
            v-for="item in linkIdList"
            :key="item.id"
            :label="item.linkId"
            :value="item.linkId">   
        </el-option>
        </el-select>
       </el-form-item>
       <el-form-item label="时段">
        <el-col :span="11">
            <el-date-picker type="date" placeholder="选择起始时间" v-model="searchData.startTime" ></el-date-picker>
        </el-col>
        <el-col class="line" :span="2">-</el-col>
        <el-col :span="11">
             <el-date-picker type="date" placeholder="选择结束时间" v-model="searchData.endTime" ></el-date-picker>
        </el-col>
      </el-form-item>
      
      <el-form-item>
        <el-button type="primary" @click="queryData()">查询</el-button>
        <el-button  type="danger" @click="uploadHandle()">导入外部流量</el-button>
      </el-form-item>
    </el-form>

    <el-table
      :data="dataList"
      border
      v-loading="dataListLoading"
      @selection-change="selectionChangeHandle"
      style="width: 100%;">
      <el-table-column
        type="selection"
        header-align="center"
        align="center">
      </el-table-column>
      <el-table-column
        prop="id"
        header-align="center"
        align="center"
        label="Flow ID">
      </el-table-column>
      <el-table-column
        prop="linkId"
        header-align="center"
        align="center"
        label="路段id">
      </el-table-column>
      <el-table-column
        prop="timeStamp"
        header-align="center"
        align="center"
        label="记录时间戳">
      </el-table-column>
      <el-table-column
        prop="startHourAndMinute"
        header-align="center"
        align="center"
        label="开始时间分钟">
      </el-table-column>
      <el-table-column
        prop="duration"
        header-align="center"
        align="center"
        label="持续时间(秒)">
      </el-table-column>
      <el-table-column
        prop="timeRange"
        header-align="center"
        align="center"
        label="一天中时段">
      </el-table-column>
      <el-table-column
        prop="curPhaseId"
        header-align="center"
        align="center"
        label="前一时刻相位id">
      </el-table-column>
      <el-table-column
        prop="volumeQ"
        header-align="center"
        align="center"
        label="流量(辆/s)">
      </el-table-column>
      <el-table-column
        prop="thetaT"
        header-align="center"
        align="center"
        label="车道占有率">
      </el-table-column>
      <el-table-column
        prop="velocityV"
        header-align="center"
        align="center"
        label="平均行程速度(m/s)">
      </el-table-column>
      <el-table-column
        prop="avgQueueLength"
        header-align="center"
        align="center"
        label="排队长度(辆)">
      </el-table-column>
      <el-table-column
        prop="avgQueueTime"
        header-align="center"
        align="center"
        label="排队延误时间(s)">
      </el-table-column>
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="150"
        label="操作">
        <template slot-scope="scope">
          <el-button  type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">修改</el-button>
          <el-button  type="text" size="small" @click="deleteHandle(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="sizeChangeHandle"
      @current-change="currentChangeHandle"
      :current-page="pageIndex"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pageSize"
      :total="totalPage"
      layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
    <upload v-if="uploadVisible" ref="upload" @refreshDataList="getDataList"></upload>
  </div>
</template>

<script>
 import Upload from './flow-upload'
 import AddOrUpdate from './flow-update'
  export default {
    data () {
      return {
        searchData:{
          linkId: '',
          startTime: '',
          endTime: ''
        },
        dataForm: {
          id: 0,
          linkId: '',
          timeStamp: '',
          startHourAndMinute: '',
          duration: '',
          timeRange: '',
          volumeQ: '',
          thetaT: '',
          velocityV: '',
          avgQueueLength: '',
          avgQueueTime: ''
        },
        dataList: [],
        pageIndex: 0,
        pageSize: 10,
        totalPage: 0,
        dataListLoading: false,
        dataListSelections: [],
        addOrUpdateVisible: false,
        uploadVisible: false,
        linkIdList: []
      }
    },
    components: {
      AddOrUpdate,
      Upload
    },
    activated () {
      this.getDataList()
      this.getLinkIdList()
    },
    methods: {
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/flow/list'),
          method: 'get',
          params: this.$http.adornParams({
            'page': this.pageIndex,
            'limit': this.pageSize,
            'username': this.dataForm.userName
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.dataList = data.page.list
            this.totalPage = data.page.totalCount
          } else {
            this.dataList = []
            this.totalPage = 0
          }
          this.dataListLoading = false
        })
      },
      // 每页数
      sizeChangeHandle (val) {
        this.pageSize = val
        this.pageIndex = 1
        this.getDataList()
      },
      // 当前页
      currentChangeHandle (val) {
        this.pageIndex = val
        this.getDataList()
      },
      // 多选
      selectionChangeHandle (val) {
        this.dataListSelections = val
      },
      // 新增 / 修改
      addOrUpdateHandle (id) {
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init(id)
        })
      },
      // 上传
      uploadHandle (id) {
        this.uploadVisible = true
        this.$nextTick(() => {
          this.$refs.upload.init(id)
        })
      },
      // 删除
      deleteHandle (id) {
        var userIds = id ? [id] : this.dataListSelections.map(item => {
          return item.id
        })
        this.$confirm(`确定对[id=${userIds.join(',')}]进行[${id ? '删除' : '批量删除'}]操作?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/flow/delete'),
            method: 'post',
            data: this.$http.adornData(userIds, false)
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.getDataList()
                }
              })
            } else {
              this.$message.error(data.msg)
            }
          })
        }).catch(() => {})
      },
      //
      getLinkIdList() {
            this.dataListLoading = true
            this.$http({
                url: this.$http.adornUrl('/road/all'),
                method: 'get'
            }).then(({data}) => {
                if (data && data.code === 0) {
                    this.linkIdList = data.page.list;
                } 
                this.dataListLoading = false
            })
      },
      //根据查询条件查询数据
      queryData() {
          this.dataListLoading = true
          this.$http({
               url: this.$http.adornUrl('/flow/search'),
               method: 'get',
               params: this.$http.adornParams({
                'linkId': this.searchData.linkId,
                'startTime': this.searchData.startTime,
                'endTime': this.searchData.endTime
              })
          }).then(({data}) => {
                if (data && data.code === 0) {
                    this.dataList = data.page.list
                    this.totalPage = data.page.totalCount
                } else {
                    this.dataList = []
                    this.totalPage = 0
                }
                this.dataListLoading = false
          }).then(() => {
          this.visible = true
          this.$nextTick(() => {
            this.$refs.ChangeState.init(this.dataForm)
          })
        })
      }
    }
  }
</script>
