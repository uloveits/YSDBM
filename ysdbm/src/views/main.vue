<template>
    <div class="head">
      <Menu mode="horizontal" theme="dark" @on-select="turnUrl" :active-name="active">
        <MenuItem name="1">
          <Icon type="ios-game-controller-a"></Icon>
          控件一览
        </MenuItem>
        <MenuItem name="2">
          <Icon type="ios-game-controller-a-outline"></Icon>
          控件每case一览
        </MenuItem>
        <MenuItem name="3">
          <Icon type="ios-game-controller-b"></Icon>
          App一览
        </MenuItem>
        <MenuItem name="4">
          <Icon type="ios-game-controller-b-outline"></Icon>
          App每控件一览
        </MenuItem>
        <MenuItem name="5">
          <Icon type="ios-book"></Icon>
          App测试
        </MenuItem>
        <MenuItem name="6">
          <Icon type="ios-upload"></Icon>
          Excel导出
        </MenuItem>
      </Menu>
      <br>
    </div>
</template>
