var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/*
1. 获取请求参数数据
2. 处理数据
3. 返回响应
 */
router.post('/register', function (req, res) {
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
})

module.exports = router;
