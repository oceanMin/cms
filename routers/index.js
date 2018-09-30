var express = require('express');

var router = express.Router();/*可使用 express.Router 类创建模块化、可挂载的路由句柄*/

//数据库操作
var DB = require('../modules/db.js');

router.get('/',function(req,res){
    res.send('index');
})

router.get('/product',function(req,res){
    res.send('product页面');
})

module.exports = router;