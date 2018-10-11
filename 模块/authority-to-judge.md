## 中间件权限判断
首先要安装一个`express-session`中间件用来保存用户信息

```sh
cnpm install express-session --save-dev
```

在app.js文件中，我们自定义一个中间件用来判断登录状态

```js
//保存用户信息
var session = require("express-session");
//配置中间件  固定格式
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge:1000*60*30
    },
    rolling:true
}))

//自定义中间件  判断登录状态
app.use(function(req,res,next){
    //console.log(req.url);
    //next();
    if(req.url=='/login' || req.url=='/doLogin'){
        next();
    }else{
        if(req.session.userinfo&&req.session.userinfo.username!=''){   /*判断有没有登录*/
            app.locals['userinfo']=req.session.userinfo;   /*配置全局变量  可以在任何模板里面使用*/
            next();
        }else{
            res.redirect('/login')
        }
    }
})
```
