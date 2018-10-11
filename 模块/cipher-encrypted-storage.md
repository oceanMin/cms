## 密码加密存储

这里我们用到的是`md5`加密，用法很简单，还是一样 先安装依赖：

```sh
cnpm install md5-node --save-dev
```

### 用法  

在`app.js`文件中引入：

```js
var md5=require('md5-node'); /*md5加密*/

//获取登录提交的数据
app.post('/doLogin',function(req,res){
    var username=req.body.username;
    var password=md5(req.body.password);  /*要对用户输入的密码加密*/

    //1.获取数据
    //2.连接数据库查询数据
    MongoClient.connect(DbUrl,function(err,db){
        if(err){
            console.log(err);
            return;
        }
        //查询数据  {"username":req.body.username,"password":req.body.password}
        var result=db.collection('user').find({
            username:username,
            password:password
        });

        //另一种遍历数据的方法
        result.toArray(function(err,data){
            if(data.length>0){
                console.log('登录成功');
                //保存用户信息
                req.session.userinfo=data[0];

                res.redirect('/product');  /*登录成功跳转到商品列表*/

            }else{
                //console.log('登录失败');
                res.send("<script>alert('登录失败');location.href='/login'</script>");
            }
            db.close();
        })

    })

})

```

>注意：在使用md5加密登录系统时，要确保数据库中保存的密码是加密的，否则会因密码不一致而登录不上。
