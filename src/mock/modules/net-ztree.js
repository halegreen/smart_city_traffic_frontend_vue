import Mock from 'mockjs'

// 生成数据列表
var dataList = []
for (let i = 0; i < Math.floor(Math.random() * 10 + 1); i++) {
  dataList.push(Mock.mock({
    //模版定义规范https://github.com/nuysoft/Mock/wiki/Syntax-Specification
    'nodeId': /^1[0-9]{10}$/,
    'x' : 1,
    'y' : 1,
    'nodeType' : 'nodeType',
    'incLanes' : 'incLanes',
    'intLanes' : 'intLanes',
    'tlId' : /^1[0-9]{10}$/,
    'nodeName' : @name,
    'location_id' : /^1[0-9]{10}$/,
  }))
}

// 获取用户列表
export function list () {
  return {
    // isOpen: false,
    url: '/location/ztree/list',
    type: 'get',
    data: {
      'msg': 'success',
      'code': 0,
    }
  }
}
