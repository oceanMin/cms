var express = require('express');

var app = new express();    /**实例化 */

//保存用户信息
var session = require('express-session');
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 1000*60*30
    },
    rolling: true
}))

// 引入模块
var admin = require('./routers/admin.js');
var index = require('./routers/index.js');

//使用ejs模板引擎，默认找views这个目录
app.set('view engine','ejs');

//配置public目录为我们的静态资源目录
app.use(express.static('public'));
//配置虚拟目录
app.use('/upload',express.static('upload'));


app.use('/',index);

app.use('/admin',admin);

app.listen(3000,'127.0.0.1');