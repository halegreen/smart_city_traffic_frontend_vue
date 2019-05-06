<template>
<el-dialog
    :title="!flowData ? '方案验证结果' : '方案验证结果'"
    :close-on-click-modal="false"
    :visible.sync="visible"
    width="60%">
    <el-row :gutter="20">
      <el-col :span="24">
        <el-card>
        <div id="myChart1"  style="width: 600px;height:400px;"></div>
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
        chartBar: null,
        flowData : {},
        planList: [],
        timeSeriesData: [],
      }
    },
    mounted () {
    },
    activated () {
      // 由于给echart添加了resize事件, 在组件激活时需要重新resize绘画一次, 否则出现空白bug
      if (this.chartBar) {
        this.chartBar.resize()
      }

    },
    methods: { 
      init (flowData) {
        this.flowData = flowData
        this.visible = true
        for (var i = 0; i < flowData.length; i++) {
            var item = "plan";
            this.planList.push(item)
        }
        console.log(this.planList)
        this.$nextTick(() => this.initBarChart())
      },
      //柱状图
      initBarChart () {
          var option = {
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
                    data : ["plan0", "plan1", "plan2"]   //todo
                }
            ],
            yAxis : [
                {
                    type : 'value'
                }
            ],
            series : [
                {
                    name:'流量',
                    type:'bar',
                    data: this.flowData.volumeQ,
                },
                {
                    name:'平均行程速度',
                    type:'bar',
                    data:this.flowData.velocityV,
                },
                {
                    name:'平均排队等待时间',
                    type:'bar',
                    data:this.flowData.avgQueueTime,
                },
                {
                    name:'车流占据道路的时间比率',
                    type:'bar',
                    data:this.flowData.thetaT,        
                },
                {
                    name:'平均排队长度',
                    type:'bar',
                    data:this.flowData.avgQueueLength,
                }
            ]
        };
        this.chartBar = echarts.init(document.getElementById('myChart1'))
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
