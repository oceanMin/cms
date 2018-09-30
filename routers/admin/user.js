var express = require('express');

var router = express.Router();
var DB = require('../../modules/db.js');

router.get('/',function(req,res){
    //res.send('显示用户首页');
    DB.find('user',{},function(err,data){
        res.render('admin/user/index',{
            list:data
        });
    })
})

router.get('/add',function(req,res){
    res.send('显示增加用户');
})

module.exports = router;