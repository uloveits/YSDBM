/**
 * Created by 网线丶 on 2018/8/1.
 */
var models = require('../db');
var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var $sql = require('../sqlMap');
var md5 = require('md5');
var uuid = require('uuid');

//生成token的方法
function  generateToken(data){
  let cert = "user_pass_xxx";//私钥
  let token = jwt.sign(data, cert);
  return token;
}

// 连接数据库
var conn = mysql.createConnection(models.mysql);

conn.connect();

var getNowFormatDate = function() {
  var date = new Date();
  var seperator1 = "-";
  var seperator2 = ":";
  var month = date.getMonth() + 1;
  var strDate = date.getDate();
  var strHour = date.getHours();
  var strMinutes = date.getMinutes();
  var strSeconds = date.getSeconds();
  if (month >= 1 && month <= 9) {
    month = "0" + month;
  }
  if (strDate >= 0 && strDate <= 9) {
    strDate = "0" + strDate;
  }
  if (strMinutes >= 1 && strMinutes <= 9) {
    strMinutes = "0" + strMinutes;
  }
  if (strSeconds >= 0 && strSeconds <= 9) {
    strSeconds = "0" + strSeconds;
  }
  var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
    + " " + date.getHours() + seperator2 + date.getMinutes()
    + seperator2 + date.getSeconds();
  return currentdate;
}

var jsonWrite = function(res, ret) {
  if(typeof ret === 'undefined') {
    res.json({
      code: '1',
      msg: '操作失败'
    });
  } else {
    res.json(ret);

  }
};

//添加员工信息
router.post('/addStaff', (req, res) => {
  var sql = $sql.staff.addStaff;
  var params = req.body;
  console.log(params)
  var currentTime = getNowFormatDate();
  conn.query(sql, [uuid.v1(),params.name,params.sex,params.age,params.phone,params.address,params.toCompany,params.startTime,params.endTime,
                              params.note,params.currUser,currentTime], function(err, result) {
    if (err) {
      console.log(err);
    }
    if (result) {
      jsonWrite(res,result)
    }
  });
});

//通过检索查询员工信息
router.post('/getStaffBySearch', (req, res) => {
  var sql = $sql.staff.getStaffBySearch;
  var params = req.body;
  console.log(params);
  conn.query(sql, [params.name,params.toCompany,params.startTime,params.endTime,params.updateUser,params.isWork], function(err, result) {
    if (err) {
      console.log(err);
    }
    if (result) {
      jsonWrite(res,result)
    }
  });
});

//通过Id获取用户信息
router.post('/getStaffById', (req, res) => {
  var sql = $sql.staff.getStaffById;
  var params = req.body;
  conn.query(sql, [params.id], function(err, result) {
    if (err) {
      console.log(err);
    }
    if (result) {
      jsonWrite(res,result)
    }
  });
});

//编辑用户信息
router.post('/updateStaffById', (req, res) => {
  var sql = $sql.staff.updateStaffById;
  var params = req.body;
  conn.query(sql, [params.endTime,params.note,params.id], function(err, result) {
    if (err) {
      console.log(err);
    }
    if (result) {
      jsonWrite(res,result)
    }
  });
});


module.exports = router;
