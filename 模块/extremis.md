## 商品管理系统模块化改造

入口文件改造;

**app.js**

```js
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
```

修改 `routes/admin.js`文件：

**routes/admin.js**

```js
var express = require('express');

var router = express.Router();/*可使用 express.Router 类创建模块化、可挂载的路由句柄*/

var login = require('./admin/login.js');
var product = require('./admin/product.js');
var user = require('./admin/user.js');

//自定义中间件，判断登录状态
router.use(function(req,res,next){
    if(req.url === '/login' || req.url === '/login/doLogin'){ /**判断有没有登录 */
        next();
    }else{
        if(req.session.userinfo&&req.session.userinfo.username !== ''){
            req.app.locals['userinfo'] = req.session.userinfo;  /**配置全局变量，可以在任何模板中使用 */
            next();
        }else{
            res.redirect('/admin/login')
        }
    }
})

router.use('/login',login);
router.use('/product',product);
router.use('/user',user);

module.exports = router;
```

修改 `routes/admin/login.js`文件：

**routes/admin/login.js**

```js
var express = require('express');
var router = express.Router();

var bodyParser = require('body-parser');
var md5=require('md5-node'); /*md5加密*/

var DB = require('../../modules/db.js');

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

router.get('/',function(req,res){
    res.render('admin/login');
})

// 处理登录的业务逻辑
router.post('/doLogin',function(req,res){
    var username = req.body.username;
    var password = md5(req.body.password); /*要对用户输入的密码加密*/
    /**
     * 1.获取数据
     * 2.连接数据库查询数据
     */
    
     DB.find('user',{
        username:username,
        password:password
    },function(err,data){
        if(data.length>0){
            console.log('登录成功');
            //保存用户信息
            req.session.userinfo=data[0];

            res.redirect('/admin/product');  /*登录成功跳转到商品列表*/

        }else{
            //console.log('登录失败');
            res.send("<script>alert('登录失败');location.href='/login'</script>");
        }
    })
})


router.get('/loginOut',function(req,res){
    //销毁session
    req.session.destroy(function(err){

        if(err){
            console.log(err);
        }else{
            res.redirect('/admin/login');
        }
    })
})

module.exports = router;
```


修改 `routes/admin/product.js`文件：

**routes/admin/product.js**

```js
var express = require('express');

var router = express.Router();

const multiparty = require('multiparty');/*图片上传模块  即可以获取form表单的数据 也可以实现上传图片*/

var DB = require('../../modules/db.js');

var fs = require('fs');

router.get('/',function(req,res){
    DB.find('product',{},function(err,data){
        // console.log(data);
        res.render('admin/product/index',{
            list: data
        });
    })
})

//新增商品
router.get('/add',function(req,res){
    // res.send('新增商品');
    res.render('admin/product/add');
})

//获取表单提交的数据 以及post过来的图片
router.post('/doAdd',function(req,res){
    //获取表单的数据 以及post传过来的图片
    var form = new multiparty.Form();
    // console.log(222,form);

    form.uploadDir = 'upload';  //上传图片保存的地址  目录必须存在

    form.parse(req, function(err,fields,files){
        //获取提交的数据以及图片上传成功返回的图片信息
        
        // console.log(fields);  /*获取表单的数据*/
        // console.log(files);  /*图片上传成功返回的信息*/
        
        var title = fields.title[0];
        var pic = files.pic[0].path;
        var price = fields.price[0];
        var fee = fields.fee[0];
        var description = fields.description[0];

        DB.insert('product',{
            title: title,
            price: price,
            pic,
            fee,
            description
        },function(error,data){
            if(!error){
                res.redirect('/admin/product');   //上传成功跳转到列表页
            }
        })
    })
})

// 修改商品
router.get('/edit',function(req,res){
    //获取get传值 id
    var id = req.query.id;
    DB.find('product',{"_id":new DB.ObjectID(id)},function(error,data){

        // console.log(data);
        res.render('admin/product/edit',{
            list: data[0]
        });        
    })  
})

//执行修改的路由
router.post('/doEdit',function(req,res){
    var form = new multiparty.Form();
    form.uploadDir = 'upload';  //上传图片保存的地址

    form.parse(req,function(err,fields,files){
        // console.log('111111111',files.pic[0]);

        var _id = fields._id[0];
        var title = fields.title[0];
        var price = fields.price[0];
        var fee = fields.fee[0];
        var description = fields.description[0];
        
        var originalFilename = files.pic[0].originalFilename;  //修改了图片
        var pic = files.pic[0].path;

        if(originalFilename){
            var setData={
                title,
                price,
                fee,
                description,
                pic
            };
        }else{
            var setData={
                title,
                price,
                fee,
                description,
            };
            fs.unlink(pic); //删除生成的临时文件
        }
        DB.update('product',{"_id":new DB.ObjectID(_id)},setData,function(err,data){
            if(!err){
                res.redirect('/admin/product');
            }
        })
    })
})


// 删除商品
router.get('/delete',function(req,res){
    // res.send('删除商品');
    //获取get传值 id
    var id = req.query.id;
    DB.delete('product',{"_id":new DB.ObjectID(id)},function(error,data){
        if(!error){
            res.redirect('/admin/product');
        }        
    }) 
})

module.exports = router;
```


修改 `routes/admin/user.js`文件：

**routes/admin/user.js**

```js
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
```

最终代码点击下载 [https://github.com/minjihao/cms.git](https://github.com/minjihao/cms.git)
