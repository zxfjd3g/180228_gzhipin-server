var express = require('express');
var router = express.Router();
const UserModel = require('../db/models').UserModel
const md5 = require('blueimp-md5')
const filter = {password: 0, __v: 0}

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/*
1. 获取请求参数数据
2. 处理数据
3. 返回响应
 */
/*router.post('/register', function (req, res) {
  // 1. 获取请求参数数据
  const {username, password} = req.body
  // 2. 处理数据
  let result
  if(username==='admin') {
    result = {code: 1, msg: '此用户已存在!'}
  } else {
    result = {code: 0, data: {id: '123abc', username, password}}
  }
  // 3. 返回响应
  res.send(result)
})*/


// 注册的路由
router.post('/register', function (req, res) {
  // 获取请求参数
  const {username, password, type} = req.body
  // 处理(查询-->保存)
  UserModel.findOne({username}, function (error, user) {
    // 已存在, 注册失败
    if(user) {
      // 返回响应(失败)
      res.send({code: 1, msg: '此用户已存在!'})
    } else {// 不存在, 去保存
      new UserModel({username, password: md5(password), type}).save(function (error, user) {

        const userid = user._id
        // 将userid保存到cookie中
        res.cookie('userid', userid, {maxAge: 1000*60*60*24*7})
        // 返回响应(成功)
        res.send({code: 0, data: {_id: userid, username, type}})
      })
    }
  })



})

// 登陆的路由
router.post('/login', function (req, res) {
  const {username, password} = req.body

  // 根据用户名和密码查询对应的user
  UserModel.findOne({username, password: md5(password)}, filter, function (error, user) {
    if(user) { // 成功
      // 将userid保存到cookie中
      res.cookie('userid', user._id, {maxAge: 1000*60*60*24*7})
      res.send({code: 0, data: user})
    } else { // 失败
      res.send({code: 1, msg: '用户名或密码错误!'})
    }
  })

})

module.exports = router;
