## 退出登录功能

打开views/public/header.ejs页面，输入以下代码：

**views/public/header.ejs**

```ejs
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title></title>
  <link rel="stylesheet" href="bootstrap/css/bootstrap.css">
  <link rel="stylesheet" href="css/basic.css">
</head>
<body>
<nav class="navbar navbar-inverse" role="navigation">
    <div class="container-fluid">
        <div class="navbar-header">

            <img src="images/node.jpg" height="44px;" />

        </div>
        <div class="collapse navbar-collapse" id="example-navbar-collapse">
            <ul class="nav navbar-nav">

                <li class="active"><a href="#">商品管理></a>
                </li>
                <li class="active"><a href="#">文章管理</a>
                </li>
                <li class="active"><a href="#">系统设置</a>
                </li>
            </ul>
            <ul class="nav navbar-nav navbar-right">
                <li><a>欢迎您,<%=userinfo.username%></a>
                </li>
                <li><a href="/loginOut">安全退出</a>
                </li>
            </ul>
        </div>
    </div>
</nav>
```

然后在app.js文件中继续添加代码：

```js
app.get('/loginOut',function(req,res){
    //销毁session
    req.session.destroy(function(err){
        if(err){
            console.log(err);
        }else{
            res.redirect('/login');
        }
    })
})
```
