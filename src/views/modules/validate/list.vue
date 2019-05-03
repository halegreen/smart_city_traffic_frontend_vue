<template>
  <div class="mod-plan">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-input v-model="dataForm.id" placeholder="Plan ID" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">查询</el-button>
        <el-button  type="primary" @click="validate()" :disabled="dataListSelections.length <= 0">批量验证</el-button>
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
        align="center"
        >
      </el-table-column>
      <el-table-column
        prop="id"
        header-align="center"
        align="center"
        label="Plan ID">
      </el-table-column>
      <el-table-column
        prop="trafficLightId"
        header-align="center"
        align="center"
        label="信号灯ID">
      </el-table-column>
      <el-table-column
        prop="junctionId"
        header-align="center"
        align="center"
        label="交叉口ID">
      </el-table-column>
      <el-table-column
        prop="timePeriod"
        header-align="center"
        align="center"
        label="适用的一天中时段">
      </el-table-column>
      <el-table-column
        prop="linkIdList"
        header-align="center"
        align="center"
        label="连接的路段列表">
      </el-table-column>
      <el-table-column
        prop="phaseIdList"
        header-align="center"
        align="center"
        label="相位列表">
      </el-table-column>
    
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="150"
        label="操作">
        <template slot-scope="scope">
          <el-button  type="primary" size="small" @click="validate(scope.row.id)">验证该方案</el-button>
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
    <!-- <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update> -->
    <validate v-if="validateVisible" ref="validate" ></validate>
  </div>
</template>

<script>
 import Validate from './validate'
  export default {
    data () {
      return {
        dataForm: {
          userName: ''
        },
        flowData: {
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
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataListLoading: false,
        dataListSelections: [],
        validateVisible: false
      }
    },
    components: {
      Validate
    },
    activated () {
      this.getDataList()
    },
    methods: {
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/trafficlight/list'),
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
      validate (id) {
          this.dataListLoading = true
          var ids = id ? [id] : this.dataListSelections.map(item => {
            return item.id
          })
          this.$http({
            url: this.$http.adornUrl('/validate/multiple'),
            method: 'post',
            data: this.$http.adornData(ids, false)
          }).then(({data}) => {
            if (data && data.code === 0) {
                this.flowData = data.flow
                this.dataListLoading = false
                this.validateVisible = true
                this.$nextTick(() => {
                    this.$refs.validate.init(this.flowData)
                })
            } else {
              this.$message.error(data.msg)
            }
          })
      },
    }
  }
</script>
