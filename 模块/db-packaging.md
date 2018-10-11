## DB数据库的封装

完善DB数据库封装。新建 `modules/db.js` ，添加如下代码：

**modules/db.js**

```js
var MongoClient = require('mongodb').MongoClient;
 var DbUrl = 'mongodb://127.0.0.1:27017/productmanage'; //连接数据库

 var ObjectID = require('mongodb').ObjectID;

 function __connectDb(callback){

     MongoClient.connect(DbUrl, function(err,db){

         if(err){
             console.log(err);
             console.log('数据库连接失败');
             return;
         }
        callback(db);
     })
 }

 //暴露ObjectID
exports.ObjectID = ObjectID;

 /**
  * collectionname: 表名
  * json：查询条件
  * callback： 返回查询的数据
  */
//  查询数据
 exports.find = function(collectionname,json,callback){
     __connectDb(function(db){
         var result = db.collection(collectionname).find(json);

         result.toArray(function(error, data){
             db.close();    /**关闭数据库连接 */
             callback(error, data); /**拿到数据，执行回调函数 */
         })
     })
 }

//  新增数据
 exports.insert = function(collectionname,json,callback){
     __connectDb(function(db){
         db.collection(collectionname).insertOne(json,function(error,data){
             callback(error,data);
         })
     })
 }

//  修改数据
exports.update = function(collectionname,json1,json2,callback){
    __connectDb(function(db){
        db.collection(collectionname).updateOne(json1,{$set:json2},function(error,data){
            callback(error,data);
        })
    })
}

//  删除数据
exports.delete = function(collectionname,json,callback){
    __connectDb(function(db){
        db.collection(collectionname).deleteOne(json,function(error,data){
            callback(error,data);
        })
    })
}
```

然后在`app.js`文件中引入db.js文件

```js
//数据库操作
var DB=require('./modules/db.js');
//获取登录提交的数据
app.post('/doLogin',function(req,res){
    var username=req.body.username;
    var password=md5(req.body.password);  /*要对用户输入的密码加密*/

    //1.获取数据
    //2.连接数据库查询数据
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

//商品列表
app.get('/product',function(req,res){
    DB.find('product',{},function(err,data){
        res.render('product',{
            list:data
        });
    })
})
```

到这里可以发现代码已经简洁许多，后面我们将会继续优化。
