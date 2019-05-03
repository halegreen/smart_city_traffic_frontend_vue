<template>
<el-dialog
    :title="!flowData ? '方案验证结果' : '方案验证结果'"
    :close-on-click-modal="false"
    :visible.sync="visible"
    width="60%">
    <el-row :gutter="20">
      <el-col :span="24">
        <el-card>
        <div id="myChart1"  style="width: 500px;height:400px;"></div>
        </el-card>
        <el-card>
          <div id="myChart2"  style="width: 500px;height:400px;"></div>
        </el-card>
        <el-card>
          <div id="myChart3" style="width: 500px;height:400px;"></div>
        </el-card> 
      </el-col>
     </el-row>
    
</el-dialog>
</template>

<script>
  import echarts from 'echarts'
  export default {
    data () {
      return {
        visible: false,
        chartLine: null,
        chartBar: null,
        flowData : {},
        pageData:[{
          name:'',
          dataList: []
        }],
        nameFrom:[],
        numFrom:[],
        linkIdList: [],
        seriesData:[{
          name:'',
          type:'line',
          smooth:true,
          itemStyle: {normal: {areaStyle: {type: 'default'}}},
          data:[]
        }],
        timeSeriesData: [],
        searchData:{
          linkId: '',
          startTime: '',
          endTime: ''
        },
      }
    },
    mounted () {
        //echarts 没有刷新
        // this.initCharts()
    },
    activated () {
      // 由于给echart添加了resize事件, 在组件激活时需要重新resize绘画一次, 否则出现空白bug
      if (this.chartLine) {
        this.chartLine.resize()
      }
      if (this.chartBar) {
        this.chartBar.resize()
      }

    },
    methods: { 
      init (flowData) {
        this.flowData = flowData
        this.visible = true
        this.$nextTick(() => this.initLineChart())
        this.$nextTick(() => this.initBarChart())
      },
    //   initCharts () {
    //     this.$nextTick(() => this.initLineChart())
    //     this.$nextTick(() => this.initBarChart())
    //   },     
      //折线图
      initLineChart () {

          var option = {
            title : {
                text: '方案1',
                },
            grid:{
                 left:'8%',
                right:'0',
                bottom:'1%',
                containLabel:true
            },
            tooltip : {
                trigger: 'axis'
            },
            legend: {
                data:['流量','平均行程速度','平均排队等待时间', '车流占据道路的时间比率', '平均排队长度']
            },
            calculable : true,
            xAxis : [
                {
                    type : 'category',
                    boundaryGap : false,
                    data : []
                }
            ],
            yAxis : [
                {
                    type : 'value'
                }
            ],
            series : []
          }

          this.chartLine = echarts.init(document.getElementById('myChart1'))
          this.chartLine.setOption(option)
           window.addEventListener('resize', () => {
            this.chartLine.resize()
           })
      },
      //柱状图
      initBarChart () {
          var option = {
            legend: {},
            tooltip: {},
            dataset: {
                source: [
                    ['product', '2015', '2016', '2017'],
                    ['Matcha Latte', 43.3, 85.8, 93.7],
                    ['Milk Tea', 83.1, 73.4, 55.1],
                    ['Cheese Cocoa', 86.4, 65.2, 82.5],
                    ['Walnut Brownie', 72.4, 53.9, 39.1]
                ]
            },
            xAxis: {type: 'category'},
            yAxis: {},
            // Declare several bar series, each will be mapped
            // to a column of dataset.source by default.
            series: [
                {type: 'bar'},
                {type: 'bar'},
                {type: 'bar'}
            ]
        };
        this.chartBar = echarts.init(document.getElementById('myChart2'))
        this.chartBar.setOption(option)
        window.addEventListener('resize', () => {
            this.chartBar.resize()
           })
      }


    }
  }
</script>

<style lang="scss">
  .mod-flow-echarts {
    > .el-alert {
      margin-bottom: 10px;
    }
    > .el-row {
      margin-top: -10px;
      margin-bottom: -20px;
      .el-col {
        padding-top: 10px;
        padding-bottom: 10px;
      }
    }
    .chart-line {
      min-height: 500px;
    }
  }
</style>
