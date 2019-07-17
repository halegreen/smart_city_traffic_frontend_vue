<style>
  body {
    font-family: Helvetica, sans-serif;
  }
  .iconClassRoot {
    width: 15px;
    height: 15px;
    display: inline-block;
    background: url("../zTree/zTreeStyle/img/ztree/root.png") no-repeat center/100% auto;
  }
  .iconClassNode {
    width: 15px;
    height: 15px;
    display: inline-block;
    background: url("../zTree/zTreeStyle/img/ztree/node.png") no-repeat center/100% auto;
  }
  .operate {
    display: flex;
  }
  .operate ul > li {
    float: left;
    margin: 10px 10px;
    list-style-type: none;
  }
</style>
<template>
  <div>
    <div>
      <h1>导入路网文件 例如：/Users/phm/Desktop/test/demo.net.xml</h1>
      <el-form :inline="true">
        <el-form-item>
          <el-input v-model="netRoadPath" placeholder="输入要导入的路网文件的全路径" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button  type="primary" @click="insertNetRoad()">导入路网文件</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div>
      <h1>按区域的节点树展示</h1>
      <div style='width:280px;' v-if='ztreeDataSourceSync.length >= 0' @keyup.enter.native="getDataList()">
        <vue-ztree :list.sync='ztreeDataSourceSync' :expand='expandClick' :is-open='false'
                   :is-check='false'></vue-ztree>
      </div>
    </div>
  </div>
</template>

<script>
  import VueZtree from './vue-ztree'
  export default {
    components: {
      VueZtree
    },
    data () {
      return {
        msg: 'Hello Vue-Ztree-2.0!',
        dataList:[],
        treeDeepCopy:[],
        parentNodeModel:[],//当前点击节点父亲对象
        nodeModel:null, // 当前点击节点对象
        dataListLoading: false,
        ztreeDataSourceSync:[[]],
        //异步加载使用ztreeDataSourceSync进行数据填充
        netRoadPath:''//获取输入的导入路网文件路径
      }
    },
    mounted () {
      this.getDataList()
    },
    methods:{
      // 获取数据列表方法
      getDataList: function () {
        this.dataListLoading = true//开始加载
        this.$http({
          url: this.$http.adornUrl('/location/ztree/list'),
          method: 'get',
          params: this.$http.adornParams({})
        }).then(({data}) => {
          if (data && data.code === 0) {
            var t = data.ztreeNodesLists;
            this.dataList = t
            this.ztreeDataSourceSync = t
          } else {
            this.dataList = []
            this.ztreeDataSourceSync = []
          }
        })
      },
      //导入路网元素功能
      insertNetRoad: function() {
        this.$http({
          url: this.$http.adornUrl('/location/ztree/import'),
          method: 'get',
          params: this.$http.adornParams({
            'netRoadPath': this.netRoadPath
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            var t = data.message;
            alert(t)
          } else {
          }
        })

      },

      // 点击展开收起
      expandClick:function(m){
        console.log(JSON.parse(JSON.stringify(m)));
        // 点击异步加载
        if(m.isExpand) {
          // 动态加载子节点, 模拟ajax请求数据
          // 请注意 id 不能重复哦。
          if(m.hasOwnProperty("children")){

            m.loadNode = 1; // 正在加载节点

            setTimeout(()=>{

              m.loadNode = 2; // 节点加载完毕

              m.isFolder = !m.isFolder;

              m.children.push({
                id:+new Date(),
                parentId:m.id,
                name:"动态加载节点1",
                path:"",
                clickNode:false,
                isFolder:false,
                isExpand:false,
                hover:false,
                loadNode:0,
                children:[{
                  id:+new Date()+1,
                  parentId:m.id,
                  name:"动态加载末节点",
                  path:"",
                  clickNode:false,
                  isExpand:false,
                  isFolder:false,
                  hover:false,
                  loadNode:0
                }]
              })
            },1000);
          }
        }
      },

      navigateClick:function(index,item){
        // 递归
        var recurFunc = (data,list) => {
          data.forEach((i)=>{
            if(i.id==item.id){
              i.clickNode = true;
              this.nodeModel = i;
              this.parentNodeModel = data;
            }else {
              i.clickNode = false;
            }

            if(i.children){
              recurFunc(i.children,i);
            }
          });
        }
        recurFunc(this.treeDeepCopy, this.treeDeepCopy);

        // 导航
        var self = this;
        for(var i=0;i<self.dataList.length;i++){
          if(index == i){
            self.dataList[i].clickNode = true
          }else{
            self.dataList[i].clickNode = false
          }
        }
        self.dataList.splice(index+1,self.dataList.length - (index+1))

        this.ztreeDataSource = this.treeDeepCopy
      },

      //通过id查询子节点
      findById:function(data,parentId) {
        var vm =this;

        for(var i = 0;i<data.length;i++){
          if (parentId == data[i].id){
            vm.dataList.push(data[i]);
            vm.findById(vm.ztreeDataSource, data[i].parentId)
            return data[i]
          }

          if (data[i].hasOwnProperty('children')){
            vm.findById(data[i].children,parentId)
          }

        }
      },

      // 右击事件触发了自定义
      contextmenuClick:function(m){
        console.log(m);
        console.log(event.target);
        console.log("触发了自定义的contextmenuClick事件");
        alert("触发了自定义");
      },
    },
  }
</script>
