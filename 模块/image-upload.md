## 图片上传

图片上传插件的使用

 1.`sh  npm install multiparty`

 2.`  var multiparty = require('multiparty');`

 3.上传图片的地方

```js
     var form = new multiparty.Form();

     form.uploadDir='upload'   上传图片保存的地址

     form.parse(req, function(err, fields, files) {

       //获取提交的数据以及图片上传成功返回的图片信息

     });
```

 4.html页面form 表单要加入` enctype="multipart/form-data"`

`app.js`修改代码如下：

```js

var multiparty = require('multiparty');  /*图片上传模块  即可以获取form表单的数据 也可以实现上传图片*/

//获取表单提交的数据 以及post过来的图片
app.post('/doProductAdd',function(req,res){

    //获取表单的数据 以及post过来的图片

    var form = new multiparty.Form();

    form.uploadDir='upload'   //上传图片保存的地址     目录必须存在

    form.parse(req, function(err, fields, files) {

        //获取提交的数据以及图片上传成功返回的图片信息
        //
        //console.log(fields);  /*获取表单的数据*/
        //
        //console.log(files);  /*图片上传成功返回的信息*/
        var title=fields.title[0];
        var price=fields.price[0];
        var fee=fields.fee[0];
        var description=fields.description[0];
        var pic=files.pic[0].path;
        //console.log(pic);

        DB.insert('product',{
            title:title,
            price:price,
            fee,
            description,
            pic

        },function(err,data){
            if(!err){
                res.redirect('/product'); /*上传成功跳转到首页*/
            }
        })
    });
})

app.get('/productedit',function(req,res){

    //获取get传值 id

    var id=req.query.id;

    console.log(id);

    //去数据库查询这个id对应的数据     自增长的id 要用{"_id":new DB.ObjectID(id)

    DB.find('product',{"_id":new DB.ObjectID(id)},function(err,data){

        //console.log(data);

        res.render('productedit',{
            list:data[0]
        });
    });
})
```

新增商品页面如下：

**views/productadd.ejs**

```ejs
<%- include public/header.ejs%>

<div class="container-fluid">
    <div class="row">
        <div class="col-sm-2">
            <%- include public/aslideleft.ejs%>
        </div>
        <div class="col-sm-10">
            <ol class="breadcrumb">
                <li class="active">商品管理
                </li>
                <li class="active">商品列表
                </li>
            </ol>
            <div class="panel panel-default">
			    <div class="panel-heading">
                  增加商品
                </div>
                <div class="panel-body">
                    <div class="table-responsive input-form">
                        <form action="/doProductAdd" method="post" enctype="multipart/form-data">
                            <ul>
                                <li>  商品名称: <input type="text" name="title"/></li>
                                <li>  商品图片: <input type="file" name="pic"/></li>
                                <li>  商品价格: <input type="text" name="price"/></li>
                                <li>  商品邮费: <input type="text" name="fee"/></li>
                                <li>
                                    商品描述:
                                    <textarea name="description" id="" cols="60" rows="8"></textarea>
                                </li>
                                <li>
                                    <br/>
                                    <button type="submit" class="btn btn-default">提交</button>
                                </li>
                            </ul>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
</body>
</html>
```

编辑商品页面如下：

**views/productedit.ejs**

```ejs
<%- include public/header.ejs%>

<div class="container-fluid">
    <div class="row">
        <div class="col-sm-2">
            <%- include public/aslideleft.ejs%>         
        </div>
        <div class="col-sm-10">
            <ol class="breadcrumb">
                <li class="active">商品管理
                </li>
                <li class="active">商品列表
                </li>
            </ol>
            <div class="panel panel-default">
              
			    <div class="panel-heading">
                  编辑商品
                </div>
                <div class="panel-body">
                    <div class="table-responsive input-form">
                        <form action="/doAdd" method="post">
                            <ul>
                                <li>  商品名称: <input type="text" name="title" value="<%=list.title%>"/></li>

                                <li>  商品图片: <input type="file" name="pic"/>
                                    <br/> <br/>
                                   　　　　 <img src="<%=list.pic%>" width="100"/>
                                    <br/> <br/>
                                </li>
                                <li>  商品价格: <input type="text" name="price" value="<%=list.price%>"/></li>
                                <li>  商品邮费: <input type="text" name="fee"  value="<%=list.fee%>"/></li>
                                <li>
                                    商品描述:
                                    <textarea name="description" id="" cols="60" rows="8"><%=list.description%></textarea>
                                </li>
                                <li>
                                    <br/>
                                    <button type="submit" class="btn btn-default">提交</button>
                                </li>
                            </ul>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
</body>
</html>
```

点击[http://localhost:3000/admin/product/add](http://localhost:3000/admin/product/add)浏览效果。
