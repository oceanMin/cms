## 路由模块化

首先，改造一下 `app.js`页面，修改如下：

```js

var express=require('express');

//引入模块
var admin =require('./routes/admin.js');

var index =require('./routes/index.js')

var app=new express();  /*实例化*/

//admin
//admin/user

app.use('/',index);

app.use('/admin',admin);

app.listen(3000,'127.0.0.1');
```

新建 `routes/admin.js`文件：

**routes/admin.js**

```js
var express=require('express');

var router = express.Router();   /*可使用 express.Router 类创建模块化、可挂载的路由句柄*/

var login=require('./admin/login.js');
var product=require('./admin/product.js');
var user=require('./admin/user.js');


router.use('/login',login);
router.use('/product',product);
router.use('/user',user);

module.exports = router;
```


新建 `routes/index.js`文件：

**routes/index.js**

```js
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
```

新建 `routes/admin/login.js`文件：

**routes/admin/login.js**

```js
var express=require('express');

var router = express.Router();   /*可使用 express.Router 类创建模块化、可挂载的路由句柄*/

router.get('/',function(req,res){
    res.send('登录页面');

})
//处理登录的业务逻辑
router.post('/doLogin',function(req,res){
    res.send('admin user');

})

module.exports = router;   /*暴露这个 router模块*/
```


新建 `routes/admin/product.js`文件：

**routes/admin/product.js**

```js
var express=require('express');

var router = express.Router();   /*可使用 express.Router 类创建模块化、可挂载的路由句柄*/

router.get('/',function(req,res){
    res.send('显示商品首页');

})
//处理登录的业务逻辑
router.get('/add',function(req,res){
    res.send('显示商品 增加111');

})
router.get('/edit',function(req,res){
    res.send('显示商品 修改');

})
router.get('/delete',function(req,res){
    res.send('显示商品 删除');

})

module.exports = router;   /*暴露这个 router模块*/
```


新建 `routes/admin/user.js`文件：

**routes/admin/user.js**

```js
var express=require('express');

var router = express.Router();   /*可使用 express.Router 类创建模块化、可挂载的路由句柄*/

router.get('/',function(req,res){
    res.send('显示用户首页');
})
//处理登录的业务逻辑
router.get('/add',function(req,res){
    res.send('显示增加用户');
})
module.exports = router;   /*暴露这个 router模块*/
```
