const express = require('express')
const app = new express()

const md5 = require('md5-node') /**md5加密 */

const multiparty = require('multiparty');/*图片上传模块  即可以获取form表单的数据 也可以实现上传图片*/

const fs = require('fs');
//获取post
// var bodyParser = require('body-parser')
//设置body-parser中间件
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json());

//数据库操作
var DB = require('./modules/db.js');

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



//使用ejs模板引擎，默认找views这个目录
app.set('view engine','ejs');

//配置public目录为我们的静态资源目录
app.use(express.static('public'));

//配置虚拟目录
app.use('/upload',express.static('upload'));

app.get('/',function(req,res){
    res.send('index');
})

//自定义中间件，判断登录状态
// app.use(function(req,res,next){
//     if(req.url === '/login' || req.url === '/doLogin'){ /**判断有没有登录 */
//         next();
//     }else{
//         if(req.session.userinfo&&req.session.userinfo.username !== ''){
//             app.locals['userinfo'] = req.session.userinfo;  /**配置全局变量，可以在任何模板中使用 */
//             next();
//         }else{
//             res.redirect('/login')
//         }
//     }
// })

//登录
app.get('/login', function(req,res){
    res.render('login');
})

app.post('/doLogin', function(req,res){
    // console.log(req.body)   /**获取post提交的数据 */

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

            res.redirect('/product');  /*登录成功跳转到商品列表*/

        }else{
            //console.log('登录失败');
            res.send("<script>alert('登录失败');location.href='/login'</script>");
        }
    })
    
})


// 商品列表
app.get('/product', function(req,res){
    DB.find('product',{},function(err,data){
        res.render('product',{
            list: data
        });
    })
})

// 添加商品
app.get('/productadd', function(req,res){
    res.render('productadd');
})

//获取表单提交的数据 以及post过来的图片
app.post('/doProductAdd',function(req,res){
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
                res.redirect('/product');   //上传成功跳转到列表页
            }
        })
    })
})

// 编辑商品
app.get('/productedit', function(req,res){
    //获取get传值 id
    var id = req.query.id;

    // console.log(id);
    DB.find('product',{"_id":new DB.ObjectID(id)},function(error,data){

        console.log(data);
        res.render('productedit',{
            list: data[0]
        });        
    })    
})

//执行修改的路由
app.post('/doProductEdit',function(req,res){
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
                res.redirect('/product');
            }
        })
    })
})



// 删除商品
app.get('/productdelete', function(req,res){
    var id = req.query.id;

    DB.delete('product',{"_id": new DB.ObjectID(id)},function(error,data){
        if(!error){
            res.redirect('/product');
        }
    })

})


// 退出登录
app.get('/loginOut', function(req,res){

    req.session.destroy(function(err){
        if(err){
            console.log(err);
        }else{
            res.redirect('/login');
        }
    })
})




app.listen(3000,()=>{
    console.log('Server run starts at port 3000');
})