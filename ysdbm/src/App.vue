<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
#app {
  font-family:"Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  width: 100%;
  height: 100%;
  min-width: 800px;
  overflow: hidden;
}
html,body{
  width: 100%;
  height: 100%;
  background: #f0f0f0;
  min-height: 750px;
  overflow: hidden;
}
.layout {
  width: 100%;
  height: 100%;
}
.layout-content {
  position: absolute;
  overflow: auto;
  top: 65px;
  bottom: 40px;
  left: 200px;
  right: 0px;
  background: #f5f7f9;
  padding:24px 24px 0 24px;
}
.layout-foot {
  position: absolute;
  left:50%;
  bottom:8px;
  color: #000;
}
.ivu-card-head {
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
  padding: 8px 16px ;

}

</style>
