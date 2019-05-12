<template>
<el-dialog
    :title="!id ? '区域路网结构' : '区域路网结构'"
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
  import axios from 'axios'
  export default {
    data () {
      return {
        visible: false,
        chartBar: null,
        data: [],
      }
    },
    mounted () {
    },
    activated () {
      if (this.chartBar) {
        this.chartBar.resize()
      }
    },
    methods: { 
      init () {
        this.visible = true
        this.$nextTick(() => this.initTreeChart())
        
      },
      initTreeChart () {
          this.data = [{
            name: '根节点',
            value: 6,
            children: [
                {
                    name: '节点1',
                    value: 4,
                    children: [
                        {
                            name: '叶子节点1',
                            value: 4
                        },
                        {
                            name: '叶子节点2',
                            value: 4
                        },
                        {
                            name: '叶子节点3',
                            value: 2
                        },
                            {
                            name: '叶子节点4',
                            value: 2
                        },
                        {
                            name: '叶子节点5',
                            value: 2
                        },
                        {
                            name: '叶子节点6',
                            value: 4
                        }
                    ]
                },
                {
                    name: '节点2',
                    value: 4,
                    children: [{
                        name: '叶子节点7',
                        value: 4
                    },
                    {
                        name: '叶子节点8',
                        value: 4
                    }]
                },
                {
                    name: '节点3',
                    value: 1,
                    children: [
                        {
                            name: '叶子节点9',
                            value: 4
                        },
                        {
                            name: '叶子节点10',
                            value: 4
                        },
                        {
                            name: '叶子节点11',
                            value: 2
                        },
                            {
                            name: '叶子节点12',
                            value: 2
                        }
                    ]
                }
            ]
            }]
        var option = {
            tooltip: {
                trigger: 'item',
                triggerOn: 'mousemove'
            },
            series: [
                {
                    type: 'tree',

                    data: this.data,

                    top: '1%',
                    left: '7%',
                    bottom: '1%',
                    right: '20%',

                    symbolSize: 7,

                    label: {
                        normal: {
                            position: 'left',
                            verticalAlign: 'middle',
                            align: 'right',
                            fontSize: 9
                        }
                    },

                    leaves: {
                        label: {
                            normal: {
                                position: 'right',
                                verticalAlign: 'middle',
                                align: 'left'
                            }
                        }
                    },

                    expandAndCollapse: true,
                    animationDuration: 550,
                    animationDurationUpdate: 750
                }
            ]
        }  
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
