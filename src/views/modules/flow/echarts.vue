<template>
  <div class="mod-flow-echarts">
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
        <el-button type="primary" @click="getDataList()">查询</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="20">
      <el-col :span="12">
        <el-card>
          <!-- <div id="J_chartPieBox" class="chart-box"></div> -->
          <div id="J_chartLine" class="chart-line"></div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import echarts from 'echarts'
  export default {
    data () {
      return {
        chartPie: null,
        chartLine: null,
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
      this.getDataList()
      this.getLinkIdList()
    },
    activated () {
      // 由于给echart添加了resize事件, 在组件激活时需要重新resize绘画一次, 否则出现空白bug
      if (this.chartLine) {
        this.chartLine.resize()
      }

    },
    methods: {
      getDataList () {
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/flow/linechart'),
          method: 'get',
          params: this.$http.adornParams({
                'linkId': this.searchData.linkId,
                'startTime': this.searchData.startTime,
                'endTime': this.searchData.endTime
          })
        }).then(({data}) => {
          this.pageData = data.page;
          this.timeSeriesData = data.timeSeries;
          var length =  data.length
          for(var i = 0;i < length; i++) {
            this.nameFrom.push(this.pageData[i].name)
            this.numFrom.push(this.pageData[i].dataList)
            var item = {
                name:this.pageData[i].name,
                type:'line',
                smooth:true,
                itemStyle: {normal: {areaStyle: {type: 'default'}}},
                data:this.pageData[i].dataList
            }
            this.seriesData.push(item)
          }
          this.initLineChart()
        })
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
      // 饼状图
      initChartPie () {
        var option = {
          title: {
            text: '覆盖小区统计',
            subtext: '按成都市已覆盖区统计',
            left: 'center',
            top: 20
          },
          //提示主键框
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)'
          },
          toolbox: {
            feature: {
              'saveAsImage': { }
            }
          },
          /*visualMap: {
            show: false,
            min: 80,
            max: 600,
            inRange: {
              colorLightness: [0, 1]
            }
          },*/
          //图案主键
          legend: {
            type: 'scroll',
            orient: 'vertical',
            left: 0,
            top: 20,
            bottom: 20,
            data: this.nameFrom,
            selected: this.nameFrom
          },
          series: [
            {
              name: '数据源',
              type: 'pie',
              radius: '55%',
              center: ['50%', '50%'],
              data:  this.seriesData.sort(function (a, b) { return a.value - b.value }),
              //设置指示线
              /*label: {
                normal: {
                  textStyle: {
                    color: 'rgba(0, 0, 0, 0.5)'
                  }
                }
              },
              labelLine: {
                normal: {
                  lineStyle: {
                    color: 'rgba(255, 255, 255, 0.3)'
                  },
                  smooth: 0.2,
                  length: 10,
                  length2: 20
                }
              },*/
              itemStyle: {
                emphasis: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              },
              animationType: 'scale',
              animationEasing: 'elasticOut',
              animationDelay: function (idx) {
                return Math.random() * 200
              }
            }
          ]
        }

        this.chartPie = echarts.init(document.getElementById('J_chartPieBox'))
        this.chartPie.setOption(option)
        window.addEventListener('resize', () => {
          this.chartPie.resize()
        })
      },
      //折线图
      initLineChart () {
          var option = {
            // title : {
            //     text: '交通流量特征可视化',
            //     },
            // grid:{
            //      left:'8%',
            //     right:'0',
            //     bottom:'1%',
            //     containLabel:true
            // },
            tooltip : {
                trigger: 'axis'
            },
            legend: {
                data:['流量','平均行程速度','平均排队等待时间', '车流占据道路的时间比率', '平均排队长度']
            },
            toolbox: {
                show : true,
                feature : {
                    mark : {show: true},
                    dataView : {show: true, readOnly: false},
                    magicType : {show: true, type: ['line', 'bar', 'stack', 'tiled']},
                    restore : {show: true},
                    saveAsImage : {show: true}
                }
            },
            calculable : true,
            xAxis : [
                {
                    type : 'category',
                    boundaryGap : false,
                    data : this.timeSeriesData
                }
            ],
            yAxis : [
                {
                    type : 'value'
                }
            ],
            series : this.seriesData
          }

          this.chartLine = echarts.init(document.getElementById('J_chartLine'))
          this.chartLine.setOption(option)
           window.addEventListener('resize', () => {
            this.chartLine.resize()
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
