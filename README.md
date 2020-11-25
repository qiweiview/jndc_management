![J NDC](https://s1.ax1x.com/2020/11/04/B6HETJ.png)

## 介绍
* [JNDC](https://github.com/qiweiview/jndc) 的项目的默认的前端实现
* 基于[vue](https://cn.vuejs.org/index.html) 编写
* UI框架使用[element ui](https://element.eleme.io/) 


##  配置
* 后端地址配置在[runtimeConfig.js](https://github.com/qiweiview/jndc_management/blob/master/public/static/runtimeConfig.js) 文件中修改
```
window.runtimeConfig = {
    BASE_REQUEST_PATH : 'http://localhost:82/', #后端api调用地址
    BASE_WEBSOCKET_PATH : 'ws://localhost:82/'  #后端消息通知websocket地址
}
```

