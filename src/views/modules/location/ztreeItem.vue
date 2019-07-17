<template>
  <li :class="liClassVal">
    <span :class="spanClassVal" @click='open(model)'></span>
    <a :class="aClassVal" @click='Func(model)' @contextmenu.prevent='cxtmenufunc'>
      <span :class="{loadSyncNode:model.loadNode==1}" v-if='model.loadNode==1'></span>
      <span :class='model.iconClass' v-show='model.iconClass' v-else></span>
      <span class="node_name">{{model.name}}</span>
    </a>
    <ul :class="ulClassVal" v-show='model.isFolder'>
      <ztree-item v-for="(i,item) in model.children" :key = "item" :callback='callback' :expandfunc='expandfunc' :model.sync="item" :cxtmenufunc='cxtmenufunc' :num.sync='i' root='1' :nodes.sync='model.children.length' :trees.sync='trees'></ztree-item>
    </ul>
  </li>
</template>

<script>

export default {
  name: 'ztreeItem',
  props: {
    model: {
      type: Object,
      twoWay: true
    },
    num: {
      type: Number,
      twoWay: true
    },
    nodes: {
      type: Number,
      twoWay: true,
      default: 0
    },
    trees: {
      type: Array,
      twoWay: true,
      default: []
    },
    root: {
      type: String,
      twoWay: true
    },
    callback: {
      type: Function
    },
    expandfunc: {
      type: Function
    },
    cxtmenufunc: {
      type: Function
    }
  },
  methods: {
    Func: function (m) {
      if (typeof this.callback == "function") {
        this.callback.call(null, m);
      }
// 查找点击的子节点
      var recurFunc = (data) => {
        data.forEach(function (i) {
          if (i.id == m.id) {
            i.clickNode = true;
          } else {
            i.clickNode = false;
          }

          if (i.children) {
            recurFunc(i.children);
          }
        })
      }
      recurFunc(this.trees);
    },
    open: function (m) {
//
      m.isExpand = !m.isExpand;

      if (typeof this.expandfunc == "function" && m.isExpand) {

        if (m.loadNode != 2) {
//
          this.expandfunc.call(null, m);
        } else {
          m.isFolder = !m.isFolder;
        }
      } else {

        m.isFolder = !m.isFolder;
      }
    }
  },
  computed: {
// 给（根 和 子树）赋值不同的样式
    rootClass: function () {
      var strRootClass = '';

// 根判断
      if (this.root == '0') {

        strRootClass = (this.num == 0 && !this.model.children) ? "roots_docu" : (this.nodes == 1) || (this.num == 0 && this.nodes != this.num + 1) ?
          "root_" : (this.nodes == this.num + 1) ? "bottom_" : "center_";

// 子树判断
      } else if (this.root == '1') {

        strRootClass = this.nodes > 1 && this.model.children && this.nodes != this.num + 1
          ? "center_" :
          (this.num == 0 && this.nodes > 1) || (this.nodes != this.num + 1) ? "center_docu" :
            this.nodes == 1 && this.num != 0 || (this.nodes == this.num + 1 && this.model.children) ? "bottom_" : "bottom_docu";
      }

      return strRootClass
    },
// 是否有子节点
    isChildren: function () {
      return this.num + 1 != this.nodes;
    },
// 展开/收起
    prefixClass: function () {
      var returnChar = "";
      if (this.rootClass.indexOf("docu") == -1) {
        if (this.model.isFolder) {
          returnChar = "open";
        } else {
          returnChar = 'close'
        }
      }

      if (!this.model.children && this.rootClass.indexOf("docu") == -1) {
        returnChar = 'docu'
      }

      return returnChar;
    },
    liClassVal: function () {
      return "level" + this.num;
    },
    spanClassVal: function () {
      return "button level" + this.num + " switch " + this.rootClass + this.prefixClass;
    },
    aClassVal: function () {
      return this.model.clickNode ? "level" + this.num + ' curSelectedNode' : "level" + this.num;
    },
    ulClassVal: function () {
      return this.isChildren && this.model.children ? "level" + this.num + ' line' : "level" + this.num;
    }
  },
}
</script>
