/**
 * Created by 网线丶 on 2018/6/23.
 */
var models = require('../db');
var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var $sql = require('../sqlMap');
var jwt = require('jsonwebtoken');
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

//登陆验证
router.post('/getUserInfoByLogin', (req, res) => {
    var sql = $sql.user.getUserInfoByLogin;
    var params = req.body;
    console.log(md5(params.password))
    conn.query(sql, [params.loginName,md5(params.password)], function(err, result) {

        if (err) {
            console.log(err);
        }
        if (result) {
          var token = null;
          if(result.length > 0){
             token  = jwt.sign({
              userName:result[0].userName,
              companyName:result[0].name,
              id:result[0].id,
              role:result[0].role,
            }, 'user_pass_xxx');
          }
          console.log(token);
          res.json({
            token:token
          });

        }
    });
});
//添加公司名称
router.post('/addCompany', (req, res) => {
  var sql = $sql.user.addCompany;
  var params = req.body;
  console.log(params)
  conn.query(sql, [uuid.v1(),params.name], function(err, result) {
    if (err) {
      console.log(err);
    }
    if (result) {
      jsonWrite(res,result)
    }
  });
});
//获取公司信息
router.post('/getCompany', (req, res) => {
  var sql = $sql.user.getCompany;
  conn.query(sql, [], function(err, result) {
    if (err) {
      console.log(err);
    }
    if (result) {
      jsonWrite(res,result)
    }
  });
});

//添加用户信息
router.post('/addUser', (req, res) => {
  var sql = $sql.user.addUser;
  var params = req.body;
  console.log(params)
  var role = (params.role == "admin") ? 0 : 1 ;
  var time = getNowFormatDate();
  conn.query(sql, [uuid.v1(),params.companyId,params.loginName,params.userName,md5(params.password),role,time], function(err, result) {
    if (err) {
      console.log(err);
    }
    if (result) {
      jsonWrite(res,result)
    }
  });
});

//查询所有用户信息
router.post('/getUserInfo', (req, res) => {
  var sql = $sql.user.getUserInfo;
  conn.query(sql, [], function(err, result) {
    if (err) {
      console.log(err);
    }
    if (result) {
      jsonWrite(res,result)
    }
  });
});

//通过Id查找用户信息
router.post('/getUserInfoById', (req, res) => {
  var sql = $sql.user.getUserInfoById;
  var params = req.body;
  conn.query(sql, [params.id,md5(params.password)], function(err, result) {
    if (err) {
      console.log(err);
    }
    if (result) {
      jsonWrite(res,result)
    }
  });
});

//删除用户信息
router.post('/deleteUser', (req, res) => {
  var sql = $sql.user.deleteUser;
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

//修改密码
router.post('/updatePassword', (req, res) => {
  var sql = $sql.user.updatePassword;
  var params = req.body;
  conn.query(sql, [md5(params.pswd),params.id], function(err, result) {
    if (err) {
      console.log(err);
    }
    if (result) {
      jsonWrite(res,result)
    }
  });
});

module.exports = router;
